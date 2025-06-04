import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '../config/ConfigService';
import { LoggerService } from '../logging/LoggerService';
import { ErrorHandler, ErrorCodes, ExternalServiceError } from '../../../core/src/errors/ErrorHandler';

/**
 * Database table definitions for AlphaAgents
 */

// === APPOINTMENT MANAGEMENT ===
export interface AppointmentRecord {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  appointment_type: 'consultation' | 'claim_review' | 'contract_discussion' | 'general';
  preferred_date: string;
  preferred_time: string;
  reason?: string;
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  agent_id?: string;
  session_id?: string;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
}

// === QUOTE MANAGEMENT ===
export interface QuoteRecord {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  insurance_type: 'krankenversicherung' | 'unfallversicherung' | 'haftpflichtversicherung' | 'sachversicherung' | 'lebensversicherung';
  coverage_details?: Record<string, any>;
  estimated_premium?: number;
  premium_currency: string;
  coverage_amount?: number;
  deductible?: number;
  additional_info?: Record<string, any>;
  status: 'requested' | 'calculated' | 'sent' | 'accepted' | 'declined' | 'expired';
  valid_until: string;
  agent_id?: string;
  session_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentRecord {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  document_type?: string;
  status: 'eingereicht' | 'in_bearbeitung' | 'verarbeitet' | 'abgeschlossen' | 'abgelehnt' | 'storniert' | 'archiviert';
  user_id?: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  extracted_text?: string;
  extracted_data?: Record<string, any>;
  confidence_score?: number;
  processing_notes?: string;
  created_at: string;
  updated_at: string;
  processed_at?: string;
}

export interface AgentLogRecord {
  id: string;
  agent_id: string;
  agent_name: string;
  session_id: string;
  user_id?: string;
  execution_id?: string;
  level: string;
  message: string;
  data?: Record<string, any>;
  error_details?: Record<string, any>;
  execution_time?: number;
  created_at: string;
}

export interface HealthCheckRecord {
  id: string;
  agent_id: string;
  agent_name: string;
  healthy: boolean;
  status: string;
  message?: string;
  metrics: Record<string, any>;
  created_at: string;
}

/**
 * Database query options
 */
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
  filters?: Record<string, any>;
}

/**
 * Supabase Service for AlphaAgents
 * 
 * Provides database operations, file storage, and real-time subscriptions
 * with proper error handling and logging.
 */
export class SupabaseService {
  private static instance: SupabaseService;
  private client!: SupabaseClient;
  private logger: LoggerService;
  private config: ConfigService;
  private errorHandler: ErrorHandler;

  private constructor() {
    this.config = ConfigService.getInstance();
    this.logger = LoggerService.getInstance().child({ component: 'supabase' });
    this.errorHandler = ErrorHandler.getInstance();
    
    this.validateConfiguration();
    this.initializeClient();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  /**
   * Validate required configuration
   */
  private validateConfiguration(): void {
    try {
      this.config.validateFeatureConfig('supabase');
    } catch (error) {
      this.logger.fatal('Supabase configuration validation failed', error);
      throw error;
    }
  }

  /**
   * Initialize Supabase client
   */
  private initializeClient(): void {
    try {
      const supabaseConfig = this.config.getSupabaseConfig();
      
      this.client = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: false
        },
        db: {
          schema: 'public'
        }
      });

