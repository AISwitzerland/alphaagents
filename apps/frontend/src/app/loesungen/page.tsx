'use client'

import AutonomysNavbar from '@/components/AutonomysNavbar'
import Link from 'next/link'
import { ArrowRight, FileText, Mail, MessageSquare, Users, CheckCircle, Eye, Brain, Workflow, Calendar, Phone, Settings, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

// Metadata moved to layout.tsx for client component compatibility

export default function LoesungenPage() {
  return (
    <div className="min-h-screen bg-black">
      <AutonomysNavbar />
      
      {/* Hero Section - Autonomys Style */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 to-neutral-900 overflow-hidden">
        {/* Animated Background Elements */}
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
            {/* Animated Badge */}
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
              <span className="text-neutral-300 text-sm font-medium">Intelligente Automatisierungslösungen</span>
            </motion.div>
            
            {/* Animated Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Multi-Agent{' '}
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
                KI-Lösungen
              </motion.span>
            </motion.h1>
            
            {/* Animated Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-neutral-200 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Spezialisierte KI-Agenten für jeden Unternehmensbereich. Von intelligenter Dokumentenverarbeitung 
              bis zur vollständigen Workflow-Automatisierung mit modernster KI-Technologie.
            </motion.p>
            
            {/* Animated CTA Buttons */}
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
                <Link
                  href="/demo"
                  className="inline-flex items-center px-8 py-3 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-all duration-300"
                >
                  Live Demo starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
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
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
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

      {/* Implementation Process - Dark Theme */}
      <section className="py-24 bg-gradient-to-b from-neutral-900 to-black">
        <div className="container-professional">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              In 4 Schritten zur Automatisierung
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Von der Analyse bis zur produktiven Nutzung in nur 4-6 Wochen
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Analyse & Beratung</h3>
              <p className="text-neutral-300">
                Detaillierte Prozessanalyse und Identifikation der optimalen Multi-Agent-Konfiguration.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Agent-Prototyping</h3>
              <p className="text-neutral-300">
                Entwicklung spezialisierter Agenten mit Ihren echten Daten und Workflow-Tests.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">System-Integration</h3>
              <p className="text-neutral-300">
                Nahtlose Integration in Ihre bestehende IT-Infrastruktur mit minimalen Ausfallzeiten.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Go-Live & Monitoring</h3>
              <p className="text-neutral-300">
                Produktiver Start mit umfassendem Training und 24/7 Agent-Monitoring.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Solutions - Dark Theme */}
      <section className="py-24 bg-gradient-to-b from-neutral-900 to-black">
        <div className="container-professional">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Unsere Kern-Lösungen
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Spezialisierte KI-Agenten für verschiedene Geschäftsprozesse mit bewiesener Enterprise-Performance
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <div className="flex items-center mb-6">
                <motion.div 
                  className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FileText className="h-8 w-8 text-blue-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">OCR-Agent</h3>
              </div>
              <p className="text-neutral-200 mb-6 text-lg">
                Modernste KI für präzise Texterkennung aus allen Dokumenttypen. 
                Intelligente Klassifizierung, Extraktion und automatische Weiterverarbeitung.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-blue-400 mr-3" />
                  Rechnungen, Verträge, Formulare automatisch erfassen
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-blue-400 mr-3" />
                  99.2% Präzision bei DE/CH Dokumenten
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-blue-400 mr-3" />
                  Nahtlose System-Integration
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                <p className="text-sm text-blue-300 font-medium">💡 ROI: 320% im ersten Jahr</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <div className="flex items-center mb-6">
                <motion.div 
                  className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mr-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MessageSquare className="h-8 w-8 text-emerald-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Chat-Agent</h3>
              </div>
              <p className="text-neutral-200 mb-6 text-lg">
                Intelligente Kundeninteraktion mit modernster KI. Automatische Terminbuchung, 
                kontextuelle FAQ-Beantwortung und smarte Anfragen-Weiterleitung.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mr-3" />
                  24/7 Kundenservice ohne Wartezeiten
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mr-3" />
                  Intelligente Terminbuchung mit Kalender-Sync
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mr-3" />
                  Mehrsprachig: DE, CH-DE, EN, FR
                </div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
                <p className="text-sm text-emerald-300 font-medium">📞 80% weniger Support-Aufwand</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <div className="flex items-center mb-6">
                <motion.div 
                  className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <Mail className="h-8 w-8 text-purple-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">E-Mail-Agent</h3>
              </div>
              <p className="text-neutral-200 mb-6 text-lg">
                Modernste KI für intelligente E-Mail-Verarbeitung. Automatische Klassifizierung, 
                kontextuelle Antworten und smarte Workflow-Integration.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-purple-400 mr-3" />
                  Automatische Kategorisierung eingehender E-Mails
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-purple-400 mr-3" />
                  Intelligente Antworten mit Kontext-Verständnis
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-purple-400 mr-3" />
                  Smart Routing an zuständige Teams
                </div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                <p className="text-sm text-purple-300 font-medium">⚡ 95% schnellere E-Mail-Verarbeitung</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <div className="flex items-center mb-6">
                <motion.div 
                  className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center mr-4"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <Users className="h-8 w-8 text-cyan-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Manager-Agent</h3>
              </div>
              <p className="text-neutral-200 mb-6 text-lg">
                Orchestrierung des Multi-Agent-Systems für komplexe Workflows. 
                Koordination, Monitoring und automatische Recovery-Mechanismen.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400 mr-3" />
                  Intelligente Agent-Koordination
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400 mr-3" />
                  Dependency Injection Architecture
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400 mr-3" />
                  Automatische Fehlerbehandlung & Recovery
                </div>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-lg">
                <p className="text-sm text-cyan-300 font-medium">🔗 99.8% System-Uptime</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* OCR-Dokumentenverarbeitung - Detailed Section */}
      <section className="py-24 bg-gradient-to-b from-black to-neutral-900">
        <div className="container-professional">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 mb-8"
            >
              <Eye className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-medium">OCR-Dokumentenverarbeitung</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Intelligente OCR-Verarbeitung
            </h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              Revolutionäre OCR-Technologie mit modernster KI für Schweizer Dokumente. 
              Unfallversicherungs-Formulare und Rechnungen automatisch erfassen, klassifizieren und verarbeiten.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* OCR Features */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4"
                  >
                    <Eye className="h-8 w-8 text-blue-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white">Vision AI</h3>
                </div>
                <p className="text-neutral-200 mb-6">
                  Unsere fortschrittliche Vision-KI erkennt und interpretiert komplexe 
                  Schweizer Dokumente mit überlegener Genauigkeit.
                </p>
                <ul className="text-sm text-neutral-300 space-y-3">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Handschrift-Erkennung</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Tabellen-Extraktion</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Mehrsprachig (DE/FR/IT)</li>
                </ul>
              </div>

              <div className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mr-4"
                  >
                    <Brain className="h-8 w-8 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white">Intelligente Klassifizierung</h3>
                </div>
                <p className="text-neutral-200 mb-6">
                  Automatische Erkennung und Kategorisierung von Unfallversicherungs-Formularen 
                  und Rechnungen.
                </p>
                <ul className="text-sm text-neutral-300 space-y-3">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Unfallversicherungs-Formulare</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Versicherungs-Dokumente</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Rechnungen & Belege</li>
                </ul>
              </div>
            </motion.div>

            {/* OCR Demo Area */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-white mb-4">📋 Live OCR Demo</h3>
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
                    <span className="font-semibold text-purple-300">KI-Klassifizierung</span>
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
                    <span className="font-bold text-green-400">6.7 Sekunden</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chat-Assistenten - Detailed Section */}
      <section className="py-24 bg-gradient-to-b from-neutral-900 to-black">
        <div className="container-professional">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-8"
            >
              <MessageSquare className="h-5 w-5 text-emerald-400 mr-2" />
              <span className="text-emerald-300 text-sm font-medium">Chat-Assistenten</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Intelligente Chat-Assistenten
            </h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              24/7 Kundenservice mit modernster KI. Automatische Terminbuchung, 
              kontextuelle FAQ-Beantwortung und smarte Anfragen-Weiterleitung.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <MessageSquare className="h-8 w-8 text-emerald-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">24/7 Kundenservice</h3>
              <p className="text-neutral-200 mb-6">
                Intelligente Kundeninteraktion ohne Wartezeiten. 
                Sofortige Antworten auf häufige Fragen.
              </p>
              <ul className="text-sm text-neutral-300 space-y-3">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Sofortige Antworten</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Kontextverständnis</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Mehrsprachig</li>
              </ul>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6"
              >
                <Calendar className="h-8 w-8 text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Intelligente Terminbuchung</h3>
              <p className="text-neutral-200 mb-6">
                Automatische Kalendersynchronisation und smarte 
                Terminvorschläge basierend auf Verfügbarkeit.
              </p>
              <ul className="text-sm text-neutral-300 space-y-3">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Kalender-Integration</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Automatische Bestätigung</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Erinnerungen</li>
              </ul>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6"
              >
                <Phone className="h-8 w-8 text-purple-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart Routing</h3>
              <p className="text-neutral-200 mb-6">
                Intelligente Weiterleitung komplexer Anfragen an 
                die zuständigen Fachbereiche.
              </p>
              <ul className="text-sm text-neutral-300 space-y-3">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Automatische Klassifizierung</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Prioritäts-Management</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Follow-up Tracking</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workflow-Automation - Detailed Section */}
      <section className="py-24 bg-gradient-to-b from-black to-neutral-900">
        <div className="container-professional">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-8"
            >
              <Workflow className="h-5 w-5 text-purple-400 mr-2" />
              <span className="text-purple-300 text-sm font-medium">Workflow-Automation</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Komplette Workflow-Automation
            </h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              End-to-End Geschäftsprozess-Automatisierung mit modernster KI. 
              Von der Dokumentenerkennung bis zur finalen Bearbeitung - vollständig automatisiert.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4"
                  >
                    <Settings className="h-8 w-8 text-purple-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white">Intelligente Orchestrierung</h3>
                </div>
                <p className="text-neutral-200 mb-6">
                  Multi-Agent-System koordiniert komplexe Workflows automatisch. 
                  Von der Eingabe bis zur finalen Ausgabe.
                </p>
                <ul className="text-sm text-neutral-300 space-y-3">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Automatische Prozess-Erkennung</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Dynamische Agent-Koordination</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Fehlerbehandlung & Recovery</li>
                </ul>
              </div>

              <div className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mr-4"
                  >
                    <TrendingUp className="h-8 w-8 text-green-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white">Performance Analytics</h3>
                </div>
                <p className="text-neutral-200 mb-6">
                  Real-time Monitoring und intelligente Optimierung 
                  aller Workflow-Prozesse.
                </p>
                <ul className="text-sm text-neutral-300 space-y-3">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-3" />Live Dashboard</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-3" />Automatische Optimierung</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-3" />Predictive Analytics</li>
                </ul>
              </div>
            </motion.div>

            {/* Workflow Process Visualization */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">🔄 Workflow-Prozess</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">1</div>
                  <div>
                    <h4 className="font-semibold text-white">Dokument-Eingang</h4>
                    <p className="text-sm text-neutral-300">E-Mail/Upload automatisch erkannt</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">2</div>
                  <div>
                    <h4 className="font-semibold text-white">OCR & Klassifizierung</h4>
                    <p className="text-sm text-neutral-300">Inhalte extrahiert und kategorisiert</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">3</div>
                  <div>
                    <h4 className="font-semibold text-white">Intelligente Verarbeitung</h4>
                    <p className="text-sm text-neutral-300">Daten validiert und ergänzt</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">4</div>
                  <div>
                    <h4 className="font-semibold text-white">System-Integration</h4>
                    <p className="text-sm text-neutral-300">Automatischer Import in Zielsysteme</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">5</div>
                  <div>
                    <h4 className="font-semibold text-white">Completion & Tracking</h4>
                    <p className="text-sm text-neutral-300">Bestätigung und Monitoring</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-neutral-700">
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                  <p className="text-sm text-green-300 font-medium">⚡ Durchschnittliche Verarbeitungszeit: 2.8 Minuten</p>
                  <p className="text-sm text-green-300">📈 96.4% Automatisierungsgrad</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark Theme */}
      <section className="py-24 bg-gradient-to-b from-black to-neutral-900">
        <div className="container-professional text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Bereit für intelligente Automatisierung?
            </h2>
            <p className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto">
              Schließen Sie sich führenden Schweizer Unternehmen an, die bereits ihre 
              Prozesse mit intelligenter KI-Automatisierung revolutioniert haben.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/demo"
                  className="inline-flex items-center px-8 py-4 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-all duration-300"
                >
                  Live Demo starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/kontakt"
                  className="inline-flex items-center px-8 py-4 border border-neutral-600 text-white font-semibold rounded-lg hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-300"
                >
                  Kostenlose Beratung
                </Link>
              </motion.div>
            </div>
            
            {/* Trust Indicators */}
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
  );
}