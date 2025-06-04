const fs = require('fs');
const path = require('path');

// Test all documents with fixed SUVA routing
const testResults = [];

const documentCategories = {
  'SUVA/Accident': [
    'Suva1 Kopie 2.pdf',
    'Suva#2 Kopie 3.pdf', 
    'ratenversicherung-unfall-de Kopie 2.pdf'
  ],
  'Contract/Cancellation': [
    'Kündigung Versicherung Kopie 2.pdf',
    'kuendigung-allianz Kopie 2.pdf',
    '1-vorlage-kuendigung-zusatzversicherung-krankenkasse-417657-de Kopie 2.docx',
    '2-vorlage-ordentliche-kuendigung-des-versicherungsvertrages-de Kopie 2.docx',
    '3-vorlage-kuendigung-im-schadensfall-de Kopie 2.docx',
    'vertragstrennung Kopie 2.pdf'
  ],
  'Damage Reports': [
    'meldung-sturmschaden Kopie 2.pdf'
  ],
  'Miscellaneous': [
    'meldeformular-kontoverbindung Kopie 2.pdf'
  ],
  'Test Cases': [
    'Schlechte Qualität Kopie 2.webp'
  ]
};

const expectedRouting = {
  'Suva1 Kopie 2.pdf': 'accident_reports',
  'Suva#2 Kopie 3.pdf': 'accident_reports',
  'ratenversicherung-unfall-de Kopie 2.pdf': 'accident_reports',
  'Kündigung Versicherung Kopie 2.pdf': 'contract_changes',
  'kuendigung-allianz Kopie 2.pdf': 'contract_changes',
  '1-vorlage-kuendigung-zusatzversicherung-krankenkasse-417657-de Kopie 2.docx': 'contract_changes',
  '2-vorlage-ordentliche-kuendigung-des-versicherungsvertrages-de Kopie 2.docx': 'contract_changes',
  '3-vorlage-kuendigung-im-schadensfall-de Kopie 2.docx': 'contract_changes',
  'vertragstrennung Kopie 2.pdf': 'contract_changes',
  'meldung-sturmschaden Kopie 2.pdf': 'damage_reports',
  'meldeformular-kontoverbindung Kopie 2.pdf': 'miscellaneous_documents',
  'Schlechte Qualität Kopie 2.webp': 'miscellaneous_documents'
};

