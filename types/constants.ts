// Erlaubte Dateitypen
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Maximale Dateigröße (20MB)
export const MAX_FILE_SIZE = 20 * 1024 * 1024;

// Verarbeitungskonstanten
export const PROCESSING_CONSTANTS = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 Sekunde
  TIMEOUT: 30000,    // 30 Sekunden
};

// Supabase Tabellennamen
export const TABLES = {
  DOCUMENTS: 'documents',
  PROCESSING_STATUS: 'processing_status',
  EXTRACTED_DATA: 'extracted_data',
};

export const API = {
  RESEND: {
    BASE_URL: 'https://api.resend.com',
    VERSION: 'v1',
  },
  SUPABASE: {
    FUNCTIONS: {
      SEND_APPOINTMENT_EMAIL: 'send-appointment-email',
    },
  },
} as const; 