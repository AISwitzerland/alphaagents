/**
 * Debug Quote Generation Error
 * Test the specific quote creation flow to identify the root cause
 */

console.log('🔍 Debugging Quote Generation Issue...\n');

async function debugQuoteGeneration() {
  try {
    console.log('📋 TESTING QUOTE GENERATION FLOW');
    console.log('=================================\n');

    const baseUrl = 'http://localhost:3000';
    
    // Simulate the quote generation request
    const testQuoteData = {
      customer_name: "Test Kunde",
      customer_email: "test@example.com",
      customer_phone: "+41 79 123 45 67",
      insurance_type: "krankenversicherung",
      coverage_details: { coverage: "additional", deductible: 300 },
      estimated_premium: 3600,
      premium_currency: "CHF",
      deductible: 300,
      additional_info: { coverage: "additional", deductible: 300 },
      status: "calculated",
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      agent_id: "chat-agent-001",
      session_id: "test-session-123"
    };

    console.log('📤 Testing Direct Supabase Quote Creation...');
    console.log('Quote Data Structure:');
    console.log(JSON.stringify(testQuoteData, null, 2));
    console.log('\n');

    // Test the full chat flow that leads to quote generation
    console.log('🤖 Testing Full Chat Flow...');
    
    const chatMessages = [
      "Ich möchte eine Offerte für eine Krankenversicherung",
      "Test Kunde",
      "test@example.com", 
      "+41 79 123 45 67",
      "Ich bin 35 und möchte Zusatzversicherung",
      "ja, erstellen Sie die Offerte"
    ];

    for (let i = 0; i < chatMessages.length; i++) {
      console.log(`\n📨 Message ${i + 1}: "${chatMessages[i]}"`);
      
      try {
        const response = await fetch(`${baseUrl}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: chatMessages[i],
            sessionId: 'debug-quote-session'
          })
        });

        if (!response.ok) {
          console.log(`❌ HTTP Error: ${response.status}`);
          const errorText = await response.text();
          console.log(`Error Response: ${errorText}`);
          break;
        }

        const result = await response.json();
        console.log(`✅ Response: "${result.reply}"`);
        
        // Check if this is the quote generation step
        if (result.reply.includes('Problem bei der Offertenerstellung')) {
          console.log('\n🚨 FOUND THE ERROR!');
          console.log('The quote generation failed at this step.');
          console.log('Response details:', result);
          break;
        }
        
        if (result.reply.includes('Offerte wurde erfolgreich berechnet')) {
          console.log('\n✅ Quote generation succeeded!');
          break;
        }

        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.log(`❌ Request Error: ${error.message}`);
        break;
      }
    }

  } catch (error) {
    console.error('❌ Debug test failed:', error);
  }
}

// Run the debug test
debugQuoteGeneration();