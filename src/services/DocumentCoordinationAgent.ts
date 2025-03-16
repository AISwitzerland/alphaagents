import { v4 as uuidv4 } from 'uuid';
import { 
  AgentType, 
  ProcessingStage, 
  DocumentProcessingState, 
  ProcessingHistoryEntry,
  ProcessingResult,
  ProcessingError,
  Priority,
  CoordinationConfig
} from '../types/coordination';
import { Document } from '../types/document';
import { BaseAgent, AgentOptions, AgentResult } from '../interfaces/BaseAgent';
import { getAgentRegistry } from './AgentRegistry';

// Standardkonfiguration
const DEFAULT_CONFIG: CoordinationConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  defaultPriority: 'normal',
  confidenceThresholds: {
    classified: 0.7,
    ocr_processed: 0.8,
    data_extracted: 0.75,
    validation_needed: 0.9,
    initial: 0,
    uploaded: 0,
    human_review: 0,
    completed: 0,
    error: 0
  },
  agentTimeouts: {
    document: 30000,
    classification: 15000,
    ocr: 60000,
    extraction: 30000,
    feedback: 10000
  }
};

/**
 * Koordinationsagent für die Dokumentenverarbeitung
 * Steuert den Fluss der Dokumente durch die verschiedenen Verarbeitungsstufen
 */
export class DocumentCoordinationAgent {
  private static instance: DocumentCoordinationAgent | null = null;
  private documentQueue: Map<string, DocumentProcessingState>;
  private pendingProcessing: Set<string>;
  private config: CoordinationConfig;
  private agentRegistry: Map<AgentType, BaseAgent>;
  
  private constructor(config: Partial<CoordinationConfig> = {}) {
    this.documentQueue = new Map();
    this.pendingProcessing = new Set();
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.agentRegistry = getAgentRegistry();
    
    // Starte regelmäßige Überprüfung steckengebliebener Dokumente
    setInterval(() => this.checkStuckDocuments(), 60000);
  }
  
  /**
   * Singleton-Instanz des Koordinationsagenten
   */
  public static getInstance(config?: Partial<CoordinationConfig>): DocumentCoordinationAgent {
    if (!DocumentCoordinationAgent.instance) {
      DocumentCoordinationAgent.instance = new DocumentCoordinationAgent(config);
    }
    return DocumentCoordinationAgent.instance;
  }
  
  /**
   * Startet die Verarbeitung eines neuen Dokuments
   */
  public async processDocument(document: Document, priority?: Priority): Promise<string> {
    const documentId = document.id || uuidv4();
    const docWithId = { ...document, id: documentId };
    
    // Initialisiere den Verarbeitungsstatus
    const processingState: DocumentProcessingState = {
      documentId,
      document: docWithId,
      currentStage: 'initial',
      history: [],
      startTime: Date.now(),
      lastUpdated: Date.now(),
      priority: priority || this.config.defaultPriority,
      retryCount: 0,
      metadata: {}
    };
    
    this.documentQueue.set(documentId, processingState);
    
    // Starte asynchrone Verarbeitung
    this.scheduleProcessing(documentId);
    
    return documentId;
  }
  
  /**
   * Geplante Verarbeitung eines Dokuments
   */
  private async scheduleProcessing(documentId: string): Promise<void> {
    if (this.pendingProcessing.has(documentId)) {
      return; // Vermeidet Doppelverarbeitung
    }
    
    this.pendingProcessing.add(documentId);
    
    try {
      await this.executeProcessingStep(documentId);
    } catch (error) {
      console.error(`Error processing document ${documentId}:`, error);
      
      const state = this.documentQueue.get(documentId);
      if (state) {
        const processingError: ProcessingError = {
          code: 'PROCESSING_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          retryable: true,
          details: error
        };
        
        this.updateDocumentState(
          documentId, 
          'error', 
          state.assignedAgent || 'document',
          { success: false, error: processingError }
        );
        
        // Versuche erneut, wenn noch Versuche übrig sind
        if (state.retryCount < this.config.maxRetries) {
          const updatedState = this.documentQueue.get(documentId);
          if (updatedState) {
            updatedState.retryCount += 1;
            this.documentQueue.set(documentId, updatedState);
            
            setTimeout(() => {
              this.pendingProcessing.delete(documentId);
              this.scheduleProcessing(documentId);
            }, this.config.retryDelay);
          }
        }
      }
    } finally {
      this.pendingProcessing.delete(documentId);
    }
  }
  
