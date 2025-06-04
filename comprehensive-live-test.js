/**
 * COMPREHENSIVE LIVE CHAT AGENT TEST (JavaScript)
 * Full end-to-end testing with real email natashawehrli95@gmail.com
 */

const { ChatAgent } = require('./packages/agents/src/chat/ChatAgent');
const { globalServices } = require('./apps/frontend/src/lib/services');

class ComprehensiveLiveTest {
  constructor() {
    this.chatAgent = null;
    this.testResults = [];
  }

  async initialize() {
    console.log('🚀 COMPREHENSIVE LIVE CHAT AGENT TEST');
    console.log('=====================================');
    console.log('Testing with email: natashawehrli95@gmail.com');
    console.log('Staff notifications to: wehrlinatasha@gmail.com\n');

    try {
      const container = await globalServices.getContainer();
      
      this.chatAgent = new ChatAgent({
        id: 'live-test-chat-agent',
        name: 'LiveTestChatAgent',
        version: '1.0.0',
        enabled: true,
        maxRetries: 3,
        timeout: 30000,
        healthCheckInterval: 30000,
        dependencies: []
      }, container);

      await this.chatAgent.start();
      console.log('✅ Chat Agent initialized successfully\n');
    } catch (error) {
      console.error('❌ Initialization failed:', error);
      throw error;
    }
  }

  async sendMessage(sessionId, message, userId = 'live-test-user') {
    try {
      const result = await this.chatAgent.execute({
        action: 'chat',
        sessionId,
        message,
        userId
      }, {
        sessionId,
        userId,
        agentId: 'live-test-chat-agent',
        timestamp: new Date(),
        metadata: {}
      });

      return result;
    } catch (error) {
      console.error(`❌ Message failed: ${message}`, error);
      return { success: false, error: error.message };
    }
  }

  async runScenario(scenarioName, messages, testEmail) {
    console.log(`\n🧪 TESTING: ${scenarioName}`);
    console.log('=' .repeat(50));

    const sessionId = `live-test-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    let finalResponse = '';
    let emailMentioned = false;
    let referenceNumber = '';
    let success = false;
    let details = '';

    try {
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i].replace('natashawehrli95@gmail.com', testEmail);
        console.log(`\n${i + 1}. 👤 User: "${message}"`);

        const result = await this.sendMessage(sessionId, message);
        
        if (result.success && result.data && result.data.response) {
          const response = result.data.response;
          console.log(`   🤖 Bot: "${response.substring(0, 200)}${response.length > 200 ? '...' : ''}"`);
          
          finalResponse = response;
          details += `Step ${i + 1}: ${message} → ${response.substring(0, 100)}...\n`;

          // Check for email mentions
          if (response.toLowerCase().includes('e-mail') || response.toLowerCase().includes('email')) {
            emailMentioned = true;
            console.log('   📧 EMAIL CONFIRMATION MENTIONED!');
          }

          // Extract reference number
          const refMatch = response.match(/(?:Referenz|Ref)[^\w]*([A-Z0-9]{6,8})/i);
          if (refMatch) {
            referenceNumber = refMatch[1];
            console.log(`   🆔 REFERENCE NUMBER: ${referenceNumber}`);
          }

          // Check for completion
          if (response.includes('Referenz') || response.includes('erfolgreich registriert') || 
              response.includes('Offerte ist bereit') || response.includes('CHF')) {
            console.log('   🎉 COMPLETION DETECTED!');
            success = true;
            break;
          }

          // Check for errors or failures
          if (response.includes('Fehler') || response.includes('Problem') || 
              response.includes('nicht möglich')) {
            console.log('   ⚠️  POTENTIAL ISSUE DETECTED');
          }

        } else {
          console.log(`   ❌ Bot Error: ${result.error || 'No response'}`);
          details += `Step ${i + 1}: ERROR - ${result.error || 'No response'}\n`;
          break;
        }

        // Small delay between messages
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.log(`   ❌ Scenario failed: ${error}`);
      details += `FATAL ERROR: ${error}\n`;
    }

    const testResult = {
      scenarioName,
      success,
      details,
      emailMentioned,
      referenceNumber,
      finalResponse
    };

    this.testResults.push(testResult);

    console.log(`\n📊 Result: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
    if (emailMentioned) console.log('📧 Email confirmation mentioned');
    if (referenceNumber) console.log(`🆔 Reference: ${referenceNumber}`);

    return testResult;
  }

