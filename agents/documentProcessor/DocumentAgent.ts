import { Document } from './types';
import { ProcessingResult, ProcessingOptions, DEFAULT_PROCESSING_OPTIONS } from '@/types/processing';
import { supabase } from '@/services/supabaseClient';
import OpenAI from 'openai';

export class DocumentAgent {
  private static instance: DocumentAgent | null = null;
  private openai: OpenAI;

  private constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
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
      console.log('DocumentAgent: Starte Dokumentenverarbeitung', {
        fileName: document.fileName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        userData: document.metadata.uploadedBy
      });

      // Generiere einen eindeutigen Dateinamen
      const generateUniqueFileName = (originalName: string): string => {
        // Extrahiere Dateinamensbestandteile
        const extension = originalName.includes('.') 
          ? originalName.substring(originalName.lastIndexOf('.')) 
          : '';
        const baseName = originalName.includes('.')
          ? originalName.substring(0, originalName.lastIndexOf('.'))
          : originalName;
          
        // Entferne ungültige Zeichen wie #, %, /, etc.
        const cleanBaseName = baseName.replace(/[#%\/\\\s&?+<>:]/g, '_');
        
        // Generiere Zeitstempel im Format YYYYMMDD-HHmmss
        const now = new Date();
        const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        
        // Generiere eine zufällige 4-stellige Zahl für zusätzliche Einzigartigkeit
        const randomId = Math.floor(1000 + Math.random() * 9000);
        
        // Stelle den eindeutigen Namen zusammen
        return `${cleanBaseName}_${timestamp}_${randomId}${extension}`;
      };

      // Erstelle den eindeutigen Dateinamen
      const uniqueFileName = generateUniqueFileName(document.fileName);
      console.log('DocumentAgent: Generierter eindeutiger Dateiname:', uniqueFileName);

      // Upload to Supabase Storage mit eindeutigem Namen
      console.log('DocumentAgent: Lade Dokument in Supabase Storage hoch...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`${document.metadata.uploadedBy.name}/${uniqueFileName}`, document.file, {
          cacheControl: '3600',
          upsert: false // Kein Überschreiben, da wir jetzt eindeutige Namen haben
        });

      if (uploadError) {
        console.error('DocumentAgent: Fehler beim Hochladen in Supabase Storage:', uploadError);
        throw uploadError;
      }
      
      console.log('DocumentAgent: Dokument erfolgreich hochgeladen:', uploadData);

      // Create database entry
      console.log('DocumentAgent: Erstelle Datenbankeintrag...');
      const { data: dbData, error: dbError } = await supabase
        .from('documents')
        .insert({
          file_name: document.fileName, // Original-Dateiname für die Anzeige
          file_path: uploadData.path, // Pfad mit eindeutigem Namen
          file_type: document.mimeType,
          document_type: 'unclassified',
          status: 'in_bearbeitung',
          metadata: {
            ...document.metadata,
            originalName: document.fileName,
            uniqueName: uniqueFileName
          },
          uploaded_by: document.metadata.uploadedBy.email
        })
        .select()
        .single();

      if (dbError) {
        console.error('DocumentAgent: Fehler beim Erstellen des Datenbankeintrags:', dbError);
        throw dbError;
      }
      
      console.log('DocumentAgent: Datenbankeintrag erfolgreich erstellt:', dbData);

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
      console.error('DocumentAgent: Fehler bei der Dokumentenverarbeitung:', error);
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