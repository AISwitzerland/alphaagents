import { NextRequest, NextResponse } from 'next/server';
import { globalServices } from '../../../../lib/services';
import { SupabaseService } from '../../../../../../packages/services/src/database/SupabaseService';
import { ServiceTokens } from '../../../../../../packages/core/src/container/DIContainer';

/**
 * Dashboard Accident Reports API Route
 */
export async function GET(request: NextRequest) {
  try {
    const container = await globalServices.getContainer();
    const supabaseService = await container.resolve<SupabaseService>(ServiceTokens.SUPABASE_SERVICE);

    const { data: reports, error } = await supabaseService.client
      .from('accident_reports')
      .select(`
        id,
        document_id,
        name,
        unfall_datum,
        unfall_zeit,
        unfall_ort,
        unfall_beschreibung,
        verletzung_art,
        verletzung_koerperteil,
        status,
        created_at,
        documents!inner(file_name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: reports || [],
      count: reports?.length || 0
    });

  } catch (error) {
    console.error('❌ Dashboard accident reports error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch accident reports'
    }, { status: 500 });
  }
}