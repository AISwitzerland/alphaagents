import { NextResponse } from 'next/server';
import { sendDocumentUploadNotification } from '@/services/emailService';

// Supabase webhook secret for verification
const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    // Verify webhook signature if configured
    const signature = request.headers.get('x-supabase-signature');
    if (WEBHOOK_SECRET && signature !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = await request.json();
    
    // Handle record changes from Supabase
    const { type, record, table } = payload;
    
    // Only process new document insertions
    if (table === 'documents' && type === 'INSERT') {
      await sendDocumentUploadNotification({
        documentId: record.id,
        fileName: record.file_name,
        documentType: record.document_type,
        uploadedAt: record.created_at,
        uploadedBy: record.metadata?.uploadedBy || {
          source: 'dashboard'
        }
      });

      return NextResponse.json({ success: true });
    }

    // Ignore other events
    return NextResponse.json({ success: true, message: 'Event ignored' });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 