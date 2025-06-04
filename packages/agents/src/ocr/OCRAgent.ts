import { BaseAgent } from '../../../core/src/agents/BaseAgent';
import { AgentContext, AgentResult, AgentConfig, LogLevel } from '../../../shared/src/types/agent';
import { ErrorHandler, ErrorCodes, ValidationError } from '../../../core/src/errors/ErrorHandler';
import { DIContainer, ServiceTokens } from '../../../core/src/container/DIContainer';
import { LoggerService, SupabaseService, OpenAIService, PdfConverter, DocxConverter } from '../../../services/src';
import { DocumentRecord } from '../../../services/src/database/SupabaseService';

/**
 * OCR Agent Input/Output Types
 */
export interface OCRAgentInput {
  action: 'processDocument' | 'extractText' | 'analyzeImage' | 'classifyDocument';
  documentId?: string;
  imageBuffer?: Buffer;
  imageUrl?: string;
  documentType?: string;
  language?: string;
  filename?: string;
  mimeType?: string;
  extractionOptions?: {
    includeStructure: boolean;
    includeMetadata: boolean;
    confidenceThreshold: number;
  };
}

export interface OCRAgentOutput {
  status: 'success' | 'error';
  message: string;
  extractedText?: string;
  structuredData?: Record<string, any>;
  classification?: DocumentClassification;
  confidence?: number;
  language?: string;
  processingTime?: number;
  metadata?: OCRMetadata;
}

export interface DocumentClassification {
  type: string;
  category: string;
  confidence: number;
  summary: string;
  keyFields: Record<string, any>;
  language: string;
  reasoning?: string; // Optional Chain-of-Thought reasoning
}

export interface OCRMetadata {
  model: string;
  processingTime: number;
  imageSize?: {
    width: number;
    height: number;
  };
  textLength: number;
  wordCount: number;
  lineCount: number;
  pages?: number;
  source?: string;
  characterCount?: number;
}

/**
 * OCR Agent - AI-Powered Document Analysis
 * 
 * The OCR Agent uses GPT-4o Vision to:
 * - Extract text from images and PDFs with high accuracy
 * - Classify Swiss insurance documents automatically
 * - Structure extracted data into meaningful fields
 * - Support German/Swiss German language processing
 * - Provide confidence scores for quality assessment
 * - Handle complex document layouts and handwriting
 */
export class OCRAgent extends BaseAgent<OCRAgentInput, OCRAgentOutput> {
  private container: DIContainer;
  private logger!: LoggerService;
  private supabase!: SupabaseService;
  private openai!: OpenAIService;
  private pdfConverter!: PdfConverter;
  private docxConverter!: DocxConverter;
  private errorHandler!: ErrorHandler;

  // Swiss document classification patterns
  private readonly SWISS_DOCUMENT_TYPES = {
    'Schadenmeldung': ['schaden', 'damage', 'claim', 'meldung'],
    'Unfallmeldung': ['unfall', 'accident', 'ereignis', 'vorfall'],
    'Versicherungspolice': ['police', 'policy', 'vertrag', 'versicherung'],
    'Rechnung': ['rechnung', 'invoice', 'faktura', 'beleg'],
    'Arztbericht': ['arzt', 'doctor', 'medical', 'medizin', 'bericht'],
    'Kostenvoranschlag': ['kosten', 'estimate', 'offerte', 'angebot'],
    'Führerschein': ['führerschein', 'license', 'fahrausweis'],
    'Personalausweis': ['ausweis', 'identity', 'personal', 'id'],
    'Formular': ['formular', 'form', 'antrag', 'application']
  };

  constructor(config: AgentConfig, container: DIContainer) {
    super(config);
    this.container = container;
    this.errorHandler = ErrorHandler.getInstance();
  }

  async execute(input: OCRAgentInput, context: AgentContext): Promise<AgentResult<OCRAgentOutput>> {
    this.log(LogLevel.INFO, `OCR Agent executing action: ${input.action}`, { 
      action: input.action,
      hasImage: !!(input.imageBuffer || input.imageUrl),
      documentId: input.documentId,
      language: input.language || 'de'
    });

    const startTime = Date.now();

    try {
      let result: OCRAgentOutput;

      switch (input.action) {
        case 'processDocument':
          result = await this.handleDocumentProcessing(input, context);
          break;
        
        case 'extractText':
          result = await this.handleTextExtraction(input, context);
          break;
        
        case 'analyzeImage':
          result = await this.handleImageAnalysis(input, context);
          break;
        
        case 'classifyDocument':
          result = await this.handleDocumentClassification(input, context);
          break;
        
        default:
          throw this.errorHandler.createError(
            ErrorCodes.INVALID_INPUT,
            `Unknown action: ${input.action}`
          );
      }

      result.processingTime = Date.now() - startTime;
      
      this.log(LogLevel.INFO, 'OCR processing completed', {
        action: input.action,
        processingTime: result.processingTime,
        confidence: result.confidence,
        textLength: result.extractedText?.length || 0
      });

      return this.createSuccessResult(context, result);
    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.log(LogLevel.ERROR, 'OCR Agent execution failed', { error, input, processingTime });
      
      const agentError = this.errorHandler.handleError(error, { 
        action: input.action,
        documentId: input.documentId,
        processingTime
      });
      
      return this.createErrorResult(context, agentError);
    }
  }

  protected async initialize(): Promise<void> {
    this.log(LogLevel.INFO, 'Initializing OCR Agent...');

    try {
      // Resolve dependencies
      this.logger = await this.container.resolve<LoggerService>(ServiceTokens.LOGGER);
      this.supabase = await this.container.resolve<SupabaseService>(ServiceTokens.SUPABASE_SERVICE);
      this.openai = await this.container.resolve<OpenAIService>(ServiceTokens.OPENAI_SERVICE);
      this.pdfConverter = PdfConverter.getInstance();
      this.docxConverter = DocxConverter.getInstance();

      // Test OpenAI connection
      const models = await this.openai.getAvailableModels();
      if (!models.includes('gpt-4o')) {
        this.log(LogLevel.WARN, 'GPT-4o model not available, will use available vision model');
      }

      this.log(LogLevel.INFO, 'OCR Agent initialized successfully');
    } catch (error) {
      this.log(LogLevel.FATAL, 'OCR Agent initialization failed', { error });
      throw error;
    }
  }

