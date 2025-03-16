/**
 * Unterstützte OCR-Sprachen
 */
export type OCRLanguage = 'deu' | 'eng' | 'fra' | 'ita';

/**
 * Ergebnis der Bildvorverarbeitung
 */
export interface PreprocessingResult {
  processedImagePath: string;
  originalSize?: {
    width: number;
    height: number;
  };
  processedSize?: {
    width: number;
    height: number;
  };
  dpi?: number;
  format?: string;
  enhancementApplied?: boolean;
  orientation?: number;
  temporaryFiles?: string[];
  metadata?: Record<string, any>;
}

/**
 * Fehler bei der Verarbeitung
 */
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

/**
 * Ergebnis der OCR-Verarbeitung
 */
export interface OCRResult {
  text: string;
  confidence: number;
  language: OCRLanguage;
  processedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Optionen für die OCR-Verarbeitung
 */
export interface OCROptions {
  format?: 'text' | 'json' | 'pdf' | 'hocr';
  language?: OCRLanguage;
  enhanceImage?: boolean;
  timeout?: number;
} 