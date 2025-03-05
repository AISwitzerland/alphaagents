export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  intent?: string;
  language?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface UserContactData {
  name?: string;
  email?: string;
  phone?: string;
}

export interface DataCollectionState {
  step: DataCollectionStep;
  data: UserContactData;
  confirmed: boolean;
  retries: number;
}

export type ChatFlowType = 
  | 'idle'
  | 'document_upload'
  | 'appointment'
  | 'automation_info'
  | 'cost_saving'
  | 'time_saving';

export type DataCollectionStep = 
  | 'idle'
  | 'collecting_name'
  | 'collecting_email'
  | 'collecting_phone'
  | 'confirming_data'
  | 'ready_for_upload';

export type AppointmentStep = 
  | 'form'
  | 'calendar'
  | 'confirmation';

export interface FlowState {
  currentFlow: ChatFlowType;
  previousFlow?: ChatFlowType;
  step: DataCollectionStep | AppointmentStep | 'idle';
  collectedData: {
    name?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
  };
  timestamp: number;
}

export interface ChatContextState {
  activeFlow: FlowState;
  flowHistory: FlowState[];
  maxHistoryLength: number;
} 