import { NextRequest, NextResponse } from 'next/server';
import { DocumentAgent } from '../../../../../../packages/agents/src/document/DocumentAgent';
import { OCRAgent } from '../../../../../../packages/agents/src/ocr/OCRAgent';
import { ServiceTokens } from '../../../../../../packages/core/src/container/DIContainer';
import { SupabaseService } from '../../../../../../packages/services/src/database/SupabaseService';
import { EmailNotificationService } from '../../../../../../packages/services/src/email/EmailNotificationService';
import { globalServices } from '../../../lib/services';

/**
 * OCR Save API Route
 * Processes document with OCR and saves to Supabase
 */
export async function POST(request: NextRequest) {
  try {
    console.log('='.repeat(80));
    console.log('*** OCR SAVE ENDPOINT CALLED ***');
    console.log('TIMESTAMP:', new Date().toISOString());
    console.log('='.repeat(80));
    console.log('💾 OCR Save request started...');

    // Get global service container
    const container = await globalServices.getContainer();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log(`📄 Processing and saving file: ${file.name} (${file.size} bytes)`);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Step 1: OCR Processing FIRST (no database saves yet)
    console.log('🤖 Processing document with OCR (no DB saves yet)...');
    const ocrAgent = new OCRAgent({
      id: 'ocr-agent-save',
      name: 'OCRAgent',
      version: '1.0.0',
      enabled: true,
      maxRetries: 3,
      timeout: 60000,
      healthCheckInterval: 30000,
      dependencies: []
    }, container);

    await ocrAgent.start();

    const ocrResult = await ocrAgent.execute({
      action: 'classifyDocument',
      imageBuffer: buffer,
      filename: file.name,
      mimeType: file.type,
      language: 'de'
    }, {
      sessionId: `save-${Date.now()}`,
      userId: 'ocr-test-user',
      agentId: 'ocr-agent-save',
      timestamp: new Date(),
      metadata: { filename: file.name }
    });

    if (!ocrResult.success || !ocrResult.data) {
      console.error('❌ OCR processing failed:', ocrResult.error);
      throw new Error(`OCR processing failed: ${ocrResult.error || 'Unknown error'}`);
    }

    console.log('✅ OCR processing completed, now saving classifications...');

    // Step 2: Save to classification-specific table FIRST (no foreign keys needed)
    console.log('🔍 Determining final document type...');
    
    const supabaseService = await container.resolve<SupabaseService>(ServiceTokens.SUPABASE_SERVICE);
    let specificRecord = null;
    let enhancedType = 'miscellaneous'; // Default value
    
    if (ocrResult.data.classification) {
      // Get enhanced type first
      const originalType = ocrResult.data.classification.type?.toLowerCase() || '';
      console.log('🚨 ABOUT TO CALL ENHANCEMENT FUNCTION with:', originalType);
      enhancedType = enhanceClassificationWithTextAnalysis(originalType, ocrResult.data.extractedText || '', ocrResult.data.classification);
      
      console.log(`📋 Final classification: ${originalType} → ${enhancedType}`);
      
      // CRITICAL FIX: Force SUVA routing based on summary
      if (enhancedType === 'formular' && ocrResult.data.classification.summary?.toLowerCase().includes('unfallversicherung')) {
        console.log('🚨 FORCING SUVA ROUTING: Detected Unfallversicherung in summary');
        // Override the enhancedType to force accident table routing
        enhancedType = 'unfallbericht';
        console.log(`📋 FORCED classification: ${originalType} → ${enhancedType}`);
      }
      
      // Step 4: Extract structured data based on FINAL document type
      console.log('🔍 Extracting structured data for final type...');
      let structuredData: Record<string, any> = {};
      
      try {
        structuredData = await ocrAgent.extractStructuredData(
          buffer,
          enhancedType, // Use enhanced type here!
          ocrResult.data.extractedText || '',
          'de'
        );
        console.log('✅ Structured data extracted for', enhancedType, ':', Object.keys(structuredData));
      } catch (error) {
        console.warn('⚠️ Structured data extraction failed, using basic extraction:', error);
        structuredData = {};
      }

      // Step 5: Save to classification-specific table
      console.log('💾 Saving OCR results to database...');
      console.log('🔍 Calling saveToClassificationTable with:');
      console.log(`   Classification: ${ocrResult.data.classification.type}`);
      console.log(`   Enhanced type: ${enhancedType}`);
      console.log(`   Extracted text length: ${(ocrResult.data.extractedText || '').length}`);
      console.log('   Summary:', ocrResult.data.classification.summary?.substring(0, 100) + '...');
      console.log('🚨🚨🚨 ABOUT TO CALL saveToClassificationTable 🚨🚨🚨');
      
      specificRecord = await saveToClassificationTable(
        supabaseService,
        ocrResult.data.classification,
        null, // No document_id yet - will be updated later
        ocrResult.data.extractedText || '',
        structuredData,
        enhancedType // Pass enhanced type explicitly
      );
    }

    console.log('📁 Classification saved, now creating document record...');

    // Step 3: Create document record AFTER classification
    const documentAgent = new DocumentAgent({
      id: 'document-agent-save',
      name: 'DocumentAgent',
      version: '1.0.0',
      enabled: true,
      maxRetries: 3,
      timeout: 30000,
      healthCheckInterval: 30000,
      dependencies: []
    }, container);

    await documentAgent.start();

    const uploadResult = await documentAgent.execute({
      action: 'upload',
      file: {
        buffer: buffer,
        originalName: file.name,
        mimeType: file.type,
        size: file.size
      },
      ocrResults: ocrResult.data,
      classificationRecord: specificRecord // Include classification record reference
    }, {
      sessionId: `save-${Date.now()}`,
      userId: 'ocr-test-user',
      agentId: 'document-agent-save',
      timestamp: new Date(),
      metadata: { 
        filename: file.name, 
        size: file.size,
        hasOCR: true,
        hasClassification: !!specificRecord,
        classification: ocrResult.data.classification?.type,
        enhancedType: enhancedType
      }
    });

    if (!uploadResult.success || !uploadResult.data?.documentRecord) {
      console.error('❌ Document upload failed:', uploadResult.error);
      throw new Error(`Document upload failed: ${uploadResult.error || 'Unknown error'}`);
    }

    const documentRecord = uploadResult.data.documentRecord;
    console.log('✅ Document uploaded with ID:', documentRecord.id);

    // Step 4: Update classification record with document_id
    if (specificRecord && specificRecord.id) {
      console.log('🔗 Linking classification record to document...');
      await updateClassificationWithDocumentId(supabaseService, specificRecord, documentRecord.id, enhancedType);
    }

    // Send email notification about processed document
    try {
      console.log('📧 Sending email notification...');
      
      const emailService = EmailNotificationService.getInstance();
      
      await emailService.sendDocumentProcessedNotification({
        documentId: documentRecord.id,
        filename: file.name,
        documentType: ocrResult.data.classification?.type || 'unknown',
        tableName: getTableName(ocrResult.data.classification?.type),
        extractedText: ocrResult.data.extractedText || '',
        classification: ocrResult.data.classification,
        structuredData: ocrResult.data.structuredData || {},
        supabaseUrl: `https://xhglgdyzqsiucfscydpi.supabase.co/project/default/table/${getTableName(ocrResult.data.classification?.type)}`
      }, {
        to: 'wehrlinatasha@gmail.com', // Your email - you can make this configurable later
        language: 'de'
      });
      
      console.log('✅ Email notification sent successfully');
      
    } catch (emailError) {
      // Don't fail the whole process if email fails
      console.warn('⚠️ Email notification failed, but document processing succeeded:', 
        emailError instanceof Error ? emailError.message : 'Unknown email error');
    }

    console.log('✅ OCR processing and saving completed successfully');
    
    return NextResponse.json({
      success: true,
      data: {
        documentRecord: documentRecord,
        ocrResult: ocrResult.data,
        specificRecord: specificRecord,
        supabaseUrl: `https://xhglgdyzqsiucfscydpi.supabase.co/project/default/table/${getActualTableName(specificRecord, ocrResult.data.classification?.type)}`
      }
    });

  } catch (error) {
    console.error('❌ OCR Save error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Enhance classification with text analysis fallback
 */
function enhanceClassificationWithTextAnalysis(
  originalType: string, 
  extractedText: string, 
  classification: any
): string {
  console.log('🚨 ENHANCEMENT FUNCTION CALLED!', originalType);
  
  const text = extractedText.toLowerCase();
  const summary = classification.summary?.toLowerCase() || '';
  
  console.log('🔍 ENHANCEMENT: Analyzing', originalType, 'with summary:', summary.substring(0, 100) + '...');
  
  // SUVA documents always go to accident table (SUVA = Swiss accident insurance)
  if (summary.includes('unfallversicherung') || text.includes('suva') || 
      extractedText.toLowerCase().includes('suva') || summary.includes('suva')) {
    console.log('🔍 SUVA/Accident insurance detected → routing to accident_reports');
    return 'unfallbericht';
  }
  
  // Only enhance if we detect VERY SPECIFIC patterns that contradict the original classification
  // This should be conservative and only correct obvious misclassifications
  
  // SUVA/UVG documents - Enhanced detection with multiple patterns
  if (!originalType.includes('unfall') && !originalType.includes('accident')) {
    // Primary SUVA/UVG detection
    if ((text.includes('suva') || text.includes('uvg') || text.includes('unfallversicherung') || 
         text.includes('schadenmeldung uvg')) &&
        (text.includes('unfall') || text.includes('verletzung') || text.includes('arbeitsunfall'))) {
      console.log('🔍 Text analysis detected: Unfallbericht (enhanced from:', originalType, ')');
      return 'unfallbericht';
    }
    
    // Fallback: Check classification summary for accident insurance keywords
    if (summary.includes('unfallversicherung') && 
        (summary.includes('schadenmeldung') || summary.includes('formular'))) {
      console.log('🔍 Summary analysis detected: Unfallbericht via summary (enhanced from:', originalType, ')');
      return 'unfallbericht';
    }
    
    // Secondary pattern: UVG context with accident indicators
    if (text.includes('unfall') && text.includes('verletzung') && 
        (text.includes('arbeitgeber') || text.includes('verletzte') || text.includes('unfallort'))) {
      console.log('🔍 Text analysis detected: Unfallbericht via accident pattern (enhanced from:', originalType, ')');
      return 'unfallbericht';
    }
    
    // Third pattern: Clear accident form structure (common German accident report fields)
    if (text.includes('unfall') && text.includes('verletzung') && 
        (text.includes('berufsunfall') || text.includes('unfallhergang') || text.includes('schadenort'))) {
      console.log('🔍 Text analysis detected: Unfallbericht via form structure (enhanced from:', originalType, ')');
      return 'unfallbericht';
    }
  }
  
  // Cancellation documents - check if classified as something else but clearly contains cancellation content  
  if (!originalType.includes('kündig') && !originalType.includes('cancellation')) {
    if ((text.includes('kündigung') || text.includes('kuendigung')) && 
        (text.includes('vertrag') || text.includes('police') || text.includes('versicherung'))) {
      console.log('🔍 Text analysis detected: Kündigungsschreiben (enhanced from:', originalType, ')');
      return 'kündigungsschreiben';
    }
  }
  
  // Invoices - check if classified as something else but clearly contains invoice content
  if (!originalType.includes('rechnung') && !originalType.includes('invoice')) {
    if ((text.includes('rechnung') || text.includes('faktura') || text.includes('invoice')) &&
        (text.includes('betrag') || text.includes('mwst') || /\d+[.,]\d+\s*(chf|eur|€)/i.test(text))) {
      console.log('🔍 Text analysis detected: Rechnung (enhanced from:', originalType, ')');
      return 'rechnung';
    }
  }
  
  // Damage reports - check if classified as something else but clearly contains damage content (NOT accident)
  if (!originalType.includes('schaden') && !originalType.includes('damage')) {
    if ((text.includes('diebstahl') || text.includes('brand') || text.includes('wasserschaden')) &&
        !text.includes('unfall') && !text.includes('uvg') && !text.includes('suva')) {
      console.log('🔍 Text analysis detected: Schadenmeldung (enhanced from:', originalType, ')');
      return 'schadenmeldung';
    }
  }
  
  // If no specific enhancement needed, return original type
  console.log('🔍 No text enhancement needed, keeping original classification:', originalType);
  return originalType;
}

/**
 * Save to classification-specific table
 */
async function saveToClassificationTable(
  supabaseService: SupabaseService,
  classification: any,
  documentId: string,
  extractedText: string,
  structuredData: Record<string, any> = {},
  enhancedType?: string
): Promise<any> {
  console.log('🚨 ENTERING saveToClassificationTable function');
  console.log(`   Original classification: ${classification.type}`);
  console.log(`   Enhanced type provided: ${enhancedType}`);
  console.log(`   Document ID: ${documentId}`);
  
  // Use provided enhancedType or calculate it
  const finalType = enhancedType || enhanceClassificationWithTextAnalysis(
    classification.type?.toLowerCase() || '', 
    extractedText, 
    classification
  );
  
  console.log(`   Final type for routing: ${finalType}`);
  
  try {
    // CONTENT-BASED ACCIDENT REPORT DETECTION
    // Unified logic for all accident reports regardless of document type
    const textLower = extractedText.toLowerCase();
    const summaryLower = classification.summary?.toLowerCase() || '';
    
    console.log('🔍 CONTENT-BASED ROUTING: Analyzing for accident reports...');
    console.log(`   Document type: ${finalType}`);
    console.log(`   Text length: ${extractedText.length} chars`);
    console.log(`   Summary: ${summaryLower.substring(0, 100)}...`);
    
    // Check for accident/injury content regardless of document format
    const hasAccidentContent = (
      // SUVA/UVG specific content (highest priority)
      textLower.includes('suva') || summaryLower.includes('suva') ||
      textLower.includes('uvg') || summaryLower.includes('uvg') ||
      textLower.includes('schadenmeldung uvg') ||
      summaryLower.includes('unfallversicherung') ||
      
      // Workplace accident indicators
      textLower.includes('arbeitsunfall') || textLower.includes('betriebsunfall') ||
      textLower.includes('unfall am arbeitsplatz') ||
      summaryLower.includes('arbeitsunfall') || summaryLower.includes('betriebsunfall') ||
      
      // General accident report indicators
      summaryLower.includes('unfallbericht') ||
      (textLower.includes('unfall') && textLower.includes('verletzung')) ||
      (summaryLower.includes('unfall') && summaryLower.includes('verletzung'))
    );
    
    // Exclude documents that are clearly not accident reports
    const isNotAccidentReport = (
      textLower.includes('kündigung') || summaryLower.includes('kündigung') ||
      textLower.includes('police') || summaryLower.includes('police') ||
      finalType.includes('rechnung') || finalType.includes('invoice') ||
      textLower.includes('ratenversicherung') || textLower.includes('tarif') ||
      textLower.includes('leistungen') || summaryLower.includes('information')
    );
    
    console.log(`   Has accident content: ${hasAccidentContent}`);
    console.log(`   Is NOT accident report: ${isNotAccidentReport}`);
    
    if (hasAccidentContent) {
      console.log('   Detected patterns:');
      if (textLower.includes('suva') || summaryLower.includes('suva')) console.log('     ✓ SUVA keyword');
      if (textLower.includes('uvg') || summaryLower.includes('uvg')) console.log('     ✓ UVG keyword');
      if (summaryLower.includes('unfallversicherung')) console.log('     ✓ Unfallversicherung');
      if (textLower.includes('arbeitsunfall') || summaryLower.includes('arbeitsunfall')) console.log('     ✓ Arbeitsunfall');
      if (textLower.includes('unfall') && textLower.includes('verletzung')) console.log('     ✓ Unfall + Verletzung');
    }
    
    if (isNotAccidentReport) {
      console.log('   Exclusion patterns:');
      if (textLower.includes('kündigung') || summaryLower.includes('kündigung')) console.log('     × Kündigung detected');
      if (textLower.includes('ratenversicherung')) console.log('     × Rate information detected');
    }
    
    // ROUTE TO ACCIDENT REPORTS if accident content detected and not excluded
    if (hasAccidentContent && !isNotAccidentReport) {
      console.log('🎯 ROUTING TO ACCIDENT_REPORTS: Content-based detection successful');
      
      const accidentData = {
        document_id: documentId, // Will be null initially, updated later
        name: structuredData.name || 'Nicht angegeben',
        geburtsdatum: structuredData.geburtsdatum || '1900-01-01',
        ahv_nummer: structuredData.ahv_nummer || '000.00.000.000',
        unfall_datum: structuredData.unfall_datum || extractDateFromText(extractedText) || new Date().toISOString().split('T')[0],
        unfall_zeit: structuredData.unfall_zeit || '00:00:00',
        unfall_ort: structuredData.unfall_ort || 'Nicht angegeben',
        unfall_beschreibung: structuredData.unfall_beschreibung || classification.summary || 'Unfall automatisch verarbeitet',
        verletzung_art: structuredData.verletzung_art || 'Unbekannt',
        verletzung_koerperteil: structuredData.verletzung_koerperteil || 'Unbekannt',
        status: 'eingereicht'
      };
      
      console.log('📋 ACCIDENT REPORT DATA TO INSERT:');
      console.log(JSON.stringify(accidentData, null, 2));
      
      return await supabaseService.createAccidentReport(accidentData);
    }
    
    // Check for accident reports first (UVG = Unfallversicherungsgesetz)
    if (finalType.includes('unfallbericht') || finalType.includes('unfall') || finalType.includes('accident') || 
        finalType.includes('uvg') || (finalType.includes('schaden') && finalType.includes('uvg'))) {
      console.log(`Classified as ${classification.type}, storing in accident_reports`);
      return await supabaseService.createAccidentReport({
        document_id: documentId, // Will be null initially
        name: structuredData.name || 'Nicht angegeben',
        geburtsdatum: structuredData.geburtsdatum || '1900-01-01',
        ahv_nummer: structuredData.ahv_nummer || '000.00.000.000',
        unfall_datum: structuredData.unfall_datum || extractDateFromText(extractedText) || new Date().toISOString().split('T')[0],
        unfall_zeit: structuredData.unfall_zeit || '00:00:00',
        unfall_ort: structuredData.unfall_ort || 'Nicht angegeben',
        unfall_beschreibung: structuredData.unfall_beschreibung || classification.summary || 'Automatisch verarbeitet',
        verletzung_art: structuredData.verletzung_art || 'Unbekannt',
        verletzung_koerperteil: structuredData.verletzung_koerperteil || 'Unbekannt',
        status: 'eingereicht'
      });
    }
    
    // Regular damage reports (not accident-related)
    if (finalType.includes('schaden') || finalType.includes('damage')) {
      console.log(`Classified as ${classification.type}, storing in damage_reports`);
      return await supabaseService.createDamageReport({
        document_id: documentId, // Will be null initially
        versicherungsnummer: structuredData.versicherungsnummer || extractPolicyNumber(extractedText) || undefined,
        name: structuredData.name || 'Nicht angegeben',
        adresse: structuredData.adresse || 'Nicht angegeben',
        schaden_datum: structuredData.schaden_datum || extractDateFromText(extractedText) || new Date().toISOString().split('T')[0],
        schaden_ort: structuredData.schaden_ort || 'Nicht angegeben',
        schaden_beschreibung: structuredData.schaden_beschreibung || classification.summary || 'Automatisch klassifiziert',
        zusammenfassung: structuredData.zusammenfassung || classification.summary || 'Automatisch verarbeitet',
        status: 'eingereicht'
      });
    }
    
    if (finalType.includes('kündigungsschreiben') || finalType.includes('kündigung') || finalType.includes('kuendigung') || finalType.includes('vertrag')) {
      console.log(`Classified as ${classification.type}, storing in contract_changes`);
      return await supabaseService.createContractChange({
        document_id: documentId, // Will be null initially
        name: structuredData.name || 'Nicht angegeben',
        adresse: structuredData.adresse || 'Nicht angegeben',
        aenderung_typ: structuredData.aenderung_typ || classification.type || 'Kündigung',
        aenderung_beschreibung: structuredData.aenderung_beschreibung || classification.summary || 'Automatisch klassifiziert',
        zusammenfassung: structuredData.zusammenfassung || classification.summary || 'Automatisch verarbeitet',
        status: 'eingereicht'
      });
    }
    
    
    if (finalType.includes('rechnung') || finalType.includes('invoice') || finalType.includes('faktura')) {
      console.log(`Classified as ${classification.type}, storing in invoices`);
      return await supabaseService.createInvoice({
        document_id: documentId, // Will be null initially
        rechnungsdatum: structuredData.rechnungsdatum || extractDateFromText(extractedText) || new Date().toISOString().split('T')[0],
        faelligkeitsdatum: structuredData.faelligkeitsdatum || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        betrag: structuredData.betrag || 0,
        waehrung: structuredData.waehrung || 'CHF',
        empfaenger: structuredData.empfaenger || 'Nicht angegeben',
        beschreibung: structuredData.beschreibung || classification.summary || 'Automatisch verarbeitet',
        zusammenfassung: structuredData.zusammenfassung || classification.summary || 'Automatisch verarbeitet',
        status: 'eingereicht'
      });
    }
    
    // For ALL other document types, store in miscellaneous_documents table
    console.log(`Classified as ${classification.type || 'Unbekannt'}, storing in miscellaneous_documents`);
    return await supabaseService.createMiscellaneousDocument({
      document_id: documentId, // Will be null initially
      title: structuredData.title || classification.type || 'Unbekanntes Dokument',
      document_date: structuredData.document_date || extractDateFromText(extractedText) || undefined,
      summary: structuredData.summary || classification.summary || 'Automatisch verarbeitet',
      status: 'eingereicht'
    });
    
  } catch (error) {
    console.error('❌ Failed to save to specific table:', {
      documentType: classification.type,
      finalType,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: (error as any).cause
      } : error,
      structuredDataKeys: Object.keys(structuredData)
    });
    return null;
  }
}

/**
 * Extract date from text
 */
function extractDateFromText(text: string): string | null {
  const datePattern = /\d{1,2}[.\/]\d{1,2}[.\/]\d{2,4}/;
  const match = text.match(datePattern);
  return match ? match[0] : null;
}

/**
 * Extract policy number from text
 */
function extractPolicyNumber(text: string): string | null {
  const policyPattern = /(?:Police|Policy|Vertrag|Contract)[:\s#]*([A-Z0-9\-]{6,})/i;
  const match = text.match(policyPattern);
  return match ? match[1] : null;
}

/**
 * Get table name based on where the record was actually saved
 */
function getActualTableName(specificRecord: any, fallbackType?: string): string {
  if (!specificRecord) {
    return getTableName(fallbackType);
  }
  
  // Determine table based on record structure/fields
  if (specificRecord.unfall_datum || specificRecord.verletzung_art) {
    return 'accident_reports';
  }
  if (specificRecord.schaden_datum || specificRecord.schaden_beschreibung) {
    return 'damage_reports';
  }
  if (specificRecord.aenderung_typ || specificRecord.aenderung_beschreibung) {
    return 'contract_changes';
  }
  if (specificRecord.rechnungsdatum || specificRecord.betrag) {
    return 'invoices';
  }
  
  return 'miscellaneous_documents';
}

/**
 * Get table name for Supabase URL - matches saveToClassificationTable logic
 */
function getTableName(documentType?: string): string {
  const type = documentType?.toLowerCase() || '';
  
  // Match the exact logic from saveToClassificationTable
  if (type.includes('unfallbericht') || type.includes('unfall') || type.includes('accident') || 
      type.includes('uvg') || (type.includes('schaden') && type.includes('uvg'))) {
    return 'accident_reports';
  }
  
  if (type.includes('schaden') || type.includes('damage')) {
    return 'damage_reports';
  }
  
  if (type.includes('kündigungsschreiben') || type.includes('kündigung') || 
      type.includes('kuendigung') || type.includes('vertrag')) {
    return 'contract_changes';
  }
  
  if (type.includes('versicherungspolice') || type.includes('police')) {
    return 'contract_changes';
  }
  
  if (type.includes('rechnung') || type.includes('invoice') || type.includes('faktura')) {
    return 'invoices';
  }
  
  return 'miscellaneous_documents';
}

/**
 * Update classification record with document_id after document is created
 */
async function updateClassificationWithDocumentId(
  supabaseService: SupabaseService,
  classificationRecord: any,
  documentId: string,
  enhancedType: string
): Promise<void> {
  try {
    console.log(`🔗 Updating ${enhancedType} record ${classificationRecord.id} with document_id: ${documentId}`);

    // Determine which table to update based on enhanced type
    let tableName = '';
    if (enhancedType.includes('unfallbericht') || enhancedType.includes('unfall') || enhancedType.includes('accident')) {
      tableName = 'accident_reports';
    } else if (enhancedType.includes('schaden') || enhancedType.includes('damage')) {
      tableName = 'damage_reports';
    } else if (enhancedType.includes('kündigung') || enhancedType.includes('kuendigung') || enhancedType.includes('vertrag')) {
      tableName = 'contract_changes';
    } else if (enhancedType.includes('rechnung') || enhancedType.includes('invoice')) {
      tableName = 'invoices';
    } else {
      tableName = 'miscellaneous_documents';
    }

    // Use raw SQL to update the document_id
    const { error } = await supabaseService.client
      .from(tableName)
      .update({ document_id: documentId })
      .eq('id', classificationRecord.id);

    if (error) {
      console.error(`❌ Failed to update ${tableName} record:`, error);
      throw error;
    }

    console.log(`✅ Successfully linked ${tableName} record to document`);

  } catch (error) {
    console.error('❌ Failed to update classification with document_id:', error);
    // Don't throw - this is a non-critical update
  }
}