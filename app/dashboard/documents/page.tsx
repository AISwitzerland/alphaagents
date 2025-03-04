'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BiSearch, BiFilterAlt, BiCheckCircle, BiX, BiDotsHorizontalRounded } from 'react-icons/bi';
import { useDocumentStore } from '@/store/documentStore';
import { Document as DocumentType, DocumentType as DocType } from '@/types/document';

// Mock-Daten für Dokumente
const documents = [
  {
    id: 'doc-001',
    name: 'Schadenmeldung_2024_001.pdf',
    type: 'Schadenmeldung',
    size: '2.4 MB',
    status: 'Verarbeitet',
    uploaded: '22.02.2024',
    lastModified: '23.02.2024',
    tags: ['Wichtig', 'Kunde A'],
  },
  {
    id: 'doc-002',
    name: 'Rechnung_XYZ_123.pdf',
    type: 'Rechnung',
    size: '1.8 MB',
    status: 'In Bearbeitung',
    uploaded: '21.02.2024',
    lastModified: '22.02.2024',
    tags: ['Finanzen', 'Q1 2024'],
  },
  {
    id: 'doc-003',
    name: 'Vertrag_Update_2024.docx',
    type: 'Vertragsänderung',
    size: '892 KB',
    status: 'Ausstehend',
    uploaded: '20.02.2024',
    lastModified: '21.02.2024',
    tags: ['Vertrag', 'Kunde B'],
  },
  {
    id: 'doc-004',
    name: 'Kundendaten_Schmidt_2024.xlsx',
    type: 'Kundendaten',
    size: '1.2 MB',
    status: 'Verarbeitet',
    uploaded: '19.02.2024',
    lastModified: '20.02.2024',
    tags: ['CRM', 'Kunde C'],
  },
  {
    id: 'doc-005',
    name: 'Präsentation_Vorstand.pptx',
    type: 'Präsentation',
    size: '3.7 MB',
    status: 'Verarbeitet',
    uploaded: '18.02.2024',
    lastModified: '19.02.2024',
    tags: ['Intern', 'Meeting'],
  },
  {
    id: 'doc-006',
    name: 'Jahresbericht_2023.pdf',
    type: 'Bericht',
    size: '5.2 MB',
    status: 'Verarbeitet',
    uploaded: '15.02.2024',
    lastModified: '16.02.2024',
    tags: ['Finanzen', 'Jahresabschluss'],
  },
];

