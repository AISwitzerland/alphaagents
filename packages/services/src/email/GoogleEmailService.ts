import { google, gmail_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '../config/ConfigService';
import { LoggerService } from '../logging/LoggerService';
import { ErrorHandler, ErrorCodes, ExternalServiceError } from '../../../core/src/errors/ErrorHandler';

/**
 * Email data structure
 */
export interface EmailData {
  id: string;
  threadId: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  receivedAt: Date;
  isRead: boolean;
  attachments: EmailAttachment[];
}

export interface EmailAttachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  contentId?: string;
}

/**
 * Email query options
 */
export interface EmailQueryOptions {
  maxResults?: number;
  includeRead?: boolean;
  hasAttachments?: boolean;
  timeRange?: {
    since?: Date;
    until?: Date;
  };
  fromAddress?: string;
  subjectContains?: string;
}

/**
 * Google Email Service for Gmail API integration
 * Handles OAuth authentication and email operations
 */
export class GoogleEmailService {
  private static instance: GoogleEmailService;
  private oauth2Client!: OAuth2Client;
  private gmail!: gmail_v1.Gmail;
  private logger: LoggerService;
  private config: ConfigService;
  private errorHandler: ErrorHandler;
  private isInitialized = false;

  private constructor() {
    this.config = ConfigService.getInstance();
    this.logger = LoggerService.getInstance().child({ component: 'google-email' });
    this.errorHandler = ErrorHandler.getInstance();
    
    this.initializeGoogleAuth();
    
    // Try to load stored refresh token
    this.loadStoredRefreshToken().catch(() => {
      // Ignore errors - token will be set during OAuth flow
    });
  }

  /**
   * Get singleton instance
   */
  static getInstance(): GoogleEmailService {
    if (!GoogleEmailService.instance) {
      GoogleEmailService.instance = new GoogleEmailService();
    }
    return GoogleEmailService.instance;
  }

  /**
   * Initialize Google OAuth client
   */
  private initializeGoogleAuth(): void {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new ExternalServiceError(
          ErrorCodes.CONFIGURATION_ERROR,
          'Google OAuth credentials not found in environment variables',
          false
        );
      }

