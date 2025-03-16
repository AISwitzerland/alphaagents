import { supabase } from '../lib/supabase';
import { ClassificationFeedback, LearningCycle } from '../types/feedback';

type FeedbackUpdateCallback = (feedback: ClassificationFeedback) => void;
type LearningCycleUpdateCallback = (cycle: LearningCycle) => void;

type Subscription = {
  unsubscribe: () => void;
};

/**
 * Service für Echtzeit-Updates im Feedback-System über Supabase Realtime
 */
export class RealtimeFeedbackService {
  private feedbackSubscription: Subscription | null = null;
  private learningCycleSubscription: Subscription | null = null;
  private feedbackCallbacks: FeedbackUpdateCallback[] = [];
  private learningCycleCallbacks: LearningCycleUpdateCallback[] = [];

  /**
   * Auf neue Feedback-Einträge lauschen
   */
  public subscribeFeedbackUpdates(callback: FeedbackUpdateCallback): () => void {
    // Callback zur Liste hinzufügen
    this.feedbackCallbacks.push(callback);

    // Supabase-Subscription starten, falls noch nicht aktiv
    if (!this.feedbackSubscription) {
      this.startFeedbackSubscription();
    }

    // Unsubscribe-Funktion zurückgeben
    return () => {
      this.feedbackCallbacks = this.feedbackCallbacks.filter(cb => cb !== callback);
      
      // Wenn keine Callbacks mehr vorhanden sind, Subscription beenden
      if (this.feedbackCallbacks.length === 0 && this.feedbackSubscription) {
        this.feedbackSubscription.unsubscribe();
        this.feedbackSubscription = null;
      }
    };
  }

  /**
   * Auf neue Lernzyklen lauschen
   */
  public subscribeLearningCycleUpdates(callback: LearningCycleUpdateCallback): () => void {
    // Callback zur Liste hinzufügen
    this.learningCycleCallbacks.push(callback);

    // Supabase-Subscription starten, falls noch nicht aktiv
    if (!this.learningCycleSubscription) {
      this.startLearningCycleSubscription();
    }

    // Unsubscribe-Funktion zurückgeben
    return () => {
      this.learningCycleCallbacks = this.learningCycleCallbacks.filter(cb => cb !== callback);
      
      // Wenn keine Callbacks mehr vorhanden sind, Subscription beenden
      if (this.learningCycleCallbacks.length === 0 && this.learningCycleSubscription) {
        this.learningCycleSubscription.unsubscribe();
        this.learningCycleSubscription = null;
      }
    };
  }

  /**
   * Supabase-Subscription für Feedback-Updates starten
   */
  private startFeedbackSubscription() {
    this.feedbackSubscription = supabase
      .channel('classification_feedback_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'classification_feedback'
        },
        (payload) => {
          const newFeedback = payload.new as ClassificationFeedback;
          // Alle Callbacks mit dem neuen Feedback aufrufen
          this.feedbackCallbacks.forEach(callback => callback(newFeedback));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'classification_feedback'
        },
        (payload) => {
          const updatedFeedback = payload.new as ClassificationFeedback;
          // Prüfen, ob das Feedback als angewendet markiert wurde
          if (updatedFeedback.applied_to_learning) {
            // Alle Callbacks mit dem aktualisierten Feedback aufrufen
            this.feedbackCallbacks.forEach(callback => callback(updatedFeedback));
          }
        }
      )
      .subscribe();
  }

  /**
   * Supabase-Subscription für Lernzyklus-Updates starten
   */
  private startLearningCycleSubscription() {
    this.learningCycleSubscription = supabase
      .channel('learning_cycle_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'learning_cycles'
        },
        (payload) => {
          const newCycle = payload.new as LearningCycle;
          // Alle Callbacks mit dem neuen Lernzyklus aufrufen
          this.learningCycleCallbacks.forEach(callback => callback(newCycle));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'learning_cycles'
        },
        (payload) => {
          const updatedCycle = payload.new as LearningCycle;
          // Alle Callbacks mit dem aktualisierten Lernzyklus aufrufen
          this.learningCycleCallbacks.forEach(callback => callback(updatedCycle));
        }
      )
      .subscribe();
  }

  /**
   * Alle Subscriptions beenden
   */
  public unsubscribeAll() {
    if (this.feedbackSubscription) {
      this.feedbackSubscription.unsubscribe();
      this.feedbackSubscription = null;
    }
    
    if (this.learningCycleSubscription) {
      this.learningCycleSubscription.unsubscribe();
      this.learningCycleSubscription = null;
    }
    
    this.feedbackCallbacks = [];
    this.learningCycleCallbacks = [];
  }
} 