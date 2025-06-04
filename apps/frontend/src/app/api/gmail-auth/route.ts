import { NextRequest, NextResponse } from 'next/server';
import { GoogleEmailService } from '../../../../../../packages/services/src/email/GoogleEmailService';

/**
 * Gmail OAuth Authentication API Route
 * Handles OAuth flow for Gmail access
 */

/**
 * GET: Get OAuth authorization URL
 */
export async function GET() {
  try {
    console.log('🔐 Getting Gmail OAuth URL...');

    const googleEmail = GoogleEmailService.getInstance();
    const authUrl = googleEmail.getAuthUrl();

    return NextResponse.json({
      success: true,
      data: {
        authUrl,
        instructions: [
          '1. Visit the provided authorization URL',
          '2. Sign in with your Google account',
          '3. Grant permission to access Gmail',
          '4. Copy the authorization code',
          '5. Use POST /api/gmail-auth with the code'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Failed to get OAuth URL:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate OAuth URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * POST: Exchange authorization code for tokens
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Processing Gmail OAuth code...');

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ 
        error: 'Authorization code is required' 
      }, { status: 400 });
    }

    const googleEmail = GoogleEmailService.getInstance();
    const tokens = await googleEmail.getTokenFromCode(code);

    // Test the connection
    const connectionTest = await googleEmail.testConnection();
    
    if (!connectionTest) {
      throw new Error('Failed to establish Gmail connection after authentication');
    }

    console.log('✅ Gmail authentication successful');

    return NextResponse.json({
      success: true,
      data: {
        message: 'Gmail authentication successful',
        hasRefreshToken: !!tokens.refresh_token,
        connectionTest: connectionTest
      }
    });

  } catch (error) {
    console.error('❌ Gmail OAuth error:', error);
    return NextResponse.json({
      success: false,
      error: 'Gmail authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * PUT: Set refresh token directly (for testing)
 */
export async function PUT(request: NextRequest) {
  try {
    console.log('🔐 Setting Gmail refresh token...');

    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ 
        error: 'Refresh token is required' 
      }, { status: 400 });
    }

    const googleEmail = GoogleEmailService.getInstance();
    await googleEmail.setRefreshToken(refreshToken);

    // Test the connection
    const connectionTest = await googleEmail.testConnection();

    return NextResponse.json({
      success: true,
      data: {
        message: 'Refresh token set successfully',
        connectionTest: connectionTest
      }
    });

  } catch (error) {
    console.error('❌ Failed to set refresh token:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to set refresh token',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}