      this.oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        'http://localhost:3000/api/gmail-auth/callback' // Local callback URL
      );

      this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

      this.logger.info('Google Email Service OAuth client initialized');
    } catch (error) {
      throw new ExternalServiceError(
        ErrorCodes.EMAIL_SERVICE_ERROR,
        `Failed to initialize Google OAuth: ${error instanceof Error ? error.message : 'Unknown error'}`,
        true
      );
    }
  }

  /**
   * Set OAuth refresh token (from user authentication flow)
   */
  async setRefreshToken(refreshToken: string): Promise<void> {
    try {
      this.oauth2Client.setCredentials({
        refresh_token: refreshToken
      });

      // Test the connection
      await this.oauth2Client.getAccessToken();
      this.isInitialized = true;

      // Store token persistently for reuse
      await this.storeRefreshToken(refreshToken);

      this.logger.info('Google Email Service authenticated successfully');
    } catch (error) {
      throw new ExternalServiceError(
        ErrorCodes.EMAIL_SERVICE_ERROR,
        `Failed to set refresh token: ${error instanceof Error ? error.message : 'Unknown error'}`,
        true
      );
    }
  }

  /**
   * Initialize with stored refresh token if available
   */
  private async loadStoredRefreshToken(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const os = await import('os');
      
      const tokenFile = path.join(os.tmpdir(), 'alphaagents-gmail-token.json');
      const tokenData = await fs.readFile(tokenFile, 'utf-8');
      const { refreshToken } = JSON.parse(tokenData);
      
      if (refreshToken) {
        this.oauth2Client.setCredentials({
          refresh_token: refreshToken
        });
        
        // Test the connection
        await this.oauth2Client.getAccessToken();
        this.isInitialized = true;
        
        this.logger.info('Google Email Service initialized with stored token');
      }
    } catch (error) {
      // No stored token or invalid - this is normal on first run
      this.logger.debug('No valid stored refresh token found');
    }
  }

  /**
   * Store refresh token for persistence
   */
  private async storeRefreshToken(refreshToken: string): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const os = await import('os');
      
      const tokenFile = path.join(os.tmpdir(), 'alphaagents-gmail-token.json');
      await fs.writeFile(tokenFile, JSON.stringify({ refreshToken }), 'utf-8');
      
      this.logger.debug('Refresh token stored successfully');
    } catch (error) {
      this.logger.warn('Failed to store refresh token', { error });
    }
  }

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokenFromCode(code: string): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      
      if (!tokens.refresh_token) {
        throw new Error('No refresh token received');
      }

      await this.setRefreshToken(tokens.refresh_token);

      return {
        access_token: tokens.access_token!,
        refresh_token: tokens.refresh_token
      };
    } catch (error) {
      throw new ExternalServiceError(
        ErrorCodes.EMAIL_SERVICE_ERROR,
        `Failed to exchange code for tokens: ${error instanceof Error ? error.message : 'Unknown error'}`,
        true
      );
    }
  }

  /**
   * Get emails from Gmail inbox
   */
  async getEmails(options: EmailQueryOptions = {}): Promise<EmailData[]> {
    this.ensureInitialized();

    try {
      const query = this.buildSearchQuery(options);
      this.logger.info('Fetching emails from Gmail', { query, options });

      // Get message list
      const listResponse = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: options.maxResults || 10
      });

      const messages = listResponse.data.messages || [];
      this.logger.info(`Found ${messages.length} emails matching criteria`);

      // Fetch detailed message data
      const emails: EmailData[] = [];
      for (const message of messages) {
        try {
          const emailData = await this.getEmailById(message.id!);
          if (emailData) {
            emails.push(emailData);
          }
        } catch (error) {
          this.logger.warn(`Failed to fetch email ${message.id}`, { error });
        }
      }

      return emails;
    } catch (error) {
      this.logger.error('Failed to fetch emails', { error, options });
      throw new ExternalServiceError(
        ErrorCodes.EMAIL_SERVICE_ERROR,
        `Failed to fetch emails: ${error instanceof Error ? error.message : 'Unknown error'}`,
        true
      );
    }
  }

  /**
   * Get a specific email by ID
   */
  async getEmailById(messageId: string): Promise<EmailData | null> {
    this.ensureInitialized();

    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });

      const message = response.data;
      if (!message.payload) {
        return null;
      }

      return this.parseEmailMessage(message);
    } catch (error) {
      this.logger.error(`Failed to fetch email ${messageId}`, { error });
      throw new ExternalServiceError(
        ErrorCodes.EMAIL_SERVICE_ERROR,
        `Failed to fetch email: ${error instanceof Error ? error.message : 'Unknown error'}`,
        true
      );
    }
  }

  /**
   * Download email attachment
   */
  async downloadAttachment(messageId: string, attachmentId: string): Promise<Buffer | null> {
    this.ensureInitialized();

    try {
      this.logger.info(`Downloading attachment ${attachmentId} from email ${messageId}`);

      const response = await this.gmail.users.messages.attachments.get({
        userId: 'me',
        messageId,
        id: attachmentId
      });

      const data = response.data.data;
      if (!data) {
        return null;
      }

      // Decode base64url data
      const buffer = Buffer.from(data, 'base64url');
      this.logger.info(`Downloaded attachment: ${buffer.length} bytes`);

      return buffer;
    } catch (error) {
      this.logger.error(`Failed to download attachment ${attachmentId}`, { error });
      throw new ExternalServiceError(
        ErrorCodes.EMAIL_SERVICE_ERROR,
        `Failed to download attachment: ${error instanceof Error ? error.message : 'Unknown error'}`,
        true
      );
    }
  }

  /**
   * Mark email as read
   */
  async markAsRead(messageId: string): Promise<void> {
    this.ensureInitialized();

    try {
      await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          removeLabelIds: ['UNREAD']
        }
      });

      this.logger.info(`Marked email ${messageId} as read`);
    } catch (error) {
      this.logger.error(`Failed to mark email ${messageId} as read`, { error });
      throw new ExternalServiceError(
        ErrorCodes.EMAIL_SERVICE_ERROR,
        `Failed to mark email as read: ${error instanceof Error ? error.message : 'Unknown error'}`,
        true
      );
    }
  }

  /**
   * Test Gmail connection
   */
  async testConnection(): Promise<boolean> {
    if (!this.isInitialized) {
      this.logger.warn('Google Email Service not initialized - missing refresh token');
      return false;
    }

    try {
      // Try to get user profile
      const profile = await this.gmail.users.getProfile({ userId: 'me' });
      
      this.logger.info('Gmail connection test successful', {
        emailAddress: profile.data.emailAddress,
        messagesTotal: profile.data.messagesTotal
      });
      
      return true;
    } catch (error) {
      this.logger.error('Gmail connection test failed', { error });
      return false;
    }
  }

  // === PRIVATE HELPER METHODS ===

  /**
   * Ensure service is initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new ExternalServiceError(
        ErrorCodes.EMAIL_SERVICE_ERROR,
        'Google Email Service not initialized. Call setRefreshToken() first.',
        false
      );
    }
  }

  /**
   * Build Gmail search query
   */
  private buildSearchQuery(options: EmailQueryOptions): string {
    const queryParts: string[] = [];

    // Only unread emails by default
    if (!options.includeRead) {
      queryParts.push('is:unread');
    }

    // Only emails with attachments
    if (options.hasAttachments) {
      queryParts.push('has:attachment');
    }

    // From address filter
    if (options.fromAddress) {
      queryParts.push(`from:${options.fromAddress}`);
    }

    // Subject filter
    if (options.subjectContains) {
      queryParts.push(`subject:"${options.subjectContains}"`);
    }

    // Time range filters
    if (options.timeRange?.since) {
      const sinceStr = this.formatDateForGmail(options.timeRange.since);
      queryParts.push(`after:${sinceStr}`);
    }

    if (options.timeRange?.until) {
      const untilStr = this.formatDateForGmail(options.timeRange.until);
      queryParts.push(`before:${untilStr}`);
    }

    return queryParts.join(' ');
  }

  /**
   * Format date for Gmail search
   */
  private formatDateForGmail(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`;
  }

  /**
   * Parse Gmail message into EmailData
   */
  private parseEmailMessage(message: gmail_v1.Schema$Message): EmailData {
    const headers = message.payload?.headers || [];

    // Extract headers
    const getHeader = (name: string) => 
      headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

    const from = getHeader('From');
    const to = getHeader('To').split(',').map(t => t.trim()).filter(t => t);
    const subject = getHeader('Subject');
    const dateStr = getHeader('Date');

    // Parse date
    const receivedAt = dateStr ? new Date(dateStr) : new Date();

    // Check if read
    const isRead = !message.labelIds?.includes('UNREAD');

    // Extract attachments
    const attachments = this.extractAttachments(message.payload!);

    // Extract body (simplified - just get plain text)
    const body = this.extractBodyText(message.payload!);

    return {
      id: message.id!,
      threadId: message.threadId!,
      from,
      to,
      subject,
      body,
      receivedAt,
      isRead,
      attachments
    };
  }

  /**
   * Extract attachments from email payload
   */
  private extractAttachments(payload: gmail_v1.Schema$MessagePart): EmailAttachment[] {
    const attachments: EmailAttachment[] = [];

    const extractFromPart = (part: gmail_v1.Schema$MessagePart) => {
      if (part.filename && part.body?.attachmentId) {
        attachments.push({
          id: part.body.attachmentId,
          filename: part.filename,
          mimeType: part.mimeType || 'application/octet-stream',
          size: part.body.size || 0,
          contentId: part.headers?.find(h => h.name === 'Content-ID')?.value || undefined
        });
      }

      // Recursively check parts
      if (part.parts) {
        part.parts.forEach(extractFromPart);
      }
    };

    if (payload.parts) {
      payload.parts.forEach(extractFromPart);
    } else {
      extractFromPart(payload);
    }

    return attachments;
  }

  /**
   * Extract plain text body from email
   */
  private extractBodyText(payload: gmail_v1.Schema$MessagePart): string {
    const extractText = (part: gmail_v1.Schema$MessagePart): string => {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return Buffer.from(part.body.data, 'base64url').toString('utf-8');
      }

      if (part.parts) {
        for (const subPart of part.parts) {
          const text = extractText(subPart);
          if (text) return text;
        }
      }

      return '';
    };

    return extractText(payload);
  }
}