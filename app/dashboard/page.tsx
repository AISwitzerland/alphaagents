'use client';

import { motion } from 'framer-motion';

const stats = [
  { name: 'Dokumente gesamt', value: '248' },
  { name: 'In Bearbeitung', value: '12' },
  { name: 'Heute hochgeladen', value: '8' },
  { name: 'Erfolgreich verarbeitet', value: '94%' },
];

const recentDocuments = [
  {
    name: 'Schadenmeldung_2024_001.pdf',
    type: 'Schadenmeldung',
    size: '2.4 MB',
    status: 'Verarbeitet',
    date: 'Vor 2 Stunden',
  },
  {
    name: 'Rechnung_XYZ_123.pdf',
    type: 'Rechnung',
    size: '1.8 MB',
    status: 'In Bearbeitung',
    date: 'Vor 3 Stunden',
  },
  {
    name: 'Vertrag_Update_2024.docx',
    type: 'Vertragsänderung',
    size: '892 KB',
    status: 'Ausstehend',
    date: 'Vor 5 Stunden',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Neues Dokument
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</dd>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Documents */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Kürzlich bearbeitet</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentDocuments.map((doc, index) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-primary-600 truncate">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${doc.status === 'Verarbeitet' ? 'bg-green-100 text-green-800' : 
                      doc.status === 'In Bearbeitung' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {doc.status}
                  </span>
                  <span className="ml-4 text-sm text-gray-500">{doc.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 