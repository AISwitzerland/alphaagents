import { Document } from '../../types/document';
import { BaseAgent, AgentOptions, AgentResult } from '../../interfaces/BaseAgent';
import { ProcessingStage } from '../../types/coordination';
import { OCRService } from '../../../services/ocr/ocrService';
import { OCRLanguage, OCROptions } from '../../../types/ocr';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * OCRAgent - verantwortlich für die Texterkennung aus Dokumenten
 * Nutzt den vorhandenen OCRService für die eigentliche OCR-Verarbeitung
 */
export class OCRAgent implements BaseAgent {
  private static instance: OCRAgent | null = null;
  readonly type = 'ocr';
  private ocrService: OCRService;
  
  private constructor() {
    this.ocrService = OCRService.getInstance();
  }
  
  /**
   * Gibt die Singleton-Instanz des OCRAgent zurück
   */
  public static getInstance(): OCRAgent {
    if (!OCRAgent.instance) {
      OCRAgent.instance = new OCRAgent();
    }
    return OCRAgent.instance;
  }
  
  /**
   * Implementierung des BaseAgent-Interface
   * Verarbeitet ein Dokument mit OCR
   */
  public async process(document: Document, options?: AgentOptions): Promise<AgentResult> {
    console.log(`Processing document ${document.id} with OCRAgent`);
    
    try {
      // Prüfe, ob das Dokument bereits OCR-verarbeitet wurde
      if (document.text && document.text.length > 0) {
        console.log('Document already has text content, skipping OCR');
        return {
          success: true,
          data: document,
          confidence: 1.0,
          metadata: {
            source: 'existing_text',
            processingTime: 0
          }
        };
      }
      
      // Prüfe, ob eine Datei vorhanden ist
      if (!document.file) {
        return {
          success: false,
          error: {
            code: 'NO_FILE_CONTENT',
            message: 'Document has no file content for OCR processing',
            retryable: false
          }
        };
      }
      
      // Erstelle temporäre Datei für das Dokument
      const tempFilePath = await this.createTempFile(document);
      let ocrResult;
      
      try {
        // Bestimme die OCR-Sprache (mit Fallback auf Englisch)
        const language = this.determineLanguage(document);
        
        // Erstelle OCR-Optionen basierend auf den Agenten-Optionen
        const ocrOptions: OCROptions = {
          timeout: options?.timeout,
          enhanceImage: true
        };
        
        // Führe OCR aus
        const startTime = Date.now();
        ocrResult = await this.ocrService.processImage(tempFilePath, language, ocrOptions);
        const processingTime = Date.now() - startTime;
        
        // Bereite das Ergebnis vor
        return {
          success: true,
          data: {
            ...document,
            text: ocrResult.text,
            classificationConfidence: ocrResult.confidence,
            metadata: {
              ...document.metadata,
              ocrLanguage: ocrResult.language,
              ocrProcessedAt: ocrResult.processedAt.toISOString(),
              ocrConfidence: ocrResult.confidence
            }
          },
          confidence: ocrResult.confidence,
          metadata: {
            processingTime,
            language: ocrResult.language
          }
        };
      } finally {
        // Bereinige temporäre Dateien
        await this.cleanupTempFile(tempFilePath);
      }
    } catch (error) {
      console.error('Error in OCRAgent.process:', error);
      return {
        success: false,
        error: {
          code: 'OCR_PROCESSING_ERROR',
          message: error instanceof Error ? error.message : 'Unknown OCR processing error',
          details: error,
          retryable: true
        }
      };
    }
  }
  
  /**
   * Prüft, ob der Agent eine bestimmte Verarbeitungsstufe unterstützt
   */
  public canHandle(stage: ProcessingStage, document: Document): boolean {
    // OCRAgent kann nur die OCR-Verarbeitungsstufe bearbeiten
    return stage === 'ocr_processed';
  }
  
  /**
   * Gibt den aktuellen Status des Agenten zurück
   */
  public getStatus(): { available: boolean; busy: boolean; queue: number } {
    // In dieser einfachen Implementation ist der Agent immer verfügbar
    return {
      available: true,
      busy: false,
      queue: 0
    };
  }
  
