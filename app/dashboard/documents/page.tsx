'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, DocumentType } from '@/types/document';
import { DocumentDetails } from '@/components/documents/DocumentDetails';
import { DatabaseService } from '@/services/databaseService';
import { Tables } from '@/types/database';

// Beispieldaten für die Entwicklung
const documents: Document[] = [
  {
    id: '1',
    type: 'accident_report',
    status: {
      status: 'abgeschlossen',
      progress: 100,
      message: 'Erfolgreich verarbeitet'
    },
    metadata: {
      originalName: 'Schadenmeldung_Auto_2024.pdf',
      size: 2.4 * 1024 * 1024, // 2.4 MB in Bytes
      mimeType: 'application/pdf',
      uploadedBy: {
        name: 'Max Mustermann',
        email: 'max.mustermann@example.com'
      },
      uploadedAt: '2024-02-20T10:30:00Z',
      source: 'email'
    },
    filePath: '/documents/1/Schadenmeldung_Auto_2024.pdf',
    createdAt: '2024-02-20T10:30:00Z',
    updatedAt: '2024-02-20T10:35:00Z'
  },
  {
    id: '2',
    type: 'invoice',
    status: {
      status: 'in_bearbeitung',
      progress: 50,
      message: 'Wird verarbeitet'
    },
    metadata: {
      originalName: 'Rechnung_Reparatur_XY.pdf',
      size: 1.8 * 1024 * 1024, // 1.8 MB in Bytes
      mimeType: 'application/pdf',
      uploadedBy: {
        name: 'Anna Schmidt',
        email: 'anna.schmidt@example.com'
      },
      uploadedAt: '2024-02-20T09:15:00Z',
      source: 'chat'
    },
    filePath: '/documents/2/Rechnung_Reparatur_XY.pdf',
    createdAt: '2024-02-20T09:15:00Z',
    updatedAt: '2024-02-20T09:20:00Z'
  },
  {
    id: '3',
    type: 'contract_change',
    status: {
      status: 'eingereicht',
      progress: 0,
      message: 'Warten auf Verarbeitung'
    },
    metadata: {
      originalName: 'Vertragsänderung_2024.pdf',
      size: 892 * 1024, // 892 KB in Bytes
      mimeType: 'application/pdf',
      uploadedBy: {
        name: 'Lisa Weber',
        email: 'lisa.weber@example.com'
      },
      uploadedAt: '2024-02-19T16:45:00Z',
      source: 'email'
    },
    filePath: '/documents/3/Vertragsänderung_2024.pdf',
    createdAt: '2024-02-19T16:45:00Z',
    updatedAt: '2024-02-19T16:45:00Z'
  },
];

const documentTypes: { [key in DocumentType]: string } = {
  'invoice': 'Rechnung',
  'contract_change': 'Vertragsänderung',
  'accident_report': 'Unfallmeldung',
  'damage_report': 'Schadenmeldung',
  'misc': 'Sonstiges',
};

const statusColors = {
  eingereicht: 'bg-yellow-100 text-yellow-800',
  in_bearbeitung: 'bg-blue-100 text-blue-800',
  abgeschlossen: 'bg-green-100 text-green-800',
  archiviert: 'bg-gray-100 text-gray-800',
  storniert: 'bg-red-100 text-red-800',
};

const statusLabels = {
  eingereicht: 'Eingereicht',
  in_bearbeitung: 'In Bearbeitung',
  abgeschlossen: 'Abgeschlossen',
  archiviert: 'Archiviert',
  storniert: 'Storniert',
};

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Tables['documents']['Row'][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const db = DatabaseService.getInstance();

  // Lade Dokumente beim ersten Render und wenn sich Filter ändern
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let docs;
        if (searchTerm) {
          docs = await db.searchDocuments(searchTerm);
        } else {
          docs = await db.listDocuments({
            type: selectedType !== 'all' ? selectedType as DocumentType : undefined,
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
          });
        }

        setDocuments(docs);
      } catch (err) {
        console.error('Fehler beim Laden der Dokumente:', err);
        setError('Die Dokumente konnten nicht geladen werden. Bitte versuchen Sie es später erneut.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [searchTerm, selectedType, selectedStatus]);

  // Lade Dokumentdetails mit allen Relationen
  const handleDocumentClick = async (doc: Tables['documents']['Row']) => {
    try {
      const detailedDoc = await db.getDocumentWithRelations(doc.id);
      setSelectedDocument(detailedDoc as unknown as Document);
    } catch (err) {
      console.error('Fehler beim Laden der Dokumentdetails:', err);
      // Zeige trotzdem das Dokument ohne Relationen
      setSelectedDocument(doc as unknown as Document);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dokumente</h1>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dokument hochladen
            </button>
          </div>
        </div>

        {/* Filter und Suche */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Suchfeld */}
            <div className="relative">
              <input
                type="text"
                placeholder="Dokumente durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Typ Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">Alle Typen</option>
              {Object.entries(documentTypes).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">Alle Status</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dokumentenliste */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="min-w-full divide-y divide-gray-200">
            {/* Tabellenkopf */}
            <div className="bg-gray-50">
              <div className="grid grid-cols-6 gap-4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-2">Name</div>
                <div>Typ</div>
                <div>Status</div>
                <div>Hochgeladen von</div>
                <div>Datum</div>
              </div>
            </div>

            {/* Tabelleninhalt */}
            <div className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <div className="px-6 py-4 text-center text-gray-500">
                  <svg className="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="mt-2">Dokumente werden geladen...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="px-6 py-4 text-center text-gray-500">
                  <p>Keine Dokumente gefunden</p>
                </div>
              ) : (
                documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleDocumentClick(doc)}
                  >
                    <div className="col-span-2">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium text-primary-600">{doc.file_name}</div>
                          <div className="text-sm text-gray-500">{doc.file_type}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">
                        {documentTypes[doc.document_type as DocumentType] || doc.document_type}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[doc.status as keyof typeof statusColors]
                      }`}>
                        {statusLabels[doc.status as keyof typeof statusLabels] || doc.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-900">
                      {(doc.metadata as any)?.uploadedBy?.name || 'Unbekannt'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString('de-CH', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Details Modal */}
      <AnimatePresence>
        {selectedDocument && (
          <DocumentDetails
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
} 