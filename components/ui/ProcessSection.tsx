'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Dokument-Upload',
    description: 'Laden Sie Ihre Dokumente über verschiedene Kanäle hoch - per E-Mail, Chat oder direkt über die Plattform.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    title: 'KI-Analyse',
    description: 'Unsere KI analysiert und klassifiziert Ihre Dokumente automatisch und extrahiert relevante Informationen.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Daten-Extraktion',
    description: 'Wichtige Informationen werden automatisch erkannt und in strukturierte Daten umgewandelt.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Validierung & Bereitstellung',
    description: 'Nach der automatischen Validierung stehen Ihre Dokumente sofort zur Verfügung.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function ProcessSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full animate-float-slow opacity-5">
          <div className="w-full h-full bg-primary-400 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Wie es funktioniert
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            Ein einfacher Prozess für komplexe Dokumentenverarbeitung
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary-200">
                  <div className="absolute right-0 -top-1 w-2 h-2 bg-primary-400 rounded-full"></div>
                </div>
              )}
              
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-100
                p-6 hover:shadow-2xl transition-all duration-300 h-full group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-transparent to-primary-50 opacity-0
                  group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4
                    group-hover:bg-primary-200 transition-colors duration-300">
                    <div className="text-primary-600">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 