import { Document } from '../../types/document';
import { BaseAgent, AgentOptions, AgentResult } from '../../interfaces/BaseAgent';
import { ProcessingStage } from '../../types/coordination';

/**
 * DocumentAgent - verantwortlich für die grundlegende Dokumentenverarbeitung
 * Dies ist eine vereinfachte Beispielimplementation
 */
export class DocumentAgent implements BaseAgent {
  private static instance: DocumentAgent | null = null;
  readonly type = 'document';
  
  private constructor() {
    // Initialisierung
  }
  
  /**
   * Gibt die Singleton-Instanz des DocumentAgent zurück
   */
  public static getInstance(): DocumentAgent {
    if (!DocumentAgent.instance) {
      DocumentAgent.instance = new DocumentAgent();
    }
    return DocumentAgent.instance;
  }
  
  /**
   * Implementierung des BaseAgent-Interface
   * Verarbeitet ein Dokument entsprechend der aktuellen Verarbeitungsstufe
   */
  public async process(document: Document, options?: AgentOptions): Promise<AgentResult> {
    console.log(`Processing document ${document.id} with DocumentAgent`);
    
    try {
      // Je nach Verarbeitungsstufe führen wir unterschiedliche Aktionen aus
      const stage = options?.documentState?.currentStage || 'initial';
      
      switch (stage) {
        case 'initial':
          return this.handleInitialStage(document);
        case 'uploaded':
          return this.handleUploadedStage(document);
        case 'completed':
          return this.handleCompletedStage(document);
        default:
          return {
            success: false,
            error: {
              code: 'UNSUPPORTED_STAGE',
              message: `DocumentAgent does not support stage: ${stage}`,
              retryable: false
            }
          };
      }
    } catch (error) {
      console.error('Error in DocumentAgent.process:', error);
      return {
        success: false,
        error: {
          code: 'DOCUMENT_PROCESSING_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error,
          retryable: true
        }
      };
    }
  }
  
  /**
   * Prüft, ob der Agent eine bestimmte Verarbeitungsstufe unterstützt
   */
  public canHandle(stage: ProcessingStage, document: Document): boolean {
    // DocumentAgent kann die folgenden Stufen bearbeiten
    return ['initial', 'uploaded', 'completed'].includes(stage);
  }
  
  /**
   * Gibt den aktuellen Status des Agenten zurück
   */
  public getStatus(): { available: boolean; busy: boolean; queue: number } {
    // In dieser einfachen Implementation ist der Agent immer verfügbar
    return {
      available: true,
      busy: false,
      queue: 0
    };
  }
  
  /**
   * Ressourcen bereinigen
   */
  public async shutdown(): Promise<void> {
    // Keine speziellen Ressourcen zu bereinigen
    console.log('DocumentAgent shutting down');
    return Promise.resolve();
  }
  
  /**
   * Verarbeitet ein Dokument im Anfangsstadium
   */
  private async handleInitialStage(document: Document): Promise<AgentResult> {
    // Simuliere Verarbeitung: Validiere das Dokument und bereite es vor
    await this.simulateProcessingDelay(200);
    
    // Prüfe, ob alle erforderlichen Felder vorhanden sind
    if (!document.fileName) {
      return {
        success: false,
        error: {
          code: 'MISSING_FILENAME',
          message: 'Document filename is required',
          retryable: false
        }
      };
    }
    
    // Bereite das Dokument für die nächste Stufe vor
    return {
      success: true,
      data: {
        ...document,
        metadata: {
          ...document.metadata,
          processStart: new Date().toISOString(),
          systemVersion: '1.0.0'
        }
      },
      confidence: 1.0,
      metadata: {
        processingTime: 200,
        initialValidation: 'passed'
      }
    };
  }
  
  /**
   * Verarbeitet ein hochgeladenes Dokument
   */
  private async handleUploadedStage(document: Document): Promise<AgentResult> {
    // Simuliere Verarbeitung: Prüfe Dateityp, Größe, etc.
    await this.simulateProcessingDelay(300);
    
    // Prüfe Dateityp
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
    if (document.mimeType && !validTypes.includes(document.mimeType)) {
      return {
        success: false,
        error: {
          code: 'INVALID_FILE_TYPE',
          message: `File type ${document.mimeType} is not supported`,
          retryable: false
        }
      };
    }
    
    // Bereite das Dokument für die Klassifizierung vor
    return {
      success: true,
      data: {
        ...document,
        metadata: {
          ...document.metadata,
          uploadValidated: true,
          validatedAt: new Date().toISOString()
        }
      },
      confidence: 1.0,
      metadata: {
        processingTime: 300,
        fileValidation: 'passed'
      }
    };
  }
  
  /**
   * Abschlussverarbeitung eines Dokuments
   */
  private async handleCompletedStage(document: Document): Promise<AgentResult> {
    // Simuliere Verarbeitung: Speichere das fertige Dokument in der Datenbank
    await this.simulateProcessingDelay(100);
    
    return {
      success: true,
      data: {
        ...document,
        metadata: {
          ...document.metadata,
          completedAt: new Date().toISOString(),
          status: 'completed'
        }
      },
      confidence: 1.0,
      metadata: {
        processingTime: 100,
        finalStatus: 'completed',
        totalProcessingTime: Date.now() - (document.metadata?.processStart ? new Date(document.metadata.processStart).getTime() : Date.now())
      }
    };
  }
  
  /**
   * Simuliert eine Verarbeitungsverzögerung
   */
  private simulateProcessingDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default DocumentAgent; 