      this.logger.info('Supabase client initialized successfully', {
        url: supabaseConfig.url,
        bucket: supabaseConfig.storageBucket
      });
    } catch (error) {
      const supabaseError = this.errorHandler.wrapExternalError(
        ErrorCodes.SUPABASE_ERROR,
        error,
        false
      );
      this.logger.fatal('Failed to initialize Supabase client', supabaseError);
      throw supabaseError;
    }
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from('documents')
        .select('count')
        .limit(1);

      if (error) {
        this.logger.error('Database connection test failed', error);
        return false;
      }

      this.logger.debug('Database connection test successful');
      return true;
    } catch (error) {
      this.logger.error('Database connection test error', error);
      return false;
    }
  }

  // === DOCUMENT OPERATIONS ===

  /**
   * Create new document record
   */
  async createDocument(document: Omit<DocumentRecord, 'id' | 'created_at' | 'updated_at'>): Promise<DocumentRecord> {
    try {
      const { data, error } = await this.client
        .from('documents')
        .insert({
          ...document,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      this.logger.info('Document record created', {
        documentId: data.id,
        fileName: data.file_name,
        fileType: data.file_type
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to create document record', error);
      throw error;
    }
  }

  /**
   * Get document by ID
   */
  async getDocument(id: string): Promise<DocumentRecord | null> {
    try {
      const { data, error } = await this.client
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      return data;
    } catch (error) {
      this.logger.error('Failed to get document', error, { documentId: id });
      throw error;
    }
  }

  /**
   * Update document record
   */
  async updateDocument(id: string, updates: Partial<DocumentRecord>): Promise<DocumentRecord> {
    try {
      const { data, error } = await this.client
        .from('documents')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      this.logger.info('Document record updated', {
        documentId: id,
        updates: Object.keys(updates)
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to update document', error, { documentId: id });
      throw error;
    }
  }

  /**
   * List documents with filtering and pagination
   */
  async listDocuments(options: QueryOptions = {}): Promise<DocumentRecord[]> {
    try {
      let query = this.client
        .from('documents')
        .select('*');

      // Apply filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending ?? false });
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      return data || [];
    } catch (error) {
      this.logger.error('Failed to list documents', error, { options });
      throw error;
    }
  }

  // === FILE STORAGE OPERATIONS ===

  /**
   * Upload file to storage
   */
  async uploadFile(
    filePath: string,
    fileBuffer: Buffer,
    contentType?: string
  ): Promise<{ path: string; publicUrl?: string }> {
    try {
      const bucket = this.config.getSupabaseConfig().storageBucket;
      
      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(filePath, fileBuffer, {
          contentType,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      this.logger.info('File uploaded successfully', {
        path: data.path,
        size: fileBuffer.length,
        contentType
      });

      // Get public URL if needed
      const { data: urlData } = this.client.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return {
        path: data.path,
        publicUrl: urlData.publicUrl
      };
    } catch (error) {
      this.logger.error('Failed to upload file', error, { filePath });
      throw error;
    }
  }

  /**
   * Download file from storage
   */
  async downloadFile(filePath: string): Promise<Buffer> {
    try {
      const bucket = this.config.getSupabaseConfig().storageBucket;
      
      const { data, error } = await this.client.storage
        .from(bucket)
        .download(filePath);

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      const buffer = Buffer.from(await data.arrayBuffer());
      
      this.logger.debug('File downloaded successfully', {
        path: filePath,
        size: buffer.length
      });

      return buffer;
    } catch (error) {
      this.logger.error('Failed to download file', error, { filePath });
      throw error;
    }
  }

  /**
   * Delete file from storage
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      const bucket = this.config.getSupabaseConfig().storageBucket;
      
      const { error } = await this.client.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      this.logger.info('File deleted successfully', { path: filePath });
    } catch (error) {
      this.logger.error('Failed to delete file', error, { filePath });
      throw error;
    }
  }

  // === LOGGING OPERATIONS ===

  /**
   * Log agent activity
   */
  async logAgentActivity(log: Omit<AgentLogRecord, 'id' | 'created_at'>): Promise<void> {
    try {
      const { error } = await this.client
        .from('agent_logs')
        .insert({
          ...log,
          created_at: new Date().toISOString()
        });

      if (error) {
        // Don't throw here to avoid infinite loops in logging
        this.logger.error('Failed to log agent activity to database', error);
      }
    } catch (error) {
      this.logger.error('Error in agent activity logging', error);
    }
  }

  /**
   * Log health check result
   */
  async logHealthCheck(healthCheck: Omit<HealthCheckRecord, 'id' | 'created_at'>): Promise<void> {
    // Health check logging disabled - table was removed during cleanup
    // This prevents errors while maintaining system functionality
    return;
  }

  // === UTILITY METHODS ===

  /**
   * Execute raw SQL query (use with caution)
   */
  async executeQuery(query: string, params?: any[]): Promise<any> {
    try {
      const { data, error } = await this.client.rpc('execute_sql', {
        sql: query,
        params: params || []
      });

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, false);
      }

      return data;
    } catch (error) {
      this.logger.error('Failed to execute raw query', error, { query });
      throw error;
    }
  }

  // === DOCUMENT MANAGEMENT ===

  /**
   * Update document with OCR results
   */
  async updateDocumentOCR(documentId: string, ocrData: {
    ocr_content?: string;
    confidence_score?: number;
    status?: string;
    error_message?: string;
  }): Promise<void> {
    try {
      const { error } = await this.client
        .from('documents')
        .update({
          ...ocrData,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      this.logger.info('Document OCR updated', { documentId });
    } catch (error) {
      this.logger.error('Failed to update document OCR', error);
      throw error;
    }
  }

  /**
   * Create document extraction record
   */
  async createDocumentExtraction(extractionData: {
    document_id: string;
    extracted_data: any;
    status: string;
    user_id?: string;
    error_message?: string;
  }): Promise<any> {
    try {
      const { data, error } = await this.client
        .from('document_extractions')
        .insert({
          ...extractionData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      return data;
    } catch (error) {
      this.logger.error('Failed to create document extraction', error);
      throw error;
    }
  }

  /**
   * Create damage report
   */
  async createDamageReport(reportData: {
    document_id: string;
    versicherungsnummer?: string;
    name: string; // Required: customer name
    adresse: string; // Required: address
    schaden_datum: string; // Required: damage date
    schaden_ort: string; // Required: damage location
    schaden_beschreibung: string; // Required: damage description
    zusammenfassung: string; // Required: summary
    status?: string;
    damage_status?: string;
  }): Promise<any> {
    try {
      const { data, error } = await this.client
        .from('damage_reports')
        .insert({
          document_id: reportData.document_id,
          versicherungsnummer: reportData.versicherungsnummer,
          name: reportData.name,
          adresse: reportData.adresse,
          schaden_datum: reportData.schaden_datum,
          schaden_ort: reportData.schaden_ort,
          schaden_beschreibung: reportData.schaden_beschreibung,
          zusammenfassung: reportData.zusammenfassung,
          status: reportData.status || 'eingereicht',
          damage_status: reportData.damage_status || 'gemeldet',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      this.logger.info('Damage report record created', {
        documentId: reportData.document_id,
        damageDate: reportData.schaden_datum,
        versicherungsnummer: reportData.versicherungsnummer
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to create damage report', error);
      throw error;
    }
  }

  /**
   * Create contract change record (for Kündigungen, Vertragsänderungen)
   */
  async createContractChange(changeData: {
    document_id: string;
    name: string; // Required: customer name
    adresse: string; // Required: address
    aenderung_typ: string; // Required: change type (enum)
    aenderung_beschreibung: string; // Required: description
    zusammenfassung: string; // Required: summary
    status?: string;
  }): Promise<any> {
    try {
      const { data, error } = await this.client
        .from('contract_changes')
        .insert({
          document_id: changeData.document_id,
          name: changeData.name,
          adresse: changeData.adresse,
          aenderung_typ: changeData.aenderung_typ,
          aenderung_beschreibung: changeData.aenderung_beschreibung,
          zusammenfassung: changeData.zusammenfassung,
          status: changeData.status || 'eingereicht',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      this.logger.info('Contract change record created', {
        documentId: changeData.document_id,
        changeType: changeData.aenderung_typ,
        customerName: changeData.name
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to create contract change', error);
      throw error;
    }
  }

  /**
   * Create accident report record (for Unfallberichte)
   */
  async createAccidentReport(reportData: {
    document_id: string;
    schaden_nummer?: string;
    name: string;
    geburtsdatum: string; // Required: date
    ahv_nummer: string; // Required: AHV number
    kontakt_telefon?: string;
    unfall_datum: string; // Required: date
    unfall_zeit: string; // Required: time
    unfall_ort: string; // Required: location
    unfall_beschreibung: string; // Required: description
    verletzung_art: string; // Required: injury type
    verletzung_koerperteil: string; // Required: body part
    status?: string;
  }): Promise<any> {
    try {
      const { data, error } = await this.client
        .from('accident_reports')
        .insert({
          document_id: reportData.document_id,
          schaden_nummer: reportData.schaden_nummer,
          name: reportData.name,
          geburtsdatum: reportData.geburtsdatum,
          ahv_nummer: reportData.ahv_nummer,
          kontakt_telefon: reportData.kontakt_telefon,
          unfall_datum: reportData.unfall_datum,
          unfall_zeit: reportData.unfall_zeit,
          unfall_ort: reportData.unfall_ort,
          unfall_beschreibung: reportData.unfall_beschreibung,
          verletzung_art: reportData.verletzung_art,
          verletzung_koerperteil: reportData.verletzung_koerperteil,
          status: reportData.status || 'eingereicht',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      this.logger.info('Accident report record created', {
        documentId: reportData.document_id,
        accidentDate: reportData.unfall_datum,
        schadenNummer: reportData.schaden_nummer
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to create accident report', error);
      throw error;
    }
  }

  /**
   * Create invoice record (for Rechnungen)
   */
  async createInvoice(invoiceData: {
    document_id: string;
    rechnungsnummer?: string;
    rechnungsdatum: string; // Required: invoice date
    faelligkeitsdatum: string; // Required: due date
    betrag: number; // Required: amount
    waehrung: string; // Required: currency
    empfaenger: string; // Required: recipient
    beschreibung: string; // Required: description
    zusammenfassung: string; // Required: summary
    status?: string;
    invoice_status?: string;
  }): Promise<any> {
    try {
      const { data, error } = await this.client
        .from('invoices')
        .insert({
          document_id: invoiceData.document_id,
          rechnungsnummer: invoiceData.rechnungsnummer,
          rechnungsdatum: invoiceData.rechnungsdatum,
          faelligkeitsdatum: invoiceData.faelligkeitsdatum,
          betrag: invoiceData.betrag,
          waehrung: invoiceData.waehrung,
          empfaenger: invoiceData.empfaenger,
          beschreibung: invoiceData.beschreibung,
          zusammenfassung: invoiceData.zusammenfassung,
          status: invoiceData.status || 'eingereicht',
          invoice_status: invoiceData.invoice_status || 'ausstehend',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      this.logger.info('Invoice record created', {
        documentId: invoiceData.document_id,
        invoiceNumber: invoiceData.rechnungsnummer,
        amount: invoiceData.betrag,
        recipient: invoiceData.empfaenger
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to create invoice', error);
      throw error;
    }
  }

  /**
   * Create miscellaneous document record (for sonstige Dokumente)
   */
  async createMiscellaneousDocument(docData: {
    document_id: string;
    title: string; // Required: document title
    document_date?: string; // Optional: document date
    summary: string; // Required: summary
    status?: string;
  }): Promise<any> {
    try {
      const { data, error } = await this.client
        .from('miscellaneous_documents')
        .insert({
          document_id: docData.document_id,
          title: docData.title,
          document_date: docData.document_date,
          summary: docData.summary,
          status: docData.status || 'eingereicht',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      this.logger.info('Miscellaneous document record created', {
        documentId: docData.document_id,
        title: docData.title
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to create miscellaneous document', error);
      throw error;
    }
  }

  // === APPOINTMENT OPERATIONS ===

  /**
   * Create new appointment record
   */
  async createAppointment(appointment: Omit<AppointmentRecord, 'id' | 'created_at' | 'updated_at'>): Promise<AppointmentRecord> {
    try {
      const { data, error } = await this.client
        .from('appointments')
        .insert({
          ...appointment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      this.logger.info('Appointment record created', {
        appointmentId: data.id,
        customerName: data.customer_name,
        appointmentType: data.appointment_type,
        preferredDate: data.preferred_date
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to create appointment record', error);
      throw error;
    }
  }

  /**
   * Update appointment status
   */
  async updateAppointmentStatus(appointmentId: string, status: AppointmentRecord['status'], notes?: string): Promise<AppointmentRecord> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (notes) {
        updateData.notes = notes;
      }

      if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      }

      const { data, error } = await this.client
        .from('appointments')
        .update(updateData)
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      this.logger.info('Appointment status updated', {
        appointmentId,
        newStatus: status,
        notes
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to update appointment status', error);
      throw error;
    }
  }

  // === QUOTE OPERATIONS ===

  /**
   * Create new quote record
   */
  async createQuote(quote: Omit<QuoteRecord, 'id' | 'created_at' | 'updated_at'>): Promise<QuoteRecord> {
    try {
      const { data, error } = await this.client
        .from('quotes')
        .insert({
          ...quote,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      this.logger.info('Quote record created', {
        quoteId: data.id,
        customerName: data.customer_name,
        insuranceType: data.insurance_type,
        estimatedPremium: data.estimated_premium
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to create quote record', error);
      throw error;
    }
  }

  /**
   * Update quote status
   */
  async updateQuoteStatus(quoteId: string, status: QuoteRecord['status'], estimatedPremium?: number): Promise<QuoteRecord> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (estimatedPremium !== undefined) {
        updateData.estimated_premium = estimatedPremium;
      }

      const { data, error } = await this.client
        .from('quotes')
        .update(updateData)
        .eq('id', quoteId)
        .select()
        .single();

      if (error) {
        throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, error, true);
      }

      this.logger.info('Quote status updated', {
        quoteId,
        newStatus: status,
        estimatedPremium
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to update quote status', error);
      throw error;
    }
  }

  /**
   * Get table schema information (temporary debug method)
   */
  async getTableSchema(tableName: string): Promise<any[]> {
    try {
      const { data, error } = await this.client
        .rpc('get_table_columns', { table_name_param: tableName });
      
      if (error) {
        // Fallback: try direct query
        const { error: fallbackError } = await this.client
          .from(tableName)
          .select('*')
          .limit(0);
        
        if (fallbackError) {
          throw this.errorHandler.wrapExternalError(ErrorCodes.SUPABASE_ERROR, fallbackError, true);
        }
        
        return [{ message: 'Schema query failed, but table exists', tableName }];
      }
      
      return data || [];
    } catch (error) {
      this.logger.error('Failed to get table schema', error);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<Record<string, number>> {
    try {
      const stats: Record<string, number> = {};

      // Count documents by status
      const { data: docStats, error: docError } = await this.client
        .from('documents')
        .select('status')
        .neq('status', null);

      if (!docError && docStats) {
        const statusCounts = docStats.reduce((acc, doc) => {
          acc[doc.status] = (acc[doc.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        Object.assign(stats, statusCounts);
      }

      return stats;
    } catch (error) {
      this.logger.error('Failed to get database statistics', error);
      return {};
    }
  }

  /**
   * Close database connection
   */
  async dispose(): Promise<void> {
    try {
      // Supabase client doesn't need explicit cleanup
      this.logger.info('Supabase service disposed');
    } catch (error) {
      this.logger.error('Error disposing Supabase service', error);
    }
  }
}