  /**
   * Ressourcen bereinigen
   */
  public async shutdown(): Promise<void> {
    // Keine speziellen Ressourcen zu bereinigen
    console.log('OCRAgent shutting down');
    return Promise.resolve();
  }
  
  /**
   * Erstellt eine temporäre Datei aus dem Dokument für die OCR-Verarbeitung
   */
  private async createTempFile(document: Document): Promise<string> {
    const tempDir = os.tmpdir();
    const fileExtension = this.getFileExtension(document);
    const tempFilePath = path.join(tempDir, `ocr_temp_${Date.now()}.${fileExtension}`);
    
    return new Promise<string>((resolve, reject) => {
      try {
        if (typeof document.file === 'string') {
          // Für Strings können wir direkt fs.writeFileSync verwenden
          if (document.file.startsWith('data:')) {
            // Base64 mit Header
            const base64Data = document.file.split(',')[1];
            // Verwende das writeFile mit dem Uint8Array aus dem Buffer als zweites Argument
            // Das ist typensicher und funktioniert mit Node und Browser TypeScript
            fs.writeFileSync(tempFilePath, new Uint8Array(Buffer.from(base64Data, 'base64')));
          } else {
            // Roher Text oder Base64 ohne Header
            fs.writeFileSync(tempFilePath, document.file);
          }
        } else if (Buffer.isBuffer(document.file)) {
          // Für Buffer müssen wir über Uint8Array gehen
          fs.writeFileSync(tempFilePath, new Uint8Array(document.file));
        } else if (document.file instanceof Uint8Array) {
          // Für Uint8Array können wir es direkt verwenden
          fs.writeFileSync(tempFilePath, document.file);
        } else {
          reject(new Error('Unsupported file format'));
          return;
        }
        
        resolve(tempFilePath);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Bereinigt temporäre Dateien
   */
  private async cleanupTempFile(filePath: string): Promise<void> {
    return new Promise<void>((resolve) => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.warn(`Failed to clean up temporary file ${filePath}:`, error);
      } finally {
        resolve();
      }
    });
  }
  
  /**
   * Bestimmt die Dateierweiterung basierend auf dem MIME-Typ
   */
  private getFileExtension(document: Document): string {
    const mimeTypeToExtension: Record<string, string> = {
      'application/pdf': 'pdf',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/tiff': 'tiff',
      'text/plain': 'txt'
    };
    
    if (document.mimeType && mimeTypeToExtension[document.mimeType]) {
      return mimeTypeToExtension[document.mimeType];
    }
    
    // Versuche, die Erweiterung aus dem Dateinamen zu extrahieren
    if (document.fileName) {
      const extension = document.fileName.split('.').pop();
      if (extension && extension.length > 0 && extension.length <= 5) {
        return extension;
      }
    }
    
    // Fallback auf PNG
    return 'png';
  }
  
  /**
   * Bestimmt die OCR-Sprache basierend auf Metadaten oder Fallback
   */
  private determineLanguage(document: Document): OCRLanguage {
    // Versuche, die Sprache aus den Metadaten zu extrahieren
    const metadataLanguage = document.metadata?.language;
    if (metadataLanguage) {
      if (this.isValidLanguage(metadataLanguage)) {
        return metadataLanguage as OCRLanguage;
      }
    }
    
    // Prüfe auf Dokumenttyp-spezifische Sprachen
    if (document.documentType) {
      const documentTypeLower = document.documentType.toLowerCase();
      if (documentTypeLower.includes('german') || documentTypeLower.includes('deutsch')) {
        return 'deu';
      } else if (documentTypeLower.includes('french') || documentTypeLower.includes('französisch')) {
        return 'fra';
      } else if (documentTypeLower.includes('italian') || documentTypeLower.includes('italienisch')) {
        return 'ita';
      }
    }
    
    // Fallback auf Englisch
    return 'eng';
  }
  
  /**
   * Prüft, ob eine Sprachbezeichnung gültig ist
   */
  private isValidLanguage(language: string): boolean {
    return this.ocrService.validateLanguage(language);
  }
}

export default OCRAgent; 