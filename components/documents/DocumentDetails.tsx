'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, DocumentType } from '@/types/document';

interface DocumentDetailsProps {
  document: Document;
  onClose: () => void;
}

const documentTypes: { [key in DocumentType]: string } = {
  'invoice': 'Rechnung',
  'contract_change': 'Vertragsänderung',
  'accident_report': 'Unfallmeldung',
  'damage_report': 'Schadenmeldung',
  'misc': 'Sonstiges',
};

export function DocumentDetails({ document, onClose }: DocumentDetailsProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'actions'>('details');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Dokumentdetails</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'details'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`ml-8 py-4 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'history'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Verlauf
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`ml-8 py-4 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'actions'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Aktionen
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <AnimatePresence mode="wait">
            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{document.metadata.originalName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Typ</label>
                    <p className="mt-1 text-sm text-gray-900">{documentTypes[document.type]}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Größe</label>
                    <p className="mt-1 text-sm text-gray-900">{document.metadata.size} Bytes</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Hochgeladen von</label>
                    <p className="mt-1 text-sm text-gray-900">{document.metadata.uploadedBy.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Datum</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(document.metadata.uploadedAt).toLocaleDateString('de-CH', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <p className="mt-1 text-sm text-gray-900">{document.status.status}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flow-root">
                  <ul role="list" className="-mb-8">
                    <li className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm text-gray-500">
                              Hochgeladen von <span className="font-medium text-gray-900">{document.metadata.uploadedBy.name}</span>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              {new Date(document.metadata.uploadedAt).toLocaleDateString('de-CH', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'actions' && (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Herunterladen
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Löschen
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
} 