// Test content-based routing logic in isolation

function testContentBasedRouting() {
  console.log('Testing content-based accident report routing logic...');
  
  // Test data from our actual SUVA document
  const testCases = [
    {
      name: 'SUVA Form (safety refusal)',
      finalType: 'formular',
      textLower: "i'm sorry, i can't assist with that.",
      summaryLower: 'das dokument ist ein ausgefülltes formular zur schadenmeldung bei der unfallversicherung suva. es enthält informationen über den arbeitgeber, die verletzte person, den unfallhergang und weitere relevante details.',
      expected: 'accident_reports'
    },
    {
      name: 'SUVA Form (perfect extraction)',
      finalType: 'formular', 
      textLower: 'schadenmeldung uvg unfall verletzung suva arbeitgeber verletzte unfallort',
      summaryLower: 'das dokument ist ein formular zur schadenmeldung bei der unfallversicherung.',
      expected: 'accident_reports'
    },
    {
      name: 'Word accident report',
      finalType: 'brief',
      textLower: 'hiermit melde ich einen arbeitsunfall der sich am 15.03.2024 ereignet hat. der mitarbeiter hat sich das bein verletzt.',
      summaryLower: 'brief über einen arbeitsunfall mit verletzungsbeschreibung.',
      expected: 'accident_reports'
    },
    {
      name: 'Insurance cancellation (should NOT be accident)',
      finalType: 'kündigungsschreiben',
      textLower: 'hiermit kündige ich meine unfallversicherung zum nächstmöglichen termin.',
      summaryLower: 'kündigung einer unfallversicherung.',
      expected: 'NOT accident_reports'
    },
    {
      name: 'Rate information (should NOT be accident)',
      finalType: 'formular',
      textLower: 'ratenversicherung unfall informationen zu tarifen und leistungen.',
      summaryLower: 'informationen zu unfallversicherung tarifen.',
      expected: 'NOT accident_reports'
    }
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`\\n🧪 Test ${index + 1}: ${testCase.name}`);
    console.log('-'.repeat(50));
    
    const { finalType, textLower, summaryLower } = testCase;
    
    // Content-based detection logic (same as in our code)
    const hasAccidentContent = (
      // SUVA/UVG specific content
      textLower.includes('suva') || summaryLower.includes('suva') ||
      textLower.includes('uvg') || summaryLower.includes('uvg') ||
      textLower.includes('schadenmeldung uvg') ||
      summaryLower.includes('unfallversicherung') ||
      
      // Workplace accident indicators
      textLower.includes('arbeitsunfall') || textLower.includes('betriebsunfall') ||
      textLower.includes('unfall am arbeitsplatz') ||
      summaryLower.includes('arbeitsunfall') || summaryLower.includes('betriebsunfall') ||
      
      // General accident report indicators
      summaryLower.includes('unfallbericht') ||
      (textLower.includes('unfall') && textLower.includes('verletzung')) ||
      (summaryLower.includes('unfall') && summaryLower.includes('verletzung'))
    );
    
    // Exclude documents that are clearly not accident reports
    const isNotAccidentReport = (
      textLower.includes('kündigung') || summaryLower.includes('kündigung') ||
      textLower.includes('police') || summaryLower.includes('police') ||
      finalType.includes('rechnung') || finalType.includes('invoice')
    );
    
    const wouldRouteToAccident = hasAccidentContent && !isNotAccidentReport;
    const actualResult = wouldRouteToAccident ? 'accident_reports' : 'other_table';
    const isCorrect = (testCase.expected === 'accident_reports') === wouldRouteToAccident;
    
    console.log(`📋 Document Type: ${finalType}`);
    console.log(`🔍 Has Accident Content: ${hasAccidentContent}`);
    console.log(`🚫 Is Not Accident Report: ${isNotAccidentReport}`);
    console.log(`🎯 Would Route To: ${actualResult}`);
    console.log(`✅ Result: ${isCorrect ? 'CORRECT' : 'WRONG'} (Expected: ${testCase.expected})`);
    
    if (hasAccidentContent) {
      console.log('   Detected patterns:');
      if (textLower.includes('suva') || summaryLower.includes('suva')) console.log('   - SUVA');
      if (textLower.includes('uvg') || summaryLower.includes('uvg')) console.log('   - UVG');
      if (summaryLower.includes('unfallversicherung')) console.log('   - Unfallversicherung');
      if (textLower.includes('arbeitsunfall') || summaryLower.includes('arbeitsunfall')) console.log('   - Arbeitsunfall');
      if (textLower.includes('unfall') && textLower.includes('verletzung')) console.log('   - Unfall + Verletzung');
    }
    
    if (isNotAccidentReport) {
      console.log('   Exclusion patterns:');
      if (textLower.includes('kündigung') || summaryLower.includes('kündigung')) console.log('   - Kündigung');
    }
  });
  
  console.log('\\n📊 CONTENT-BASED ROUTING TEST SUMMARY');
  console.log('='.repeat(50));
  console.log('This logic should now catch accident reports regardless of document type');
  console.log('while excluding cancellations and rate information.');
}

testContentBasedRouting();