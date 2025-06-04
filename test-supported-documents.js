const fs = require('fs');
const path = require('path');

async function testSupportedDocuments() {
  console.log('🚀 COMPREHENSIVE OCR TEST - SUPPORTED FORMATS ONLY');
  console.log('='.repeat(80));
  
  const testDocumentsPath = path.join(__dirname, 'test-documents');
  const files = fs.readdirSync(testDocumentsPath);
  
  // Filter to supported image and PDF formats only (exclude DOCX for now)
  const supportedFiles = files.filter(file => 
    /\.(pdf|png|jpg|jpeg|webp)$/i.test(file)
  );
  
  console.log(`📋 Found ${supportedFiles.length} supported documents (PDF, PNG, JPG, WebP)`);
  console.log(`📂 Testing files in: ${testDocumentsPath}\n`);
  
  const results = [];
  let totalStartTime = Date.now();
  
  for (let i = 0; i < supportedFiles.length; i++) {
    const filename = supportedFiles[i];
    const filePath = path.join(testDocumentsPath, filename);
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📄 [${i+1}/${supportedFiles.length}] Testing: ${filename}`);
    console.log(`${'='.repeat(80)}`);
    
    let startTime = Date.now();
    
    try {
      // File info
      const stats = fs.statSync(filePath);
      const fileSizeKB = (stats.size / 1024).toFixed(1);
      console.log(`📊 File size: ${fileSizeKB} KB`);
      console.log(`📅 Modified: ${stats.mtime.toISOString().split('T')[0]}`);
      
      // Read file
      const fileBuffer = fs.readFileSync(filePath);
      console.log(`🤖 Processing with optimized OCR...`);
      
      // Prepare FormData
      const FormData = (await import('formdata-node')).FormData;
      const formData = new FormData();
      
      const mimeType = getMimeType(filename);
      formData.append('file', new Blob([fileBuffer], { type: mimeType }), filename);
      
      // Send to OCR API
      startTime = Date.now();
      const response = await fetch('http://localhost:3000/api/ocr-debug', {
        method: 'POST',
        body: formData
      });
      
      const processingTime = Date.now() - startTime;
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 300)}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const data = result.data;
        const textLength = data.extractedText?.length || 0;
        const wordCount = data.extractedText ? data.extractedText.split(/\s+/).length : 0;
        
        // Success result
        console.log(`✅ SUCCESS!`);
        console.log(`📋 Document Type: ${data.classification?.type || 'Unknown'}`);
        console.log(`📊 Confidence: ${((data.classification?.confidence || 0) * 100).toFixed(1)}%`);
        console.log(`📝 Text: ${textLength} chars, ${wordCount} words`);
        console.log(`⏱️  Processing: ${processingTime}ms`);
        
        // Key fields summary
        const keyFields = data.classification?.keyFields || {};
        const keyFieldCount = Object.keys(keyFields).length;
        console.log(`🔑 Key fields (${keyFieldCount}): ${Object.keys(keyFields).slice(0, 4).join(', ')}${keyFieldCount > 4 ? '...' : ''}`);
        
        // Show extracted structured data preview
        const importantFields = ['person_name', 'document_number', 'document_date', 'amount', 'ahv_number', 'phone_number'];
        const foundImportant = importantFields.filter(field => 
          keyFields[field] && 
          keyFields[field] !== null && 
          keyFields[field] !== 'Nicht angegeben' &&
          keyFields[field] !== 'null'
        );
        if (foundImportant.length > 0) {
          console.log(`🎯 Important data: ${foundImportant.map(f => `${f}=${keyFields[f]}`).join(', ')}`);
        }
        
        // Preview text (first 150 chars, clean)
        if (data.extractedText) {
          const preview = data.extractedText
            .substring(0, 150)
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          console.log(`📄 Preview: "${preview}${textLength > 150 ? '...' : ''}"`);
        }
        
        // Store result
        results.push({
          filename,
          success: true,
          type: data.classification?.type || 'Unknown',
          category: data.classification?.category || 'Unknown',
          confidence: data.classification?.confidence || 0,
          textLength,
          wordCount,
          keyFieldCount,
          processingTime,
          fileSize: stats.size,
          importantFields: foundImportant,
          keyFieldsData: keyFields
        });
        
      } else {
        throw new Error(result.error || 'OCR processing failed');
      }
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.log(`❌ FAILED: ${error.message.substring(0, 200)}`);
      
      results.push({
        filename,
        success: false,
        error: error.message,
        processingTime,
        fileSize: fs.statSync(filePath).size
      });
    }
    
    // Small delay between requests
    if (i < supportedFiles.length - 1) {
      console.log(`⏸️  Pausing 2 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  const totalTime = Date.now() - totalStartTime;
  
  // Generate comprehensive report
  generateDetailedReport(results, totalTime);
}

function generateDetailedReport(results, totalTime) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📊 FINAL OCR PERFORMANCE REPORT`);
  console.log(`${'='.repeat(80)}`);
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const successRate = (successful.length / results.length) * 100;
  
  console.log(`\n🎯 EXECUTIVE SUMMARY:`);
  console.log(`  Documents tested: ${results.length}`);
  console.log(`  Success rate: ${successful.length}/${results.length} (${successRate.toFixed(1)}%)`);
  console.log(`  Total time: ${(totalTime / 1000 / 60).toFixed(1)} minutes`);
  console.log(`  Avg per doc: ${(totalTime / results.length / 1000).toFixed(1)} seconds`);
  
  if (successful.length > 0) {
    const avgProcessingTime = successful.reduce((sum, r) => sum + r.processingTime, 0) / successful.length;
    const avgConfidence = successful.reduce((sum, r) => sum + r.confidence, 0) / successful.length;
    const avgTextLength = successful.reduce((sum, r) => sum + r.textLength, 0) / successful.length;
    const avgKeyFields = successful.reduce((sum, r) => sum + r.keyFieldCount, 0) / successful.length;
    
    console.log(`\n⚡ PERFORMANCE METRICS:`);
    console.log(`  Avg processing: ${(avgProcessingTime / 1000).toFixed(1)}s per document`);
    console.log(`  Avg confidence: ${(avgConfidence * 100).toFixed(1)}%`);
    console.log(`  Avg text extracted: ${avgTextLength.toFixed(0)} characters`);
    console.log(`  Avg key fields: ${avgKeyFields.toFixed(1)} per document`);
    
    // Confidence analysis
    const highConf = successful.filter(r => r.confidence >= 0.9).length;
    const medConf = successful.filter(r => r.confidence >= 0.7 && r.confidence < 0.9).length;
    const lowConf = successful.filter(r => r.confidence < 0.7).length;
    
    console.log(`\n🎯 CONFIDENCE ANALYSIS:`);
    console.log(`  High confidence (≥90%): ${highConf}/${successful.length} (${(highConf/successful.length*100).toFixed(1)}%)`);
    console.log(`  Medium confidence (70-89%): ${medConf}/${successful.length} (${(medConf/successful.length*100).toFixed(1)}%)`);
    console.log(`  Low confidence (<70%): ${lowConf}/${successful.length} (${(lowConf/successful.length*100).toFixed(1)}%)`);
  }
  
  // Document type distribution
  const typeStats = {};
  successful.forEach(r => {
    typeStats[r.type] = (typeStats[r.type] || 0) + 1;
  });
  
  console.log(`\n📋 DOCUMENT CLASSIFICATION:`);
  Object.entries(typeStats)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      const percentage = (count / successful.length * 100).toFixed(1);
      console.log(`  ${type}: ${count} docs (${percentage}%)`);
    });
  
  // Data extraction success
  const docsWithImportantData = successful.filter(r => r.importantFields && r.importantFields.length > 0);
  console.log(`\n🎯 DATA EXTRACTION SUCCESS:`);
  console.log(`  Documents with structured data: ${docsWithImportantData.length}/${successful.length} (${(docsWithImportantData.length/successful.length*100).toFixed(1)}%)`);
  
  // Most common extracted fields
  const fieldStats = {};
  successful.forEach(r => {
    if (r.importantFields) {
      r.importantFields.forEach(field => {
        fieldStats[field] = (fieldStats[field] || 0) + 1;
      });
    }
  });
  
  if (Object.keys(fieldStats).length > 0) {
    console.log(`\n🔑 MOST EXTRACTED FIELDS:`);
    Object.entries(fieldStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .forEach(([field, count]) => {
        const percentage = (count / successful.length * 100).toFixed(1);
        console.log(`  ${field}: ${count} docs (${percentage}%)`);
      });
  }
  
  // File format performance
  const formatStats = {};
  results.forEach(r => {
    const ext = path.extname(r.filename).toLowerCase();
    if (!formatStats[ext]) {
      formatStats[ext] = { total: 0, successful: 0, avgTime: 0, totalTime: 0 };
    }
    formatStats[ext].total++;
    if (r.success) {
      formatStats[ext].successful++;
      formatStats[ext].totalTime += r.processingTime;
    }
  });
  
  Object.keys(formatStats).forEach(ext => {
    if (formatStats[ext].successful > 0) {
      formatStats[ext].avgTime = formatStats[ext].totalTime / formatStats[ext].successful;
    }
  });
  
  console.log(`\n📁 FORMAT PERFORMANCE:`);
  Object.entries(formatStats).forEach(([ext, stats]) => {
    const successRate = (stats.successful / stats.total * 100).toFixed(1);
    const avgTime = stats.avgTime > 0 ? `${(stats.avgTime / 1000).toFixed(1)}s avg` : '';
    console.log(`  ${ext}: ${stats.successful}/${stats.total} (${successRate}%) ${avgTime}`);
  });
  
  // Failure analysis
  if (failed.length > 0) {
    console.log(`\n❌ FAILURE ANALYSIS:`);
    failed.forEach(f => {
      console.log(`  ${f.filename}: ${f.error.substring(0, 100)}`);
    });
  }
  
  // Top performing documents
  console.log(`\n🏆 TOP PERFORMING DOCUMENTS:`);
  successful
    .sort((a, b) => (b.confidence * b.keyFieldCount) - (a.confidence * a.keyFieldCount))
    .slice(0, 5)
    .forEach((r, i) => {
      console.log(`  ${i+1}. ${r.filename.substring(0, 40)}... - ${(r.confidence*100).toFixed(1)}% conf, ${r.keyFieldCount} fields`);
    });
  
  // Save detailed report
  const reportData = {
    timestamp: new Date().toISOString(),
    testSummary: {
      documentsTotal: results.length,
      successful: successful.length,
      failed: failed.length,
      successRate: successRate,
      totalProcessingTimeMs: totalTime,
      avgProcessingTimeMs: successful.length > 0 ? successful.reduce((sum, r) => sum + r.processingTime, 0) / successful.length : 0,
      avgConfidence: successful.length > 0 ? successful.reduce((sum, r) => sum + r.confidence, 0) / successful.length : 0,
      avgTextLength: successful.length > 0 ? successful.reduce((sum, r) => sum + r.textLength, 0) / successful.length : 0,
      avgKeyFields: successful.length > 0 ? successful.reduce((sum, r) => sum + r.keyFieldCount, 0) / successful.length : 0
    },
    typeStatistics: typeStats,
    fieldStatistics: fieldStats,
    formatStatistics: formatStats,
    confidenceDistribution: {
      high: successful.filter(r => r.confidence >= 0.9).length,
      medium: successful.filter(r => r.confidence >= 0.7 && r.confidence < 0.9).length,
      low: successful.filter(r => r.confidence < 0.7).length
    },
    detailedResults: results
  };
  
  const reportPath = path.join(__dirname, 'final-ocr-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  
  console.log(`\n💾 Detailed report saved: ${reportPath}`);
  console.log(`🎉 OCR Testing Complete! Success rate: ${successRate.toFixed(1)}%`);
  console.log(`${'='.repeat(80)}`);
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Run the test
testSupportedDocuments().catch(console.error);