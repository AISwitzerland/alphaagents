import { BaseAgent } from '../../../core/src/agents/BaseAgent';
import { AgentContext, AgentResult, AgentConfig, LogLevel } from '../../../shared/src/types/agent';
import { ErrorHandler, ErrorCodes, ValidationError } from '../../../core/src/errors/ErrorHandler';
import { DIContainer, ServiceTokens } from '../../../core/src/container/DIContainer';
import { LoggerService, SupabaseService, OpenAIService } from '../../../services/src';
import { AppointmentRecord, QuoteRecord } from '../../../services/src/database/SupabaseService';
import { AppointmentEmailService } from '../../../services/src/email/AppointmentEmailService';
import { DocumentAgent } from '../document/DocumentAgent';

/**
 * Chat Agent Input/Output Types
 */
export interface ChatAgentInput {
  action: 'chat' | 'uploadDocument' | 'bookAppointment' | 'requestQuote' | 'getInfo' | 'endSession' | 'continueConversation';
  sessionId: string;
  userId?: string;
  message?: string;
  userInfo?: UserInfo;
  document?: {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    size: number;
  };
  appointmentRequest?: AppointmentRequest;
  quoteRequest?: QuoteRequest;
  context?: ChatContext;
  // New: Context switching support
  previousTopic?: string;
  topicChange?: boolean;
}

export interface ChatAgentOutput {
  status: 'success' | 'error' | 'requires_input';
  message: string;
  response?: string;
  conversationState?: ConversationState;
  nextStep?: string;
  options?: ChatOption[];
  dataCollected?: UserInfo;
  appointmentDetails?: AppointmentDetails;
  quoteResult?: QuoteResult;
  documentProcessed?: DocumentProcessingResult;
  uiUpdates?: UIUpdate[];
}

export interface UserInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  preferredLanguage?: string;
}

export interface AppointmentRequest {
  preferredDate?: string;
  preferredTime?: string;
  reason?: string;
  appointmentType?: 'consultation' | 'claim_review' | 'contract_discussion';
}

export interface QuoteRequest {
  insuranceType: 'krankenversicherung' | 'unfallversicherung' | 'haftpflichtversicherung' | 'sachversicherung' | 'lebensversicherung';
  coverage?: string;
  deductible?: number;
  additionalInfo?: Record<string, any>;
  customerProfile?: {
    age?: number;
    occupation?: string;
    familyStatus?: string;
    existingInsurance?: string[];
  };
}

export interface ChatContext {
  currentFlow: 'general' | 'document_upload' | 'appointment' | 'quote' | 'faq' | 'mixed_intent';
  stepInFlow: number;
  collectedData: Partial<UserInfo>;
  conversationHistory: ChatMessage[];
  intent?: string;
  language: string;
  // Enhanced context switching
  previousFlow?: string;
  topicHistory: string[];
  contextSwitchCount: number;
  lastTopicChange?: Date;
  customerJourney: {
    touchpoints: string[];
    preferences: Record<string, any>;
    urgency: 'low' | 'medium' | 'high';
  };
}

export interface ChatMessage {
  id: string;
  timestamp: Date;
  type: 'user' | 'bot';
  content: string;
  metadata?: Record<string, any>;
}

export interface ConversationState {
  sessionId: string;
  currentFlow: string;
  stepInFlow: number;
  dataCollected: Partial<UserInfo>;
  isComplete: boolean;
  nextExpectedInput: string;
  context: Record<string, any>;
}

export interface ChatOption {
  id: string;
  text: string;
  action: string;
  metadata?: Record<string, any>;
}

export interface AppointmentDetails {
  confirmed: boolean;
  appointmentId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  appointmentType: string;
  notes?: string;
}

export interface QuoteResult {
  quoteId: string;
  insuranceType: string;
  estimatedPremium?: string;
  coverageDetails: string;
  validUntil: Date;
  nextSteps: string[];
}

export interface DocumentProcessingResult {
  documentId: string;
  filename: string;
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  documentType?: string;
  extractedInfo?: Record<string, any>;
}

export interface UIUpdate {
  type: 'show_calendar' | 'show_file_upload' | 'show_form' | 'show_options' | 'show_progress';
  data: Record<string, any>;
}

/**
 * Chat Agent - Interactive Customer Interface
 * 
 * The Chat Agent provides:
 * - Intelligent conversational AI with GPT-4
 * - Multi-step data collection workflows
 * - Document upload integration with drag & drop
 * - Appointment booking with calendar integration
 * - Insurance quote generation
 * - FAQ support with Swiss insurance knowledge
 * - Context-aware conversation management
 * - German/Swiss German language support
 */
export class ChatAgent extends BaseAgent<ChatAgentInput, ChatAgentOutput> {
  private container: DIContainer;
  private logger!: LoggerService;
  private supabase!: SupabaseService;
  private openai!: OpenAIService;
  private documentAgent!: DocumentAgent;
  private emailService!: AppointmentEmailService;
  private errorHandler: ErrorHandler;

  // Active chat sessions
  private activeSessions: Map<string, ChatContext> = new Map();

  // === ENHANCED SWISS INSURANCE KNOWLEDGE BASE ===
  private readonly SWISS_INSURANCE_FAQ = {
    'krankenversicherung': {
      'grundversicherung': 'Die Grundversicherung (KVG) ist obligatorisch für alle Personen mit Wohnsitz in der Schweiz. Sie deckt die wichtigsten medizinischen Leistungen ab und wird vom Bund reguliert. Alle Krankenkassen bieten die gleichen Grundleistungen.',
      'zusatzversicherung': 'Zusatzversicherungen (VVG) ergänzen die Grundversicherung mit Leistungen wie Einzelzimmer, alternative Medizin, Zahnbehandlungen oder Auslandschutz. Diese sind freiwillig und variieren zwischen den Anbietern.',
      'franchise': 'Die Franchise ist Ihr jährlicher Selbstbehalt. Mindestfranchise: CHF 300 (Erwachsene), CHF 0 (Kinder). Höhere Franchisen senken die Prämie. Wählen Sie entsprechend Ihren erwarteten Gesundheitskosten.',
      'selbstbehalt': 'Nach der Franchise bezahlen Sie 10% der Kosten als Selbstbehalt, maximal CHF 700/Jahr (Erwachsene), CHF 350/Jahr (Kinder).',
      'prämienverbilligung': 'Personen mit tiefem Einkommen erhalten Prämienverbilligungen. Beantragen Sie diese bei Ihrer Gemeinde oder dem Kanton.'
    },
    'unfallversicherung': {
      'beruflich': 'Berufsunfälle sind durch den Arbeitgeber versichert (UVG/SUVA). Dies deckt alle Unfälle während der Arbeit und dem Arbeitsweg ab. Ihr Arbeitgeber zahlt die Prämien.',
      'nichtberuflich': 'Nichtberufsunfälle müssen separat versichert werden, wenn Sie mehr als 8 Stunden pro Woche arbeiten. Bei weniger Arbeitszeit übernimmt die Krankenkasse.',
      'leistungen': 'Die Unfallversicherung übernimmt 100% der Heilungskosten, zahlt Taggeld (80% des Lohns) und bei Invalidität eine lebenslange Rente.',
      'suva': 'Die SUVA versichert risikoreiche Branchen wie Bau, Industrie und Gewerbe. Andere Arbeitgeber können private Unfallversicherer wählen.'
    },
    'haftpflichtversicherung': {
      'privat': 'Die Privathaftpflicht ist nicht obligatorisch, aber essentiell. Sie deckt Schäden ab, die Sie anderen zufügen - bis zu mehreren Millionen CHF. Empfohlene Deckung: mind. CHF 5 Mio.',
      'fahrzeug': 'Die Motorfahrzeughaftpflicht ist obligatorisch für alle Fahrzeughalter. Mindestdeckung: CHF 1 Mio. für Personenschäden, CHF 500\'000 für Sachschäden.',
      'mieter': 'Als Mieter benötigen Sie eine Hausrathaftpflicht für Schäden an der Mietwohnung. Diese ist oft in der Hausratversicherung enthalten.'
    },
    'sachversicherung': {
      'hausrat': 'Die Hausratversicherung ist freiwillig, aber empfehlenswert. Sie deckt Ihr Eigentum bei Feuer, Wasser, Einbruch oder Vandalismus ab.',
      'gebäude': 'Die Gebäudeversicherung ist in den meisten Kantonen obligatorisch und wird durch kantonale Gebäudeversicherungen angeboten.',
      'kasko': 'Die Vollkaskoversicherung für Fahrzeuge ist freiwillig, aber bei neuen Autos empfehlenswert. Teilkasko deckt Diebstahl, Hagelschäden etc.'
    },
    'vorsorge': {
      'säule3a': 'Die Säule 3a ist die freiwillige, steuerlich begünstigte Selbstvorsorge. Maximaler Einzahlungsbetrag 2024: CHF 7\'056 für Angestellte.',
      'pensionskasse': 'Die Pensionskasse (2. Säule) ist für Angestellte ab CHF 22\'050 Jahreslohn obligatorisch. Sie ergänzt die AHV-Rente.',
      'ahv': 'Die AHV (1. Säule) ist die staatliche Grundversicherung für alle. Beiträge: 8.7% des Lohns (je hälftig Arbeitgeber/Arbeitnehmer).',
      'säule3b': 'Die Säule 3b ist die freie Selbstvorsorge ohne steuerliche Begünstigung, aber mit flexiblen Ein- und Auszahlungen. Ideal für mittelfristige Sparziele und Ergänzung zur 3a. Keine Bindungsfristen oder Beitragslimiten.',
      'frühpensionierung': 'Frühpensionierung ab 58-62 Jahren möglich, führt zu lebenslangen Rentenkürzungen von 6.8% pro Jahr bei AHV. Pensionskasse oft ab 58 mit Kürzungen. Überbrückungsrenten und Kapitalbezug beachten.',
      'einkauf': 'Freiwillige Pensionskassen-Einkäufe bis zur maximalen reglementarischen Leistung möglich. Steuerlich voll abzugsfähig. 3-Jahres-Sperrfrist für Kapitalbezug. Einkaufspotential auf Vorsorgeausweis ersichtlich.',
      'koordination': 'Koordination zwischen den 3 Säulen: AHV/IV (1. Säule) als Basis, Pensionskasse (2. Säule) für Lebensstandard, Säule 3a/3b als Ergänzung. Koordinationsabzug 2024: CHF 25\'725. Optimale Planung berücksichtigt alle Säulen.',
      'todesfall': 'Bei Todesfall: Witwen-/Witwerrente aus AHV/Pensionskasse, Waisenrenten für Kinder unter 18/25 Jahren. Säule 3a an begünstigte Personen gemäss BVG Art. 2. Freizügigkeitsguthaben und Todesfallkapital beachten.',
      'invalidität': 'IV-Renten aus 1. und 2. Säule bei dauernder Erwerbsunfähigkeit ab 40%. Eingliederungsmassnahmen haben Vorrang. Zusätzlich UVG-Renten bei Unfall. Säule 3a-Prämienbefreiung bei Invalidität möglich.'
    },
    'reiseversicherung': {
      'grundlagen': 'Die Reiseversicherung ist freiwillig und schützt vor unvorhergesehenen Kosten im Ausland. Sie umfasst meist Annullation, Heilungskosten, Assistance und Gepäckschutz. Schweizer Grundversicherung leistet im Ausland nur beschränkt.',
      'leistungen': 'Typische Leistungen: Annullationskosten (bis 100% Reisepreis), Heilungskosten im Ausland (unbegrenzt oder bis CHF 10 Mio.), Repatriierung, Such- und Bergungskosten, Assistance 24h/7. Gepäckversicherung oft als Zusatzoption.',
      'kosten': 'Jahrespolice für Einzelperson: CHF 60-150, Familie: CHF 120-300. Einzelreisepolice: 3-8% des Reisepreises. Kostenfaktoren: Destination, Reisedauer, Alter, gewählte Deckungen. USA/Kanada deutlich teurer.',
      'anbieter': 'Hauptanbieter in der Schweiz: Allianz Care, AXA, Zurich, CSS, Sympany, TCS, Elvia. Vergleichen Sie Prämien und Leistungen. TCS-Mitglieder erhalten oft Rabatte. Online-Vergleichsportale verfügbar.',
      'ausschlüsse': 'Häufige Ausschlüsse: Vorerkrankungen, Kriegsgebiete, Extremsportarten, Alkohol-/Drogeneinfluss, vorsätzliche Handlungen. Pandemie-Ausschlüsse prüfen. Annullation nur bei unvorhersehbaren Ereignissen.',
      'tipps': 'Buchen Sie spätestens 30 Tage vor Abreise. Prüfen Sie bestehende Deckungen (Hausrat, Kreditkarte). Für Langzeitreisen separate Police nötig. Wichtige Dokumente immer kopieren. Assistance-Nummer griffbereit halten.'
    },
    'rechtschutzversicherung': {
      'grundlagen': 'Schweizer Rechtschutzversicherung übernimmt Anwalts-, Gerichts- und Verfahrenskosten bei Rechtsstreitigkeiten. Basis: VVG Art. 1-100. Deckung ab CHF 300-500 Selbstbehalt. Wichtig: 3-monatige Wartefrist für neue Verträge. Kantonale Gerichtsgebühren variieren stark.',
      'bereiche': 'Kernbereiche: Privat-Rechtschutz (Mietrecht, Nachbarschaft, Kaufverträge), Verkehrs-Rechtschutz (Haftpflicht, Kasko-Schäden), Arbeits-Rechtschutz (Kündigung, Lohnstreit), Steuer-Rechtschutz (Einsprachen gegen Steuerbescheide). Separate Deckung für Immobilien-Rechtschutz verfügbar.',
      'kosten': 'Jahresprämien: Basis-Schutz CHF 200-400, umfassender Schutz CHF 500-800. Selbstbehalt CHF 300-1000 wählbar. Versicherungssumme meist CHF 300000-1000000. Familienrabatte 10-20%. Kombination mit anderen Versicherungen reduziert Kosten um bis zu 15%.',
      'anbieter': 'Hauptanbieter: Zurich (Marktführer), AXA, Allianz Suisse, Generali, Die Mobiliar, Helvetia. Spezialanbieter: DAS Rechtsschutz, ADVOCARD Schweiz. Online-Vergleich empfohlen. Beratung durch unabhängige Makler für optimale Deckung gemäss individuellem Risikoprofil.',
      'ausschlüsse': 'Nicht gedeckt: Strafverfahren bei Vorsatz, Familienrecht (Scheidung), Erbrecht, Immobilienkauf vor Vertragsabschluss, Steuerberatung, bereits laufende Verfahren. Wartefrist: 3 Monate. Bagatellgrenze: meist unter CHF 300. Vorsätzliche Rechtsverletzungen ausgeschlossen.',
      'tipps': 'Vertragscheck: Deckungssumme mind. CHF 300000, niedrigen Selbstbehalt wählen, Verkehrs-Rechtschutz separat prüfen. Bei Rechtsfall: Sofortige Meldung, Anwaltswahl oft frei, Kostenvoranschlag einholen. Kündigung: 3 Monate vor Ablauf. Wechsel: Deckungslücken vermeiden durch nahtlosen Übergang.'
    }
  };

