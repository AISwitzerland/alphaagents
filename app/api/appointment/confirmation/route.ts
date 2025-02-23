import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, telefon, termin_datum, notizen } = data;

    const date = new Date(termin_datum);

    const response = await resend.emails.send({
      from: 'AlphaAgents <onboarding@resend.dev>',
      to: email,
      subject: 'Terminbestätigung',
      html: `
        <h2>Ihre Terminbestätigung</h2>
        
        <p>Sehr geehrte(r) ${name},</p>
        
        <p>Ihr Termin wurde erfolgreich gebucht:</p>
        
        <ul>
          <li><strong>Datum:</strong> ${date.toLocaleDateString('de-CH')}</li>
          <li><strong>Zeit:</strong> ${date.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}</li>
          <li><strong>Telefon:</strong> ${telefon}</li>
          ${notizen ? `<li><strong>Notizen:</strong> ${notizen}</li>` : ''}
        </ul>
        
        <p>Bei Fragen erreichen Sie uns unter Ihrer angegebenen Telefonnummer.</p>
        
        <p>Freundliche Grüsse<br>Ihr AlphaAgents Team</p>
      `,
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
} 