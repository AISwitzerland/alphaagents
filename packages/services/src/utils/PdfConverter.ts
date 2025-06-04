// @ts-ignore - pdf2pic doesn't have TypeScript definitions
import { fromBuffer } from 'pdf2pic';

export interface PdfConversionOptions {
  quality?: number;
  format?: 'jpeg' | 'png';
  density?: number;
  saveFilename?: string;
  savePath?: string;
}

export interface ConversionResult {
  success: boolean;
  imageBuffers: Buffer[];
  error?: string;
}

/**
 * PDF to Image Converter Service using pdf2pic
 * Converts PDF documents to images for OCR processing
 */
export class PdfConverter {
  private static instance: PdfConverter;
  
  private constructor() {}
  
  public static getInstance(): PdfConverter {
    if (!PdfConverter.instance) {
      PdfConverter.instance = new PdfConverter();
    }
    return PdfConverter.instance;
  }
  
  /**
   * Convert PDF buffer to image buffers using pdf2pic
   */
  async convertPdfToImages(
    pdfBuffer: Buffer, 
    options: PdfConversionOptions = {}
  ): Promise<{ success: boolean; imageBuffers: Buffer[]; error?: string }> {
    try {
      // Configure pdf2pic options
      const convert = fromBuffer(pdfBuffer, {
        density: options.density || 200,           // DPI for better quality
        saveFilename: options.saveFilename || "page",
        savePath: options.savePath || "./temp",
        format: options.format || "png",
        width: 1920,                               // Max width for good OCR
        height: 1080                               // Max height
      });
      
      // Convert all pages to base64
      const results = await convert.bulk(-1, { responseType: "base64" });
      
      if (!results || results.length === 0) {
        throw new Error('PDF conversion failed - no images generated');
      }
      
      // Convert base64 results to buffers
      const imageBuffers: Buffer[] = [];
      for (const result of results) {
        if (result.base64) {
          const buffer = Buffer.from(result.base64, 'base64');
          imageBuffers.push(buffer);
        }
      }
      
      if (imageBuffers.length === 0) {
        throw new Error('No valid images generated from PDF');
      }
      
      return {
        success: true,
        imageBuffers
      };
      
    } catch (error) {
      console.error('PDF conversion error:', error);
      return {
        success: false,
        imageBuffers: [],
        error: error instanceof Error ? error.message : 'Unknown conversion error'
      };
    }
  }
  
  /**
   * Get first page of PDF as image buffer (optimized for OCR)
   */
  async getFirstPageAsImage(
    pdfBuffer: Buffer,
    format: 'jpeg' | 'png' = 'png',
    quality: number = 200
  ): Promise<{ success: boolean; imageBuffer?: Buffer; error?: string }> {
    try {
      // Configure pdf2pic for single page with high quality
      const convert = fromBuffer(pdfBuffer, {
        density: quality,                          // DPI for OCR quality
        saveFilename: "ocr_page",
        savePath: "./temp",
        format: format,
        width: 2048,                               // High resolution for OCR
        height: 2048
      });
      
      // Convert only first page
      const result = await convert(1, { responseType: "base64" });
      
      if (!result || !result.base64) {
        throw new Error('Failed to convert first page of PDF');
      }
      
      const imageBuffer = Buffer.from(result.base64, 'base64');
      
      return {
        success: true,
        imageBuffer
      };
      
    } catch (error) {
      console.error('First page conversion error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'First page conversion failed'
      };
    }
  }
  
  /**
   * Get specific page from PDF as image buffer
   */
  async getPageAsImage(
    pdfBuffer: Buffer,
    pageNumber: number,
    format: 'jpeg' | 'png' = 'png',
    density: number = 200
  ): Promise<{ success: boolean; imageBuffer?: Buffer; error?: string }> {
    try {
      const convert = fromBuffer(pdfBuffer, {
        density: density,
        saveFilename: `page_${pageNumber}`,
        savePath: "./temp",
        format: format,
        width: 1920,
        height: 1080
      });
      
      const result = await convert(pageNumber, { responseType: "base64" });
      
      if (!result || !result.base64) {
        throw new Error(`Failed to convert page ${pageNumber} of PDF`);
      }
      
      const imageBuffer = Buffer.from(result.base64, 'base64');
      
      return {
        success: true,
        imageBuffer
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : `Page ${pageNumber} conversion failed`
      };
    }
  }
  
  /**
   * Check if PDF conversion is available
   */
  isAvailable(): boolean {
    try {
      return typeof fromBuffer === 'function';
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Get PDF info (number of pages, etc.)
   */
  async getPdfInfo(pdfBuffer: Buffer): Promise<{ pageCount?: number; error?: string }> {
    try {
      // Try to convert first page to get info
      const convert = fromBuffer(pdfBuffer, {
        density: 72,  // Low density for info only
        format: "png"
      });
      
      // This will tell us if PDF is valid
      const result = await convert(1, { responseType: "base64" });
      
      if (result && result.base64) {
        return { pageCount: 1 }; // Basic info - pdf2pic doesn't provide page count directly
      } else {
        return { error: 'Invalid PDF or conversion failed' };
      }
      
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'PDF info extraction failed' 
      };
    }
  }
}