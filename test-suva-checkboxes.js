#!/usr/bin/env node

/**
 * SUVA Checkbox Recognition Test
 * Tests whether our OCR Agent can detect checked/unchecked boxes in SUVA forms
 */

const fs = require('fs');
const path = require('path');

// Import our agents and services
const { OCRAgent } = require('./packages/agents/src/ocr/OCRAgent.ts');
const { DIContainer } = require('./packages/core/src/container/DIContainer.ts');

async function testSUVACheckboxes() {
  console.log('🧪 Testing SUVA Checkbox Recognition...\n');

  try {
    // Load the SUVA form image
    const imagePath = path.join(__dirname, 'test-documents', 'Bildschirmfoto 2024-11-02 um 13.32.43 Kopie.png');
    console.log(`📄 Loading SUVA form: ${imagePath}`);
    
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    console.log(`✅ Image loaded: ${imageBuffer.length} bytes\n`);

    // Initialize DI Container (simplified for testing)
    const container = new DIContainer();
    
    // Create OCR Agent
    const ocrAgent = new OCRAgent({
      id: 'ocr-test',
      name: 'OCRAgent',
      version: '1.0.0',
      enabled: true,
      maxRetries: 3,
      timeout: 60000,
      healthCheckInterval: 30000,
      dependencies: []
    }, container);

    await ocrAgent.start();
    console.log('🤖 OCR Agent initialized\n');

    // Test document classification with checkbox detection
    console.log('🔍 Starting SUVA form analysis...');
    const result = await ocrAgent.execute({
      action: 'classifyDocument',
      imageBuffer: imageBuffer,
      filename: 'suva-form-test.png',
      mimeType: 'image/png',
      language: 'de'
    }, {
      sessionId: 'checkbox-test',
      userId: 'test-user',
      agentId: 'ocr-test',
      timestamp: new Date(),
      metadata: { test: 'checkbox-recognition' }
    });

    console.log('\n📊 RESULTS:');
    console.log('=' * 50);

    if (result.success && result.data) {
      const data = result.data;
      
      console.log(`📋 Document Type: ${data.classification?.type || 'Unknown'}`);
      console.log(`🎯 Confidence: ${(data.classification?.confidence || 0) * 100}%`);
      console.log(`📝 Summary: ${data.classification?.summary || 'No summary'}`);
      
      console.log('\n🔲 CHECKBOX DETECTION:');
      
      // Check for checkbox information in keyFields
      const keyFields = data.classification?.keyFields || {};
      if (keyFields.suva_checkboxes) {
        console.log('Found SUVA checkboxes in keyFields:');
        Object.entries(keyFields.suva_checkboxes).forEach(([key, value]) => {
          const symbol = value === 'true' || value === true ? '☑️' : '☐';
          console.log(`  ${symbol} ${key}: ${value}`);
        });
      } else {
        console.log('❌ No suva_checkboxes found in keyFields');
      }

      // Check for checkbox information in extracted text
      console.log('\n📄 EXTRACTED TEXT (first 500 chars):');
      const extractedText = data.extractedText || '';
      console.log(extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''));

      // Look for checkbox patterns in the text
      console.log('\n🔍 CHECKBOX PATTERNS IN TEXT:');
      const checkboxPatterns = [
        /unfall/gi,
        /zahnschaden/gi, 
        /berufskrankheit/gi,
        /rückfall|rueckfall/gi,
        /☑|✓|✕|x/g
      ];
      
      checkboxPatterns.forEach((pattern, index) => {
        const matches = extractedText.match(pattern);
        if (matches) {
          console.log(`  Pattern ${index + 1} (${pattern}): ${matches.length} matches - ${matches.slice(0, 3).join(', ')}`);
        }
      });

      // Expected results based on the image
      console.log('\n🎯 EXPECTED vs ACTUAL:');
      console.log('Expected checkboxes:');
      console.log('  ☑️ Unfall: true');
      console.log('  ☐ Zahnschaden: false');
      console.log('  ☑️ Berufskrankheit: true');
      console.log('  ☐ Rückfall: false');

    } else {
      console.log('❌ OCR processing failed:');
      console.log(result.error || 'Unknown error');
    }

    await ocrAgent.stop();
    console.log('\n✅ Test completed');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run the test
testSUVACheckboxes().catch(console.error);