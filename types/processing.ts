export type ProcessingState = 
  | 'queued' 
  | 'processing'
  | 'processing_ocr'
  | 'processing_classification'
  | 'processing_storage'
  | 'completed' 
  | 'failed';

export type ProcessingStep = 
  | 'upload'
  | 'validation'
  | 'classification'
  | 'extraction'
  | 'analysis'
  | 'storage'
  | 'ocr';

export interface ProcessingProgress {
  processId: string;
  status: ProcessingState;
  currentStep: ProcessingStep;
  progress: number;
  message: string;
  error?: ProcessingError;
  startedAt: string;
  completedAt?: string;
}

export interface ProcessingError {
  code: string;
  message: string;
  step?: ProcessingStep;
  retryCount?: number;
  timestamp?: string;
  details?: unknown;
}

export interface ProcessingOptions {
  priority?: 'low' | 'normal' | 'high';
  retryAttempts?: number;
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  validateOnly?: boolean;
}

export const DEFAULT_PROCESSING_OPTIONS: ProcessingOptions = {
  priority: 'normal',
  retryAttempts: 3,
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  validateOnly: false,
};

export interface ProcessingResult {
  success: boolean;
  processId: string;
  documentId?: string;
  error?: ProcessingError;
  metadata?: Record<string, unknown>;
  message?: string;
} 