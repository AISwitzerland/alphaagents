import { DocumentType } from '@/types/document';
import config from '@/config';
import { fileToBase64 } from '@/services/documentProcessingService';
import OpenAI from 'openai';
import { isPdf, convertBase64PdfToBase64Image } from '@/services/pdfService';

// OpenAI Client für die Vision API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Erkennt den Dokumenttyp basierend auf dem Dateinamen
 * 
 * @param file Die Datei, deren Typ erkannt werden soll
 * @returns Der erkannte Dokumenttyp
 */
export function detectDocumentType(file: File): string {
  const fileName = file.name.toLowerCase();
  
  if (fileName.includes('unfall') || fileName.includes('accident')) {
    return 'unfall';
  } else if (fileName.includes('schaden') || fileName.includes('damage')) {
    return 'schaden';
  } else if (fileName.includes('vertrag') || fileName.includes('contract')) {
    return 'vertragsänderung';
  } else if (fileName.includes('rechnung') || fileName.includes('invoice')) {
    return 'rechnung';
  }
  
  return 'misc';
}

/**
 * Erkennt den Dokumenttyp mit Hilfe von KI (Vision API)
 * Unterstützt sowohl Bilder als auch PDFs durch Konvertierung
 * 
 * @param base64Image Base64-kodiertes Bild oder PDF des Dokuments
 * @param fileName Originaldateiname (für Logging)
 * @param mimeType MIME-Typ der Datei
 * @returns Erkannter Dokumenttyp und Konfidenz
 */
export const detectDocumentTypeWithAI = async (
  base64Image: string,
  fileName: string,
  mimeType: string
): Promise<{ 
  detectedType: string, 
  confidence: number,
  wasConverted?: boolean
}> => {
  try {
    console.log(`KI-Dokumenttyperkennung gestartet für: ${fileName} (${mimeType})`);
    
    // Verarbeite PDFs speziell, indem sie in Bilder umgewandelt werden
    let imageToProcess = base64Image;
    let isConvertedPdf = false;
    
    if (isPdf(mimeType) && config.features.documentDetection.pdfConversion.enabled) {
      console.log(`Dokument ist ein PDF, konvertiere zu Bild für KI-Analyse: ${fileName}`);
      try {
        imageToProcess = await convertBase64PdfToBase64Image(base64Image, fileName);
        isConvertedPdf = true;
        console.log(`PDF wurde erfolgreich zu Bild konvertiert: ${fileName}`);
      } catch (error) {
        console.error('Fehler bei der PDF-zu-Bild-Konvertierung:', error);
        
        // Auf Original-PDF zurückgreifen, wenn konfiguriert
        if (config.features.documentDetection.pdfConversion.fallbackToOriginal) {
          console.log('Verwende Original-PDF für KI-Analyse (kann zu schlechteren Ergebnissen führen)');
        } else {
          // Wenn nicht auf Original zurückgegriffen werden soll, Fehler weiterleiten
          throw new Error('PDF konnte nicht konvertiert werden und fallbackToOriginal ist deaktiviert');
        }
      }
    }
    
    // Zeitlimit für die Anfrage
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout bei KI-Erkennung')), config.features.documentDetection.timeout);
    });
    
    // OpenAI-Anfrage
    const aiPromise = openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        { 
          role: 'system', 
          content: `Du bist ein Dokumentanalysesystem für Versicherungsunterlagen. Analysiere das folgende Dokument und bestimme den Typ.
          Wähle einen der folgenden Typen:
          - unfall: Unfallbericht oder Unfallmeldung
          - schaden: Schadensmeldung oder Schadensbericht
          - vertragsänderung: Versicherungsvertrag, Police oder Vertragsänderung
          - rechnung: Rechnung oder Zahlungsaufforderung
          - misc: Anderer Dokumenttyp
          
          Gib deine Antwort im folgenden JSON-Format zurück:
          {
            "type": "der_erkannte_typ",
            "confidence": 0.XX (Wert zwischen 0 und 1 für deine Sicherheit),
            "reasoning": "Eine kurze Begründung für deine Entscheidung"
          }`
        },
        { 
          role: 'user', 
          content: [
            { 
              type: 'text', 
              text: `Bestimme den Typ dieses Versicherungsdokuments:${isConvertedPdf ? ' (Hinweis: Dies ist ein konvertiertes PDF)' : ''}`
            },
            { 
              type: 'image_url', 
              image_url: { 
                url: `data:${isConvertedPdf ? 'image/png' : mimeType};base64,${imageToProcess}`,
                detail: "high"
              } 
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });
    
    // Race zwischen Timeout und API-Anfrage
    const response = await Promise.race([aiPromise, timeoutPromise]) as any;
    
    // Parse JSON-Antwort
    const resultContent = response.choices[0].message.content;
    console.log('KI-Antwort erhalten:', resultContent);
    
    let result;
    try {
      result = JSON.parse(resultContent);
    } catch (error) {
      console.error('Fehler beim Parsen der KI-Antwort:', resultContent);
      throw new Error('Ungültiges JSON-Format in der KI-Antwort');
    }
    
    console.log('KI-Dokumenttyperkennung erfolgreich:', {
      type: result.type,
      confidence: result.confidence,
      reasoning: result.reasoning,
      isPdf: isPdf(mimeType),
      wasConverted: isConvertedPdf
    });
    
    return {
      detectedType: result.type,
      confidence: result.confidence,
      wasConverted: isConvertedPdf
    };
  } catch (error) {
    // Bei Fehler: Logging und leeres Ergebnis zurückgeben
    console.error('Fehler bei der KI-basierten Dokumenttyperkennung:', error);
    if (error instanceof Error) {
      console.error(`Fehlertyp: ${error.name}, Nachricht: ${error.message}, Stack: ${error.stack}`);
    }
    return {
      detectedType: 'error',
      confidence: 0
    };
  }
};