  /**
   * Führt einen einzelnen Verarbeitungsschritt aus
   */
  private async executeProcessingStep(documentId: string): Promise<void> {
    const state = this.documentQueue.get(documentId);
    if (!state) {
      throw new Error(`No processing state found for document ${documentId}`);
    }
    
    // Bestimme den nächsten Schritt und Agenten
    const nextStage = this.determineNextStage(state);
    const agent = this.determineAgent(nextStage, state.document);
    
    if (!agent) {
      throw new Error(`No agent found for stage ${nextStage}`);
    }
    
    // Aktualisiere Status vor der Verarbeitung
    state.currentStage = nextStage;
    state.assignedAgent = agent.type as AgentType;
    state.lastUpdated = Date.now();
    this.documentQueue.set(documentId, state);
    
    // Bereite Optionen für den Agenten vor
    const options: AgentOptions = {
      timeout: this.config.agentTimeouts[agent.type as AgentType],
      requiredConfidence: this.config.confidenceThresholds[nextStage],
      documentState: state
    };
    
    // Führe den Agenten aus
    const startTime = Date.now();
    const result = await agent.process(state.document, options);
    const endTime = Date.now();
    
    // Erstelle einen Historien-Eintrag
    const historyEntry: ProcessingHistoryEntry = {
      stage: nextStage,
      agent: agent.type as AgentType,
      startTime,
      endTime,
      success: result.success,
      result: result.data,
      error: result.error
    };
    
    // Aktualisiere den Status nach der Verarbeitung
    this.updateDocumentState(documentId, nextStage, agent.type as AgentType, result, historyEntry);
    
    // Entscheide über den nächsten Schritt
    if (result.success) {
      if (nextStage === 'completed') {
        // Dokument ist vollständig verarbeitet
        return;
      }
      
      // Prüfe, ob weitere Verarbeitung notwendig ist
      if (result.confidence !== undefined && 
          result.confidence < this.config.confidenceThresholds[nextStage]) {
        // Vertrauen zu niedrig, menschliche Überprüfung erforderlich
        this.updateDocumentState(documentId, 'human_review', 'feedback', { 
          success: true, 
          metadata: { message: `Confidence too low: ${result.confidence}` }
        });
        return;
      }
      
      // Plane den nächsten Verarbeitungsschritt
      setTimeout(() => {
        this.scheduleProcessing(documentId);
      }, 0);
    } else if (state.retryCount < this.config.maxRetries && result.error?.retryable) {
      // Wiederhole bei wiederholbaren Fehlern
      const updatedState = this.documentQueue.get(documentId);
      if (updatedState) {
        updatedState.retryCount += 1;
        this.documentQueue.set(documentId, updatedState);
        
        setTimeout(() => {
          this.scheduleProcessing(documentId);
        }, this.config.retryDelay);
      }
    }
  }
  
  /**
   * Aktualisiert den Status eines Dokuments
   */
  private updateDocumentState(
    documentId: string, 
    stage: ProcessingStage, 
    agentType: AgentType,
    result: AgentResult,
    historyEntry?: ProcessingHistoryEntry
  ): void {
    const state = this.documentQueue.get(documentId);
    if (!state) return;
    
    // Aktualisiere Dokument mit Ergebnissen des Agenten
    if (result.data) {
      state.document = { ...state.document, ...result.data };
    }
    
    // Aktualisiere Metadaten
    if (result.metadata) {
      state.metadata = { ...state.metadata, ...result.metadata };
    }
    
    // Füge Historieneintrag hinzu, wenn vorhanden
    if (historyEntry) {
      state.history.push(historyEntry);
    }
    
    // Aktualisiere Fehlerinformationen
    if (!result.success && result.error) {
      state.error = result.error;
    } else {
      state.error = undefined;
    }
    
    state.lastUpdated = Date.now();
    this.documentQueue.set(documentId, state);
  }
  
  /**
   * Bestimmt die nächste Verarbeitungsstufe
   */
  private determineNextStage(state: DocumentProcessingState): ProcessingStage {
    if (state.nextStage) {
      return state.nextStage;
    }
    
    // Standardablauf der Verarbeitung
    switch (state.currentStage) {
      case 'initial':
        return 'uploaded';
      case 'uploaded':
        return 'classified';
      case 'classified':
        return 'ocr_processed';
      case 'ocr_processed':
        return 'data_extracted';
      case 'data_extracted':
        return 'validation_needed';
      case 'validation_needed':
        return 'completed';
      case 'human_review':
        // Nach menschlicher Überprüfung wird der nächste Schritt manuell gesetzt
        return state.nextStage || 'validation_needed';
      case 'error':
        // Bei Fehler - neu beginnen oder zu einem bestimmten Schritt zurückkehren
        return state.nextStage || 'initial';
      case 'completed':
      default:
        return 'completed';
    }
  }
  
