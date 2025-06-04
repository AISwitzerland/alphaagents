import { NextRequest, NextResponse } from 'next/server';
import { globalServices } from '../../../../lib/services';
import { SupabaseService } from '../../../../../../packages/services/src/database/SupabaseService';
import { ServiceTokens } from '../../../../../../packages/core/src/container/DIContainer';

/**
 * Dashboard Documents API Route
 * Retrieves all documents with processing details from Supabase
 */
export async function GET(request: NextRequest) {
  try {
    console.log('📊 Dashboard: Fetching documents from Supabase...');

    // Get global service container
    const container = await globalServices.getContainer();
    const supabaseService = await container.resolve<SupabaseService>(ServiceTokens.SUPABASE_SERVICE);

    // Fetch documents with related data
    const { data: documents, error } = await supabaseService.client
      .from('documents')
      .select(`
        id,
        file_name,
        file_type,
        document_type,
        status,
        created_at,
        updated_at,
        ocr_content,
        confidence_score,
        metadata
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('❌ Error fetching documents:', error);
      throw error;
    }

    // Calculate processing time and enhance data
    const enhancedDocuments = documents?.map(doc => {
      const createdAt = new Date(doc.created_at);
      const updatedAt = new Date(doc.updated_at);
      const processingTime = (updatedAt.getTime() - createdAt.getTime()) / 1000; // in seconds

      // Extract summary from metadata or ocr_content
      let summary = 'Keine Zusammenfassung verfügbar';
      try {
        if (doc.metadata?.summary) {
          summary = doc.metadata.summary;
        } else if (doc.ocr_content && doc.ocr_content.length > 0) {
          // Create summary from first 100 chars of OCR content
          summary = doc.ocr_content.substring(0, 100) + (doc.ocr_content.length > 100 ? '...' : '');
        }
      } catch (e) {
        console.warn('Error extracting summary for document:', doc.id);
      }

      return {
        id: doc.id,
        file_name: doc.file_name,
        file_type: doc.file_type,
        document_type: doc.document_type,
        status: doc.status,
        created_at: doc.created_at,
        processed_at: doc.updated_at,
        confidence_score: doc.confidence_score,
        processing_time: Math.max(0.1, Math.min(30, processingTime)), // Clamp between 0.1s and 30s
        summary: summary
      };
    }) || [];

    console.log(`✅ Dashboard: Retrieved ${enhancedDocuments.length} documents`);

    return NextResponse.json({
      success: true,
      data: enhancedDocuments,
      count: enhancedDocuments.length
    });

  } catch (error) {
    console.error('❌ Dashboard documents error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch documents',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}