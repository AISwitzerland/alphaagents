import React from 'react';
import { ClassificationFeedback } from '../../../../types/feedback';

export interface PendingFeedbackListProps {
  feedbackItems: ClassificationFeedback[];
  selectedIds: string[];
  onToggleSelection: (feedbackId: string) => void;
}

/**
 * Komponente zur Darstellung von ausstehenden Feedback-Einträgen mit Auswahlmöglichkeit
 */
const PendingFeedbackList: React.FC<PendingFeedbackListProps> = ({
  feedbackItems,
  selectedIds,
  onToggleSelection
}) => {
  // Formatiere das Datum für bessere Lesbarkeit
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Berechne die Farbe basierend auf dem Konfidenzwert
  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {feedbackItems.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Keine ausstehenden Rückmeldungen</h3>
          <p className="mt-1 text-sm text-gray-500">
            Es gibt derzeit keine ausstehenden Feedback-Einträge.
          </p>
        </div>
      ) : (
        <>
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900">
                  {feedbackItems.length} Rückmeldung{feedbackItems.length !== 1 ? 'en' : ''} verfügbar
                </h3>
              </div>
              <div className="flex-shrink-0">
                <span className="text-sm text-gray-500">
                  {selectedIds.length} von {feedbackItems.length} ausgewählt
                </span>
              </div>
            </div>
          </div>

          <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {feedbackItems.map((feedback) => (
              <li key={feedback.id} className={`hover:bg-gray-50 ${selectedIds.includes(feedback.id) ? 'bg-blue-50' : ''}`}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedIds.includes(feedback.id)}
                        onChange={() => onToggleSelection(feedback.id)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <div className="text-sm font-medium text-blue-600 truncate">
                          {feedback.document_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(feedback.created_at)}
                        </div>
                      </div>
                      
                      <div className="sm:flex sm:justify-between">
                        <div>
                          <div className="flex items-center text-sm">
                            <span className="text-gray-600">Erkannt als:</span>
                            <span className="ml-1 font-medium text-gray-900">{feedback.detected_document_type}</span>
                          </div>
                          
                          {feedback.suggested_document_type && (
                            <div className="flex items-center text-sm mt-1">
                              <span className="text-gray-600">Vorgeschlagen:</span>
                              <span className="ml-1 font-medium text-green-600">{feedback.suggested_document_type}</span>
                            </div>
                          )}
                          
                          {feedback.feedback_note && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Notiz:</span> {feedback.feedback_note}
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2 sm:mt-0 sm:ml-4">
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500">Konfidenz:</span>
                            <span className={`ml-1 text-sm font-medium ${getConfidenceColor(feedback.confidence_score)}`}>
                              {feedback.confidence_score.toFixed(1)}%
                            </span>
                          </div>
                          
                          <div className="mt-1 text-xs">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              feedback.feedback_type === 'wrong_classification' 
                                ? 'bg-red-100 text-red-800'
                                : feedback.feedback_type === 'correct_classification'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {feedback.feedback_type === 'wrong_classification' 
                                ? 'Falsche Klassifizierung'
                                : feedback.feedback_type === 'correct_classification'
                                ? 'Korrekte Klassifizierung'
                                : 'Niedrige Konfidenz'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {feedback.document_keywords && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {feedback.document_keywords.split(',').map((keyword, idx) => (
                              <span 
                                key={idx} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {keyword.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default PendingFeedbackList; 