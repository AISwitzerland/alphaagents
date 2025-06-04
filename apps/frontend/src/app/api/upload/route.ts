import { NextRequest, NextResponse } from 'next/server';
import { DocumentAgent } from '../../../../../../packages/agents/src/document/DocumentAgent';
import { OCRAgent } from '../../../../../../packages/agents/src/ocr/OCRAgent';
import { DIContainer, ServiceTokens } from '../../../../../../packages/core/src/container/DIContainer';
import { SupabaseService } from '../../../../../../packages/services/src/database/SupabaseService';
import { globalServices } from '../../../lib/services';

/**
 * Classify document and route to appropriate table
 */
async function classifyAndRoute(documentId: string, extractedText: string, container: DIContainer) {
  try {
    const supabaseService = await container.resolve<SupabaseService>(ServiceTokens.SUPABASE_SERVICE);
    
    // Simple classification based on keywords
    const text = extractedText.toLowerCase();
    let documentType = 'miscellaneous';
    let routingResult = null;

    if (text.includes('schadenmeldung') || text.includes('schaden') || text.includes('versicherung')) {
      documentType = 'damage_report';
      // Extract key data for damage report
      routingResult = await supabaseService.createDamageReport({
        document_id: documentId,
        schaden_beschreibung: extractedText.substring(0, 500), // First 500 chars
        status: 'eingereicht'
      });
    } 
    else if (text.includes('unfall') || text.includes('unfallmeldung') || text.includes('verletzung')) {
      documentType = 'accident_report';
      // Could add accident report creation here
    }
    else if (text.includes('rechnung') || text.includes('invoice') || text.includes('betrag') || text.includes('mwst')) {
      documentType = 'invoice';
      // Could add invoice creation here  
    }
    else if (text.includes('termin') || text.includes('appointment') || text.includes('datum')) {
      documentType = 'appointment';
      // Could add appointment creation here
    }

    // Update document with classification
    await supabaseService.updateDocumentOCR(documentId, {
      status: 'verarbeitet',
      ocr_content: extractedText
    });

    return {
      type: documentType,
      routed: !!routingResult,
      details: routingResult
    };

  } catch (error) {
    console.error('Classification error:', error);
    return { type: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Document Upload API Route
 * Handles file uploads and OCR processing
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Document upload started...');

    // Get global service container
    const container = await globalServices.getContainer();
    
    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userInfo = formData.get('userInfo') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Initialize Document Agent
    const documentAgent = new DocumentAgent({
      id: 'document-agent-upload',
      name: 'DocumentAgent',
      version: '1.0.0',
      enabled: true,
      maxRetries: 3,
      timeout: 30000,
      healthCheckInterval: 30000,
      dependencies: []
    }, container);

    // Start the agent (this calls initialize internally)
    await documentAgent.start();

    // Process file upload
    const uploadResult = await documentAgent.execute({
      action: 'upload',
      file: {
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        buffer: buffer
      },
      userInfo: userInfo ? JSON.parse(userInfo) : undefined
    }, {
      sessionId: `upload-${Date.now()}`,
      userId: 'web-user',
      agentId: 'document-agent-upload',
      timestamp: new Date(),
      metadata: {}
    });

    if (uploadResult.success && uploadResult.data?.documentRecord) {
      console.log('✅ Document uploaded successfully');

      // Initialize OCR Agent for processing
      const ocrAgent = new OCRAgent({
        id: 'ocr-agent-upload',
        name: 'OCRAgent', 
        version: '1.0.0',
        enabled: true,
        maxRetries: 3,
        timeout: 60000,
        healthCheckInterval: 30000,
        dependencies: []
      }, container);

      await ocrAgent.start();

      // Start OCR processing and classification
      const ocrResult = await ocrAgent.execute({
        action: 'extractText',
        documentId: uploadResult.data.documentRecord.id
      }, {
        sessionId: `ocr-${Date.now()}`,
        userId: 'web-user',
        agentId: 'ocr-agent-upload',
        timestamp: new Date(),
        metadata: {}
      });

      let classificationResult = null;
      if (ocrResult.success && ocrResult.data?.extractedText) {
        // Classify document and route to correct table
        classificationResult = await classifyAndRoute(
          uploadResult.data.documentRecord.id,
          ocrResult.data.extractedText,
          container
        );
      }

      return NextResponse.json({
        success: true,
        message: 'File uploaded, processed and classified',
        document: uploadResult.data.documentRecord,
        ocr: ocrResult.success ? ocrResult.data : null,
        classification: classificationResult
      });
    } else {
      return NextResponse.json({
        error: 'Upload failed',
        details: uploadResult.error || 'Unknown upload error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}