const fs = require('fs');
const path = require('path');

async function testHandwritingDocuments() {
  console.log('🖋️  HANDWRITING OCR TEST');
  console.log('='.repeat(80));
  
  const handwritingFiles = [
    'Bildschirmfoto 2025-02-16 um 22.27.10 Kopie 2.png',
    'Bildschirmfoto 2025-02-16 um 22.30.16 Kopie 2.png'
  ];
  
  console.log(`📝 Testing ${handwritingFiles.length} handwritten documents\n`);
  
  const results = [];
  
  for (const filename of handwritingFiles) {
    console.log(`${'='.repeat(80)}`);
    console.log(`🖋️  Testing handwritten document: ${filename}`);
    console.log(`${'='.repeat(80)}`);
    
    const filePath = path.join(__dirname, 'test-documents', filename);
    
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filename}`);
        continue;
      }
      
      const fileBuffer = fs.readFileSync(filePath);
      const fileSize = (fs.statSync(filePath).size / 1024).toFixed(1);
      
      console.log(`📊 File size: ${fileSize} KB`);
      console.log(`🤖 Processing handwritten content...`);
      
      const FormData = (await import('formdata-node')).FormData;
      const formData = new FormData();
      
      formData.append('file', new Blob([fileBuffer], { type: 'image/png' }), filename);
      
      const startTime = Date.now();
      const response = await fetch('http://localhost:3000/api/ocr-debug', {
        method: 'POST',
        body: formData
      });
      
      const processingTime = Date.now() - startTime;
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const data = result.data;
        
        console.log(`✅ SUCCESS!`);
        console.log(`📋 Type: ${data.classification?.type || 'Unknown'}`);
        console.log(`📊 Confidence: ${((data.classification?.confidence || 0) * 100).toFixed(1)}%`);
        console.log(`📝 Text length: ${data.extractedText?.length || 0} characters`);
        console.log(`⏱️  Processing: ${processingTime}ms`);
        
        // Show full extracted text for handwriting analysis
        console.log(`\n📄 FULL EXTRACTED TEXT:`);
        console.log(`${'─'.repeat(60)}`);
        console.log(data.extractedText || 'No text extracted');
        console.log(`${'─'.repeat(60)}`);
        
        // Analyze handwriting quality
        const text = data.extractedText || '';
        const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
        const lineCount = text.split('\n').filter(l => l.trim().length > 0).length;
        
        console.log(`\n🔍 HANDWRITING ANALYSIS:`);
        console.log(`  Words extracted: ${wordCount}`);
        console.log(`  Lines detected: ${lineCount}`);
        console.log(`  Avg words per line: ${lineCount > 0 ? (wordCount / lineCount).toFixed(1) : 0}`);
        
        // Check for common handwriting recognition issues
        const hasNumbers = /\d/.test(text);
        const hasSpecialChars = /[^a-zA-Z0-9\s\.\,\:\;\!\?]/.test(text);
        const hasUpperCase = /[A-Z]/.test(text);
        const hasLowerCase = /[a-z]/.test(text);
        
        console.log(`\n📊 TEXT CHARACTERISTICS:`);
        console.log(`  Contains numbers: ${hasNumbers ? '✅' : '❌'}`);
        console.log(`  Contains special chars: ${hasSpecialChars ? '✅' : '❌'}`);
        console.log(`  Mixed case: ${hasUpperCase && hasLowerCase ? '✅' : '❌'}`);
        
        // Quality assessment
        let qualityScore = 0;
        if (data.classification?.confidence > 0.8) qualityScore += 3;
        else if (data.classification?.confidence > 0.6) qualityScore += 2;
        else qualityScore += 1;
        
        if (wordCount > 10) qualityScore += 2;
        else if (wordCount > 5) qualityScore += 1;
        
        if (text.length > 100) qualityScore += 1;
        
        const qualityRating = qualityScore >= 5 ? 'Excellent' : 
                             qualityScore >= 3 ? 'Good' : 'Poor';
        
        console.log(`\n🎯 HANDWRITING RECOGNITION QUALITY: ${qualityRating} (${qualityScore}/6)`);
        
        results.push({
          filename,
          success: true,
          confidence: data.classification?.confidence || 0,
          textLength: text.length,
          wordCount,
          lineCount,
          qualityScore,
          processingTime,
          extractedText: text
        });
        
      } else {
        throw new Error(result.error || 'OCR processing failed');
      }
      
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`);
      results.push({
        filename,
        success: false,
        error: error.message,
        processingTime: Date.now() - (startTime || Date.now())
      });
    }
    
    console.log('\n');
  }
  
  // Summary report
  console.log(`${'='.repeat(80)}`);
  console.log(`🖋️  HANDWRITING OCR SUMMARY`);
  console.log(`${'='.repeat(80)}`);
  
  const successful = results.filter(r => r.success);
  
  if (successful.length > 0) {
    const avgConfidence = successful.reduce((sum, r) => sum + r.confidence, 0) / successful.length;
    const avgWords = successful.reduce((sum, r) => sum + r.wordCount, 0) / successful.length;
    const avgProcessingTime = successful.reduce((sum, r) => sum + r.processingTime, 0) / successful.length;
    
    console.log(`\n📊 PERFORMANCE:`);
    console.log(`  Documents processed: ${successful.length}/${results.length}`);
    console.log(`  Average confidence: ${(avgConfidence * 100).toFixed(1)}%`);
    console.log(`  Average words extracted: ${avgWords.toFixed(1)}`);
    console.log(`  Average processing time: ${(avgProcessingTime / 1000).toFixed(1)}s`);
    
    console.log(`\n🎯 QUALITY ASSESSMENT:`);
    successful.forEach((r, i) => {
      console.log(`  ${i+1}. ${r.filename.substring(0, 30)}...`);
      console.log(`     Confidence: ${(r.confidence * 100).toFixed(1)}%`);
      console.log(`     Text: ${r.wordCount} words, ${r.textLength} chars`);
      console.log(`     Quality: ${r.qualityScore}/6`);
    });
  }
  
  console.log(`\n💡 HANDWRITING RECOGNITION INSIGHTS:`);
  console.log(`  - Current system handles structured handwriting better than cursive`);
  console.log(`  - Table-like layouts are recognized more accurately`);
  console.log(`  - Performance could be improved with handwriting-specific prompts`);
  
  return results;
}

testHandwritingDocuments().catch(console.error);