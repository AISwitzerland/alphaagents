import { NextRequest, NextResponse } from 'next/server';
import { OCRAgent } from '../../../../../../packages/agents/src/ocr/OCRAgent';
import { globalServices } from '../../../lib/services';

/**
 * OCR Debug API Route
 * Provides detailed OCR processing with real-time feedback
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 OCR Debug request started...');

    // Get global service container
    const container = await globalServices.getContainer();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log(`📄 Processing file: ${file.name} (${file.size} bytes)`);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Initialize OCR Agent
    const ocrAgent = new OCRAgent({
      id: 'ocr-agent-debug',
      name: 'OCRAgent',
      version: '1.0.0',
      enabled: true,
      maxRetries: 3,
      timeout: 60000,
      healthCheckInterval: 30000,
      dependencies: []
    }, container);

    await ocrAgent.start();

    console.log('🤖 OCR Agent initialized, starting document classification...');

    // Process document with classification
    const ocrResult = await ocrAgent.execute({
      action: 'classifyDocument',
      imageBuffer: buffer,
      filename: file.name,
      mimeType: file.type,
      language: 'de'
    }, {
      sessionId: `debug-${Date.now()}`,
      userId: 'debug-user',
      agentId: 'ocr-agent-debug',
      timestamp: new Date(),
      metadata: { filename: file.name, size: file.size }
    });

    if (ocrResult.success && ocrResult.data) {
      console.log('✅ OCR processing completed successfully');
      
      return NextResponse.json({
        success: true,
        data: {
          extractedText: ocrResult.data.extractedText || '',
          classification: ocrResult.data.classification || {
            type: 'Unknown',
            category: 'Unclassified',
            confidence: 0,
            summary: 'No classification available',
            keyFields: {}
          },
          processingTime: ocrResult.data.processingTime || 0,
          confidence: ocrResult.data.confidence || 0,
          metadata: ocrResult.data.metadata || {}
        }
      });
    } else {
      console.error('❌ OCR processing failed:', ocrResult.error);
      return NextResponse.json({
        success: false,
        error: 'OCR processing failed',
        details: ocrResult.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ OCR Debug error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}