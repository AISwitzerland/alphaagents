import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Schema-Informationen für Debug-Zwecke
    const schema = {
      endpoints: {
        '/api/chat': {
          method: 'POST',
          description: 'Chat with AI Agent',
          body: {
            message: 'string',
            sessionId: 'string (optional)'
          },
          response: {
            response: 'string',
            sessionId: 'string'
          }
        },
        '/api/health': {
          method: 'GET',
          description: 'System health check',
          response: {
            status: 'string',
            services: 'object',
            timestamp: 'string'
          }
        },
        '/api/contact': {
          method: 'POST',
          description: 'Send contact form',
          body: {
            firstName: 'string',
            lastName: 'string',
            email: 'string',
            company: 'string (optional)',
            phone: 'string (optional)',
            interest: 'string (optional)',
            message: 'string'
          },
          response: {
            success: 'boolean',
            message: 'string'
          }
        },
        '/api/upload': {
          method: 'POST',
          description: 'Upload file for processing',
          body: 'FormData with file',
          response: {
            success: 'boolean',
            fileUrl: 'string',
            fileId: 'string'
          }
        },
        '/api/ocr-debug': {
          method: 'POST',
          description: 'OCR processing with debug info',
          body: {
            fileUrl: 'string',
            options: 'object (optional)'
          },
          response: {
            text: 'string',
            confidence: 'number',
            processingTime: 'number',
            debug: 'object'
          }
        },
        '/api/ocr-save': {
          method: 'POST',
          description: 'OCR processing with save to database',
          body: {
            fileUrl: 'string',
            metadata: 'object (optional)'
          },
          response: {
            text: 'string',
            documentId: 'string',
            success: 'boolean'
          }
        }
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextVersion: '15.1.8',
        timestamp: new Date().toISOString()
      },
      features: {
        'OCR Processing': 'Available via GPT-4o Vision',
        'Chat Interface': 'Available via OpenAI GPT-4',
        'E-Mail System': 'Available via Resend',
        'File Upload': 'Available with multiple formats',
        'Database': 'Available via Supabase',
        'Error Handling': 'Comprehensive error boundaries',
        'SEO Optimization': 'Complete meta tags and sitemap'
      }
    }

    return NextResponse.json(schema, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    console.error('Debug schema error:', error)
    return NextResponse.json(
      { error: 'Failed to generate schema' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoint } = body

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint parameter required' },
        { status: 400 }
      )
    }

    // Test specific endpoint
    let testResult
    switch (endpoint) {
      case '/api/health':
        const healthResponse = await fetch(`${request.url.replace('/api/debug-schema', '/api/health')}`)
        testResult = {
          status: healthResponse.status,
          available: healthResponse.ok,
          response: await healthResponse.json()
        }
        break
      
      default:
        testResult = {
          status: 'unknown',
          available: false,
          message: 'Endpoint test not implemented'
        }
    }

    return NextResponse.json({
      endpoint,
      test: testResult,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Debug schema POST error:', error)
    return NextResponse.json(
      { error: 'Failed to test endpoint' },
      { status: 500 }
    )
  }
}