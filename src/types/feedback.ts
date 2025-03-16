/**
 * Typdefinitionen für das Dokumentklassifizierungs-Feedback-System
 */

// Repräsentiert ein Klassifizierungsergebnis
export interface DocumentClassification {
  id: string;
  document_id: string;
  document_name: string;
  filename_classification: string | null;
  filename_confidence: number | null;
  ai_classification: string | null;
  ai_confidence: number | null;
  final_classification: string;
  processing_time_ms: number | null;
  classification_timestamp: string;
  metadata: Record<string, any>;
}

/**
 * Repräsentiert ein Klassifizierungsfeedback von einem Benutzer
 */
export interface ClassificationFeedback {
  id: string;
  user_id: string;
  document_id: string;
  document_name: string;
  detected_document_type: string;
  suggested_document_type: string | null;
  feedback_type: 'wrong_classification' | 'correct_classification' | 'low_confidence';
  feedback_note: string | null;
  confidence_score: number;
  document_keywords?: string;
  created_at: string;
  applied_to_learning: boolean;
  learning_cycle_id?: string;
}

/**
 * Statistiken über das gesammelte Feedback
 */
export interface FeedbackStatistics {
  total_feedback_count: number;
  pending_feedback_count: number;
  applied_feedback_count: number;
  average_confidence_score: number;
  feedback_by_document_type: Record<string, number>;
  feedback_by_type: {
    wrong_classification: number;
    correct_classification: number;
    low_confidence: number;
  };
  recent_trends: {
    date: string;
    count: number;
  }[];
}

/**
 * Änderungszusammenfassung eines Lernzyklus
 */
export interface ChangesSummary {
  keywords_added: number;
  keywords_removed: number;
  keywords_adjusted: number;
  affected_document_types: string[];
}

/**
 * Repräsentiert einen Lernzyklus
 */
export interface LearningCycle {
  id: string;
  cycle_timestamp: string;
  applied_feedback_count: number;
  cycle_notes: string | null;
  changes_summary: ChangesSummary;
  performed_by_user_id: string;
  status: 'in_progress' | 'completed' | 'applied' | 'failed';
}

// Repräsentiert eine Änderung an Schlüsselwörtern für die Klassifizierung
export interface KeywordUpdate {
  id: string;
  learning_cycle_id: string;
  document_type: string;
  keyword: string;
  action: 'added' | 'removed' | 'weight_adjusted';
  previous_weight: number | null;
  new_weight: number | null;
  update_timestamp: string;
}

// Repräsentiert einen Dokumenttyp im System
export interface DocumentType {
  id: string;
  type_name: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Für die Erstellung eines neuen Feedback-Eintrags
export interface CreateFeedbackInput {
  classification_id: string;
  user_id: string;
  original_classification: string;
  corrected_classification: string;
  user_confidence: 1 | 2 | 3 | 4 | 5;
  feedback_notes?: string;
} 