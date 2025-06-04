import { EmailNotificationService } from './EmailNotificationService';
import { LoggerService } from '../logging/LoggerService';
import { AppointmentRecord, QuoteRecord } from '../database/SupabaseService';

/**
 * Appointment & Quote Email Service
 * Handles confirmation emails for appointments and quotes
 */
export class AppointmentEmailService {
  private static instance: AppointmentEmailService;
  private emailService: EmailNotificationService;
  private logger: LoggerService;

  private constructor() {
    this.emailService = EmailNotificationService.getInstance();
    this.logger = LoggerService.getInstance().child({ component: 'appointment-email' });
  }

  static getInstance(): AppointmentEmailService {
    if (!AppointmentEmailService.instance) {
      AppointmentEmailService.instance = new AppointmentEmailService();
    }
    return AppointmentEmailService.instance;
  }

  // === APPOINTMENT EMAILS ===

  /**
   * Send appointment confirmation to customer
   */
  async sendAppointmentConfirmation(appointment: AppointmentRecord): Promise<void> {
    try {
      const subject = `✅ Terminbestätigung - AlphaAgents (Ref: ${appointment.id.slice(0, 8).toUpperCase()})`;
      
      const htmlContent = this.generateAppointmentConfirmationHTML(appointment);
      const textContent = this.generateAppointmentConfirmationText(appointment);

      await this.emailService.sendEmail({
        to: appointment.customer_email,
        subject,
        html: htmlContent,
        text: textContent
      });

      this.logger.info('Appointment confirmation sent to customer', {
        appointmentId: appointment.id,
        customerEmail: appointment.customer_email
      });
    } catch (error) {
      this.logger.error('Failed to send appointment confirmation', { error, appointment });
      throw error;
    }
  }

  /**
   * Send appointment notification to staff
   */
  async sendAppointmentNotificationToStaff(appointment: AppointmentRecord): Promise<void> {
    try {
      const subject = `🗓️ Neue Terminanfrage - ${appointment.customer_name} (${appointment.appointment_type})`;
      
      const htmlContent = this.generateStaffAppointmentNotificationHTML(appointment);
      const textContent = this.generateStaffAppointmentNotificationText(appointment);

      await this.emailService.sendEmail({
        to: 'wehrlinatasha@gmail.com',
        subject,
        html: htmlContent,
        text: textContent
      });

      this.logger.info('Appointment notification sent to staff', {
        appointmentId: appointment.id,
        customerName: appointment.customer_name
      });
    } catch (error) {
      this.logger.error('Failed to send appointment notification to staff', { error, appointment });
      throw error;
    }
  }

  // === QUOTE EMAILS ===

  /**
   * Send quote confirmation to customer
   */
  async sendQuoteConfirmation(quote: QuoteRecord): Promise<void> {
    try {
      const subject = `💰 Ihre Versicherungsofferte - AlphaAgents (Ref: ${quote.id.slice(0, 8).toUpperCase()})`;
      
      const htmlContent = this.generateQuoteConfirmationHTML(quote);
      const textContent = this.generateQuoteConfirmationText(quote);

      await this.emailService.sendEmail({
        to: quote.customer_email,
        subject,
        html: htmlContent,
        text: textContent
      });

      this.logger.info('Quote confirmation sent to customer', {
        quoteId: quote.id,
        customerEmail: quote.customer_email
      });
    } catch (error) {
      this.logger.error('Failed to send quote confirmation', { error, quote });
      throw error;
    }
  }

  /**
   * Send quote notification to staff
   */
  async sendQuoteNotificationToStaff(quote: QuoteRecord): Promise<void> {
    try {
      const subject = `💰 Neue Offertenanfrage - ${quote.customer_name} (${quote.insurance_type})`;
      
      const htmlContent = this.generateStaffQuoteNotificationHTML(quote);
      const textContent = this.generateStaffQuoteNotificationText(quote);

      await this.emailService.sendEmail({
        to: 'wehrlinatasha@gmail.com',
        subject,
        html: htmlContent,
        text: textContent
      });

      this.logger.info('Quote notification sent to staff', {
        quoteId: quote.id,
        customerName: quote.customer_name
      });
    } catch (error) {
      this.logger.error('Failed to send quote notification to staff', { error, quote });
      throw error;
    }
  }