  /**
   * Bestimmt den passenden Agenten für eine Verarbeitungsstufe
   */
  private determineAgent(stage: ProcessingStage, document: Document): BaseAgent | null {
    // Standardzuordnung von Stufen zu Agenten
    const stageToAgentMap: Record<ProcessingStage, AgentType> = {
      initial: 'document',
      uploaded: 'document',
      classified: 'classification',
      ocr_processed: 'ocr',
      data_extracted: 'extraction',
      validation_needed: 'feedback',
      human_review: 'feedback',
      completed: 'document',
      error: 'document'
    };
    
    const defaultAgentType = stageToAgentMap[stage];
    const defaultAgent = this.agentRegistry.get(defaultAgentType);
    
    // Finde alle Agenten, die diese Stufe verarbeiten können
    const capableAgents = Array.from(this.agentRegistry.values())
      .filter(agent => agent.canHandle(stage, document));
    
    if (capableAgents.length === 0) {
      return defaultAgent || null;
    }
    
    // Hier könnte eine komplexere Auswahllogik implementiert werden
    // z.B. basierend auf Agentenverfügbarkeit, Spezialisierung, etc.
    return capableAgents[0];
  }
  
  /**
   * Überprüft auf steckengebliebene Dokumente
   */
  private checkStuckDocuments(): void {
    const now = Date.now();
    const stuckTimeout = 5 * 60 * 1000; // 5 Minuten
    
    // Verwende Array.from, um Map-Iteration kompatibel mit ES5 zu machen
    Array.from(this.documentQueue.entries()).forEach(([documentId, state]) => {
      // Überspringe abgeschlossene oder in Bearbeitung befindliche Dokumente
      if (state.currentStage === 'completed' || this.pendingProcessing.has(documentId)) {
        return;
      }
      
      // Prüfe auf steckengebliebene Dokumente
      if (now - state.lastUpdated > stuckTimeout) {
        console.warn(`Document ${documentId} stuck in stage ${state.currentStage}`);
        
        // Versuche die Verarbeitung wieder aufzunehmen
        if (state.retryCount < this.config.maxRetries) {
          state.retryCount += 1;
          this.documentQueue.set(documentId, state);
          this.scheduleProcessing(documentId);
        }
      }
    });
  }
  
  /**
   * Abfragen des Verarbeitungsstatus eines Dokuments
   */
  public getDocumentStatus(documentId: string): DocumentProcessingState | null {
    return this.documentQueue.get(documentId) || null;
  }
  
  /**
   * Abfragen aller Dokumente in Verarbeitung
   */
  public getActiveDocuments(): DocumentProcessingState[] {
    return Array.from(this.documentQueue.values())
      .filter(state => state.currentStage !== 'completed');
  }
  
  /**
   * Manuelles Setzen der nächsten Verarbeitungsstufe
   */
  public setNextStage(documentId: string, nextStage: ProcessingStage): boolean {
    const state = this.documentQueue.get(documentId);
    if (!state) return false;
    
    state.nextStage = nextStage;
    this.documentQueue.set(documentId, state);
    
    // Starte Verarbeitung, wenn nicht bereits in Bearbeitung
    if (!this.pendingProcessing.has(documentId)) {
      this.scheduleProcessing(documentId);
    }
    
    return true;
  }
  
  /**
   * Manuelles Erhöhen der Priorität
   */
  public increasePriority(documentId: string): boolean {
    const state = this.documentQueue.get(documentId);
    if (!state) return false;
    
    const priorityLevels: Priority[] = ['low', 'normal', 'high', 'urgent'];
    const currentIdx = priorityLevels.indexOf(state.priority);
    
    if (currentIdx < priorityLevels.length - 1) {
      state.priority = priorityLevels[currentIdx + 1];
      this.documentQueue.set(documentId, state);
      return true;
    }
    
    return false;
  }
  
  /**
   * Komplettes Zurücksetzen der Verarbeitung eines Dokuments
   */
  public resetProcessing(documentId: string): boolean {
    const state = this.documentQueue.get(documentId);
    if (!state) return false;
    
    const resetState: DocumentProcessingState = {
      ...state,
      currentStage: 'initial',
      nextStage: undefined,
      assignedAgent: undefined,
      retryCount: 0,
      error: undefined,
      lastUpdated: Date.now()
    };
    
    this.documentQueue.set(documentId, resetState);
    
    // Starte Verarbeitung neu
    this.scheduleProcessing(documentId);
    
    return true;
  }
}

export default DocumentCoordinationAgent; 