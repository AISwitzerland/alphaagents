import { BaseAgent, AgentContext, AgentResult } from '../BaseAgent';
import { OCRService } from '../../services/ocr/ocrService';
import { OCRLanguage } from '../../types/ocr';
import * as fs from 'fs';
import * as path from 'path';

interface OCRAgentOptions {
  language?: OCRLanguage;
  enhanceImage?: boolean;
  timeout?: number;
}

interface OCRAgentInput {
  imagePath: string;
  options?: OCRAgentOptions;
}

interface OCRAgentOutput {
  text: string;
  confidence: number;
  language: string;
  processedAt: Date;
  metadata?: any;
}

/**
 * OCRAgent - Verantwortlich für die Texterkennung in Dokumenten
 */
export class OCRAgent extends BaseAgent<OCRAgentInput, OCRAgentOutput> {
  private ocrService: OCRService;

  constructor() {
    super('OCRAgent');
    this.ocrService = OCRService.getInstance();
  }

  /**
   * Verarbeitet ein Bild mit OCR und extrahiert Text
   * @param input Eingabedaten mit Bildpfad und Optionen
   * @param context Kontext für die Ausführung
   */
  public async execute(
    input: OCRAgentInput,
    context: AgentContext
  ): Promise<AgentResult<OCRAgentOutput>> {
    try {
      this.validateInput(input);
      
      // Log start of processing
      context.logger.info(`OCRAgent processing image: ${input.imagePath}`);
      
      // Extract options
      const {
        language = 'deu',
        enhanceImage = true,
        timeout = 120000
      } = input.options || {};
      
      // Validate language
      if (!this.ocrService.validateLanguage(language)) {
        throw new Error(`Unsupported language: ${language}`);
      }
      
      // Process the image
      const ocrResult = await this.ocrService.processImage(
        input.imagePath,
        language,
        { enhanceImage, timeout }
      );
      
      // Prepare output
      const output: OCRAgentOutput = {
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        language: ocrResult.language,
        processedAt: ocrResult.processedAt,
        metadata: ocrResult.metadata
      };
      
      return {
        success: true,
        data: output,
        message: 'OCR processing completed successfully'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during OCR processing';
      context.logger.error(`OCRAgent error: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage,
        message: 'OCR processing failed'
      };
    }
  }
  
  /**
   * Validiert die Eingabedaten für den OCR-Prozess
   */
  private validateInput(input: OCRAgentInput): void {
    if (!input) {
      throw new Error('Input is required');
    }
    
    if (!input.imagePath) {
      throw new Error('Image path is required');
    }
    
    if (!fs.existsSync(input.imagePath)) {
      throw new Error(`Image file not found: ${input.imagePath}`);
    }
    
    const fileExtension = path.extname(input.imagePath).toLowerCase();
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.bmp', '.pdf'];
    
    if (!supportedExtensions.includes(fileExtension)) {
      throw new Error(`Unsupported file format: ${fileExtension}. Supported formats: ${supportedExtensions.join(', ')}`);
    }
  }
  
  /**
   * Gibt alle unterstützten Sprachen zurück
   */
  public getSupportedLanguages(): OCRLanguage[] {
    return this.ocrService.getSupportedLanguages();
  }
} 