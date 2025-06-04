import OpenAI from 'openai';
import { ConfigService } from '../config/ConfigService';
import { LoggerService } from '../logging/LoggerService';
import { ErrorHandler, ErrorCodes, ExternalServiceError } from '../../../core/src/errors/ErrorHandler';

/**
 * Text generation options
 */
export interface TextGenerationOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  stream?: boolean;
  timeout?: number;
}

/**
 * Vision analysis options
 */
export interface VisionAnalysisOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  detail?: 'low' | 'high' | 'auto';
  timeout?: number;
}

/**
 * Text generation result
 */
export interface TextGenerationResult {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason: string;
  executionTime: number;
}

/**
 * Vision analysis result
 */
export interface VisionAnalysisResult {
  content: string;
  confidence?: number;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  executionTime: number;
}

/**
 * Document classification result
 */
export interface DocumentClassificationResult {
  type: string;
  confidence: number;
  summary: string;
  keyFields?: Record<string, any>;
  language?: string;
}

/**
 * Email classification result
 */
export interface EmailClassificationResult {
  category: 'DOCUMENT_SUBMISSION' | 'QUESTION' | 'APPOINTMENT_REQUEST' | 'FEEDBACK' | 'OTHER';
  confidence: number;
  summary: string;
  priority: 'low' | 'medium' | 'high';
  suggestedAction?: string;
}

/**
 * OpenAI Service for AlphaAgents
 * 
 * Provides AI capabilities including text generation, vision analysis,
 * document classification, and email processing with proper error handling
 * and Swiss German language support.
 */
export class OpenAIService {
  private static instance: OpenAIService;
  private client!: OpenAI;
  private logger: LoggerService;
  private config: ConfigService;
  private errorHandler: ErrorHandler;

  private constructor() {
    this.config = ConfigService.getInstance();
    this.logger = LoggerService.getInstance().child({ component: 'openai' });
    this.errorHandler = ErrorHandler.getInstance();
    
    this.validateConfiguration();
    this.initializeClient();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  /**
   * Validate required configuration
   */
  private validateConfiguration(): void {
    try {
      this.config.validateFeatureConfig('openai');
    } catch (error) {
      this.logger.fatal('OpenAI configuration validation failed', error);
      throw error;
    }
  }

  /**
   * Initialize OpenAI client
   */
  private initializeClient(): void {
    try {
      const openaiConfig = this.config.getOpenAIConfig();
      
      this.client = new OpenAI({
        apiKey: openaiConfig.apiKey,
        organization: openaiConfig.organization,
        timeout: openaiConfig.timeout
      });

      this.logger.info('OpenAI client initialized successfully', {
        defaultModel: openaiConfig.defaultModel,
        visionModel: openaiConfig.visionModel,
        timeout: openaiConfig.timeout
      });
    } catch (error) {
      const openaiError = this.errorHandler.wrapExternalError(
        ErrorCodes.OPENAI_API_ERROR,
        error,
        false
      );
      this.logger.fatal('Failed to initialize OpenAI client', openaiError);
      throw openaiError;
    }
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.models.list();
      
      if (response.data && response.data.length > 0) {
        this.logger.debug('OpenAI API connection test successful', {
          modelCount: response.data.length
        });
        return true;
      }
      
      return false;
    } catch (error) {
      this.logger.error('OpenAI API connection test failed', error);
      return false;
    }
  }

  // === TEXT GENERATION ===

