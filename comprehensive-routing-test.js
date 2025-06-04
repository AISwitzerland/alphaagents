const fs = require('fs');
const path = require('path');

/**
 * Comprehensive OCR Routing Test
 * Tests all document types with the fixed routing system
 */

const testDocuments = [
  // SUVA/Accident Reports (should go to accident_reports)
  'Suva1 Kopie 2.pdf',
  'Suva2 Kopie 3.pdf',
  
  // Cancellation Documents (should go to contract_changes)
  '1-vorlage-kuendigung-zusatzversicherung-krankenkasse-417657-de Kopie 2.docx',
  '1-vorlage-widerrufsrecht-aufgrund-informationspflichtverletzung-des-versicherers-de Kopie 2.docx',
  '2-vorlage-ordentliche-kuendigung-des-versicherungsvertrages-de Kopie 2.docx',
  '3-vorlage-kuendigung-im-schadensfall-de Kopie 2.docx',
  'Kündigung Versicherung Kopie 2.pdf',
  'kuendigung-allianz Kopie 2.pdf',
  'vertragstrennung Kopie 2.pdf',
  
  // Damage Reports (should go to damage_reports)
  'meldung-sturmschaden Kopie 2.pdf',
  
  // Insurance Information (should go to miscellaneous_documents)
  'ratenversicherung-unfall-de Kopie 2.pdf',
  'meldeformular-kontoverbindung Kopie 2.pdf',
  
  // Screenshots/Images (should go to miscellaneous_documents)
  'Bildschirmfoto 2024-11-02 um 13.32.43 Kopie 2.png',
  'Bildschirmfoto 2024-12-16 um 20.00.31 Kopie 2.png',
  'Bildschirmfoto 2025-01-05 um 21.03.04 Kopie 2.png',
  'Bildschirmfoto 2025-01-05 um 21.03.54 Kopie 2.png',
  'Bildschirmfoto 2025-01-08 um 19.49.28 Kopie 3.png',
  'Bildschirmfoto 2025-02-16 um 22.27.10 Kopie 2.png',
  'Bildschirmfoto 2025-02-16 um 22.30.16 Kopie 2.png',
  'Schlechte Qualität Kopie 2.webp'
];

const expectedRouting = {
  // SUVA/Accident Reports
  'Suva1 Kopie 2.pdf': 'accident_reports',
  'Suva2 Kopie 3.pdf': 'accident_reports',
  
  // Contract Changes/Cancellations
  '1-vorlage-kuendigung-zusatzversicherung-krankenkasse-417657-de Kopie 2.docx': 'contract_changes',
  '1-vorlage-widerrufsrecht-aufgrund-informationspflichtverletzung-des-versicherers-de Kopie 2.docx': 'contract_changes',
  '2-vorlage-ordentliche-kuendigung-des-versicherungsvertrages-de Kopie 2.docx': 'contract_changes',
  '3-vorlage-kuendigung-im-schadensfall-de Kopie 2.docx': 'contract_changes',
  'Kündigung Versicherung Kopie 2.pdf': 'contract_changes',
  'kuendigung-allianz Kopie 2.pdf': 'contract_changes',
  'vertragstrennung Kopie 2.pdf': 'contract_changes',
  
  // Damage Reports
  'meldung-sturmschaden Kopie 2.pdf': 'damage_reports',
  
  // Miscellaneous
  'ratenversicherung-unfall-de Kopie 2.pdf': 'miscellaneous_documents',
  'meldeformular-kontoverbindung Kopie 2.pdf': 'miscellaneous_documents',
  'Bildschirmfoto 2024-11-02 um 13.32.43 Kopie 2.png': 'miscellaneous_documents',
  'Bildschirmfoto 2024-12-16 um 20.00.31 Kopie 2.png': 'miscellaneous_documents',
  'Bildschirmfoto 2025-01-05 um 21.03.04 Kopie 2.png': 'miscellaneous_documents',
  'Bildschirmfoto 2025-01-05 um 21.03.54 Kopie 2.png': 'miscellaneous_documents',
  'Bildschirmfoto 2025-01-08 um 19.49.28 Kopie 3.png': 'miscellaneous_documents',
  'Bildschirmfoto 2025-02-16 um 22.27.10 Kopie 2.png': 'miscellaneous_documents',
  'Bildschirmfoto 2025-02-16 um 22.30.16 Kopie 2.png': 'miscellaneous_documents',
  'Schlechte Qualität Kopie 2.webp': 'miscellaneous_documents'
};

