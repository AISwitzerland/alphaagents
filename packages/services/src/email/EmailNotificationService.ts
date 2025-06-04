import { Resend } from 'resend';
import { ConfigService } from '../config/ConfigService';
import { LoggerService } from '../logging/LoggerService';
import { OpenAIService } from '../ai/OpenAIService';
import { ErrorHandler, ErrorCodes, ExternalServiceError } from '../../../core/src/errors/ErrorHandler';

/**
 * Document notification data
 */
export interface DocumentNotificationData {
  documentId: string;
  filename: string;
  documentType: string;
  tableName: string;
  extractedText: string;
  classification?: any;
  structuredData?: Record<string, any>;
  supabaseUrl?: string;
}

/**
 * Email notification options
 */
export interface EmailNotificationOptions {
  to: string | string[];
  subject?: string;
  includeAttachment?: boolean;
  language?: 'de' | 'fr' | 'it' | 'en';
}

/**
 * Email notification service for document processing alerts
 * Sends intelligent summaries of processed documents using GPT-4
 */
export class EmailNotificationService {
  private static instance: EmailNotificationService;
  private resend!: Resend;
  private logger: LoggerService;
  private config: ConfigService;
  private openai: OpenAIService;
  private errorHandler: ErrorHandler;

  private constructor() {
    this.config = ConfigService.getInstance();
    this.logger = LoggerService.getInstance().child({ component: 'email-notifications' });
    this.openai = OpenAIService.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
    
    this.validateConfiguration();
    this.initializeResend();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): EmailNotificationService {
    if (!EmailNotificationService.instance) {
      EmailNotificationService.instance = new EmailNotificationService();
    }
    return EmailNotificationService.instance;
  }

  /**
   * Validate email configuration
   */
  private validateConfiguration(): void {
    const resendKey = process.env.RESEND_API_KEY;
    
    if (!resendKey) {
      throw new ExternalServiceError(
        ErrorCodes.CONFIGURATION_ERROR,
        'RESEND_API_KEY is required for email notifications',
        false
      );
    }
  }

  /**
   * Initialize Resend client
   */
  private initializeResend(): void {
    try {
      const apiKey = process.env.RESEND_API_KEY;
      this.resend = new Resend(apiKey!);
      
      this.logger.info('Resend email service initialized');
    } catch (error) {
      throw new ExternalServiceError(
        ErrorCodes.EMAIL_SERVICE_ERROR,
        `Failed to initialize Resend: ${error instanceof Error ? error.message : 'Unknown error'}`,
        true
      );
    }
  }

