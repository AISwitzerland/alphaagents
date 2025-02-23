export type IntentCategory = 
  | 'INFORMATION'
  | 'PRICE'
  | 'CLAIM'
  | 'COVERAGE'
  | 'DOCUMENT'
  | 'COMPLAINT'
  | 'CHANGE'
  | 'CANCELLATION'
  | 'EMERGENCY'
  | 'TECHNICAL';

export interface IntentEntity {
  type: 'insurance_type' | 'document_type' | 'amount' | 'date';
  value: string;
  confidence: number;
}

export interface Intent {
  category: IntentCategory;
  confidence: number;
  entities: IntentEntity[];
  urgency: 'low' | 'medium' | 'high';
  subCategory?: string;
}

export interface IntentPattern {
  intent: string;
  patterns: string[];
}

export interface IntentResult {
  intent: string;
  confidence: number;
  entities?: IntentEntity[];
} 