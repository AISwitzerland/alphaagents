import { BaseAgent } from '../../../core/src/agents/BaseAgent';
import { AgentContext, AgentResult, AgentConfig, LogLevel } from '../../../shared/src/types/agent';
import { ErrorHandler, ErrorCodes, ExternalServiceError } from '../../../core/src/errors/ErrorHandler';
import { DIContainer, ServiceTokens } from '../../../core/src/container/DIContainer';
import { LoggerService, SupabaseService } from '../../../services/src';
import { GoogleEmailService } from '../../../services/src/email/GoogleEmailService';
import { DocumentAgent } from '../document/DocumentAgent';
import { OCRAgent } from '../ocr/OCRAgent';
import { EmailNotificationService } from '../../../services/src/email/EmailNotificationService';

/**
 * Email Monitor Agent Input/Output Types
 */
export interface EmailMonitorInput {
  action: 'checkInbox' | 'processEmail' | 'startMonitoring' | 'stopMonitoring';
  emailId?: string;
  maxEmails?: number;
  includeRead?: boolean;
  timeRange?: {
    since?: Date;
    until?: Date;
  };
  filters?: {
    from?: string[];
    subject?: string[];
    hasAttachments: boolean;
  };
}

export interface EmailMonitorOutput {
  status: 'success' | 'error';
  message: string;
  processedEmails?: ProcessedEmailResult[];
  totalEmails?: number;
  skippedEmails?: number;
  errorCount?: number;
  monitoring?: {
    isActive: boolean;
    nextCheck?: Date;
    interval?: number;
  };
}

export interface ProcessedEmailResult {
  emailId: string;
  from: string;
  subject: string;
  receivedAt: Date;
  attachments: ProcessedAttachment[];
  documentsCreated: number;
  ocrResults: any[];
  status: 'success' | 'partial' | 'failed';
  errorMessage?: string;
}

export interface ProcessedAttachment {
  filename: string;
  mimeType: string;
  size: number;
  documentId?: string;
  ocrResult?: any;
  status: 'success' | 'failed';
  errorMessage?: string;
}

/**
 * Email Monitor Agent - Gmail Integration für automatische Dokumentenverarbeitung
 * 
 * Der Email Monitor Agent:
 * - Überwacht Gmail Inbox auf neue E-Mails mit Anhängen
 * - Filtert nur relevante Dokumentenformate (PDF, PNG, JPG, DOCX, WebP)
 * - Ignoriert E-Mails ohne Anhänge oder mit irrelevanten Dateien
 * - Verarbeitet Anhänge automatisch mit DocumentAgent und OCRAgent
 * - Sendet Benachrichtigungen über verarbeitete Dokumente
 * - Unterstützt sowohl manuelle Checks als auch kontinuierliches Monitoring
 */
export class EmailMonitorAgent extends BaseAgent<EmailMonitorInput, EmailMonitorOutput> {
  private container: DIContainer;
  private logger!: LoggerService;
  private supabase!: SupabaseService;
  private googleEmail!: GoogleEmailService;
  private documentAgent!: DocumentAgent;
  private ocrAgent!: OCRAgent;
  private emailNotification!: EmailNotificationService;
  private errorHandler!: ErrorHandler;

  // Monitoring state
  private isMonitoring = false;
  private monitoringInterval?: NodeJS.Timeout;
  private readonly DEFAULT_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

  // Supported file types and constraints
  private readonly SUPPORTED_MIME_TYPES = [
    'application/pdf',
    'image/png',
    'image/jpeg', 
    'image/jpg',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  ];

  private readonly SUPPORTED_EXTENSIONS = [
    '.pdf', '.png', '.jpg', '.jpeg', '.webp', '.docx'
  ];

  private readonly MIN_FILE_SIZE = 1024; // 1KB minimum
  private readonly MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB maximum (Gmail limit)

  constructor(config: AgentConfig, container: DIContainer) {
    super(config);
    this.container = container;
    this.errorHandler = ErrorHandler.getInstance();
  }

