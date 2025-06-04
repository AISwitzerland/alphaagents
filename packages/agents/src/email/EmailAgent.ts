import { BaseAgent } from '../../../core/src/agents/BaseAgent';
import { AgentContext, AgentResult, AgentConfig, LogLevel } from '../../../shared/src/types/agent';
import { ErrorHandler, ErrorCodes, ValidationError } from '../../../core/src/errors/ErrorHandler';
import { DIContainer, ServiceTokens } from '../../../core/src/container/DIContainer';
import { LoggerService, SupabaseService, OpenAIService } from '../../../services/src';
import { DocumentAgent } from '../document/DocumentAgent';

/**
 * Email Agent Input/Output Types
 */
export interface EmailAgentInput {
  action: 'processIncoming' | 'sendResponse' | 'classifyEmail' | 'monitorInbox' | 'handleAttachments';
  email?: IncomingEmail;
  recipient?: string;
  responseContent?: string;
  template?: string;
  emailId?: string;
}

export interface EmailAgentOutput {
  status: 'success' | 'warning' | 'error';
  message: string;
  classification?: EmailClassification;
  response?: EmailResponse;
  attachments?: ProcessedAttachment[];
  escalated?: boolean;
  nextAction?: string;
}

export interface IncomingEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  htmlContent?: string;
  timestamp: Date;
  attachments?: EmailAttachment[];
  headers?: Record<string, string>;
}

export interface EmailAttachment {
  filename: string;
  contentType: string;
  content: Buffer;
  size: number;
}

export interface ProcessedAttachment {
  originalName: string;
  documentId: string;
  status: 'processed' | 'failed';
  documentType?: string;
  extractedText?: string;
  error?: string;
}

export interface EmailClassification {
  category: 'DOCUMENT_SUBMISSION' | 'QUESTION' | 'APPOINTMENT_REQUEST' | 'FEEDBACK' | 'COMPLAINT' | 'OTHER';
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  summary: string;
  intent: string;
  requiredAction: string;
  suggestedResponse?: string;
  escalationReason?: string;
  extractedInfo?: {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    policyNumber?: string;
    claimNumber?: string;
    appointmentRequest?: {
      preferredDate?: string;
      preferredTime?: string;
      reason?: string;
    };
  };
}

export interface EmailResponse {
  to: string;
  subject: string;
  content: string;
  template: string;
  personalizations: Record<string, string>;
  sentAt: Date;
  messageId?: string;
}

/**
 * Email Agent - Customer Communication Specialist
 * 
 * The Email Agent handles:
 * - Automated email monitoring and processing
 * - AI-powered email classification and intent detection
 * - Document attachment processing with OCR integration
 * - Automated German responses using templates
 * - Escalation to human agents for complex cases
 * - Customer data extraction and CRM integration
 * - Priority-based queue management
 */
export class EmailAgent extends BaseAgent<EmailAgentInput, EmailAgentOutput> {
  private container: DIContainer;
  private logger: LoggerService;
  private supabase: SupabaseService;
  private openai: OpenAIService;
  private documentAgent: DocumentAgent;
  private errorHandler: ErrorHandler;

  // Swiss email patterns for enhanced classification
  private readonly SWISS_EMAIL_PATTERNS = {
    APPOINTMENT_REQUEST: [
      'termin', 'appointment', 'besuch', 'meeting', 'treffen',
      'vereinbaren', 'buchen', 'reservation', 'datum', 'zeit'
    ],
    DOCUMENT_SUBMISSION: [
      'anhang', 'attachment', 'dokument', 'formular', 'beleg',
      'rechnung', 'attest', 'nachweis', 'kopie', 'scan'
    ],
    COMPLAINT: [
      'beschwerde', 'reklamation', 'unzufrieden', 'problem',
      'fehler', 'ärger', 'kritik', 'beanstandung'
    ],
    QUESTION: [
      'frage', 'question', 'information', 'auskunft', 'hilfe',
      'wie', 'was', 'wann', 'wo', 'warum', 'können sie'
    ],
    CLAIM_RELATED: [
      'schaden', 'unfall', 'meldung', 'erstattung', 'zahlung',
      'police', 'vertrag', 'leistung', 'deckung'
    ]
  };

