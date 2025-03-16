import { createClient } from '@supabase/supabase-js';
import { 
  ClassificationFeedback, 
  CreateFeedbackInput, 
  DocumentClassification,
  DocumentType,
  FeedbackStatistics,
  LearningCycle 
} from '../types/feedback';
import { supabase } from '../lib/supabase';

// Supabase-Client initialisieren (Konfiguration sollte aus einer Umgebungsvariable kommen)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

/**
 * Service für die Verwaltung des Dokument-Klassifizierungs-Feedbacks
 */
export class FeedbackService {
  /**
   * Speichert ein Klassifizierungsergebnis in der Datenbank
   */
  async logClassificationResult(
    documentId: string,
    documentName: string,
    filenameClassification: string | null,
    filenameConfidence: number | null,
    aiClassification: string | null,
    aiConfidence: number | null,
    finalClassification: string,
    processingTimeMs: number | null,
    metadata: Record<string, any> = {}
  ): Promise<DocumentClassification | null> {
    const { data, error } = await supabaseClient
      .from('document_classifications')
      .insert({
        document_id: documentId,
        document_name: documentName,
        filename_classification: filenameClassification,
        filename_confidence: filenameConfidence,
        ai_classification: aiClassification,
        ai_confidence: aiConfidence,
        final_classification: finalClassification,
        processing_time_ms: processingTimeMs,
        metadata
      })
      .select()
      .single();

    if (error) {
      console.error('Fehler beim Speichern des Klassifizierungsergebnisses:', error);
      return null;
    }

    return data as DocumentClassification;
  }

  /**
   * Speichert Benutzer-Feedback zu einer Klassifizierung
   */
  async createFeedback(input: CreateFeedbackInput): Promise<ClassificationFeedback | null> {
    const { data, error } = await supabaseClient
      .from('classification_feedback')
      .insert({
        classification_id: input.classification_id,
        user_id: input.user_id,
        original_classification: input.original_classification,
        corrected_classification: input.corrected_classification,
        user_confidence: input.user_confidence,
        feedback_notes: input.feedback_notes || null
      })
      .select()
      .single();

    if (error) {
      console.error('Fehler beim Speichern des Feedbacks:', error);
      return null;
    }

    return data as ClassificationFeedback;
  }

  /**
   * Ruft alle verfügbaren Dokumenttypen ab
   */
  async getDocumentTypes(): Promise<DocumentType[]> {
    const { data, error } = await supabaseClient
      .from('document_types')
      .select('*')
      .eq('active', true)
      .order('type_name');

    if (error) {
      console.error('Fehler beim Abrufen der Dokumenttypen:', error);
      return [];
    }

    return data as DocumentType[];
  }

  /**
   * Ruft ein bestimmtes Klassifizierungsergebnis ab
   */
  async getClassificationById(classificationId: string): Promise<DocumentClassification | null> {
    const { data, error } = await supabaseClient
      .from('document_classifications')
      .select('*')
      .eq('id', classificationId)
      .single();

    if (error) {
      console.error('Fehler beim Abrufen der Klassifizierung:', error);
      return null;
    }

    return data as DocumentClassification;
  }

