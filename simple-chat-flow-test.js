/**
 * SIMPLE CHAT FLOW TEST
 * Tests ChatAgent flexibility and conversation flows
 * Simulates real human interactions
 */

// Simple mock test that simulates API calls to /api/chat
class ChatFlowTester {
  constructor() {
    this.conversations = [];
    this.testResults = [];
  }

  async simulateChatMessage(message, sessionId = 'test-session') {
    try {
      // Simulate the API call to /api/chat
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          chatId: sessionId,
          userId: 'test-user',
          context: {
            isDashboard: false,
            language: 'de-CH',
            knowledgeBase: 'swiss_insurance'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        response: data.response,
        buttons: data.buttons,
        chatId: data.chatId
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async testConversationFlow(name, messages, description) {
    console.log(`\n🧪 TEST: ${name}`);
    console.log(`📝 ${description}\n`);
    
    const sessionId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const conversation = [];
    let success = true;
    let errorDetails = '';

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      console.log(`   ${i + 1}. 👤 User: "${message}"`);
      
      // Small delay to simulate human typing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = await this.simulateChatMessage(message, sessionId);
      
      if (result.success) {
        const response = result.response;
        const shortResponse = response.length > 100 ? 
          response.substring(0, 100) + '...' : response;
        
        console.log(`      🤖 Bot: "${shortResponse}"`);
        
        // Check for buttons
        if (result.buttons && result.buttons.length > 0) {
          console.log(`      🔘 Buttons: ${result.buttons.map(b => b.text).join(', ')}`);
        }
        
        conversation.push({
          user: message,
          bot: response,
          buttons: result.buttons || []
        });

        // Check for completion indicators
        if (response.includes('Referenz-Nr.') || 
            response.includes('erfolgreich') || 
            response.includes('bestätigt') ||
            response.includes('E-Mail gesendet') ||
            response.includes('Offerte erstellt')) {
          console.log(`      ✅ PROCESS COMPLETION DETECTED!`);
        }

      } else {
        console.log(`      ❌ Error: ${result.error}`);
        success = false;
        errorDetails = result.error;
        break;
      }
    }

    this.conversations.push({
      name,
      description,
      conversation,
      success,
      errorDetails
    });

    this.testResults.push({
      name,
      success,
      messages: messages.length,
      errorDetails
    });

    console.log(`   📊 Result: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
    if (!success) {
      console.log(`   📋 Error: ${errorDetails}`);
    }
  }

  async runFlexibilityTests() {
    console.log('🚀 CHAT AGENT FLEXIBILITY & FLOW TESTS');
    console.log('Testing real human-like conversation patterns...\n');

    // Test 1: Perfect Offerte Flow
    await this.testConversationFlow(
      'Perfect Offerte Flow',
      [
        'ich will eine offerte',
        'Krankenversicherung',
        'Max Mustermann', 
        'max@test.ch',
        '0761234567',
        '30 Jahre alt, möchte Zusatzversicherung'
      ],
      'User follows perfect flow with clear responses'
    );

    // Test 2: Confused User with Topic Switching
    await this.testConversationFlow(
      'Confused User - Topic Switching',
      [
        'Hallo',
        'was kostet eine versicherung?',
        'ich will einen termin',
        'nein doch eine offerte',
        'Hausratversicherung',
        'Anna Beispiel',
        'anna@email.ch',
        '+41 79 123 45 67',
        '25 Jahre, kleine Wohnung'
      ],
      'User is confused and switches between topics'
    );

    // Test 3: FAQ Questions
    await this.testConversationFlow(
      'FAQ Questions', 
      [
        'Welche Versicherungen bietet ihr an?',
        'Was kostet eine Krankenversicherung?',
        'Wie kann ich meine Police kündigen?',
        'Welche Dokumente brauche ich?'
      ],
      'User asks various FAQ questions'
    );

    // Test 4: Context Switching Mid-Flow
    await this.testConversationFlow(
      'Context Switch During Data Collection',
      [
        'Offerte für Unfallversicherung',
        'Peter Schmidt',
        'peter@test.ch', 
        'Moment, was ist eigentlich eine Franchise?',
        'Ah ok, weiter mit der Offerte',
        '+41 44 123 45 67',
        '35 Jahre, Bürojob'
      ],
      'User asks FAQ question during offerte flow'
    );

    // Test 5: Vague and Unclear Responses
    await this.testConversationFlow(
      'Vague User Responses',
      [
        'ich brauche was',
        'versicherung halt',
        'krankenversicherung',
        'max',
        'Max Kurz',
        'max@test.ch',
        '044',
        '044 123 45 67',
        'so 30',
        'etwas gutes'
      ],
      'User gives minimal and unclear responses'
    );

    // Test 6: Detailed User (Opposite of vague)
    await this.testConversationFlow(
      'Very Detailed User',
      [
        'Guten Tag! Ich interessiere mich für eine umfassende Krankenversicherungsofferte, da meine aktuelle Police zu teuer geworden ist',
        'Mein vollständiger Name ist Dr. Angela Ausführlich-Detailliert',
        'Meine geschäftliche E-Mail-Adresse lautet angela.detailliert@spital.ch',
        'Sie erreichen mich unter der Nummer +41 44 255 11 11',
        'Ich bin 42 Jahre alt, arbeite als Chirurgin und benötige eine Krankenversicherung mit umfassenden Zusatzleistungen wie Einzelzimmer und alternative Medizin'
      ],
      'User provides very detailed, long responses'
    );

    // Test 7: Appointment Booking
    await this.testConversationFlow(
      'Appointment Booking Flow',
      [
        'ich will einen termin machen',
        'Thomas Termin',
        'thomas@email.ch',
        '079 555 66 77',
        'Allgemeine Beratung',
        'Montag um 14 Uhr'
      ],
      'User books an appointment'
    );

    // Test 8: Document Upload Questions
    await this.testConversationFlow(
      'Document Upload Questions',
      [
        'Wie kann ich Dokumente hochladen?',
        'Welche Dateiformate unterstützen Sie?',
        'Kann ich PDF-Dateien senden?',
        'Wie exportiere ich meine Dokumente?'
      ],
      'User asks about document handling'
    );

    // Test 9: Mixed Language (Common in Switzerland)
    await this.testConversationFlow(
      'Mixed Language Input',
      [
        'I need a quote',
        'Entschuldigung, eine Offerte bitte',
        'Health insurance',
        'Krankenversicherung',
        'John Mixed',
        'john@test.com',
        '+41 79 100 200 300',
        'I am 28 years old'
      ],
      'User mixes English and German (common in Switzerland)'
    );

    // Test 10: Invalid Data Recovery
    await this.testConversationFlow(
      'Invalid Data Recovery',
      [
        'Offerte für Haftpflichtversicherung',
        'Lisa Test',
        'ungültige-email',
        'lisa@email.ch',
        'falsche-nummer',
        '+41 79 777 88 99',
        '30 Jahre'
      ],
      'User provides invalid data, system should retry'
    );
  }

  printResults() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 CHAT FLOW TEST RESULTS');
    console.log('='.repeat(80));

    const total = this.testResults.length;
    const successful = this.testResults.filter(r => r.success).length;
    const failed = total - successful;
    const successRate = ((successful / total) * 100).toFixed(1);

    console.log(`\n📈 STATISTICS:`);
    console.log(`   Total Tests: ${total}`);
    console.log(`   Successful: ${successful} ✅`);
    console.log(`   Failed: ${failed} ❌`);
    console.log(`   Success Rate: ${successRate}%`);

    if (successRate >= 90) {
      console.log(`\n🎉 EXCELLENT! ChatAgent handles complex conversations very well.`);
    } else if (successRate >= 75) {
      console.log(`\n✅ GOOD! ChatAgent handles most scenarios well.`);
    } else if (successRate >= 50) {
      console.log(`\n⚠️ MODERATE! Some improvements needed.`);
    } else {
      console.log(`\n❌ POOR! Significant improvements required.`);
    }

    console.log(`\n📋 DETAILED RESULTS:`);
    this.testResults.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(`   ${index + 1}. ${status} ${result.name} (${result.messages} messages)`);
      if (!result.success) {
        console.log(`      Error: ${result.errorDetails}`);
      }
    });

    // Show failed conversations
    const failedConversations = this.conversations.filter(c => !c.success);
    if (failedConversations.length > 0) {
      console.log(`\n❌ FAILED CONVERSATIONS ANALYSIS:`);
      failedConversations.forEach(conv => {
        console.log(`\n--- ${conv.name} ---`);
        console.log(`Description: ${conv.description}`);
        console.log(`Error: ${conv.errorDetails}`);
        if (conv.conversation.length > 0) {
          console.log(`Last successful exchange:`);
          const last = conv.conversation[conv.conversation.length - 1];
          console.log(`  User: ${last.user}`);
          console.log(`  Bot: ${last.bot.substring(0, 100)}...`);
        }
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('Testing completed! Check for any issues above.');
    console.log('='.repeat(80));
  }
}

// Run the tests
async function runTests() {
  const tester = new ChatFlowTester();
  
  try {
    await tester.runFlexibilityTests();
    tester.printResults();
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Main execution
(async function() {
  console.log('🔍 Checking if development server is running...');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ Development server is not running on http://localhost:3000');
    console.log('   Please start the server with: npm run dev');
    console.log('   Then run this test again.');
    process.exit(1);
  }
  
  console.log('✅ Server is running, starting tests...\n');
  await runTests();
})();