import { Document } from './types';
import { ProcessingResult, ProcessingOptions, DEFAULT_PROCESSING_OPTIONS } from '@/types/processing';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';

export class DocumentAgent {
  private static instance: DocumentAgent | null = null;
  private openai: OpenAI;

  private constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  public static getInstance(): DocumentAgent {
    if (!DocumentAgent.instance) {
      DocumentAgent.instance = new DocumentAgent();
    }
    return DocumentAgent.instance;
  }

  public async processDocument(
    document: Document,
    options: ProcessingOptions = DEFAULT_PROCESSING_OPTIONS
  ): Promise<ProcessingResult> {
    try {
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`${document.metadata.uploadedBy.name}/${document.fileName}`, document.file);

      if (uploadError) throw uploadError;

      // Create database entry
      const { data: dbData, error: dbError } = await supabase
        .from('documents')
        .insert({
          file_name: document.fileName,
          file_path: uploadData.path,
          file_type: document.mimeType,
          document_type: 'unclassified',
          status: 'processing',
          metadata: document.metadata,
          uploaded_by: document.metadata.uploadedBy.email
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return {
        success: true,
        processId: dbData.id,
        documentId: dbData.id,
        metadata: {
          filePath: uploadData.path,
          ...document.metadata
        }
      };
    } catch (error) {
      console.error('Document processing error:', error);
      return {
        success: false,
        processId: 'error',
        error: {
          code: 'PROCESSING_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error
        }
      };
    }
  }
} 