import { OCR_CONFIG } from '../config/ocrConfig';
import { PreprocessingResult, ProcessingError } from '../../../types/ocr';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Utility-Klasse zur Vorverarbeitung von Bildern für OCR
 * Vereinfachte Version für die Produktionsumgebung
 */
export class ImagePreprocessor {
  /**
   * Verarbeitet ein Bild vor der OCR-Erkennung
   */
  async preprocessImage(imagePath: string): Promise<PreprocessingResult> {
    try {
      const tempPath = await this.createTempFile();
      
      // In einer vollständigen Implementation würden wir hier Sharp oder eine
      // andere Bildverarbeitungsbibliothek verwenden, um das Bild zu optimieren
      
      // Für unseren POC kopieren wir das Bild einfach in eine temporäre Datei
      if (fs.existsSync(imagePath)) {
        fs.copyFileSync(imagePath, tempPath);
      } else {
        throw new ProcessingError(
          'Bilddatei nicht gefunden',
          'FILE_NOT_FOUND',
          { path: imagePath }
        );
      }
      
      // Simuliere Metadaten, die normalerweise von der Bildverarbeitungsbibliothek kämen
      return {
        processedImagePath: tempPath,
        originalSize: {
          width: 1000,
          height: 800
        },
        processedSize: {
          width: OCR_CONFIG.processing.imageOptimization.maxWidth,
          height: OCR_CONFIG.processing.imageOptimization.maxHeight
        },
        dpi: 300,
        format: path.extname(imagePath).replace('.', ''),
        enhancementApplied: true,
        orientation: 1,
        temporaryFiles: [tempPath],
        metadata: {
          preprocessedAt: new Date().toISOString(),
          preprocessingEngine: 'simplified'
        }
      };
    } catch (error: any) {
      const isProcessingError = error instanceof ProcessingError;
      throw isProcessingError ? error : new ProcessingError(
        `Bildvorverarbeitung fehlgeschlagen: ${error.message}`,
        'PREPROCESSING_ERROR',
        { originalError: error }
      );
    }
  }
  
  /**
   * Erstellt eine temporäre Datei
   */
  private async createTempFile(): Promise<string> {
    const tempDir = os.tmpdir();
    const timestamp = Date.now();
    const tempPath = path.join(tempDir, `ocr_temp_${timestamp}.png`);
    return tempPath;
  }
  
  /**
   * Konvertiert ein Bild in Base64-Format
   */
  async convertToBase64(imagePath: string): Promise<string> {
    try {
      const data = fs.readFileSync(imagePath);
      return data.toString('base64');
    } catch (error: any) {
      throw new ProcessingError(
        `Base64-Konvertierung fehlgeschlagen: ${error.message}`,
        'CONVERSION_ERROR',
        { originalError: error }
      );
    }
  }
  
  /**
   * Prüft die Qualität eines Bildes
   */
  async checkImageQuality(imagePath: string): Promise<{
    quality: number;
    warnings: string[];
  }> {
    try {
      const warnings: string[] = [];
      let qualityScore = 1.0;
      
      // Grundlegende Dateieigenschaftsprüfung
      const stats = fs.statSync(imagePath);
      
      // Prüfen der Dateigröße
      if (stats.size < 50000) {
        warnings.push('Bildgröße ist möglicherweise zu klein für optimale OCR-Ergebnisse');
        qualityScore *= 0.8;
      } else if (stats.size > 10000000) {
        warnings.push('Bildgröße ist sehr groß, kann zu längerer Verarbeitungszeit führen');
        qualityScore *= 0.9;
      }
      
      return {
        quality: qualityScore,
        warnings
      };
    } catch (error: any) {
      throw new ProcessingError(
        `Qualitätsprüfung fehlgeschlagen: ${error.message}`,
        'QUALITY_CHECK_ERROR',
        { originalError: error }
      );
    }
  }
}

// Singleton-Instanz
export const imagePreprocessor = new ImagePreprocessor(); 