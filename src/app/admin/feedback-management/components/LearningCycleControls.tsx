import React, { useState } from 'react';

export interface LearningCycleControlsProps {
  selectedCount: number;
  isLoading: boolean;
  onStartLearningCycle: () => void;
}

/**
 * Komponente zur Steuerung von Lernzyklen, inklusive Start und Monitoring
 */
const LearningCycleControls: React.FC<LearningCycleControlsProps> = ({
  selectedCount,
  isLoading,
  onStartLearningCycle
}) => {
  const [notes, setNotes] = useState('');
  
  // Handler für das Starten eines Lernzyklus
  const handleStartCycle = () => {
    onStartLearningCycle();
    setNotes('');
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
        <h3 className="text-sm font-medium text-gray-900">Lernzyklus starten</h3>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {/* Informationen zum Lernzyklus */}
        <div className="space-y-5">
          <div>
            <div className="text-sm text-gray-500 mb-2">
              Ausgewählte Feedback-Einträge: <span className="font-medium text-gray-900">{selectedCount}</span>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-medium text-gray-900">Automatisches Lernen</h4>
                <p className="text-sm text-gray-500">
                  Der Lernzyklus analysiert ausgewähltes Feedback und verbessert die Klassifizierungsgenauigkeit.
                </p>
              </div>
            </div>
            
            {/* Bemerkungen-Eingabefeld */}
            <div className="mt-5">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notizen (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Fügen Sie Notizen zum Lernzyklus hinzu..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          {/* Hilfreiche Tipps */}
          <div className="bg-yellow-50 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h5 className="text-sm font-medium text-yellow-800">Tipps für bessere Ergebnisse</h5>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Wählen Sie mindestens 5-10 Feedback-Einträge für einen effektiven Lernzyklus</li>
                    <li>Kombinieren Sie verschiedene Dokumenttypen für vielfältige Verbesserungen</li>
                    <li>Prüfen Sie die Ergebnisse nach Abschluss des Lernzyklus</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Aktions-Buttons */}
        <div className="mt-5 sm:flex sm:items-center">
          <div className="sm:flex-grow">
            {selectedCount === 0 && (
              <p className="text-sm text-gray-500">
                Bitte wählen Sie Feedback-Einträge aus, um einen Lernzyklus zu starten.
              </p>
            )}
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-6">
            <button
              type="button"
              onClick={handleStartCycle}
              disabled={selectedCount === 0 || isLoading}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                selectedCount === 0 || isLoading
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Lernzyklus wird ausgeführt...
                </>
              ) : (
                'Lernzyklus starten'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningCycleControls; 