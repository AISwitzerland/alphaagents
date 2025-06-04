import { NextRequest, NextResponse } from 'next/server';
import { GoogleEmailService } from '../../../../../../packages/services/src/email/GoogleEmailService';

/**
 * Simple Gmail Test - Check if we can access emails after OAuth
 */
export async function GET() {
  try {
    console.log('🧪 Simple Gmail test...');

    // Test Gmail service (should be initialized from OAuth)
    const googleEmail = GoogleEmailService.getInstance();
    
    // Check if initialized
    const connectionTest = await googleEmail.testConnection();
    if (!connectionTest) {
      return NextResponse.json({
        success: false,
        error: 'Gmail not authenticated',
        hint: 'Complete OAuth flow first at /api/gmail-auth'
      }, { status: 401 });
    }

    console.log('✅ Gmail connection successful, fetching emails...');

    // Get recent emails with attachments
    const emails = await googleEmail.getEmails({
      maxResults: 3,
      includeRead: false,
      hasAttachments: true
    });

    console.log(`📧 Found ${emails.length} emails with attachments`);

    return NextResponse.json({
      success: true,
      data: {
        connection: 'successful',
        emailsFound: emails.length,
        emails: emails.map(email => ({
          id: email.id,
          from: email.from,
          subject: email.subject,
          receivedAt: email.receivedAt,
          attachmentCount: email.attachments.length,
          attachments: email.attachments.map(att => ({
            filename: att.filename,
            mimeType: att.mimeType,
            size: att.size
          }))
        }))
      }
    });

  } catch (error) {
    console.error('❌ Simple Gmail test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Gmail test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}