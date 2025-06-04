const fs = require('fs');
const path = require('path');

async function testOCR() {
  console.log('🚀 Testing OCR with UVG document...');
  
  // Test different document to verify flow works
  const filename = 'kuendigung-allianz Kopie 2.pdf';
  const filePath = path.join(__dirname, 'test-documents', filename);
  
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    console.log(`📄 File found: ${filename}`);
    console.log(`📊 File size: ${(fs.statSync(filePath).size / 1024).toFixed(1)} KB`);
    
    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Create FormData manually
    const FormData = (await import('formdata-node')).FormData;
    const formData = new FormData();
    
    // Add file to form data  
    formData.append('file', new Blob([fileBuffer], { type: 'application/pdf' }), filename);
    
    console.log('🤖 Sending to OCR SAVE API...');
    
    // Make request to SAVE endpoint (OCR + Supabase routing test with summary fallback)
    const response = await fetch('http://localhost:3000/api/ocr-save', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      console.log('\n✅ OCR SAVE SUCCESS!');
      console.log('📋 Document Type:', result.data.ocrResult?.classification?.type || 'Unknown');
      console.log('📊 Confidence:', ((result.data.ocrResult?.classification?.confidence || 0) * 100).toFixed(1) + '%');
      console.log('📝 Text Length:', result.data.ocrResult?.extractedText?.length || 0, 'characters');
      console.log('💾 Document ID:', result.data.documentRecord?.id || 'None');
      console.log('🏷️  Supabase Table:', result.data.supabaseUrl?.split('/').pop() || 'Unknown');
      
      console.log('\n📄 FULL EXTRACTED TEXT:');
      console.log('=' + '='.repeat(80));
      console.log(result.data.ocrResult?.extractedText || '');
      console.log('=' + '='.repeat(80));
      
      // Text analysis for SUVA detection
      const text = (result.data.ocrResult?.extractedText || '').toLowerCase();
      console.log('\n🧪 SUVA KEYWORD ANALYSIS:');
      console.log('  Contains "suva":', text.includes('suva'));
      console.log('  Contains "uvg":', text.includes('uvg'));
      console.log('  Contains "unfall":', text.includes('unfall'));
      console.log('  Contains "verletzung":', text.includes('verletzung'));
      console.log('  Contains "schadenmeldung":', text.includes('schadenmeldung'));
      
      console.log('\n🔍 CLASSIFICATION DETAILS:');
      console.log('Type:', result.data.ocrResult?.classification?.type);
      console.log('Category:', result.data.ocrResult?.classification?.category);
      console.log('Summary:', result.data.ocrResult?.classification?.summary);
      
      console.log('\n🎯 ROUTING VERIFICATION:');
      console.log('Specific Record Created:', !!result.data.specificRecord);
      console.log('Record ID:', result.data.specificRecord?.id || 'None');
      console.log('Table URL:', result.data.supabaseUrl || 'None');
      
    } else {
      console.log('❌ OCR SAVE FAILED:', result.error || 'Unknown error');
      console.log('Details:', result.details || 'No details');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Install formdata-node if needed and run test
async function main() {
  try {
    await testOCR();
  } catch (importError) {
    console.log('📦 Installing formdata-node...');
    const { execSync } = require('child_process');
    execSync('npm install formdata-node', { cwd: __dirname });
    await testOCR();
  }
}

main().catch(console.error);