  /**
   * Send document processed notification
   */
  async sendDocumentProcessedNotification(
    data: DocumentNotificationData,
    options: EmailNotificationOptions
  ): Promise<void> {
    try {
      this.logger.info('Sending document processed notification', {
        documentId: data.documentId,
        filename: data.filename,
        documentType: data.documentType,
        tableName: data.tableName
      });

      // Generate intelligent summary using GPT-4
      const summary = await this.generateDocumentSummary(data, options.language || 'de');
      
      // Create email content
      const emailContent = this.createEmailContent(data, summary, options.language || 'de');
      
      // Send email
      const result = await this.resend.emails.send({
        from: 'AlphaAgents <onboarding@resend.dev>',
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject || this.getDefaultSubject(data, options.language || 'de'),
        html: emailContent.html,
        text: emailContent.text
      });

      this.logger.info('Document notification sent successfully', {
        documentId: data.documentId,
        emailId: result.data?.id,
        recipients: options.to
      });

    } catch (error) {
      this.logger.error('Failed to send document notification', {
        documentId: data.documentId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new ExternalServiceError(
        ErrorCodes.EMAIL_SERVICE_ERROR,
        `Failed to send email notification: ${error instanceof Error ? error.message : 'Unknown error'}`,
        true
      );
    }
  }

  /**
   * Generate intelligent document summary using GPT-4
   */
  private async generateDocumentSummary(
    data: DocumentNotificationData,
    language: string
  ): Promise<string> {
    try {
      const prompt = this.createSummaryPrompt(data, language);
      
      const result = await this.openai.generateText(prompt, {
        model: 'gpt-4',
        maxTokens: 200,
        temperature: 0.1,
        systemPrompt: this.getSystemPrompt(language)
      });

      return result.content.trim();

    } catch (error) {
      this.logger.warn('Failed to generate GPT summary, using fallback', {
        documentId: data.documentId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      // Fallback to basic summary
      return this.generateFallbackSummary(data, language);
    }
  }

  /**
   * Create summary prompt for GPT-4
   */
  private createSummaryPrompt(data: DocumentNotificationData, language: string): string {
    const langText = language === 'de' ? 'auf Deutsch' : 
                     language === 'fr' ? 'en français' :
                     language === 'it' ? 'in italiano' : 'in English';

    return `Erstelle eine prägnante Zusammenfassung ${langText} für dieses Versicherungsdokument:

Dokumenttyp: ${data.documentType}
Dateiname: ${data.filename}
Gespeichert in Tabelle: ${data.tableName}

Extrahierter Text:
${data.extractedText.substring(0, 1500)}

Strukturierte Daten:
${JSON.stringify(data.structuredData || {}, null, 2)}

Erstelle eine professionelle, prägnante Zusammenfassung (max. 3 Sätze) die die wichtigsten Informationen hervorhebt.`;
  }

  /**
   * Get system prompt for GPT-4
   */
  private getSystemPrompt(language: string): string {
    if (language === 'de') {
      return 'Du bist ein Experte für Schweizer Versicherungsdokumente. Erstelle prägnante, professionelle Zusammenfassungen auf Deutsch mit Schweizer Rechtschreibung.';
    } else if (language === 'fr') {
      return 'Vous êtes un expert en documents d\'assurance suisses. Créez des résumés concis et professionnels en français.';
    } else if (language === 'it') {
      return 'Sei un esperto di documenti assicurativi svizzeri. Crea riassunti concisi e professionali in italiano.';
    }
    return 'You are an expert in Swiss insurance documents. Create concise, professional summaries in English.';
  }

  /**
   * Generate fallback summary when GPT fails
   */
  private generateFallbackSummary(data: DocumentNotificationData, language: string): string {
    const docTypeGerman = this.getGermanDocumentType(data.documentType);
    
    if (language === 'de') {
      return `${docTypeGerman} wurde automatisch verarbeitet und in der Datenbank gespeichert. Das Dokument wurde erfolgreich klassifiziert und die Daten extrahiert.`;
    } else if (language === 'fr') {
      return `Document ${data.documentType} traité automatiquement et enregistré dans la base de données. Classification et extraction des données réussies.`;
    } else if (language === 'it') {
      return `Documento ${data.documentType} elaborato automaticamente e salvato nel database. Classificazione ed estrazione dati completate.`;
    }
    return `Document ${data.documentType} automatically processed and saved to database. Classification and data extraction completed successfully.`;
  }

  /**
   * Get German document type translation
   */
  private getGermanDocumentType(type: string): string {
    const translations: Record<string, string> = {
      'accident_report': 'Unfallbericht',
      'damage_report': 'Schadenmeldung', 
      'cancellation': 'Kündigungsschreiben',
      'invoice': 'Rechnung',
      'contract_change': 'Vertragsänderung',
      'miscellaneous': 'Sonstiges Dokument'
    };
    
    return translations[type] || type;
  }

  /**
   * Create email content (HTML and text versions)
   */
  private createEmailContent(
    data: DocumentNotificationData,
    summary: string,
    language: string
  ): { html: string; text: string } {
    const timestamp = new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' });
    const tableDisplayName = this.getTableDisplayName(data.tableName);
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .summary { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #10b981; }
        .details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .footer { background: #64748b; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; }
        .emoji { font-size: 18px; }
        .table-link { background: #2563eb; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span class="emoji">🏢</span> AlphaAgents</h1>
            <p>Neues Dokument automatisch verarbeitet</p>
        </div>
        
        <div class="content">
            <div class="details">
                <h3><span class="emoji">📄</span> Dokument-Details</h3>
                <p><strong>Datei:</strong> ${data.filename}</p>
                <p><strong>Typ:</strong> ${this.getGermanDocumentType(data.documentType)}</p>
                <p><strong>Verarbeitet:</strong> ${timestamp}</p>
                <p><strong>Gespeichert in:</strong> ${tableDisplayName}</p>
                ${data.supabaseUrl ? `<a href="${data.supabaseUrl}" class="table-link">📊 Zur Tabelle</a>` : ''}
            </div>
            
            <div class="summary">
                <h3><span class="emoji">📝</span> KI-Zusammenfassung</h3>
                <p>${summary}</p>
            </div>
        </div>
        
        <div class="footer">
            <p>🤖 Automatisch generiert von AlphaAgents OCR System</p>
        </div>
    </div>
</body>
</html>`;

    const text = `
🏢 AlphaAgents - Neues Dokument verarbeitet

📄 Dokument-Details:
Datei: ${data.filename}
Typ: ${this.getGermanDocumentType(data.documentType)}
Verarbeitet: ${timestamp}
Gespeichert in: ${tableDisplayName}

📝 KI-Zusammenfassung:
${summary}

${data.supabaseUrl ? `🔗 Link zur Tabelle: ${data.supabaseUrl}` : ''}

---
🤖 Automatisch generiert von AlphaAgents OCR System
`;

    return { html, text };
  }

  /**
   * Get display name for database table
   */
  private getTableDisplayName(tableName: string): string {
    const tableNames: Record<string, string> = {
      'accident_reports': 'Unfallberichte',
      'damage_reports': 'Schadenmeldungen',
      'contract_changes': 'Vertragsänderungen', 
      'invoices': 'Rechnungen',
      'miscellaneous_documents': 'Sonstige Dokumente'
    };
    
    return tableNames[tableName] || tableName;
  }

  /**
   * Get default email subject
   */
  private getDefaultSubject(data: DocumentNotificationData, language: string): string {
    const docType = this.getGermanDocumentType(data.documentType);
    
    if (language === 'de') {
      return `📄 AlphaAgents: ${docType} verarbeitet - ${data.filename}`;
    } else if (language === 'fr') {
      return `📄 AlphaAgents: Document ${data.documentType} traité - ${data.filename}`;
    } else if (language === 'it') {
      return `📄 AlphaAgents: Documento ${data.documentType} elaborato - ${data.filename}`;
    }
    return `📄 AlphaAgents: Document ${data.documentType} processed - ${data.filename}`;
  }

  /**
   * Test email service connection
   */
  async testConnection(): Promise<boolean> {
    try {
      // Simple test - we can't really test Resend without sending an email
      // but we can validate the configuration
      this.validateConfiguration();
      
      this.logger.info('Email service connection test passed');
      return true;
    } catch (error) {
      this.logger.error('Email service connection test failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }
}