  // German email templates
  private readonly EMAIL_TEMPLATES = {
    DOCUMENT_RECEIVED: {
      subject: 'Bestätigung: Dokumente erhalten',
      content: `Guten Tag {customerName},

vielen Dank für die Übermittlung Ihrer Dokumente. Wir haben folgende Unterlagen erhalten:

{documentList}

Ihre Dokumente werden nun bearbeitet. Sie erhalten innerhalb von {processingTime} Werktagen eine Rückmeldung von uns.

Falls Sie Fragen haben, können Sie uns jederzeit kontaktieren.

Freundliche Grüsse
Ihr AlphaAgents Team

Diese E-Mail wurde automatisch generiert.`
    },
    QUESTION_RESPONSE: {
      subject: 'Re: {originalSubject}',
      content: `Guten Tag {customerName},

vielen Dank für Ihre Anfrage. 

{responseContent}

Falls Sie weitere Fragen haben oder zusätzliche Informationen benötigen, zögern Sie nicht, uns zu kontaktieren.

Freundliche Grüsse
Ihr AlphaAgents Team

Diese E-Mail wurde automatisch generiert.`
    },
    APPOINTMENT_CONFIRMATION: {
      subject: 'Terminanfrage erhalten',
      content: `Guten Tag {customerName},

vielen Dank für Ihre Terminanfrage.

Ihre Anfrage:
{appointmentDetails}

Ein Mitarbeiter wird sich innerhalb von 24 Stunden bei Ihnen melden, um den Termin zu bestätigen.

Freundliche Grüsse
Ihr AlphaAgents Team`
    },
    ESCALATION_REQUIRED: {
      subject: 'Ihre Anfrage wird bearbeitet',
      content: `Guten Tag {customerName},

vielen Dank für Ihre Nachricht. 

Ihre Anfrage benötigt eine persönliche Bearbeitung. Ein Mitarbeiter wird sich innerhalb von {responseTime} bei Ihnen melden.

Referenznummer: {ticketNumber}

Freundliche Grüsse
Ihr AlphaAgents Team`
    }
  };

  constructor(config: AgentConfig, container: DIContainer) {
    super(config);
    this.container = container;
    this.errorHandler = ErrorHandler.getInstance();
  }

  async execute(input: EmailAgentInput, context: AgentContext): Promise<AgentResult<EmailAgentOutput>> {
    this.log(LogLevel.INFO, `Email Agent executing action: ${input.action}`, { 
      action: input.action,
      hasEmail: !!input.email,
      emailId: input.emailId,
      recipient: input.recipient
    });

    try {
      switch (input.action) {
        case 'processIncoming':
          return await this.handleIncomingEmail(input, context);
        
        case 'classifyEmail':
          return await this.handleEmailClassification(input, context);
        
        case 'sendResponse':
          return await this.handleSendResponse(input, context);
        
        case 'handleAttachments':
          return await this.handleEmailAttachments(input, context);
        
        case 'monitorInbox':
          return await this.handleInboxMonitoring(input, context);
        
        default:
          throw this.errorHandler.createError(
            ErrorCodes.INVALID_INPUT,
            `Unknown action: ${input.action}`
          );
      }
    } catch (error) {
      this.log(LogLevel.ERROR, 'Email Agent execution failed', { error, input });
      
      const agentError = this.errorHandler.handleError(error, { 
        action: input.action,
        emailFrom: input.email?.from,
        emailSubject: input.email?.subject
      });
      
      return this.createErrorResult(context, agentError);
    }
  }

  protected async initialize(): Promise<void> {
    this.log(LogLevel.INFO, 'Initializing Email Agent...');

    try {
      // Resolve dependencies
      this.logger = await this.container.resolve<LoggerService>(ServiceTokens.LOGGER);
      this.supabase = await this.container.resolve<SupabaseService>(ServiceTokens.SUPABASE_SERVICE);
      this.openai = await this.container.resolve<OpenAIService>(ServiceTokens.OPENAI_SERVICE);
      
      // Initialize document agent for attachment processing
      const documentConfig = {
        id: 'email-document-agent',
        name: 'EmailDocumentAgent',
        version: '1.0.0',
        enabled: true,
        maxRetries: 3,
        timeout: 30000,
        dependencies: [],
        healthCheckInterval: 30000
      };
      
      this.documentAgent = new DocumentAgent(documentConfig, this.container);
      await this.documentAgent.start();

      this.log(LogLevel.INFO, 'Email Agent initialized successfully');
    } catch (error) {
      this.log(LogLevel.FATAL, 'Email Agent initialization failed', { error });
      throw error;
    }
  }

