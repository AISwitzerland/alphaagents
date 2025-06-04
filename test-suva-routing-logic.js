// Test our SUVA routing logic in isolation

function testSuvaRouting() {
  console.log('Testing SUVA routing logic...');
  
  // Simulated data from our actual test
  const finalType = 'formular';
  const summaryLower = 'das dokument ist ein ausgefülltes formular zur schadenmeldung bei der unfallversicherung. es enthält informationen über den arbeitgeber, die verletzte person, den unfallhergang und weitere relevante details.';
  
  console.log('finalType:', finalType);
  console.log('summaryLower includes unfallversicherung:', summaryLower.includes('unfallversicherung'));
  console.log('Condition check:', finalType === 'formular' && summaryLower.includes('unfallversicherung'));
  
  if (finalType === 'formular' && summaryLower.includes('unfallversicherung')) {
    console.log('✅ SUVA routing condition MATCHED!');
    console.log('Should route to accident_reports');
    return 'accident_reports';
  } else {
    console.log('❌ SUVA routing condition FAILED');
    console.log('Would route to miscellaneous_documents');
    return 'miscellaneous_documents';
  }
}

const result = testSuvaRouting();
console.log('Final routing result:', result);