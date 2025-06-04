'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AutonomysNavbar from '@/components/AutonomysNavbar'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Eye, Brain, Zap, Play, Upload } from 'lucide-react'

export default function OCRDokumentenverarbeitungPage() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <div className="min-h-screen bg-black">
      <AutonomysNavbar />
      
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 to-neutral-900 overflow-hidden">
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <div className="container-professional relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-800 border border-neutral-700 mb-8"
            >
              <motion.div 
                className="w-2 h-2 bg-green-400 rounded-full mr-2"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-neutral-300 text-sm font-medium">Alpha AI OCR-Agent</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Intelligente{' '}
              <motion.span 
                className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                OCR-Verarbeitung
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-neutral-200 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Revolutionäre OCR-Technologie mit Alpha AI für Schweizer Dokumente. 
              Unfallversicherungs-Formulare und Rechnungen automatisch erfassen, klassifizieren und verarbeiten.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => setShowDemo(!showDemo)}
                  className="inline-flex items-center px-8 py-3 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-all duration-300"
                >
                  {showDemo ? 'Demo ausblenden' : 'Live Demo testen'}
                  <Play className="ml-2 h-5 w-5" />
                </button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/kontakt"
                  className="inline-flex items-center px-8 py-3 border border-neutral-600 text-white font-semibold rounded-lg hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-300"
                >
                  Beratung anfragen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-neutral-600 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-neutral-400 rounded-full mt-2"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {showDemo && (
        <section className="py-16 bg-gradient-to-b from-neutral-900 to-black">
          <div className="container-professional">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                🚀 Live OCR Demo
              </h2>
              <p className="text-lg text-neutral-300">
                Testen Sie unsere OCR-Technologie mit einem echten Schweizer Dokument
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 border-2 border-dashed border-blue-500/50 hover:border-blue-400/70 transition-colors"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-16 w-16 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">Dokument hochladen</h3>
                  <p className="text-neutral-300 mb-6">
                    Ziehen Sie Ihr Unfallversicherungs-Formular oder eine Rechnung hierher
                  </p>
                  <div className="space-y-4">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300">
                      Datei auswählen
                    </button>
                    <p className="text-sm text-neutral-400">
                      Unterstützte Formate: PDF, JPG, PNG, DOCX
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">📋 Erkannte Daten</h3>
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <span className="font-semibold text-green-300">Dokumententyp erkannt</span>
                    </div>
                    <p className="text-green-200 text-sm">Unfallmeldung (Formular 1)</p>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Eye className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="font-semibold text-blue-300">Extrahierte Felder</span>
                    </div>
                    <div className="text-blue-200 text-sm space-y-1">
                      <div>• Versichertennummer: 756.1234.5678.90</div>
                      <div>• Unfalldatum: 15.03.2024</div>
                      <div>• Unfallort: Baustelle Zürich</div>
                      <div>• Diagnose: Handgelenksfraktur</div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Brain className="h-5 w-5 text-purple-400 mr-2" />
                      <span className="font-semibold text-purple-300">Alpha AI Klassifizierung</span>
                    </div>
                    <div className="text-purple-200 text-sm space-y-1">
                      <div>• Priorität: Hoch (Arbeitsunfall)</div>
                      <div>• Weiterleitung: Unfallversicherungs-Sachbearbeiter</div>
                      <div>• Konfidenz: 98.7%</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-neutral-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-400">Verarbeitungszeit:</span>
                      <span className="font-bold text-green-400">2.3 Sekunden</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-400">
                💡 Dies ist eine Demo-Simulation. In der Realität würden Ihre echten Dokumente verarbeitet.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="py-24 bg-gradient-to-b from-black to-neutral-900">
        <div className="container-professional">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Alpha AI OCR-Technologie
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Enterprise-Grade KI für präzise Dokumentenerkennung und -verarbeitung
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6"
              >
                <Eye className="h-8 w-8 text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Alpha Vision AI</h3>
              <p className="text-neutral-200 mb-6">
                Unsere proprietäre Vision-KI erkennt und interpretiert komplexe 
                Schweizer Dokumente mit überlegener Genauigkeit.
              </p>
              <ul className="text-sm text-neutral-300 space-y-3">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Handschrift-Erkennung</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Tabellen-Extraktion</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Mehrsprachig (DE/FR/IT)</li>
              </ul>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6"
              >
                <Brain className="h-8 w-8 text-emerald-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Intelligente Klassifizierung</h3>
              <p className="text-neutral-200 mb-6">
                Automatische Erkennung und Kategorisierung von Unfallversicherungs-Formularen 
                und Rechnungen.
              </p>
              <ul className="text-sm text-neutral-300 space-y-3">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Unfallversicherungs-Formulare</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Versicherungs-Dokumente</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Rechnungen & Belege</li>
              </ul>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6"
              >
                <Zap className="h-8 w-8 text-purple-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Echtzeit-Verarbeitung</h3>
              <p className="text-neutral-200 mb-6">
                Sofortige Dokumentenverarbeitung und -extraktion. Von Upload bis 
                strukturierte Daten in unter 3 Sekunden.
              </p>
              <ul className="text-sm text-neutral-300 space-y-3">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Unter 3 Sekunden</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Batch-Verarbeitung</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />API-Integration</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-black to-neutral-900">
        <div className="container-professional text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Bereit für intelligente OCR-Verarbeitung?
            </h2>
            <p className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto">
              Testen Sie unsere Alpha AI OCR-Lösung kostenlos mit Ihren eigenen Dokumenten
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => setShowDemo(true)}
                  className="inline-flex items-center px-8 py-4 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-all duration-300"
                >
                  Live Demo ausprobieren
                  <Play className="ml-2 h-5 w-5" />
                </button>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/kontakt"
                  className="inline-flex items-center px-8 py-4 border border-neutral-600 text-white font-semibold rounded-lg hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-300"
                >
                  Individuelle Beratung
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-neutral-400 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                DSGVO-konform
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Swiss Hosting
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Enterprise Support
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}