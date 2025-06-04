/**
 * COMPREHENSIVE CHAT AGENT TEST
 * Tests all possible user scenarios for quote and appointment flows
 */

const { ChatAgent } = require('./packages/agents/src/chat/ChatAgent');
const { globalServices } = require('./apps/frontend/src/lib/services');

interface TestScenario {
  name: string;
  description: string;
  messages: string[];
  expectedOutcomes: string[];
}

class ChatTestRunner {
  private chatAgent: any;
  private testResults: { scenario: string; success: boolean; details: string }[] = [];

  async initialize() {
    console.log('🚀 Initializing Chat Agent Test System...\n');
    
    const container = await globalServices.getContainer();
    
    this.chatAgent = new ChatAgent({
      id: 'comprehensive-test-chat-agent',
      name: 'ComprehensiveTestChatAgent',
      version: '1.0.0',
      enabled: true,
      maxRetries: 3,
      timeout: 30000,
      healthCheckInterval: 30000,
      dependencies: []
    }, container);

    await this.chatAgent.start();
    console.log('✅ Chat Agent initialized successfully\n');
  }

  async runScenario(scenario: TestScenario): Promise<void> {
    console.log(`🧪 TESTING: ${scenario.name}`);
    console.log(`📝 Description: ${scenario.description}\n`);

    const sessionId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let conversationSuccess = true;
    let conversationDetails = '';

    try {
      for (let i = 0; i < scenario.messages.length; i++) {
        const message = scenario.messages[i];
        console.log(`   ${i + 1}. User: "${message}"`);

        const result = await this.chatAgent.execute({
          action: 'chat',
          sessionId,
          message,
          userId: `test-user-${sessionId}`
        }, {
          sessionId,
          userId: `test-user-${sessionId}`,
          agentId: 'comprehensive-test-chat-agent',
          timestamp: new Date(),
          metadata: {}
        });

        if (result.success && result.data?.response) {
          const response = result.data.response;
          console.log(`      Bot: "${response.substring(0, 150)}${response.length > 150 ? '...' : ''}"`);
          
          // Check for expected outcomes
          const expectedOutcome = scenario.expectedOutcomes[i];
          if (expectedOutcome && !response.toLowerCase().includes(expectedOutcome.toLowerCase())) {
            console.log(`      ❌ Expected outcome not found: "${expectedOutcome}"`);
            conversationSuccess = false;
          } else if (expectedOutcome) {
            console.log(`      ✅ Expected outcome found: "${expectedOutcome}"`);
          }

          conversationDetails += `Message ${i + 1}: ${message} → ${response.substring(0, 100)}...\n`;

          // Check for completion indicators
          if (response.includes('Referenz-Nr.') || response.includes('erfolgreich registriert') || response.includes('Offerte ist bereit')) {
            console.log(`      🎉 COMPLETION DETECTED!`);
            if (response.includes('E-Mail gesendet') || response.includes('E-Mail wurde an')) {
              console.log(`      📧 EMAIL CONFIRMATION DETECTED!`);
            }
            break;
          }
        } else {
          console.log(`      ❌ Error: ${result.error}`);
          conversationSuccess = false;
          conversationDetails += `Message ${i + 1}: ERROR - ${result.error}\n`;
        }

        // Small delay between messages
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.log(`   ❌ Scenario failed with error: ${error}`);
      conversationSuccess = false;
      conversationDetails += `FATAL ERROR: ${error}\n`;
    }

    this.testResults.push({
      scenario: scenario.name,
      success: conversationSuccess,
      details: conversationDetails
    });

    console.log(`   Result: ${conversationSuccess ? '✅ SUCCESS' : '❌ FAILED'}\n`);
  }

  async runAllScenarios() {
    console.log('🎯 STARTING COMPREHENSIVE CHAT AGENT TESTING\n');
    console.log('This will test various user behaviors and edge cases...\n');

    // === QUOTE SCENARIOS ===
    
    const quoteScenarios: TestScenario[] = [
      {
        name: "Perfect Quote Flow - All Info at Once",
        description: "User provides all information in single responses",
        messages: [
          "Ich möchte eine Offerte für eine Krankenversicherung",
          "Max Mustermann",
          "max.mustermann@test.ch",
          "+41 44 123 45 67",
          "Ich bin 35 Jahre alt und möchte Grund + Zusatzversicherung"
        ],
        expectedOutcomes: ["versicherung", "name", "e-mail", "telefon", "offerte"]
      },
      
      {
        name: "Gradual Quote Flow - Piece by Piece",
        description: "User provides information gradually, one piece at a time",
        messages: [
          "Krankenversicherung Offerte bitte",
          "Anna Beispiel",
          "anna.beispiel@email.ch",
          "079 123 45 67",
          "35 Jahre",
          "Zusatzversicherung"
        ],
        expectedOutcomes: ["versicherung", "name", "e-mail", "telefon", "alter", "zusatz"]
      },

      {
        name: "Vague Responses Quote Flow",
        description: "User gives vague or unclear responses",
        messages: [
          "Ich brauche etwas",
          "Versicherung halt",
          "Krankenversicherung",
          "Peter",
          "Peter Schmidt",
          "peter@test.ch",
          "044 123 45 67",
          "So um die 30",
          "Etwas Gutes bitte"
        ],
        expectedOutcomes: ["versicherung", "kranken", "name", "e-mail", "telefon", "alter", "coverage"]
      },

      {
        name: "Quote with Invalid Data",
        description: "User provides invalid email/phone, system should retry",
        messages: [
          "Haftpflichtversicherung Offerte",
          "Lisa Fehlerhaft", 
          "ungültige-email",
          "lisa.korrekt@email.ch",
          "ungültige-nummer",
          "+41 79 555 66 77",
          "25 Jahre alt, Basis Deckung bitte"
        ],
        expectedOutcomes: ["haftpflicht", "name", "gültige e-mail", "e-mail", "telefon", "basis"]
      },

      {
        name: "Context Switch During Quote",
        description: "User switches to appointment booking mid-quote",
        messages: [
          "Offerte für Sachversicherung",
          "Maria Wechsel",
          "maria@test.ch",
          "Eigentlich möchte ich lieber einen Termin",
          "Maria Wechsel",
          "+41 78 999 88 77",
          "Beratung",
          "Montag um 14 Uhr"
        ],
        expectedOutcomes: ["sachversicherung", "name", "termin", "beratung", "montag"]
      }
    ];

    // === APPOINTMENT SCENARIOS ===
    
    const appointmentScenarios: TestScenario[] = [
      {
        name: "Perfect Appointment Flow",
        description: "Smooth appointment booking with all data",
        messages: [
          "Ich möchte einen Termin vereinbaren",
          "Thomas Perfekt",
          "thomas.perfekt@email.ch", 
          "+41 44 987 65 43",
          "Allgemeine Beratung",
          "Freitag um 10 Uhr"
        ],
        expectedOutcomes: ["termin", "name", "e-mail", "telefon", "beratung", "freitag"]
      },

      {
        name: "Appointment with Unclear Time",
        description: "User gives vague time preferences",
        messages: [
          "Termin bitte",
          "Sandra Zeit",
          "sandra@email.ch",
          "078 111 22 33", 
          "Schadensbesprechung",
          "Irgendwann nächste Woche",
          "Nachmittag wäre gut"
        ],
        expectedOutcomes: ["termin", "name", "schaden", "woche", "nachmittag"]
      },

      {
        name: "Context Switch from Appointment to Quote",
        description: "User switches from appointment to quote request",
        messages: [
          "Einen Termin bitte",
          "Robert Switcher",
          "Ach nein, lieber eine Offerte",
          "Unfallversicherung",
          "Robert Switcher",
          "robert@test.ch",
          "+41 79 444 55 66",
          "40 Jahre, brauche NBU Versicherung"
        ],
        expectedOutcomes: ["termin", "offerte", "unfall", "name", "nbu"]
      }
    ];

    // === EDGE CASE SCENARIOS ===
    
    const edgeCaseScenarios: TestScenario[] = [
      {
        name: "Multiple Topic Switches", 
        description: "User switches topics multiple times",
        messages: [
          "Hallo",
          "Dokumente hochladen",
          "Nein doch Termin",
          "Ach lieber Offerte",
          "Krankenversicherung",
          "Eigentlich FAQ",
          "Was ist eine Franchise?",
          "Doch lieber die Offerte",
          "Klaus Unentschlossen",
          "klaus@email.ch"
        ],
        expectedOutcomes: ["hallo", "dokument", "termin", "offerte", "kranken", "franchise", "offerte", "name"]
      },

      {
        name: "Very Short Responses",
        description: "User gives minimal responses",
        messages: [
          "Offerte",
          "Kranken",
          "Max",
          "Max Kurz", 
          "max@test.ch",
          "044",
          "044 111 22 33",
          "30",
          "Zusatz"
        ],
        expectedOutcomes: ["offerte", "kranken", "name", "e-mail", "telefon", "zusatz"]
      },

      {
        name: "Long Detailed Responses",
        description: "User provides very detailed, long responses",
        messages: [
          "Guten Tag! Ich bin auf der Suche nach einer umfassenden Versicherungsofferte für eine Krankenversicherung, da meine aktuelle Versicherung zu teuer geworden ist",
          "Mein Name ist Dr. Angela Ausführlich-Detailliert und ich bin Ärztin",
          "Meine E-Mail-Adresse lautet angela.detailliert@universitaetsspital-zuerich.ch",
          "Sie können mich unter der Telefonnummer +41 44 255 11 11 erreichen",
          "Ich bin 42 Jahre alt, arbeite als Chirurgin und benötige eine umfassende Krankenversicherung mit Zusatzleistungen wie Einzelzimmer, alternative Medizin und weltweitem Schutz"
        ],
        expectedOutcomes: ["krankenversicherung", "angela", "universitaet", "255", "42", "zusatz"]
      },

      {
        name: "Wrong Language Mixed In",
        description: "User mixes in English or other languages",
        messages: [
          "I need a quote",
          "Entschuldigung, eine Offerte bitte",
          "Health insurance",
          "Krankenversicherung",
          "John English",
          "john@test.com",
          "+41 79 100 200 300",
          "I am 28 years old",
          "Basic coverage please"
        ],
        expectedOutcomes: ["quote", "offerte", "krankenversicherung", "john", "28", "basic"]
      }
    ];

    // Run all scenario groups
    console.log('📋 TESTING QUOTE SCENARIOS\n');
    for (const scenario of quoteScenarios) {
      await this.runScenario(scenario);
    }

    console.log('📅 TESTING APPOINTMENT SCENARIOS\n');
    for (const scenario of appointmentScenarios) {
      await this.runScenario(scenario);
    }

    console.log('🔍 TESTING EDGE CASE SCENARIOS\n');
    for (const scenario of edgeCaseScenarios) {
      await this.runScenario(scenario);
    }
  }

  async cleanup() {
    if (this.chatAgent) {
      await this.chatAgent.stop();
    }
  }

  printResults() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE TEST RESULTS SUMMARY');
    console.log('='.repeat(80));

    const totalTests = this.testResults.length;
    const successfulTests = this.testResults.filter(r => r.success).length;
    const failedTests = totalTests - successfulTests;
    const successRate = ((successfulTests / totalTests) * 100).toFixed(1);

    console.log(`\n📈 OVERALL STATISTICS:`);
    console.log(`   Total Scenarios Tested: ${totalTests}`);
    console.log(`   Successful: ${successfulTests} ✅`);
    console.log(`   Failed: ${failedTests} ❌`);
    console.log(`   Success Rate: ${successRate}%`);

    if (successRate >= '90') {
      console.log(`\n🎉 EXCELLENT! System performs very well across scenarios.`);
    } else if (successRate >= '75') {
      console.log(`\n✅ GOOD! System handles most scenarios well.`);
    } else {
      console.log(`\n⚠️  NEEDS IMPROVEMENT! Several scenarios are failing.`);
    }

    console.log(`\n📋 DETAILED RESULTS:`);
    this.testResults.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(`   ${index + 1}. ${status} ${result.scenario}`);
      if (!result.success) {
        console.log(`      Details: ${result.details.split('\n')[0]}`);
      }
    });

    if (failedTests > 0) {
      console.log(`\n🔍 FAILED SCENARIOS ANALYSIS:`);
      this.testResults
        .filter(r => !r.success)
        .forEach(result => {
          console.log(`\n❌ ${result.scenario}:`);
          console.log(`   ${result.details}`);
        });
    }

    console.log('\n' + '='.repeat(80));
    console.log('Testing completed! Check your email for any notifications sent during testing.');
    console.log('='.repeat(80));
  }
}

async function runComprehensiveTest() {
  const testRunner = new ChatTestRunner();
  
  try {
    await testRunner.initialize();
    await testRunner.runAllScenarios();
    testRunner.printResults();
  } catch (error) {
    console.error('❌ Test runner failed:', error);
  } finally {
    await testRunner.cleanup();
  }
}

// Run test if called directly
if (require.main === module) {
  runComprehensiveTest().catch(console.error);
}

module.exports = { runComprehensiveTest, ChatTestRunner };