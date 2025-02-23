import { ChatFlowType, FlowState, ChatContextState } from '../types/chat';
import { processIntent } from './intentService';

export class ChatFlowManager {
  private static instance: ChatFlowManager;
  private contextState: ChatContextState;

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
    
    // Map intent to flow type
    const newFlow = this.mapIntentToFlow(detectedIntent);
    
    // If it's an insurance query or general question, don't switch context
    if (detectedIntent === 'insurance_info' || detectedIntent === 'general_question') {
      return { 
        shouldSwitchContext: false,
        newFlow: 'insurance_query'
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
      'schedule_appointment': 'appointment',
      'insurance_info': 'insurance_query',
      'claim': 'claim',
      'contract_change': 'contract_change'
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
      appointment: 'Ich sehe, Sie möchten einen Termin vereinbaren. Gerne wechseln wir dazu. Bitte füllen Sie das folgende Formular aus.',
      document_upload: 'Sie möchten ein Dokument hochladen? Kein Problem, wir können das direkt machen. Darf ich nach Ihrem Namen fragen?',
      insurance_query: 'Natürlich beantworte ich Ihre Frage zur Versicherung. Wie kann ich Ihnen helfen?',
      claim: 'Sie möchten einen Schaden melden. Ich helfe Ihnen dabei. Können Sie mir den Schadenfall kurz beschreiben?',
      contract_change: 'Sie möchten Ihren Vertrag ändern. Ich unterstütze Sie dabei. Was möchten Sie ändern?'
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
} 