async function testDocument(filename) {
  const filePath = path.join(__dirname, 'test-documents', filename);
  
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return {
        filename,
        status: 'error',
        error: 'File not found',
        expected: expectedRouting[filename],
        actual: null,
        correct: false
      };
    }
    
    console.log(`\n🧪 Testing: ${filename}`);
    console.log(`📊 File size: ${(fs.statSync(filePath).size / 1024).toFixed(1)} KB`);
    console.log(`🎯 Expected table: ${expectedRouting[filename]}`);
    
    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Create FormData manually
    const FormData = (await import('formdata-node')).FormData;
    const formData = new FormData();
    
    // Add file to form data  
    formData.append('file', new Blob([fileBuffer], { 
      type: getContentType(filename) 
    }), filename);
    
    console.log('🚀 Sending to OCR SAVE API...');
    
    // Make request to SAVE endpoint
    const response = await fetch('http://localhost:3000/api/ocr-save', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        filename,
        status: 'error',
        error: `HTTP ${response.status}: ${errorText}`,
        expected: expectedRouting[filename],
        actual: null,
        correct: false
      };
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      const actualTable = result.data.supabaseUrl?.split('/').pop() || 'Unknown';
      const expectedTable = expectedRouting[filename];
      const isCorrect = actualTable === expectedTable;
      
      console.log(`✅ OCR SAVE SUCCESS!`);
      console.log(`📋 Document Type: ${result.data.ocrResult?.classification?.type || 'Unknown'}`);
      console.log(`📊 Confidence: ${((result.data.ocrResult?.classification?.confidence || 0) * 100).toFixed(1)}%`);
      console.log(`🏷️  Actual Table: ${actualTable}`);
      console.log(`🎯 Expected Table: ${expectedTable}`);
      console.log(`${isCorrect ? '✅' : '❌'} Routing ${isCorrect ? 'CORRECT' : 'INCORRECT'}`);
      
      return {
        filename,
        status: 'success',
        documentType: result.data.ocrResult?.classification?.type || 'Unknown',
        confidence: (result.data.ocrResult?.classification?.confidence || 0) * 100,
        textLength: result.data.ocrResult?.extractedText?.length || 0,
        summary: result.data.ocrResult?.classification?.summary || '',
        expected: expectedTable,
        actual: actualTable,
        correct: isCorrect,
        documentId: result.data.documentRecord?.id || null,
        specificRecord: !!result.data.specificRecord
      };
      
    } else {
      return {
        filename,
        status: 'error',
        error: result.error || 'Unknown error',
        expected: expectedRouting[filename],
        actual: null,
        correct: false
      };
    }
    
  } catch (error) {
    console.error(`❌ Error testing ${filename}:`, error.message);
    return {
      filename,
      status: 'error',
      error: error.message,
      expected: expectedRouting[filename],
      actual: null,
      correct: false
    };
  }
}

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

async function runComprehensiveTest() {
  console.log('🚀 COMPREHENSIVE OCR ROUTING TEST');
  console.log('=' + '='.repeat(50));
  console.log(`📅 Test Date: ${new Date().toISOString()}`);
  console.log(`📊 Total Documents: ${testDocuments.length}`);
  console.log('=' + '='.repeat(50));
  
  const results = [];
  const startTime = Date.now();
  
  for (let i = 0; i < testDocuments.length; i++) {
    const filename = testDocuments[i];
    console.log(`\n[${i + 1}/${testDocuments.length}] ${filename}`);
    
    const result = await testDocument(filename);
    results.push(result);
    
    // Add delay between requests to avoid overwhelming the server
    if (i < testDocuments.length - 1) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  const endTime = Date.now();
  const totalTime = ((endTime - startTime) / 1000 / 60).toFixed(1);
  
  // Generate summary
  const summary = generateSummary(results, totalTime);
  
  // Save results to file
  const reportData = {
    timestamp: new Date().toISOString(),
    testDuration: totalTime,
    summary,
    results
  };
  
  const filename = `COMPREHENSIVE_ROUTING_TEST_RESULTS_${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(filename, JSON.stringify(reportData, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPREHENSIVE TEST COMPLETED');
  console.log('='.repeat(60));
  console.log(summary);
  console.log(`\n📄 Detailed results saved to: ${filename}`);
  console.log('='.repeat(60));
  
  return results;
}

function generateSummary(results, totalTime) {
  const total = results.length;
  const successful = results.filter(r => r.status === 'success').length;
  const errors = results.filter(r => r.status === 'error').length;
  const correctRouting = results.filter(r => r.correct === true).length;
  const incorrectRouting = results.filter(r => r.status === 'success' && r.correct === false).length;
  
  // Group by table
  const tableStats = {};
  results.forEach(r => {
    if (r.status === 'success') {
      const table = r.actual;
      if (!tableStats[table]) {
        tableStats[table] = { correct: 0, incorrect: 0 };
      }
      if (r.correct) {
        tableStats[table].correct++;
      } else {
        tableStats[table].incorrect++;
      }
    }
  });
  
  const summary = `
📊 TEST SUMMARY:
  Total Documents: ${total}
  Successful OCR: ${successful} (${((successful/total)*100).toFixed(1)}%)
  Errors: ${errors} (${((errors/total)*100).toFixed(1)}%)
  
🎯 ROUTING ACCURACY:
  Correct Routing: ${correctRouting}/${successful} (${successful > 0 ? ((correctRouting/successful)*100).toFixed(1) : 0}%)
  Incorrect Routing: ${incorrectRouting}/${successful} (${successful > 0 ? ((incorrectRouting/successful)*100).toFixed(1) : 0}%)
  
📋 TABLE DISTRIBUTION:
${Object.entries(tableStats).map(([table, stats]) => 
  `  ${table}: ${stats.correct + stats.incorrect} documents (${stats.correct} correct, ${stats.incorrect} incorrect)`
).join('\n')}

⏱️ Total Test Time: ${totalTime} minutes

🎯 ROUTING SUCCESS RATE: ${successful > 0 ? ((correctRouting/successful)*100).toFixed(1) : 0}%
`;

  return summary;
}

// Install formdata-node if needed and run test
async function main() {
  try {
    // Check if formdata-node is available
    try {
      await import('formdata-node');
    } catch (e) {
      console.log('📦 Installing formdata-node...');
      const { execSync } = require('child_process');
      execSync('npm install formdata-node', { stdio: 'inherit' });
    }
    
    await runComprehensiveTest();
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  }
}

main();