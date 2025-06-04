import { NextRequest, NextResponse } from 'next/server';
import { EmailMonitorAgent } from '../../../../../../packages/agents/src/email/EmailMonitorAgent';
// import { ServiceTokens } from '../../../../../../packages/core/src/container/DIContainer';
import { globalServices } from '../../../lib/services';

/**
 * Email Monitor API Route
 * Controls email monitoring for automatic document processing
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📧 Email Monitor request started...');

    // Get global service container
    const container = await globalServices.getContainer();
    
    const body = await request.json();
    const { action, maxEmails, includeRead, emailId } = body;
    
    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    console.log(`📧 Email Monitor action: ${action}`);

    // Initialize Email Monitor Agent
    const emailMonitorAgent = new EmailMonitorAgent({
      id: 'email-monitor-agent',
      name: 'EmailMonitorAgent',
      version: '1.0.0',
      enabled: true,
      maxRetries: 3,
      timeout: 300000, // 5 minutes for email processing
      healthCheckInterval: 30000,
      dependencies: []
    }, container);

    await emailMonitorAgent.start();

    // Execute the requested action
    const result = await emailMonitorAgent.execute({
      action: action,
      maxEmails: maxEmails || 10,
      includeRead: includeRead || false,
      emailId: emailId,
      filters: {
        hasAttachments: true // Only process emails with attachments
      }
    }, {
      sessionId: `email-monitor-${Date.now()}`,
      userId: 'email-monitor-user',
      agentId: 'email-monitor-agent',
      timestamp: new Date(),
      metadata: { action, maxEmails, includeRead }
    });

    await emailMonitorAgent.stop();

    if (!result.success) {
      console.error('❌ Email monitoring failed:', result.error);
      throw new Error(`Email monitoring failed: ${result.error || 'Unknown error'}`);
    }

    console.log('✅ Email monitoring completed successfully');
    
    return NextResponse.json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('❌ Email Monitor error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * GET endpoint for monitoring status
 */
export async function GET() {
  try {
    // Return basic status information
    return NextResponse.json({
      success: true,
      data: {
        service: 'EmailMonitorAgent',
        status: 'available',
        actions: [
          'checkInbox',
          'processEmail', 
          'startMonitoring',
          'stopMonitoring'
        ],
        supportedFormats: [
          'application/pdf',
          'image/png',
          'image/jpeg',
          'image/webp',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
      }
    });
  } catch (_error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}