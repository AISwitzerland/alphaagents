import { NextRequest, NextResponse } from 'next/server';
import { globalServices } from '../../../../lib/services';
import { SupabaseService } from '../../../../../../packages/services/src/database/SupabaseService';
import { ServiceTokens } from '../../../../../../packages/core/src/container/DIContainer';

/**
 * Dashboard Contract Changes API Route
 */
export async function GET(request: NextRequest) {
  try {
    const container = await globalServices.getContainer();
    const supabaseService = await container.resolve<SupabaseService>(ServiceTokens.SUPABASE_SERVICE);

    const { data: changes, error } = await supabaseService.client
      .from('contract_changes')
      .select(`
        id,
        document_id,
        name,
        aenderung_typ,
        aenderung_beschreibung,
        status,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: changes || [],
      count: changes?.length || 0
    });

  } catch (error) {
    console.error('❌ Dashboard contract changes error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch contract changes'
    }, { status: 500 });
  }
}