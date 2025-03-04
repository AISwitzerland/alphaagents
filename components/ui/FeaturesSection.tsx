'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const features = [
  {
    title: 'KI-gestützte Dokumentenanalyse',
    description: 'Automatische Erkennung und Klassifizierung von Dokumententypen mit höchster Präzision.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    title: 'Mehrkanal-Integration',
    description: 'Nahtlose Verarbeitung von Dokumenten über E-Mail, Chat und direkten Upload.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Automatische Datenextraktion',
    description: 'Intelligente Erkennung und Extraktion relevanter Informationen aus allen Dokumententypen.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
  },
  {
    title: 'Echtzeit-Verarbeitung',
    description: 'Sofortige Verarbeitung und Bereitstellung der Dokumente im System.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Schweizer Datenschutz',
    description: '100% Konformität mit Schweizer Datenschutzrichtlinien und höchste Sicherheitsstandards.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: 'Intelligentes Dashboard',
    description: 'Übersichtliche Darstellung aller Dokumente und Prozesse in Echtzeit.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold text-primary-600 uppercase tracking-wider"
          >
            Unsere Lösungen
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Digitalisieren Sie Ihre Versicherungsprozesse
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-gray-600"
          >
            Entdecken Sie unsere leistungsstarken Features für ein effizientes Dokumentenmanagement.
          </motion.p>
        </div>

        {/* Image and Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
          >
            <Image 
              src="/images/landing/Buchhaltung.avif" 
              alt="Effizientes Dokumentenmanagement" 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700/30 to-primary-900/20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-primary-900/80 to-transparent">
              <p className="text-white text-lg font-medium">Optimieren Sie Ihre Arbeitsprozesse</p>
            </div>
          </motion.div>

          {/* Features List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.slice(0, 4).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300 h-full bg-white">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <div className="text-primary-600">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Features with Counting Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.slice(4, 6).map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300 h-full bg-white">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                      <div className="text-primary-600">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
              <div className="sm:col-span-2">
                <div className="p-5 border border-primary-100 bg-primary-50 rounded-lg">
                  <p className="text-primary-700 font-medium mb-3">Warum Alpha Informatik wählen?</p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-accent-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Reduzieren Sie manuelle Arbeit um bis zu 80%</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-accent-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">Senken Sie Fehlerquoten um mehr als 95%</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-accent-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">24/7 Verfügbarkeit mit Schweizer Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 order-1 lg:order-2 relative h-[350px] rounded-lg overflow-hidden shadow-xl"
          >
            <Image 
              src="/images/landing/counting.jpg" 
              alt="Finanzielle Vorteile" 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700/30 to-primary-900/20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-primary-900/80 to-transparent">
              <p className="text-white text-lg font-medium">Effizienz, die sich auszahlt</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 