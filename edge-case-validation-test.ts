/**
 * EDGE CASE VALIDATION TEST
 * Tests specific validation logic and error handling
 */

const { ChatAgent } = require('./packages/agents/src/chat/ChatAgent');
const { globalServices } = require('./apps/frontend/src/lib/services');

interface ValidationTest {
  name: string;
  input: string;
  expectedBehavior: string;
  testType: 'email' | 'phone' | 'age' | 'context_switch' | 'data_extraction';
}

class EdgeCaseValidator {
  private chatAgent!: ChatAgent;
  private sessionId!: string;

  async initialize() {
    console.log('🔬 Initializing Edge Case Validation System...\n');
    
    const container = await globalServices.getContainer();
    
    this.chatAgent = new ChatAgent({
      id: 'validation-test-chat-agent',
      name: 'ValidationTestChatAgent', 
      version: '1.0.0',
      enabled: true,
      maxRetries: 3,
      timeout: 30000,
      healthCheckInterval: 30000,
      dependencies: []
    }, container);

    await this.chatAgent.start();
    this.sessionId = `validation-test-${Date.now()}`;
    console.log('✅ Validation system ready\n');
  }

  async testValidation(test: ValidationTest): Promise<boolean> {
    console.log(`🧪 Testing ${test.testType}: ${test.name}`);
    console.log(`   Input: "${test.input}"`);
    console.log(`   Expected: ${test.expectedBehavior}`);

    try {
      const result = await this.chatAgent.execute({
        action: 'chat',
        sessionId: this.sessionId,
        message: test.input,
        userId: 'validation-test-user'
      }, {
        sessionId: this.sessionId,
        userId: 'validation-test-user',
        agentId: 'validation-test-chat-agent',
        timestamp: new Date(),
        metadata: {}
      });

      if (result.success && result.data?.response) {
        const response = result.data.response.toLowerCase();
        console.log(`   Response: "${result.data.response.substring(0, 100)}..."`);
        
        // Check if expected behavior is present
        const expectationMet = response.includes(test.expectedBehavior.toLowerCase());
        console.log(`   Result: ${expectationMet ? '✅ PASSED' : '❌ FAILED'}`);
        
        return expectationMet;
      } else {
        console.log(`   ❌ FAILED - No response received`);
        return false;
      }
    } catch (error) {
      console.log(`   ❌ FAILED - Error: ${error}`);
      return false;
    }
  }