// Filter-Optionen
const statusFilters = ['Alle', 'Verarbeitet', 'In Bearbeitung', 'Ausstehend'];
const typeFilters = ['Alle', 'Schadenmeldung', 'Rechnung', 'Vertragsänderung', 'Kundendaten', 'Präsentation', 'Bericht'];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  
  // Dokument-Store verwenden
  const { 
    documents: storeDocuments, 
    isLoading, 
    error, 
    fetchDocuments,
    lastSynced
  } = useDocumentStore();
  
  // Beim ersten Laden und dann alle 30 Sekunden Dokumente abrufen
  useEffect(() => {
    // Sofort laden
    fetchDocuments();
    
    // Alle 30 Sekunden aktualisieren
    const interval = setInterval(() => {
      fetchDocuments();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchDocuments]);
  
  // Gefilterte Dokumente basierend auf den ausgewählten Filtern
  const filteredDocuments = storeDocuments?.filter(doc => {
    // Null-Check für die Dokumente
    if (!doc) return false;
    
    // Statusfilter
    if (statusFilter && doc.status?.status !== statusFilter) {
      return false;
    }
    
    // Typfilter
    if (typeFilter && doc.type !== typeFilter) {
      return false;
    }
    
    // Suchbegriff
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        doc.metadata?.originalName?.toLowerCase().includes(searchTermLower) ||
        doc.id.toLowerCase().includes(searchTermLower) ||
        doc.type.toLowerCase().includes(searchTermLower)
      );
    }
    
    return true;
  }) || [];
  
  // Formatiere das Datum
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };
  
  // Statusbadge-Komponente
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = '';
    let textColor = '';
    
    switch (status) {
      case 'eingereicht':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-600';
        break;
      case 'in_bearbeitung':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-600';
        break;
      case 'abgeschlossen':
        bgColor = 'bg-green-100';
        textColor = 'text-green-600';
        break;
      case 'archiviert':
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-600';
        break;
      case 'storniert':
        bgColor = 'bg-red-100';
        textColor = 'text-red-600';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-600';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl p-6 mb-6 shadow-lg text-white"
      >
        <h1 className="text-2xl font-bold">Dokumente</h1>
        <p className="text-blue-100">Verwalten Sie Ihre Dokumente an einem zentralen Ort</p>
      </motion.div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Dokumente suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="relative">
              <select
                value={statusFilter || ''}
                onChange={(e) => setStatusFilter(e.target.value || null)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Alle Status</option>
                <option value="eingereicht">Eingereicht</option>
                <option value="in_bearbeitung">In Bearbeitung</option>
                <option value="abgeschlossen">Abgeschlossen</option>
                <option value="archiviert">Archiviert</option>
                <option value="storniert">Storniert</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BiFilterAlt className="text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select
                value={typeFilter || ''}
                onChange={(e) => setTypeFilter(e.target.value || null)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Alle Typen</option>
                <option value="invoice">Rechnung</option>
                <option value="contract_change">Vertragsänderung</option>
                <option value="accident_report">Unfallmeldung</option>
                <option value="damage_report">Schadenmeldung</option>
                <option value="misc">Sonstiges</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BiFilterAlt className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Dokumententabelle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden"
        >
          {filteredDocuments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dokument
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Typ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hochgeladen
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredDocuments.map((doc, index) => (
                    <motion.tr 
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${selectedDocument === doc.id ? 'bg-primary-50' : ''}`}
                      onClick={() => setSelectedDocument(doc.id === selectedDocument ? null : doc.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`
                            flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center
                            ${doc.type === 'Schadenmeldung' ? 'bg-red-100' : 
                              doc.type === 'Rechnung' ? 'bg-yellow-100' : 
                              doc.type === 'Vertragsänderung' ? 'bg-blue-100' :
                              doc.type === 'Kundendaten' ? 'bg-green-100' :
                              doc.type === 'Präsentation' ? 'bg-purple-100' : 'bg-gray-100'}
                          `}>
                            <svg className={`h-6 w-6 
                              ${doc.type === 'Schadenmeldung' ? 'text-red-500' : 
                                doc.type === 'Rechnung' ? 'text-yellow-600' : 
                                doc.type === 'Vertragsänderung' ? 'text-blue-500' :
                                doc.type === 'Kundendaten' ? 'text-green-500' :
                                doc.type === 'Präsentation' ? 'text-purple-500' : 'text-gray-500'}`} 
                              fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                d={doc.type === 'Schadenmeldung' 
                                  ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                                  : doc.type === 'Rechnung' 
                                    ? "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                                    : doc.type === 'Vertragsänderung'
                                      ? "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      : doc.type === 'Kundendaten'
                                        ? "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        : doc.type === 'Präsentation'
                                          ? "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                          : "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"} 
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-primary-600">{doc.name}</div>
                            <div className="text-xs text-gray-500">{doc.size}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doc.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={doc.status.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(doc.uploaded)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.map((tag, tagIndex) => (
                            <span 
                              key={tagIndex} 
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-primary-600 hover:text-primary-900 p-1" title="Anzeigen">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="text-primary-600 hover:text-primary-900 p-1" title="Herunterladen">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          <button className="text-primary-600 hover:text-primary-900 p-1" title="Löschen">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 px-4 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Dokumente gefunden</h3>
              <p className="mt-1 text-sm text-gray-500">
                Ändern Sie Ihre Filtereinstellungen oder laden Sie neue Dokumente hoch.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Neues Dokument
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Paginierung */}
        {filteredDocuments.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm"
          >
            <div className="flex flex-1 justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Zurück
              </button>
              <button className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700">
                Weiter
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Anzeige von <span className="font-medium">1</span> bis <span className="font-medium">{filteredDocuments.length}</span> von{' '}
                  <span className="font-medium">{filteredDocuments.length}</span> Ergebnissen
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    <span className="sr-only">Zurück</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-primary-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                    1
                  </button>
                  <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    <span className="sr-only">Weiter</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 