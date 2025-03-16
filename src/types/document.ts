/**
 * Repräsentiert ein Dokument im System
 */
export interface Document {
  /**
   * Eindeutige ID des Dokuments
   */
  id?: string;
  
  /**
   * Dateiinhalt als Buffer, wenn es sich um eine Datei handelt
   */
  file?: Buffer | Uint8Array | string;
  
  /**
   * Dateiname
   */
  fileName?: string;
  
  /**
   * MIME-Typ des Dokuments
   */
  mimeType?: string;
  
  /**
   * Größe der Datei in Bytes
   */
  fileSize?: number;
  
  /**
   * Extrahierter Text aus dem Dokument (falls OCR bereits durchgeführt wurde)
   */
  text?: string;
  
  /**
   * Klassifizierter Typ des Dokuments
   */
  documentType?: string;
  
  /**
   * Konfidenz der Klassifizierung (0-1)
   */
  classificationConfidence?: number;
  
  /**
   * Extrahierte strukturierte Daten aus dem Dokument
   */
  extractedData?: Record<string, any>;
  
  /**
   * Zeitpunkt der letzten Änderung
   */
  updatedAt?: string;
  
  /**
   * Zeitpunkt der Erstellung
   */
  createdAt?: string;
  
  /**
   * Zusätzliche Metadaten zum Dokument
   */
  metadata?: Record<string, any>;
} 