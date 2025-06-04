const fs = require('fs');
const path = require('path');

async function testRemainingDocuments() {
  console.log('🚀 Testing remaining documents...');
  
  const remainingDocs = [
    '2-vorlage-ordentliche-kuendigung-des-versicherungsvertrages-de Kopie 2.docx',
    '3-vorlage-kuendigung-im-schadensfall-de Kopie 2.docx', 
    'vertragstrennung Kopie 2.pdf',
    'meldung-sturmschaden Kopie 2.pdf',
    'meldeformular-kontoverbindung Kopie 2.pdf',
    'Schlechte Qualität Kopie 2.webp'
  ];
  
  const results = [];
  
  for (const filename of remainingDocs) {
    console.log(`\\n🔍 Testing: ${filename}`);
    
    try {
      const filePath = path.join(__dirname, 'test-documents', filename);
      const fileBuffer = fs.readFileSync(filePath);
      const FormData = (await import('formdata-node')).FormData;
      const formData = new FormData();
      
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes = {
        '.pdf': 'application/pdf',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.webp': 'image/webp'
      };
      const mimeType = mimeTypes[ext] || 'application/octet-stream';
      
      formData.append('file', new Blob([fileBuffer], { type: mimeType }), filename);
      
      const response = await fetch('http://localhost:3000/api/ocr-save', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const table = result.data.supabaseUrl?.split('/').pop() || 'unknown';
          console.log(`✅ SUCCESS: ${result.data.ocrResult.classification.type} → ${table}`);
          results.push({
            filename,
            success: true,
            type: result.data.ocrResult.classification.type,
            table,
            textLength: result.data.ocrResult.extractedText?.length || 0
          });
        } else {
          console.log(`❌ FAILED: ${result.error}`);
          results.push({ filename, success: false, error: result.error });
        }
      } else {
        console.log(`❌ HTTP ERROR: ${response.status}`);
        results.push({ filename, success: false, error: `HTTP ${response.status}` });
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
      results.push({ filename, success: false, error: error.message });
    }
  }
  
  console.log('\\n📊 QUICK TEST RESULTS:');
  results.forEach(r => {
    console.log(`${r.success ? '✅' : '❌'} ${r.filename}: ${r.success ? r.type + ' → ' + r.table : r.error}`);
  });
}

testRemainingDocuments().catch(console.error);