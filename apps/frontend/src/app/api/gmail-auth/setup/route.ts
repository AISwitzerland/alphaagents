import { NextRequest, NextResponse } from 'next/server';
import { GoogleEmailService } from '../../../../../../../packages/services/src/email/GoogleEmailService';

/**
 * Manual Gmail Token Setup - For direct token input
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Manual Gmail token setup...');

    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ 
        error: 'refreshToken is required',
        example: '{"refreshToken": "1//0..."}'
      }, { status: 400 });
    }

    // Set token in Gmail service
    const googleEmail = GoogleEmailService.getInstance();
    await googleEmail.setRefreshToken(refreshToken);

    // Test connection
    const connectionTest = await googleEmail.testConnection();
    if (!connectionTest) {
      throw new Error('Gmail connection test failed after token setup');
    }

    // Test fetching emails
    const emails = await googleEmail.getEmails({
      maxResults: 2,
      includeRead: false,
      hasAttachments: true
    });

    console.log('✅ Gmail token setup successful');

    return NextResponse.json({
      success: true,
      data: {
        message: 'Gmail token setup successful',
        connectionTest: true,
        emailsFound: emails.length,
        testEmails: emails.map(email => ({
          from: email.from,
          subject: email.subject,
          attachmentCount: email.attachments.length
        }))
      }
    });

  } catch (error) {
    console.error('❌ Gmail token setup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Gmail token setup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * GET: Instructions
 */
export async function GET() {
  return NextResponse.json({
    instructions: [
      "This endpoint allows manual refresh token setup",
      "1. Get a refresh token from Google OAuth playground:",
      "   - Visit: https://developers.google.com/oauthplayground/",
      "   - Select Gmail API v1 scopes",
      "   - Authorize and get refresh token",
      "2. POST the token here: {\"refreshToken\": \"your_token\"}",
      "3. Or get token from previous OAuth flow"
    ],
    alternativeMethod: "Complete OAuth at /api/gmail-auth",
    testEndpoint: "/api/simple-gmail-test"
  });
}