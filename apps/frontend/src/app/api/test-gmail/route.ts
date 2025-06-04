import { NextRequest, NextResponse } from 'next/server';
import { GoogleEmailService } from '../../../../../../packages/services/src/email/GoogleEmailService';

/**
 * Test Gmail Service - Direct token setup and email check
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing Gmail service directly...');

    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ 
        error: 'refreshToken is required for testing',
        hint: 'Get refresh token from OAuth flow first'
      }, { status: 400 });
    }

    // Initialize Gmail service with token
    const googleEmail = GoogleEmailService.getInstance();
    await googleEmail.setRefreshToken(refreshToken);

    // Test connection
    const connectionTest = await googleEmail.testConnection();
    if (!connectionTest) {
      throw new Error('Gmail connection test failed');
    }

    console.log('✅ Gmail connection successful, checking emails...');

    // Get recent emails with attachments
    const emails = await googleEmail.getEmails({
      maxResults: 5,
      includeRead: false,
      hasAttachments: true
    });

    console.log(`📧 Found ${emails.length} emails with attachments`);

    // Filter for relevant attachments
    const relevantEmails = emails.filter(email => {
      const relevantAttachments = email.attachments.filter(att => {
        const supportedTypes = [
          'application/pdf',
          'image/png',
          'image/jpeg',
          'image/webp',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        return supportedTypes.includes(att.mimeType) && att.size > 1024 && att.size < 25 * 1024 * 1024;
      });
      return relevantAttachments.length > 0;
    });

    console.log(`📎 Found ${relevantEmails.length} emails with relevant attachments`);

    return NextResponse.json({
      success: true,
      data: {
        connection: 'successful',
        totalEmails: emails.length,
        relevantEmails: relevantEmails.length,
        emails: relevantEmails.map(email => ({
          id: email.id,
          from: email.from,
          subject: email.subject,
          receivedAt: email.receivedAt,
          attachments: email.attachments.map(att => ({
            filename: att.filename,
            mimeType: att.mimeType,
            size: att.size
          }))
        }))
      }
    });

  } catch (error) {
    console.error('❌ Gmail test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Gmail test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * GET: Show instructions
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    instructions: [
      "This endpoint tests Gmail integration directly",
      "1. Complete OAuth flow at /api/gmail-auth",
      "2. Copy refresh token from OAuth response",  
      "3. POST to /api/test-gmail with { \"refreshToken\": \"your_token\" }",
      "4. Check if emails with attachments are found"
    ],
    oauthUrl: "http://localhost:3000/api/gmail-auth"
  });
}