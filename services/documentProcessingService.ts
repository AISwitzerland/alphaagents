import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { DocumentType } from '@/types/document';
import OpenAI from 'openai';
import sharp from 'sharp';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { fromPath } from 'pdf2pic';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { DatabaseService } from '@/services/databaseService';

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

async function convertPDFToImage(pdfBuffer: Buffer): Promise<string> {
  try {
    console.log('Konvertiere PDF zu Bild...');
    
    const timestamp = Date.now();
    const tempDir = os.tmpdir();
    const tempPdfPath = path.join(tempDir, `temp-${timestamp}.pdf`);

    try {
      // PDF temporär speichern
      fs.writeFileSync(tempPdfPath, pdfBuffer);

      // Konfiguration für pdf2pic
      const options = {
        density: 300,                // Hohe Auflösung für bessere Qualität
        saveFilename: `temp-${timestamp}`,
        savePath: tempDir,
        format: 'png',
        width: 2000,    // Max Breite
        height: 2000,   // Max Höhe
      };

      console.log('Starte PDF-zu-Bild Konvertierung...');
      const convert = fromPath(tempPdfPath, options);
      await convert(1); // Erste Seite konvertieren

      // Kurze Pause für Dateisystem
      await new Promise(resolve => setTimeout(resolve, 100));

      const outputPath = path.join(tempDir, `${options.saveFilename}.1.png`);

      // Bildoptimierung mit sharp
      console.log('Optimiere konvertiertes Bild...');
      const sharpBuffer = await sharp(outputPath)
        .png()
        .resize({
          width: 2000,
          height: 2000,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .normalize()    // Kontrast optimieren
        .sharpen()     // Schärfe verbessern
        .gamma(1.1)    // Bessere Texterkennung
        .toBuffer();

      // Konvertiere zu Base64
      return sharpBuffer.toString('base64');

    } finally {
      // Aufräumen: Temporäre Dateien löschen
      try {
        if (tempPdfPath) fs.unlinkSync(tempPdfPath);
        const outputPath = path.join(tempDir, `temp-${timestamp}.1.png`);
        if (outputPath) fs.unlinkSync(outputPath);
      } catch (cleanupError) {
        console.warn('Warnung beim Cleanup:', cleanupError);
      }
    }
  } catch (error) {
    console.error('Fehler bei der PDF-Konvertierung:', error);
    throw new Error(`PDF-Konvertierung fehlgeschlagen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
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

function extractJSONFromResponse(text: string): string {
  try {
    // Entferne Markdown-Code-Block-Markierungen
    text = text.replace(/```json\s*|\s*```/g, '');
    
    // Suche nach dem JSON-Block
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      console.log('Keine JSON-Struktur gefunden in:', text.substring(0, 200) + '...');
      throw new Error('Kein JSON in der Antwort gefunden');
    }

    // Entferne JavaScript-Kommentare und bereinige den Text
    let jsonText = match[0]
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Entfernt /* */ und // Kommentare
      .replace(/[\n\r\t]/g, ' ')               // Ersetzt Zeilenumbrüche und Tabs durch Leerzeichen
      .replace(/\s+/g, ' ')                    // Reduziert mehrfache Leerzeichen auf eines
      .trim();

    // Validiere, dass es sich um gültiges JSON handelt
    JSON.parse(jsonText); // Wirft einen Fehler, wenn kein gültiges JSON
    
    return jsonText;
  } catch (error) {
    console.error('Fehler beim Extrahieren des JSONs:', error);
    console.log('Originaler Text:', text.substring(0, 200) + '...');
    throw error;
  }
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
    const { data: damageReport, error } = await supabase
      .from('damage_reports')
      .insert({
        document_id: documentId,
        versicherungsnummer: extractedData.versicherungsnummer || '',
        name: extractedData.name || '',
        adresse: extractedData.adresse || '',
        schaden_datum: extractedData.schaden_datum || null,
        schaden_ort: extractedData.schaden_ort || '',
        schaden_beschreibung: extractedData.schaden_beschreibung || '',
        zusammenfassung: extractedData.zusammenfassung || '',
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

// Hilfsfunktion für die Erstellung von Schadensmeldungen
async function createDamageReport(documentId: string, extractedData: any): Promise<DamageReportData> {
  const schadendatum = extractedData.aenderung?.datum || extractedData.schaden_datum;
  if (!schadendatum) {
    throw new Error('Kein Schadensdatum gefunden');
  }

  const isoDate = parseDEDate(schadendatum);
  if (!isoDate) {
    throw new Error('Ungültiges Datumsformat. Erwartet: DD.MM.YYYY');
  }

  return {
    document_id: documentId,
    versicherungsnummer: extractedData.vertragsnummer || '',
    name: extractedData.kunde?.name || extractedData.versicherter?.name || '',
    adresse: `${extractedData.kunde?.adresse || ''}, ${extractedData.kunde?.plz || ''}, ${extractedData.kunde?.ort || ''}`,
    schaden_datum: isoDate,
    schaden_ort: extractedData.kunde?.ort || '',
    schaden_beschreibung: extractedData.aenderung?.beschreibung || extractedData.schaden?.beschreibung || '',
    zusammenfassung: extractedData.aenderung?.beschreibung || extractedData.schaden?.beschreibung || '',
    status: 'eingereicht'
  };
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

function validateDocumentType(type: string, extractionResult: any): DocumentType {
  if (typeof extractionResult === 'string') {
    console.log('Unerwartete String-Antwort von GPT:', extractionResult);
    return 'misc';
  }

  const scores = {
    accident_report: 0,
    damage_report: 0,
    contract_change: 0,
    invoice: 0,
    misc: 0
  };

  const data = extractionResult.extractedData;
  
  // Scoring für Unfallbericht
  if (data?.unfall_datum) scores.accident_report += 3;
  if (data?.ahv_nummer) scores.accident_report += 3;
  if (data?.verletzung_art) scores.accident_report += 3;
  if (data?.unfall_zeit) scores.accident_report += 2;
  if (data?.unfall_ort) scores.accident_report += 2;

  // Zusätzliche Schlüsselwörter für Unfallbericht
  const accidentKeywords = ['unfall', 'verletzt', 'eingeklemmt', 'gestürzt', 'ausgerutscht', 'verunfallt', 'kollision', 'zusammenstoss', 'prellungen', 'verletzungen', 'Suva'];
  const description = (data?.schaden_beschreibung || data?.unfall_beschreibung || '').toLowerCase();
  for (const keyword of accidentKeywords) {
    if (description.includes(keyword)) {
      scores.accident_report += 3;
      break;
    }
  }

  // Scoring für Schadensmeldung
  if (data?.schaden_datum) scores.damage_report += 3;
  if (data?.versicherungsnummer) scores.damage_report += 3;
  if (data?.schaden_beschreibung) scores.damage_report += 2;
  if (data?.schaden_ort) scores.damage_report += 2;

  // Zusätzliche Schlüsselwörter für Schadensmeldung
  const damageKeywords = ['sachschaden', 'beschädigung', 'schaden', 'kaputt', 'defekt', 'reparatur', 'wasserschaden', 'brandschaden', 'sturmschaden'];
  const damageDescription = (data?.schaden_beschreibung || '').toLowerCase();
  for (const keyword of damageKeywords) {
    if (damageDescription.includes(keyword)) {
      scores.damage_report += 3;
      break;
    }
  }

  // Scoring für Vertragsänderung
  if (data?.aenderung_typ) scores.contract_change += 3;
  if (data?.aenderung_beschreibung) scores.contract_change += 3;

  // Scoring für Rechnung
  if (data?.rechnungsnummer) scores.invoice += 3;
  if (data?.betrag) scores.invoice += 3;
  if (data?.zahlungsfrist) scores.invoice += 2;

  // Finde den höchsten Score
  const maxScore = Math.max(...Object.values(scores));
  const maxTypes = Object.entries(scores)
    .filter(([_, score]) => score === maxScore)
    .map(([type]) => type as DocumentType);

  // Wenn mehrere Typen den gleichen Score haben oder der Score zu niedrig ist
  if (maxTypes.length > 1 || maxScore < 4) {
    console.log('Niedrige oder mehrdeutige Klassifizierung, als misc klassifiziert');
    console.log('Scores:', scores);
    return 'misc';
  }

  const documentType = maxTypes[0];
  console.log(`Dokument als ${documentType} klassifiziert mit Score ${maxScore}`);
  console.log('Alle Scores:', scores);
  
  return documentType;
} 