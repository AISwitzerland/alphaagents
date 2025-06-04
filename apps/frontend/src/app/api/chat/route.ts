
import { NextRequest, NextResponse } from 'next/server';
import { ChatAgent } from '../../../../../../packages/agents/src/chat/ChatAgent';
import { globalServices } from '../../../lib/services';

// Session-based agent storage
const sessionAgents = new Map<string, ChatAgent>();

/**
 * Chat API Route
 * Handles chat interactions with the ChatAgent
 */
export async function POST(request: NextRequest) {
  try {
    console.log('💬 Chat request started...');

    // Get global service container
    const container = await globalServices.getContainer();
    
    const body = await request.json();
    const { message, chatId, userId } = body;
    
    // Process message to handle button context
    let processedMessage = message;
    let isButtonResponse = false;
    
    if (message.startsWith('[BERATUNGSART]')) {
      processedMessage = `Meine gewünschte Beratungsart ist: ${message.replace('[BERATUNGSART] ', '')}`;
      isButtonResponse = true;
    } else if (message.startsWith('[VERSICHERUNGSART]')) {
      processedMessage = `Meine gewünschte Versicherungsart ist: ${message.replace('[VERSICHERUNGSART] ', '')}`;
      isButtonResponse = true;
    }
    
    if (!message) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    // Get or create session-based Chat Agent
    const sessionId = chatId || `chat-${Date.now()}`;
    let chatAgent = sessionAgents.get(sessionId);
    
    if (!chatAgent) {
      chatAgent = new ChatAgent({
        id: `chat-agent-${sessionId}`,
        name: 'ChatAgent',
        version: '1.0.0',
        enabled: true,
        maxRetries: 3,
        timeout: 30000,
        healthCheckInterval: 30000,
        dependencies: []
      }, container);
      
      await chatAgent.start();
      sessionAgents.set(sessionId, chatAgent);
    }

    // Process chat message
    const chatResult = await chatAgent.execute({
      action: 'chat',
      message: processedMessage,
      sessionId: sessionId,
      userInfo: { id: userId || 'web-user' }
    }, {
      sessionId: sessionId,
      userId: userId || 'web-user',
      agentId: 'chat-agent-web',
      timestamp: new Date(),
      metadata: {
        isButtonResponse,
        originalMessage: message
      }
    });

    if (chatResult.success) {
      console.log('✅ Chat response generated');
      
      const response = chatResult.data?.response || 'No response';
      let buttons = undefined;
      let flowStatus = 'ongoing';
      
      // Check for flow completion indicators
      if (response.includes('Referenz-Nr.') && 
          (response.includes('erfolgreich registriert') || response.includes('Offerte ist bereit'))) {
        flowStatus = 'completed';
        console.log('✅ Flow completion detected: ', response.includes('Termin') ? 'appointment' : 'quote');
      } else if (response.includes('🎉') && response.includes('CHF')) {
        flowStatus = 'completed';
        console.log('✅ Quote completion detected with CHF amount');
      } else if (response.includes('E-Mail wurde an') && response.includes('gesendet')) {
        flowStatus = 'email_sent';
        console.log('✅ Email confirmation detected');
      }
      
      if (response.includes('Welche Art von Beratung wünschen Sie?') || 
          response.includes('Art von Beratung') ||
          response.includes('Beratungsart')) {
        buttons = [
          { text: '📄 OCR & Dokumentenverarbeitung', value: '[BERATUNGSART] OCR und Dokumentenverarbeitung' },
          { text: '🤖 Automatisierungslösungen', value: '[BERATUNGSART] Automatisierungslösungen' },
          { text: '📊 Workflow-Optimierung', value: '[BERATUNGSART] Workflow-Optimierung' },
          { text: '🎯 Chat-Assistenten', value: '[BERATUNGSART] Chat-Assistenten' },
          { text: '📋 Compliance & Datenschutz', value: '[BERATUNGSART] Compliance und Datenschutz' },
          { text: '🔧 Technische Integration', value: '[BERATUNGSART] Technische Integration' }
        ];
      }
      
      // Check if response contains insurance type question and add buttons
      if (response.includes('Welche Art von Versicherung interessiert Sie?') || 
          response.includes('Art von Versicherung') ||
          response.includes('Versicherungsart') ||
          response.includes('Versicherungstyp')) {
        buttons = [
          { text: '🏥 Krankenversicherung (KVG)', value: '[VERSICHERUNGSART] Krankenversicherung KVG' },
          { text: '🏢 Unfallversicherung (UVG)', value: '[VERSICHERUNGSART] Unfallversicherung UVG' },
          { text: '🏠 Hausratversicherung', value: '[VERSICHERUNGSART] Hausratversicherung' },
          { text: '🚗 Autoversicherung', value: '[VERSICHERUNGSART] Autoversicherung' },
          { text: '💼 Berufshaftpflicht', value: '[VERSICHERUNGSART] Berufshaftpflicht' },
          { text: '🏗️ Gebäudeversicherung', value: '[VERSICHERUNGSART] Gebäudeversicherung' },
          { text: '📋 Andere Versicherung', value: '[VERSICHERUNGSART] Andere Versicherung' }
        ];
      }
      
      return NextResponse.json({
        success: true,
        response: response,
        chatId: sessionId,
        buttons: buttons,
        flowStatus: flowStatus,
        metadata: {
          completion: flowStatus === 'completed',
          hasReferenceNumber: response.includes('Referenz-Nr.'),
          emailSent: response.includes('E-Mail wurde an') && response.includes('gesendet')
        }
      });
    } else {
      return NextResponse.json({
        error: 'Chat processing failed',
        details: chatResult.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Chat error:', error);
    return NextResponse.json({
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}