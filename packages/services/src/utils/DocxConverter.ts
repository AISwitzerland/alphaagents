import mammoth from 'mammoth';
import { LoggerService } from '../logging/LoggerService';

export interface DocxConversionResult {
  success: boolean;
  text: string;
  error?: string;
}

/**
 * DOCX to Text Converter Service using mammoth
 * Extracts text content from .docx files for processing
 */
export class DocxConverter {
  private static instance: DocxConverter;
  private logger: LoggerService;
  
  private constructor() {
    this.logger = LoggerService.getInstance().child({ component: 'docx-converter' });
  }
  
  public static getInstance(): DocxConverter {
    if (!DocxConverter.instance) {
      DocxConverter.instance = new DocxConverter();
    }
    return DocxConverter.instance;
  }
  
  /**
   * Convert DOCX buffer to plain text
   */
  async convertDocxToText(docxBuffer: Buffer): Promise<DocxConversionResult> {
    try {
      this.logger.debug('Starting DOCX to text conversion', {
        bufferSize: docxBuffer.length
      });

      // Use mammoth to extract text from DOCX
      const result = await mammoth.extractRawText({ buffer: docxBuffer });
      
      if (!result.value || result.value.trim().length === 0) {
        const error = 'No text content extracted from DOCX file';
        this.logger.warn(error);
        return {
          success: false,
          text: '',
          error
        };
      }

      this.logger.info('DOCX conversion successful', {
        textLength: result.value.length,
        wordCount: result.value.split(/\s+/).length,
        hasWarnings: result.messages && result.messages.length > 0
      });

      // Log any conversion warnings
      if (result.messages && result.messages.length > 0) {
        this.logger.debug('DOCX conversion warnings', {
          warnings: result.messages.map(msg => msg.message)
        });
      }

      return {
        success: true,
        text: result.value,
        error: undefined
      };

    } catch (error) {
      const errorMessage = `DOCX conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error('DOCX conversion error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        bufferSize: docxBuffer.length
      });

      return {
        success: false,
        text: '',
        error: errorMessage
      };
    }
  }

  /**
   * Check if file is a DOCX file based on buffer content
   */
  isDocxFile(buffer: Buffer): boolean {
    try {
      // DOCX files are ZIP archives, check for ZIP signature
      const zipSignature = buffer.slice(0, 4);
      const isPkZip = zipSignature[0] === 0x50 && zipSignature[1] === 0x4B;
      
      // Also check for DOCX-specific content if it's a ZIP
      if (isPkZip && buffer.length > 100) {
        const contentStr = buffer.toString('utf-8', 0, Math.min(1000, buffer.length));
        return contentStr.includes('word/') || contentStr.includes('docProps/');
      }
      
      return isPkZip;
    } catch (error) {
      this.logger.warn('Error checking DOCX file signature', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  /**
   * Get mime type for DOCX files
   */
  getDocxMimeType(): string {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
}