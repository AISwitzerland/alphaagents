import { ChatFlowType, FlowState, ChatContextState } from '../types/chat';
import { processIntent } from './intentService';

export class ChatFlowManager {
  private static instance: ChatFlowManager;
  private contextState: ChatContextState;
  private lastBotMessage: string | null = null;

  private constructor() {
    this.contextState = {
      activeFlow: {
        currentFlow: 'idle',
        step: 'idle',
        collectedData: {},
        timestamp: Date.now()
      },
      flowHistory: [],
      maxHistoryLength: 5
    };
  }

  static getInstance(): ChatFlowManager {
    if (!ChatFlowManager.instance) {
      ChatFlowManager.instance = new ChatFlowManager();
    }
    return ChatFlowManager.instance;
  }

  async handleMessage(message: string): Promise<{
    shouldSwitchContext: boolean;
    newFlow?: ChatFlowType;
    response?: string;
  }> {
    // Detect intent from message
    const detectedIntent = await processIntent(message);
    
    // Spezialfall: Wenn der Intent "confirmation" ist
    if (detectedIntent === 'confirmation') {
      const currentFlow = this.contextState.activeFlow.currentFlow;
      
      // Nur wenn wir explizit über Kostenoptimierung oder Zeitersparnis gesprochen haben
      // UND der letzte Bot-Vorschlag einen Termin enthielt, wechseln wir zum Termin-Flow
      if ((currentFlow === 'cost_saving' || currentFlow === 'time_saving') && 
          message.toLowerCase() === 'ja' && 
          this.lastMessageContainedAppointmentSuggestion()) {
        return {
          shouldSwitchContext: true,
          newFlow: 'appointment',
          response: 'Perfekt! Um einen Beratungstermin zu vereinbaren, füllen Sie bitte das folgende Formular aus.'
        };
      } else {
        // In allen anderen Fällen bleiben wir im aktuellen Kontext
        return {
          shouldSwitchContext: false,
          newFlow: currentFlow
        };
      }
    }
    
    // Map intent to flow type
    const newFlow = this.mapIntentToFlow(detectedIntent);
    
    // If it's an insurance query or general question, don't switch context
    if (detectedIntent === 'automation_info' || detectedIntent === 'general_question') {
      return { 
        shouldSwitchContext: false,
        newFlow: 'automation_info'
      };
    }

    // If no flow change needed, return
    if (!newFlow || newFlow === this.contextState.activeFlow.currentFlow) {
      return { shouldSwitchContext: false };
    }

    // Check if we should switch context
    const shouldSwitch = this.shouldSwitchContext(newFlow);
    if (!shouldSwitch) {
      return { shouldSwitchContext: false };
    }

    // Generate appropriate response for context switch
    const response = this.generateContextSwitchResponse(
      this.contextState.activeFlow.currentFlow,
      newFlow
    );

    return {
      shouldSwitchContext: true,
      newFlow,
      response
    };
  }

  private mapIntentToFlow(intent: string): ChatFlowType | null {
    const intentFlowMap: { [key: string]: ChatFlowType } = {
      'upload_document': 'document_upload',
      'claim': 'document_upload',
      'schedule_appointment': 'appointment',
      'automation_info': 'automation_info',
      'cost_saving': 'cost_saving',
      'time_saving': 'time_saving'
    };

    return intentFlowMap[intent] || null;
  }

  private shouldSwitchContext(newFlow: ChatFlowType): boolean {
    const currentFlow = this.contextState.activeFlow;
    
    // Always allow switching from idle
    if (currentFlow.currentFlow === 'idle') {
      return true;
    }

    // If we're in the middle of data collection, store the progress
    if (currentFlow.step !== 'idle') {
      this.saveCurrentState();
    }

    return true;
  }

