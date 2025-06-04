'use client'

import AutonomysNavbar from '@/components/AutonomysNavbar'
import Link from 'next/link'
import { ArrowRight, CheckCircle, TrendingUp, Clock, Shield, Zap, Users, Target, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

// Metadata moved to layout.tsx for client component compatibility

export default function VorteilePage() {
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
              <span className="text-neutral-300 text-sm font-medium">Alpha Informatik - Effizienz durch Innovation</span>
            </motion.div>
            
            {/* Animated Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Warum{' '}
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
                Alpha Informatik?
              </motion.span>
            </motion.h1>
            
            {/* Animated Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-neutral-200 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Messbare Vorteile durch sichere und modernste Multi-Agent-Technologie. Steigern Sie Effizienz, 
              reduzieren Sie Kosten und verschaffen Sie sich den entscheidenden Wettbewerbsvorteil.
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
                  Beratung Vereinbaren
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
                  Kostenlose Analyse
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

      {/* Key Benefits - Dark Theme */}
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
              Unternehmenszertifizierte Vorteile
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Messbare Verbesserungen durch sichere Multi-Agent-Architektur
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
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <TrendingUp className="h-8 w-8 text-green-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-4">85% Effizienzsteigerung</h3>
              <p className="text-neutral-300 mb-4">
                Durchschnittliche Produktivitätssteigerung durch intelligente Automatisierung
              </p>
              <div className="text-sm text-green-400 font-medium">
                Messbar in 4-6 Wochen
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <Clock className="h-8 w-8 text-blue-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-4">24/7 Verfügbarkeit</h3>
              <p className="text-neutral-300 mb-4">
                Kontinuierliche Bearbeitung ohne Pause oder Urlaubstage
              </p>
              <div className="text-sm text-blue-400 font-medium">
                99.8% Uptime garantiert
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <Shield className="h-8 w-8 text-purple-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-4">99.2% Präzision</h3>
              <p className="text-neutral-300 mb-4">
                Höchste Genauigkeit durch sichere und modernste Technologie bei der Dokumentenverarbeitung
              </p>
              <div className="text-sm text-purple-400 font-medium">
                Validiert durch 10.000+ Dokumente
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <BarChart3 className="h-8 w-8 text-cyan-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-4">280% ROI</h3>
              <p className="text-neutral-300 mb-4">
                Return on Investment im ersten Jahr durch Kosteneinsparungen
              </p>
              <div className="text-sm text-cyan-400 font-medium">
                Amortisation in 3-4 Monaten
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <Zap className="h-8 w-8 text-emerald-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-4">6.7s Verarbeitung</h3>
              <p className="text-neutral-300 mb-4">
                Durchschnittliche Bearbeitungszeit pro Dokument
              </p>
              <div className="text-sm text-emerald-400 font-medium">
                10x schneller als manuell
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <Users className="h-8 w-8 text-orange-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-4">Mitarbeiter-Entlastung</h3>
              <p className="text-neutral-300 mb-4">
                Teams können sich auf strategische Aufgaben konzentrieren
              </p>
              <div className="text-sm text-orange-400 font-medium">
                95% weniger Routine-Arbeit
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Competitive Advantages - Dark Theme */}
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
              Swiss AI 3.0 Advantage
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Was Alpha Informatik von traditionellen Anbietern unterscheidet
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
              whileHover={{ x: 10 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Traditionelle Lösungen</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 border-2 border-red-400 rounded mr-4 mt-1 flex-shrink-0"></div>
                  <div className="text-neutral-300">Monolithische Systeme ohne Flexibilität</div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 border-2 border-red-400 rounded mr-4 mt-1 flex-shrink-0"></div>
                  <div className="text-neutral-300">Vendor Lock-in und Abhängigkeiten</div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 border-2 border-red-400 rounded mr-4 mt-1 flex-shrink-0"></div>
                  <div className="text-neutral-300">Lange Implementierungszeiten (6-12 Monate)</div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 border-2 border-red-400 rounded mr-4 mt-1 flex-shrink-0"></div>
                  <div className="text-neutral-300">Begrenzte Anpassungsmöglichkeiten</div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 border-2 border-red-400 rounded mr-4 mt-1 flex-shrink-0"></div>
                  <div className="text-neutral-300">Hohe laufende Lizenzkosten</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ x: -10 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Alpha Informatik Lösung</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                  <div className="text-neutral-200">Multi-Agent-Architektur für maximale Flexibilität</div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
              <div className="text-neutral-200">Schweizer Datenschutz - Höchste Sicherheitsstandards für Ihre Daten</div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                  <div className="text-neutral-200">Rapid Deployment in 4-6 Wochen</div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                  <div className="text-neutral-200">Vollständig anpassbare Agent-Konfiguration</div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                  <div className="text-neutral-200">Transparente Preisgestaltung ohne versteckte Kosten</div>
                </div>
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
              Ready to Experience the Difference?
            </h2>
            <p className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto">
              Lassen Sie uns Ihnen zeigen, wie Alpha Informatik Ihr Unternehmen sicher transformieren kann.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/kontakt"
                  className="inline-flex items-center px-8 py-4 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-all duration-300"
                >
                  Termin vereinbaren
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