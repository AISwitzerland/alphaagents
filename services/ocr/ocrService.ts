import { createWorker } from 'tesseract.js';
import { promises as fs } from 'fs';
import { OCR_CONFIG } from './config/ocrConfig.js';
import { ProcessingError } from '../../types/ocr.js';
import type { OCRLanguage, OCRResult, OCROptions, PreprocessingResult } from '../../types/ocr.js';
import { ImagePreprocessor } from './utils/imagePreprocessor.js';

interface TesseractProgress {
  status: string;
  progress: number;
}

export class OCRService {
  private static instance: OCRService;
  private imagePreprocessor: ImagePreprocessor;

  private constructor() {
    this.imagePreprocessor = new ImagePreprocessor();
  }

  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  private async initializeWorker(language: OCRLanguage): Promise<any> {
    const worker = await createWorker('eng');
    await worker.loadLanguage(language);
    await worker.initialize(language);
    return worker;
  }

  public async processImage(
    imagePath: string,
    language: OCRLanguage = OCR_CONFIG.ocr.defaultLanguage,
    options: OCROptions = {}
  ): Promise<OCRResult> {
    let worker;
    try {
      // Preprocess the image
      const preprocessResult = await this.imagePreprocessor.preprocessImage(imagePath);

      // Initialize worker with language
      worker = await this.initializeWorker(language);
      
      // Set parameters based on options
      if (options.timeout) {
        await worker.setParameters({
          tessedit_pageseg_mode: '1',
          tessedit_ocr_timeout_ms: options.timeout.toString(),
        });
      }

      // Perform OCR with the processed image path
      const { data } = await worker.recognize(preprocessResult.processedImagePath);
      
      // Clean up temporary files
      if (preprocessResult.temporaryFiles?.length) {
        await Promise.all(
          preprocessResult.temporaryFiles.map((tempFile: string) =>
            fs.unlink(tempFile).catch(error =>
              console.error('Error cleaning up temporary file:', error)
            )
          )
        );
      }

      if (!data.text) {
        throw new ProcessingError('No text was extracted from the image', 'OCR_NO_TEXT_EXTRACTED');
      }

      return {
        text: data.text,
        confidence: data.confidence,
        language,
        processedAt: new Date()
      };
    } catch (error) {
      if (error instanceof ProcessingError) {
        throw error;
      }
      throw new ProcessingError(
        'Failed to process image with OCR',
        'OCR_PROCESSING_FAILED',
        { originalError: error }
      );
    } finally {
      if (worker) {
        await worker.terminate();
      }
    }
  }

  public validateLanguage(language: string): boolean {
    return OCR_CONFIG.ocr.languages.includes(language as OCRLanguage);
  }

  public getSupportedLanguages(): OCRLanguage[] {
    return [...OCR_CONFIG.ocr.languages];
  }

  public getSupportedOutputFormats(): string[] {
    return [...OCR_CONFIG.output.supportedFormats];
  }
} 