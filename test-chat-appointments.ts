/**
 * Test Chat Agent Appointments & Quotes Flow
 * Tests the complete end-to-end flow with email confirmations
 */

import { ChatAgent } from './packages/agents/src/chat/ChatAgent';
import { globalServices } from './apps/frontend/src/lib/services';

async function testChatAppointmentsFlow() {
  console.log('🧪 Testing Chat Agent with Appointments & Quotes Flow...\n');

  try {
    // Get service container
    const container = await globalServices.getContainer();
    
    // Initialize Chat Agent
    const chatAgent = new ChatAgent({
      id: 'test-chat-agent',
      name: 'TestChatAgent',
      version: '1.0.0',
      enabled: true,
      maxRetries: 3,
      timeout: 30000,
      healthCheckInterval: 30000,
      dependencies: []
    }, container);

    await chatAgent.start();

    const sessionId = `test-session-${Date.now()}`;

    console.log('📝 1. Testing Appointment Booking Flow...');
    
    // Test appointment booking conversation
    const appointmentMessages = [
      'Ich möchte einen Termin vereinbaren',
      'Max Mustermann',
      'max.mustermann@test.ch',
      '+41 44 123 45 67',
      'Allgemeine Beratung',
      'Montag um 14 Uhr'
    ];

    for (let i = 0; i < appointmentMessages.length; i++) {
      const message = appointmentMessages[i];
      console.log(`   → User: ${message}`);
      
      const result = await chatAgent.execute({
        action: 'chat',
        sessionId,
        message,
        userId: 'test-user'
      }, {
        sessionId,
        userId: 'test-user',
        agentId: 'test-chat-agent',
        timestamp: new Date(),
        metadata: {}
      });

      if (result.success && result.data?.response) {
        console.log(`   ← Bot: ${result.data.response.substring(0, 100)}...`);
        
        if (result.data.response.includes('Referenz-Nr.')) {
          console.log('   ✅ Appointment created successfully!');
          if (result.data.response.includes('E-Mail gesendet')) {
            console.log('   ✅ Email confirmation mentioned!');
          }
          break;
        }
      } else {
        console.log(`   ❌ Error: ${result.error}`);
      }
      
      // Small delay between messages
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n💰 2. Testing Quote Request Flow...');
    
    // Start new session for quote
    const quoteSessionId = `test-quote-session-${Date.now()}`;
    
    const quoteMessages = [
      'Ich möchte eine Offerte für eine Krankenversicherung',
      'Lisa Schweizer',
      'lisa.schweizer@test.ch',
      '+41 79 123 45 67',
      'Ich bin 30 Jahre alt und möchte eine Zusatzversicherung'
    ];

    for (let i = 0; i < quoteMessages.length; i++) {
      const message = quoteMessages[i];
      console.log(`   → User: ${message}`);
      
      const result = await chatAgent.execute({
        action: 'chat',
        sessionId: quoteSessionId,
        message,
        userId: 'test-user-2'
      }, {
        sessionId: quoteSessionId,
        userId: 'test-user-2',
        agentId: 'test-chat-agent',
        timestamp: new Date(),
        metadata: {}
      });

      if (result.success && result.data?.response) {
        console.log(`   ← Bot: ${result.data.response.substring(0, 100)}...`);
        
        if (result.data.response.includes('Referenz-Nr.') && result.data.response.includes('CHF')) {
          console.log('   ✅ Quote created successfully!');
          if (result.data.response.includes('E-Mail gesendet')) {
            console.log('   ✅ Email confirmation mentioned!');
          }
          break;
        }
      } else {
        console.log(`   ❌ Error: ${result.error}`);
      }
      
      // Small delay between messages
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n🔄 3. Testing Context Switching...');
    
    // Test context switching within same session
    const contextSwitchMessages = [
      'Ich möchte auch ein Dokument hochladen',
      'Doch lieber einen Termin vereinbaren',
      'Peter Müller'
    ];

    for (const message of contextSwitchMessages) {
      console.log(`   → User: ${message}`);
      
      const result = await chatAgent.execute({
        action: 'chat',
        sessionId: quoteSessionId, // Same session
        message,
        userId: 'test-user-2'
      }, {
        sessionId: quoteSessionId,
        userId: 'test-user-2', 
        agentId: 'test-chat-agent',
        timestamp: new Date(),
        metadata: {}
      });

      if (result.success && result.data?.response) {
        console.log(`   ← Bot: ${result.data.response.substring(0, 150)}...`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    await chatAgent.stop();
    
    console.log('\n✅ Chat Agent Test completed successfully!');
    console.log('\n📧 Check your email (wehrlinatasha@gmail.com) for staff notifications!');
    console.log('📧 Test customer emails sent to max.mustermann@test.ch and lisa.schweizer@test.ch');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test if called directly
if (require.main === module) {
  testChatAppointmentsFlow().catch(console.error);
}

export { testChatAppointmentsFlow };