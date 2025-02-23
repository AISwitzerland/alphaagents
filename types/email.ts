export interface EmailMetadata {
  documentType: string;
  processId: string;
  timestamp: string;
  [key: string]: string | number | boolean;
}

export interface EmailData {
  documentType: string;
  metadata: EmailMetadata;
  extractedText: string;
  processId: string;
  recipient?: string;
}

export interface DocumentUploadNotification {
  documentId: string;
  fileName: string;
  uploadedBy: {
    name?: string;
    email?: string;
    phone?: string;
    source: 'chat' | 'dashboard';
  };
  documentType: string;
  uploadedAt: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface AppointmentEmailData {
  name: string;
  email: string;
  telefon: string;
  termin_datum: Date;
  notizen?: string;
} 