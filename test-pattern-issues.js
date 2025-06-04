/**
 * Test ChatAgent Pattern Matching Issues
 * Demonstrates the specific pattern matching problems
 */

// Simulated pattern matching from ChatAgent
const TOPIC_PATTERNS = {
  document_upload: [
    /dokument|datei|upload|hochladen|anhang|pdf|scan|foto|bild/i,
    /schadensmeldung|rechnung|arztbericht|vertrag|kündig/i,
    /einreichen|übermitteln|senden|schicken|abgeben/i
  ],
  faq: [
    /was.*ist|wie.*funktioniert|erklär|erklärun/i,
    /franchise|selbstbehalt|grundversicherung|zusatz/i,
    /uvg|suva|ahv|säule|haftpflicht|kasko/i,
    /was.*kostet|wie.*teuer|kosten|preis|preise|gebühr|gebühren/i
  ]
};

function detectTopicByPatterns(message) {
  const messageLower = message.toLowerCase();
  let bestMatch = { topic: 'general', confidence: 0.1, matchCount: 0 };
  
  for (const [topic, patterns] of Object.entries(TOPIC_PATTERNS)) {
    const matches = patterns.filter(pattern => pattern.test(messageLower));
    const matchCount = matches.length;
    
    if (matchCount > 0) {
      let confidence = 0.2 + (matchCount * 0.25);
      
      // Enhanced confidence for specific patterns
      if (topic === 'document_upload' && /dokument/i.test(messageLower)) {
        confidence += 0.3;
      }
      
      confidence = Math.min(0.95, confidence);
      
      if (confidence > bestMatch.confidence) {
        bestMatch = { topic, confidence, matchCount };
      }
    }
  }
  
  return bestMatch;
}

console.log('🧪 Testing ChatAgent Pattern Matching Issues\n');
console.log('=============================================\n');

const testMessages = [
  {
    message: "Wie exportiere ich meine Dokumente für Revisionen oder Audits?",
    expectedIntent: "faq",
    description: "User wants to know how to export/download their documents"
  },
  {
    message: "was für dokument arten (pdf, word ....) kann ich hochladen?",
    expectedIntent: "faq", 
    description: "User asking about supported document formats"
  },
  {
    message: "Ich möchte ein Dokument hochladen",
    expectedIntent: "document_upload",
    description: "User actually wants to upload a document"
  },
  {
    message: "Welche Dateiformate unterstützen Sie?",
    expectedIntent: "faq",
    description: "User asking about supported file formats"
  },
  {
    message: "Kann ich meine Dokumente herunterladen?",
    expectedIntent: "faq",
    description: "User asking about download capability"
  }
];

console.log('TESTING CURRENT PATTERN MATCHING:\n');

testMessages.forEach((test, index) => {
  const result = detectTopicByPatterns(test.message);
  const isCorrect = result.topic === test.expectedIntent;
  const status = isCorrect ? '✅' : '❌';
  
  console.log(`${index + 1}. ${status} "${test.message}"`);
  console.log(`   Expected: ${test.expectedIntent}`);
  console.log(`   Detected: ${result.topic} (confidence: ${result.confidence.toFixed(2)})`);
  console.log(`   Description: ${test.description}`);
  
  if (!isCorrect) {
    console.log(`   ⚠️  PROBLEM: Will trigger wrong flow!`);
  }
  console.log('');
});

// Now test with improved patterns
const IMPROVED_PATTERNS = {
  document_upload: [
    // More specific upload intent patterns
    /möchte.*hochladen|will.*hochladen|kann.*ich.*hochladen/i,
    /dokument.*hochladen|upload.*dokument|dokument.*senden/i,
    /einreichen.*dokument|übermitteln.*dokument|abgeben.*dokument/i,
    /schadensmeldung.*einreichen|rechnung.*senden/i
  ],
  faq: [
    // Existing FAQ patterns
    /was.*ist|wie.*funktioniert|erklär|erklärun/i,
    /franchise|selbstbehalt|grundversicherung|zusatz/i,
    /uvg|suva|ahv|säule|haftpflicht|kasko/i,
    /was.*kostet|wie.*teuer|kosten|preis|preise|gebühr|gebühren/i,
    
    // NEW: Document information patterns
    /exportier|download|herunterladen|speichern|ausgeben/i,
    /welche.*arten|was.*für.*arten|unterstützte.*format/i,
    /dokument.*format|format.*dokument|dateityp|file.*type/i,
    /welche.*dokument.*arten|was.*dokument.*arten/i,
    /unterstützen.*sie|welche.*datei/i
  ]
};

function detectTopicByImprovedPatterns(message) {
  const messageLower = message.toLowerCase();
  let bestMatch = { topic: 'general', confidence: 0.1, matchCount: 0 };
  
  for (const [topic, patterns] of Object.entries(IMPROVED_PATTERNS)) {
    const matches = patterns.filter(pattern => pattern.test(messageLower));
    const matchCount = matches.length;
    
    if (matchCount > 0) {
      let confidence = 0.2 + (matchCount * 0.25);
      
      // Bonus for clear intent indicators
      if (topic === 'faq' && /welche|was.*für|unterstützt|exportier|download/i.test(messageLower)) {
        confidence += 0.3;
      }
      
      if (topic === 'document_upload' && /möchte.*hochladen|will.*hochladen/i.test(messageLower)) {
        confidence += 0.4;
      }
      
      confidence = Math.min(0.95, confidence);
      
      if (confidence > bestMatch.confidence) {
        bestMatch = { topic, confidence, matchCount };
      }
    }
  }
  
  return bestMatch;
}

console.log('TESTING IMPROVED PATTERN MATCHING:\n');

testMessages.forEach((test, index) => {
  const result = detectTopicByImprovedPatterns(test.message);
  const isCorrect = result.topic === test.expectedIntent;
  const status = isCorrect ? '✅' : '❌';
  
  console.log(`${index + 1}. ${status} "${test.message}"`);
  console.log(`   Expected: ${test.expectedIntent}`);
  console.log(`   Detected: ${result.topic} (confidence: ${result.confidence.toFixed(2)})`);
  
  if (isCorrect) {
    console.log(`   ✨ FIXED: Now correctly identifies intent!`);
  } else {
    console.log(`   ⚠️  STILL PROBLEMATIC`);
  }
  console.log('');
});

console.log('📊 SUMMARY:\n');
console.log('Current patterns: Many false positives for document_upload');
console.log('Improved patterns: Better disambiguation between upload vs info requests');
console.log('\n🎯 Key improvements:');
console.log('- Added export/download patterns to FAQ');
console.log('- Made upload patterns more specific (intent-based)');  
console.log('- Added document format inquiry patterns to FAQ');
console.log('- Reduced false positives from generic "dokument" keyword');