  async runValidationTests() {
    console.log('🎯 STARTING EDGE CASE VALIDATION TESTS\n');

    const emailTests: ValidationTest[] = [
      {
        name: "Invalid Email - Missing @",
        input: "meine.email.com",
        expectedBehavior: "gültige e-mail",
        testType: 'email'
      },
      {
        name: "Invalid Email - Missing Domain",
        input: "test@",
        expectedBehavior: "gültige e-mail",
        testType: 'email'
      },
      {
        name: "Invalid Email - No TLD",
        input: "test@domain",
        expectedBehavior: "gültige e-mail", 
        testType: 'email'
      },
      {
        name: "Valid Swiss Email",
        input: "hans.muster@swisscom.ch",
        expectedBehavior: "perfekt",
        testType: 'email'
      },
      {
        name: "Valid International Email",
        input: "user@gmail.com",
        expectedBehavior: "perfekt",
        testType: 'email'
      }
    ];

    const phoneTests: ValidationTest[] = [
      {
        name: "Swiss Mobile Format +41",
        input: "+41 79 123 45 67",
        expectedBehavior: "perfekt",
        testType: 'phone'
      },
      {
        name: "Swiss Landline Format 044",
        input: "044 123 45 67",
        expectedBehavior: "perfekt", 
        testType: 'phone'
      },
      {
        name: "Invalid Phone - Too Short",
        input: "123",
        expectedBehavior: "gültige telefon",
        testType: 'phone'
      },
      {
        name: "Invalid Phone - Letters",
        input: "abc def ghij",
        expectedBehavior: "gültige telefon",
        testType: 'phone'
      },
      {
        name: "Swiss Mobile Without Spaces",
        input: "+41791234567",
        expectedBehavior: "perfekt",
        testType: 'phone'
      }
    ];

    const ageExtractionTests: ValidationTest[] = [
      {
        name: "Age in Sentence",
        input: "Ich bin 35 Jahre alt",
        expectedBehavior: "35",
        testType: 'age'
      },
      {
        name: "Age Only Number",
        input: "42",
        expectedBehavior: "42",
        testType: 'age'
      },
      {
        name: "Age with 'j' Abbreviation",
        input: "28j",
        expectedBehavior: "28",
        testType: 'age'
      },
      {
        name: "Age in Different Format",
        input: "Alter: 50 Jahre",
        expectedBehavior: "50",
        testType: 'age'
      }
    ];

    const contextSwitchTests: ValidationTest[] = [
      {
        name: "Switch from Quote to Appointment",
        input: "Eigentlich möchte ich lieber einen Termin",
        expectedBehavior: "termin",
        testType: 'context_switch'
      },
      {
        name: "Switch to Document Upload",
        input: "Kann ich ein Dokument hochladen?",
        expectedBehavior: "dokument",
        testType: 'context_switch'
      },
      {
        name: "Switch to FAQ",
        input: "Was ist eigentlich eine Franchise?",
        expectedBehavior: "franchise",
        testType: 'context_switch'
      }
    ];

    // Start with a quote flow to have context
    console.log('🏁 Setting up initial context (starting quote flow)...');
    await this.testValidation({
      name: "Initial Setup",
      input: "Ich möchte eine Offerte für eine Krankenversicherung",
      expectedBehavior: "versicherung",
      testType: 'context_switch'
    });

    // Add name for further context
    await this.testValidation({
      name: "Add Name",
      input: "Max Tester",
      expectedBehavior: "max",
      testType: 'context_switch'
    });

    console.log('\n📧 TESTING EMAIL VALIDATION:');
    let emailPassed = 0;
    for (const test of emailTests) {
      const passed = await this.testValidation(test);
      if (passed) emailPassed++;
      console.log('');
    }

    console.log('\n📱 TESTING PHONE VALIDATION:');
    let phonePassed = 0;
    for (const test of phoneTests) {
      const passed = await this.testValidation(test);
      if (passed) phonePassed++;
      console.log('');
    }

    console.log('\n🎂 TESTING AGE EXTRACTION:');
    let agePassed = 0;
    for (const test of ageExtractionTests) {
      const passed = await this.testValidation(test);
      if (passed) agePassed++;
      console.log('');
    }

    console.log('\n🔄 TESTING CONTEXT SWITCHING:');
    let contextPassed = 0;
    for (const test of contextSwitchTests) {
      const passed = await this.testValidation(test);
      if (passed) contextPassed++;
      console.log('');
    }

    // Results Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 VALIDATION TEST RESULTS');
    console.log('='.repeat(60));
    
    const totalTests = emailTests.length + phoneTests.length + ageExtractionTests.length + contextSwitchTests.length;
    const totalPassed = emailPassed + phonePassed + agePassed + contextPassed;
    const successRate = ((totalPassed / totalTests) * 100).toFixed(1);

    console.log(`\n📈 VALIDATION STATISTICS:`);
    console.log(`   📧 Email Validation: ${emailPassed}/${emailTests.length} (${((emailPassed/emailTests.length)*100).toFixed(1)}%)`);
    console.log(`   📱 Phone Validation: ${phonePassed}/${phoneTests.length} (${((phonePassed/phoneTests.length)*100).toFixed(1)}%)`);
    console.log(`   🎂 Age Extraction: ${agePassed}/${ageExtractionTests.length} (${((agePassed/ageExtractionTests.length)*100).toFixed(1)}%)`);
    console.log(`   🔄 Context Switching: ${contextPassed}/${contextSwitchTests.length} (${((contextPassed/contextSwitchTests.length)*100).toFixed(1)}%)`);
    console.log(`\n🎯 Overall Validation Success Rate: ${successRate}%`);

    if (parseFloat(successRate) >= 90) {
      console.log(`\n🎉 EXCELLENT! Validation logic is working very well.`);
    } else if (parseFloat(successRate) >= 75) {
      console.log(`\n✅ GOOD! Most validation logic is working correctly.`);
    } else {
      console.log(`\n⚠️  NEEDS IMPROVEMENT! Validation logic needs attention.`);
    }

    console.log('\n' + '='.repeat(60));
  }

  async cleanup() {
    if (this.chatAgent) {
      await this.chatAgent.stop();
    }
  }
}

async function runEdgeCaseValidation() {
  const validator = new EdgeCaseValidator();
  
  try {
    await validator.initialize();
    await validator.runValidationTests();
  } catch (error) {
    console.error('❌ Validation test failed:', error);
  } finally {
    await validator.cleanup();
  }
}

// Run test if called directly
if (require.main === module) {
  runEdgeCaseValidation().catch(console.error);
}

export { runEdgeCaseValidation, EdgeCaseValidator };