  protected async cleanup(): Promise<void> {
    this.log(LogLevel.INFO, 'OCR Agent cleanup completed');
  }

  protected async performHealthCheck(): Promise<boolean> {
    try {
      // Check if dependencies are available
      if (!this.logger || !this.supabase || !this.openai) {
        return false;
      }

      // Test connections
      const dbHealthy = await this.supabase.testConnection();
      const aiHealthy = await this.openai.testConnection();

      return dbHealthy && aiHealthy;
    } catch (error) {
      this.log(LogLevel.ERROR, 'OCR Agent health check failed', { error });
      return false;
    }
  }

  // === DOCUMENT PROCESSING ===

  /**
   * Process complete document (comprehensive analysis)
   */
  private async handleDocumentProcessing(input: OCRAgentInput, _context: AgentContext): Promise<OCRAgentOutput> {
    if (!input.documentId && !input.imageBuffer && !input.imageUrl) {
      throw new ValidationError('Document ID, image buffer, or image URL is required');
    }

    let imageBuffer: Buffer;
    let documentRecord: DocumentRecord | null = null;

    // Get image data
    if (input.documentId) {
      documentRecord = await this.supabase.getDocument(input.documentId);
      if (!documentRecord) {
        throw this.errorHandler.createError(
          ErrorCodes.DOCUMENT_NOT_FOUND,
          `Document with ID ${input.documentId} not found`
        );
      }
      
      // Download file from storage
      imageBuffer = await this.supabase.downloadFile(documentRecord.file_path);
    } else if (input.imageBuffer) {
      imageBuffer = input.imageBuffer;
    } else if (input.imageUrl) {
      // For URL input, we'd need to fetch it - simplified for now
      throw new ValidationError('Image URL processing not implemented yet');
    } else {
      throw new ValidationError('No valid image source provided');
    }

    // Perform comprehensive document analysis
    const analysisResult = await this.performComprehensiveAnalysis(
      imageBuffer, 
      input.documentType || documentRecord?.document_type,
      input.language || 'de'
    );

    // Update database if document ID provided
    if (input.documentId && documentRecord) {
      await this.supabase.updateDocument(input.documentId, {
        status: 'verarbeitet',
        extracted_text: analysisResult.extractedText,
        extracted_data: analysisResult.structuredData,
        confidence_score: analysisResult.confidence,
        processing_notes: `Processed with ${analysisResult.classification?.type || 'OCR'} classification`
      });
    }

    return {
      status: 'success',
      message: 'Document processed successfully',
      extractedText: analysisResult.extractedText,
      structuredData: analysisResult.structuredData,
      classification: analysisResult.classification,
      confidence: analysisResult.confidence,
      language: analysisResult.language,
      metadata: analysisResult.metadata
    };
  }

  // === TEXT EXTRACTION ===

  /**
   * Extract text only (simple OCR)
   */
  private async handleTextExtraction(input: OCRAgentInput, _context: AgentContext): Promise<OCRAgentOutput> {
    if (!input.imageBuffer && !input.imageUrl) {
      throw new ValidationError('Image buffer or URL is required for text extraction');
    }

    const imageBuffer = input.imageBuffer!; // Simplified for now
    const language = input.language || 'de';

    // Detect if image might contain handwriting
    const isLikelyHandwriting = await this.detectHandwriting(imageBuffer);
    
    let extractedText: string;
    
    if (isLikelyHandwriting) {
      this.log(LogLevel.INFO, 'Handwriting detected, using multi-pass extraction strategy');
      extractedText = await this.extractHandwritingWithMultiPass(imageBuffer, language);
    } else {
      this.log(LogLevel.INFO, 'Regular text detected, using standard extraction');
      const { SwissDocumentPrompts } = await import('./prompts/SwissDocumentPrompts');
      const extractionPrompt = SwissDocumentPrompts.getTextExtractionPrompt();
      
      try {
        const visionResult = await this.openai.analyzeImage(
          imageBuffer,
          extractionPrompt,
          {
            temperature: 0.1,
            maxTokens: 4000
          }
        );
        extractedText = visionResult.content;
      } catch (error) {
        this.log(LogLevel.ERROR, 'Standard text extraction failed', { error });
        throw error;
      }
    }
    
    const wordCount = extractedText.split(/\s+/).length;
    const lineCount = extractedText.split('\n').length;

    const metadata: OCRMetadata = {
      model: isLikelyHandwriting ? 'gpt-4o-handwriting-multipass' : 'gpt-4o-vision',
      processingTime: 0, // Will be set by parent function
      textLength: extractedText.length,
      wordCount,
      lineCount
    };

    return {
      status: 'success',
      message: `Text extracted successfully (${wordCount} words)`,
      extractedText,
      confidence: 0.95, // GPT-4o generally has high confidence
      language,
      metadata
    };
  } catch (error: any) {
    this.log(LogLevel.ERROR, 'Text extraction failed', { error });
    throw error;
  }

  // === IMAGE ANALYSIS ===

  /**
   * Analyze image content and structure
   */
  private async handleImageAnalysis(input: OCRAgentInput, _context: AgentContext): Promise<OCRAgentOutput> {
    if (!input.imageBuffer && !input.imageUrl) {
      throw new ValidationError('Image buffer or URL is required for image analysis');
    }

    const imageBuffer = input.imageBuffer!;
    const language = input.language || 'de';

    const analysisPrompt = `Analysiere dieses Bild und beschreibe:
    1. Was für ein Dokument ist das?
    2. Welche Informationen sind sichtbar?
    3. Ist der Text klar lesbar?
    4. Gibt es handgeschriebene Teile?
    5. Ist das Dokument vollständig sichtbar?
    
    Antworte auf Deutsch in strukturierter Form.`;

    try {
      const visionResult = await this.openai.analyzeImage(
        imageBuffer,
        analysisPrompt,
        {
          temperature: 0.3,
          maxTokens: 1000
        }
      );

      const analysisText = visionResult.content;

      const metadata: OCRMetadata = {
        model: visionResult.model,
        processingTime: visionResult.executionTime,
        textLength: analysisText.length,
        wordCount: analysisText.split(/\s+/).length,
        lineCount: analysisText.split('\n').length
      };

      return {
        status: 'success',
        message: 'Image analysis completed',
        extractedText: analysisText,
        confidence: 0.9,
        language,
        metadata
      };
    } catch (error) {
      this.log(LogLevel.ERROR, 'Image analysis failed', { error });
      throw error;
    }
  }

