// src/types/coordination.ts

import { Document } from './document';

// Verfügbare Agententypen im System
export type AgentType = 
  | 'document' 
  | 'classification' 
  | 'ocr' 
  | 'extraction' 
  | 'feedback';

// Verarbeitungsstadien eines Dokuments
export type ProcessingStage = 
  | 'initial'
  | 'uploaded'
  | 'classified'
  | 'ocr_processed'
  | 'data_extracted'
  | 'validation_needed'
  | 'human_review'
  | 'completed'
  | 'error';

// Prioritätsstufen für die Verarbeitung
export type Priority = 'low' | 'normal' | 'high' | 'urgent';

// Status der Dokumentenverarbeitung
export interface DocumentProcessingState {
  documentId: string;
  document: Document;
  currentStage: ProcessingStage;
  nextStage?: ProcessingStage;
  assignedAgent?: AgentType;
  history: ProcessingHistoryEntry[];
  startTime: number;
  lastUpdated: number;
  priority: Priority;
  retryCount: number;
  error?: ProcessingError;
  metadata: Record<string, any>;
}

// Einzelner Eintrag im Verarbeitungsverlauf
export interface ProcessingHistoryEntry {
  stage: ProcessingStage;
  agent: AgentType;
  startTime: number;
  endTime: number;
  success: boolean;
  error?: ProcessingError;
  result?: any;
}

// Fehlerinformationen
export interface ProcessingError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
}

// Ergebnis der Dokumentenverarbeitung
export interface ProcessingResult {
  success: boolean;
  documentId: string;
  stages: ProcessingStage[];
  error?: ProcessingError;
  result?: any;
}

// Konfiguration für den Koordinationsagenten
export interface CoordinationConfig {
  maxRetries: number;
  retryDelay: number;
  defaultPriority: Priority;
  confidenceThresholds: Record<ProcessingStage, number>;
  agentTimeouts: Record<AgentType, number>;
} 