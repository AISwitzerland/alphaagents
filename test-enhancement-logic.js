// Test enhancement logic in isolation
function enhanceClassificationWithTextAnalysis(originalType, extractedText, classification) {
  const text = extractedText.toLowerCase();
  const summary = classification.summary?.toLowerCase() || '';
  
  console.log('🔍 Enhancement analysis for:', originalType);
  console.log('   Summary:', summary);
  console.log('   Summary includes unfallversicherung:', summary.includes('unfallversicherung'));
  console.log('   Summary includes schadenmeldung:', summary.includes('schadenmeldung'));
  console.log('   Summary includes formular:', summary.includes('formular'));
  console.log('   Original type includes unfall:', originalType.includes('unfall'));
  console.log('   Original type includes accident:', originalType.includes('accident'));
  
  // SUVA/UVG documents - Enhanced detection with multiple patterns
  if (!originalType.includes('unfall') && !originalType.includes('accident')) {
    console.log('   → Entering SUVA/UVG enhancement section');
    
    // Fallback: Check classification summary for accident insurance keywords
    if (summary.includes('unfallversicherung') && 
        (summary.includes('schadenmeldung') || summary.includes('formular'))) {
      console.log('🔍 Summary analysis detected: Unfallbericht via summary (enhanced from:', originalType, ')');
      return 'unfallbericht';
    } else {
      console.log('   → Summary fallback conditions not met');
    }
  } else {
    console.log('   → Skipping enhancement (already accident type)');
  }
  
  console.log('🔍 No text enhancement needed, keeping original classification:', originalType);
  return originalType;
}

// Test with our actual data
const testClassification = {
  type: 'Formular',
  summary: 'Das Dokument ist ein handschriftlich ausgefülltes Formular zur Schadenmeldung bei der Unfallversicherung. Es enthält Informationen über den Arbeitgeber, die verletzte Person, den Unfallhergang und weitere relevante Details.'
};

const result = enhanceClassificationWithTextAnalysis(
  'formular', // lowercase originalType
  'I\'m sorry, I can\'t assist with that.',
  testClassification
);

console.log('\n🎯 FINAL RESULT:', result);
console.log('✅ Should be "unfallbericht" for accident_reports table');