  // === TOPIC DETECTION PATTERNS ===
  private readonly TOPIC_PATTERNS = {
    document_upload: [
      // More specific upload intent patterns (prevent info request false positives)
      /möchte.*hochladen|will.*hochladen|ich.*möchte.*hochladen/i,
      /kann.*ich.*hochladen/i,
      /einreichen.*dokument|übermitteln.*dokument|abgeben.*dokument/i,
      /schadensmeldung.*einreichen|rechnung.*senden|arztbericht.*senden/i,
      /vertrag.*hochladen|kündig.*einreichen/i,
      // Keep some specific file-related patterns for actual upload intent
      /anhang.*hochladen|pdf.*hochladen|scan.*hochladen|foto.*hochladen/i,
      // Only "dokument hochladen" when NOT asking about types/formats
      /(?!.*\b(?:arten|format|typ|was.*für|welche).*)\bdokument.*hochladen/i,
      /(?!.*\b(?:arten|format|typ|was.*für|welche).*)\bupload.*dokument/i
    ],
    appointment: [
      /termin|beratung|gespräch|meeting|vereinbaren/i,
      /wann|zeitpunkt|datum|verfügbar|terminkalender/i,
      /persönlich|vor ort|büro|besuch|treffen/i,
      // NEW: Question forms for appointments
      /können.*wir.*termin|kann.*ich.*termin|termin.*machen/i
    ],
    quote: [
      /offerte|angebot|tarif|prämie/i,
      /kostenvoranschlag|berechnung|kalkulation/i,
      /will.*versicherung|möchte.*versicherung|brauche.*versicherung|angebot.*versicherung|kaufen.*versicherung/i,
      // NEW: Stronger quote request patterns
      /möchte.*eine.*offerte|will.*eine.*offerte|brauche.*eine.*offerte/i,
      /ich.*möchte.*offerte|kann.*ich.*eine.*offerte/i,
      // Remove cost-related patterns to prevent FAQ conflicts
      /persönliche.*offerte|individuelle.*berechnung|massgeschneidert/i
    ],
    faq: [
      /was.*ist|wie.*funktioniert|erklär|erklärun/i,
      /franchise|selbstbehalt|grundversicherung|zusatz/i,
      /uvg|suva|ahv|säule|haftpflicht|kasko/i,
      // Cost information patterns (moved from quote to prevent conflicts)
      /was.*kostet|wie.*teuer|kosten|preis|preise|gebühr|gebühren/i,
      // NEW: Document information patterns (prevent upload flow false positives)
      /exportier|download|herunterladen|speichern|ausgeben/i,
      /welche.*arten|was.*für.*arten|unterstützte.*format/i,
      /dokument.*format|format.*dokument|dateityp|file.*type/i,
      /welche.*dokument.*arten|was.*dokument.*arten/i,
      /unterstützen.*sie|welche.*datei/i,
      // NEW: Question word patterns (FIX for "Wo ist", "Wie lade ich" etc.)
      /wo.*ist|wo.*finde|wo.*kann.*ich|wie.*lade|wie.*funktioniert|wie.*mache/i,
      /wann.*ist.*frist|wann.*kann.*ich|wann.*muss.*ich|wann.*ist.*kündig/i,
      // NEW: Instruction/Help patterns (FIX for "Anleitung", "Hilfe")
      /anleitung|hilfe|help|tutorial|erklärun|erklär.*mir/i,
      /wie.*mache.*ich|wie.*geht.*das|wie.*funktioniert.*das/i,
      // NEW: Location/Status questions
      /wo.*dokument|wo.*finde.*ich|status.*von|stand.*der/i,
      // NEW: "nur fragen" patterns for negation cases
      /nur.*fragen|nur.*wissen|nur.*informationen|nur.*erklärung/i,
      // Enhanced Swiss Insurance Keywords for FAQ detection
      /reiseversicherung|reise.*versicherung|ausland.*versicherung|ferien.*versicherung/i,
      /rechtschutzversicherung|rechtschutz|rechtsschutz|anwalt.*versicherung|gericht.*kosten|legal.*versicherung/i,
      /krankenversicherung|krankenkasse|grundversicherung|zusatzversicherung|franchise|selbstbehalt/i,
      /unfallversicherung|unfall.*versicherung|suva|uvg|berufsunfall|nichtberufsunfall|arbeitsunfall|arbeitsweg.*unfall|betriebsunfall|freizeitunfall/i,
      /haftpflichtversicherung|haftpflicht.*versicherung|privathaftpflicht|motorfahrzeug.*haftpflicht/i,
      /sachversicherung|hausratversicherung|gebäudeversicherung|kaskoversicherung|vollkasko|teilkasko/i,
      /vorsorge|säule.*3a|säule.*3b|pensionskasse|ahv.*rente|pk.*einkauf|bvg|pensionierung/i,
      /einkauf.*pensionskasse|frühpensionierung|invalidität.*rente|koordination.*säulen|todesfall.*rente/i
    ],
    urgency_high: [
      /sofort|dringend|eilig|notfall|emergency/i,
      /schaden|unfall|problem|fehler/i,
      /schnell|asap|heute|morgen/i
    ]
  };

  // Conversation flows
  private readonly CONVERSATION_FLOWS = {
    document_upload: [
      'greeting',
      'collect_name',
      'collect_email', 
      'collect_phone',
      'confirm_data',
      'upload_document',
      'confirm_upload'
    ],
    appointment: [
      'greeting',
      'collect_name',
      'collect_email',
      'collect_phone',
      'appointment_type',
      'preferred_date',
      'preferred_time',
      'confirm_appointment'
    ],
    quote: [
      'greeting',
      'insurance_type',
      'collect_basic_info',
      'specific_questions',
      'generate_quote',
      'present_quote'
    ]
  };

  constructor(config: AgentConfig, container: DIContainer) {
    super(config);
    this.container = container;
    this.errorHandler = ErrorHandler.getInstance();
  }

  async execute(input: ChatAgentInput, context: AgentContext): Promise<AgentResult<ChatAgentOutput>> {
    this.log(LogLevel.INFO, `Chat Agent executing action: ${input.action}`, { 
      action: input.action,
      sessionId: input.sessionId,
      userId: input.userId,
      hasMessage: !!input.message
    });

    try {
      switch (input.action) {
        case 'chat':
          return await this.handleChat(input, context);
        
        case 'uploadDocument':
          return await this.handleDocumentUpload(input, context);
        
        case 'bookAppointment':
          return await this.handleAppointmentBooking(input, context);
        
        case 'requestQuote':
          return await this.handleQuoteRequest(input, context);
        
        case 'getInfo':
          return await this.handleInfoRequest(input, context);
        
        case 'endSession':
          return await this.handleEndSession(input, context);
        
        case 'continueConversation':
          return await this.handleChat(input, context);
        
        default:
          throw this.errorHandler.createError(
            ErrorCodes.INVALID_INPUT,
            `Unknown action: ${input.action}`
          );
      }
    } catch (error) {
      this.log(LogLevel.ERROR, 'Chat Agent execution failed', { error, input });
      
      const agentError = this.errorHandler.handleError(error, { 
        action: input.action,
        sessionId: input.sessionId,
        userId: input.userId
      });
      
      return this.createErrorResult(context, agentError);
    }
  }

  protected async initialize(): Promise<void> {
    this.log(LogLevel.INFO, 'Initializing Chat Agent...');

    try {
      // Resolve dependencies
      this.logger = await this.container.resolve<LoggerService>(ServiceTokens.LOGGER);
      this.supabase = await this.container.resolve<SupabaseService>(ServiceTokens.SUPABASE_SERVICE);
      this.openai = await this.container.resolve<OpenAIService>(ServiceTokens.OPENAI_SERVICE);
      this.emailService = AppointmentEmailService.getInstance();
      
      // Initialize document agent for file processing
      const documentConfig = {
        id: 'chat-document-agent',
        name: 'ChatDocumentAgent',
        version: '1.0.0',
        enabled: true,
        maxRetries: 3,
        timeout: 30000,
        dependencies: [],
        healthCheckInterval: 30000
      };
      
      this.documentAgent = new DocumentAgent(documentConfig, this.container);
      await this.documentAgent.start();

      this.log(LogLevel.INFO, 'Chat Agent initialized successfully');
    } catch (error) {
      this.log(LogLevel.FATAL, 'Chat Agent initialization failed', { error });
      throw error;
    }
  }