  // === EMAIL TEMPLATES ===

  /**
   * Generate appointment confirmation HTML for customer
   */
  private generateAppointmentConfirmationHTML(appointment: AppointmentRecord): string {
    const appointmentTypeDisplay = this.getAppointmentTypeDisplay(appointment.appointment_type);
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Terminbestätigung</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .details { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; }
        .highlight { color: #1e40af; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✅ Terminbestätigung</h1>
        <p>AlphaAgents - Ihre Schweizer Versicherungsexperten</p>
      </div>
      
      <div class="content">
        <p>Sehr geehrte/r ${appointment.customer_name},</p>
        
        <p>vielen Dank für Ihre Terminanfrage! Wir haben Ihren Wunschtermin erfolgreich registriert und werden uns innerhalb der nächsten 24 Stunden bei Ihnen melden, um den genauen Termin zu bestätigen.</p>
        
        <div class="details">
          <h3>📋 Ihre Termindetails:</h3>
          <ul>
            <li><strong>Referenz-Nr.:</strong> <span class="highlight">${appointment.id.slice(0, 8).toUpperCase()}</span></li>
            <li><strong>Art der Beratung:</strong> ${appointmentTypeDisplay}</li>
            <li><strong>Gewünschter Termin:</strong> ${appointment.preferred_date} um ${appointment.preferred_time}</li>
            <li><strong>Kontakt:</strong> ${appointment.customer_email} / ${appointment.customer_phone || 'Nicht angegeben'}</li>
            ${appointment.reason ? `<li><strong>Anliegen:</strong> ${appointment.reason}</li>` : ''}
          </ul>
        </div>
        
        <p><strong>Nächste Schritte:</strong></p>
        <ol>
          <li>Ein Mitarbeiter unseres Beratungsteams wird Sie kontaktieren</li>
          <li>Gemeinsam bestätigen wir den genauen Termin</li>
          <li>Sie erhalten eine finale Terminbestätigung</li>
        </ol>
        
        <p>Haben Sie Fragen oder möchten Sie den Termin ändern? Kontaktieren Sie uns unter:</p>
        <ul>
          <li>📧 E-Mail: info@alphaagents.ch</li>
          <li>📞 Telefon: +41 44 123 45 67</li>
        </ul>
        
        <p>Wir freuen uns auf Ihren Besuch!</p>
        
        <p>Mit freundlichen Grüssen<br>
        Ihr AlphaAgents Team</p>
      </div>
      
      <div class="footer">
        <p>AlphaAgents | Schweizer Versicherungsexperten | www.alphaagents.ch</p>
        <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese Nachricht.</p>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Generate appointment confirmation text for customer
   */
  private generateAppointmentConfirmationText(appointment: AppointmentRecord): string {
    const appointmentTypeDisplay = this.getAppointmentTypeDisplay(appointment.appointment_type);
    
    return `
Terminbestätigung - AlphaAgents

Sehr geehrte/r ${appointment.customer_name},

vielen Dank für Ihre Terminanfrage! 

IHRE TERMINDETAILS:
- Referenz-Nr.: ${appointment.id.slice(0, 8).toUpperCase()}
- Art der Beratung: ${appointmentTypeDisplay}
- Gewünschter Termin: ${appointment.preferred_date} um ${appointment.preferred_time}
- Kontakt: ${appointment.customer_email} / ${appointment.customer_phone || 'Nicht angegeben'}
${appointment.reason ? `- Anliegen: ${appointment.reason}` : ''}

Ein Mitarbeiter wird Sie innerhalb von 24 Stunden kontaktieren.

Kontakt: info@alphaagents.ch | +41 44 123 45 67

Mit freundlichen Grüssen
Ihr AlphaAgents Team
    `.trim();
  }

  /**
   * Generate staff appointment notification HTML
   */
  private generateStaffAppointmentNotificationHTML(appointment: AppointmentRecord): string {
    const appointmentTypeDisplay = this.getAppointmentTypeDisplay(appointment.appointment_type);
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Neue Terminanfrage</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .details { background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
        .action { background: #1e40af; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🗓️ Neue Terminanfrage</h1>
        <p>Aktion erforderlich - Kunde kontaktieren</p>
      </div>
      
      <div class="content">
        <p><strong>Eine neue Terminanfrage ist eingegangen!</strong></p>
        
        <div class="details">
          <h3>📋 Termindetails:</h3>
          <ul>
            <li><strong>Kunde:</strong> ${appointment.customer_name}</li>
            <li><strong>E-Mail:</strong> ${appointment.customer_email}</li>
            <li><strong>Telefon:</strong> ${appointment.customer_phone || 'Nicht angegeben'}</li>
            <li><strong>Art der Beratung:</strong> ${appointmentTypeDisplay}</li>
            <li><strong>Gewünschter Termin:</strong> ${appointment.preferred_date} um ${appointment.preferred_time}</li>
            <li><strong>Referenz-Nr.:</strong> ${appointment.id.slice(0, 8).toUpperCase()}</li>
            <li><strong>Eingegangen am:</strong> ${new Date(appointment.created_at).toLocaleString('de-CH')}</li>
            ${appointment.reason ? `<li><strong>Anliegen:</strong> ${appointment.reason}</li>` : ''}
          </ul>
        </div>
        
        <p><strong>⚡ AKTION ERFORDERLICH:</strong></p>
        <ol>
          <li>Kontaktieren Sie den Kunden innerhalb von 24 Stunden</li>
          <li>Bestätigen Sie den Termin oder schlagen Sie Alternativen vor</li>
          <li>Aktualisieren Sie den Status in der Datenbank</li>
        </ol>
        
        <p><strong>📞 Kunde kontaktieren:</strong></p>
        <ul>
          <li>E-Mail: <a href="mailto:${appointment.customer_email}">${appointment.customer_email}</a></li>
          ${appointment.customer_phone ? `<li>Telefon: <a href="tel:${appointment.customer_phone}">${appointment.customer_phone}</a></li>` : ''}
        </ul>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Generate staff appointment notification text
   */
  private generateStaffAppointmentNotificationText(appointment: AppointmentRecord): string {
    const appointmentTypeDisplay = this.getAppointmentTypeDisplay(appointment.appointment_type);
    
    return `
🗓️ NEUE TERMINANFRAGE - AKTION ERFORDERLICH

KUNDE: ${appointment.customer_name}
E-MAIL: ${appointment.customer_email}
TELEFON: ${appointment.customer_phone || 'Nicht angegeben'}
ART: ${appointmentTypeDisplay}
WUNSCHTERMIN: ${appointment.preferred_date} um ${appointment.preferred_time}
REFERENZ: ${appointment.id.slice(0, 8).toUpperCase()}
EINGEGANGEN: ${new Date(appointment.created_at).toLocaleString('de-CH')}
${appointment.reason ? `ANLIEGEN: ${appointment.reason}` : ''}

⚡ AKTION ERFORDERLICH:
- Kunde innerhalb 24h kontaktieren
- Termin bestätigen oder Alternative vorschlagen
- Status in Datenbank aktualisieren

AlphaAgents Staff Notification
    `.trim();
  }

  /**
   * Generate quote confirmation HTML for customer
   */
  private generateQuoteConfirmationHTML(quote: QuoteRecord): string {
    const insuranceTypeDisplay = this.getInsuranceTypeDisplay(quote.insurance_type);
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Ihre Versicherungsofferte</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .details { background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .premium { background: #059669; color: white; padding: 15px; border-radius: 8px; text-align: center; font-size: 18px; margin: 20px 0; }
        .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>💰 Ihre Versicherungsofferte</h1>
        <p>AlphaAgents - Massgeschneiderte Schweizer Versicherungslösungen</p>
      </div>
      
      <div class="content">
        <p>Sehr geehrte/r ${quote.customer_name},</p>
        
        <p>vielen Dank für Ihr Interesse an unseren Versicherungsprodukten! Wir haben für Sie eine individuelle Offerte erstellt.</p>
        
        <div class="details">
          <h3>📋 Ihre Offerten-Details:</h3>
          <ul>
            <li><strong>Referenz-Nr.:</strong> ${quote.id.slice(0, 8).toUpperCase()}</li>
            <li><strong>Versicherungsart:</strong> ${insuranceTypeDisplay}</li>
            <li><strong>Gültig bis:</strong> ${new Date(quote.valid_until).toLocaleDateString('de-CH')}</li>
          </ul>
        </div>
        
        <div class="premium">
          <h3>💰 Geschätzte Jahresprämie</h3>
          <div style="font-size: 24px; font-weight: bold;">${quote.premium_currency} ${quote.estimated_premium}</div>
          <p style="margin: 5px 0 0 0; font-size: 14px;">*Unverbindliche Schätzung, finale Prämie nach Prüfung</p>
        </div>
        
        <p><strong>Nächste Schritte:</strong></p>
        <ol>
          <li>Prüfen Sie die Offerte in Ruhe</li>
          <li>Bei Interesse kontaktieren Sie uns für ein Beratungsgespräch</li>
          <li>Wir erstellen Ihnen gerne eine detaillierte Offerte</li>
        </ol>
        
        <p><strong>Fragen zur Offerte?</strong></p>
        <p>Kontaktieren Sie uns gerne:</p>
        <ul>
          <li>📧 E-Mail: info@alphaagents.ch</li>
          <li>📞 Telefon: +41 44 123 45 67</li>
          <li>🗓️ Beratungstermin online buchen: www.alphaagents.ch</li>
        </ul>
        
        <p>Wir freuen uns, Sie bald als Kunden begrüssen zu dürfen!</p>
        
        <p>Mit freundlichen Grüssen<br>
        Ihr AlphaAgents Team</p>
      </div>
      
      <div class="footer">
        <p>AlphaAgents | Schweizer Versicherungsexperten | www.alphaagents.ch</p>
        <p>Diese Offerte ist unverbindlich und ${Math.floor((new Date(quote.valid_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} Tage gültig.</p>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Generate quote confirmation text for customer  
   */
  private generateQuoteConfirmationText(quote: QuoteRecord): string {
    const insuranceTypeDisplay = this.getInsuranceTypeDisplay(quote.insurance_type);
    
    return `
Ihre Versicherungsofferte - AlphaAgents

Sehr geehrte/r ${quote.customer_name},

vielen Dank für Ihr Interesse! Hier ist Ihre individuelle Offerte:

OFFERTEN-DETAILS:
- Referenz-Nr.: ${quote.id.slice(0, 8).toUpperCase()}  
- Versicherungsart: ${insuranceTypeDisplay}
- Geschätzte Jahresprämie: ${quote.premium_currency} ${quote.estimated_premium}
- Gültig bis: ${new Date(quote.valid_until).toLocaleDateString('de-CH')}

*Unverbindliche Schätzung, finale Prämie nach Prüfung

NÄCHSTE SCHRITTE:
1. Offerte prüfen
2. Bei Interesse Beratungsgespräch vereinbaren  
3. Detaillierte Offerte erhalten

Kontakt: info@alphaagents.ch | +41 44 123 45 67

Mit freundlichen Grüssen
Ihr AlphaAgents Team
    `.trim();
  }

  /**
   * Generate staff quote notification HTML
   */
  private generateStaffQuoteNotificationHTML(quote: QuoteRecord): string {
    const insuranceTypeDisplay = this.getInsuranceTypeDisplay(quote.insurance_type);
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Neue Offertenanfrage</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #7c3aed; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .details { background: #faf5ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>💰 Neue Offertenanfrage</h1>
        <p>Potentieller Neukunde - Follow-up empfohlen</p>
      </div>
      
      <div class="content">
        <p><strong>Eine neue Offertenanfrage ist eingegangen!</strong></p>
        
        <div class="details">
          <h3>📋 Offerten-Details:</h3>
          <ul>
            <li><strong>Kunde:</strong> ${quote.customer_name}</li>
            <li><strong>E-Mail:</strong> ${quote.customer_email}</li>
            <li><strong>Telefon:</strong> ${quote.customer_phone || 'Nicht angegeben'}</li>
            <li><strong>Versicherungsart:</strong> ${insuranceTypeDisplay}</li>
            <li><strong>Geschätzte Prämie:</strong> ${quote.premium_currency} ${quote.estimated_premium}</li>
            <li><strong>Referenz-Nr.:</strong> ${quote.id.slice(0, 8).toUpperCase()}</li>
            <li><strong>Eingegangen am:</strong> ${new Date(quote.created_at).toLocaleString('de-CH')}</li>
            <li><strong>Gültig bis:</strong> ${new Date(quote.valid_until).toLocaleDateString('de-CH')}</li>
          </ul>
        </div>
        
        <p><strong>💡 FOLLOW-UP EMPFOHLEN:</strong></p>
        <ol>
          <li>Kunde innerhalb von 48 Stunden kontaktieren</li>
          <li>Detaillierte Beratung anbieten</li>
          <li>Bei Interesse: Vertragsabschluss vorbereiten</li>
        </ol>
        
        <p><strong>📞 Kunde kontaktieren:</strong></p>
        <ul>
          <li>E-Mail: <a href="mailto:${quote.customer_email}">${quote.customer_email}</a></li>
          ${quote.customer_phone ? `<li>Telefon: <a href="tel:${quote.customer_phone}">${quote.customer_phone}</a></li>` : ''}
        </ul>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Generate staff quote notification text
   */
  private generateStaffQuoteNotificationText(quote: QuoteRecord): string {
    const insuranceTypeDisplay = this.getInsuranceTypeDisplay(quote.insurance_type);
    
    return `
💰 NEUE OFFERTENANFRAGE - FOLLOW-UP EMPFOHLEN

KUNDE: ${quote.customer_name}
E-MAIL: ${quote.customer_email}
TELEFON: ${quote.customer_phone || 'Nicht angegeben'}
VERSICHERUNG: ${insuranceTypeDisplay}
GESCHÄTZTE PRÄMIE: ${quote.premium_currency} ${quote.estimated_premium}
REFERENZ: ${quote.id.slice(0, 8).toUpperCase()}
EINGEGANGEN: ${new Date(quote.created_at).toLocaleString('de-CH')}
GÜLTIG BIS: ${new Date(quote.valid_until).toLocaleDateString('de-CH')}

💡 FOLLOW-UP EMPFOHLEN:
- Kunde innerhalb 48h kontaktieren
- Detaillierte Beratung anbieten
- Bei Interesse: Vertragsabschluss

AlphaAgents Staff Notification
    `.trim();
  }

  // === UTILITY METHODS ===

  private getAppointmentTypeDisplay(type: string): string {
    const types: Record<string, string> = {
      'consultation': 'Allgemeine Versicherungsberatung',
      'claim_review': 'Schadensbesprechung/Schaden melden',
      'contract_discussion': 'Vertragsbesprechung/Änderungen',
      'general': 'Allgemeines Anliegen'
    };
    return types[type] || 'Beratung';
  }

  private getInsuranceTypeDisplay(type: string): string {
    const types: Record<string, string> = {
      'krankenversicherung': 'Krankenversicherung',
      'unfallversicherung': 'Unfallversicherung',
      'haftpflichtversicherung': 'Haftpflichtversicherung',
      'sachversicherung': 'Sachversicherung',
      'lebensversicherung': 'Lebensversicherung'
    };
    return types[type] || 'Versicherung';
  }
}