/**
 * Vergleicht und protokolliert die Klassifizierungsergebnisse verschiedener Methoden
 * 
 * @param filenameType Der basierend auf dem Dateinamen erkannte Dokumenttyp
 * @param aiType Der durch KI erkannte Dokumenttyp
 * @param aiConfidence Die Konfidenz der KI-Erkennung
 * @param isPdf Ob das Dokument ein PDF ist
 * @param fileName Der Name der Datei (für Logging)
 * @param wasPdfConverted Ob das PDF konvertiert wurde (wenn zutreffend)
 */
export function logClassificationComparison(
  filenameType: string,
  aiType: string,
  aiConfidence: number,
  isPdf: boolean,
  fileName: string,
  wasPdfConverted?: boolean
): void {
  // Nur protokollieren, wenn die entsprechende Einstellung aktiviert ist
  if (!config.logging.classificationComparison?.enabled) {
    return;
  }
  
  // Prüfen, ob der Vergleich von beiden Methoden konfiguriert ist (für PDFs)
  if (isPdf && !config.features.documentDetection.pdfConversion.compareBothMethods) {
    return;
  }
  
  // Erstelle einen eindeutigen Identifikator für den Vergleich
  const comparisonId = `compare_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  // Bestimme, ob die Klassifizierungen übereinstimmen
  const match = filenameType === aiType;
  
  // Stelle Konfidenz und Übereinstimmung menschenlesbar dar
  const confidenceStr = (aiConfidence * 100).toFixed(1) + '%';
  const matchIndicator = match ? '✓ übereinstimmend' : '✗ abweichend';
  
  // Erstelle eine detaillierte visuelle Darstellung für das Logging
  const logData = {
    comparisonId,
    fileName,
    filenameType,
    aiType,
    aiConfidence: confidenceStr,
    match,
    matchIndicator,
    documentFormat: isPdf ? 'PDF' : 'Bild',
    pdfWasConverted: isPdf ? (wasPdfConverted ? 'Ja' : 'Nein (Direktanalyse)') : 'N/A',
    timestamp: new Date().toISOString()
  };
  
  // Erstelle visuelles Log-Format für bessere Lesbarkeit
  console.log('╔═════════════════════════════════════════════════════');
  console.log(`║ 📊 DOKUMENTTYP-KLASSIFIZIERUNG VERGLEICH [${comparisonId}]`);
  console.log('╠═════════════════════════════════════════════════════');
  console.log(`║ 📄 Datei: ${fileName}`);
  console.log(`║ 🔍 Format: ${logData.documentFormat}${isPdf ? ` (${logData.pdfWasConverted})` : ''}`);
  console.log('╠═════════════════════════════════════════════════════');
  console.log(`║ 📝 Dateiname-basiert: "${filenameType}"`);
  console.log(`║ 🤖 KI-basiert: "${aiType}" (Konfidenz: ${confidenceStr})`);
  console.log(`║ 🎯 Ergebnis: ${matchIndicator}`);
  console.log('╚═════════════════════════════════════════════════════');
  
  // Wenn Ergebnisspeicherung konfiguriert ist, hier implementieren
  if (config.logging.classificationComparison.storeResults) {
    // TODO: Speichern der Ergebnisse in Datenbank oder Monitoring-System
    // Das wäre ein zukünftiges Feature für detaillierte Analyse
    console.log('Hinweis: Ergebnisspeicherung ist aktiviert, aber noch nicht implementiert.');
  }
  
  // Wenn eine signifikante Diskrepanz vorliegt, könnten wir das speziell kennzeichnen
  if (!match && aiConfidence > 0.8) {
    console.warn(`⚠️ Hohe KI-Konfidenz (${confidenceStr}), aber widersprüchliches Ergebnis zum Dateinamen!`);
  }
}

/**
 * Erweiterte Dokumenttyperkennung, die sowohl dateinamen- als auch KI-basierte Methoden verwendet
 * 
 * @param file Die Datei, deren Typ erkannt werden soll
 * @param base64ImageOpt Optionales bereits konvertiertes Base64-Bild
 * @returns Erkannter Dokumenttyp, Konfidenz und Quelle der Erkennung
 */
export const enhancedDocumentTypeDetection = async (
  file: File | Blob,
  base64ImageOpt?: string
): Promise<{
  documentType: string,
  confidence: number,
  source: 'filename' | 'ai' | 'hybrid' | 'fallback'
}> => {
  // 1. Dateinamenbasierte Erkennung (schnell)
  const filenameType = (file as File).name 
    ? detectDocumentType(file as File) 
    : 'misc';
    
  console.log(`Dateinamenbasierte Dokumenttyperkennung: ${filenameType}`);
    
  // Wenn KI-Erkennung deaktiviert ist, sofort zurückgeben
  if (!config.features.documentDetection.useAI) {
    console.log('KI-Dokumenttyperkennung ist deaktiviert, verwende nur Dateinamenanalyse');
    return { 
      documentType: filenameType, 
      confidence: 0.5,  // Mittlere Konfidenz für dateinamenbasierte Erkennung
      source: 'filename' 
    };
  }
  
  try {
    // 2. KI-basierte Erkennung
    // Base64 nur einmal berechnen, wenn nicht bereits übergeben
    const base64Image = base64ImageOpt || await fileToBase64(file);
    
    const fileName = (file as File).name || 'unknown';
    const mimeType = file.type;
    const isPdfDocument = isPdf(mimeType);
    
    // Starte KI-Erkennung
    const aiResult = await detectDocumentTypeWithAI(
      base64Image, 
      fileName,
      mimeType
    );
    
    // Erfasse, ob die PDF-Konvertierung verwendet wurde (wenn es ein PDF ist)
    const wasPdfConverted = isPdfDocument && !!aiResult.wasConverted;
    
    // Protokolliere Vergleich zwischen beiden Klassifizierungsmethoden
    logClassificationComparison(
      filenameType,
      aiResult.detectedType,
      aiResult.confidence,
      isPdfDocument,
      fileName,
      wasPdfConverted
    );
    
    // Bei Erkennungsfehler Fallback verwenden
    if (aiResult.detectedType === 'error') {
      console.log('KI-Dokumenttyperkennung fehlgeschlagen, verwende Dateinamenanalyse als Fallback');
      return { 
        documentType: filenameType, 
        confidence: 0.5,
        source: 'fallback' 
      };
    }
    
    // 3. Entscheidungslogik
    const aiType = aiResult.detectedType;
    const aiConfidence = aiResult.confidence;
    
    console.log('Vergleiche Erkennungsmethoden:', {
      filenameType,
      aiType,
      aiConfidence
    });
    
    // Bei hoher KI-Konfidenz: KI-Ergebnis verwenden
    if (aiConfidence >= config.features.documentDetection.highConfidenceThreshold) {
      console.log(`Verwende KI-Erkennung aufgrund hoher Konfidenz (${aiConfidence})`);
      return { 
        documentType: aiType, 
        confidence: aiConfidence,
        source: 'ai' 
      };
    }
    
    // Bei niedriger KI-Konfidenz: Dateinamenerkennung verwenden
    if (aiConfidence < config.features.documentDetection.lowConfidenceThreshold) {
      console.log(`Verwende Dateinamenanalyse aufgrund niedriger KI-Konfidenz (${aiConfidence})`);
      return { 
        documentType: filenameType, 
        confidence: 0.5, // Standard-Konfidenz für Dateinamenerkennung
        source: 'filename' 
      };
    }
    
    // Bei mittlerer Konfidenz: Hybride Entscheidungslogik
    if (filenameType === aiType) {
      // Übereinstimmung erhöht die Konfidenz
      console.log('Beide Erkennungsmethoden stimmen überein, verwende gemeinsamen Typ mit erhöhter Konfidenz');
      return { 
        documentType: aiType, 
        confidence: Math.min(aiConfidence + 0.2, 1.0),
        source: 'hybrid' 
      };
    } else {
      // Prioritätsbasierte Entscheidung
      if (aiType !== 'misc' && filenameType === 'misc') {
        console.log('KI-Erkennung hat spezifischeren Typ gefunden, verwende KI-Ergebnis');
        return { 
          documentType: aiType, 
          confidence: aiConfidence,
          source: 'hybrid' 
        };
      } else if (aiType === 'misc' && filenameType !== 'misc') {
        console.log('Dateinamenanalyse hat spezifischeren Typ gefunden, verwende Dateinamen-Ergebnis');
        return { 
          documentType: filenameType, 
          confidence: 0.6,
          source: 'hybrid' 
        };
      } else {
        // Bei Konflikten ohne klare Priorität: KI-Ergebnis bevorzugen, wenn über Schwellenwert
        const useAI = aiConfidence > 0.65;
        console.log(`Bei Konflikt ${useAI ? 'bevorzuge KI-Erkennung' : 'bevorzuge Dateinamenanalyse'}`);
        return { 
          documentType: useAI ? aiType : filenameType, 
          confidence: useAI ? aiConfidence : 0.5,
          source: 'hybrid' 
        };
      }
    }
  } catch (error) {
    // Bei Fehler: Logging und dateinamenbasierte Erkennung zurückgeben
    console.error('Fehler bei der KI-basierten Dokumenttyperkennung:', error);
    if (error instanceof Error) {
      console.error(`Fehlertyp: ${error.name}, Nachricht: ${error.message}, Stack: ${error.stack}`);
    }
    
    return { 
      documentType: filenameType, 
      confidence: 0.5,
      source: 'fallback' 
    };
  }
}; 