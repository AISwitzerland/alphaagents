import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    // Validierung
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, E-Mail und Nachricht sind erforderlich' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'AlphaAgents <onboarding@resend.dev>',
      to: 'wehrlinatasha@gmail.com',
      subject: `Neue Kontaktanfrage von ${name}`,
      html: `
        <h2>Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        ${company ? `<p><strong>Unternehmen:</strong> ${company}</p>` : ''}
        <p><strong>Nachricht:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Fehler beim Senden der E-Mail' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'E-Mail erfolgreich gesendet', data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
} 