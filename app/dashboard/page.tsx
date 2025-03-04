'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const stats = [
  { 
    name: 'Dokumente gesamt', 
    value: '248',
    icon: (
      <svg className="w-10 h-10 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    name: 'In Bearbeitung', 
    value: '12',
    icon: (
      <svg className="w-10 h-10 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    name: 'Heute hochgeladen', 
    value: '8',
    icon: (
      <svg className="w-10 h-10 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
    )
  },
  { 
    name: 'Erfolgreich verarbeitet', 
    value: '94%',
    icon: (
      <svg className="w-10 h-10 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
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

const activityLog = [
  { action: 'Dokument hochgeladen', document: 'Jahresbericht_2024.pdf', time: 'Vor 1 Stunde' },
  { action: 'Analyse abgeschlossen', document: 'Schadenmeldung_2024_001.pdf', time: 'Vor 3 Stunden' },
  { action: 'Kommentar hinzugefügt', document: 'Rechnung_XYZ_123.pdf', time: 'Vor 5 Stunden' },
  { action: 'Verarbeitung gestartet', document: 'Vertrag_Update_2024.docx', time: 'Vor 6 Stunden' },
];

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('Guten Tag');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Guten Morgen');
    else if (hour < 18) setGreeting('Guten Tag');
    else setGreeting('Guten Abend');

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('de-DE', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }) + ' Uhr'
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-8">
      {/* Header with Greeting */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl shadow-lg">
        <div className="px-6 py-8 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl font-bold text-white"
              >
                {greeting}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-1 text-primary-100"
              >
                {currentTime}
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-4 sm:mt-0"
            >
              {/* Button entfernt */}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative bg-white overflow-hidden rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-br from-primary-400 to-primary-600 opacity-[0.07] rounded-l-full"></div>
            <div className="px-6 py-5 sm:p-6 flex justify-between items-center">
              <div>
                <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                <dd className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</dd>
              </div>
              <div className="rounded-full bg-primary-50 p-3">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white shadow-md rounded-xl border border-gray-100 lg:col-span-2"
        >
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Kürzlich bearbeitet</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Alle anzeigen
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentDocuments.map((doc, index) => (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`
                        h-10 w-10 rounded-lg flex items-center justify-center
                        ${doc.type === 'Schadenmeldung' ? 'bg-red-100' : 
                          doc.type === 'Rechnung' ? 'bg-yellow-100' : 
                          'bg-blue-100'}
                      `}>
                        <svg className={`h-6 w-6 
                          ${doc.type === 'Schadenmeldung' ? 'text-red-500' : 
                            doc.type === 'Rechnung' ? 'text-yellow-600' : 
                            'text-blue-500'}`} 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                            d={doc.type === 'Schadenmeldung' 
                              ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                              : doc.type === 'Rechnung' 
                                ? "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                                : "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"} 
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary-600 truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${doc.status === 'Verarbeitet' ? 'bg-green-100 text-green-800' : 
                        doc.status === 'In Bearbeitung' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {doc.status}
                    </span>
                    <span className="text-xs text-gray-500">{doc.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
            <button className="w-full py-2 flex items-center justify-center text-sm text-primary-600 hover:text-primary-700 font-medium">
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Dokument hochladen
            </button>
          </div>
        </motion.div>

        {/* Activity Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white shadow-md rounded-xl border border-gray-100"
        >
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Aktivitäten</h3>
          </div>
          <div className="px-6 py-4">
            <div className="flow-root">
              <ul className="-mb-8">
                {activityLog.map((activity, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== activityLog.length - 1 ? (
                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center ring-8 ring-white">
                            <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                d={
                                  activity.action.includes('hochgeladen') 
                                    ? "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                                  : activity.action.includes('Analyse') 
                                    ? "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                                  : activity.action.includes('Kommentar') 
                                    ? "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                                  : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                } 
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <p className="text-sm text-gray-500">{activity.action}</p>
                            <p className="mt-0.5 text-sm font-medium text-primary-600">{activity.document}</p>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
            <button className="w-full py-2 flex items-center justify-center text-sm text-primary-600 hover:text-primary-700 font-medium">
              Alle Aktivitäten anzeigen
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 