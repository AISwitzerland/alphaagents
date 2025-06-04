/**
 * LIVE CHAT API TEST
 * Tests the chat API endpoint directly with comprehensive scenarios
 */

const fetch = require('node-fetch');

class LiveChatAPITest {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.testResults = [];
  }

  async sendChatMessage(message, chatId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          chatId: chatId,
          userId: 'test-user-api'
        })
      });

      const data = await response.json();
      return { success: response.ok, data, status: response.status };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async runScenario(scenarioName, messages, testEmail) {
    console.log(`\n🧪 TESTING: ${scenarioName}`);
    console.log('=' .repeat(50));

    const chatId = `api-test-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    let finalResponse = '';
    let emailMentioned = false;
    let referenceNumber = '';
    let success = false;
    let details = '';

    try {
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i].replace('natashawehrli95@gmail.com', testEmail);
        console.log(`\n${i + 1}. 👤 User: "${message}"`);

        const result = await this.sendChatMessage(message, chatId);
        
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

          // Check for errors
          if (response.includes('Fehler') || response.includes('Problem')) {
            console.log('   ⚠️  ISSUE DETECTED');
          }

        } else {
          console.log(`   ❌ API Error: ${result.error || 'No response'} (Status: ${result.status})`);
          details += `Step ${i + 1}: ERROR - ${result.error || 'No response'}\n`;
          
          // If it's the first message and server isn't running, break immediately
          if (i === 0 && (result.error && result.error.includes('ECONNREFUSED'))) {
            console.log('   🚨 SERVER NOT RUNNING! Please start: npm run dev');
            break;
          }
        }

        // Small delay between messages
        await new Promise(resolve => setTimeout(resolve, 1000));
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

  async checkServerStatus() {
    console.log('🔍 Checking if frontend server is running...');
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      if (response.ok) {
        console.log('✅ Frontend server is running\n');
        return true;
      } else {
        console.log('❌ Frontend server responded with error\n');
        return false;
      }
    } catch (error) {
      console.log('❌ Frontend server is not running!');
      console.log('   Please start with: cd apps/frontend && npm run dev\n');
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 LIVE CHAT API TEST');
    console.log('=====================');
    console.log('Testing with email: natashawehrli95@gmail.com');
    console.log('Staff notifications to: wehrlinatasha@gmail.com\n');

    // Check if server is running
    const serverRunning = await this.checkServerStatus();
    if (!serverRunning) {
      console.log('🛑 Cannot run tests without frontend server. Exiting...');
      return;
    }

    console.log('🎯 STARTING COMPREHENSIVE API TESTS\n');

    // === TEST 1: SIMPLE QUOTE FLOW ===
    await this.runScenario(
      "Simple Quote Flow - Krankenversicherung",
      [
        "Ich möchte eine Offerte für eine Krankenversicherung",
        "Maria Test",
        "natashawehrli95@gmail.com",
        "+41 79 123 45 67",
        "Ich bin 30 Jahre alt und möchte Zusatzversicherung",
        "Ja, Offerte berechnen"
      ],
      "natashawehrli95@gmail.com"
    );

    // === TEST 2: APPOINTMENT FLOW ===
    await this.runScenario(
      "Simple Appointment Flow",
      [
        "Ich möchte einen Termin vereinbaren",
        "Thomas Test",
        "natashawehrli95@gmail.com",
        "+41 44 987 65 43",
        "Allgemeine Beratung",
        "Montag um 14 Uhr",
        "Ja, Termin buchen"
      ],
      "natashawehrli95@gmail.com"
    );

    // === TEST 3: DATA VALIDATION ===
    await this.runScenario(
      "Data Validation Test",
      [
        "Offerte für Haftpflichtversicherung",
        "Anna Validation",
        "ungueltige-email",
        "natashawehrli95@gmail.com",
        "25 Jahre, Basis Deckung"
      ],
      "natashawehrli95@gmail.com"
    );

    // === TEST 4: CONTEXT SWITCHING ===
    await this.runScenario(
      "Context Switch Test",
      [
        "Sachversicherung Offerte",
        "Max Wechsel",
        "Eigentlich möchte ich einen Termin",
        "Max Wechsel",
        "natashawehrli95@gmail.com",
        "+41 78 111 22 33",
        "Schadensbesprechung",
        "Freitag"
      ],
      "natashawehrli95@gmail.com"
    );

    await this.generateTestReport();
  }

  async generateTestReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 LIVE CHAT API TEST RESULTS');
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
          console.log(`   ${result.details.split('\n')[0]}`);
        });
    }

    console.log(`\n📧 EMAIL TESTING:`);
    console.log(`   Customer emails should be sent to: natashawehrli95@gmail.com`);
    console.log(`   Staff notifications should be sent to: wehrlinatasha@gmail.com`);
    console.log(`   Expected emails: ${successfulTests * 2} (${successfulTests} customer + ${successfulTests} staff)`);

    const successRate = (successfulTests / totalTests) * 100;
    if (successRate >= 90) {
      console.log(`\n🎉 EXCELLENT! Chat API performs exceptionally well (${successRate.toFixed(1)}%)`);
    } else if (successRate >= 75) {
      console.log(`\n✅ GOOD! Chat API performs well (${successRate.toFixed(1)}%)`);
    } else if (successRate >= 50) {
      console.log(`\n⚠️  MIXED RESULTS! Some functionality working (${successRate.toFixed(1)}%)`);
    } else {
      console.log(`\n🚨 NEEDS ATTENTION! Major issues detected (${successRate.toFixed(1)}%)`);
    }

    console.log(`\n🎯 NEXT STEPS:`);
    console.log(`   1. Check natashawehrli95@gmail.com for customer confirmations`);
    console.log(`   2. Check wehrlinatasha@gmail.com for staff notifications`);
    console.log(`   3. Test manually in browser: http://localhost:3000`);
    console.log(`   4. Check browser console for any errors`);
    console.log(`   5. Verify Supabase data in appointments and quotes tables`);

    console.log('\n' + '='.repeat(80));
    console.log('🏁 Testing completed! Check your emails for confirmations.');
    console.log('='.repeat(80));
  }
}

async function runLiveChatAPITest() {
  const tester = new LiveChatAPITest();
  await tester.runAllTests();
}

// Auto-run
if (require.main === module) {
  runLiveChatAPITest().catch(console.error);
}

module.exports = { runLiveChatAPITest };