import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { DocumentType } from '@/types/document';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { Document } from '@/types';

// Verwende den API Key aus der Umgebungsvariable mit Fallback
const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: apiKey,
});

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ProcessDocumentMetadata {
  originalName: string;
  size: number;
  mimeType: string;
  documentId: string;
  uploadedBy: {
    id?: string;
    email?: string;
    name?: string;
    phone?: string;
    source: 'chat' | 'dashboard';
  };
  uploadedAt: string;
  source: string;
}

interface ProcessDocumentParams {
  fileContent: string;
  fileType: string;
  metadata: ProcessDocumentMetadata;
}

interface ProcessDocumentResult {
  error?: string;
  documentType?: string;
  metadata?: Record<string, any>;
  processId?: string;
}

interface ProcessResult {
  processId: string;
  documentType: DocumentType;
  metadata: any;
  extractedData: any;
  error?: string;
}

interface DamageReportData {
  document_id: string;
  versicherungsnummer?: string;
  name: string;
  adresse: string;
  schaden_datum: string;
  schaden_ort: string;
  schaden_beschreibung: string;
  zusammenfassung: string;
  status: string;
}

function parseDEDate(dateStr: string): string | null {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('.');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export async function createAccidentReport(documentId: string, extractedData: any) {
  console.log('createAccidentReport aufgerufen mit:', { documentId, extractedDataKeys: Object.keys(extractedData) });
  
  try {
    // Überprüfe, ob documentId vorhanden ist
    if (!documentId) {
      const error = new Error('Keine document_id angegeben');
      console.error('Error in createAccidentReport: Keine document_id', error);
      throw error;
    }
    
    // Bereite Daten für die Einfügung vor
    const dataToInsert = {
      document_id: documentId,
      name: extractedData.name || 'Unbekannt',
      geburtsdatum: extractedData.geburtsdatum || null,
      ahv_nummer: extractedData.ahv_nummer || '',
      unfall_datum: extractedData.unfall_datum || null,
      unfall_zeit: extractedData.unfall_zeit || '',
      unfall_ort: extractedData.unfall_ort || '',
      unfall_beschreibung: extractedData.unfall_beschreibung || '',
      verletzung_art: extractedData.verletzung_art || '',
      verletzung_koerperteil: extractedData.verletzung_koerperteil || ''
    };
    
    console.log('Füge accident_report ein:', dataToInsert);
    
    // Führe die Datenbankeinfügung durch
    const { data: accidentReport, error } = await supabase
      .from('accident_reports')
      .insert(dataToInsert)
      .select()
      .single();

    if (error) {
      console.error('Supabase Fehler in createAccidentReport:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    console.log('accident_report erfolgreich erstellt:', accidentReport);
    return accidentReport;
  } catch (error) {
    console.error('Error in createAccidentReport:', error);
    // Detailliertes Logging des Fehlers
    if (error instanceof Error) {
      console.error(`Fehlertyp: ${error.name}, Nachricht: ${error.message}, Stack: ${error.stack}`);
    } else {
      console.error('Unbekannter Fehlertyp:', error);
    }
    throw error;
  }
}

export async function createDamageReport(documentId: string, extractedData: any) {
  try {
    // Parse date if it exists
    let schadenDatum = null;
    const rawDate = extractedData.schaden_datum || extractedData.aenderung?.datum;
    if (rawDate) {
      schadenDatum = rawDate.includes('.') ? parseDEDate(rawDate) : rawDate;
    }

    const { data: damageReport, error } = await supabase
      .from('damage_reports')
      .insert({
        document_id: documentId,
        versicherungsnummer: extractedData.versicherungsnummer || extractedData.vertragsnummer || '',
        name: extractedData.name || extractedData.kunde?.name || extractedData.versicherter?.name || '',
        adresse: extractedData.adresse || `${extractedData.kunde?.adresse || ''}, ${extractedData.kunde?.plz || ''}, ${extractedData.kunde?.ort || ''}`,
        schaden_datum: schadenDatum,
        schaden_ort: extractedData.schaden_ort || extractedData.kunde?.ort || '',
        schaden_beschreibung: extractedData.schaden_beschreibung || extractedData.aenderung?.beschreibung || extractedData.schaden?.beschreibung || '',
        zusammenfassung: extractedData.zusammenfassung || extractedData.aenderung?.beschreibung || extractedData.schaden?.beschreibung || '',
        status: 'eingereicht'
      })
      .select()
      .single();

    if (error) throw error;
    return damageReport;
  } catch (error) {
    console.error('Error in createDamageReport:', error);
    throw error;
  }
}

export async function createContractChange(documentId: string, extractedData: any) {
  try {
    const { data: contractChange, error } = await supabase
      .from('contract_changes')
      .insert({
        document_id: documentId,
        type: extractedData.type || 'other',
        description: extractedData.description || '',
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return contractChange;
  } catch (error) {
    console.error('Error in createContractChange:', error);
    throw error;
  }
}

export async function createMiscDocument(documentId: string, extractedData: any) {
  console.log('createMiscDocument aufgerufen mit:', { documentId, extractedDataKeys: Object.keys(extractedData) });
  
  try {
    // Überprüfe, ob documentId vorhanden ist
    if (!documentId) {
      const error = new Error('Keine document_id angegeben');
      console.error('Error in createMiscDocument: Keine document_id', error);
      throw error;
    }
    
    // Bereite Daten für die Einfügung vor
    const dataToInsert = {
      document_id: documentId,
      title: extractedData.title || 'Untitled',
      description: extractedData.description || '',
      status: 'received'
    };
    
    console.log('Füge misc_document ein:', dataToInsert);
    
    // Führe die Datenbankeinfügung durch
    const { data: miscDocument, error } = await supabase
      .from('misc_documents')
      .insert(dataToInsert)
      .select()
      .single();

    if (error) {
      console.error('Supabase Fehler in createMiscDocument:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    console.log('misc_document erfolgreich erstellt:', miscDocument);
    return miscDocument;
  } catch (error) {
    console.error('Error in createMiscDocument:', error);
    // Detailliertes Logging des Fehlers
    if (error instanceof Error) {
      console.error(`Fehlertyp: ${error.name}, Nachricht: ${error.message}, Stack: ${error.stack}`);
    } else {
      console.error('Unbekannter Fehlertyp:', error);
    }
    throw error;
  }
}

function mapContractChangeType(type: string): string {
  const typeMapping: { [key: string]: string } = {
    'kündigung': 'kuendigung',
    'Kündigung': 'kuendigung',
    'vertragswechsel': 'vertragswechsel',
    'Vertragswechsel': 'vertragswechsel',
    'vertragstrennung': 'vertragstrennung',
    'Vertragstrennung': 'vertragstrennung',
    'anpassung': 'anpassung',
    'Anpassung': 'anpassung'
  };
  
  return typeMapping[type] || 'anpassung'; // Fallback auf 'anpassung' wenn kein Match
}

export async function processDocument(params: ProcessDocumentParams): Promise<ProcessDocumentResult> {
  try {
    console.log('Processing document:', {
      type: params.fileType,
      size: params.metadata.size,
      source: params.metadata.source,
      documentId: params.metadata.documentId
    });

    // Dokument für die KI-Erkennung in Base64 konvertieren
    // Hier nutzen wir die bestehende fileContent, die sollte bereits als Base64 vorliegen
    const base64Content = params.fileContent;
    
    // Original-Dateiname für die Erkennung und Logging
    const fileName = params.metadata.originalName;
    
    // Erweiterte Dokumenttyperkennung mit KI-Unterstützung
    let documentType = 'misc';
    let typeSource = 'filename';
    let confidence = 0.5;
    
    try {
      // Für die KI-basierte Erkennung erstellen wir ein virtuelles File-Objekt
      const virtualFile = new Blob([Buffer.from(base64Content, 'base64')], { type: params.fileType });
      Object.defineProperty(virtualFile, 'name', { value: fileName });
      
      // Importiere die enhancedDocumentTypeDetection aus utils/file.ts
      const { enhancedDocumentTypeDetection } = await import('@/utils/file');
      
      // Führe die erweiterte Dokumenttyperkennung durch
      const detectionResult = await enhancedDocumentTypeDetection(virtualFile, base64Content);
      
      documentType = detectionResult.documentType;
      typeSource = detectionResult.source;
      confidence = detectionResult.confidence;
      
      console.log('Erweiterte Dokumenttyperkennung abgeschlossen:', {
        type: documentType,
        source: typeSource,
        confidence: confidence.toFixed(2)
      });
    } catch (error) {
      console.error('Fehler bei der erweiterten Dokumenttyperkennung:', error);
      
      // Fallback zur einfachen dateinamenbasierten Erkennung
      console.log('Verwende Fallback zur dateinamenbasierten Erkennung...');
      
      // Einfache Dokumenttyp-Erkennung basierend auf Dateinamen
      if (fileName.toLowerCase().includes('unfall') || fileName.toLowerCase().includes('accident')) {
        documentType = 'unfall';
      } else if (fileName.toLowerCase().includes('schaden') || fileName.toLowerCase().includes('damage')) {
        documentType = 'schaden';
      } else if (fileName.toLowerCase().includes('vertrag') || fileName.toLowerCase().includes('contract')) {
        documentType = 'vertragsänderung';
      }
      
      console.log(`Dokument fallback-klassifiziert als "${documentType}" (dateinamenbasiert)`);
    }
    
    // Erstelle eine Prozess-ID für die Nachverfolgung
    const processId = `proc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Bereite Metadaten und extrahierte Daten vor
    // Diese würden normalerweise aus der KI-Verarbeitung kommen
    const extractedData = {
      title: params.metadata.originalName,
      description: `Uploaded via ${params.metadata.source}`,
      uploadedBy: params.metadata.uploadedBy,
      // Füge weitere Felder je nach Dokumenttyp hinzu
      ...(documentType === 'unfall' && {
        name: "Test Person",
        geburtsdatum: "1990-01-01",
        ahv_nummer: "756.1234.5678.90",
        unfall_datum: new Date().toISOString().split('T')[0],
        unfall_zeit: "12:00:00",
        unfall_ort: "Teststraße 1",
        unfall_beschreibung: "Testbeschreibung",
        verletzung_art: "Testbeschreibung",
        verletzung_koerperteil: "Hand"
      }),
      ...(documentType === 'schaden' && {
        versicherungsnummer: "123456789",
        name: "Test Person",
        adresse: "Teststraße 1, 8000 Zürich",
        schaden_datum: new Date().toISOString().split('T')[0],
        schaden_ort: "Teststraße 1",
        schaden_beschreibung: "Testbeschreibung",
        zusammenfassung: "Testzusammenfassung"
      })
    };
    
    console.log('Extrahierte Daten:', extractedData);

    // Aktualisiere das Dokument in der Datenbank mit dem erkannten Typ
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        document_type: documentType,
        status: 'verarbeitet',
        metadata: {
          ...params.metadata,
          processed: true,
          processingTime: new Date().toISOString(),
          processId,
          classification: {
            type: documentType,
            source: typeSource,
            confidence
          }
        }
      })
      .eq('id', params.metadata.documentId);
      
    if (updateError) {
      console.error('Fehler beim Aktualisieren des Dokuments:', updateError);
    } else {
      console.log('Dokument erfolgreich aktualisiert mit Typ:', documentType);
    }
    
    return {
      documentType,
      processId,
      metadata: {
        processed: true,
        processingTime: new Date().toISOString(),
        classification: {
          type: documentType,
          source: typeSource,
          confidence
        },
        extractedData
      }
    };
  } catch (error) {
    console.error('Error processing document:', error);
    if (error instanceof Error) {
      console.error(`Fehlertyp: ${error.name}, Nachricht: ${error.message}, Stack: ${error.stack}`);
    } else {
      console.error('Unbekannter Fehlertyp:', error);
    }
    return {
      error: error instanceof Error ? error.message : 'Unknown error processing document'
    };
  }
}

// Test-Funktion für OpenAI API Key
export async function testOpenAIKey(): Promise<{ isValid: boolean; error?: string }> {
  try {
    console.log('Teste OpenAI API Key...');
    console.log('API Key (erste 5 Zeichen):', process.env.OPENAI_API_KEY?.substring(0, 5));
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Test" }],
      max_tokens: 5
    });

    console.log('OpenAI Test erfolgreich:', {
      model: response.model,
      created: new Date(response.created * 1000).toISOString()
    });

    return { isValid: true };
  } catch (error: any) {
    console.error('OpenAI Test fehlgeschlagen:', error.message);
    return { 
      isValid: false, 
      error: error.message 
    };
  }
}

/**
 * Konvertiert eine Datei in ein Base64-kodiertes Format
 * 
 * @param file Die zu konvertierende Datei
 * @returns Das Base64-kodierte Ergebnis als String
 */
export async function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Extract base64 data from data URL
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
} 