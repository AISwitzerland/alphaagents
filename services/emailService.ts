import { Resend } from 'resend';
import type { CreateEmailResponse } from 'resend';
import { isErrorWithMessage, ValidationError, isValidEmail } from '../types/utils';
import { API } from '../types/constants';
import { supabase } from '@/lib/supabase';

interface EmailMetadata {
  documentType: string;
  processId: string;
  timestamp: string;
  [key: string]: string | number | boolean;
}

interface EmailData {
  documentType: string;
  metadata: EmailMetadata;
  extractedText: string;
  processId: string;
  recipient?: string;
}

interface DocumentUploadNotification {
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

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

interface AppointmentEmailData {
  name: string;
  email: string;
  telefon: string;
  termin_datum: Date;
  notizen?: string;
}

function getResendClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Email service can only be used on the server side');
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendDocumentUploadNotification(data: DocumentUploadNotification): Promise<EmailResult> {
  try {
    const resend = getResendClient();
    const response: CreateEmailResponse = await resend.emails.send({
      from: 'AlphaAgents <onboarding@resend.dev>',
      to: 'wehrlinatasha@gmail.com', // Your email address
      subject: `Neues Dokument hochgeladen: ${data.fileName}`,
      html: `
        <h2>Neues Dokument wurde hochgeladen</h2>
        
        <h3>Dokument Details:</h3>
        <ul>
          <li><strong>Dateiname:</strong> ${data.fileName}</li>
          <li><strong>Dokument-ID:</strong> ${data.documentId}</li>
          <li><strong>Dokumententyp:</strong> ${data.documentType}</li>
          <li><strong>Hochgeladen am:</strong> ${new Date(data.uploadedAt).toLocaleString('de-CH')}</li>
        </ul>

        <h3>Benutzer Information:</h3>
        <ul>
          <li><strong>Quelle:</strong> ${data.uploadedBy.source === 'chat' ? 'Chat Interface' : 'Dashboard'}</li>
          ${data.uploadedBy.name ? `<li><strong>Name:</strong> ${data.uploadedBy.name}</li>` : ''}
          ${data.uploadedBy.email ? `<li><strong>Email:</strong> ${data.uploadedBy.email}</li>` : ''}
          ${data.uploadedBy.phone ? `<li><strong>Telefon:</strong> ${data.uploadedBy.phone}</li>` : ''}
        </ul>
      `,
    });

    return {
      success: true,
      messageId: response.data?.id,
    };
  } catch (error) {
    console.error('Fehler beim Senden der Upload-Benachrichtigung:', error);
    return {
      success: false,
      error: {
        code: 'EMAIL_SEND_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      },
    };
  }
}

export async function sendProcessingNotification(data: EmailData): Promise<EmailResult> {
  // Validiere E-Mail-Empfänger
  const recipient = data.recipient ?? 'processing@swiss-insurance.ch';
  if (!isValidEmail(recipient)) {
    throw new ValidationError('Ungültige E-Mail-Adresse', 'recipient');
  }

  try {
    const resend = getResendClient();
    const { documentType, metadata, extractedText, processId } = data;

    const response: CreateEmailResponse = await resend.emails.send({
      from: 'ocr@swiss-insurance.ch',
      to: recipient,
      subject: `Dokument verarbeitet: ${documentType} (${processId})`,
      text: `
        Neues Dokument verarbeitet:
        Typ: ${documentType}
        Prozess-ID: ${processId}
        
        Metadaten:
        ${Object.entries(metadata)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')}
        
        Extrahierter Text:
        ${extractedText}
      `.trim(),
    });

    return {
      success: true,
      messageId: response.data?.id,
    };
  } catch (error) {
    if (isErrorWithMessage(error)) {
      console.error('E-Mail-Versand fehlgeschlagen:', error);

      return {
        success: false,
        error: {
          code: 'EMAIL_SEND_FAILED',
          message: error.message,
          details: error,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Ein unbekannter Fehler ist aufgetreten',
      },
    };
  }
}

export class EmailService {
  private static instance: EmailService;

  private constructor() {}

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendAppointmentConfirmation(data: AppointmentEmailData) {
    try {
      const response = await fetch('/api/appointment/confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          telefon: data.telefon,
          termin_datum: data.termin_datum,
          notizen: data.notizen
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send confirmation email');
      }

      return await response.json();
    } catch (err) {
      console.error('Failed to send appointment confirmation email:', err);
      throw new Error('Failed to send appointment confirmation email');
    }
  }
}