  protected async cleanup(): Promise<void> {
    this.log(LogLevel.INFO, 'Cleaning up Email Agent...');

    try {
      if (this.documentAgent) {
        await this.documentAgent.stop();
      }
      
      this.log(LogLevel.INFO, 'Email Agent cleanup completed');
    } catch (error) {
      this.log(LogLevel.ERROR, 'Email Agent cleanup failed', { error });
    }
  }

  protected async performHealthCheck(): Promise<boolean> {
    try {
      // Check if dependencies are available
      if (!this.logger || !this.supabase || !this.openai) {
        return false;
      }

      // Test connections
      const dbHealthy = await this.supabase.testConnection();
      const aiHealthy = await this.openai.testConnection();
      const documentAgentHealthy = this.documentAgent ? 
        (await this.documentAgent.healthCheck()).healthy : true;

      return dbHealthy && aiHealthy && documentAgentHealthy;
    } catch (error) {
      this.log(LogLevel.ERROR, 'Email Agent health check failed', { error });
      return false;
    }
  }

  // === INCOMING EMAIL PROCESSING ===

  /**
   * Process incoming email completely
   */
  private async handleIncomingEmail(input: EmailAgentInput, context: AgentContext): Promise<AgentResult<EmailAgentOutput>> {
    if (!input.email) {
      throw new ValidationError('Email is required for processing');
    }

    const email = input.email;
    
    this.log(LogLevel.INFO, 'Processing incoming email', {
      from: email.from,
      subject: email.subject,
      hasAttachments: !!(email.attachments && email.attachments.length > 0),
      contentLength: email.content.length
    });

    try {
      // 1. Classify the email
      const classification = await this.classifyIncomingEmail(email);
      
      // 2. Process attachments if any
      let processedAttachments: ProcessedAttachment[] = [];
      if (email.attachments && email.attachments.length > 0) {
        processedAttachments = await this.processEmailAttachments(email);
      }

      // 3. Generate appropriate response
      const response = await this.generateEmailResponse(email, classification, processedAttachments);

      // 4. Log email interaction
      await this.logEmailInteraction(email, classification, response, processedAttachments);

      // 5. Determine if escalation is needed
      const escalated = this.shouldEscalate(classification);

      let result: EmailAgentOutput = {
        status: 'success',
        message: `Email processed successfully (${classification.category})`,
        classification,
        response: escalated ? undefined : response,
        attachments: processedAttachments,
        escalated,
        nextAction: escalated ? 'human_review' : 'response_sent'
      };

      // 6. Send response if not escalated
      if (!escalated && response) {
        try {
          await this.sendEmailResponse(response);
          this.log(LogLevel.INFO, 'Automated response sent', {
            to: response.to,
            template: response.template
          });
        } catch (error) {
          this.log(LogLevel.WARN, 'Failed to send automated response', { error });
          result.status = 'warning';
          result.message += ' (Response sending failed)';
        }
      }

      return this.createSuccessResult(context, result);
    } catch (error) {
      this.log(LogLevel.ERROR, 'Email processing failed', { error });
      throw error;
    }
  }

  // === EMAIL CLASSIFICATION ===

