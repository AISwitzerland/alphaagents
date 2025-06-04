const fs = require('fs');
const path = require('path');

async function testBothSuvaDocuments() {
  console.log('🎯 TESTING BOTH SUVA DOCUMENTS (HASH SYMBOL REMOVED)');
  console.log('Testing if filename fix resolves routing issues');
  console.log('='.repeat(80));
  
  const suvaDocuments = [
    'Suva1 Kopie 2.pdf',
    'Suva2 Kopie 3.pdf'  // Assuming you renamed it from Suva#2
  ];
  
  const results = [];
  
  for (const filename of suvaDocuments) {
    console.log(`\\n🔍 Testing: ${filename}`);
    console.log('-'.repeat(50));
    
    try {
      const filePath = path.join(__dirname, 'test-documents', filename);
      
      if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filename}`);
        console.log('Available files:');
        const files = fs.readdirSync(path.join(__dirname, 'test-documents'))
          .filter(f => f.includes('Suva') || f.includes('suva'));
        console.log(files);
        continue;
      }
      
      const fileBuffer = fs.readFileSync(filePath);
      const FormData = (await import('formdata-node')).FormData;
      const formData = new FormData();
      
      formData.append('file', new Blob([fileBuffer], { type: 'application/pdf' }), filename);
      
      console.log(`📊 Size: ${(fs.statSync(filePath).size / 1024).toFixed(1)} KB`);
      console.log('🤖 Processing...');
      
      const response = await fetch('http://localhost:3000/api/ocr-save', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const actualTable = result.data.supabaseUrl?.split('/').pop() || 'unknown';
          const isCorrect = actualTable === 'accident_reports';
          
          console.log(`✅ SUCCESS!`);
          console.log(`📋 Type: ${result.data.ocrResult.classification.type}`);
          console.log(`📊 Confidence: ${((result.data.ocrResult.classification.confidence || 0) * 100).toFixed(1)}%`);
          console.log(`📝 Text: ${result.data.ocrResult.extractedText?.length || 0} chars`);
          console.log(`🏷️  Table: ${actualTable}`);
          console.log(`🎯 Routing: ${isCorrect ? '✅ CORRECT' : '❌ WRONG'} (Expected: accident_reports)`);
          console.log(`📧 Email: ${result.data.emailError ? '❌' : '✅'}`);
          
          // Show key content analysis
          const text = result.data.ocrResult.extractedText || '';
          const summary = result.data.ocrResult.classification.summary || '';
          const hasUVG = text.toLowerCase().includes('uvg') || summary.toLowerCase().includes('uvg');
          const hasSUVA = text.toLowerCase().includes('suva') || summary.toLowerCase().includes('suva');
          const hasUnfallversicherung = summary.toLowerCase().includes('unfallversicherung');
          
          console.log(`🔍 Key Detection:`);
          console.log(`   UVG: ${hasUVG}`);
          console.log(`   SUVA: ${hasSUVA}`);
          console.log(`   Unfallversicherung: ${hasUnfallversicherung}`);
          console.log(`   Classification: ${result.data.ocrResult.classification.type}`);
          console.log(`   Summary: ${summary.substring(0, 100)}...`);
          
          results.push({
            filename,
            success: true,
            type: result.data.ocrResult.classification.type,
            actualTable,
            isCorrect,
            textLength: text.length,
            hasUnfallversicherung,
            summary
          });
          
        } else {
          console.log(`❌ FAILED: ${result.error}`);
          results.push({ filename, success: false, error: result.error });
        }
      } else {
        console.log(`❌ HTTP ERROR: ${response.status}`);
        results.push({ filename, success: false, error: `HTTP ${response.status}` });
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
      results.push({ filename, success: false, error: error.message });
    }
  }
  
  console.log('\\n\\n📊 SUVA ROUTING TEST RESULTS');
  console.log('='.repeat(80));
  
  const successful = results.filter(r => r.success);
  const correctRouting = results.filter(r => r.success && r.isCorrect);
  
  console.log(`📈 Processing Success: ${successful.length}/${results.length}`);
  console.log(`🎯 Correct Routing: ${correctRouting.length}/${successful.length}`);
  
  console.log('\\n📋 Individual Results:');
  results.forEach(r => {
    if (r.success) {
      const status = r.isCorrect ? '✅' : '❌';
      console.log(`${status} ${r.filename}:`);
      console.log(`   Type: ${r.type} → ${r.actualTable}`);
      console.log(`   Text: ${r.textLength} chars`);
      console.log(`   Has Unfallversicherung: ${r.hasUnfallversicherung}`);
      console.log(`   Summary: ${r.summary.substring(0, 80)}...`);
    } else {
      console.log(`❌ ${r.filename}: ${r.error}`);
    }
  });
  
  if (correctRouting.length === successful.length && successful.length > 0) {
    console.log('\\n🎉 ALL SUVA DOCUMENTS NOW ROUTING CORRECTLY!');
  } else if (correctRouting.length > 0) {
    console.log('\\n⚡ PARTIAL SUCCESS - Some SUVA documents now routing correctly!');
  } else {
    console.log('\\n⚠️  SUVA routing still needs investigation.');
  }
}

testBothSuvaDocuments().catch(console.error);