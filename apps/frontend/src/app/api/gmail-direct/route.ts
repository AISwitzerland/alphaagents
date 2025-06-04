import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * Direct Gmail Test - Bypass GoogleEmailService for testing
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Direct Gmail test...');

    const body = await request.json();
    const { action = 'test' } = body;

    // Direct OAuth setup
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/api/gmail-auth/callback'
    );

    // For testing, we'll use a fresh OAuth token
    // This requires user interaction but works reliably
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify'
      ],
      prompt: 'consent'
    });

    if (action === 'getAuthUrl') {
      return NextResponse.json({
        success: true,
        data: {
          authUrl,
          instructions: [
            '1. Visit the auth URL',
            '2. Complete OAuth',
            '3. You will be redirected back',
            '4. Then test email monitoring'
          ]
        }
      });
    }

    // For actual email testing (after OAuth)
    return NextResponse.json({
      success: false,
      error: 'OAuth required',
      authUrl
    });

  } catch (error) {
    console.error('❌ Direct Gmail error:', error);
    return NextResponse.json({
      success: false,
      error: 'Direct Gmail test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * GET: Quick instructions
 */
export async function GET() {
  return NextResponse.json({
    message: 'Direct Gmail testing endpoint',
    usage: 'POST with {"action": "getAuthUrl"} to start fresh OAuth'
  });
}