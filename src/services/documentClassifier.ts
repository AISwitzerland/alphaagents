import logger from '../utils/logger';

/**
 * Dokumententypen für die Klassifikation
 */
export enum DocumentType {
  INVOICE = 'invoice',
  CONTRACT = 'contract',
  ID_DOCUMENT = 'id_document',
  CERTIFICATE = 'certificate',
  LETTER = 'letter',
  OTHER = 'other'
}

/**
 * Interface für die Eingabe des Klassifikationsagenten
 */
interface ClassificationInput {
  text: string;
  filename?: string;
  metadata?: Record<string, any>;
}

/**
 * Interface für die Ausgabe des Klassifikationsagenten
 */
interface ClassificationResult {
  documentType: DocumentType;
  confidence: number;
  detectedLanguage?: string;
  metadata?: Record<string, any>;
}

/**
 * Agent für die Dokumentenklassifikation
 */
export class DocumentClassificationAgent {
  constructor() {
    logger.info('Initializing Document Classification Agent');
  }

  /**
   * Klassifiziert ein Dokument basierend auf dessen Text und Metadaten
   */
  public async classifyDocument(input: ClassificationInput): Promise<ClassificationResult> {
    try {
      logger.info('Starting document classification');
      
      // Simuliere eine Verarbeitungszeit
      await this.simulateProcessingDelay(500);
      
      // Extrahiere Text für die Analyse
      const text = input.text.toLowerCase();
      
      // Einfache schlüsselwortbasierte Klassifikation
      const typeKeywords = this.getKeywords();
      const scores = new Map<DocumentType, number>();
      
      // Initialisiere alle Typen mit einem Basiswert
      Object.values(DocumentType).forEach(type => {
        scores.set(type as DocumentType, 0.1);
      });
      
      // Durchsuche nach Schlüsselwörtern und erhöhe die Bewertung
      for (const [docType, keywords] of Object.entries(typeKeywords)) {
        let score = scores.get(docType as DocumentType) || 0;
        
        for (const keyword of keywords) {
          const regex = new RegExp(keyword, 'i');
          if (regex.test(text)) {
            score += 0.15; // Erhöhe die Bewertung für jedes gefundene Schlüsselwort
          }
        }
        
        // Beachte auch den Dateinamen, falls vorhanden
        if (input.filename) {
          const filenameLower = input.filename.toLowerCase();
          for (const keyword of keywords) {
            if (filenameLower.includes(keyword)) {
              score += 0.2; // Dateiname ist ein starker Indikator
            }
          }
        }
        
        // Aktualisiere die Bewertung, aber begrenze sie auf 0.95
        scores.set(docType as DocumentType, Math.min(score, 0.95));
      }
      
      // Finde den Typ mit der höchsten Bewertung
      let highestScore = 0;
      let bestType = DocumentType.OTHER;
      
      scores.forEach((score, type) => {
        if (score > highestScore) {
          highestScore = score;
          bestType = type;
        }
      });
      
      // Wenn die Bewertung zu niedrig ist, als "Sonstiges" klassifizieren
      if (highestScore < 0.4) {
        bestType = DocumentType.OTHER;
        highestScore = 0.5; // Mittlere Konfidenz für den Fallback
      }
      
      // Spracherkennung simulieren
      const detectedLanguage = this.detectLanguage(text);
      
      return {
        documentType: bestType,
        confidence: highestScore,
        detectedLanguage,
        metadata: {
          classificationMethod: 'keyword',
          processedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Error in document classification:', error);
      throw new Error('Classification failed');
    }
  }
  
  /**
   * Gibt Schlüsselwörter für verschiedene Dokumententypen zurück
   */
  private getKeywords(): Record<DocumentType, string[]> {
    return {
      [DocumentType.INVOICE]: [
        'rechnung', 'invoice', 'facture', 'fattura',
        'zahlung', 'payment', 'betrag', 'amount', 'mwst', 'ust',
        'vat', 'tax', 'steuer', 'netto', 'brutto', 'summe',
        'total', 'artikel', 'item', 'position', 'kundennummer'
      ],
      [DocumentType.CONTRACT]: [
        'vertrag', 'contract', 'vereinbarung', 'agreement',
        'bedingungen', 'terms', 'konditionen', 'conditions',
        'unterschrift', 'signature', 'klausel', 'clause',
        'verpflichtung', 'obligation', 'parteien', 'parties'
      ],
      [DocumentType.ID_DOCUMENT]: [
        'ausweis', 'personalausweis', 'id', 'identity', 'identifikation',
        'reisepass', 'passport', 'führerschein', 'driver', 'license',
        'geburtsdatum', 'birth', 'staatsangehörigkeit', 'nationality'
      ],
      [DocumentType.CERTIFICATE]: [
        'zertifikat', 'certificate', 'bescheinigung', 'attestation',
        'bestätigung', 'confirmation', 'nachweis', 'proof', 'urkunde',
        'diploma', 'zeugnis', 'graduation', 'abschluss'
      ],
      [DocumentType.LETTER]: [
        'brief', 'letter', 'schreiben', 'writing', 'mitteilung',
        'message', 'sehr geehrte', 'dear', 'betreff', 'subject', 
        'mit freundlichen grüßen', 'regards', 'sincerely'
      ],
      [DocumentType.OTHER]: [] // Leere Liste für den Fallback-Typ
    };
  }
  
  /**
   * Einfache Spracherkennung basierend auf häufigen Wörtern
   */
  private detectLanguage(text: string): string {
    const languageMarkers = {
      'deu': ['der', 'die', 'das', 'und', 'in', 'ist', 'für', 'nicht', 'mit', 'auf'],
      'eng': ['the', 'and', 'for', 'in', 'is', 'of', 'to', 'with', 'be', 'this'],
      'fra': ['le', 'la', 'et', 'en', 'un', 'une', 'est', 'pas', 'pour', 'dans'],
      'ita': ['il', 'la', 'e', 'un', 'una', 'in', 'per', 'non', 'che', 'sono']
    };
    
    const scores: Record<string, number> = { 'deu': 0, 'eng': 0, 'fra': 0, 'ita': 0 };
    
    for (const [lang, markers] of Object.entries(languageMarkers)) {
      for (const marker of markers) {
        const regex = new RegExp(`\\b${marker}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          scores[lang] += matches.length;
        }
      }
    }
    
    // Finde die Sprache mit der höchsten Punktzahl
    let maxScore = 0;
    let detectedLang = 'eng'; // Fallback auf Englisch
    
    for (const [lang, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedLang = lang;
      }
    }
    
    return detectedLang;
  }
  
  /**
   * Simuliert eine Verzögerung für die Verarbeitung
   */
  private simulateProcessingDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 