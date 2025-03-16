'use client';

import { useState } from 'react';
import { DocumentClassification } from '../../types/feedback';
import dynamic from 'next/dynamic';

// Dynamischer Import des Feedback-Formulars
const ClassificationFeedbackForm = dynamic(
  () => import('./ClassificationFeedbackForm'),
  { ssr: false, loading: () => <p>Formular wird geladen...</p> }
);

interface ClassificationFeedbackWidgetProps {
  classification: DocumentClassification;
  showInitially?: boolean;
}

export default function ClassificationFeedbackWidget({
  classification,
  showInitially = false
}: ClassificationFeedbackWidgetProps) {
  const [showFeedback, setShowFeedback] = useState(showInitially);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  if (feedbackGiven) {
    return null; // Widget ausblenden, nachdem Feedback gegeben wurde
  }

  return (
    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
      {!showFeedback ? (
        <div className="bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">
                Ist die Klassifizierung dieses Dokuments korrekt? Ihr Feedback hilft uns, die Genauigkeit zu verbessern.
              </p>
              <p className="mt-3 text-sm md:mt-0 md:ml-6">
                <button
                  onClick={() => setShowFeedback(true)}
                  className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                >
                  Feedback geben <span aria-hidden="true">&rarr;</span>
                </button>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <ClassificationFeedbackForm
          classification={classification}
          onFeedbackSubmitted={() => {
            setFeedbackGiven(true);
            // Optional: Nach einer Verzögerung das Widget komplett entfernen
            setTimeout(() => {
              setShowFeedback(false);
            }, 5000);
          }}
          onCancel={() => setShowFeedback(false)}
        />
      )}
    </div>
  );
} 