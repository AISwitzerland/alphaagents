'use client'

import AutonomysNavbar from '@/components/AutonomysNavbar'
import Link from 'next/link'
import { ArrowRight, FileText, MessageSquare, Zap, Link2, CheckCircle, Clock, Users } from 'lucide-react'
import { motion } from 'framer-motion'

// Metadata moved to layout.tsx for client component compatibility

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <AutonomysNavbar />
      
      {/* Hero Section - Autonomys Inspired with Animations */}
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
            
            {/* Animated Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
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
                Effizienz durch Innovation
              </motion.span>
            </motion.h1>
            
            {/* Animated Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Mit Alpha Informatik erreichen Sie Effizienz durch Innovation. Wir entwickeln KI-Lösungen, die Ihre Geschäftsprozesse automatisieren und nachhaltigen Unternehmenserfolg schaffen.
            </motion.p>
            
            {/* Animated CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
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
                  href="/loesungen"
                  className="inline-flex items-center px-8 py-3 border border-neutral-600 text-white font-semibold rounded-lg hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-300"
                >
                  Lösungen entdecken
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Animated Architecture Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
            >
              <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-neutral-800/50 backdrop-blur border border-neutral-700 rounded-xl p-6 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FileText className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                </motion.div>
                <div className="text-white font-medium mb-1">Dokumenten-Ebene</div>
                <div className="text-neutral-400 text-sm">OCR + Klassifizierung</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-neutral-800/50 backdrop-blur border border-neutral-700 rounded-xl p-6 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Zap className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
                </motion.div>
                <div className="text-white font-medium mb-1">Verarbeitungs-Ebene</div>
                <div className="text-neutral-400 text-sm">Multi-Agent Koordination</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-neutral-800/50 backdrop-blur border border-neutral-700 rounded-xl p-6 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <Link2 className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                </motion.div>
                <div className="text-white font-medium mb-1">Integrations-Ebene</div>
                <div className="text-neutral-400 text-sm">Unternehmenssysteme</div>
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

      {/* Platform Overview - Progressive Disclosure */}
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
              Enterprise Automation Platform
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Modulare KI-Architektur für skalierbare Dokumentenverarbeitung 
              und Workflow-Automatisierung in Schweizer Unternehmen
            </p>
          </motion.div>
          
          {/* Metrics Banner with Autonomys-style backdrop blur */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="text-center p-6 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
            >
              <div className="text-4xl font-bold text-white mb-2">85%</div>
              <div className="text-neutral-300">Zeitersparnis</div>
              <div className="text-sm text-neutral-400 mt-1">Durchschnittliche Verbesserung</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="text-center p-6 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
            >
              <div className="text-4xl font-bold text-white mb-2">99.2%</div>
              <div className="text-neutral-300">Präzision</div>
              <div className="text-sm text-neutral-400 mt-1">OCR Genauigkeit</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="text-center p-6 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
            >
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-neutral-300">Verfügbarkeit</div>
              <div className="text-sm text-neutral-400 mt-1">Kontinuierlicher Betrieb</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Technical Architecture - Modular Explanation */}
      <section className="py-24 bg-gradient-to-b from-black to-neutral-900">
        <div className="container-professional">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Multi-Agent Architecture
              </h2>
              <p className="text-lg text-neutral-300 mb-8">
                Dezentrale KI-Agenten arbeiten koordiniert zusammen, um komplexe 
                Dokumentenverarbeitungsaufgaben zu lösen. Jeder Agent ist spezialisiert 
                und kann unabhängig skaliert werden.
              </p>
              
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 p-4 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Document Agent</h3>
                    <p className="text-neutral-400 text-sm">Validierung, Klassifizierung und Speicherung</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 p-4 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl"
                >
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">OCR Agent</h3>
                    <p className="text-neutral-400 text-sm">Modernste KI für präzise Texterkennung</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 p-4 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl"
                >
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Chat Agent</h3>
                    <p className="text-neutral-400 text-sm">Intelligente Kundeninteraktion 24/7</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 p-4 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl"
                >
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Manager Agent</h3>
                    <p className="text-neutral-400 text-sm">Orchestrierung und Monitoring</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">System Performance</h3>
                <p className="text-neutral-400 text-sm">Live Metrics aus Produktionsumgebung</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-neutral-700/30 rounded-xl"
                >
                  <div className="text-2xl font-bold text-white">6.7s</div>
                  <div className="text-sm text-neutral-400">Durchschnittliche Verarbeitungszeit</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-neutral-700/30 rounded-xl"
                >
                  <div className="text-2xl font-bold text-white">99.8%</div>
                  <div className="text-sm text-neutral-400">System Uptime</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-neutral-700/30 rounded-xl"
                >
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-sm text-neutral-400">Dokumente täglich</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-neutral-700/30 rounded-xl"
                >
                  <div className="text-2xl font-bold text-white">48ms</div>
                  <div className="text-sm text-neutral-400">API Response Zeit</div>
                </motion.div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-neutral-700">
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">
                    <motion.div 
                      className="w-2 h-2 bg-green-400 rounded-full mr-2"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    Alle Systeme operational
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Network Overview - Autonomys Style */}
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
              Intelligente Automatisierungslösung
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Unsere intelligente Multi-Agent-Architektur automatisiert komplexe 
              Geschäftsprozesse durch spezialisierte KI-Agenten für Schweizer Unternehmen.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center p-8 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <MessageSquare className="h-8 w-8 text-blue-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-3">Chat-Agenten</h3>
              <p className="text-neutral-400">
                Intelligente Assistenten für 24/7 Kundeninteraktion und Support
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center p-8 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <Zap className="h-8 w-8 text-cyan-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-3">Workflow-Automation</h3>
              <p className="text-neutral-400">
                Automatisierte Geschäftsprozesse für maximale Effizienz
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center p-8 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <FileText className="h-8 w-8 text-emerald-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-3">OCR-Verarbeitung</h3>
              <p className="text-neutral-400">
                Präzise Texterkennung mit modernster KI für Schweizer Dokumente
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center p-8 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <Link2 className="h-8 w-8 text-purple-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-3">System-Integration</h3>
              <p className="text-neutral-400">
                Nahtlose Verbindung mit bestehenden Unternehmenssystemen
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI Evolution - Autonomys Style */}
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
              From AI 1.0 to Swiss AI 3.0
            </h2>
            <p className="text-lg text-neutral-100 max-w-3xl mx-auto">
              Wir entwickeln die nächste Generation der KI-Automatisierung: 
              Dezentral, menschenzentriert und vollständig auf Schweizer Unternehmen zugeschnitten.
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
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-400">1.0</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Traditional AI</h3>
              </div>
              <ul className="space-y-3 text-neutral-200">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Zentralisierte Systeme
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Starre Prozesse
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Begrenzte Skalierbarkeit
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-400">2.0</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Cloud AI</h3>
              </div>
              <ul className="space-y-3 text-neutral-200">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Cloud-basierte Dienste
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  API-Integration
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Vendor Lock-in
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">3.0</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Swiss AI 3.0</h3>
              </div>
              <ul className="space-y-3 text-neutral-100">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                  Multi-Agent Architektur
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                  Dezentrale Verarbeitung
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                  Swiss Data Sovereignty
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Autonomys Style */}
      <section className="py-24 bg-gradient-to-b from-neutral-900 to-black">
        <div className="container-professional text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto">
            Schließen Sie sich führenden Schweizer Unternehmen an, die bereits mit 
            AlphaAgents ihre Dokumentenverarbeitung revolutioniert haben.
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/demo"
                className="inline-flex items-center px-8 py-4 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-all duration-300"
              >
                Live Demo starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/kontakt"
                className="inline-flex items-center px-8 py-4 border border-neutral-600 text-white font-semibold rounded-lg hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-300"
              >
                Beratung anfragen
              </Link>
            </motion.div>
          </motion.div>
          
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
        </div>
      </section>
    </div>
  );
}