  async runAllTests() {
    console.log('🎯 STARTING COMPREHENSIVE LIVE TESTS\n');

    // === TEST 1: PERFECT QUOTE FLOW ===
    await this.runScenario(
      "Perfect Quote Flow - Krankenversicherung",
      [
        "Ich möchte eine Offerte für eine Krankenversicherung",
        "Maria Vollständig",
        "natashawehrli95@gmail.com",
        "+41 79 123 45 67",
        "Ich bin 28 Jahre alt und möchte Grund + Zusatzversicherung"
      ],
      "natashawehrli95@gmail.com"
    );

    // === TEST 2: GRADUAL QUOTE FLOW ===
    await this.runScenario(
      "Gradual Quote Flow - Haftpflichtversicherung", 
      [
        "Haftpflichtversicherung Offerte bitte",
        "Peter Schrittweise",
        "natashawehrli95@gmail.com",
        "044 555 66 77",
        "35 Jahre",
        "Comfort Deckung"
      ],
      "natashawehrli95@gmail.com"
    );

    // === TEST 3: APPOINTMENT FLOW ===
    await this.runScenario(
      "Perfect Appointment Flow",
      [
        "Ich möchte einen Termin vereinbaren",
        "Thomas Terminbuch",
        "natashawehrli95@gmail.com",
        "+41 44 987 65 43",
        "Allgemeine Beratung",
        "Montag um 14 Uhr"
      ],
      "natashawehrli95@gmail.com"
    );

    // === TEST 4: DATA VALIDATION ===
    await this.runScenario(
      "Data Validation Test",
      [
        "Offerte für Sachversicherung",
        "Anna Validation",
        "ungueltige-email",
        "natashawehrli95@gmail.com",
        "123",
        "+41 79 999 88 77",
        "30 Jahre, Premium Paket"
      ],
      "natashawehrli95@gmail.com"
    );

    // === TEST 5: CONTEXT SWITCHING ===
    await this.runScenario(
      "Context Switch - Quote to Appointment",
      [
        "Lebensversicherung Offerte",
        "Max Wechsel",
        "natashawehrli95@gmail.com",
        "Eigentlich möchte ich lieber einen Termin",
        "Max Wechsel",
        "+41 78 111 22 33",
        "Schadensbesprechung",
        "Freitag Nachmittag"
      ],
      "natashawehrli95@gmail.com"
    );

    // === TEST 6: VAGUE RESPONSES ===
    await this.runScenario(
      "Vague User Responses",
      [
        "Hallo",
        "Ich brauche etwas",
        "Versicherung",
        "Krankenversicherung",
        "Lisa",
        "Lisa Ungenau",
        "natashawehrli95@gmail.com",
        "079",
        "079 444 55 66",
        "So um die 25",
        "Etwas Gutes bitte"
      ],
      "natashawehrli95@gmail.com"
    );

    await this.generateTestReport();
  }

  async generateTestReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE LIVE TEST RESULTS');
    console.log('='.repeat(80));

    const totalTests = this.testResults.length;
    const successfulTests = this.testResults.filter(r => r.success).length;
    const emailMentions = this.testResults.filter(r => r.emailMentioned).length;
    const referencesGenerated = this.testResults.filter(r => r.referenceNumber).length;

    console.log(`\n📈 OVERALL STATISTICS:`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Successful: ${successfulTests}/${totalTests} (${((successfulTests/totalTests)*100).toFixed(1)}%)`);
    console.log(`   Email Mentions: ${emailMentions}/${totalTests} (${((emailMentions/totalTests)*100).toFixed(1)}%)`);
    console.log(`   References Generated: ${referencesGenerated}/${totalTests} (${((referencesGenerated/totalTests)*100).toFixed(1)}%)`);

    console.log(`\n📋 DETAILED RESULTS:`);
    this.testResults.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      const email = result.emailMentioned ? '📧' : '  ';
      const ref = result.referenceNumber ? `🆔${result.referenceNumber}` : '';
      console.log(`   ${index + 1}. ${status} ${email} ${result.scenarioName} ${ref}`);
    });

    if (successfulTests < totalTests) {
      console.log(`\n🔍 FAILED SCENARIOS:`);
      this.testResults
        .filter(r => !r.success)
        .forEach(result => {
          console.log(`\n❌ ${result.scenarioName}:`);
          console.log(`   Details: ${result.details.split('\n')[0]}`);
        });
    }

    console.log(`\n📧 EMAIL TESTING:`);
    console.log(`   Customer emails sent to: natashawehrli95@gmail.com`);
    console.log(`   Staff notifications sent to: wehrlinatasha@gmail.com`);
    console.log(`   Expected emails: ${successfulTests * 2} (${successfulTests} customer + ${successfulTests} staff)`);

    const successRate = (successfulTests / totalTests) * 100;
    if (successRate >= 90) {
      console.log(`\n🎉 EXCELLENT! Chat Agent performs exceptionally well (${successRate.toFixed(1)}%)`);
    } else if (successRate >= 75) {
      console.log(`\n✅ GOOD! Chat Agent performs well (${successRate.toFixed(1)}%)`);
    } else {
      console.log(`\n⚠️  NEEDS IMPROVEMENT! Several issues detected (${successRate.toFixed(1)}%)`);
    }

    console.log(`\n🎯 NEXT STEPS:`);
    console.log(`   1. Check natashawehrli95@gmail.com for customer confirmations`);
    console.log(`   2. Check wehrlinatasha@gmail.com for staff notifications`);
    console.log(`   3. Verify Supabase data in appointments and quotes tables`);
    console.log(`   4. Test manually in browser: http://localhost:3000`);

    console.log('\n' + '='.repeat(80));
  }

  async cleanup() {
    if (this.chatAgent) {
      await this.chatAgent.stop();
    }
  }
}

async function runComprehensiveLiveTest() {
  const tester = new ComprehensiveLiveTest();
  
  try {
    await tester.initialize();
    await tester.runAllTests();
  } catch (error) {
    console.error('❌ Comprehensive test failed:', error);
  } finally {
    await tester.cleanup();
  }
}

// Auto-run
if (require.main === module) {
  runComprehensiveLiveTest().catch(console.error);
}

module.exports = { runComprehensiveLiveTest };