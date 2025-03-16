import { Document } from '../types/document';
import { ProcessingStage } from '../types/coordination';

/**
 * Optionen für die Verarbeitung durch einen Agenten
 */
export interface AgentOptions {
  timeout?: number;
  retryCount?: number;
  requiredConfidence?: number;
  [key: string]: any;
}

/**
 * Ergebnis der Verarbeitung durch einen Agenten
 */
export interface AgentResult<T = any> {
  success: boolean;
  data?: T;
  confidence?: number;
  error?: {
    code: string;
    message: string;
    details?: any;
    retryable: boolean;
  };
  metadata?: Record<string, any>;
}

/**
 * Basis-Interface für alle Agenten im System
 */
export interface BaseAgent {
  /**
   * Name/Typ des Agenten
   */
  readonly type: string;
  
  /**
   * Verarbeitet ein Dokument oder Teile davon
   */
  process(document: Document, options?: AgentOptions): Promise<AgentResult>;
  
  /**
   * Prüft, ob der Agent für eine bestimmte Verarbeitungsstufe zuständig ist
   */
  canHandle(stage: ProcessingStage, document: Document): boolean;
  
  /**
   * Gibt den Status des Agenten zurück
   */
  getStatus(): { available: boolean; busy: boolean; queue: number };
  
  /**
   * Herunterfahren des Agenten (Ressourcen freigeben)
   */
  shutdown(): Promise<void>;
} 