  private generateContextSwitchResponse(
    currentFlow: ChatFlowType,
    newFlow: ChatFlowType
  ): string {
    const responses: { [key: string]: string } = {
      appointment: 'Ich sehe, Sie möchten einen Beratungstermin vereinbaren. Gerne wechseln wir dazu. Bitte füllen Sie das folgende Formular aus.',
      document_upload: 'Ich verstehe, Sie möchten einen Schaden melden. 😟 Ich kann Ihnen dabei helfen, den Prozess zu starten. Dafür benötige ich zunächst Ihren Namen, bitte.',
      automation_info: 'Sie interessieren sich für unsere Automatisierungslösungen. Gerne stelle ich Ihnen vor, wie wir Ihrem Unternehmen helfen können.',
      cost_saving: 'Sie möchten wissen, wie Sie durch Automatisierung Kosten sparen können. Lassen Sie mich Ihnen erklären, welche Möglichkeiten es gibt.',
      time_saving: 'Zeitersparnis durch Automatisierung ist ein wichtiger Vorteil. Ich erkläre Ihnen gerne, welche Prozesse wir optimieren können.'
    };

    return responses[newFlow] || 'Ich helfe Ihnen gerne mit Ihrem Anliegen.';
  }

  switchFlow(newFlow: ChatFlowType) {
    this.saveCurrentState();
    
    this.contextState.activeFlow = {
      currentFlow: newFlow,
      step: 'idle',
      collectedData: {},
      timestamp: Date.now()
    };
  }

  private saveCurrentState() {
    const currentState = { ...this.contextState.activeFlow };
    
    this.contextState.flowHistory.unshift(currentState);
    if (this.contextState.flowHistory.length > this.contextState.maxHistoryLength) {
      this.contextState.flowHistory.pop();
    }
  }

  getCurrentFlow(): FlowState {
    return this.contextState.activeFlow;
  }

  getPreviousFlow(): FlowState | undefined {
    return this.contextState.flowHistory[0];
  }

  updateCurrentFlowData(data: Partial<FlowState['collectedData']>) {
    this.contextState.activeFlow.collectedData = {
      ...this.contextState.activeFlow.collectedData,
      ...data
    };
  }

  updateCurrentFlowStep(step: FlowState['step']) {
    this.contextState.activeFlow.step = step;
  }

  canResumeFlow(flow: ChatFlowType): boolean {
    return this.contextState.flowHistory.some(state => state.currentFlow === flow);
  }

  resumePreviousFlow(): FlowState | null {
    if (this.contextState.flowHistory.length === 0) {
      return null;
    }

    const previousState = this.contextState.flowHistory.shift();
    if (!previousState) {
      return null;
    }

    this.contextState.activeFlow = previousState;
    return previousState;
  }

  // Hilfsmethode, um zu prüfen, ob die letzte Bot-Nachricht einen Terminvorschlag enthielt
  private lastMessageContainedAppointmentSuggestion(): boolean {
    // In einer echten Implementierung würden wir hier die letzten Bot-Nachrichten prüfen
    // und nach Schlüsselwörtern wie "Termin", "Beratung", "vereinbaren" suchen
    
    // Wir speichern die letzte Bot-Nachricht in einer Klassenvariable
    if (!this.lastBotMessage) {
      return false;
    }
    
    // Schlüsselwörter, die auf einen Terminvorschlag hindeuten
    const appointmentKeywords = [
      'termin',
      'beratung',
      'vereinbaren',
      'kalender',
      'besprechen',
      'beratungstermin',
      'einrichten',
      'soll ich',
      'möchten sie',
      'wollen sie',
      'können wir'
    ];
    
    // Prüfen, ob die letzte Bot-Nachricht eines der Schlüsselwörter enthält
    const lastMessageLower = this.lastBotMessage.toLowerCase();
    return appointmentKeywords.some(keyword => lastMessageLower.includes(keyword));
  }
  
  // Methode zum Speichern der letzten Bot-Nachricht
  public setLastBotMessage(message: string): void {
    this.lastBotMessage = message;
  }
} 