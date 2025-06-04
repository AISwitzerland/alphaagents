const fs = require('fs');
const path = require('path');

// Document test results
const testResults = [];

// Expected document types mapping
const expectedTypes = {
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
  'Schlechte Qualität Kopie 2.webp': 'miscellaneous_documents' // Known poor quality
};

async function testSingleDocument(filename) {
  console.log(`\\n🔍 Testing: ${filename}`);
  console.log('='.repeat(80));
  
  const filePath = path.join(__dirname, 'test-documents', filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filename}`);
    return null;
  }

  const result = {
    filename,
    fileSize: (fs.statSync(filePath).size / 1024).toFixed(1) + ' KB',
    expectedTable: expectedTypes[filename] || 'unknown',
    timestamp: new Date().toISOString(),
    success: false,
    extractedTextLength: 0,
    extractedText: '',
    classification: null,
    actualTable: null,
    documentId: null,
    recordId: null,
    emailSent: false,
    errors: []
  };

  try {
    // Read file and create FormData
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
    
    console.log(`📊 File: ${result.fileSize}, Expected: ${result.expectedTable}`);
    console.log('🤖 Processing with OCR Save API...');
    
    // Make request to save endpoint
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
      
      // Check if email was sent (assume success if no error mentioned)
      result.emailSent = !apiResult.data.emailError;
      
      console.log('✅ SUCCESS!');
      console.log(`📋 Classified as: ${result.classification.type}`);
      console.log(`📊 Confidence: ${((result.classification.confidence || 0) * 100).toFixed(1)}%`);
      console.log(`📝 Text Length: ${result.extractedTextLength} characters`);
      console.log(`💾 Document ID: ${result.documentId}`);
      console.log(`🏷️  Table: ${result.actualTable}`);
      console.log(`📧 Email Sent: ${result.emailSent ? '✅' : '❌'}`);
      
      // Verify correct routing
      const routingCorrect = result.actualTable === result.expectedTable;
      console.log(`🎯 Routing: ${routingCorrect ? '✅ CORRECT' : '❌ WRONG'} (Expected: ${result.expectedTable}, Got: ${result.actualTable})`);
      
      if (!routingCorrect) {
        result.errors.push(`Wrong table routing: expected ${result.expectedTable}, got ${result.actualTable}`);
      }
      
    } else {
      result.errors.push(apiResult.error || 'Unknown API error');
      console.log('❌ FAILED:', apiResult.error);
      if (apiResult.details) {
        console.log('Details:', apiResult.details);
        result.errors.push(apiResult.details);
      }
    }
    
  } catch (error) {
    result.errors.push(error.message);
    console.log('❌ ERROR:', error.message);
  }
  
  // Add delay between requests to avoid overwhelming the API
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return result;
}

async function runComprehensiveTest() {
  console.log('🚀 COMPREHENSIVE DOCUMENT TEST SUITE');
  console.log('🎯 Testing complete OCR → Supabase → Email pipeline');
  console.log('📅 Started:', new Date().toISOString());
  console.log('\\n');
  
  const testDocuments = [
    // SUVA/Accident documents (should go to accident_reports)
    'Suva1 Kopie 2.pdf',
    'Suva#2 Kopie 3.pdf',
    'ratenversicherung-unfall-de Kopie 2.pdf',
    
    // Cancellation documents (should go to contract_changes)
    'Kündigung Versicherung Kopie 2.pdf',
    'kuendigung-allianz Kopie 2.pdf',
    '1-vorlage-kuendigung-zusatzversicherung-krankenkasse-417657-de Kopie 2.docx',
    '2-vorlage-ordentliche-kuendigung-des-versicherungsvertrages-de Kopie 2.docx',
    '3-vorlage-kuendigung-im-schadensfall-de Kopie 2.docx',
    'vertragstrennung Kopie 2.pdf',
    
    // Damage reports (should go to damage_reports)
    'meldung-sturmschaden Kopie 2.pdf',
    
    // Miscellaneous documents  
    'meldeformular-kontoverbindung Kopie 2.pdf',
    
    // Poor quality test (known to fail)
    'Schlechte Qualität Kopie 2.webp'
  ];
  
  for (const filename of testDocuments) {
    const result = await testSingleDocument(filename);
    if (result) {
      testResults.push(result);
    }
  }
  
  // Generate summary
  console.log('\\n\\n📊 TEST SUMMARY');
  console.log('='.repeat(80));
  
  const successful = testResults.filter(r => r.success);
  const failed = testResults.filter(r => !r.success);
  const correctRouting = testResults.filter(r => r.success && r.actualTable === r.expectedTable);
  const emailsSent = testResults.filter(r => r.emailSent);
  
  console.log(`📈 Success Rate: ${successful.length}/${testResults.length} (${(successful.length/testResults.length*100).toFixed(1)}%)`);
  console.log(`🎯 Correct Routing: ${correctRouting.length}/${successful.length} (${successful.length > 0 ? (correctRouting.length/successful.length*100).toFixed(1) : 0}%)`);
  console.log(`📧 Email Success: ${emailsSent.length}/${testResults.length} (${(emailsSent.length/testResults.length*100).toFixed(1)}%)`);
  
  if (failed.length > 0) {
    console.log('\\n❌ FAILED DOCUMENTS:');
    failed.forEach(r => {
      console.log(`- ${r.filename}: ${r.errors.join(', ')}`);
    });
  }
  
  // Save detailed results
  await saveDetailedResults();
  
  console.log('\\n✅ Test completed! Check individual result files for details.');
}

async function saveDetailedResults() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const summaryFile = `test-results-summary-${timestamp}.json`;
  
  // Save summary JSON
  fs.writeFileSync(summaryFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalDocuments: testResults.length,
    successful: testResults.filter(r => r.success).length,
    correctRouting: testResults.filter(r => r.success && r.actualTable === r.expectedTable).length,
    emailsSent: testResults.filter(r => r.emailSent).length,
    results: testResults
  }, null, 2));
  
  console.log(`💾 Summary saved: ${summaryFile}`);
  
  // Save individual detailed reports
  for (const result of testResults) {
    const safeFilename = result.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const detailFile = `test-result-${safeFilename}-${timestamp}.md`;
    
    const report = `# Test Report: ${result.filename}

## Document Information
- **Filename:** ${result.filename}
- **File Size:** ${result.fileSize}
- **Test Time:** ${result.timestamp}
- **Expected Table:** ${result.expectedTable}

## Results
- **Success:** ${result.success ? '✅ YES' : '❌ NO'}
- **Document ID:** ${result.documentId || 'None'}
- **Record ID:** ${result.recordId || 'None'}
- **Actual Table:** ${result.actualTable || 'None'}
- **Email Sent:** ${result.emailSent ? '✅ YES' : '❌ NO'}
- **Routing Correct:** ${result.success && result.actualTable === result.expectedTable ? '✅ YES' : '❌ NO'}

## OCR Classification
- **Type:** ${result.classification?.type || 'None'}
- **Category:** ${result.classification?.category || 'None'}
- **Confidence:** ${result.classification?.confidence ? (result.classification.confidence * 100).toFixed(1) + '%' : 'None'}
- **Summary:** ${result.classification?.summary || 'None'}

## Text Extraction
- **Text Length:** ${result.extractedTextLength} characters
${result.extractedTextLength > 0 ? `
### Extracted Text
\`\`\`
${result.extractedText.substring(0, 2000)}${result.extractedText.length > 2000 ? '...' : ''}
\`\`\`
` : ''}

## Errors
${result.errors.length > 0 ? result.errors.map(e => `- ${e}`).join('\\n') : 'None'}

## Analysis
${result.success ? 
  result.actualTable === result.expectedTable ? 
    '✅ **Perfect Success**: Document processed correctly, routed to expected table, and email sent.' :
    '⚠️ **Partial Success**: Document processed but routed to wrong table.' :
  '❌ **Failed**: Document processing failed.'}
`;
    
    fs.writeFileSync(detailFile, report);
  }
  
  console.log(`📄 Individual reports saved for ${testResults.length} documents`);
}

// Install formdata-node if needed and run test
async function main() {
  try {
    await runComprehensiveTest();
  } catch (importError) {
    console.log('📦 Installing formdata-node...');
    const { execSync } = require('child_process');
    execSync('npm install formdata-node', { cwd: __dirname });
    await runComprehensiveTest();
  }
}

main().catch(console.error);