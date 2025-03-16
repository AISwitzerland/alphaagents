'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { DocumentType, DocumentClassification, CreateFeedbackInput } from '../../types/feedback';

// Mockup einer service-Funktion - später mit tatsächlichem API-Aufruf ersetzen
const submitFeedback = async (feedback: CreateFeedbackInput): Promise<boolean> => {
  console.log('Feedback submitted:', feedback);
  // Hier würde der tatsächliche API-Aufruf zur Feedback-Speicherung erfolgen
  return true;
};

const fetchDocumentTypes = async (): Promise<DocumentType[]> => {
  // Hier würde der tatsächliche API-Aufruf zur Abfrage der Dokumenttypen erfolgen
  return [
    { id: '1', type_name: 'Rechnung', description: 'Rechnungsdokumente', active: true, created_at: '', updated_at: '' },
    { id: '2', type_name: 'Vertrag', description: 'Vertragsdokumente', active: true, created_at: '', updated_at: '' },
    { id: '3', type_name: 'Angebot', description: 'Angebotsdokumente', active: true, created_at: '', updated_at: '' },
    { id: '4', type_name: 'Mahnung', description: 'Mahnungsdokumente', active: true, created_at: '', updated_at: '' },
  ];
};

interface ClassificationFeedbackFormProps {
  classification: DocumentClassification;
  onFeedbackSubmitted?: () => void;
  onCancel?: () => void;
}

export default function ClassificationFeedbackForm({
  classification,
  onFeedbackSubmitted,
  onCancel
}: ClassificationFeedbackFormProps) {
  const user = useUser();
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const loadDocumentTypes = async () => {
      const types = await fetchDocumentTypes();
      setDocumentTypes(types);
    };
    
    loadDocumentTypes();
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError('Sie müssen angemeldet sein, um Feedback zu geben.');
      return;
    }

    // Wenn "Ja" ausgewählt wurde, geben wir auch positives Feedback
    if (isCorrect === true) {
      try {
        setIsSubmitting(true);
        await submitFeedback({
          classification_id: classification.id,
          user_id: user.id,
          original_classification: classification.final_classification,
          corrected_classification: classification.final_classification, // Gleich wie Original bei korrekter Klassifizierung
          user_confidence: 5, // Höchste Konfidenz für positive Bestätigung
          feedback_notes: 'Automatisch bestätigt'
        });
        setSubmitSuccess(true);
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted();
        }
      } catch (error) {
        setSubmitError('Fehler beim Speichern des Feedbacks.');
        console.error('Feedback submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Validierung für Korrekturen
    if (isCorrect === false && !selectedType) {
      setSubmitError('Bitte wählen Sie den korrekten Dokumenttyp aus.');
      return;
    }

    try {
      setIsSubmitting(true);
      await submitFeedback({
        classification_id: classification.id,
        user_id: user.id,
        original_classification: classification.final_classification,
        corrected_classification: selectedType,
        user_confidence: confidence,
        feedback_notes: notes || undefined
      });
      setSubmitSuccess(true);
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (error) {
      setSubmitError('Fehler beim Speichern des Feedbacks.');
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Die Komponente erneut anzeigen, wenn ein neues Feedback erfolgen soll
  const handleReset = () => {
    setIsCorrect(null);
    setSelectedType('');
    setConfidence(5);
    setNotes('');
    setSubmitSuccess(false);
    setSubmitError('');
  };

  if (submitSuccess) {
    return (
      <div className="bg-white shadow rounded-lg p-6 max-w-lg mx-auto">
        <div className="text-center my-4">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Vielen Dank für Ihr Feedback!</h3>
          <p className="mt-1 text-sm text-gray-500">
            Ihr Feedback hilft uns, die Klassifizierungsgenauigkeit zu verbessern.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Weiteres Feedback geben
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-lg mx-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Feedback zur Dokumentklassifizierung</h3>
      
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Aktuelles Dokument:</p>
        <p className="font-medium">{classification.document_name}</p>
        <div className="mt-2 flex items-center">
          <span className="text-sm text-gray-500 mr-2">Klassifiziert als:</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {classification.final_classification}
          </span>
        </div>
      </div>

      {submitError && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ist diese Klassifizierung korrekt?
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setIsCorrect(true)}
              className={`flex-1 py-2 px-4 border rounded-md focus:outline-none ${
                isCorrect === true
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              Ja
            </button>
            <button
              type="button"
              onClick={() => setIsCorrect(false)}
              className={`flex-1 py-2 px-4 border rounded-md focus:outline-none ${
                isCorrect === false
                  ? 'bg-red-50 border-red-500 text-red-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              Nein
            </button>
          </div>
        </div>

        {isCorrect === false && (
          <>
            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-2">
                Korrekter Dokumenttyp:
              </label>
              <select
                id="documentType"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Bitte auswählen</option>
                {documentTypes.map((type) => (
                  <option key={type.id} value={type.type_name}>
                    {type.type_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wie sicher sind Sie mit dieser Korrektur?
              </label>
              <div className="flex space-x-1 items-center">
                <span className="text-xs text-gray-500">Unsicher</span>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setConfidence(value as 1 | 2 | 3 | 4 | 5)}
                    className={`w-8 h-8 rounded-full focus:outline-none ${
                      confidence === value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {value}
                  </button>
                ))}
                <span className="text-xs text-gray-500">Sehr sicher</span>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Anmerkungen (optional):
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Zusätzliche Informationen zur Korrektur"
              />
            </div>
          </>
        )}

        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Abbrechen
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isCorrect === null || isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Wird gesendet...
              </>
            ) : (
              'Feedback senden'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 