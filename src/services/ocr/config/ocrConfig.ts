import { OCRLanguage } from '../../../types/ocr';

/**
 * Konfiguration für den OCR-Service
 */
export const OCR_CONFIG = {
  // OCR-spezifische Einstellungen
  ocr: {
    defaultLanguage: 'deu' as OCRLanguage,
    languages: ['deu', 'eng', 'fra', 'ita'] as OCRLanguage[],
    tesseractPath: process.env.TESSERACT_PATH || '',
    maxProcessingTime: 120000, // 2 Minuten
  },
  
  // Bildvorverarbeitung
  processing: {
    imageOptimization: {
      maxWidth: 2000,
      maxHeight: 2000,
      quality: 90,
      autoRotate: true,
      denoise: true,
      normalize: true,
      sharpen: true
    },
    tempDir: process.env.TEMP_DIR || './temp'
  },
  
  // Output-Optionen
  output: {
    supportedFormats: ['text', 'json', 'pdf', 'hocr'],
    defaultFormat: 'text',
    enableCompression: false
  },
  
  // GPT Vision Einstellungen (falls verwendet)
  gptVision: {
    model: 'gpt-4-vision-preview',
    maxTokens: 1500,
    temperature: 0.2,
    systemPrompt: 'Du bist ein OCR-Assistent. Extrahiere sämtlichen Text aus dem Bild, einschließlich Überschriften, Absätze, Tabellen und andere Strukturen. Formatiere den Text entsprechend der Originalstruktur. Tabellen sollten als tabellarischer Text formatiert werden.'
  }
}; 