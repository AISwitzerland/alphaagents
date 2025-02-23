export type OCRLanguage = 'deu' | 'eng' | 'fra' | 'ita';

export interface PreprocessingResult {
  processedImagePath: string;
  originalSize: {
    width: number;
    height: number;
  };
  processedSize: {
    width: number;
    height: number;
  };
  dpi: number;
  format: string;
  enhancementApplied: boolean;
  orientation: number;
  temporaryFiles: string[];
}

export class ProcessingError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ProcessingError';
  }
}

export interface OCRResult {
  text: string;
  confidence: number;
  language: OCRLanguage;
  processedAt: Date;
}

export interface OCROptions {
  format?: 'text' | 'json' | 'pdf' | 'hocr';
  language?: OCRLanguage;
  enhanceImage?: boolean;
  timeout?: number;
} 