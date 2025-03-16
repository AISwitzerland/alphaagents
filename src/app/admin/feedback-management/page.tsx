'use client';

import { useState } from 'react';
import { useSupabaseUser } from '../../../lib/supabase';
import { useRealtimeFeedback } from './hooks/useRealtimeFeedback';
import { LearningEngine } from '../../../services/LearningEngine';

// Komponenten importieren
import FeedbackStatsCard from './components/FeedbackStatsCard';
import PendingFeedbackList from './components/PendingFeedbackList';
import LearningCycleControls from './components/LearningCycleControls';
import LearningCycleHistory from './components/LearningCycleHistory';

// Lernmaschine initialisieren
const learningEngine = new LearningEngine();

export default function FeedbackManagementPage() {
  const { user } = useSupabaseUser();
  const {
    pendingFeedback,
    statistics,
    learningCycles,
    isLoading,
    error,
    refreshAll
  } = useRealtimeFeedback();

  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [learningCycleLoading, setLearningCycleLoading] = useState(false);
  const [viewingCycleDetails, setViewingCycleDetails] = useState<string | null>(null);

  // Feedback-Auswahl umschalten
  const toggleFeedbackSelection = (feedbackId: string) => {
    setSelectedFeedback(prev => 
      prev.includes(feedbackId)
        ? prev.filter(id => id !== feedbackId)
        : [...prev, feedbackId]
    );
  };

  // Lernzyklus starten
  const startLearningCycle = async () => {
    if (selectedFeedback.length === 0) {
      return;
    }

    setLearningCycleLoading(true);
    setSuccessMessage(null);

    try {
      // Ausgewähltes Feedback an die Lernmaschine übergeben
      const selectedFeedbackItems = pendingFeedback.filter(feedback => 
        selectedFeedback.includes(feedback.id)
      );
      
      const cycleResult = await learningEngine.startLearningCycle(selectedFeedbackItems);
      
      // Feedback zurücksetzen und Erfolgsnachricht anzeigen
      setSelectedFeedback([]);
      setSuccessMessage(`Lernzyklus erfolgreich gestartet! ${selectedFeedbackItems.length} Feedback-Elemente verarbeitet.`);
      
      // Daten aktualisieren
      refreshAll();
    } catch (err) {
      console.error('Fehler beim Starten des Lernzyklus:', err);
    } finally {
      setLearningCycleLoading(false);
    }
  };

  // Details eines Lernzyklus anzeigen
  const viewCycleDetails = (cycleId: string) => {
    setViewingCycleDetails(cycleId);
    // Hier könnte ein Modal geöffnet werden, das die Details anzeigt
  };

  // Anzeige bei Ladevorgang
  if (isLoading && !statistics && !pendingFeedback.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Anzeige bei nicht authentifiziertem Benutzer
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Nicht authentifiziert</h1>
          <p className="text-gray-600">
            Sie müssen angemeldet sein, um auf diesen Bereich zuzugreifen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Feedback-Management Dashboard</h1>
      
      {/* Erfolgsmeldung */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">{successMessage}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccessMessage(null)}
          >
            <span className="sr-only">Schließen</span>
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Fehlermeldung */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccessMessage(null)}
          >
            <span className="sr-only">Schließen</span>
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Statistik-Karten */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <FeedbackStatsCard statistics={statistics} />
        </div>
      )}
      
      {/* Hauptinhalt: Ausstehende Feedbacks und Lernzyklen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Ausstehende Rückmeldungen</h2>
          <PendingFeedbackList 
            feedbackItems={pendingFeedback} 
            selectedIds={selectedFeedback}
            onToggleSelection={toggleFeedbackSelection}
          />
        </div>
        
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Lernmaßnahmen</h2>
            <LearningCycleControls 
              selectedCount={selectedFeedback.length}
              onStartLearningCycle={startLearningCycle}
              isLoading={learningCycleLoading}
            />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Lernzyklen-Verlauf</h2>
            <LearningCycleHistory 
              cycles={learningCycles} 
              onViewDetails={viewCycleDetails} 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 