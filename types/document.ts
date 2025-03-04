export type DocumentType = 
  | 'invoice'           // Rechnungen
  | 'contract_change'   // Vertragsänderungen
  | 'accident_report'   // Unfallmeldungen
  | 'damage_report'     // Schadenmeldungen
  | 'misc';            // Diverses

export interface DocumentMetadata {
  originalName: string;
  size: number;
  mimeType: string;
  uploadedBy: {
    name: string;
    email: string;
    phone?: string;
    id?: string;
  };
  uploadedAt: string;
  source: 'email' | 'chat';
  classification?: {
    type: DocumentType;
    confidence: number;
  };
  extractedData?: Record<string, any>;
}

export interface ProcessingStatus {
  status: 'eingereicht' | 'in_bearbeitung' | 'abgeschlossen' | 'archiviert' | 'storniert';
  progress: number;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface Document {
  id: string;
  type: DocumentType;
  status: ProcessingStatus;
  metadata: DocumentMetadata;
  filePath: string;
  createdAt: string;
  updatedAt: string;
} 