  async execute(input: EmailMonitorInput, context: AgentContext): Promise<AgentResult<EmailMonitorOutput>> {
    this.log(LogLevel.INFO, `Email Monitor Agent executing action: ${input.action}`, { 
      action: input.action,
      maxEmails: input.maxEmails,
      includeRead: input.includeRead,
      hasFilters: !!input.filters
    });

    const startTime = Date.now();

    try {
      let result: EmailMonitorOutput;

      switch (input.action) {
        case 'checkInbox':
          result = await this.handleInboxCheck(input, context);
          break;
        
        case 'processEmail':
          result = await this.handleSingleEmailProcessing(input, context);
          break;
        
        case 'startMonitoring':
          result = await this.handleStartMonitoring(input, context);
          break;
        
        case 'stopMonitoring':
          result = await this.handleStopMonitoring(input, context);
          break;
        
        default:
          throw this.errorHandler.createError(
            ErrorCodes.INVALID_INPUT,
            `Unknown action: ${input.action}`
          );
      }

      const processingTime = Date.now() - startTime;
      
      this.log(LogLevel.INFO, 'Email monitoring completed', {
        action: input.action,
        processingTime,
        processedEmails: result.processedEmails?.length || 0,
        skippedEmails: result.skippedEmails || 0
      });

      return this.createSuccessResult(context, result);
    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.log(LogLevel.ERROR, 'Email Monitor Agent execution failed', { error, input, processingTime });
      
      const agentError = this.errorHandler.handleError(error, { 
        action: input.action,
        processingTime
      });
      
      return this.createErrorResult(context, agentError);
    }
  }

  protected async initialize(): Promise<void> {
    this.log(LogLevel.INFO, 'Initializing Email Monitor Agent...');

    try {
      // Resolve dependencies
      this.logger = await this.container.resolve<LoggerService>(ServiceTokens.LOGGER);
      this.supabase = await this.container.resolve<SupabaseService>(ServiceTokens.SUPABASE_SERVICE);
      this.googleEmail = GoogleEmailService.getInstance();
      this.emailNotification = EmailNotificationService.getInstance();

      // Initialize child agents
      this.documentAgent = new DocumentAgent({
        id: 'document-agent-email',
        name: 'DocumentAgent',
        version: '1.0.0',
        enabled: true,
        maxRetries: 3,
        timeout: 30000,
        healthCheckInterval: 30000,
        dependencies: []
      }, this.container);

      this.ocrAgent = new OCRAgent({
        id: 'ocr-agent-email',
        name: 'OCRAgent',
        version: '1.0.0',
        enabled: true,
        maxRetries: 3,
        timeout: 60000,
        healthCheckInterval: 30000,
        dependencies: []
      }, this.container);

      // Start child agents
      await this.documentAgent.start();
      await this.ocrAgent.start();

      // Test Gmail connection
      const isConnected = await this.googleEmail.testConnection();
      if (!isConnected) {
        throw new ExternalServiceError(
          ErrorCodes.EMAIL_SERVICE_ERROR,
          'Gmail connection test failed'
        );
      }

      this.log(LogLevel.INFO, 'Email Monitor Agent initialized successfully');
    } catch (error) {
      this.log(LogLevel.FATAL, 'Email Monitor Agent initialization failed', { error });
      throw error;
    }
  }

  protected async cleanup(): Promise<void> {
    // Stop monitoring if active
    if (this.isMonitoring) {
      await this.handleStopMonitoring({} as EmailMonitorInput, {} as AgentContext);
    }

    // Cleanup child agents
    if (this.documentAgent) {
      await this.documentAgent.stop();
    }
    if (this.ocrAgent) {
      await this.ocrAgent.stop();
    }

    this.log(LogLevel.INFO, 'Email Monitor Agent cleanup completed');
  }

  protected async performHealthCheck(): Promise<boolean> {
    try {
      // Check if dependencies are available
      if (!this.logger || !this.supabase || !this.googleEmail) {
        return false;
      }

      // Test connections
      const dbHealthy = await this.supabase.testConnection();
      const emailHealthy = await this.googleEmail.testConnection();
      // Check child agents health via their public methods
      const documentHealthy = this.documentAgent ? true : false;
      const ocrHealthy = this.ocrAgent ? true : false;
      const childAgentsHealthy = documentHealthy && ocrHealthy;

      return dbHealthy && emailHealthy && childAgentsHealthy;
    } catch (error) {
      this.log(LogLevel.ERROR, 'Email Monitor Agent health check failed', { error });
      return false;
    }
  }

  // === INBOX CHECK ===