  // === DOCUMENT CLASSIFICATION ===

  /**
   * Classify document type and extract key information
   */
  private async handleDocumentClassification(input: OCRAgentInput, context: AgentContext): Promise<OCRAgentOutput> {
    const startTime = Date.now();
    
    if (!input.imageBuffer && !input.imageUrl) {
      throw new ValidationError('Image buffer or URL is required for document classification');
    }

    let imageBuffer = input.imageBuffer!;
    const language = input.language || 'de';

    try {
      // Handle different file types
      if (input.mimeType === 'application/pdf') {
        this.log(LogLevel.INFO, 'Converting PDF to image for OCR processing');
        
        const conversionResult = await this.pdfConverter.getFirstPageAsImage(imageBuffer, 'png', 100);
        
        if (!conversionResult.success || !conversionResult.imageBuffer) {
          throw this.errorHandler.createError(
            ErrorCodes.OCR_PROCESSING_ERROR,
            `PDF conversion failed: ${conversionResult.error || 'Unknown error'}`
          );
        }
        
        imageBuffer = conversionResult.imageBuffer;
        this.log(LogLevel.INFO, 'PDF successfully converted to PNG for OCR');
      } 
      else if (input.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               input.filename?.toLowerCase().endsWith('.docx')) {
        this.log(LogLevel.INFO, 'Processing DOCX file - extracting text directly');
        
        const docxResult = await this.docxConverter.convertDocxToText(imageBuffer);
        
        if (!docxResult.success) {
          throw this.errorHandler.createError(
            ErrorCodes.OCR_PROCESSING_ERROR,
            `DOCX processing failed: ${docxResult.error || 'Unknown error'}`
          );
        }
        
        const extractedText = docxResult.text;
        this.log(LogLevel.INFO, `DOCX text extracted: ${extractedText.length} characters`);
        
        // For DOCX, we skip image OCR and directly classify based on text
        const classificationResult = await this.classifyDocumentFromText(extractedText, language);
        
        return {
          status: 'success',
          message: `DOCX document classified as: ${classificationResult.type}`,
          extractedText: extractedText,
          classification: classificationResult,
          confidence: classificationResult.confidence || 0.95,
          language: language,
          metadata: {
            model: 'docx_converter',
            processingTime: Date.now() - startTime,
            textLength: extractedText.length,
            wordCount: extractedText.split(/\s+/).length,
            lineCount: extractedText.split('\n').length,
            source: 'docx_extraction',
            characterCount: extractedText.length
          }
        };
      }

      // First extract text
      this.log(LogLevel.INFO, 'Extracting text from document...');
      const textResult = await this.handleTextExtraction({ 
        ...input, 
        imageBuffer, 
        action: 'extractText' 
      }, context);
      
      const extractedText = textResult.extractedText || '';
      this.log(LogLevel.INFO, `Text extracted: ${extractedText.length} characters`);
      
      // Then classify the document
      const classificationResult = await this.classifySwissDocument(imageBuffer, language);

      return {
        status: 'success',
        message: `Document classified as: ${classificationResult.type}`,
        extractedText: extractedText,
        classification: classificationResult,
        confidence: classificationResult.confidence,
        language: classificationResult.language,
        metadata: textResult.metadata
      };
    } catch (error) {
      this.log(LogLevel.ERROR, 'Document classification failed', { error });
      throw error;
    }
  }

  // === COMPREHENSIVE ANALYSIS ===

