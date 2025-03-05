import React, { useState, useEffect } from 'react';
import { useDocumentStore } from '@/store/documentStore';

interface DocumentPreviewProps {
  documentId: string;
  onClose: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ documentId, onClose }) => {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { getDocumentById, getDocumentUrl } = useDocumentStore();
  const document = getDocumentById(documentId);
  
  useEffect(() => {
    const loadDocumentUrl = async () => {
      if (!document) {
        setError('Dokument nicht gefunden');
        setIsLoading(false);
        return;
      }
      
      if (!document.filePath) {
        setError('Dieses Dokument hat keinen Dateipfad');
        setIsLoading(false);
        return;
      }
      
      try {
        const url = await getDocumentUrl(documentId);
        setDocumentUrl(url);
      } catch (err) {
        setError('Fehler beim Laden der Dokumentvorschau');
        console.error('Fehler beim Laden der Dokumentvorschau:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDocumentUrl();
  }, [documentId, document, getDocumentUrl]);
  
  if (!document) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Fehler</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <p className="text-red-500">Dokument nicht gefunden</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {document.metadata?.originalName || document.id}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">
              <p>{error}</p>
              {!document.filePath && (
                <p className="mt-2 text-sm text-gray-500">
                  Dieses Dokument hat möglicherweise keinen gültigen Dateipfad in der Datenbank.
                </p>
              )}
            </div>
          ) : documentUrl ? (
            document.filePath?.endsWith('.pdf') ? (
              <iframe 
                src={`${documentUrl}#toolbar=0`} 
                className="w-full h-full min-h-[500px]" 
                title={document.metadata?.originalName || 'Dokumentvorschau'}
              />
            ) : (
              <img 
                src={documentUrl} 
                alt={document.metadata?.originalName || 'Dokumentvorschau'} 
                className="max-w-full max-h-[70vh] mx-auto" 
              />
            )
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>Vorschau nicht verfügbar</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {document.metadata?.size ? `${Math.round(document.metadata.size / 1024)} KB` : 'Unbekannte Größe'} | 
            {document.type} | 
            {document.status.status}
          </div>
          
          <a 
            href={documentUrl || '#'} 
            download={document.metadata?.originalName || 'dokument'} 
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 ${!documentUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={(e) => {
              if (!documentUrl) {
                e.preventDefault();
              }
            }}
          >
            Herunterladen
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview; 