  protected async cleanup(): Promise<void> {
    this.log(LogLevel.INFO, 'Cleaning up Chat Agent...');

    try {
      // Clear active sessions
      this.activeSessions.clear();
      
      if (this.documentAgent) {
        await this.documentAgent.stop();
      }
      
      this.log(LogLevel.INFO, 'Chat Agent cleanup completed');
    } catch (error) {
      this.log(LogLevel.ERROR, 'Chat Agent cleanup failed', { error });
    }
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
      const documentAgentHealthy = this.documentAgent ? 
        (await this.documentAgent.healthCheck()).healthy : true;

      return dbHealthy && aiHealthy && documentAgentHealthy;
    } catch (error) {
      this.log(LogLevel.ERROR, 'Chat Agent health check failed', { error });
      return false;
    }
  }

  // === ENHANCED CHAT HANDLING WITH CONTEXT SWITCHING ===

  /**
   * Handle advanced chat interaction with seamless topic switching
   */
  private async handleChat(input: ChatAgentInput, context: AgentContext): Promise<AgentResult<ChatAgentOutput>> {
    if (!input.message) {
      throw new ValidationError('Message is required for chat action');
    }

    // Get or create session context
    const sessionContext = this.getOrCreateSession(input.sessionId, input.context);
    
    // Add user message to history
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      timestamp: new Date(),
      type: 'user',
      content: input.message
    };
    sessionContext.conversationHistory.push(userMessage);

    try {
      // ENHANCED: Detect topic and handle context switching
      const topicResult = await this.detectTopicAndIntent(input.message, sessionContext);
      sessionContext.intent = topicResult.intent;
      sessionContext.customerJourney.urgency = topicResult.urgency;
      
      // Handle context switching with smooth transitions
      if (topicResult.topicChanged) {
        const transitionResponse = await this.handleContextSwitch(
          sessionContext.currentFlow,
          topicResult.topic,
          sessionContext,
          input.message
        );
        
        if (transitionResponse) {
          // Bot message for transition
          const botMessage: ChatMessage = {
            id: `msg-${Date.now()}-bot`,
            timestamp: new Date(),
            type: 'bot',
            content: transitionResponse.message
          };
          sessionContext.conversationHistory.push(botMessage);
          
          // Update session
          this.activeSessions.set(input.sessionId, sessionContext);
          
          return this.createSuccessResult(context, {
            status: 'success',
            message: 'Context switch handled',
            response: transitionResponse.message,
            conversationState: this.buildConversationState(sessionContext, input.sessionId),
            nextStep: transitionResponse.nextStep,
            options: transitionResponse.options,
            uiUpdates: transitionResponse.uiUpdates
          });
        }
      }
      
      // FLOW PROTECTION: Preserve active flows from intent override
      const isActiveFlow = sessionContext.currentFlow !== 'general' && sessionContext.stepInFlow > 0;
      const isCompatibleIntent = this.isIntentCompatibleWithCurrentFlow(topicResult.intent, sessionContext.currentFlow);
      
      // Only reset flow if: 1) No active flow OR 2) Genuine topic change OR 3) Incompatible intent
      if (!isActiveFlow || (topicResult.topicChanged && !isCompatibleIntent)) {
        // Set flow based on intent (for new conversations or explicit flow changes)
        switch (topicResult.intent) {
          case 'document_upload':
            sessionContext.currentFlow = 'document_upload';
            sessionContext.stepInFlow = 0;
            break;
          case 'appointment_booking':
            sessionContext.currentFlow = 'appointment';
            sessionContext.stepInFlow = 0;
            break;
          case 'insurance_quote':
            sessionContext.currentFlow = 'quote';
            sessionContext.stepInFlow = 0;
            break;
          case 'faq':
            sessionContext.currentFlow = 'faq';
            break;
        }
      }

      // Generate contextual response
      const response = await this.generateResponse(input.message, sessionContext);

      // Create bot message
      const botMessage: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        timestamp: new Date(),
        type: 'bot',
        content: response.message
      };
      sessionContext.conversationHistory.push(botMessage);

      // Update session
      this.activeSessions.set(input.sessionId, sessionContext);

      // Log enhanced interaction with performance metrics
      await this.logChatInteraction(input.sessionId, userMessage, botMessage, sessionContext, {
        topicDetection: topicResult,
        contextSwitches: sessionContext.contextSwitchCount,
        performance: {
          detectionMethod: topicResult.detectionMethod,
          processingTime: topicResult.processingTime,
          confidence: topicResult.confidence
        }
      });

      return this.createSuccessResult(context, {
        status: 'success',
        message: 'Chat response generated',
        response: response.message,
        conversationState: this.buildConversationState(sessionContext, input.sessionId),
        nextStep: response.nextStep,
        options: response.options,
        uiUpdates: response.uiUpdates
      });
    } catch (error) {
      this.log(LogLevel.ERROR, 'Enhanced chat processing failed', { error });
      
      // Smart fallback based on context
      const fallbackResponse = this.generateSmartFallback(sessionContext, input.message);
      
      return this.createSuccessResult(context, {
        status: 'error',
        message: 'Chat processing failed',
        response: fallbackResponse,
        conversationState: this.buildConversationState(sessionContext, input.sessionId)
      });
    }
  }

  /**
   * Handle smooth context switching between topics
   */
  private async handleContextSwitch(
    fromFlow: string,
    toTopic: string,
    sessionContext: ChatContext,
    message: string
  ): Promise<{
    message: string;
    nextStep?: string;
    options?: ChatOption[];
    uiUpdates?: UIUpdate[];
  } | null> {
    
    // Only handle if we're switching from an active flow
    if (fromFlow === 'general') {
      return null;
    }
    
    const toFlow = this.mapTopicToIntent(toTopic);
    
    try {
      const systemPrompt = `Du bist ein Experte für nahtlose Gesprächsübergänge in der Schweizer Versicherungsbranche.

Kunde wechselt von "${fromFlow}" zu "${toFlow}".

Erstelle eine natürliche Übergangsantwort die:
1. Den Themenwechsel elegant anerkennt
2. Bestätigt, dass du verstanden hast
3. Nahtlos zum neuen Thema überleitet
4. Professionell und hilfreich bleibt

Halte die Antwort unter 100 Wörtern und verwende "Sie".`;

      const prompt = `Vorheriges Thema: ${fromFlow}
Neues Thema: ${toFlow}
Kundennachricht: "${message}"

Übergangsantwort:`;

      const result = await this.openai.generateText(prompt, {
        systemPrompt,
        temperature: 0.4,
        maxTokens: 200
      });

      // Update flow with proper type casting
      sessionContext.currentFlow = toFlow as 'general' | 'document_upload' | 'appointment' | 'quote' | 'faq';
      sessionContext.stepInFlow = 0;
      
      // Determine next step based on new flow
      let nextStep = 'continue';
      let options: ChatOption[] | undefined;
      let uiUpdates: UIUpdate[] | undefined;
      
      switch (toFlow) {
        case 'appointment':
          nextStep = 'collect_name';
          break;
        case 'quote':
          nextStep = 'insurance_type';
          options = [
            { id: 'kranken', text: 'Krankenversicherung', action: 'select_insurance' },
            { id: 'unfall', text: 'Unfallversicherung', action: 'select_insurance' },
            { id: 'haftpflicht', text: 'Haftpflichtversicherung', action: 'select_insurance' }
          ];
          break;
        case 'document_upload':
          nextStep = 'collect_name';
          uiUpdates = [{
            type: 'show_file_upload',
            data: { multiple: true, acceptedTypes: ['.pdf', '.docx', '.jpg', '.png'] }
          }];
          break;
      }
      
      return {
        message: result.content,
        nextStep,
        options,
        uiUpdates
      };
    } catch (error) {
      this.log(LogLevel.WARN, 'Context switch handling failed', { error });
      
      // Simple fallback with proper type casting
      sessionContext.currentFlow = toFlow as 'general' | 'document_upload' | 'appointment' | 'quote' | 'faq';
      sessionContext.stepInFlow = 0;
      
      return {
        message: `Gerne helfe ich Ihnen mit ${this.getFlowDisplayName(toFlow)}. Lassen Sie uns das gemeinsam angehen.`,
        nextStep: 'continue'
      };
    }
  }
  
  /**
   * Generate smart fallback response based on context
   */
  private generateSmartFallback(sessionContext: ChatContext, message: string): string {
    const flow = sessionContext.currentFlow;
    
    switch (flow) {
      case 'appointment':
        return 'Entschuldigung, es gab ein technisches Problem bei der Terminvereinbarung. Ein Mitarbeiter wird sich persönlich bei Ihnen melden.';
      case 'quote':
        return 'Es gab einen Fehler bei der Offertenerstellung. Unsere Versicherungsexperten werden Ihnen gerne ein individuelles Angebot erstellen.';
      case 'document_upload':
        return 'Der Dokumenten-Upload hatte ein Problem. Sie können Ihre Unterlagen auch per E-Mail an uns senden.';
      default:
        return 'Entschuldigung, es gab ein technisches Problem. Können Sie Ihre Anfrage bitte wiederholen?';
    }
  }
  
  /**
   * Get display name for flow
   */
  private getFlowDisplayName(flow: string): string {
    const names: Record<string, string> = {
      'appointment': 'der Terminvereinbarung',
      'quote': 'Ihrer Offerteanfrage', 
      'document_upload': 'dem Dokumenten-Upload',
      'faq': 'Ihren Fragen'
    };
    return names[flow] || 'Ihrem Anliegen';
  }

  // === INTENT DETECTION ===

  // === ADVANCED TOPIC DETECTION & CONTEXT SWITCHING ===

  /**
   * Enhanced topic detection with context awareness
   */
  private async detectTopicAndIntent(message: string, sessionContext: ChatContext): Promise<{
    topic: string;
    intent: string;
    topicChanged: boolean;
    urgency: 'low' | 'medium' | 'high';
    confidence: number;
    detectionMethod: 'pattern' | 'ai' | 'hybrid';
    processingTime: number;
  }> {
    const startTime = Date.now();
    
    try {
      // PERFORMANCE OPTIMIZATION: Pattern-first with intelligent fallback
      const patternResult = this.detectTopicByPatterns(message);
      
      // High confidence pattern match = immediate return (1ms performance)
      if (patternResult.confidence >= 0.65) {
        const topicChanged = this.hasTopicChanged(patternResult.topic, sessionContext);
        
        // Update topic history
        if (topicChanged) {
          sessionContext.topicHistory.push(patternResult.topic);
          sessionContext.contextSwitchCount++;
          sessionContext.lastTopicChange = new Date();
          sessionContext.previousFlow = sessionContext.currentFlow;
        }
        
        const processingTime = Date.now() - startTime;
        this.log(LogLevel.DEBUG, 'Fast pattern detection used', { 
          topic: patternResult.topic, 
          confidence: patternResult.confidence,
          processingTime 
        });
        
        return {
          topic: patternResult.topic,
          intent: this.mapTopicToIntent(patternResult.topic),
          topicChanged,
          urgency: patternResult.urgency,
          confidence: patternResult.confidence,
          detectionMethod: 'pattern',
          processingTime
        };
      }
      
      // Medium confidence or context-dependent cases = AI enhancement
      if (patternResult.confidence >= 0.4 || sessionContext.contextSwitchCount > 0) {
        const aiResult = await this.detectTopicWithAI(message, sessionContext);
        
        // Hybrid decision: Use AI if significantly more confident
        const finalTopic = (aiResult.confidence > patternResult.confidence + 0.2) 
          ? aiResult.topic 
          : (patternResult.topic !== 'general' ? patternResult.topic : aiResult.topic);
          
        const finalConfidence = Math.max(patternResult.confidence, aiResult.confidence);
        const topicChanged = this.hasTopicChanged(finalTopic, sessionContext);
        
        // Update topic history
        if (topicChanged) {
          sessionContext.topicHistory.push(finalTopic);
          sessionContext.contextSwitchCount++;
          sessionContext.lastTopicChange = new Date();
          sessionContext.previousFlow = sessionContext.currentFlow;
        }
        
        const processingTime = Date.now() - startTime;
        this.log(LogLevel.DEBUG, 'Hybrid detection used', { 
          topic: finalTopic, 
          patternConfidence: patternResult.confidence,
          aiConfidence: aiResult.confidence,
          finalConfidence,
          processingTime 
        });
        
        return {
          topic: finalTopic,
          intent: this.mapTopicToIntent(finalTopic),
          topicChanged,
          urgency: patternResult.urgency,
          confidence: finalConfidence,
          detectionMethod: 'hybrid',
          processingTime
        };
      }
      
      // Low confidence = Pure AI fallback (only for very unclear cases)
      const aiResult = await this.detectTopicWithAI(message, sessionContext);
      const topicChanged = this.hasTopicChanged(aiResult.topic, sessionContext);
      
      // Update topic history
      if (topicChanged) {
        sessionContext.topicHistory.push(aiResult.topic);
        sessionContext.contextSwitchCount++;
        sessionContext.lastTopicChange = new Date();
        sessionContext.previousFlow = sessionContext.currentFlow;
      }
      
      const processingTime = Date.now() - startTime;
      this.log(LogLevel.DEBUG, 'AI detection used', { 
        topic: aiResult.topic, 
        confidence: aiResult.confidence,
        processingTime 
      });
      
      return {
        topic: aiResult.topic,
        intent: this.mapTopicToIntent(aiResult.topic),
        topicChanged,
        urgency: patternResult.urgency,
        confidence: aiResult.confidence,
        detectionMethod: 'ai',
        processingTime
      };
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.log(LogLevel.WARN, 'Topic detection failed, using fallback', { error, processingTime });
      
      return {
        topic: 'general',
        intent: 'general',
        topicChanged: false,
        urgency: 'low',
        confidence: 0.3,
        detectionMethod: 'pattern',
        processingTime
      };
    }
  }

  /**
   * Pattern-based topic detection for speed
   */
  private detectTopicByPatterns(message: string): {
    topic: string;
    urgency: 'low' | 'medium' | 'high';
    confidence: number;
  } {
    const messageLower = message.toLowerCase();
    
    // CRITICAL FIX: Sentence splitting for complex transitions
    // Handle "Question? Action." patterns by prioritizing the action
    if (/\?\s*(ich|können|kann|wir|lassen|möchte|will|brauche)/i.test(message)) {
      const parts = message.split(/[.!?]+/).map(p => p.trim()).filter(p => p.length > 0);
      if (parts.length > 1) {
        // Analyze the last meaningful part (usually the action/request)
        const actionPart = parts[parts.length - 1];
        if (actionPart.length > 5) { // Meaningful action part
          const actionResult = this.detectTopicByPatterns(actionPart);
          if (actionResult.confidence > 0.3) {
            return {
              topic: actionResult.topic,
              urgency: actionResult.urgency,
              confidence: actionResult.confidence * 0.9 // Slight reduction for being a part
            };
          }
        }
      }
    }
    
    // CRITICAL FIX: Single word confidence threshold
    const wordCount = message.trim().split(/\s+/).length;
    
    // Check urgency first
    const isUrgent = this.TOPIC_PATTERNS.urgency_high.some(pattern => pattern.test(messageLower));
    
    // CRITICAL FIX: Mixed intent detection
    const intentCounts = Object.entries(this.TOPIC_PATTERNS)
      .filter(([topic]) => topic !== 'urgency_high')
      .map(([topic, patterns]) => ({
        topic,
        matches: patterns.filter(pattern => pattern.test(messageLower)).length
      }))
      .filter(result => result.matches > 0);
    
    // If multiple strong intents detected, require clarification
    // Look for conjunction words indicating multiple requests
    if (intentCounts.length > 1 && /und|sowie|auch|außerdem|zusätzlich|noch/i.test(messageLower)) {
      // BUT: Don't trigger mixed_intent if negation is present (e.g., "Kein Termin, ich brauche...")
      if (!/nein|nicht|kein|keine|nie|niemals/i.test(messageLower)) {
        return {
          topic: 'mixed_intent',
          urgency: isUrgent ? 'high' : 'medium',
          confidence: 0.95
        };
      }
    }
    
    // Enhanced confidence scoring for better performance decisions
    let bestMatch = { topic: 'general', confidence: 0.1, matchCount: 0 };
    
    // Check topic patterns with enhanced scoring
    for (const [topic, patterns] of Object.entries(this.TOPIC_PATTERNS)) {
      if (topic === 'urgency_high') continue;
      
      const matches = patterns.filter(pattern => pattern.test(messageLower));
      const matchCount = matches.length;
      
      if (matchCount > 0) {
        // Enhanced confidence calculation
        let confidence = 0.2 + (matchCount * 0.25); // Base confidence boost
        
        // Bonus for specific insurance types (high confidence patterns) 
        if (topic === 'quote' && /reiseversicherung|krankenversicherung|unfallversicherung|haftpflichtversicherung|hausratversicherung|lebensversicherung|rechtschutzversicherung/i.test(messageLower)) {
          // Enhanced information vs quote detection
          if (/was.*kostet|wie.*teuer|kosten|preis|preise|tarif|tarife|gebühr|gebühren|wie.*viel|rechtschutz.*kosten|anwalt.*kosten|gericht.*kosten/i.test(messageLower)) {
            // Information request about costs - redirect to FAQ
            confidence = 0.05; // Very low quote confidence for cost questions
          } else if (/möchte.*versicherung|will.*versicherung|brauche.*versicherung|angebot|offerte|abschliessen|kaufen/i.test(messageLower)) {
            confidence += 0.4; // High confidence for actual purchase intent
          } else {
            confidence += 0.2; // Medium confidence for general insurance mentions
          }
        }
        
        // Bonus for explicit action words
        if (/möchte|will|brauche|suche/i.test(messageLower)) {
          confidence += 0.15;
        }
        
        // Bonus for clear appointment language
        if (topic === 'appointment' && /termin\s+(vereinbaren|buchen|reservieren)|einen\s+termin/i.test(messageLower)) {
          confidence += 0.25;
        }
        
        // Bonus for insurance information requests (FAQ)
        if (topic === 'faq' && /reiseversicherung|rechtschutzversicherung|krankenversicherung|vorsorge|säule/i.test(messageLower)) {
          confidence += 0.4; // High confidence for Swiss Insurance FAQ
          
          // Extra bonus for legal/cost combinations
          if (/rechtschutz|anwalt|gericht|legal/i.test(messageLower) && /kosten|preis|tarif|gebühr/i.test(messageLower)) {
            confidence += 0.3; // Very high confidence for legal cost questions
          }
        }
        
        // Bonus for document upload clarity
        if (topic === 'document_upload' && /dokument|datei|hochladen|upload|anhang/i.test(messageLower)) {
          confidence += 0.25;
        }
        
        confidence = Math.min(0.95, confidence); // Cap at 95%
        
        if (confidence > bestMatch.confidence) {
          bestMatch = { topic, confidence, matchCount };
        }
      }
    }
    
    // CRITICAL FIX: Single word confidence threshold
    if (wordCount === 1 && bestMatch.confidence < 0.8) {
      return {
        topic: 'general',
        urgency: isUrgent ? 'high' : 'low',
        confidence: 0.1
      };
    }
    
    // CRITICAL FIX: Stronger negation handling
    if (/nein|nicht|kein|keine|nie|niemals|doch.*nicht/i.test(messageLower)) {
      // Much stronger confidence reduction for contradicted intents
      if (bestMatch.topic !== 'faq') {
        bestMatch.confidence *= 0.2; // Reduced from 0.5 to 0.2
      }
      
      // Special case: "nur fragen/informationen" should boost FAQ
      if (/nur.*fragen|nur.*wissen|nur.*informationen|nur.*erklärung/i.test(messageLower)) {
        // Force FAQ detection for "nur fragen" cases
        bestMatch = { topic: 'faq', confidence: 0.8, matchCount: 1 };
      }
    }
    
    // If no patterns matched, return low confidence general
    if (bestMatch.confidence <= 0.1) {
      return {
        topic: 'general',
        urgency: isUrgent ? 'high' : 'low',
        confidence: 0.1
      };
    }
    
    return {
      topic: bestMatch.topic,
      urgency: isUrgent ? 'high' : 'medium',
      confidence: bestMatch.confidence
    };
  }

  /**
   * AI-enhanced topic detection with context
   */
  private async detectTopicWithAI(message: string, sessionContext: ChatContext): Promise<{
    topic: string;
    confidence: number;
  }> {
    try {
      const systemPrompt = `Du bist ein AI-Experte für Schweizer Versicherungs-Customer-Journey und Topic Detection.

Analysiere die Kundenabsicht unter Berücksichtigung des Gesprächskontexts:

TOPICS:
- document_upload: Dokumente hochladen/einreichen (Schadensmeldungen, Verträge, Rechnungen)
- appointment: Termine/Beratungen vereinbaren 
- quote: Versicherungsofferten/Kostenberechnungen anfordern
- faq: Informationen/Erklärungen zu Versicherungsprodukten
- general: Begrüßungen, Smalltalk, Navigation

KONTEXT-INTELLIGENZ:
- Erkenne Themenwechsel auch bei unvollständigen Aussagen
- Berücksichtige vorherige Gesprächsthemen
- Bei Zweifel: Wähle das wahrscheinlichste Topic basierend auf Schweizer Versicherungskontext

Output Format: topic_name|confidence_score (0.0-1.0)
Beispiel: appointment|0.85`;

      const contextHistory = sessionContext.conversationHistory.slice(-3)
        .map(msg => `${msg.type}: ${msg.content}`).join('\n');
      
      const prompt = `Aktuelle Nachricht: "${message}"

Gesprächskontext:
Aktueller Flow: ${sessionContext.currentFlow}
Vorherige Topics: ${sessionContext.topicHistory.slice(-3).join(', ')}
Kontext-Switches: ${sessionContext.contextSwitchCount}

Letzte Nachrichten:
${contextHistory}

Topic Detection:`;

      const result = await this.openai.generateText(prompt, {
        systemPrompt,
        temperature: 0.2,
        maxTokens: 100
      });

      const [topicPart, confidencePart] = result.content.trim().split('|');
      const topic = topicPart?.toLowerCase() || 'general';
      const confidence = parseFloat(confidencePart) || 0.5;
      
      // Validate topic
      const validTopics = ['document_upload', 'appointment', 'quote', 'faq', 'general'];
      const finalTopic = validTopics.includes(topic) ? topic : 'general';
      
      return {
        topic: finalTopic,
        confidence: Math.min(1.0, Math.max(0.0, confidence))
      };
    } catch (error) {
      this.log(LogLevel.WARN, 'AI topic detection failed', { error });
      return { topic: 'general', confidence: 0.4 };
    }
  }

  /**
   * Check if topic has changed from current context
   * FLOW-AWARE: Considers active flow progress to avoid false topic changes
   */
  private hasTopicChanged(newTopic: string, sessionContext: ChatContext): boolean {
    const currentIntent = this.mapTopicToIntent(sessionContext.currentFlow);
    const newIntent = this.mapTopicToIntent(newTopic);
    
    // FLOW PROTECTION: If user is mid-flow (stepInFlow > 0), be more conservative
    const isActiveFlow = sessionContext.currentFlow !== 'general' && sessionContext.stepInFlow > 0;
    
    if (isActiveFlow) {
      // Check if new intent is compatible with current flow
      const isCompatible = this.isIntentCompatibleWithCurrentFlow(newIntent, sessionContext.currentFlow);
      
      // If compatible intent detected during active flow, don't treat as topic change
      if (isCompatible) {
        this.log(LogLevel.DEBUG, 'Topic change suppressed - compatible intent in active flow', {
          currentFlow: sessionContext.currentFlow,
          stepInFlow: sessionContext.stepInFlow,
          newTopic,
          newIntent,
          compatible: true
        });
        return false;
      }
    }
    
    return currentIntent !== newIntent && sessionContext.currentFlow !== 'general';
  }

  /**
   * Map topic to conversation flow intent
   */
  private mapTopicToIntent(topic: string): string {
    const mapping: Record<string, string> = {
      'document_upload': 'document_upload',
      'appointment': 'appointment_booking', 
      'quote': 'insurance_quote',
      'faq': 'faq',
      'general': 'general'
    };
    return mapping[topic] || 'general';
  }

  /**
   * Check if detected intent is compatible with current active flow
   * FLOW PROTECTION: Prevents intent detection from resetting compatible flows
   */
  private isIntentCompatibleWithCurrentFlow(detectedIntent: string, currentFlow: string): boolean {
    // Intent compatibility matrix - defines which intents are compatible with which flows
    const compatibilityMatrix: Record<string, string[]> = {
      'appointment': [
        'appointment_booking',
        'schedule_related', 
        'time_specification',
        'faq',      // FAQ questions during appointment booking are OK
        'general'   // General responses should not reset appointment flow
      ],
      'quote': [
        'insurance_quote',
        'pricing_related',
        'coverage_related',
        'faq',      // FAQ questions during quote process are OK - this was the bug!
        'general'   // General responses should not reset quote flow
      ],
      'document_upload': [
        'document_upload',
        'file_related',
        'upload_related',
        'faq',      // FAQ questions during upload are OK
        'general'
      ],
      'faq': [
        'faq',
        'question_related',
        'information_request',
        'appointment_booking',  // Can switch from FAQ to appointment
        'insurance_quote',      // Can switch from FAQ to quote
        'general'
      ]
    };

    // Get compatible intents for current flow
    const compatibleIntents = compatibilityMatrix[currentFlow] || [];
    
    // Check if detected intent is in compatibility list
    const isCompatible = compatibleIntents.includes(detectedIntent);
    
    this.log(LogLevel.DEBUG, 'Intent compatibility check', {
      currentFlow,
      detectedIntent,
      isCompatible,
      compatibleIntents
    });
    
    return isCompatible;
  }

  /**
   * Legacy method for compatibility - delegates to enhanced detection
   */
  private async detectIntent(message: string, sessionContext: ChatContext): Promise<string> {
    const result = await this.detectTopicAndIntent(message, sessionContext);
    return result.intent;
  }

  // === RESPONSE GENERATION ===

  /**
   * Generate context-aware response
   */
  private async generateResponse(
    message: string, 
    sessionContext: ChatContext
  ): Promise<{
    message: string;
    nextStep?: string;
    options?: ChatOption[];
    uiUpdates?: UIUpdate[];
  }> {
    
    switch (sessionContext.currentFlow) {
      case 'document_upload':
        return await this.handleDocumentUploadFlow(message, sessionContext);
      
      case 'appointment':
        return await this.handleAppointmentFlow(message, sessionContext);
      
      case 'quote':
        return await this.handleQuoteFlow(message, sessionContext);
      
      case 'faq':
        return await this.handleFAQFlow(message, sessionContext);
      
      case 'mixed_intent':
        return await this.handleMixedIntentFlow(message, sessionContext);
      
      default:
        return await this.handleGeneralFlow(message, sessionContext);
    }
  }

  // === DOCUMENT UPLOAD FLOW ===

  /**
   * Handle document upload conversation flow
   */
  private async handleDocumentUploadFlow(
    message: string, 
    sessionContext: ChatContext
  ): Promise<{
    message: string;
    nextStep?: string;
    options?: ChatOption[];
    uiUpdates?: UIUpdate[];
  }> {
    const steps = this.CONVERSATION_FLOWS.document_upload;
    const currentStep = steps[sessionContext.stepInFlow];

    switch (currentStep) {
      case 'greeting':
        sessionContext.stepInFlow++;
        return {
          message: 'Gerne helfe ich Ihnen beim Hochladen Ihrer Dokumente. Dafür benötige ich einige Angaben von Ihnen. Wie ist Ihr Name?',
          nextStep: 'collect_name'
        };

      case 'collect_name':
        sessionContext.collectedData.name = this.extractName(message);
        sessionContext.stepInFlow++;
        return {
          message: `Vielen Dank, ${sessionContext.collectedData.name}. Können Sie mir bitte Ihre E-Mail-Adresse mitteilen?`,
          nextStep: 'collect_email'
        };

      case 'collect_email':
        const email = this.extractEmail(message);
        if (!email) {
          return {
            message: 'Das scheint keine gültige E-Mail-Adresse zu sein. Können Sie sie bitte nochmals eingeben?',
            nextStep: 'collect_email'
          };
        }
        sessionContext.collectedData.email = email;
        sessionContext.stepInFlow++;
        return {
          message: 'Danke! Haben Sie auch eine Telefonnummer für Rückfragen? (Optional)',
          nextStep: 'collect_phone'
        };

      case 'collect_phone':
        const phone = this.extractPhone(message);
        if (phone) {
          sessionContext.collectedData.phone = phone;
        }
        sessionContext.stepInFlow++;
        return {
          message: `Perfekt! Hier sind Ihre Angaben:
          
Name: ${sessionContext.collectedData.name}
E-Mail: ${sessionContext.collectedData.email}
${sessionContext.collectedData.phone ? `Telefon: ${sessionContext.collectedData.phone}` : ''}

Sind diese Angaben korrekt? (Ja/Nein)`,
          nextStep: 'confirm_data',
          options: [
            { id: 'confirm_yes', text: 'Ja, korrekt', action: 'confirm' },
            { id: 'confirm_no', text: 'Nein, ändern', action: 'restart' }
          ]
        };

      case 'confirm_data':
        if (message.toLowerCase().includes('nein') || message.toLowerCase().includes('ändern')) {
          sessionContext.stepInFlow = 1; // Restart from name collection
          sessionContext.collectedData = {};
          return {
            message: 'Kein Problem! Lassen Sie uns von vorne beginnen. Wie ist Ihr Name?',
            nextStep: 'collect_name'
          };
        }
        sessionContext.stepInFlow++;
        return {
          message: 'Ausgezeichnet! Jetzt können Sie Ihre Dokumente hochladen. Ziehen Sie die Dateien einfach in das Upload-Feld oder klicken Sie darauf.',
          nextStep: 'upload_document',
          uiUpdates: [
            {
              type: 'show_file_upload',
              data: {
                multiple: true,
                acceptedTypes: ['.pdf', '.docx', '.jpg', '.png'],
                maxSize: '20MB'
              }
            }
          ]
        };

      case 'upload_document':
        return {
          message: 'Ihre Dokumente werden verarbeitet... Bitte warten Sie einen Moment.',
          nextStep: 'processing'
        };

      default:
        return {
          message: 'Es gab einen Fehler im Prozess. Möchten Sie von vorne beginnen?',
          nextStep: 'restart'
        };
    }
  }

  // === APPOINTMENT FLOW ===

  /**
   * Enhanced appointment booking flow with full Supabase integration
   */
  private async handleAppointmentFlow(
    message: string, 
    sessionContext: ChatContext
  ): Promise<{
    message: string;
    nextStep?: string;
    options?: ChatOption[];
    uiUpdates?: UIUpdate[];
  }> {
    const steps = this.CONVERSATION_FLOWS.appointment;
    const currentStep = steps[sessionContext.stepInFlow];

    switch (currentStep) {
      case 'greeting':
        sessionContext.stepInFlow++;
        return {
          message: 'Sehr gerne vereinbare ich einen Termin für Sie! Als Schweizer Versicherungsexperten bieten wir Ihnen individuelle Beratung. Dafür benötige ich einige Angaben von Ihnen. Wie ist Ihr Name?',
          nextStep: 'collect_name'
        };

      case 'collect_name':
        sessionContext.collectedData.name = this.extractName(message);
        if (!sessionContext.collectedData.name) {
          return {
            message: 'Bitte teilen Sie mir Ihren Namen mit, damit ich den Termin korrekt erfassen kann.',
            nextStep: 'collect_name'
          };
        }
        sessionContext.stepInFlow++;
        return {
          message: `Vielen Dank, ${sessionContext.collectedData.name}! Können Sie mir bitte Ihre E-Mail-Adresse mitteilen? Darüber senden wir Ihnen die Terminbestätigung.`,
          nextStep: 'collect_email'
        };

      case 'collect_email':
        const email = this.extractEmail(message);
        if (!email) {
          return {
            message: 'Das scheint keine gültige E-Mail-Adresse zu sein. Bitte geben Sie eine korrekte E-Mail-Adresse ein (z.B. max.mustermann@email.ch).',
            nextStep: 'collect_email'
          };
        }
        sessionContext.collectedData.email = email;
        sessionContext.stepInFlow++;
        return {
          message: 'Perfekt! Bitte geben Sie auch Ihre Telefonnummer an, damit wir Sie bei Fragen oder Änderungen direkt erreichen können.',
          nextStep: 'collect_phone'
        };

      case 'collect_phone':
        const phone = this.extractPhone(message);
        if (!phone) {
          return {
            message: 'Bitte geben Sie eine gültige Schweizer Telefonnummer ein (z.B. 044 123 45 67 oder +41 44 123 45 67).',
            nextStep: 'collect_phone'
          };
        }
        sessionContext.collectedData.phone = phone;
        sessionContext.stepInFlow++;
        return {
          message: 'Ausgezeichnet! Welche Art von Beratung wünschen Sie?',
          nextStep: 'appointment_type',
          options: [
            { id: 'consultation', text: 'Allgemeine Versicherungsberatung', action: 'select_type' },
            { id: 'claim_review', text: 'Schadensbesprechung/Schaden melden', action: 'select_type' },
            { id: 'contract_discussion', text: 'Vertragsbesprechung/Änderungen', action: 'select_type' },
            { id: 'general', text: 'Sonstiges Anliegen', action: 'select_type' }
          ]
        };

      case 'appointment_type':
        const appointmentType = this.extractAppointmentType(message);
        (sessionContext.collectedData as any).appointmentType = appointmentType;
        sessionContext.stepInFlow++;
        return {
          message: 'Haben Sie einen bevorzugten Termin? Bitte nennen Sie mir Ihr Wunschdatum und -zeit (z.B. "Montag 14 Uhr" oder "Freitag Nachmittag").',
          nextStep: 'preferred_date',
          uiUpdates: [
            {
              type: 'show_calendar',
              data: {
                availableTimeSlots: true,
                businessHours: '08:00-17:00',
                excludeWeekends: false,
                timeZone: 'Europe/Zurich'
              }
            }
          ]
        };

      case 'preferred_date':
        const dateTime = this.extractDateTime(message);
        (sessionContext.collectedData as any).preferredDate = dateTime.date;
        (sessionContext.collectedData as any).preferredTime = dateTime.time;
        (sessionContext.collectedData as any).reason = this.extractReason(message);
        sessionContext.stepInFlow++;
        
        // If we have both date and time, move to confirm step
        if (dateTime.time) {
          return {
            message: `Perfekt! Ich habe Ihren Terminwunsch notiert:

🗓️ **Datum:** ${dateTime.date || 'Nach Vereinbarung'}
⏰ **Zeit:** ${dateTime.time}
💼 **Art:** ${this.getAppointmentTypeDisplay((sessionContext.collectedData as any).appointmentType)}

Soll ich den Termin so für Sie buchen?`,
            nextStep: 'confirm_appointment',
            options: [
              { id: 'confirm', text: 'Ja, Termin buchen', action: 'confirm_appointment' },
              { id: 'change_time', text: 'Zeit ändern', action: 'change_time' },
              { id: 'change_date', text: 'Datum ändern', action: 'change_date' }
            ]
          };
        }
        
        // If only date provided, ask for time
        return {
          message: `Ausgezeichnet! Für ${dateTime.date || 'Ihren gewünschten Tag'} - zu welcher Uhrzeit wäre der Termin ideal für Sie?

💡 **Beispiele:** "14 Uhr", "Nachmittag", "Vormittag", "10:30"`,
          nextStep: 'preferred_time'
        };

      case 'preferred_time':
        const timeOnly = this.extractDateTime(message);
        (sessionContext.collectedData as any).preferredTime = timeOnly.time || message.trim();
        sessionContext.stepInFlow++;
        
        return {
          message: `Perfect! Hier ist Ihr Terminwunsch:

🗓️ **Datum:** ${(sessionContext.collectedData as any).preferredDate}
⏰ **Zeit:** ${(sessionContext.collectedData as any).preferredTime}
💼 **Art:** ${this.getAppointmentTypeDisplay((sessionContext.collectedData as any).appointmentType)}

Soll ich den Termin so für Sie buchen?`,
          nextStep: 'confirm_appointment',
          options: [
            { id: 'confirm', text: 'Ja, Termin buchen', action: 'confirm_appointment' },
            { id: 'change_time', text: 'Zeit ändern', action: 'change_time' },
            { id: 'change_date', text: 'Datum ändern', action: 'change_date' }
          ]
        };

      case 'confirm_appointment':
        // Only create appointment when user confirms
        if (message.toLowerCase().includes('ja') || message.toLowerCase().includes('buchen') || 
            message.toLowerCase().includes('bestätig') || message.toLowerCase().includes('ok')) {
          
          try {
            const appointmentData = {
              customer_name: sessionContext.collectedData.name!,
              customer_email: sessionContext.collectedData.email!,
              customer_phone: sessionContext.collectedData.phone,
              appointment_type: (sessionContext.collectedData as any).appointmentType || 'consultation',
              preferred_date: (sessionContext.collectedData as any).preferredDate || 'Nach Vereinbarung',
              preferred_time: (sessionContext.collectedData as any).preferredTime || 'Flexibel',
              reason: (sessionContext.collectedData as any).reason,
              status: 'requested' as const,
              agent_id: this.getConfig().id,
              session_id: sessionContext.conversationHistory[0]?.id
            };
            
            const appointment = await this.supabase.createAppointment(appointmentData);
            
            // Send confirmation emails
            try {
              await Promise.all([
                this.emailService.sendAppointmentConfirmation(appointment),
                this.emailService.sendAppointmentNotificationToStaff(appointment)
              ]);
              this.log(LogLevel.INFO, 'Appointment confirmation emails sent', { appointmentId: appointment.id });
            } catch (emailError) {
              this.log(LogLevel.WARN, 'Failed to send appointment emails', { emailError, appointmentId: appointment.id });
            }
            
            sessionContext.stepInFlow++;
            return {
              message: `🎉 Perfekt! Ihr Terminwunsch wurde erfolgreich registriert:

📋 **Termindetails:**
👤 Name: ${appointment.customer_name}
📧 E-Mail: ${appointment.customer_email}
📞 Telefon: ${appointment.customer_phone}
🗓️ Gewünschter Termin: ${appointment.preferred_date} um ${appointment.preferred_time}
💼 Art: ${this.getAppointmentTypeDisplay(appointment.appointment_type)}

✅ **Referenz-Nr.:** ${appointment.id.slice(0, 8).toUpperCase()}

Ein Mitarbeiter aus unserem Beratungsteam wird Sie innerhalb der nächsten 24 Stunden kontaktieren, um den genauen Termin zu bestätigen.

📧 **Bestätigungs-E-Mail wurde an ${appointment.customer_email} gesendet.**
📲 **Unser Team wurde automatisch benachrichtigt.**

Gibt es noch etwas anderes, womit ich Ihnen helfen kann?`,
              nextStep: 'complete',
              options: [
                { id: 'upload', text: 'Dokumente hochladen', action: 'start_upload' },
                { id: 'quote', text: 'Offerte anfordern', action: 'start_quote' },
                { id: 'question', text: 'Weitere Fragen', action: 'start_faq' }
              ]
            };
          } catch (error) {
            this.log(LogLevel.ERROR, 'Failed to create appointment', { error });
            return {
              message: 'Es gab ein technisches Problem bei der Terminerfassung. Bitte kontaktieren Sie uns direkt unter info@alphaagents.ch oder +41 44 123 45 67. Ihre Daten: ' +
                      `${sessionContext.collectedData.name}, ${sessionContext.collectedData.email}, ${sessionContext.collectedData.phone}`,
              nextStep: 'error'
            };
          }
        } else {
          // User wants to change something
          return {
            message: 'Kein Problem! Was möchten Sie ändern?',
            nextStep: 'preferred_date',
            options: [
              { id: 'change_date', text: 'Anderes Datum', action: 'change_date' },
              { id: 'change_time', text: 'Andere Zeit', action: 'change_time' },
              { id: 'change_type', text: 'Andere Art', action: 'change_type' }
            ]
          };
        }

      default:
        return {
          message: 'Ihr Termin wird bearbeitet. Vielen Dank für Ihr Vertrauen!',
          nextStep: 'complete'
        };
    }
  }

  // === FAQ FLOW ===

  /**
   * Handle FAQ questions with PERFORMANCE-OPTIMIZED Knowledge Base Search
   */
  private async handleFAQFlow(
    message: string, 
    sessionContext: ChatContext
  ): Promise<{
    message: string;
    nextStep?: string;
    options?: ChatOption[];
  }> {
    try {
      // PERFORMANCE CRITICAL: Check Knowledge Base first (1-5ms)
      console.log('🔍 FAQ Flow triggered for message:', message);
      const faqResult = this.searchInsuranceFAQ(message);
      console.log('📊 FAQ Search Result:', { 
        found: faqResult.found, 
        confidence: faqResult.confidence, 
        processingTime: faqResult.processingTime,
        topic: faqResult.topic 
      });
      
      if (faqResult.found) {
        this.log(LogLevel.DEBUG, 'Quick FAQ match found', { 
          confidence: faqResult.confidence, 
          processingTime: faqResult.processingTime,
          topic: faqResult.topic 
        });
        return {
          message: faqResult.response || 'Entschuldigung, ich konnte keine passende Antwort finden. Können Sie Ihre Frage anders formulieren?',
          nextStep: 'continue_faq'
        };
      }

      // Generate AI response for complex questions
      const systemPrompt = `Du bist ein Experte für Schweizer Versicherungen und hilfst Kunden bei Fragen.

Beantworte die Frage höflich, präzise und hilfreich auf Deutsch.
Verwende "Sie" für die Anrede.
Halte die Antwort unter 150 Wörtern.
Falls die Frage zu komplex ist, empfehle ein persönliches Gespräch.

Spezialisierung: Schweizer Kranken-, Unfall- und Haftpflichtversicherungen.`;

      const prompt = `Kundenfrage: ${message}

Erstelle eine hilfreiche Antwort:`;

      const result = await this.openai.generateText(prompt, {
        systemPrompt,
        temperature: 0.3,
        maxTokens: 300
      });

      return {
        message: result.content + '\n\nHaben Sie weitere Fragen?',
        nextStep: 'continue_faq'
      };
    } catch (error) {
      this.log(LogLevel.ERROR, 'FAQ response generation failed', { error });
      return {
        message: 'Entschuldigung, ich kann Ihre Frage momentan nicht beantworten. Ein Mitarbeiter wird Ihnen gerne weiterhelfen. Möchten Sie einen Termin vereinbaren?',
        nextStep: 'offer_appointment'
      };
    }
  }

  // === PERFORMANCE-CRITICAL KNOWLEDGE BASE SEARCH ===

  /**
   * PERFORMANCE CRITICAL: Search Swiss Insurance FAQ Knowledge Base
   * Target: <5ms response time for pattern matches
   */
  private searchInsuranceFAQ(message: string): {
    found: boolean;
    response?: string;
    confidence: number;
    processingTime: number;
    topic?: string;
  } {
    const startTime = Date.now();
    const messageLower = message.toLowerCase();
    
    // Enhanced keyword matching with synonyms and Swiss terms
    const keywords = {
      'reiseversicherung': ['reise', 'ausland', 'ferien', 'urlaub', 'trip', 'travel', 'abroad', 'holiday', 'annullation', 'auslandreise'],
      'rechtschutzversicherung': ['rechtschutz', 'rechtsschutz', 'anwalt', 'gericht', 'streit', 'klage', 'legal', 'jurist', 'prozess', 'verfahren', 'rechtsfall'],
      'krankenversicherung': ['kranken', 'grundversicherung', 'zusatz', 'franchise', 'krankenkasse', 'kvg', 'vvg', 'selbstbehalt', 'prämie', 'gesundheit'],
      'unfallversicherung': ['unfall', 'suva', 'uvg', 'beruflich', 'nichtberuflich', 'arbeitsunfall', 'berufsunfall', 'accident', 'invalidität', 'erwerbsunfähigkeit', 'arbeitsweg', 'betriebsunfall', 'freizeitunfall', 'sportunfall', 'unfallschutz'],
      'haftpflichtversicherung': ['haftpflicht', 'schaden', 'haftung', 'privat', 'motorfahrzeug', 'liability', 'verantwortung', 'fahrzeug', 'auto'],
      'sachversicherung': ['hausrat', 'gebäude', 'kasko', 'sachschaden', 'vollkasko', 'teilkasko', 'immobilie', 'eigentum', 'besitz'],
      'vorsorge': ['vorsorge', 'säule', '3a', '3b', 'pensionskasse', 'ahv', 'rente', 'pension', 'bvg', 'pk', 'einkauf', 'frühpensionierung'],
    };

    // Search for best match
    let bestMatch = { category: '', subCategory: '', confidence: 0, content: '' };
    
    for (const [category, categoryKeywords] of Object.entries(keywords)) {
      const categoryMatch = categoryKeywords.some(keyword => messageLower.includes(keyword));
      
      if (categoryMatch && (this.SWISS_INSURANCE_FAQ as any)[category]) {
        // Calculate confidence based on keyword density and specificity
        let confidence = 0.6; // Base confidence for category match
        
        // Check subcategories for more specific matches
        const faqData = (this.SWISS_INSURANCE_FAQ as any)[category];
        
        for (const [subCategory, content] of Object.entries(faqData)) {
          const subKeywords = this.getSubCategoryKeywords(subCategory);
          const subMatch = subKeywords.some(keyword => messageLower.includes(keyword));
          
          if (subMatch) {
            confidence += 0.2; // Bonus for subcategory match
            
            // Question word bonus
            if (/was|wie|warum|wann|wo|welche|kosten|preis|teuer/.test(messageLower)) {
              confidence += 0.15;
            }
            
            // Action word bonus
            if (/möchte|will|brauche|suche|benötige/.test(messageLower)) {
              confidence += 0.1;
            }
            
            if (confidence > bestMatch.confidence) {
              bestMatch = { category, subCategory, confidence, content: content as string };
            }
          }
        }
        
        // Fallback to general category info if no subcategory match
        if (bestMatch.confidence < 0.7 && confidence > bestMatch.confidence) {
          const generalContent = (faqData as any)['grundlagen'] || Object.values(faqData)[0];
          bestMatch = { category, subCategory: 'grundlagen', confidence, content: generalContent as string };
        }
      }
    }

    const processingTime = Date.now() - startTime;
    
    // Return result if confidence threshold met
    if (bestMatch.confidence >= 0.65) {
      return {
        found: true,
        response: this.formatFAQResponse(bestMatch.category, bestMatch.subCategory, bestMatch.content),
        confidence: bestMatch.confidence,
        processingTime,
        topic: bestMatch.category
      };
    }
    
    return {
      found: false,
      confidence: bestMatch.confidence,
      processingTime,
      topic: bestMatch.category || 'unknown'
    };
  }

  /**
   * Get keywords for subcategories to improve matching
   */
  private getSubCategoryKeywords(subCategory: string): string[] {
    const keywordMap: Record<string, string[]> = {
      'grundlagen': ['was', 'grundlagen', 'basis', 'erklärung'],
      'leistungen': ['leistung', 'deckt', 'übernimmt', 'bezahlt', 'abgedeckt'],
      'kosten': ['kosten', 'preis', 'prämie', 'teuer', 'kostet'],
      'anbieter': ['anbieter', 'versicherer', 'firma', 'unternehmen', 'empfehlung'],
      'ausschlüsse': ['ausschluss', 'nicht', 'deckt nicht', 'ausgenommen'],
      'tipps': ['tipps', 'empfehlung', 'wichtig', 'beachten', 'tipp'],
      'bereiche': ['bereich', 'art', 'arten', 'typ'],
      'franchise': ['franchise', 'selbstbehalt'],
      'zusatzversicherung': ['zusatz', 'zusätzlich', 'ergänzung'],
      'grundversicherung': ['grund', 'basis', 'obligatorisch'],
      'prämienverbilligung': ['verbilligung', 'rabatt', 'günstiger', 'subvention'],
      'gebäudeversicherung': ['gebäude', 'haus', 'immobilie'],
      'motorfahrzeug': ['auto', 'fahrzeug', 'motor', 'verkehr'],
      'säule3a': ['3a', 'steuer', 'vorsorge'],
      'pensionskasse': ['pensionskasse', '2. säule', 'beruflich'],
      'frühpensionierung': ['früh', 'vorzeitig', 'pensionierung'],
      'einkauf': ['einkauf', 'einzahlung', 'nachkauf']
    };
    
    return keywordMap[subCategory] || [subCategory];
  }

  /**
   * Format FAQ response for better user experience
   */
  private formatFAQResponse(category: string, _subCategory: string, content: string): string {
    const categoryNames: Record<string, string> = {
      'reiseversicherung': 'Reiseversicherung',
      'rechtschutzversicherung': 'Rechtschutzversicherung',
      'krankenversicherung': 'Krankenversicherung',
      'unfallversicherung': 'Unfallversicherung',
      'haftpflichtversicherung': 'Haftpflichtversicherung',
      'sachversicherung': 'Sachversicherung',
      'vorsorge': 'Vorsorge'
    };

    const categoryName = categoryNames[category] || category;
    
    return `**${categoryName}**\n\n${content}\n\nHaben Sie weitere Fragen zu diesem Thema? Gerne helfe ich Ihnen weiter oder vereinbare einen Beratungstermin.`;
  }

  // === MIXED INTENT FLOW ===

  /**
   * Handle mixed intent - when user has multiple intentions in one message
   */
  private async handleMixedIntentFlow(
    message: string, 
    sessionContext: ChatContext
  ): Promise<{
    message: string;
    nextStep?: string;
    options?: ChatOption[];
  }> {
    // Reset to general flow for clarification
    sessionContext.currentFlow = 'general';
    sessionContext.stepInFlow = 0;
    
    return {
      message: `Ich verstehe, dass Sie mehrere Anliegen haben. Lassen Sie mich Ihnen dabei helfen! 

Womit möchten Sie zuerst beginnen?`,
      nextStep: 'clarify_intent',
      options: [
        { id: 'upload', text: 'Dokumente hochladen', action: 'start_upload' },
        { id: 'appointment', text: 'Termin vereinbaren', action: 'start_appointment' },
        { id: 'quote', text: 'Offerte anfordern', action: 'start_quote' },
        { id: 'info', text: 'Informationen erhalten', action: 'start_faq' }
      ]
    };
  }

  // === GENERAL FLOW ===

  /**
   * Handle general conversation
   */
  private async handleGeneralFlow(
    message: string, 
    sessionContext: ChatContext
  ): Promise<{
    message: string;
    nextStep?: string;
    options?: ChatOption[];
  }> {
    // Welcome message for new sessions
    if (sessionContext.conversationHistory.length <= 1) {
      return {
        message: `Willkommen bei AlphaAgents! 👋

Ich bin Ihr digitaler Assistent und helfe Ihnen gerne bei:

• Dokumenten-Upload und -verarbeitung
• Terminvereinbarungen  
• Versicherungsofferten
• Fragen zu unseren Services

Womit kann ich Ihnen heute helfen?`,
        nextStep: 'await_intent',
        options: [
          { id: 'upload', text: 'Dokumente hochladen', action: 'start_upload' },
          { id: 'appointment', text: 'Termin vereinbaren', action: 'start_appointment' },
          { id: 'quote', text: 'Offerte anfordern', action: 'start_quote' },
          { id: 'question', text: 'Frage stellen', action: 'start_faq' }
        ]
      };
    }

    // Handle ongoing general conversation
    try {
      const systemPrompt = `Du bist ein freundlicher Kundenservice-Chatbot für ein Schweizer Versicherungsunternehmen.

Verhalte dich natürlich und hilfsbereit.
Leite Kunden zu den verfügbaren Services:
- Dokumenten-Upload
- Terminvereinbarung
- Versicherungsofferten
- FAQ-Support

Antworte kurz und präzise auf Deutsch mit "Sie".`;

      const result = await this.openai.generateText(message, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 200
      });

      return {
        message: result.content,
        nextStep: 'continue_general'
      };
    } catch (error) {
      return {
        message: 'Entschuldigung, können Sie das bitte wiederholen? Oder wählen Sie eine der verfügbaren Optionen.',
        nextStep: 'await_intent',
        options: [
          { id: 'upload', text: 'Dokumente hochladen', action: 'start_upload' },
          { id: 'appointment', text: 'Termin vereinbaren', action: 'start_appointment' },
          { id: 'quote', text: 'Offerte anfordern', action: 'start_quote' },
          { id: 'question', text: 'Frage stellen', action: 'start_faq' }
        ]
      };
    }
  }

  // === DOCUMENT UPLOAD HANDLING ===

  /**
   * Handle document upload action
   */
  private async handleDocumentUpload(input: ChatAgentInput, context: AgentContext): Promise<AgentResult<ChatAgentOutput>> {
    if (!input.document) {
      throw new ValidationError('Document is required for upload action');
    }

    const sessionContext = this.getOrCreateSession(input.sessionId, input.context);

    try {
      // Process document using DocumentAgent
      const documentResult = await this.documentAgent.run({
        action: 'upload',
        file: {
          buffer: input.document.buffer,
          originalName: input.document.filename,
          mimeType: input.document.mimeType,
          size: input.document.size
        },
        userInfo: sessionContext.collectedData
      }, {
        agentId: 'chat-agent',
        sessionId: input.sessionId,
        timestamp: new Date()
      });

      let message: string;
      let documentProcessed: DocumentProcessingResult;

      if (documentResult.success && documentResult.data?.documentRecord) {
        message = `Ihr Dokument "${input.document.filename}" wurde erfolgreich hochgeladen und wird nun verarbeitet. Sie erhalten eine Bestätigung per E-Mail.`;
        documentProcessed = {
          documentId: documentResult.data.documentRecord.id,
          filename: input.document.filename,
          status: 'uploaded',
          documentType: documentResult.data.documentRecord.document_type
        };
      } else {
        message = `Leider konnte das Dokument "${input.document.filename}" nicht verarbeitet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.`;
        documentProcessed = {
          documentId: '',
          filename: input.document.filename,
          status: 'failed'
        };
      }

      // Update conversation flow
      if (sessionContext.currentFlow === 'document_upload') {
        sessionContext.stepInFlow = this.CONVERSATION_FLOWS.document_upload.length; // Mark as complete
      }

      return this.createSuccessResult(context, {
        status: documentResult.success ? 'success' : 'error',
        message: 'Document upload processed',
        response: message,
        conversationState: this.buildConversationState(sessionContext, input.sessionId),
        documentProcessed
      });
    } catch (error) {
      this.log(LogLevel.ERROR, 'Document upload handling failed', { error });
      throw error;
    }
  }

  // === PLACEHOLDER HANDLERS ===

  /**
   * Enhanced appointment booking with full Supabase integration
   */
  private async handleAppointmentBooking(input: ChatAgentInput, context: AgentContext): Promise<AgentResult<ChatAgentOutput>> {
    if (!input.appointmentRequest) {
      throw new ValidationError('Appointment request data is required');
    }

    const sessionContext = this.getOrCreateSession(input.sessionId, input.context);

    try {
      const appointmentData = {
        customer_name: input.userInfo?.name || 'Unbekannt',
        customer_email: input.userInfo?.email || '',
        customer_phone: input.userInfo?.phone,
        appointment_type: input.appointmentRequest.appointmentType || 'consultation',
        preferred_date: input.appointmentRequest.preferredDate || 'Nach Vereinbarung',
        preferred_time: input.appointmentRequest.preferredTime || 'Flexibel',
        reason: input.appointmentRequest.reason,
        status: 'requested' as const,
        agent_id: this.getConfig().id,
        session_id: input.sessionId
      };
      
      const appointment = await this.supabase.createAppointment(appointmentData);
      
      // Send email confirmations
      try {
        await Promise.all([
          this.emailService.sendAppointmentConfirmation(appointment),
          this.emailService.sendAppointmentNotificationToStaff(appointment)
        ]);
      } catch (emailError) {
        this.log(LogLevel.WARN, 'Failed to send appointment emails via API', { emailError });
      }
      
      return this.createSuccessResult(context, {
        status: 'success',
        message: 'Appointment booking processed',
        response: `Ihr Termin wurde erfolgreich registriert! Referenz: ${appointment.id.slice(0, 8).toUpperCase()}. Ein Mitarbeiter wird Sie kontaktieren.`,
        appointmentDetails: {
          confirmed: false,
          appointmentId: appointment.id,
          scheduledDate: appointment.preferred_date,
          scheduledTime: appointment.preferred_time,
          appointmentType: appointment.appointment_type,
          notes: `Status: ${appointment.status}`
        }
      });
    } catch (error) {
      this.log(LogLevel.ERROR, 'Appointment booking failed', { error });
      throw error;
    }
  }

  /**
   * Enhanced quote request with Swiss insurance calculations
   */
  private async handleQuoteRequest(input: ChatAgentInput, context: AgentContext): Promise<AgentResult<ChatAgentOutput>> {
    if (!input.quoteRequest) {
      throw new ValidationError('Quote request data is required');
    }

    const sessionContext = this.getOrCreateSession(input.sessionId, input.context);

    try {
      const quoteData = {
        customer_name: input.userInfo?.name || 'Unbekannt',
        customer_email: input.userInfo?.email || '',
        customer_phone: input.userInfo?.phone,
        insurance_type: input.quoteRequest.insuranceType,
        coverage_details: {
          coverage: input.quoteRequest.coverage,
          deductible: input.quoteRequest.deductible,
          additionalInfo: input.quoteRequest.additionalInfo,
          customerProfile: input.quoteRequest.customerProfile
        },
        estimated_premium: this.calculateSwissPremium(input.quoteRequest),
        premium_currency: 'CHF',
        coverage_amount: input.quoteRequest.additionalInfo?.coverageAmount,
        deductible: input.quoteRequest.deductible,
        additional_info: input.quoteRequest.additionalInfo,
        status: 'calculated' as const,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        agent_id: this.getConfig().id,
        session_id: input.sessionId
      };
      
      const quote = await this.supabase.createQuote(quoteData);
      
      // Send email confirmations
      try {
        await Promise.all([
          this.emailService.sendQuoteConfirmation(quote),
          this.emailService.sendQuoteNotificationToStaff(quote)
        ]);
      } catch (emailError) {
        this.log(LogLevel.WARN, 'Failed to send quote emails via API', { emailError });
      }
      
      return this.createSuccessResult(context, {
        status: 'success',
        message: 'Quote request processed',
        response: `Ihre Offerte wurde erstellt! Referenz: ${quote.id.slice(0, 8).toUpperCase()}. Geschätzte Prämie: CHF ${quote.estimated_premium}/Jahr.`,
        quoteResult: {
          quoteId: quote.id,
          insuranceType: quote.insurance_type,
          estimatedPremium: `CHF ${quote.estimated_premium}`,
          coverageDetails: JSON.stringify(quote.coverage_details),
          validUntil: new Date(quote.valid_until),
          nextSteps: [
            'Prüfung der Offerte',
            'Bei Interesse: Terminvereinbarung',
            'Vertragsabschluss'
          ]
        }
      });
    } catch (error) {
      this.log(LogLevel.ERROR, 'Quote request failed', { error });
      throw error;
    }
  }

  /**
   * Handle info request (placeholder)
   */
  private async handleInfoRequest(input: ChatAgentInput, context: AgentContext): Promise<AgentResult<ChatAgentOutput>> {
    // Placeholder implementation
    return this.createSuccessResult(context, {
      status: 'success',
      message: 'Info request processed',
      response: 'Gerne beantworte ich Ihre Fragen zu unseren Versicherungsprodukten.'
    });
  }

  /**
   * Handle session end
   */
  private async handleEndSession(input: ChatAgentInput, context: AgentContext): Promise<AgentResult<ChatAgentOutput>> {
    // Remove session from active sessions
    this.activeSessions.delete(input.sessionId);

    return this.createSuccessResult(context, {
      status: 'success',
      message: 'Session ended',
      response: 'Vielen Dank für Ihren Besuch! Haben Sie einen schönen Tag.'
    });
  }

  // === UTILITY METHODS ===

  /**
   * Get or create enhanced chat session with context switching support
   */
  private getOrCreateSession(sessionId: string, inputContext?: ChatContext): ChatContext {
    const existing = this.activeSessions.get(sessionId);
    if (existing) {
      return existing;
    }

    const newSession: ChatContext = {
      currentFlow: 'general',
      stepInFlow: 0,
      collectedData: {},
      conversationHistory: [],
      language: 'de',
      // Enhanced context switching fields
      previousFlow: undefined,
      topicHistory: [],
      contextSwitchCount: 0,
      lastTopicChange: undefined,
      customerJourney: {
        touchpoints: [],
        preferences: {},
        urgency: 'low'
      },
      ...inputContext
    };

    this.activeSessions.set(sessionId, newSession);
    return newSession;
  }

  /**
   * Build conversation state for client
   */
  private buildConversationState(sessionContext: ChatContext, sessionId: string): ConversationState {
    const flows = this.CONVERSATION_FLOWS[sessionContext.currentFlow as keyof typeof this.CONVERSATION_FLOWS];
    const isComplete = flows ? sessionContext.stepInFlow >= flows.length : false;

    return {
      sessionId,
      currentFlow: sessionContext.currentFlow,
      stepInFlow: sessionContext.stepInFlow,
      dataCollected: { ...sessionContext.collectedData },
      isComplete,
      nextExpectedInput: this.getNextExpectedInput(sessionContext),
      context: {
        intent: sessionContext.intent,
        language: sessionContext.language
      }
    };
  }

  /**
   * Get next expected input based on current flow
   */
  private getNextExpectedInput(sessionContext: ChatContext): string {
    const flows = this.CONVERSATION_FLOWS[sessionContext.currentFlow as keyof typeof this.CONVERSATION_FLOWS];
    if (!flows || sessionContext.stepInFlow >= flows.length) {
      return 'message';
    }

    const currentStep = flows[sessionContext.stepInFlow];
    
    switch (currentStep) {
      case 'collect_name': return 'name';
      case 'collect_email': return 'email';
      case 'collect_phone': return 'phone';
      case 'confirm_data': return 'confirmation';
      case 'upload_document': return 'file';
      case 'preferred_date': return 'date';
      case 'preferred_time': return 'time';
      default: return 'message';
    }
  }

  /**
   * Extract name from message
   */
  private extractName(message: string): string {
    // Simple name extraction - could be enhanced with NLP
    const cleaned = message.replace(/^(ich heisse|mein name ist|ich bin)/i, '').trim();
    return cleaned.split(' ').slice(0, 2).join(' '); // First two words
  }

  /**
   * Extract email from message
   */
  private extractEmail(message: string): string | null {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = message.match(emailRegex);
    return match ? match[0] : null;
  }

  /**
   * Extract phone from message (enhanced for Swiss numbers)
   */
  private extractPhone(message: string): string | null {
    // Swiss phone number patterns
    const patterns = [
      /(?:\+41|0041)\s?[1-9]\d{1}\s?\d{3}\s?\d{2}\s?\d{2}/,
      /0[1-9]\d{1}\s?\d{3}\s?\d{2}\s?\d{2}/,
      /\d{3}\s?\d{3}\s?\d{2}\s?\d{2}/
    ];
    
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[0].replace(/\s/g, '');
      }
    }
    return null;
  }

  /**
   * Extract appointment type from message
   */
  private extractAppointmentType(message: string): string {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('beratung') || messageLower.includes('consultation')) {
      return 'consultation';
    }
    if (messageLower.includes('schaden') || messageLower.includes('claim')) {
      return 'claim_review';
    }
    if (messageLower.includes('vertrag') || messageLower.includes('contract')) {
      return 'contract_discussion';
    }
    return 'general';
  }

  /**
   * Extract date and time from message
   */
  private extractDateTime(message: string): { date: string; time: string } {
    const messageLower = message.toLowerCase();
    
    // Extract date
    let date = 'Nach Vereinbarung';
    const days = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag'];
    const foundDay = days.find(day => messageLower.includes(day));
    if (foundDay) {
      date = foundDay.charAt(0).toUpperCase() + foundDay.slice(1);
    }
    
    // Extract time
    let time = 'Flexibel';
    const timeMatch = message.match(/(\d{1,2})(?:[:.]\d{2})?\s*(?:uhr|h|:00)?/i);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1]);
      if (hour >= 8 && hour <= 17) {
        time = `${hour}:00`;
      }
    }
    
    if (messageLower.includes('morgen')) time = '09:00';
    if (messageLower.includes('nachmittag')) time = '14:00';
    if (messageLower.includes('abend')) time = '17:00';
    
    return { date, time };
  }

  /**
   * Extract reason from message
   */
  private extractReason(message: string): string {
    // Simple extraction - could be enhanced with NLP
    if (message.length > 50) {
      return message.substring(0, 200) + (message.length > 200 ? '...' : '');
    }
    return message;
  }

  /**
   * Extract insurance type from message
   */
  private extractInsuranceType(message: string): string {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('reise')) return 'reiseversicherung';
    if (messageLower.includes('kranken')) return 'krankenversicherung';
    if (messageLower.includes('unfall')) return 'unfallversicherung';
    if (messageLower.includes('haftpflicht')) return 'haftpflichtversicherung';
    if (messageLower.includes('hausrat') || messageLower.includes('auto') || messageLower.includes('sach')) return 'sachversicherung';
    if (messageLower.includes('leben') || messageLower.includes('risiko')) return 'lebensversicherung';
    if (messageLower.includes('rechtsschutz')) return 'rechtsschutzversicherung';
    
    return 'unknown'; // Return unknown instead of default
  }

  /**
   * Get display name for appointment type
   */
  private getAppointmentTypeDisplay(type: string): string {
    const types: Record<string, string> = {
      'consultation': 'Allgemeine Beratung',
      'claim_review': 'Schadensbesprechung',
      'contract_discussion': 'Vertragsbesprechung',
      'general': 'Allgemeines Anliegen'
    };
    return types[type] || 'Beratung';
  }

  /**
   * Get display name for insurance type
   */
  private getInsuranceTypeDisplay(type: string): string {
    const types: Record<string, string> = {
      'reiseversicherung': 'Die Reiseversicherung',
      'krankenversicherung': 'Die Krankenversicherung',
      'unfallversicherung': 'Die Unfallversicherung',
      'haftpflichtversicherung': 'Die Haftpflichtversicherung',
      'sachversicherung': 'Die Sachversicherung',
      'lebensversicherung': 'Die Lebensversicherung',
      'rechtsschutzversicherung': 'Die Rechtsschutzversicherung'
    };
    return types[type] || 'Die Versicherung';
  }

  /**
   * Generate insurance-specific questions
   */
  private async generateInsuranceSpecificQuestions(sessionContext: ChatContext): Promise<{
    message: string;
    nextStep?: string;
    options?: ChatOption[];
  }> {
    const insuranceType = (sessionContext.collectedData as any).insuranceType;
    
    switch (insuranceType) {
      case 'krankenversicherung':
        return {
          message: 'Für die Krankenversicherung: Wie alt sind Sie? Haben Sie bereits eine Grundversicherung? Welche Zusatzleistungen interessieren Sie?',
          nextStep: 'specific_questions',
          options: [
            { id: 'grund', text: 'Nur Grundversicherung', action: 'select_coverage' },
            { id: 'zusatz', text: 'Grund + Zusatzversicherung', action: 'select_coverage' },
            { id: 'premium', text: 'Premium-Paket', action: 'select_coverage' }
          ]
        };
      
      case 'haftpflichtversicherung':
        return {
          message: 'Für die Haftpflichtversicherung: Sind Sie Mieter oder Eigentümer? Haben Sie Fahrzeuge? Welche Deckungssumme wünschen Sie?',
          nextStep: 'specific_questions',
          options: [
            { id: 'basic', text: 'Basis (5 Mio. CHF)', action: 'select_coverage' },
            { id: 'comfort', text: 'Comfort (10 Mio. CHF)', action: 'select_coverage' },
            { id: 'premium', text: 'Premium (20 Mio. CHF)', action: 'select_coverage' }
          ]
        };
      
      default:
        return {
          message: 'Bitte teilen Sie mir weitere Details zu Ihren Wünschen mit (Alter, Beruf, besondere Anforderungen).',
          nextStep: 'specific_questions'
        };
    }
  }

  /**
   * Collect insurance-specific data
   */
  private async collectInsuranceSpecificData(message: string, sessionContext: ChatContext): Promise<void> {
    const additionalInfo = (sessionContext.collectedData as any).additionalInfo || {};
    
    // Extract age
    const ageMatch = message.match(/(\d{1,3})\s*(?:jahre?|years?|j\.)/i);
    if (ageMatch) {
      additionalInfo.age = parseInt(ageMatch[1]);
    }
    
    // Extract coverage preferences
    if (message.toLowerCase().includes('grund')) {
      additionalInfo.coverage = 'basic';
    } else if (message.toLowerCase().includes('zusatz')) {
      additionalInfo.coverage = 'additional';
    } else if (message.toLowerCase().includes('premium')) {
      additionalInfo.coverage = 'premium';
    }
    
    (sessionContext.collectedData as any).additionalInfo = additionalInfo;
  }

  /**
   * Generate Swiss insurance quote data
   */
  private async generateSwissInsuranceQuote(sessionContext: ChatContext): Promise<any> {
    const insuranceType = (sessionContext.collectedData as any).insuranceType;
    const additionalInfo = (sessionContext.collectedData as any).additionalInfo || {};
    
    const baseQuote = {
      customer_name: sessionContext.collectedData.name!,
      customer_email: sessionContext.collectedData.email!,
      customer_phone: sessionContext.collectedData.phone,
      insurance_type: insuranceType,
      coverage_details: additionalInfo,
      estimated_premium: this.calculateSwissPremium({ 
        insuranceType, 
        additionalInfo 
      } as any),
      premium_currency: 'CHF',
      deductible: additionalInfo.deductible || 300,
      additional_info: additionalInfo,
      status: 'calculated' as const,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      agent_id: this.getConfig().id,
      session_id: sessionContext.conversationHistory[0]?.id
    };
    
    return baseQuote;
  }

  /**
   * Calculate Swiss insurance premium
   */
  private calculateSwissPremium(quoteRequest: QuoteRequest): number {
    const baseRates: Record<string, number> = {
      'krankenversicherung': 3600,
      'unfallversicherung': 800,
      'haftpflichtversicherung': 300,
      'sachversicherung': 1200,
      'lebensversicherung': 2400
    };
    
    let basePremium = baseRates[quoteRequest.insuranceType] || 1000;
    
    // Age factor for health insurance
    if (quoteRequest.insuranceType === 'krankenversicherung' && quoteRequest.customerProfile?.age) {
      const age = quoteRequest.customerProfile.age;
      if (age > 25) basePremium += (age - 25) * 20;
    }
    
    // Coverage factor
    if (quoteRequest.additionalInfo?.coverage === 'premium') {
      basePremium *= 1.5;
    } else if (quoteRequest.additionalInfo?.coverage === 'additional') {
      basePremium *= 1.2;
    }
    
    // Deductible factor
    if (quoteRequest.deductible && quoteRequest.deductible > 300) {
      basePremium *= (1 - (quoteRequest.deductible - 300) / 10000);
    }
    
    return Math.round(basePremium);
  }

  /**
   * Format quote presentation
   */
  private formatQuotePresentation(quote: any): string {
    return `🎉 **Ihre persönliche Versicherungsofferte ist bereit!**

📋 **Offerten-Details:**
👤 Name: ${quote.customer_name}
📧 E-Mail: ${quote.customer_email}
💼 Versicherung: ${this.getInsuranceTypeDisplay(quote.insurance_type)}

💰 **Geschätzte Jahresprämie: CHF ${quote.estimated_premium}**
🔒 Gültig bis: ${new Date(quote.valid_until).toLocaleDateString('de-CH')}

✅ **Referenz-Nr.:** ${quote.id.slice(0, 8).toUpperCase()}

📧 **Eine detaillierte Offerte wurde an ${quote.customer_email} gesendet.**
📲 **Unser Beratungsteam wurde über Ihre Anfrage informiert.**

Was möchten Sie als nächstes tun?`;
  }

  /**
   * Find FAQ response
   */
  private findFAQResponse(message: string): string | null {
    const messageLower = message.toLowerCase();
    
    for (const [category, topics] of Object.entries(this.SWISS_INSURANCE_FAQ)) {
      if (messageLower.includes(category)) {
        for (const [topic, answer] of Object.entries(topics)) {
          if (messageLower.includes(topic)) {
            return answer;
          }
        }
        // Return first answer from category if no specific topic matches
        return Object.values(topics)[0];
      }
    }
    
    return null;
  }

  /**
   * Enhanced chat interaction logging with context switching metrics
   */
  private async logChatInteraction(
    sessionId: string,
    userMessage: ChatMessage,
    botMessage: ChatMessage,
    sessionContext: ChatContext,
    additionalData?: Record<string, any>
  ): Promise<void> {
    try {
      await this.supabase.logAgentActivity({
        agent_id: this.getConfig().id,
        agent_name: this.getConfig().name,
        session_id: sessionId,
        user_id: sessionContext.collectedData.email || 'anonymous',
        level: 'info',
        message: 'Enhanced chat interaction',
        data: {
          userMessage: {
            content: userMessage.content,
            timestamp: userMessage.timestamp
          },
          botResponse: {
            content: botMessage.content,
            timestamp: botMessage.timestamp
          },
          flow: {
            currentFlow: sessionContext.currentFlow,
            previousFlow: sessionContext.previousFlow,
            stepInFlow: sessionContext.stepInFlow,
            intent: sessionContext.intent
          },
          contextSwitching: {
            topicHistory: sessionContext.topicHistory,
            contextSwitchCount: sessionContext.contextSwitchCount,
            lastTopicChange: sessionContext.lastTopicChange
          },
          customerJourney: sessionContext.customerJourney,
          collectedData: sessionContext.collectedData,
          ...additionalData
        }
      });
    } catch (error) {
      this.log(LogLevel.WARN, 'Failed to log enhanced chat interaction', { error });
    }
  }

  // === QUOTE FLOW (Placeholder) ===

  /**
   * Enhanced insurance quote flow with Swiss insurance expertise
   */
  private async handleQuoteFlow(
    message: string, 
    sessionContext: ChatContext
  ): Promise<{
    message: string;
    nextStep?: string;
    options?: ChatOption[];
    uiUpdates?: UIUpdate[];
  }> {
    const steps = this.CONVERSATION_FLOWS.quote;
    const currentStep = steps[sessionContext.stepInFlow];

    switch (currentStep) {
      case 'greeting':
        // Check if user already specified insurance type in their message
        const detectedInsurance = this.extractInsuranceType(message);
        if (detectedInsurance && detectedInsurance !== 'unknown') {
          (sessionContext.collectedData as any).insuranceType = detectedInsurance;
          sessionContext.stepInFlow = 2; // Skip to collect_basic_info
          return {
            message: `Ausgezeichnete Wahl! ${this.getInsuranceTypeDisplay(detectedInsurance)} ist sehr wichtig. Für eine präzise Offerte benötige ich einige Angaben von Ihnen. Wie ist Ihr Name?`,
            nextStep: 'collect_basic_info'
          };
        }
        
        sessionContext.stepInFlow++;
        return {
          message: 'Sehr gerne erstelle ich eine Versicherungsofferte für Sie! Als Experten für Schweizer Versicherungen bieten wir Ihnen die besten Tarife. Welche Art von Versicherung interessiert Sie?',
          nextStep: 'insurance_type',
          options: [
            { id: 'krankenversicherung', text: 'Krankenversicherung (Grund- & Zusatz)', action: 'select_insurance' },
            { id: 'unfallversicherung', text: 'Unfallversicherung (NBU)', action: 'select_insurance' },
            { id: 'haftpflichtversicherung', text: 'Haftpflichtversicherung', action: 'select_insurance' },
            { id: 'sachversicherung', text: 'Sachversicherung (Hausrat/Auto)', action: 'select_insurance' },
            { id: 'lebensversicherung', text: 'Lebens-/Risikoversicherung', action: 'select_insurance' }
          ]
        };

      case 'insurance_type':
        const insuranceType = this.extractInsuranceType(message);
        (sessionContext.collectedData as any).insuranceType = insuranceType;
        sessionContext.stepInFlow++;
        
        return {
          message: `Ausgezeichnete Wahl! ${this.getInsuranceTypeDisplay(insuranceType)} ist sehr wichtig. Für eine präzise Offerte benötige ich einige Angaben von Ihnen. Wie ist Ihr Name?`,
          nextStep: 'collect_basic_info'
        };

      case 'collect_basic_info':
        if (!sessionContext.collectedData.name) {
          sessionContext.collectedData.name = this.extractName(message);
          return {
            message: `Danke, ${sessionContext.collectedData.name}! Ihre E-Mail-Adresse für die Offerte?`,
            nextStep: 'collect_basic_info'
          };
        }
        
        if (!sessionContext.collectedData.email) {
          const email = this.extractEmail(message);
          if (!email) {
            return {
              message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
              nextStep: 'collect_basic_info'
            };
          }
          sessionContext.collectedData.email = email;
          return {
            message: 'Perfekt! Ihre Telefonnummer für Rückfragen?',
            nextStep: 'collect_basic_info'
          };
        }
        
        if (!sessionContext.collectedData.phone) {
          const phone = this.extractPhone(message);
          if (phone) {
            sessionContext.collectedData.phone = phone;
          }
        }
        
        sessionContext.stepInFlow++;
        return await this.generateInsuranceSpecificQuestions(sessionContext);

      case 'specific_questions':
        await this.collectInsuranceSpecificData(message, sessionContext);
        sessionContext.stepInFlow++;
        
        return {
          message: `Perfekt! Ich habe alle Angaben für Ihre ${this.getInsuranceTypeDisplay((sessionContext.collectedData as any).insuranceType)} erfasst.

📋 **Ihre Angaben:**
👤 **Name:** ${sessionContext.collectedData.name}
📧 **E-Mail:** ${sessionContext.collectedData.email}
📞 **Telefon:** ${sessionContext.collectedData.phone || 'Nicht angegeben'}
🏥 **Versicherung:** ${this.getInsuranceTypeDisplay((sessionContext.collectedData as any).insuranceType)}

Soll ich jetzt Ihre persönliche Offerte berechnen?`,
          nextStep: 'generate_quote',
          options: [
            { id: 'generate', text: 'Ja, Offerte berechnen', action: 'generate_quote' },
            { id: 'modify', text: 'Angaben ändern', action: 'modify_data' },
            { id: 'appointment', text: 'Lieber persönliche Beratung', action: 'start_appointment' }
          ]
        };

      case 'generate_quote':
        if (message.toLowerCase().includes('ja') || message.toLowerCase().includes('berechnen') || 
            message.toLowerCase().includes('erstell') || message.toLowerCase().includes('gener')) {
          
          try {
            const quoteData = await this.generateSwissInsuranceQuote(sessionContext);
            const quote = await this.supabase.createQuote(quoteData);
            
            // Store quote in session for potential modifications
            (sessionContext.collectedData as any).generatedQuote = quote;
            
            sessionContext.stepInFlow++;
            return {
              message: `🎉 Ihre Offerte wurde erfolgreich berechnet!

⏳ **Einen Moment bitte** - ich erstelle jetzt die finale Präsentation mit allen Details und CHF-Beträgen...`,
              nextStep: 'present_quote'
            };
          } catch (error) {
            this.log(LogLevel.ERROR, 'Failed to generate quote', { error });
            return {
              message: 'Es gab ein Problem bei der Offertenerstellung. Ein Versicherungsexperte wird sich persönlich bei Ihnen melden.',
              nextStep: 'error'
            };
          }
        } else {
          return {
            message: 'Kein Problem! Was möchten Sie ändern oder wie kann ich Ihnen weiterhelfen?',
            nextStep: 'specific_questions'
          };
        }

      case 'present_quote':
        // Present the generated quote and send emails
        const generatedQuote = (sessionContext.collectedData as any).generatedQuote;
        
        if (generatedQuote) {
          // Send confirmation emails now
          try {
            await Promise.all([
              this.emailService.sendQuoteConfirmation(generatedQuote),
              this.emailService.sendQuoteNotificationToStaff(generatedQuote)
            ]);
            this.log(LogLevel.INFO, 'Quote confirmation emails sent', { quoteId: generatedQuote.id });
          } catch (emailError) {
            this.log(LogLevel.WARN, 'Failed to send quote emails', { emailError, quoteId: generatedQuote.id });
          }
          
          sessionContext.stepInFlow++;
          return {
            message: this.formatQuotePresentation(generatedQuote),
            nextStep: 'complete',
            options: [
              { id: 'appointment', text: 'Beratungstermin vereinbaren', action: 'start_appointment' },
              { id: 'upload', text: 'Dokumente hochladen', action: 'start_upload' },
              { id: 'question', text: 'Fragen stellen', action: 'start_faq' }
            ]
          };
        } else {
          return {
            message: 'Es gab ein Problem mit der Offertenpräsentation. Ein Experte wird sich bei Ihnen melden.',
            nextStep: 'error'
          };
        }

      default:
        return {
          message: 'Ihre Offertenanfrage wird bearbeitet. Vielen Dank!',
          nextStep: 'complete'
        };
    }
  }
}