  /**
   * Perform comprehensive document analysis (text + classification + structure)
   */
  private async performComprehensiveAnalysis(
    imageBuffer: Buffer, 
    documentType?: string,
    language: string = 'de'
  ): Promise<{
    extractedText: string;
    structuredData: Record<string, any>;
    classification: DocumentClassification;
    confidence: number;
    language: string;
    metadata: OCRMetadata;
  }> {
    const prompt = documentType 
      ? `Analysiere dieses ${documentType}-Dokument aus der Schweiz:`
      : 'Analysiere dieses Schweizer Versicherungsdokument:';

    try {
      const visionResult = await this.openai.analyzeImage(
        imageBuffer,
        prompt,
        {
          temperature: 0.1,
          maxTokens: 4000
        }
      );

      // Parse JSON response
      const jsonMatch = visionResult.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw this.errorHandler.createError(
          ErrorCodes.OCR_PROCESSING_ERROR,
          'Invalid JSON response from vision analysis'
        );
      }

      const parsedResult = JSON.parse(jsonMatch[0]);

      // Enhance classification with Swiss patterns
      const enhancedClassification = this.enhanceClassificationWithPatterns(
        parsedResult.classification,
        parsedResult.extractedText
      );

      const metadata: OCRMetadata = {
        model: visionResult.model,
        processingTime: visionResult.executionTime,
        textLength: parsedResult.extractedText.length,
        wordCount: parsedResult.extractedText.split(/\s+/).length,
        lineCount: parsedResult.extractedText.split('\n').length
      };

      return {
        extractedText: parsedResult.extractedText,
        structuredData: parsedResult.structuredData,
        classification: enhancedClassification,
        confidence: enhancedClassification.confidence,
        language: parsedResult.classification.language || language,
        metadata
      };
    } catch (error) {
      this.log(LogLevel.ERROR, 'Comprehensive analysis failed', { error });
      throw error;
    }
  }

  // === SWISS DOCUMENT CLASSIFICATION ===

  /**
   * Classify document from extracted text (for DOCX files)
   */
  private async classifyDocumentFromText(extractedText: string, language: string): Promise<DocumentClassification> {
    try {
      const { SwissDocumentPrompts } = await import('./prompts/SwissDocumentPrompts');
      const textClassificationPrompt = `${SwissDocumentPrompts.getClassificationPrompt()}

TEXT INHALT:
${extractedText.substring(0, 2000)} ${extractedText.length > 2000 ? '...' : ''}

Analysiere den obigen TEXT und klassifiziere das Dokument nach den gleichen Regeln.`;

      const textResult = await this.openai.generateText(
        textClassificationPrompt,
        {
          temperature: 0.1,
          maxTokens: 1000,
          model: 'gpt-4'
        }
      );

      const content = textResult.content.trim();
      
      // Parse JSON response
      let classification: DocumentClassification;
      
      try {
        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const rawClassification = JSON.parse(jsonMatch[0]);
          classification = this.validateAndCleanClassification(rawClassification, language);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        this.log(LogLevel.WARN, 'Failed to parse classification JSON from text, using fallback', { parseError });
        classification = this.createFallbackClassification(extractedText, language);
      }

      // Enhance with Swiss patterns
      classification = this.enhanceClassificationWithPatterns(classification, extractedText);
      
      this.log(LogLevel.INFO, 'Document text classification completed', {
        type: classification.type,
        confidence: classification.confidence,
        textLength: extractedText.length
      });

      return classification;

    } catch (error) {
      this.log(LogLevel.ERROR, 'Text classification failed', { error });
      return this.createFallbackClassification(extractedText, language);
    }
  }

  /**
   * Classify Swiss insurance documents with local patterns
   */
  private async classifySwissDocument(imageBuffer: Buffer, language: string): Promise<DocumentClassification> {
    // Check if handwriting is present
    const isLikelyHandwriting = await this.detectHandwriting(imageBuffer);
    
    let prompt: string;
    if (isLikelyHandwriting) {
      this.log(LogLevel.INFO, 'Using handwriting-specific classification');
      const { HandwritingPrompts } = await import('./prompts/HandwritingPrompts');
      prompt = HandwritingPrompts.getHandwritingClassificationPrompt();
    } else {
      const { SwissDocumentPrompts } = await import('./prompts/SwissDocumentPrompts');
      prompt = SwissDocumentPrompts.getClassificationPrompt();
    }

    try {
      const visionResult = await this.openai.analyzeImage(
        imageBuffer,
        prompt,
        {
          temperature: 0.1,
          maxTokens: 1000
        }
      );

      const content = visionResult.content.trim();
      
      // Robuste JSON-Extraktion mit verbesserter Parsing-Logik
      let classification: DocumentClassification;
      
      try {
        // Strategie 1: Direkte Parsing
        const cleanContent = content.trim();
        classification = JSON.parse(cleanContent);
        
        // Validierung der neuen Prompt-Struktur
        if (classification.reasoning) {
          this.log(LogLevel.INFO, 'Chain-of-thought reasoning detected', { 
            reasoning: classification.reasoning.substring(0, 100) 
          });
        }
        
      } catch (directError) {
        try {
          // Strategie 2: JSON aus Text extrahieren (verbessert)
          const jsonMatch = content.match(/\{[\s\S]*?\}(?=\s*$|\s*```|\s*\n\n)/);
          if (jsonMatch) {
            classification = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No valid JSON found in response');
          }
        } catch (extractError) {
          // Strategie 3: Intelligente Fallback-Klassifizierung
          this.log(LogLevel.WARN, 'Advanced JSON parsing failed, using intelligent fallback', { 
            content: content.substring(0, 300),
            error: extractError 
          });
          
          classification = this.createIntelligentFallbackClassification(content, language);
        }
      }

      // Validierung und Bereinigung
      classification = this.validateAndCleanClassification(classification, language);

      return this.enhanceClassificationWithPatterns(classification, content);
    } catch (error) {
      this.log(LogLevel.ERROR, 'Swiss document classification failed', { error });
      
      // Ultimative Fallback-Klassifizierung
      return {
        type: 'Unbekanntes Dokument',
        category: 'Sonstiges',
        confidence: 0.1,
        summary: 'Klassifizierung fehlgeschlagen',
        keyFields: {},
        language: language
      };
    }
  }

  /**
   * Create intelligent fallback classification using advanced pattern matching
   */
  private createIntelligentFallbackClassification(content: string, language: string): DocumentClassification {
    const textLower = content.toLowerCase();
    
    // Advanced pattern matching with confidence scoring
    const patterns = {
      'Unfallbericht': {
        primary: ['uvg', 'unfall', 'verletzung', 'suva', 'arbeitsunfall'],
        secondary: ['schadenmeldung uvg', 'unfallort', 'unfallzeit', 'körperteil'],
        confidence: 0.9
      },
      'Kündigungsschreiben': {
        primary: ['kündigung', 'kündigen', 'vertragskündigung', 'police beenden'],
        secondary: ['hiermit kündige', 'zum nächstmöglichen', 'versicherungsvertrag'],
        confidence: 0.85
      },
      'Schadenmeldung': {
        primary: ['schaden', 'schadensmeldung', 'diebstahl', 'brand'],
        secondary: ['sachschaden', 'gebäudeschaden', 'wasserschaden'],
        confidence: 0.8
      },
      'Rechnung': {
        primary: ['rechnung', 'faktura', 'chf', 'betrag'],
        secondary: ['rechnungsdatum', 'fälligkeitsdatum', 'mwst'],
        confidence: 0.75
      }
    };
    
    let bestMatch = { type: 'Sonstiges Dokument', confidence: 0.3, matches: 0 };
    
    for (const [docType, pattern] of Object.entries(patterns)) {
      const primaryMatches = pattern.primary.filter(keyword => textLower.includes(keyword)).length;
      const secondaryMatches = pattern.secondary.filter(keyword => textLower.includes(keyword)).length;
      
      const totalMatches = primaryMatches * 2 + secondaryMatches; // Primary keywords count double
      const confidence = Math.min(pattern.confidence, 0.3 + (totalMatches * 0.15));
      
      if (totalMatches > bestMatch.matches || 
          (totalMatches === bestMatch.matches && confidence > bestMatch.confidence)) {
        bestMatch = { type: docType, confidence, matches: totalMatches };
      }
    }
    
    // Extract basic fields using improved regex patterns
    const keyFields = this.extractAdvancedFields(content);
    
    return {
      type: bestMatch.type,
      category: this.getCategoryFromType(bestMatch.type),
      confidence: bestMatch.confidence,
      summary: `Intelligente Klassifizierung: ${bestMatch.type} (${bestMatch.matches} Übereinstimmungen)`,
      keyFields,
      language: language
    };
  }
  
  /**
   * Get category from document type
   */
  private getCategoryFromType(type: string): string {
    const categoryMap: Record<string, string> = {
      'Unfallbericht': 'Versicherung',
      'Schadenmeldung': 'Versicherung', 
      'Kündigungsschreiben': 'Verwaltung',
      'Rechnung': 'Finanzen',
      'Sonstiges Dokument': 'Sonstiges'
    };
    return categoryMap[type] || 'Sonstiges';
  }

  /**
   * Extract advanced fields with better pattern recognition
   */
  private extractAdvancedFields(content: string): Record<string, any> {
    const fields: Record<string, any> = {};
    
    // Swiss-specific patterns (improved)
    const patterns = {
      ahv_number: /756\.\d{4}\.\d{4}\.\d{2}/g,
      swiss_phone: /(?:\+41|0)[\s\-]?(?:7[6-9]|4[4-6]|3[1-6]|2[1-6])[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}/g,
      swiss_postal: /\b(?:100[0-9]|[1-9]\d{3})\b/g,
      amount_chf: /CHF[\s]?([0-9,'.']+)|([0-9,'.']+)[\s]?CHF/gi,
      date_swiss: /\b(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{2,4})\b/g,
      document_number: /(?:Nr|Nummer|Number)[\s\.:]*([A-Z0-9\-\.]{4,20})/gi,
      person_name: /(?:Name|Herr|Frau)[\s:]+([A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+)/g
    };
    
    // Extract AHV numbers
    const ahvMatches = content.match(patterns.ahv_number);
    if (ahvMatches) fields.ahv_number = ahvMatches[0];
    
    // Extract phone numbers
    const phoneMatches = content.match(patterns.swiss_phone);
    if (phoneMatches) fields.phone_number = phoneMatches[0];
    
    // Extract amounts
    const amountMatches = content.match(patterns.amount_chf);
    if (amountMatches) {
      const amount = parseFloat(amountMatches[0].replace(/[^\d.,]/g, '').replace(',', '.'));
      if (!isNaN(amount)) fields.amount = amount;
    }
    
    // Extract dates
    const dateMatches = content.match(patterns.date_swiss);
    if (dateMatches) {
      fields.dates_found = dateMatches.slice(0, 3); // Max 3 dates
      fields.document_date = this.convertSwissDateToISO(dateMatches[0]);
    }
    
    // Extract document numbers
    const docNumberMatches = content.match(patterns.document_number);
    if (docNumberMatches) fields.document_number = docNumberMatches[0].split(/[\s:.]/)[1];
    
    // Extract person names (basic)
    const nameMatches = content.match(patterns.person_name);
    if (nameMatches) fields.person_name = nameMatches[0].replace(/^(Name|Herr|Frau)[\s:]+/, '');
    
    return fields;
  }
  
  /**
   * Convert Swiss date format to ISO
   */
  private convertSwissDateToISO(dateStr: string): string {
    const match = dateStr.match(/(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{2,4})/);
    if (!match) return dateStr;
    
    let [, day, month, year] = match;
    if (year.length === 2) {
      year = '20' + year; // Assume 20xx for 2-digit years
    }
    
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  /**
   * Extract document type from text when JSON parsing fails (legacy method)
   */
  private _extractDocumentTypeFromText(content: string): string {
    const textLower = content.toLowerCase();
    
    for (const [docType, keywords] of Object.entries(this.SWISS_DOCUMENT_TYPES)) {
      const matchCount = keywords.filter(keyword => textLower.includes(keyword)).length;
      if (matchCount > 0) {
        return docType;
      }
    }
    
    return 'Unbekanntes Dokument';
  }

  /**
   * Extract basic fields from text
   */
  private _extractBasicFields(content: string): Record<string, any> {
    const fields: Record<string, any> = {};
    
    // Basic pattern matching for common fields
    const datePattern = /\d{1,2}[.\/]\d{1,2}[.\/]\d{2,4}/g;
    const dates = content.match(datePattern);
    if (dates) {
      fields.erkannte_daten = dates.slice(0, 3); // Max 3 dates
    }
    
    // Extract numbers that could be important
    const numberPattern = /\b\d{3,}\b/g;
    const numbers = content.match(numberPattern);
    if (numbers) {
      fields.nummern = numbers.slice(0, 3); // Max 3 numbers
    }
    
    return fields;
  }

  /**
   * Validate and clean classification object
   */
  private validateAndCleanClassification(
    classification: any, 
    language: string
  ): DocumentClassification {
    return {
      type: classification.type || 'Unbekanntes Dokument',
      category: classification.category || 'Sonstiges',
      confidence: Math.min(Math.max(classification.confidence || 0.5, 0), 1),
      summary: classification.summary || 'Keine Beschreibung verfügbar',
      keyFields: classification.keyFields || {},
      language: classification.language || language
    };
  }

  /**
   * Create fallback classification when parsing fails
   */
  private createFallbackClassification(text: string, language: string): DocumentClassification {
    const textLower = text.toLowerCase();
    
    // Simple keyword-based classification as fallback
    let type = 'Unbekanntes Dokument';
    let confidence = 0.6;
    
    if (textLower.includes('kündigung') || textLower.includes('kuendigung')) {
      type = 'Kündigungsschreiben';
      confidence = 0.7;
    } else if (textLower.includes('schaden') || textLower.includes('damage')) {
      type = 'Schadenmeldung';
      confidence = 0.7;
    } else if (textLower.includes('unfall') || textLower.includes('accident')) {
      type = 'Unfallbericht';
      confidence = 0.7;
    } else if (textLower.includes('rechnung') || textLower.includes('invoice')) {
      type = 'Rechnung';
      confidence = 0.7;
    } else if (textLower.includes('vertrag') || textLower.includes('police')) {
      type = 'Versicherungspolice';
      confidence = 0.7;
    } else if (textLower.includes('formular') || textLower.includes('antrag')) {
      type = 'Formular';
      confidence = 0.6;
    }
    
    return {
      type,
      category: 'Versicherung',
      confidence,
      summary: `Automatisch klassifiziertes Dokument mit ${text.length} Zeichen`,
      keyFields: {},
      language
    };
  }

  /**
   * Enhance classification with Swiss document patterns
   */
  private enhanceClassificationWithPatterns(
    classification: DocumentClassification,
    extractedText: string
  ): DocumentClassification {
    const textLower = extractedText.toLowerCase();

    // Check against Swiss document patterns
    for (const [docType, keywords] of Object.entries(this.SWISS_DOCUMENT_TYPES)) {
      const matchCount = keywords.filter(keyword => textLower.includes(keyword)).length;
      
      if (matchCount > 0) {
        // Boost confidence if patterns match
        const patternBoost = Math.min(0.1, matchCount * 0.03);
        classification.confidence = Math.min(0.99, classification.confidence + patternBoost);
        
        // Update type if high match
        if (matchCount >= 2 && classification.confidence > 0.8) {
          classification.type = docType;
        }
      }
    }

    // Swiss-specific field detection
    if (textLower.includes('ahv') || textLower.includes('756.')) {
      classification.keyFields.ahv_number = 'detected';
    }
    
    if (textLower.includes('iban') || textLower.includes('ch')) {
      classification.keyFields.swiss_bank = 'detected';
    }

    return classification;
  }

  /**
   * Database schema mapping for exact column names and requirements
   */
  private getTableSchema(documentType: string): { required: Record<string, string>, optional: Record<string, string>, tableName: string } {
    const type = documentType.toLowerCase();

    if (type.includes('unfallbericht') || type.includes('unfall') || type.includes('accident') || type.includes('uvg')) {
      return {
        tableName: 'accident_reports',
        required: {
          name: 'Vollständiger Name der betroffenen Person',
          geburtsdatum: 'Geburtsdatum im Format YYYY-MM-DD',
          ahv_nummer: 'AHV-Nummer im Format 756.XXXX.XXXX.XX',
          unfall_datum: 'Unfalldatum im Format YYYY-MM-DD',
          unfall_zeit: 'Unfallzeit im Format HH:MM:SS',
          unfall_ort: 'Genauer Unfallort',
          unfall_beschreibung: 'Detaillierte Unfallbeschreibung',
          verletzung_art: 'Art der Verletzung',
          verletzung_koerperteil: 'Betroffener Körperteil'
        },
        optional: {
          document_id: 'Dokument ID (automatisch)',
          schaden_nummer: 'Schadensnummer falls vorhanden',
          kontakt_telefon: 'Telefonnummer',
          status: 'Status (automatisch auf eingereicht)'
        }
      };
    }

    if (type.includes('schadenmeldung') || type.includes('schaden') || type.includes('damage')) {
      return {
        tableName: 'damage_reports',
        required: {
          name: 'Vollständiger Name der versicherten Person',
          adresse: 'Vollständige Adresse',
          schaden_datum: 'Schadensdatum im Format YYYY-MM-DD',
          schaden_ort: 'Genauer Ort des Schadens',
          schaden_beschreibung: 'Detaillierte Beschreibung des Schadens',
          zusammenfassung: 'Kurze Zusammenfassung des Schadens'
        },
        optional: {
          document_id: 'Dokument ID (automatisch)',
          versicherungsnummer: 'Versicherungsnummer falls vorhanden',
          status: 'Status (automatisch auf eingereicht)',
          damage_status: 'Schadensstatus (automatisch auf gemeldet)'
        }
      };
    }

    if (type.includes('kündigungsschreiben') || type.includes('kündigung') || type.includes('kuendigung') || type.includes('vertrag')) {
      return {
        tableName: 'contract_changes',
        required: {
          name: 'Vollständiger Name des Kunden',
          adresse: 'Vollständige Adresse des Kunden',
          aenderung_typ: 'Art der Änderung: "kuendigung", "aenderung", "anpassung", "stornierung" oder "sonstiges"',
          aenderung_beschreibung: 'Detaillierte Beschreibung der Änderung',
          zusammenfassung: 'Kurze Zusammenfassung der Vertragsänderung'
        },
        optional: {
          document_id: 'Dokument ID (automatisch)',
          status: 'Status (automatisch auf eingereicht)'
        }
      };
    }

    if (type.includes('rechnung') || type.includes('invoice') || type.includes('faktura')) {
      return {
        tableName: 'invoices',
        required: {
          rechnungsdatum: 'Rechnungsdatum im Format YYYY-MM-DD',
          faelligkeitsdatum: 'Fälligkeitsdatum im Format YYYY-MM-DD',
          betrag: 'Rechnungsbetrag als Zahl (ohne Währung)',
          waehrung: 'Währung (CHF, EUR, etc.)',
          empfaenger: 'Name des Rechnungsempfängers',
          beschreibung: 'Beschreibung der Rechnungsposition',
          zusammenfassung: 'Kurze Zusammenfassung der Rechnung'
        },
        optional: {
          document_id: 'Dokument ID (automatisch)',
          rechnungsnummer: 'Rechnungsnummer falls vorhanden',
          status: 'Status (automatisch auf eingereicht)',
          invoice_status: 'Rechnungsstatus (automatisch auf ausstehend)'
        }
      };
    }

    // Fallback für miscellaneous_documents
    return {
      tableName: 'miscellaneous_documents',
      required: {
        title: 'Dokumententitel',
        summary: 'Kurze Zusammenfassung des Dokumentinhalts'
      },
      optional: {
        document_id: 'Dokument ID (automatisch)',
        document_date: 'Dokumentendatum im Format YYYY-MM-DD falls vorhanden',
        status: 'Status (automatisch auf eingereicht)'
      }
    };
  }

  /**
   * Extract structured data based on document type
   */
  async extractStructuredData(
    _imageBuffer: Buffer,
    documentType: string,
    extractedText: string,
    _language: string = 'de'
  ): Promise<Record<string, any>> {
    
    // Get exact database schema for this document type
    const schema = this.getTableSchema(documentType);
    
    // Build dynamic prompt based on actual database schema
    const requiredFields = Object.entries(schema.required).map(([field, description]) => 
      `  "${field}": "${description}"`
    ).join(',\n');
    
    const optionalFields = Object.entries(schema.optional).map(([field, description]) => 
      `  "${field}": "${description} (optional)"`
    ).join(',\n');

    const prompt = `
Extrahiere aus diesem ${documentType}-Dokument EXAKT folgende Felder für die Datenbank-Tabelle "${schema.tableName}":

PFLICHTFELDER (müssen extrahiert werden):
{
${requiredFields}
}

OPTIONALE FELDER (falls im Dokument vorhanden):
{
${optionalFields}
}

WICHTIGE HINWEISE:
- Verwende EXAKT die angegebenen Feldnamen
- Datumsfelder im Format YYYY-MM-DD
- Zeitfelder im Format HH:MM:SS
- Beträge als Zahl ohne Währungszeichen
- Bei fehlenden Pflichtfeldern verwende "Nicht angegeben"
- Bei fehlenden optionalen Feldern verwende null
- Antworte NUR mit gültigem JSON`;

    const systemPrompt = `Du bist ein Experte für die Extraktion strukturierter Daten aus Schweizer Versicherungsdokumenten.
Analysiere den folgenden Text und extrahiere ALLE verfügbaren Informationen.
Wenn ein Feld nicht gefunden wird, verwende "Nicht angegeben" für Textfelder oder null für Datumsfelder.
Für Beträge verwende 0 wenn nicht gefunden.
Antworte NUR mit gültigem JSON ohne zusätzlichen Text.

Extrahierter Text:
${extractedText}

${prompt}`;

    try {
      const result = await this.openai.generateText(
        systemPrompt,
        {
          temperature: 0.1,
          maxTokens: 1000
        }
      );

      // Parse JSON response
      let extractedData: Record<string, any>;
      try {
        const resultText = typeof result === 'string' ? result : (result as any).content || '';
        extractedData = JSON.parse(resultText);
      } catch (parseError) {
        const resultText = typeof result === 'string' ? result : (result as any).content || '';
        this.log(LogLevel.WARN, 'Failed to parse structured data JSON, using text analysis', { 
          content: resultText.substring(0, 200),
          error: parseError 
        });
        
        // Fallback: simple text extraction
        extractedData = this.extractDataFromText(extractedText, documentType);
      }

      // Validate required fields
      const validatedData = this.validateAndEnforceSchema(extractedData, schema);

      this.log(LogLevel.INFO, 'Structured data extracted successfully', { 
        documentType, 
        tableName: schema.tableName,
        fieldsExtracted: Object.keys(validatedData).length,
        requiredFieldsMissing: Object.keys(schema.required).filter(field => !validatedData[field] || validatedData[field] === 'Nicht angegeben').length
      });

      return validatedData;

    } catch (error) {
      this.log(LogLevel.ERROR, 'Structured data extraction failed', { error, documentType });
      
      // Return minimal fallback data
      return this.extractDataFromText(extractedText, documentType);
    }
  }

  /**
   * Fallback method to extract basic data from text
   */
  private extractDataFromText(text: string, documentType: string): Record<string, any> {
    const fallbackData: Record<string, any> = {};

    // Basic patterns for Swiss documents
    const patterns = {
      versicherungsnummer: /(?:Versicherungs|Police|Vertrag).*?(?:Nr|Nummer)[\s\.:]*([A-Z0-9\-\.]{8,20})/gi,
      ahv_nummer: /756\.\d{4}\.\d{4}\.\d{2}/g,
      iban: /CH\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{1}/gi,
      phone: /(?:\+41|0)[\s\-]?\d{2}[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}/g,
      email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      amount: /CHF[\s]?([0-9,.']+)|([0-9,.']+)[\s]?CHF/gi,
      date: /\b(\d{1,2}[\.\-\/]\d{1,2}[\.\-\/]\d{2,4})\b/g
    };

    // Extract basic information
    const versicherungMatch = text.match(patterns.versicherungsnummer);
    if (versicherungMatch) fallbackData.versicherungsnummer = versicherungMatch[0];

    const ahvMatch = text.match(patterns.ahv_nummer);
    if (ahvMatch) fallbackData.ahv_nummer = ahvMatch[0];

    const phoneMatch = text.match(patterns.phone);
    if (phoneMatch) fallbackData.kontakt_telefon = phoneMatch[0];

    const dateMatches = text.match(patterns.date);
    if (dateMatches && dateMatches.length > 0) {
      // Convert to ISO format
      const dateStr = dateMatches[0].replace(/\./g, '-');
      fallbackData.document_date = dateStr;
      
      if (documentType.includes('schaden')) {
        fallbackData.schaden_datum = dateStr;
      } else if (documentType.includes('unfall')) {
        fallbackData.unfall_datum = dateStr;
      } else if (documentType.includes('rechnung')) {
        fallbackData.rechnungsdatum = dateStr;
      }
    }

    const amountMatch = text.match(patterns.amount);
    if (amountMatch) {
      const amount = parseFloat(amountMatch[0].replace(/[^\d.,]/g, '').replace(',', '.'));
      if (!isNaN(amount)) fallbackData.betrag = amount;
    }

    // Document type specific defaults
    if (documentType.includes('schaden')) {
      fallbackData.name = fallbackData.name || 'Nicht angegeben';
      fallbackData.adresse = fallbackData.adresse || 'Nicht angegeben';
      fallbackData.schaden_ort = fallbackData.schaden_ort || 'Nicht angegeben';
      fallbackData.schaden_beschreibung = fallbackData.schaden_beschreibung || 'Aus OCR extrahiert';
      fallbackData.zusammenfassung = fallbackData.zusammenfassung || 'Automatisch verarbeitet';
    }

    return fallbackData;
  }

  /**
   * Validate and enforce database schema requirements
   */
  /**
   * Detect if image contains handwriting using GPT-4o Vision
   */
  private async detectHandwriting(imageBuffer: Buffer): Promise<boolean> {
    try {
      const handwritingDetectionPrompt = `Analysiere dieses Bild und bestimme:
      Ist handgeschriebener Text vorhanden?
      
      Antworte nur mit JA oder NEIN.
      
      Kriterien für JA:
      - Handschriftliche Notizen sichtbar
      - Ausgefüllte Formularfelder mit Handschrift
      - Unterschriften oder handgeschriebene Namen
      - Persönliche Anmerkungen in Handschrift
      
      Kriterien für NEIN:
      - Nur gedruckter/maschineller Text
      - Nur digitale/getippte Inhalte
      - Screenshots von digitalen Dokumenten ohne Handschrift`;

      const result = await this.openai.analyzeImage(
        imageBuffer,
        handwritingDetectionPrompt,
        {
          temperature: 0.1,
          maxTokens: 10
        }
      );

      const response = result.content.trim().toUpperCase();
      const isHandwriting = response.includes('JA') || response.includes('YES');
      
      this.log(LogLevel.INFO, `Handwriting detection result: ${response}`, { 
        isHandwriting,
        confidence: isHandwriting ? 0.9 : 0.1
      });
      
      return isHandwriting;
    } catch (error) {
      this.log(LogLevel.WARN, 'Handwriting detection failed, assuming no handwriting', { error });
      return false;
    }
  }

  /**
   * Advanced handwriting extraction with multi-pass strategy
   */
  private async extractHandwritingWithMultiPass(imageBuffer: Buffer, _language: string = 'de'): Promise<string> {
    const { HandwritingPrompts } = await import('./prompts/HandwritingPrompts');
    const prompts = HandwritingPrompts.getMultiPassPrompts();
    
    // Try each prompt strategy until we get good results
    for (let i = 0; i < prompts.length; i++) {
      try {
        this.log(LogLevel.INFO, `Attempting handwriting extraction - Pass ${i + 1}/${prompts.length}`);
        
        const result = await this.openai.analyzeImage(
          imageBuffer,
          prompts[i],
          {
            temperature: 0.1,
            maxTokens: 4000
          }
        );

        const extractedText = result.content.trim();
        
        // Check if we got a valid response (not a refusal)
        if (extractedText && 
            extractedText.length > 50 && 
            !extractedText.toLowerCase().includes("can't assist") &&
            !extractedText.toLowerCase().includes("sorry") &&
            !extractedText.toLowerCase().includes("unable to")) {
          
          this.log(LogLevel.INFO, `Handwriting extraction successful on pass ${i + 1}`, {
            textLength: extractedText.length,
            prompt: `Pass ${i + 1}`
          });
          
          return extractedText;
        }
        
        this.log(LogLevel.WARN, `Pass ${i + 1} failed or returned refusal`, {
          textLength: extractedText.length,
          content: extractedText.substring(0, 100)
        });
        
      } catch (error) {
        this.log(LogLevel.WARN, `Pass ${i + 1} threw error`, { error });
        continue;
      }
    }
    
    // If all passes failed, try the grid paper specialized prompt
    try {
      this.log(LogLevel.INFO, 'Attempting grid paper specialized extraction');
      const gridPrompt = HandwritingPrompts.getGridPaperPrompt();
      
      const result = await this.openai.analyzeImage(
        imageBuffer,
        gridPrompt,
        {
          temperature: 0.2,
          maxTokens: 4000
        }
      );
      
      const extractedText = result.content.trim();
      if (extractedText && extractedText.length > 20) {
        return extractedText;
      }
    } catch (error) {
      this.log(LogLevel.ERROR, 'Grid paper extraction failed', { error });
    }
    
    // Final fallback
    return 'Handschrift konnte nicht vollständig erkannt werden. Möglicherweise zu unleserlich oder blockiert durch Sicherheitsfilter.';
  }

  private validateAndEnforceSchema(
    extractedData: Record<string, any>, 
    schema: { required: Record<string, string>, optional: Record<string, string>, tableName: string }
  ): Record<string, any> {
    const validatedData: Record<string, any> = {};

    // Ensure all required fields are present
    for (const [fieldName, description] of Object.entries(schema.required)) {
      let value = extractedData[fieldName];
      
      // Handle empty or null values for required fields
      if (!value || value === null || value === '') {
        if (fieldName.includes('datum') || fieldName.includes('date')) {
          // Default date for required date fields
          if (fieldName === 'geburtsdatum') {
            value = '1900-01-01'; // Placeholder for unknown birth date
          } else {
            value = new Date().toISOString().split('T')[0]; // Today's date
          }
        } else if (fieldName.includes('zeit') || fieldName.includes('time')) {
          value = '00:00:00'; // Default time
        } else if (fieldName.includes('betrag') || fieldName.includes('amount')) {
          value = 0; // Default amount
        } else if (fieldName === 'ahv_nummer') {
          value = '000.00.000.000'; // Placeholder AHV number
        } else {
          value = 'Nicht angegeben'; // Default text for missing fields
        }
        
        this.log(LogLevel.WARN, `Required field '${fieldName}' missing, using fallback: ${value}`, {
          tableName: schema.tableName,
          fieldDescription: description
        });
      }
      
      validatedData[fieldName] = value;
    }

    // Add optional fields if present
    for (const [fieldName] of Object.entries(schema.optional)) {
      if (extractedData[fieldName] !== undefined && extractedData[fieldName] !== null) {
        validatedData[fieldName] = extractedData[fieldName];
      }
    }

    // Format dates properly
    for (const [fieldName, value] of Object.entries(validatedData)) {
      if ((fieldName.includes('datum') || fieldName.includes('date')) && typeof value === 'string') {
        // Convert various date formats to YYYY-MM-DD
        const dateMatch = value.match(/(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{2,4})/);
        if (dateMatch) {
          let [, day, month, year] = dateMatch;
          if (year.length === 2) {
            year = '20' + year; // Assume 20xx for 2-digit years
          }
          validatedData[fieldName] = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }
    }

    return validatedData;
  }
}