  /**
   * Check inbox for new emails with attachments
   */
  private async handleInboxCheck(input: EmailMonitorInput, context: AgentContext): Promise<EmailMonitorOutput> {
    this.log(LogLevel.INFO, 'Starting inbox check for emails with attachments');

    try {
      // Get emails from Gmail
      const emails = await this.googleEmail.getEmails({
        maxResults: input.maxEmails || 10,
        includeRead: input.includeRead || false,
        hasAttachments: true, // Only emails with attachments
        timeRange: input.timeRange
      });

      this.log(LogLevel.INFO, `Found ${emails.length} emails with attachments`);

      const processedResults: ProcessedEmailResult[] = [];
      let skippedCount = 0;
      let errorCount = 0;

      for (const email of emails) {
        try {
          // Filter emails with relevant attachments only
          const relevantAttachments = email.attachments.filter(att => 
            this.isRelevantAttachment(att.filename, att.mimeType, att.size)
          );

          if (relevantAttachments.length === 0) {
            this.log(LogLevel.DEBUG, `Skipping email ${email.id}: no relevant attachments`, {
              from: email.from,
              subject: email.subject,
              totalAttachments: email.attachments.length
            });
            skippedCount++;
            continue;
          }

          this.log(LogLevel.INFO, `Processing email from ${email.from}: ${relevantAttachments.length} relevant attachments`);

          // Process email with relevant attachments
          const result = await this.processEmailWithAttachments(email, relevantAttachments, context);
          processedResults.push(result);

        } catch (error) {
          this.log(LogLevel.ERROR, `Failed to process email ${email.id}`, { error, email });
          errorCount++;
          
          processedResults.push({
            emailId: email.id,
            from: email.from,
            subject: email.subject,
            receivedAt: email.receivedAt,
            attachments: [],
            documentsCreated: 0,
            ocrResults: [],
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      this.log(LogLevel.INFO, 'Inbox check completed', {
        totalEmails: emails.length,
        processedEmails: processedResults.length,
        skippedEmails: skippedCount,
        errorCount
      });

      return {
        status: 'success',
        message: `Processed ${processedResults.length} emails, skipped ${skippedCount}`,
        processedEmails: processedResults,
        totalEmails: emails.length,
        skippedEmails: skippedCount,
        errorCount
      };

    } catch (error) {
      this.log(LogLevel.ERROR, 'Inbox check failed', { error });
      throw error;
    }
  }

  // === SINGLE EMAIL PROCESSING ===

  /**
   * Process a specific email by ID
   */
  private async handleSingleEmailProcessing(input: EmailMonitorInput, context: AgentContext): Promise<EmailMonitorOutput> {
    if (!input.emailId) {
      throw this.errorHandler.createError(
        ErrorCodes.INVALID_INPUT,
        'Email ID is required for single email processing'
      );
    }

    try {
      const email = await this.googleEmail.getEmailById(input.emailId);
      
      if (!email) {
        throw this.errorHandler.createError(
          ErrorCodes.EMAIL_NOT_FOUND,
          `Email with ID ${input.emailId} not found`
        );
      }

      // Check for relevant attachments
      const relevantAttachments = email.attachments.filter(att => 
        this.isRelevantAttachment(att.filename, att.mimeType, att.size)
      );

      if (relevantAttachments.length === 0) {
        return {
          status: 'success',
          message: 'Email has no relevant attachments to process',
          processedEmails: [],
          skippedEmails: 1
        };
      }

      const result = await this.processEmailWithAttachments(email, relevantAttachments, context);

      return {
        status: 'success',
        message: 'Email processed successfully',
        processedEmails: [result],
        totalEmails: 1,
        skippedEmails: 0,
        errorCount: result.status === 'failed' ? 1 : 0
      };

    } catch (error) {
      this.log(LogLevel.ERROR, 'Single email processing failed', { error, emailId: input.emailId });
      throw error;
    }
  }

  // === MONITORING CONTROL ===

  /**
   * Start continuous email monitoring
   */
  private async handleStartMonitoring(input: EmailMonitorInput, _context: AgentContext): Promise<EmailMonitorOutput> {
    if (this.isMonitoring) {
      return {
        status: 'success',
        message: 'Email monitoring is already active',
        monitoring: {
          isActive: true,
          interval: this.DEFAULT_CHECK_INTERVAL
        }
      };
    }

    const interval = input.maxEmails || this.DEFAULT_CHECK_INTERVAL;
    
    this.log(LogLevel.INFO, `Starting email monitoring with ${interval}ms interval`);

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(async () => {
      try {
        this.log(LogLevel.DEBUG, 'Performing scheduled inbox check');
        
        await this.handleInboxCheck({
          action: 'checkInbox',
          maxEmails: 5,
          includeRead: false,
          filters: { hasAttachments: true }
        }, {} as AgentContext);

      } catch (error) {
        this.log(LogLevel.ERROR, 'Scheduled inbox check failed', { error });
      }
    }, interval);

    return {
      status: 'success',
      message: 'Email monitoring started successfully',
      monitoring: {
        isActive: true,
        nextCheck: new Date(Date.now() + interval),
        interval
      }
    };
  }

  /**
   * Stop email monitoring
   */
  private async handleStopMonitoring(_input: EmailMonitorInput, _context: AgentContext): Promise<EmailMonitorOutput> {
    if (!this.isMonitoring) {
      return {
        status: 'success',
        message: 'Email monitoring is not active',
        monitoring: {
          isActive: false
        }
      };
    }

    this.log(LogLevel.INFO, 'Stopping email monitoring');

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }

    return {
      status: 'success',
      message: 'Email monitoring stopped successfully',
      monitoring: {
        isActive: false
      }
    };
  }

  // === ATTACHMENT PROCESSING ===

  /**
   * Check if attachment is relevant for processing
   */
  private isRelevantAttachment(filename: string, mimeType: string, size: number): boolean {
    // Check file size constraints
    if (size < this.MIN_FILE_SIZE || size > this.MAX_FILE_SIZE) {
      this.log(LogLevel.DEBUG, `Attachment ${filename} skipped: invalid size ${size} bytes`);
      return false;
    }

    // Check MIME type
    if (this.SUPPORTED_MIME_TYPES.includes(mimeType)) {
      return true;
    }

    // Check file extension as fallback
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    if (this.SUPPORTED_EXTENSIONS.includes(extension)) {
      return true;
    }

    this.log(LogLevel.DEBUG, `Attachment ${filename} skipped: unsupported type ${mimeType}/${extension}`);
    return false;
  }

  /**
   * Process email with its relevant attachments
   */
  private async processEmailWithAttachments(
    email: any,
    attachments: any[],
    context: AgentContext
  ): Promise<ProcessedEmailResult> {
    const processedAttachments: ProcessedAttachment[] = [];
    const ocrResults: any[] = [];
    let documentsCreated = 0;
    let hasErrors = false;

    this.log(LogLevel.INFO, `Processing ${attachments.length} attachments from email`, {
      from: email.from,
      subject: email.subject
    });

    for (const attachment of attachments) {
      try {
        this.log(LogLevel.INFO, `Processing attachment: ${attachment.filename}`);

        // Download attachment
        const attachmentData = await this.googleEmail.downloadAttachment(email.id, attachment.id);
        
        if (!attachmentData) {
          throw new Error('Failed to download attachment');
        }

        // Upload to Supabase via DocumentAgent
        const uploadResult = await this.documentAgent.execute({
          action: 'upload',
          file: {
            buffer: attachmentData,
            originalName: attachment.filename,
            mimeType: attachment.mimeType,
            size: attachment.size
          }
        }, {
          ...context,
          sessionId: `email-${email.id}-${Date.now()}`,
          metadata: { 
            emailId: email.id,
            emailFrom: email.from,
            emailSubject: email.subject
          }
        });

        if (!uploadResult.success || !uploadResult.data?.documentRecord) {
          throw new Error(`Document upload failed: ${uploadResult.error}`);
        }

        const documentRecord = uploadResult.data.documentRecord;
        documentsCreated++;

        // Process with OCR
        const ocrResult = await this.ocrAgent.execute({
          action: 'classifyDocument',
          imageBuffer: attachmentData,
          filename: attachment.filename,
          mimeType: attachment.mimeType,
          language: 'de'
        }, {
          ...context,
          sessionId: `email-ocr-${email.id}-${Date.now()}`,
          metadata: { documentId: documentRecord.id }
        });

        if (ocrResult.success && ocrResult.data) {
          ocrResults.push(ocrResult.data);

          // Extract structured data and save to specific table
          try {
            if (ocrResult.data.classification) {
              this.log(LogLevel.INFO, `Extracting structured data for: ${ocrResult.data.classification.type}`);
              
              const structuredData = await this.ocrAgent.extractStructuredData(
                attachmentData,
                ocrResult.data.classification.type,
                ocrResult.data.extractedText || '',
                'de'
              );

              // Save to classification-specific table
              const specificRecord = await this.saveToSpecificTable(
                ocrResult.data.classification,
                documentRecord.id,
                ocrResult.data.extractedText || '',
                structuredData
              );

              if (specificRecord) {
                this.log(LogLevel.INFO, `Document saved to specific table: ${this.getTableName(ocrResult.data.classification.type)}`);
                
                // Update document status
                await this.supabase.updateDocument(documentRecord.id, {
                  status: 'verarbeitet'
                });
              }
            }
          } catch (structError) {
            this.log(LogLevel.WARN, 'Failed to save structured data', { structError });
          }

          // Send notification about processed document
          try {
            await this.emailNotification.sendDocumentProcessedNotification({
              documentId: documentRecord.id,
              filename: attachment.filename,
              documentType: ocrResult.data.classification?.type || 'unknown',
              tableName: this.getTableName(ocrResult.data.classification?.type),
              extractedText: ocrResult.data.extractedText || '',
              classification: ocrResult.data.classification,
              structuredData: ocrResult.data.structuredData || {}
            }, {
              to: 'wehrlinatasha@gmail.com', // Make configurable
              language: 'de'
            });
          } catch (emailError) {
            this.log(LogLevel.WARN, 'Failed to send notification email', { emailError });
          }
        }

        processedAttachments.push({
          filename: attachment.filename,
          mimeType: attachment.mimeType,
          size: attachment.size,
          documentId: documentRecord.id,
          ocrResult: ocrResult.data,
          status: 'success'
        });

      } catch (error) {
        this.log(LogLevel.ERROR, `Failed to process attachment ${attachment.filename}`, { error });
        hasErrors = true;

        processedAttachments.push({
          filename: attachment.filename,
          mimeType: attachment.mimeType,
          size: attachment.size,
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return {
      emailId: email.id,
      from: email.from,
      subject: email.subject,
      receivedAt: email.receivedAt,
      attachments: processedAttachments,
      documentsCreated,
      ocrResults,
      status: hasErrors ? (documentsCreated > 0 ? 'partial' : 'failed') : 'success'
    };
  }

  /**
   * Save document to classification-specific table
   */
  private async saveToSpecificTable(
    classification: any,
    documentId: string,
    extractedText: string,
    structuredData: Record<string, any>
  ): Promise<any> {
    const finalType = classification.type?.toLowerCase() || '';
    
    try {
      // Route to appropriate table based on document type
      if (finalType.includes('rechnung') || finalType.includes('invoice') || finalType.includes('faktura')) {
        this.log(LogLevel.INFO, `Saving as invoice to invoices table`);
        return await this.supabase.createInvoice({
          document_id: documentId,
          rechnungsdatum: structuredData.rechnungsdatum || this.extractDateFromText(extractedText) || new Date().toISOString().split('T')[0],
          faelligkeitsdatum: structuredData.faelligkeitsdatum || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          betrag: structuredData.betrag || this.extractAmountFromText(extractedText) || 0,
          waehrung: structuredData.waehrung || 'CHF',
          empfaenger: structuredData.empfaenger || 'Nicht angegeben',
          beschreibung: structuredData.beschreibung || classification.summary || 'Automatisch verarbeitet',
          zusammenfassung: structuredData.zusammenfassung || classification.summary || 'Automatisch verarbeitet',
          status: 'eingereicht'
        });
      }
      
      // SUVA und UVG Formulare sind IMMER Unfallberichte
      if (finalType.includes('unfallbericht') || finalType.includes('unfall') || finalType.includes('accident') || 
          finalType.includes('uvg') || finalType.includes('suva') || 
          extractedText.toLowerCase().includes('suva') || 
          extractedText.toLowerCase().includes('unfallversicherung') ||
          extractedText.toLowerCase().includes('arbeitsunfall') ||
          extractedText.toLowerCase().includes('betriebsunfall')) {
        this.log(LogLevel.INFO, `Saving as accident report to accident_reports table (SUVA/UVG detected)`);
        return await this.supabase.createAccidentReport({
          document_id: documentId,
          name: structuredData.name || 'Nicht angegeben',
          geburtsdatum: structuredData.geburtsdatum || '1900-01-01',
          ahv_nummer: structuredData.ahv_nummer || '000.00.000.000',
          unfall_datum: structuredData.unfall_datum || this.extractDateFromText(extractedText) || new Date().toISOString().split('T')[0],
          unfall_zeit: structuredData.unfall_zeit || '00:00:00',
          unfall_ort: structuredData.unfall_ort || 'Nicht angegeben',
          unfall_beschreibung: structuredData.unfall_beschreibung || classification.summary || 'Automatisch verarbeitet',
          verletzung_art: structuredData.verletzung_art || 'Unbekannt',
          verletzung_koerperteil: structuredData.verletzung_koerperteil || 'Unbekannt',
          status: 'eingereicht'
        });
      }
      
      if (finalType.includes('schaden') || finalType.includes('damage')) {
        this.log(LogLevel.INFO, `Saving as damage report to damage_reports table`);
        return await this.supabase.createDamageReport({
          document_id: documentId,
          versicherungsnummer: structuredData.versicherungsnummer || undefined,
          name: structuredData.name || 'Nicht angegeben',
          adresse: structuredData.adresse || 'Nicht angegeben',
          schaden_datum: structuredData.schaden_datum || this.extractDateFromText(extractedText) || new Date().toISOString().split('T')[0],
          schaden_ort: structuredData.schaden_ort || 'Nicht angegeben',
          schaden_beschreibung: structuredData.schaden_beschreibung || classification.summary || 'Automatisch klassifiziert',
          zusammenfassung: structuredData.zusammenfassung || classification.summary || 'Automatisch verarbeitet',
          status: 'eingereicht'
        });
      }
      
      if (finalType.includes('kündigungsschreiben') || finalType.includes('kündigung') || 
          finalType.includes('kuendigung') || finalType.includes('vertrag')) {
        this.log(LogLevel.INFO, `Saving as contract change to contract_changes table`);
        return await this.supabase.createContractChange({
          document_id: documentId,
          name: structuredData.name || 'Nicht angegeben',
          adresse: structuredData.adresse || 'Nicht angegeben',
          aenderung_typ: structuredData.aenderung_typ || classification.type || 'sonstiges',
          aenderung_beschreibung: structuredData.aenderung_beschreibung || classification.summary || 'Automatisch klassifiziert',
          zusammenfassung: structuredData.zusammenfassung || classification.summary || 'Automatisch verarbeitet',
          status: 'eingereicht'
        });
      }
      
      // For ALL other document types, store in miscellaneous_documents table
      this.log(LogLevel.INFO, `Saving as miscellaneous document to miscellaneous_documents table`);
      return await this.supabase.createMiscellaneousDocument({
        document_id: documentId,
        title: structuredData.title || classification.type || 'Unbekanntes Dokument',
        document_date: structuredData.document_date || this.extractDateFromText(extractedText) || undefined,
        summary: structuredData.summary || classification.summary || 'Automatisch verarbeitet',
        status: 'eingereicht'
      });
      
    } catch (error) {
      this.log(LogLevel.ERROR, `Failed to save to specific table: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        documentType: classification.type,
        finalType,
        error,
        structuredDataKeys: Object.keys(structuredData)
      });
      return null;
    }
  }

  /**
   * Extract date from text
   */
  private extractDateFromText(text: string): string | null {
    const datePattern = /\d{1,2}[.\/]\d{1,2}[.\/]\d{2,4}/;
    const match = text.match(datePattern);
    return match ? match[0] : null;
  }

  /**
   * Extract amount from text
   */
  private extractAmountFromText(text: string): number {
    const amountPattern = /CHF[\s]?([0-9,.']+)|([0-9,.']+)[\s]?CHF|\$[\s]?([0-9,.']+)|([0-9,.']+)[\s]?\$/gi;
    const match = text.match(amountPattern);
    if (match) {
      const amount = parseFloat(match[0].replace(/[^\d.,]/g, '').replace(',', '.'));
      return !isNaN(amount) ? amount : 0;
    }
    return 0;
  }

  /**
   * Get table name for Supabase based on document type
   */
  private getTableName(documentType?: string): string {
    const type = documentType?.toLowerCase() || '';
    
    if (type.includes('unfallbericht') || type.includes('unfall') || type.includes('accident') || 
        type.includes('uvg') || type.includes('suva')) {
      return 'accident_reports';
    }
    
    if (type.includes('schaden') || type.includes('damage')) {
      return 'damage_reports';
    }
    
    if (type.includes('kündigungsschreiben') || type.includes('kündigung') || 
        type.includes('kuendigung') || type.includes('vertrag')) {
      return 'contract_changes';
    }
    
    if (type.includes('rechnung') || type.includes('invoice') || type.includes('faktura')) {
      return 'invoices';
    }
    
    return 'miscellaneous_documents';
  }
}