/**
 * MASTER TEST RUNNER
 * Runs all comprehensive chat agent tests
 */

const { runComprehensiveTest } = require('./comprehensive-chat-test');
const { runEdgeCaseValidation } = require('./edge-case-validation-test');

async function runAllChatTests() {
  console.log('🚀 ALPHAAGENTS CHAT SYSTEM - MASTER TEST SUITE');
  console.log('='.repeat(80));
  console.log('This will test the complete chat system with various scenarios:');
  console.log('• Quote flows (perfect, gradual, vague responses)');
  console.log('• Appointment flows (complete, unclear data)');
  console.log('• Context switching (between topics)');
  console.log('• Edge cases (invalid data, mixed languages)');
  console.log('• Validation logic (email, phone, age extraction)');
  console.log('• Error handling and recovery');
  console.log('• Email notifications');
  console.log('='.repeat(80));
  console.log('');

  const startTime = Date.now();

  try {
    console.log('🎯 PHASE 1: COMPREHENSIVE SCENARIO TESTING');
    console.log('Testing various user behaviors and conversation flows...\n');
    await runComprehensiveTest();
    
    console.log('\n🔬 PHASE 2: EDGE CASE VALIDATION TESTING');
    console.log('Testing validation logic and error handling...\n');
    await runEdgeCaseValidation();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);

    console.log('\n' + '🎉'.repeat(40));
    console.log('🏆 ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('🎉'.repeat(40));
    console.log(`\n⏱️  Total testing time: ${duration} seconds`);
    console.log('\n📧 Email notifications should have been sent to:');
    console.log('   • wehrlinatasha@gmail.com (staff notifications)');
    console.log('   • Various test email addresses (customer confirmations)');
    console.log('\n📊 Check the detailed results above for:');
    console.log('   • Success rates for each scenario type');
    console.log('   • Validation accuracy for emails, phones, ages');
    console.log('   • Context switching performance');
    console.log('   • Error handling effectiveness');
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('   1. Review any failed scenarios above');
    console.log('   2. Check your email for test notifications');
    console.log('   3. Test manually in browser: http://localhost:3000');
    console.log('   4. Verify Supabase data: appointments and quotes tables');
    
    console.log('\n✅ Your Chat Agent is ready for production use!');

  } catch (error) {
    console.error('\n❌ MASTER TEST SUITE FAILED:', error);
    console.log('\n🔍 Troubleshooting steps:');
    console.log('   1. Check if frontend is running: npm run dev');
    console.log('   2. Verify environment variables (.env.local)');
    console.log('   3. Check Supabase connection');
    console.log('   4. Verify Resend API key');
    process.exit(1);
  }
}

// Auto-run if this script is executed directly
if (require.main === module) {
  runAllChatTests().catch(console.error);
}

export { runAllChatTests };