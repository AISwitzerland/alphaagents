'use client'

import { motion } from 'framer-motion'
import AutonomysNavbar from '@/components/AutonomysNavbar'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Workflow, Zap, Clock, Users, Shield, TrendingUp, Mail, FileText, Database, Globe, Settings, Cloud } from 'lucide-react'

export default function WorkflowAutomationPage() {
  return (
    <div className="min-h-screen bg-black">
      <AutonomysNavbar />
      
      {/* Hero Section - Autonomys Style */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 to-neutral-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
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
            className="absolute bottom-20 right-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-xl"
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
              <span className="text-neutral-300 text-sm font-medium">Alpha AI Workflow-Agent</span>
            </motion.div>
            
            {/* Animated Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Intelligente{' '}
              <motion.span 
                className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Workflow-Automation
              </motion.span>
            </motion.h1>
            
            {/* Animated Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-neutral-200 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Revolutionäre Geschäftsprozess-Automatisierung mit Alpha AI. 
              Von E-Mail-Workflows bis zur intelligenten Dokumentenweiterleitung - alles vollautomatisch.
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
                  Workflow Demo
                  <Workflow className="ml-2 h-5 w-5" />
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
                  Prozess-Analyse anfragen
                  <ArrowRight className="ml-2 h-5 w-5" />
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

      {/* Core Automation Features - Dark Theme */}
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
              Alpha AI Prozessautomatisierung
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Intelligente Workflows, die sich selbst optimieren und anpassen
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
                <Mail className="h-8 w-8 text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">E-Mail Automation</h3>
              <p className="text-neutral-200 mb-6">
                Intelligente E-Mail-Überwachung und -Weiterleitung. Automatische 
                Klassifizierung, Priorisierung und Bearbeitung eingehender E-Mails.
              </p>
              <ul className="text-sm text-neutral-300 space-y-3">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Attachment-Erkennung</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Automatische Klassifizierung</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Intelligentes Routing</li>
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
                <FileText className="h-8 w-8 text-emerald-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Dokumenten-Workflows</h3>
              <p className="text-neutral-200 mb-6">
                Automatische Dokumentenverarbeitung von Eingang bis Archivierung. 
                SUVA-Formulare, Rechnungen und Verträge intelligent bearbeiten.
              </p>
              <ul className="text-sm text-neutral-300 space-y-3">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />OCR-Integration</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Automatische Ablage</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Compliance-Prüfung</li>
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
                <Database className="h-8 w-8 text-purple-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Datenintegration</h3>
              <p className="text-neutral-200 mb-6">
                Nahtlose Integration zwischen verschiedenen Systemen. Automatischer 
                Datenaustausch und Synchronisation zwischen CRM, ERP und anderen Tools.
              </p>
              <ul className="text-sm text-neutral-300 space-y-3">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />API-Konnektoren</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Real-time Sync</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Fehler-Handling</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Workflow Examples - Dark Theme */}
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
              Praxisbeispiele aus der Versicherungsbranche
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Bewährte Workflows für typische Versicherungsprozesse
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
              whileHover={{ scale: 1.02 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                🏥 SUVA Unfallmeldung Workflow
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-400">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">E-Mail Eingang</h4>
                    <p className="text-sm text-neutral-300">Unfallmeldung mit SUVA-Formular als Anhang</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-emerald-400">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Automatische Erkennung</h4>
                    <p className="text-sm text-neutral-300">Alpha AI erkennt SUVA-Formular und extrahiert Daten</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-purple-400">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Datenvalidierung</h4>
                    <p className="text-sm text-neutral-300">Automatische Prüfung auf Vollständigkeit</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-orange-400">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">CRM Integration</h4>
                    <p className="text-sm text-neutral-300">Daten werden automatisch im System erfasst</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-red-400">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Benachrichtigung</h4>
                    <p className="text-sm text-neutral-300">Zuständiger Sachbearbeiter wird informiert</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300 font-medium">
                  ⏱️ Zeitersparnis: Von 45 Minuten auf 2 Minuten
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                💰 Rechnungsverarbeitung Workflow
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-400">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Rechnung Eingang</h4>
                    <p className="text-sm text-neutral-300">PDF-Rechnung per E-Mail oder Upload</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-emerald-400">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">OCR-Extraktion</h4>
                    <p className="text-sm text-neutral-300">Rechnungsdaten, MwSt und Kostenstellen</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-purple-400">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Duplikat-Prüfung</h4>
                    <p className="text-sm text-neutral-300">Automatische Erkennung doppelter Rechnungen</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-orange-400">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Freigabe-Workflow</h4>
                    <p className="text-sm text-neutral-300">Automatische Weiterleitung zur Genehmigung</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-red-400">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Buchung</h4>
                    <p className="text-sm text-neutral-300">Automatische Verbuchung nach Freigabe</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <p className="text-sm text-emerald-300 font-medium">
                  💡 Fehlerreduktion: 94% weniger manuelle Eingabefehler
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits & ROI - Dark Theme */}
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
              Messbare Vorteile durch Automation
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Konkrete Zahlen aus der Praxis unserer Kunden
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6"
            >
              <div className="text-4xl font-bold text-blue-400 mb-2">91%</div>
              <h3 className="font-bold text-white mb-2">Zeitersparnis</h3>
              <p className="text-sm text-neutral-400">Weniger manuelle Arbeit</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6"
            >
              <div className="text-4xl font-bold text-emerald-400 mb-2">94%</div>
              <h3 className="font-bold text-white mb-2">Fehlerreduktion</h3>
              <p className="text-sm text-neutral-400">Weniger menschliche Fehler</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6"
            >
              <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
              <h3 className="font-bold text-white mb-2">Verfügbarkeit</h3>
              <p className="text-sm text-neutral-400">Kontinuierliche Verarbeitung</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6"
            >
              <div className="text-4xl font-bold text-orange-400 mb-2">280%</div>
              <h3 className="font-bold text-white mb-2">ROI</h3>
              <p className="text-sm text-neutral-400">Return on Investment</p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <div className="space-y-8">
              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-start space-x-4 p-4 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl"
              >
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Sofortige Verarbeitung</h3>
                  <p className="text-neutral-300">
                    Keine Wartezeiten mehr: Dokumente werden in Echtzeit verarbeitet 
                    und weitergeleitet, auch außerhalb der Geschäftszeiten.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-start space-x-4 p-4 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Compliance-Sicherheit</h3>
                  <p className="text-neutral-300">
                    Automatische Einhaltung aller Schweizer Datenschutz- und 
                    Versicherungsvorschriften durch integrierte Compliance-Checks.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-start space-x-4 p-4 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl"
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Skalierbare Prozesse</h3>
                  <p className="text-neutral-300">
                    Workflows wachsen mit Ihrem Unternehmen mit. Keine zusätzlichen 
                    Personalkosten bei steigendem Dokumentenvolumen.
                  </p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Kosteneinsparung Berechnung</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-neutral-700">
                  <span className="text-neutral-300">Manuelle Verarbeitung (300 Dok/Monat)</span>
                  <span className="font-semibold text-white">CHF 6'000</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-neutral-700">
                  <span className="text-neutral-300">Mit AlphaAgents Automation</span>
                  <span className="font-semibold text-emerald-400">CHF 800</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-neutral-700">
                  <span className="text-neutral-300">Monatliche Einsparung</span>
                  <span className="font-bold text-2xl text-emerald-400">CHF 5'200</span>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg mt-6">
                  <p className="text-sm text-emerald-300 text-center font-medium">
                    💡 ROI bereits nach 6 Wochen erreicht
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* API Integration Section */}
      <section className="py-24 bg-gradient-to-b from-black to-neutral-900">
        <div className="container-professional">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Nahtlose API-Integration
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Verbinden Sie AlphaAgents mit Ihren bestehenden Systemen über sichere APIs
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">REST API</h3>
              <p className="text-neutral-300 mb-6">
                Standardisierte REST-Endpoints für einfache Integration in bestehende Systeme
              </p>
              <div className="space-y-2 text-sm text-neutral-400">
                <div>• JSON Format</div>
                <div>• OAuth 2.0 Authentifizierung</div>
                <div>• Rate Limiting</div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Database className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Webhooks</h3>
              <p className="text-neutral-300 mb-6">
                Erhalten Sie Echtzeit-Benachrichtigungen über verarbeitete Dokumente
              </p>
              <div className="space-y-2 text-sm text-neutral-400">
                <div>• Event-basiert</div>
                <div>• Retry-Mechanismus</div>
                <div>• Signatur-Verifizierung</div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Settings className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">SDK & Libraries</h3>
              <p className="text-neutral-300 mb-6">
                Vorgefertigte Libraries für schnelle Entwicklung und Integration
              </p>
              <div className="space-y-2 text-sm text-neutral-400">
                <div>• Python, Node.js, PHP</div>
                <div>• TypeScript Support</div>
                <div>• Code-Beispiele</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Dark Theme */}
      <section className="py-24 bg-gradient-to-b from-neutral-900 to-black">
        <div className="container-professional text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Automatisieren Sie Ihre Prozesse noch heute!
            </h2>
            <p className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto">
              Starten Sie mit einer kostenlosen Prozessanalyse und entdecken Sie Ihr Automatisierungspotential
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
                  Kostenlose Prozessanalyse
                  <Workflow className="ml-2 h-5 w-5" />
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
                  Beratungstermin buchen
                  <ArrowRight className="ml-2 h-5 w-5" />
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