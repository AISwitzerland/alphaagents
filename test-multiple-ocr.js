const fs = require('fs');
const path = require('path');

async function testMultipleOCR() {
  console.log('🚀 Testing OCR with multiple documents...');
  
  // Test specific documents
  const testFiles = [
    'Bildschirmfoto 2024-11-02 um 13.32.43 Kopie 2.png', // UVG form
    'Kündigung Versicherung Kopie 2.pdf', // Kündigung
    'Suva1 Kopie 2.pdf', // Another Suva document
    'Schlechte Qualität Kopie 2.webp' // Low quality test
  ];
  
  const results = [];
  
  for (const filename of testFiles) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🔍 Testing: ${filename}`);
    console.log(`${'='.repeat(80)}`);
    
    const filePath = path.join(__dirname, 'test-documents', filename);
    
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filename}`);
        continue;
      }
      
      const fileBuffer = fs.readFileSync(filePath);
      const fileSize = (fs.statSync(filePath).size / 1024).toFixed(1);
      
      console.log(`📄 File size: ${fileSize} KB`);
      console.log(`🤖 Processing...`);
      
      const FormData = (await import('formdata-node')).FormData;
      const formData = new FormData();
      
      const mimeType = getMimeType(filename);
      formData.append('file', new Blob([fileBuffer], { type: mimeType }), filename);
      
      const startTime = Date.now();
      const response = await fetch('http://localhost:3000/api/ocr-debug', {
        method: 'POST',
        body: formData
      });
      
      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ HTTP Error ${response.status}: ${errorText}`);
        results.push({
          filename,
          success: false,
          error: `HTTP ${response.status}`,
          processingTime: responseTime
        });
        continue;
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const data = result.data;
        
        console.log(`✅ SUCCESS!`);
        console.log(`📋 Type: ${data.classification?.type || 'Unknown'}`);
        console.log(`📊 Confidence: ${((data.classification?.confidence || 0) * 100).toFixed(1)}%`);
        console.log(`📝 Text: ${data.extractedText?.length || 0} chars`);
        console.log(`⏱️  Time: ${data.processingTime || responseTime}ms`);
        
        // Show first few lines of text
        const text = data.extractedText || '';
        const firstLines = text.split('\n').slice(0, 3).join('\n');
        console.log(`📄 Preview: ${firstLines.substring(0, 100)}...`);
        
        // Key findings
        const keyFields = data.classification?.keyFields || {};
        if (Object.keys(keyFields).length > 0) {
          console.log(`🔑 Key fields: ${Object.keys(keyFields).join(', ')}`);
        }
        
        results.push({
          filename,
          success: true,
          type: data.classification?.type,
          confidence: data.classification?.confidence,
          textLength: text.length,
          processingTime: data.processingTime || responseTime,
          keyFields: Object.keys(keyFields).length
        });
        
      } else {
        console.log(`❌ Processing failed: ${result.error || 'Unknown error'}`);
        results.push({
          filename,
          success: false,
          error: result.error || 'Processing failed',
          processingTime: responseTime
        });
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      results.push({
        filename,
        success: false,
        error: error.message,
        processingTime: 0
      });
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary report
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📊 SUMMARY REPORT`);
  console.log(`${'='.repeat(80)}`);
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\n📈 Results:`);
  console.log(`  Total: ${results.length}`);
  console.log(`  Success: ${successful.length} (${((successful.length/results.length)*100).toFixed(1)}%)`);
  console.log(`  Failed: ${failed.length} (${((failed.length/results.length)*100).toFixed(1)}%)`);
  
  if (successful.length > 0) {
    const avgTime = successful.reduce((sum, r) => sum + r.processingTime, 0) / successful.length;
    const avgConfidence = successful.reduce((sum, r) => sum + (r.confidence || 0), 0) / successful.length;
    const avgTextLength = successful.reduce((sum, r) => sum + (r.textLength || 0), 0) / successful.length;
    
    console.log(`\n⚡ Performance:`);
    console.log(`  Avg processing time: ${avgTime.toFixed(0)}ms`);
    console.log(`  Avg confidence: ${(avgConfidence * 100).toFixed(1)}%`);
    console.log(`  Avg text length: ${avgTextLength.toFixed(0)} chars`);
  }
  
  // Document types
  const types = {};
  successful.forEach(r => {
    if (r.type) {
      types[r.type] = (types[r.type] || 0) + 1;
    }
  });
  
  if (Object.keys(types).length > 0) {
    console.log(`\n📋 Document types detected:`);
    Object.entries(types).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  }
  
  console.log(`\n📄 Detailed results:`);
  results.forEach((r, i) => {
    console.log(`\n${i+1}. ${r.filename}`);
    if (r.success) {
      console.log(`   ✅ ${r.type} (${((r.confidence || 0) * 100).toFixed(1)}% confidence)`);
      console.log(`   📝 ${r.textLength} chars, ${r.keyFields} key fields`);
      console.log(`   ⏱️  ${r.processingTime}ms`);
    } else {
      console.log(`   ❌ ${r.error}`);
      console.log(`   ⏱️  ${r.processingTime}ms`);
    }
  });
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Run the test
testMultipleOCR().catch(console.error);