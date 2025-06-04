import { NextResponse } from 'next/server';
import { globalServices } from '../../../lib/services';

/**
 * System Status API Route  
 * Returns health status of all services
 */
export async function GET() {
  try {
    console.log('📊 Status check started...');

    // Get global service container
    const container = await globalServices.getContainer();
    
    // Get service statuses
    const services = {
      supabase: false,
      openai: false,
      config: false
    };

    try {
      // Test services individually
      const supabaseService = await container.resolve('supabase-service') as any;
      services.supabase = await supabaseService.testConnection();
    } catch (error) {
      console.log('Supabase service not available');
    }

    try {
      const openaiService = await container.resolve('openai-service') as any;
      services.openai = await openaiService.testConnection();
    } catch (error) {
      console.log('OpenAI service not available');
    }

    try {
      const configService = await container.resolve('config-service') as any;
      services.config = true; // Config service exists
    } catch (error) {
      console.log('Config service not available');
    }

    const overallHealth = Object.values(services).every(status => status);

    return NextResponse.json({
      status: overallHealth ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services,
      version: '1.0.0'
    });

  } catch (error) {
    console.error('❌ Status check error:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}