  /**
   * Generate text response
   */
  async generateText(
    prompt: string,
    options: TextGenerationOptions = {}
  ): Promise<TextGenerationResult> {
    const startTime = Date.now();
    const openaiConfig = this.config.getOpenAIConfig();
    
    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
      
      // Add system prompt if provided
      if (options.systemPrompt) {
        messages.push({
          role: 'system',
          content: options.systemPrompt
        });
      }
      
      messages.push({
        role: 'user',
        content: prompt
      });

      const response = await this.client.chat.completions.create({
        model: options.model || openaiConfig.defaultModel,
        messages,
        max_tokens: options.maxTokens || openaiConfig.maxTokens,
        temperature: options.temperature ?? openaiConfig.temperature,
        stream: options.stream || false
      });

      // Handle streaming vs non-streaming responses
      if (options.stream) {
        throw new ExternalServiceError(
          ErrorCodes.OPENAI_API_ERROR,
          'Streaming not supported in this method',
          false
        );
      }

      const nonStreamResponse = response as OpenAI.Chat.Completions.ChatCompletion;
      const choice = nonStreamResponse.choices[0];
      const executionTime = Date.now() - startTime;

      if (!choice.message.content) {
        throw new ExternalServiceError(
          ErrorCodes.OPENAI_API_ERROR,
          'No content generated',
          true
        );
      }

      const result: TextGenerationResult = {
        content: choice.message.content,
        usage: {
          promptTokens: nonStreamResponse.usage?.prompt_tokens || 0,
          completionTokens: nonStreamResponse.usage?.completion_tokens || 0,
          totalTokens: nonStreamResponse.usage?.total_tokens || 0
        },
        model: nonStreamResponse.model,
        finishReason: choice.finish_reason || 'unknown',
        executionTime
      };

      this.logger.info('Text generation completed', {
        model: result.model,
        executionTime,
        totalTokens: result.usage.totalTokens,
        finishReason: result.finishReason
      });

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.logger.error('Text generation failed', error, { executionTime });
      
      if (error instanceof ExternalServiceError) {
        throw error;
      }
      
      throw this.errorHandler.wrapExternalError(ErrorCodes.OPENAI_API_ERROR, error, true);
    }
  }

  // === VISION ANALYSIS ===

  /**
   * Analyze image using GPT-4 Vision
   */
  async analyzeImage(
    imageUrl: string | Buffer,
    prompt: string,
    options: VisionAnalysisOptions = {}
  ): Promise<VisionAnalysisResult> {
    const startTime = Date.now();
    const openaiConfig = this.config.getOpenAIConfig();
    
    try {
      let imageContent: string;
      
      if (Buffer.isBuffer(imageUrl)) {
        // Convert buffer to base64 data URL
        const base64 = imageUrl.toString('base64');
        imageContent = `data:image/jpeg;base64,${base64}`;
      } else {
        imageContent = imageUrl;
      }

      const response = await this.client.chat.completions.create({
        model: options.model || openaiConfig.visionModel,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageContent,
                  detail: options.detail || 'high'
                }
              }
            ]
          }
        ],
        max_tokens: options.maxTokens || openaiConfig.maxTokens,
        temperature: options.temperature ?? openaiConfig.temperature
      });

      const choice = response.choices[0];
      const executionTime = Date.now() - startTime;

      if (!choice.message.content) {
        throw new ExternalServiceError(
          ErrorCodes.OPENAI_API_ERROR,
          'No content generated from vision analysis',
          true
        );
      }

      const result: VisionAnalysisResult = {
        content: choice.message.content,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0
        },
        model: response.model,
        executionTime
      };

      this.logger.info('Vision analysis completed', {
        model: result.model,
        executionTime,
        totalTokens: result.usage.totalTokens,
        imageType: Buffer.isBuffer(imageUrl) ? 'buffer' : 'url'
      });

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.logger.error('Vision analysis failed', error, { executionTime });
      
      if (error instanceof ExternalServiceError) {
        throw error;
      }
      
      throw this.errorHandler.wrapExternalError(ErrorCodes.OPENAI_API_ERROR, error, true);
    }
  }

  // === DOCUMENT PROCESSING ===

  /**
   * Extract text and classify document
   */
  async processDocument(
    imageBuffer: Buffer,
    documentType?: string
  ): Promise<{
    extractedText: string;
    classification: DocumentClassificationResult;
    executionTime: number;
  }> {
    const startTime = Date.now();
    
    try {
      const systemPrompt = `Du bist ein Experte für die Verarbeitung von Schweizer Versicherungsdokumenten. 
      Analysiere das Dokument und extrahiere den gesamten Text genau so wie er im Dokument steht.
      Klassifiziere dann das Dokument und identifiziere wichtige Felder.
      
      Antworte im folgenden JSON-Format:
      {
        "extractedText": "Vollständiger Text aus dem Dokument",
        "classification": {
          "type": "Dokumenttyp (z.B. Schadenmeldung, Rechnung, Vertrag)",
          "confidence": 0.95,
          "summary": "Kurze Zusammenfassung des Inhalts",
          "keyFields": {
            "relevante_felder": "erkannte_werte"
          },
          "language": "de"
        }
      }`;

      const prompt = documentType 
        ? `Analysiere dieses ${documentType}-Dokument und extrahiere alle Informationen:`
        : 'Analysiere dieses Schweizer Versicherungsdokument und extrahiere alle Informationen:';

      const visionResult = await this.analyzeImage(imageBuffer, prompt, {
        temperature: 0.1,
        maxTokens: 4000
      });

      // Parse JSON response
      const jsonMatch = visionResult.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new ExternalServiceError(
          ErrorCodes.OPENAI_API_ERROR,
          'Invalid JSON response from document analysis',
          true
        );
      }

      const parsedResult = JSON.parse(jsonMatch[0]);
      const executionTime = Date.now() - startTime;

      this.logger.info('Document processing completed', {
        documentType: parsedResult.classification.type,
        confidence: parsedResult.classification.confidence,
        textLength: parsedResult.extractedText.length,
        executionTime
      });

      return {
        extractedText: parsedResult.extractedText,
        classification: parsedResult.classification,
        executionTime
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.logger.error('Document processing failed', error, { executionTime });
      throw error;
    }
  }

  // === EMAIL PROCESSING ===

  /**
   * Classify and analyze email content
   */
  async classifyEmail(
    subject: string,
    content: string,
    attachments?: string[]
  ): Promise<EmailClassificationResult> {
    try {
      const systemPrompt = `Du bist ein Experte für die Klassifizierung von E-Mails in einem Schweizer Versicherungsunternehmen.
      Klassifiziere die E-Mail in eine der folgenden Kategorien:
      - DOCUMENT_SUBMISSION: Kunde sendet Dokumente
      - QUESTION: Kunde hat Fragen zu Versicherungen oder Services
      - APPOINTMENT_REQUEST: Kunde möchte einen Termin vereinbaren
      - FEEDBACK: Kunde gibt Feedback oder Beschwerden
      - OTHER: Alles andere
      
      Antworte im JSON-Format:
      {
        "category": "KATEGORIE",
        "confidence": 0.95,
        "summary": "Kurze Zusammenfassung der E-Mail",
        "priority": "low|medium|high",
        "suggestedAction": "Empfohlene Aktion"
      }`;

      const prompt = `Betreff: ${subject}

Inhalt: ${content}

${attachments && attachments.length > 0 ? `Anhänge: ${attachments.join(', ')}` : ''}

Klassifiziere diese E-Mail:`;

      const result = await this.generateText(prompt, {
        systemPrompt,
        temperature: 0.1,
        maxTokens: 500
      });

      // Parse JSON response
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new ExternalServiceError(
          ErrorCodes.OPENAI_API_ERROR,
          'Invalid JSON response from email classification',
          true
        );
      }

      const classification: EmailClassificationResult = JSON.parse(jsonMatch[0]);

      this.logger.info('Email classification completed', {
        category: classification.category,
        confidence: classification.confidence,
        priority: classification.priority
      });

      return classification;
    } catch (error) {
      this.logger.error('Email classification failed', error);
      throw error;
    }
  }

  // === FAQ AND RESPONSES ===

  /**
   * Generate response to customer question
   */
  async generateCustomerResponse(
    question: string,
    context?: string,
    language: string = 'de'
  ): Promise<string> {
    try {
      const systemPrompt = `Du bist ein freundlicher und professioneller Kundenservice-Mitarbeiter für ein Schweizer Versicherungsunternehmen.
      Antworte höflich, präzise und hilfreich auf Deutsch (Schweizer Stil).
      Verwende die folgenden Richtlinien:
      - Sei höflich und professionell
      - Gib präzise und hilfreiche Antworten
      - Verweise bei komplexen Fragen an einen Mitarbeiter
      - Verwende "Sie" für die Anrede
      - Beende mit freundlichen Grüssen`;

      const prompt = context 
        ? `Kontext: ${context}\n\nKundenfrage: ${question}\n\nGeneriere eine passende Antwort:`
        : `Kundenfrage: ${question}\n\nGeneriere eine passende Antwort:`;

      const result = await this.generateText(prompt, {
        systemPrompt,
        temperature: 0.3,
        maxTokens: 1000
      });

      this.logger.info('Customer response generated', {
        questionLength: question.length,
        responseLength: result.content.length,
        language
      });

      return result.content;
    } catch (error) {
      this.logger.error('Customer response generation failed', error);
      throw error;
    }
  }

  // === UTILITY METHODS ===

  /**
   * Check if model is available
   */
  async isModelAvailable(modelName: string): Promise<boolean> {
    try {
      const models = await this.client.models.list();
      return models.data.some(model => model.id === modelName);
    } catch (error) {
      this.logger.error('Failed to check model availability', error, { modelName });
      return false;
    }
  }

  /**
   * Get available models
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const models = await this.client.models.list();
      return models.data.map(model => model.id);
    } catch (error) {
      this.logger.error('Failed to get available models', error);
      return [];
    }
  }

  /**
   * Dispose service
   */
  async dispose(): Promise<void> {
    try {
      // OpenAI client doesn't need explicit cleanup
      this.logger.info('OpenAI service disposed');
    } catch (error) {
      this.logger.error('Error disposing OpenAI service', error);
    }
  }
}