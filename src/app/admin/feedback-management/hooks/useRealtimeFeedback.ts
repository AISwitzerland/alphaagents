'use client';

import { useState, useEffect } from 'react';
import { FeedbackService } from '../../../../api/feedbackService';
import { RealtimeFeedbackService } from '../../../../api/realtimeFeedbackService';
import { 
  ClassificationFeedback, 
  FeedbackStatistics, 
  LearningCycle 
} from '../../../../types/feedback';

const feedbackService = new FeedbackService();
const realtimeService = new RealtimeFeedbackService();

/**
 * Hook für die Verwaltung von Echtzeit-Feedback-Updates im Dashboard
 */
export function useRealtimeFeedback() {
  const [pendingFeedback, setPendingFeedback] = useState<ClassificationFeedback[]>([]);
  const [statistics, setStatistics] = useState<FeedbackStatistics | null>(null);
  const [learningCycles, setLearningCycles] = useState<LearningCycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Daten beim ersten Laden abrufen
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Alle Daten parallel laden
        const [stats, pending, cycles] = await Promise.all([
          feedbackService.getFeedbackStatistics(),
          feedbackService.getPendingFeedback(100),
          // TODO: In einer echten Implementierung würden die Lernzyklen aus der Datenbank geladen
          Promise.resolve([]) as Promise<LearningCycle[]>
        ]);

        setStatistics(stats);
        setPendingFeedback(pending);
        setLearningCycles(cycles);
      } catch (err) {
        console.error('Fehler beim Laden der Feedback-Daten:', err);
        setError('Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Echtzeit-Subscriptions für Feedback und Lernzyklen
  useEffect(() => {
    // Neue Feedback-Einträge verarbeiten
    const unsubscribeFeedback = realtimeService.subscribeFeedbackUpdates((newFeedback) => {
      // Statistiken aktualisieren
      refreshStatistics();

      // Pending-Feedback aktualisieren
      // Wenn das Feedback als angewendet markiert wurde, aus der Liste entfernen
      if (newFeedback.applied_to_learning) {
        setPendingFeedback(prev => prev.filter(feedback => feedback.id !== newFeedback.id));
      } 
      // Sonst, wenn es sich um ein neues Feedback handelt, zur Liste hinzufügen (falls es noch nicht existiert)
      else {
        setPendingFeedback(prev => {
          const exists = prev.some(feedback => feedback.id === newFeedback.id);
          if (exists) return prev;
          return [newFeedback, ...prev];
        });
      }
    });

    // Neue Lernzyklen verarbeiten
    const unsubscribeLearningCycle = realtimeService.subscribeLearningCycleUpdates((newCycle) => {
      // Prüfen, ob der Zyklus bereits existiert
      setLearningCycles(prev => {
        const exists = prev.some(cycle => cycle.id === newCycle.id);
        
        // Falls ja, aktualisieren
        if (exists) {
          return prev.map(cycle => cycle.id === newCycle.id ? newCycle : cycle);
        }
        
        // Falls nein, neu hinzufügen
        return [newCycle, ...prev];
      });

      // Wenn der Lernzyklus abgeschlossen wurde, Statistiken und Pending-Feedback aktualisieren
      if (newCycle.status === 'completed') {
        refreshStatistics();
        refreshPendingFeedback();
      }
    });

    // Cleanup-Funktion, die alle Subscriptions beendet
    return () => {
      unsubscribeFeedback();
      unsubscribeLearningCycle();
    };
  }, []);

  // Hilfsfunktionen zum Aktualisieren der Daten
  const refreshStatistics = async () => {
    try {
      const stats = await feedbackService.getFeedbackStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Fehler beim Aktualisieren der Statistiken:', err);
    }
  };

  const refreshPendingFeedback = async () => {
    try {
      const pending = await feedbackService.getPendingFeedback(100);
      setPendingFeedback(pending);
    } catch (err) {
      console.error('Fehler beim Aktualisieren des ausstehenden Feedbacks:', err);
    }
  };

  const refreshLearningCycles = async () => {
    try {
      // TODO: In einer echten Implementierung würden die Lernzyklen aus der Datenbank geladen
      // Hier als Beispiel:
      // const cycles = await feedbackService.getLearningCycles();
      // setLearningCycles(cycles);
    } catch (err) {
      console.error('Fehler beim Aktualisieren der Lernzyklen:', err);
    }
  };

  // Manuelle Aktualisierung aller Daten
  const refreshAll = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        refreshStatistics(),
        refreshPendingFeedback(),
        refreshLearningCycles()
      ]);
    } catch (err) {
      console.error('Fehler beim Aktualisieren der Daten:', err);
      setError('Fehler beim Aktualisieren der Daten. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pendingFeedback,
    statistics,
    learningCycles,
    isLoading,
    error,
    refreshAll,
    refreshStatistics,
    refreshPendingFeedback,
    refreshLearningCycles
  };
} 