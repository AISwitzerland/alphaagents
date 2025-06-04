
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { firstName, lastName, email, company, phone, interest, message } = data

    // Validierung
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'Pflichtfelder fehlen' },
        { status: 400 }
      )
    }

    // E-Mail Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      )
    }

    // E-Mail an Sie (Natasha)
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Neue Kontaktanfrage von Alpha Informatik Website</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Kontaktdaten:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td style="padding: 8px 0;">${firstName} ${lastName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">E-Mail:</td><td style="padding: 8px 0;">${email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Unternehmen:</td><td style="padding: 8px 0;">${company || 'Nicht angegeben'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Telefon:</td><td style="padding: 8px 0;">${phone || 'Nicht angegeben'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Interesse:</td><td style="padding: 8px 0;">${interest || 'Nicht angegeben'}</td></tr>
          </table>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Nachricht:</h3>
          <p style="white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Diese E-Mail wurde automatisch von der Alpha Informatik Website generiert.<br>
          Zeitpunkt: ${new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' })}
        </p>
      </div>
    `

    await resend.emails.send({
      from: 'Alpha Informatik Website <onboarding@resend.dev>',
      to: 'wehrlinatasha@gmail.com',
      replyTo: email,
      subject: `Neue Kontaktanfrage: ${interest || 'Allgemeine Anfrage'} - ${firstName} ${lastName}`,
      html: adminEmailContent,
    })

    // Bestätigungs-E-Mail an Kunden
    const confirmationEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Vielen Dank!</h1>
          <p style="color: #dbeafe; margin: 10px 0 0 0; font-size: 16px;">Ihre Anfrage wurde erfolgreich übermittelt</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Liebe/r ${firstName} ${lastName},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            vielen Dank für Ihr Interesse an Alpha Informatik. Wir haben Ihre Anfrage erhalten und werden uns innerhalb von <strong>24 Stunden</strong> bei Ihnen melden.
          </p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #374151; margin-top: 0; font-size: 18px;">Ihre Anfrage im Überblick:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Interesse:</td><td style="padding: 8px 0; color: #374151;">${interest || 'Allgemeine Anfrage'}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Nachricht:</td><td style="padding: 8px 0; color: #374151;">${message.substring(0, 100)}${message.length > 100 ? '...' : ''}</td></tr>
            </table>
          </div>
          
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: white; margin-top: 0; font-size: 16px;">🚀 Dringende Fragen? Kontaktieren Sie uns direkt:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 5px 0; color: #d1fae5; font-weight: bold;">📞 Telefon:</td><td style="padding: 5px 0; color: white;">+41 44 123 45 67</td></tr>
              <tr><td style="padding: 5px 0; color: #d1fae5; font-weight: bold;">📧 E-Mail:</td><td style="padding: 5px 0; color: white;">wehrlinatasha@gmail.com</td></tr>
            </table>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Mit freundlichen Grüssen<br>
            <strong>Ihr Alpha Informatik Team</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <div style="text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              <strong>Alpha Informatik AG</strong><br>
              Bahnhofstrasse 123 | 8001 Zürich | Schweiz<br>
              <a href="https://alpha-informatik.ch" style="color: #2563eb; text-decoration: none;">www.alpha-informatik.ch</a>
            </p>
          </div>
        </div>
      </div>
    `

    await resend.emails.send({
      from: 'Alpha Informatik <onboarding@resend.dev>',
      to: email,
      subject: '✅ Bestätigung Ihrer Anfrage - Alpha Informatik',
      html: confirmationEmailContent,
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Nachricht erfolgreich gesendet' 
    })

  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error)
    return NextResponse.json(
      { error: 'Fehler beim Senden der Nachricht' },
      { status: 500 }
    )
  }
}