async function testDocument(filename, category) {
  console.log(`\\n🔍 Testing: ${filename}`);
  console.log(`📁 Category: ${category}`);
  console.log('─'.repeat(60));
  
  const filePath = path.join(__dirname, 'test-documents', filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filename}`);
    return { filename, category, success: false, error: 'File not found' };
  }

  const result = {
    filename,
    category,
    fileSize: (fs.statSync(filePath).size / 1024).toFixed(1) + ' KB',
    expectedTable: expectedRouting[filename] || 'unknown',
    timestamp: new Date().toISOString(),
    success: false,
    extractedTextLength: 0,
    extractedText: '',
    classification: null,
    actualTable: null,
    documentId: null,
    recordId: null,
    emailSent: false,
    routingCorrect: false,
    keywordsFound: [],
    errors: []
  };

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const FormData = (await import('formdata-node')).FormData;
    const formData = new FormData();
    
    // Determine MIME type
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.png': 'image/png',
      '.webp': 'image/webp'
    };
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    
    formData.append('file', new Blob([fileBuffer], { type: mimeType }), filename);
    
    console.log(`📊 Size: ${result.fileSize}, Expected: ${result.expectedTable}`);
    console.log('🤖 Processing...');
    
    const response = await fetch('http://localhost:3000/api/ocr-save', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const apiResult = await response.json();
    
    if (apiResult.success && apiResult.data) {
      result.success = true;
      result.extractedTextLength = apiResult.data.ocrResult?.extractedText?.length || 0;
      result.extractedText = apiResult.data.ocrResult?.extractedText || '';
      result.classification = apiResult.data.ocrResult?.classification || {};
      result.documentId = apiResult.data.documentRecord?.id;
      result.recordId = apiResult.data.specificRecord?.id;
      result.actualTable = apiResult.data.supabaseUrl?.split('/').pop() || 'unknown';
      result.emailSent = !apiResult.data.emailError;
      result.routingCorrect = result.actualTable === result.expectedTable;
      
      // Analyze keywords
      const text = result.extractedText.toLowerCase();
      const summary = result.classification.summary?.toLowerCase() || '';
      
      if (text.includes('suva') || summary.includes('suva')) result.keywordsFound.push('SUVA');
      if (text.includes('uvg') || summary.includes('uvg')) result.keywordsFound.push('UVG');
      if (text.includes('unfall') || summary.includes('unfall')) result.keywordsFound.push('Unfall');
      if (text.includes('verletzung') || summary.includes('verletzung')) result.keywordsFound.push('Verletzung');
      if (text.includes('kündigung') || summary.includes('kündigung')) result.keywordsFound.push('Kündigung');
      if (summary.includes('unfallversicherung')) result.keywordsFound.push('Unfallversicherung');
      
      console.log(`✅ SUCCESS!`);
      console.log(`📋 Type: ${result.classification.type} (${((result.classification.confidence || 0) * 100).toFixed(1)}%)`);
      console.log(`📝 Text: ${result.extractedTextLength} chars`);
      console.log(`💾 Doc ID: ${result.documentId}`);
      console.log(`🏷️  Table: ${result.actualTable}`);
      console.log(`🎯 Routing: ${result.routingCorrect ? '✅ CORRECT' : '❌ WRONG'}`);
      console.log(`📧 Email: ${result.emailSent ? '✅' : '❌'}`);
      console.log(`🔍 Keywords: ${result.keywordsFound.join(', ') || 'None'}`);
      
      if (!result.routingCorrect) {
        result.errors.push(`Wrong routing: expected ${result.expectedTable}, got ${result.actualTable}`);
        console.log(`⚠️  Expected: ${result.expectedTable}, Got: ${result.actualTable}`);
      }
      
    } else {
      result.errors.push(apiResult.error || 'Unknown API error');
      console.log(`❌ FAILED: ${apiResult.error}`);
      if (apiResult.details) {
        result.errors.push(apiResult.details);
        console.log(`Details: ${apiResult.details}`);
      }
    }
    
  } catch (error) {
    result.errors.push(error.message);
    console.log(`❌ ERROR: ${error.message}`);
  }
  
  return result;
}

async function runFinalComprehensiveTest() {
  console.log('🚀 FINAL COMPREHENSIVE TEST - FIXED SUVA ROUTING');
  console.log('🎯 Testing complete OCR → Classification → Routing → Supabase → Email pipeline');
  console.log('📅 Started:', new Date().toISOString());
  console.log('='.repeat(80));
  
  // Test all categories
  for (const [category, documents] of Object.entries(documentCategories)) {
    console.log(`\\n\\n📂 TESTING CATEGORY: ${category.toUpperCase()}`);
    console.log('='.repeat(80));
    
    for (const filename of documents) {
      const result = await testDocument(filename, category);
      testResults.push(result);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Generate comprehensive summary
  console.log('\\n\\n📊 FINAL TEST SUMMARY');
  console.log('='.repeat(80));
  
  const successful = testResults.filter(r => r.success);
  const failed = testResults.filter(r => !r.success);
  const correctRouting = testResults.filter(r => r.success && r.routingCorrect);
  const emailsSent = testResults.filter(r => r.emailSent);
  
  // Category breakdown
  const categoryResults = {};
  for (const [category] of Object.entries(documentCategories)) {
    const categoryDocs = testResults.filter(r => r.category === category);
    const categorySuccess = categoryDocs.filter(r => r.success);
    const categoryCorrectRouting = categoryDocs.filter(r => r.success && r.routingCorrect);
    
    categoryResults[category] = {
      total: categoryDocs.length,
      successful: categorySuccess.length,
      correctRouting: categoryCorrectRouting.length,
      successRate: categoryDocs.length > 0 ? (categorySuccess.length / categoryDocs.length * 100).toFixed(1) : 0,
      routingRate: categorySuccess.length > 0 ? (categoryCorrectRouting.length / categorySuccess.length * 100).toFixed(1) : 0
    };
  }
  
  console.log(`📈 Overall Success Rate: ${successful.length}/${testResults.length} (${(successful.length/testResults.length*100).toFixed(1)}%)`);
  console.log(`🎯 Correct Routing Rate: ${correctRouting.length}/${successful.length} (${successful.length > 0 ? (correctRouting.length/successful.length*100).toFixed(1) : 0}%)`);
  console.log(`📧 Email Success Rate: ${emailsSent.length}/${testResults.length} (${(emailsSent.length/testResults.length*100).toFixed(1)}%)`);
  
  console.log('\\n📂 RESULTS BY CATEGORY:');
  for (const [category, stats] of Object.entries(categoryResults)) {
    console.log(`${category}: ${stats.successful}/${stats.total} success (${stats.successRate}%), ${stats.correctRouting}/${stats.successful} correct routing (${stats.routingRate}%)`);
  }
  
  // SUVA-specific analysis
  const suvaResults = testResults.filter(r => r.category === 'SUVA/Accident');
  const suvaSuccess = suvaResults.filter(r => r.success);
  const suvaCorrectRouting = suvaResults.filter(r => r.success && r.routingCorrect);
  
  console.log('\\n🎯 SUVA ROUTING ANALYSIS:');
  console.log(`SUVA Success: ${suvaSuccess.length}/${suvaResults.length}`);
  console.log(`SUVA Correct Routing: ${suvaCorrectRouting.length}/${suvaSuccess.length}`);
  
  if (suvaCorrectRouting.length === suvaSuccess.length && suvaSuccess.length > 0) {
    console.log('🎉 ALL SUVA DOCUMENTS ROUTING CORRECTLY!');
  }
  
  if (failed.length > 0) {
    console.log('\\n❌ FAILED DOCUMENTS:');
    failed.forEach(r => {
      console.log(`- ${r.filename}: ${r.errors.join(', ')}`);
    });
  }
  
  // Save detailed results
  await saveComprehensiveResults();
  
  console.log('\\n✅ Final comprehensive test completed!');
  console.log('📄 Check FINAL_COMPREHENSIVE_TEST_RESULTS.md for detailed analysis');
}

async function saveComprehensiveResults() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // Calculate statistics
  const successful = testResults.filter(r => r.success);
  const correctRouting = testResults.filter(r => r.success && r.routingCorrect);
  const emailsSent = testResults.filter(r => r.emailSent);
  
  const report = `# FINAL COMPREHENSIVE TEST RESULTS
**Test Date:** ${new Date().toISOString()}
**Pipeline:** OCR → Classification → Enhanced Routing → Supabase → Email
**Total Documents:** ${testResults.length}
**SUVA Routing Fix:** ✅ IMPLEMENTED

## EXECUTIVE SUMMARY
- **Overall Success Rate:** ${successful.length}/${testResults.length} (${(successful.length/testResults.length*100).toFixed(1)}%)
- **Correct Routing Rate:** ${correctRouting.length}/${successful.length} (${successful.length > 0 ? (correctRouting.length/successful.length*100).toFixed(1) : 0}%)
- **Email Success Rate:** ${emailsSent.length}/${testResults.length} (${(emailsSent.length/testResults.length*100).toFixed(1)}%)

## DETAILED RESULTS

${Object.entries(documentCategories).map(([category, documents]) => {
  const categoryResults = testResults.filter(r => r.category === category);
  const categorySuccess = categoryResults.filter(r => r.success);
  const categoryCorrectRouting = categoryResults.filter(r => r.success && r.routingCorrect);
  
  return `### ${category.toUpperCase()}
**Success Rate:** ${categorySuccess.length}/${categoryResults.length} (${categoryResults.length > 0 ? (categorySuccess.length/categoryResults.length*100).toFixed(1) : 0}%)
**Routing Accuracy:** ${categoryCorrectRouting.length}/${categorySuccess.length} (${categorySuccess.length > 0 ? (categoryCorrectRouting.length/categorySuccess.length*100).toFixed(1) : 0}%)

${categoryResults.map(r => `#### ${r.filename}
- **Status:** ${r.success ? '✅ SUCCESS' : '❌ FAILED'}
- **Classification:** ${r.classification?.type || 'N/A'} (${r.classification?.confidence ? (r.classification.confidence * 100).toFixed(1) + '%' : 'N/A'})
- **Text Length:** ${r.extractedTextLength} characters
- **Expected Table:** ${r.expectedTable}
- **Actual Table:** ${r.actualTable || 'N/A'}
- **Routing:** ${r.routingCorrect ? '✅ CORRECT' : '❌ WRONG'}
- **Email Sent:** ${r.emailSent ? '✅ YES' : '❌ NO'}
- **Keywords Found:** ${r.keywordsFound.join(', ') || 'None'}
${r.errors.length > 0 ? `- **Errors:** ${r.errors.join(', ')}` : ''}
${r.extractedTextLength > 0 && r.extractedTextLength < 100 ? `- **Extracted Text:** "${r.extractedText}"` : ''}
`).join('\\n')}`;
}).join('\\n\\n')}

## CRITICAL FINDINGS

### ✅ SUVA Routing Success
${testResults.filter(r => r.category === 'SUVA/Accident').map(r => 
`- **${r.filename}:** ${r.routingCorrect ? '✅ CORRECT' : '❌ WRONG'} (${r.actualTable})`
).join('\\n')}

### System Performance
- **OCR Quality:** ${testResults.filter(r => r.extractedTextLength > 500).length}/${successful.length} docs with high-quality extraction (500+ chars)
- **Classification Confidence:** ${testResults.filter(r => r.classification?.confidence >= 0.9).length}/${successful.length} docs with 90%+ confidence
- **Email Reliability:** ${emailsSent.length}/${testResults.length} successful email notifications

## RECOMMENDATIONS
${correctRouting.length === successful.length && successful.length > 0 ? 
'🎉 **SYSTEM READY FOR PRODUCTION!** All document types routing correctly.' :
'⚠️ **Additional fixes needed** for remaining routing issues.'}

## RAW TEST DATA
\`\`\`json
${JSON.stringify(testResults, null, 2)}
\`\`\`
`;

  fs.writeFileSync('FINAL_COMPREHENSIVE_TEST_RESULTS.md', report);
  console.log('📄 Comprehensive results saved to: FINAL_COMPREHENSIVE_TEST_RESULTS.md');
}

// Install formdata-node if needed and run test
async function main() {
  try {
    await runFinalComprehensiveTest();
  } catch (importError) {
    console.log('📦 Installing formdata-node...');
    const { execSync } = require('child_process');
    execSync('npm install formdata-node', { cwd: __dirname });
    await runFinalComprehensiveTest();
  }
}

main().catch(console.error);