  /**
   * Classify incoming email using AI
   */
  private async classifyIncomingEmail(email: IncomingEmail): Promise<EmailClassification> {
    try {
      const systemPrompt = `Du bist ein Experte für die Klassifizierung von E-Mails in einem Schweizer Versicherungsunternehmen.

Klassifiziere die E-Mail in eine der folgenden Kategorien:
- DOCUMENT_SUBMISSION: Kunde sendet Dokumente/Anhänge
- QUESTION: Kunde hat Fragen zu Versicherungen oder Services
- APPOINTMENT_REQUEST: Kunde möchte einen Termin vereinbaren
- FEEDBACK: Kunde gibt positives/neutrales Feedback
- COMPLAINT: Kunde hat eine Beschwerde oder ist unzufrieden
- OTHER: Alles andere

Bestimme auch:
- Priorität (low/medium/high/urgent)
- Benötigte Aktion
- Extrahierte Kundeninformationen

Antworte im JSON-Format:
{
  "category": "KATEGORIE",
  "confidence": 0.95,
  "priority": "medium",
  "summary": "Kurze Zusammenfassung",
  "intent": "Was möchte der Kunde",
  "requiredAction": "Was muss getan werden",
  "extractedInfo": {
    "customerName": "Name falls erkennbar",
    "customerEmail": "E-Mail Adresse",
    "policyNumber": "Policen-Nummer falls erwähnt"
  }
}`;

      const emailContext = `Von: ${email.from}
Betreff: ${email.subject}
Inhalt: ${email.content}
${email.attachments ? `Anhänge: ${email.attachments.map(a => a.filename).join(', ')}` : 'Keine Anhänge'}`;

      const prompt = `Klassifiziere diese E-Mail von einem Schweizer Versicherungskunden:\n\n${emailContext}`;

      const result = await this.openai.generateText(prompt, {
        systemPrompt,
        temperature: 0.1,
        maxTokens: 1000
      });

      // Parse JSON response
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw this.errorHandler.createError(
          ErrorCodes.OPENAI_API_ERROR,
          'Invalid JSON response from email classification'
        );
      }

      const classification: EmailClassification = JSON.parse(jsonMatch[0]);

      // Enhance with Swiss patterns
      const enhancedClassification = this.enhanceClassificationWithPatterns(classification, email);

      this.log(LogLevel.INFO, 'Email classified', {
        category: enhancedClassification.category,
        confidence: enhancedClassification.confidence,
        priority: enhancedClassification.priority
      });

      return enhancedClassification;
    } catch (error) {
      this.log(LogLevel.ERROR, 'Email classification failed', { error });
      
      // Fallback classification
      return {
        category: 'OTHER',
        confidence: 0.5,
        priority: 'medium',
        summary: 'Automatische Klassifizierung fehlgeschlagen',
        intent: 'Unbekannt',
        requiredAction: 'Manuelle Überprüfung erforderlich',
        escalationReason: 'Classification failed'
      };
    }
  }

  /**
   * Enhance classification with Swiss email patterns
   */
  private enhanceClassificationWithPatterns(classification: EmailClassification, email: IncomingEmail): EmailClassification {
    const combinedText = `${email.subject} ${email.content}`.toLowerCase();

    // Check for Swiss-specific patterns
    for (const [category, keywords] of Object.entries(this.SWISS_EMAIL_PATTERNS)) {
      const matches = keywords.filter(keyword => combinedText.includes(keyword)).length;
      
      if (matches > 0) {
        const patternBoost = Math.min(0.2, matches * 0.05);
        classification.confidence = Math.min(0.99, classification.confidence + patternBoost);
        
        // Override category if strong pattern match
        if (matches >= 2 && classification.confidence > 0.8) {
          classification.category = category as any;
        }
      }
    }

    // Swiss priority enhancement
    if (combinedText.includes('dringend') || combinedText.includes('urgent') || combinedText.includes('sofort')) {
      classification.priority = 'urgent';
    }

    // Extract Swiss-specific information
    const ahvMatch = combinedText.match(/756\.\d{4}\.\d{4}\.\d{2}/);
    if (ahvMatch) {
      classification.extractedInfo = classification.extractedInfo || {};
      classification.extractedInfo.ahvNumber = ahvMatch[0];
    }

    return classification;
  }

  // === EMAIL RESPONSE GENERATION ===

  /**
   * Generate appropriate email response
   */
  private async generateEmailResponse(
    email: IncomingEmail, 
    classification: EmailClassification,
    attachments: ProcessedAttachment[]
  ): Promise<EmailResponse | null> {
    
    // Don't generate responses for categories that need human attention
    if (this.shouldEscalate(classification)) {
      return null;
    }

    try {
      let template: string;
      let personalizations: Record<string, string> = {
        customerName: this.extractCustomerName(email, classification),
        originalSubject: email.subject
      };

      // Choose template based on classification
      switch (classification.category) {
        case 'DOCUMENT_SUBMISSION':
          template = 'DOCUMENT_RECEIVED';
          personalizations.documentList = attachments
            .map(att => `- ${att.originalName} (${att.status === 'processed' ? 'verarbeitet' : 'fehlgeschlagen'})`)
            .join('\n');
          personalizations.processingTime = '3-5';
          break;

        case 'QUESTION':
          template = 'QUESTION_RESPONSE';
          personalizations.responseContent = await this.generateQuestionResponse(email.content, classification);
          break;

        case 'APPOINTMENT_REQUEST':
          template = 'APPOINTMENT_CONFIRMATION';
          personalizations.appointmentDetails = this.extractAppointmentDetails(email.content, classification);
          break;

        default:
          return null; // No automated response for other categories
      }

      const templateData = this.EMAIL_TEMPLATES[template as keyof typeof this.EMAIL_TEMPLATES];
      
      const response: EmailResponse = {
        to: email.from,
        subject: this.personalizeText(templateData.subject, personalizations),
        content: this.personalizeText(templateData.content, personalizations),
        template,
        personalizations,
        sentAt: new Date()
      };

      return response;
    } catch (error) {
      this.log(LogLevel.ERROR, 'Email response generation failed', { error });
      return null;
    }
  }

  /**
   * Generate AI response for questions
   */
  private async generateQuestionResponse(question: string, classification: EmailClassification): Promise<string> {
    try {
      const systemPrompt = `Du bist ein freundlicher Kundenservice-Mitarbeiter für ein Schweizer Versicherungsunternehmen.
      
Beantworte Kundenfragen höflich, präzise und hilfreich auf Deutsch.
Verwende "Sie" für die Anrede.
Halte die Antwort unter 200 Wörtern.
Falls die Frage zu komplex ist, verweise an einen Mitarbeiter.

Themenbereich: Schweizer Versicherungen (Unfall-, Kranken-, Haftpflichtversicherung)`;

      const prompt = `Kundenfrage: ${question}

Zusammenfassung: ${classification.summary}

Erstelle eine hilfreiche deutsche Antwort:`;

      const result = await this.openai.generateText(prompt, {
        systemPrompt,
        temperature: 0.3,
        maxTokens: 300
      });

      return result.content;
    } catch (error) {
      this.log(LogLevel.ERROR, 'Question response generation failed', { error });
      return 'Vielen Dank für Ihre Anfrage. Ein Mitarbeiter wird sich in Kürze bei Ihnen melden.';
    }
  }

  // === ATTACHMENT PROCESSING ===

  /**
   * Process email attachments
   */
  private async processEmailAttachments(email: IncomingEmail): Promise<ProcessedAttachment[]> {
    if (!email.attachments || email.attachments.length === 0) {
      return [];
    }

    const results: ProcessedAttachment[] = [];

    for (const attachment of email.attachments) {
      try {
        this.log(LogLevel.INFO, 'Processing email attachment', {
          filename: attachment.filename,
          contentType: attachment.contentType,
          size: attachment.size
        });

        // Use DocumentAgent to process attachment
        const documentResult = await this.documentAgent.run({
          action: 'upload',
          file: {
            buffer: attachment.content,
            originalName: attachment.filename,
            mimeType: attachment.contentType,
            size: attachment.size
          },
          userInfo: {
            email: email.from,
            name: this.extractCustomerName(email, null)
          }
        }, {
          agentId: 'email-agent',
          sessionId: `email-${email.id}`,
          timestamp: new Date()
        });

        if (documentResult.success && documentResult.data?.documentRecord) {
          results.push({
            originalName: attachment.filename,
            documentId: documentResult.data.documentRecord.id,
            status: 'processed',
            documentType: documentResult.data.documentRecord.document_type
          });
        } else {
          results.push({
            originalName: attachment.filename,
            documentId: '',
            status: 'failed',
            error: documentResult.error?.message || 'Processing failed'
          });
        }
      } catch (error) {
        this.log(LogLevel.ERROR, 'Attachment processing failed', { 
          error, 
          filename: attachment.filename 
        });
        
        results.push({
          originalName: attachment.filename,
          documentId: '',
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  // === EMAIL CLASSIFICATION HANDLER ===

  /**
   * Handle standalone email classification
   */
  private async handleEmailClassification(input: EmailAgentInput, context: AgentContext): Promise<AgentResult<EmailAgentOutput>> {
    if (!input.email) {
      throw new ValidationError('Email is required for classification');
    }

    const classification = await this.classifyIncomingEmail(input.email);

    return this.createSuccessResult(context, {
      status: 'success',
      message: `Email classified as: ${classification.category}`,
      classification
    });
  }

  // === EMAIL SENDING ===

  /**
   * Handle sending email response
   */
  private async handleSendResponse(input: EmailAgentInput, context: AgentContext): Promise<AgentResult<EmailAgentOutput>> {
    if (!input.recipient || !input.responseContent) {
      throw new ValidationError('Recipient and response content are required');
    }

    const response: EmailResponse = {
      to: input.recipient,
      subject: 'Antwort von AlphaAgents',
      content: input.responseContent,
      template: input.template || 'CUSTOM',
      personalizations: {},
      sentAt: new Date()
    };

    try {
      await this.sendEmailResponse(response);

      return this.createSuccessResult(context, {
        status: 'success',
        message: `Email sent to ${input.recipient}`,
        response
      });
    } catch (error) {
      this.log(LogLevel.ERROR, 'Email sending failed', { error });
      throw error;
    }
  }

  // === ATTACHMENT HANDLING ===

  /**
   * Handle standalone attachment processing
   */
  private async handleEmailAttachments(input: EmailAgentInput, context: AgentContext): Promise<AgentResult<EmailAgentOutput>> {
    if (!input.email || !input.email.attachments) {
      throw new ValidationError('Email with attachments is required');
    }

    const processedAttachments = await this.processEmailAttachments(input.email);

    return this.createSuccessResult(context, {
      status: 'success',
      message: `Processed ${processedAttachments.length} attachments`,
      attachments: processedAttachments
    });
  }

  // === INBOX MONITORING ===

  /**
   * Handle inbox monitoring (placeholder for IMAP integration)
   */
  private async handleInboxMonitoring(input: EmailAgentInput, context: AgentContext): Promise<AgentResult<EmailAgentOutput>> {
    // In production, this would connect to IMAP server and poll for new emails
    this.log(LogLevel.INFO, 'Inbox monitoring cycle started');

    // Placeholder implementation
    return this.createSuccessResult(context, {
      status: 'success',
      message: 'Inbox monitoring completed (no new emails)',
      nextAction: 'schedule_next_check'
    });
  }

  // === UTILITY METHODS ===

  /**
   * Check if email should be escalated to human
   */
  private shouldEscalate(classification: EmailClassification): boolean {
    // Escalate high priority or complex cases
    if (classification.priority === 'urgent' || classification.priority === 'high') {
      return true;
    }

    // Escalate complaints
    if (classification.category === 'COMPLAINT') {
      return true;
    }

    // Escalate low confidence classifications
    if (classification.confidence < 0.7) {
      return true;
    }

    // Escalate if explicit escalation reason
    if (classification.escalationReason) {
      return true;
    }

    return false;
  }

  /**
   * Extract customer name from email
   */
  private extractCustomerName(email: IncomingEmail, classification?: EmailClassification | null): string {
    // Try from classification first
    if (classification?.extractedInfo?.customerName) {
      return classification.extractedInfo.customerName;
    }

    // Extract from email address
    const emailParts = email.from.split('@')[0];
    const nameParts = emailParts.split('.');
    
    if (nameParts.length >= 2) {
      return nameParts.map(part => 
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      ).join(' ');
    }

    return 'Sehr geehrte Damen und Herren';
  }

  /**
   * Extract appointment details from content
   */
  private extractAppointmentDetails(content: string, classification: EmailClassification): string {
    const info = classification.extractedInfo?.appointmentRequest;
    
    if (info) {
      return `Gewünschtes Datum: ${info.preferredDate || 'Nicht spezifiziert'}
Gewünschte Zeit: ${info.preferredTime || 'Nicht spezifiziert'}
Grund: ${info.reason || 'Allgemeine Beratung'}`;
    }

    return 'Details werden bei der Terminbestätigung besprochen.';
  }

  /**
   * Personalize text with variables
   */
  private personalizeText(text: string, personalizations: Record<string, string>): string {
    let result = text;
    
    for (const [key, value] of Object.entries(personalizations)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    
    return result;
  }

  /**
   * Send email response (placeholder for actual email service)
   */
  private async sendEmailResponse(response: EmailResponse): Promise<void> {
    // In production, this would integrate with actual email service (Sendgrid, etc.)
    this.log(LogLevel.INFO, 'Email response sent', {
      to: response.to,
      subject: response.subject,
      template: response.template
    });

    // Set message ID for tracking
    response.messageId = `alpha-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log email interaction to database
   */
  private async logEmailInteraction(
    email: IncomingEmail,
    classification: EmailClassification,
    response: EmailResponse | null,
    attachments: ProcessedAttachment[]
  ): Promise<void> {
    try {
      // In production, this would log to a proper email interactions table
      await this.supabase.logAgentActivity({
        agent_id: this.getConfig().id,
        agent_name: this.getConfig().name,
        session_id: `email-${email.id}`,
        user_id: email.from,
        level: 'info',
        message: 'Email interaction processed',
        data: {
          email: {
            from: email.from,
            subject: email.subject,
            timestamp: email.timestamp
          },
          classification,
          response: response ? {
            template: response.template,
            sentAt: response.sentAt
          } : null,
          attachments: attachments.map(att => ({
            name: att.originalName,
            status: att.status,
            documentId: att.documentId
          }))
        }
      });
    } catch (error) {
      this.log(LogLevel.WARN, 'Failed to log email interaction', { error });
    }
  }
}