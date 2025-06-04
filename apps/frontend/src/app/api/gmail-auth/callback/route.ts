import { NextRequest, NextResponse } from 'next/server';
import { GoogleEmailService } from '../../../../../../../packages/services/src/email/GoogleEmailService';

/**
 * Gmail OAuth Callback Route
 * Handles OAuth redirect and exchanges code for tokens
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔐 Gmail OAuth callback received...');

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.json({
        success: false,
        error: `OAuth error: ${error}`,
        details: searchParams.get('error_description') || 'Unknown OAuth error'
      }, { status: 400 });
    }

    if (!code) {
      return NextResponse.json({ 
        error: 'Authorization code not found in callback' 
      }, { status: 400 });
    }

    const googleEmail = GoogleEmailService.getInstance();
    const tokens = await googleEmail.getTokenFromCode(code);

    // Test the connection
    const connectionTest = await googleEmail.testConnection();
    
    console.log('🔑 Refresh Token received:', tokens.refresh_token ? 'Yes' : 'No');
    console.log('🔑 Token details:', { 
      hasRefreshToken: !!tokens.refresh_token,
      tokenPreview: tokens.refresh_token ? tokens.refresh_token.substring(0, 20) + '...' : 'none'
    });
    
    if (!connectionTest) {
      throw new Error('Failed to establish Gmail connection after authentication');
    }

    console.log('✅ Gmail authentication successful via callback');

    // Return success page
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gmail Authorization Successful</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 50px; text-align: center; }
          .success { color: #10b981; font-size: 24px; margin-bottom: 20px; }
          .details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .code { background: #1f2937; color: #10b981; padding: 10px; border-radius: 4px; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="success">✅ Gmail Authorization Successful!</div>
        <div class="details">
          <h3>🎉 EmailMonitorAgent ist jetzt bereit!</h3>
          <p>Ihr Gmail-Account wurde erfolgreich mit AlphaAgents verbunden.</p>
          <p><strong>Refresh Token erhalten:</strong> ${!!tokens.refresh_token ? 'Ja' : 'Nein'}</p>
          <p><strong>Verbindungstest:</strong> ${connectionTest ? 'Erfolgreich' : 'Fehlgeschlagen'}</p>
        </div>
        
        <h3>📧 Jetzt Email Monitoring testen:</h3>
        <div class="code">
          curl -X POST http://localhost:3000/api/email-monitor \\<br>
          &nbsp;&nbsp;-H "Content-Type: application/json" \\<br>
          &nbsp;&nbsp;-d '{"action": "checkInbox", "maxEmails": 5}'
        </div>
        
        <p style="margin-top: 30px;">
          <a href="http://localhost:3000" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Zurück zur Anwendung
          </a>
        </p>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('❌ Gmail OAuth callback error:', error);
    
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gmail Authorization Failed</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 50px; text-align: center; }
          .error { color: #ef4444; font-size: 24px; margin-bottom: 20px; }
          .details { background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="error">❌ Gmail Authorization Failed</div>
        <div class="details">
          <p><strong>Fehler:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
          <p>Bitte versuchen Sie es erneut oder prüfen Sie Ihre Google Cloud Konfiguration.</p>
        </div>
        <p>
          <a href="http://localhost:3000/api/gmail-auth" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Erneut versuchen
          </a>
        </p>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 500
    });
  }
}