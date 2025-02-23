import { NextResponse } from 'next/server';
import { testOpenAIKey } from '@/services/documentProcessingService';

export async function GET() {
  try {
    const result = await testOpenAIKey();
    
    if (result.isValid) {
      return NextResponse.json({ 
        success: true, 
        message: 'OpenAI API Key ist gültig' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'OpenAI API Key ist ungültig',
        error: result.error 
      }, { 
        status: 400 
      });
    }
  } catch (error: any) {
    console.error('Test-Route Fehler:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Fehler beim Testen des API Keys',
      error: error.message 
    }, { 
      status: 500 
    });
  }
} 