  /**
   * Holt ausstehende Feedback-Einträge, die noch nicht in einem Lernzyklus angewendet wurden
   * @param limit Maximale Anzahl der abzurufenden Einträge
   * @returns Array von ausstehenden Feedback-Einträgen
   */
  async getPendingFeedback(limit: number = 50): Promise<ClassificationFeedback[]> {
    try {
      const { data, error } = await supabase
        .from('classification_feedback')
        .select('*')
        .eq('applied_to_learning', false)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        throw new Error(`Fehler beim Abrufen des ausstehenden Feedbacks: ${error.message}`);
      }
      
      return data || [];
    } catch (error) {
      console.error('Fehler beim Abrufen des ausstehenden Feedbacks:', error);
      throw error;
    }
  }
  
  /**
   * Holt Statistiken über das gesammelte Feedback
   * @returns Feedback-Statistiken
   */
  async getFeedbackStatistics(): Promise<FeedbackStatistics> {
    try {
      // In einer realen Implementierung würden diese Daten aus der Datenbank abgerufen
      // Hier wird ein Objekt mit Beispielwerten zurückgegeben
      
      // 1. Gesamtzahl des Feedbacks
      const totalCountQuery = await supabase
        .from('classification_feedback')
        .select('*', { count: 'exact', head: true });
      
      const totalCount = totalCountQuery.count;
      
      if (totalCountQuery.error) {
        throw new Error(`Fehler beim Zählen des Feedbacks: ${totalCountQuery.error.message}`);
      }
      
      // 2. Anzahl des ausstehenden Feedbacks
      const pendingCountQuery = await supabase
        .from('classification_feedback')
        .select('*', { count: 'exact', head: true })
        .eq('applied_to_learning', false);
      
      const pendingCount = pendingCountQuery.count;
      
      if (pendingCountQuery.error) {
        throw new Error(`Fehler beim Zählen des ausstehenden Feedbacks: ${pendingCountQuery.error.message}`);
      }
      
      // 3. Anzahl des angewendeten Feedbacks
      const appliedCountQuery = await supabase
        .from('classification_feedback')
        .select('*', { count: 'exact', head: true })
        .eq('applied_to_learning', true);
      
      const appliedCount = appliedCountQuery.count;
      
      if (appliedCountQuery.error) {
        throw new Error(`Fehler beim Zählen des angewendeten Feedbacks: ${appliedCountQuery.error.message}`);
      }
      
      // Feedback nach Dokumenttyp gruppieren
      const { data: byTypeData, error: byTypeError } = await supabase
        .rpc('get_feedback_by_document_type');
      
      const feedbackByDocumentType: Record<string, number> = {};
      if (byTypeData) {
        byTypeData.forEach((item: any) => {
          feedbackByDocumentType[item.document_type || item.detected_document_type] = item.count;
        });
      }
      
      // Feedback nach Feedback-Typ gruppieren
      const { data: byFeedbackTypeData, error: byFeedbackTypeError } = await supabase
        .rpc('get_feedback_by_type');
      
      const feedbackByType = {
        wrong_classification: 0,
        correct_classification: 0,
        low_confidence: 0
      };
      
      if (byFeedbackTypeData) {
        byFeedbackTypeData.forEach((item: any) => {
          if (item.feedback_type in feedbackByType) {
            feedbackByType[item.feedback_type as keyof typeof feedbackByType] = item.count;
          }
        });
      }
      
      // Durchschnittliche Konfidenz berechnen
      const { data: avgConfidenceData, error: avgConfidenceError } = await supabase
        .rpc('get_average_confidence_score');
      
      let averageConfidenceScore = 0;
      if (avgConfidenceData && avgConfidenceData[0]) {
        averageConfidenceScore = avgConfidenceData[0].average_score || 0;
      }
      
      // Feedback-Trends der letzten 7 Tage
      const recentTrends = [];
      const now = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const countQuery = await supabase
          .from('classification_feedback')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', `${dateStr}T00:00:00`)
          .lt('created_at', `${dateStr}T23:59:59`);
        
        if (countQuery.error) {
          console.error(`Fehler beim Zählen des Feedbacks für ${dateStr}:`, countQuery.error);
        }
        
        recentTrends.push({
          date: dateStr,
          count: countQuery.count || 0
        });
      }
      
      return {
        total_feedback_count: totalCount || 0,
        pending_feedback_count: pendingCount || 0,
        applied_feedback_count: appliedCount || 0,
        average_confidence_score: averageConfidenceScore,
        feedback_by_document_type: feedbackByDocumentType,
        feedback_by_type: feedbackByType,
        recent_trends: recentTrends
      };
    } catch (error) {
      console.error('Fehler beim Abrufen der Feedback-Statistiken:', error);
      // Fallback zu einem leeren Statistik-Objekt im Fehlerfall
      return {
        total_feedback_count: 0,
        pending_feedback_count: 0,
        applied_feedback_count: 0,
        average_confidence_score: 0,
        feedback_by_document_type: {},
        feedback_by_type: {
          wrong_classification: 0,
          correct_classification: 0,
          low_confidence: 0
        },
        recent_trends: []
      };
    }
  }

  /**
   * Speichert ein neues Feedback zur Dokumentklassifizierung
   * @param feedback Das zu speichernde Feedback
   * @returns Die ID des gespeicherten Feedbacks
   */
  async submitFeedback(feedback: Omit<ClassificationFeedback, 'id' | 'created_at' | 'applied_to_learning'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('classification_feedback')
        .insert({
          ...feedback,
          applied_to_learning: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(`Fehler beim Speichern des Feedbacks: ${error.message}`);
      }
      
      return data.id;
    } catch (error) {
      console.error('Fehler beim Speichern des Feedbacks:', error);
      throw error;
    }
  }

  /**
   * Startet einen neuen Lernzyklus, der Feedback anwendet
   */
  async startLearningCycle(userId: string, notes?: string): Promise<LearningCycle | null> {
    // Transaction beginnen
    const { data, error } = await supabaseClient
      .from('learning_cycles')
      .insert({
        performed_by_user_id: userId,
        cycle_notes: notes,
        applied_feedback_count: 0,
        changes_summary: {
          keywords_added: 0,
          keywords_removed: 0,
          keywords_adjusted: 0,
          affected_document_types: []
        },
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Fehler beim Starten des Lernzyklus:', error);
      return null;
    }

    return data as LearningCycle;
  }

  /**
   * Markiert Feedback als angewendet auf das Lernsystem
   */
  async markFeedbackAsApplied(
    feedbackIds: string[],
    learningCycleId: string
  ): Promise<boolean> {
    const { error } = await supabaseClient
      .from('classification_feedback')
      .update({
        applied_to_learning: true,
        applied_timestamp: new Date().toISOString()
      })
      .in('id', feedbackIds);

    if (error) {
      console.error('Fehler beim Markieren des Feedbacks als angewendet:', error);
      return false;
    }

    return true;
  }

  /**
   * Aktualisiert den Status eines Lernzyklus
   */
  async updateLearningCycleStatus(
    cycleId: string,
    status: 'in_progress' | 'completed' | 'failed',
    appliedCount: number,
    changesSummary: LearningCycle['changes_summary']
  ): Promise<boolean> {
    const { error } = await supabaseClient
      .from('learning_cycles')
      .update({
        status,
        applied_feedback_count: appliedCount,
        changes_summary: changesSummary
      })
      .eq('id', cycleId);

    if (error) {
      console.error('Fehler beim Aktualisieren des Lernzyklus-Status:', error);
      return false;
    }

    return true;
  }

  /**
   * Speichert ein Keyword-Update für die dateinamenbasierte Klassifizierung
   */
  async logKeywordUpdate(
    learningCycleId: string,
    documentType: string,
    keyword: string,
    action: 'added' | 'removed' | 'weight_adjusted',
    previousWeight: number | null,
    newWeight: number | null
  ): Promise<boolean> {
    const { error } = await supabaseClient
      .from('keyword_updates')
      .insert({
        learning_cycle_id: learningCycleId,
        document_type: documentType,
        keyword,
        action,
        previous_weight: previousWeight,
        new_weight: newWeight
      });

    if (error) {
      console.error('Fehler beim Speichern des Keyword-Updates:', error);
      return false;
    }

    return true;
  }
} 