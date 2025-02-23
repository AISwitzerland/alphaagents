import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { DocumentType } from '@/types/document';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
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
  try {
    const { data: accidentReport, error } = await supabase
      .from('accident_reports')
      .insert({
        document_id: documentId,
        name: extractedData.name || '',
        geburtsdatum: extractedData.geburtsdatum || null,
        ahv_nummer: extractedData.ahv_nummer || '',
        unfall_datum: extractedData.unfall_datum || null,
        unfall_zeit: extractedData.unfall_zeit || '',
        unfall_ort: extractedData.unfall_ort || '',
        unfall_beschreibung: extractedData.unfall_beschreibung || '',
        verletzung_art: extractedData.verletzung_art || '',
        verletzung_koerperteil: extractedData.verletzung_koerperteil || ''
      })
      .select()
      .single();

    if (error) throw error;
    return accidentReport;
  } catch (error) {
    console.error('Error in createAccidentReport:', error);
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
  try {
    const { data: miscDocument, error } = await supabase
      .from('misc_documents')
      .insert({
        document_id: documentId,
        title: extractedData.title || 'Untitled',
        description: extractedData.description || '',
        status: 'received'
      })
      .select()
      .single();

    if (error) throw error;
    return miscDocument;
  } catch (error) {
    console.error('Error in createMiscDocument:', error);
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
      source: params.metadata.source
    });

    // For now, we'll just store the document without processing
    return {
      documentType: 'misc',
      processId: Date.now().toString(),
      metadata: {
        processed: true,
        processingTime: new Date().toISOString(),
        extractedData: {
          title: params.metadata.originalName,
          description: `Uploaded via ${params.metadata.source}`,
          uploadedBy: params.metadata.uploadedBy
        }
      }
    };
  } catch (error) {
    console.error('Error processing document:', error);
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
      model: "gpt-4o",
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