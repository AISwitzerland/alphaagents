import { NextRequest, NextResponse } from 'next/server';
import { globalServices } from '../../../../lib/services';
import { SupabaseService } from '../../../../../../packages/services/src/database/SupabaseService';
import { ServiceTokens } from '../../../../../../packages/core/src/container/DIContainer';

/**
 * Dashboard Damage Reports API Route
 */
export async function GET(request: NextRequest) {
  try {
    const container = await globalServices.getContainer();
    const supabaseService = await container.resolve<SupabaseService>(ServiceTokens.SUPABASE_SERVICE);

    const { data: reports, error } = await supabaseService.client
      .from('damage_reports')
      .select(`
        id,
        document_id,
        name,
        schaden_datum,
        schaden_ort,
        schaden_beschreibung,
        status,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: reports || [],
      count: reports?.length || 0
    });

  } catch (error) {
    console.error('❌ Dashboard damage reports error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch damage reports'
    }, { status: 500 });
  }
}