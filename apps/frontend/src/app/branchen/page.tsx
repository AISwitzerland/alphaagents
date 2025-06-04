'use client'

import AutonomysNavbar from '@/components/AutonomysNavbar'
import Link from 'next/link'
import { ArrowRight, Building2, ShieldCheck, Users, CheckCircle, FileText, Clock, TrendingUp, Shield, Heart, Building, Mail, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

// Metadata moved to layout.tsx for client component compatibility

export default function BranchenPage() {
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
              <span className="text-neutral-300 text-sm font-medium">Branchenspezifische KI-Automatisierung</span>
            </motion.div>
            
            {/* Animated Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Spezialisierte{' '}
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
                Branchenlösungen
              </motion.span>
            </motion.h1>
            
            {/* Animated Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-neutral-200 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Intelligente KI-Systeme verstehen die spezifischen Anforderungen jeder Branche. Von Versicherungen bis KMU - 
              maßgeschneiderte Multi-Agent-Systeme für maximale Effizienz.
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
                  Branchen-Demo starten
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
                  Branchenberatung anfragen
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

      {/* Main Industries - Dark Theme */}
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
              Schweizer Kernbranchen
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Bewährte KI-Automatisierungssysteme für die wichtigsten Schweizer Industriezweige
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Versicherungen */}
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
                  <ShieldCheck className="h-8 w-8 text-blue-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Versicherungen</h3>
              </div>
              <p className="text-neutral-200 mb-6 text-lg">
                Spezialisierte KI-Agenten für Schadensmeldungen, Policen-Management und Risikobewertung. 
                Bewährte Lösungen für Schweizer Versicherungsunternehmen.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-blue-400 mr-3" />
                  Automatische Schadensmeldung-Verarbeitung
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-blue-400 mr-3" />
                  KI-gestützte Risikobewertung
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-blue-400 mr-3" />
                  Intelligente Policen-Verwaltung
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                  <p className="text-sm text-blue-300 font-medium">📊 75% schnellere Schadensbearbeitung</p>
                </div>
                <Link
                  href="/branchen/versicherungen"
                  className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center"
                >
                  Mehr erfahren
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.div>


            {/* KMU */}
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
                <h3 className="text-2xl font-bold text-white">KMU</h3>
              </div>
              <p className="text-neutral-200 mb-6 text-lg">
                Skalierbare KI-Automatisierung für kleine und mittlere Unternehmen. 
                Kosteneffiziente Automatisierung mit flexiblen Einstiegsmöglichkeiten.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400 mr-3" />
                  Skalierbare Agent-Konfigurationen
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400 mr-3" />
                  Kostenoptimierte Einstiegspakete
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400 mr-3" />
                  Flexible Erweiterungsmöglichkeiten
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-lg">
                  <p className="text-sm text-cyan-300 font-medium">🚀 300% ROI in 12 Monaten</p>
                </div>
                <Link
                  href="/branchen/kmu"
                  className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center"
                >
                  Mehr erfahren
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Success Stories - Dark Theme */}
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
              Erfolgsgeschichten aus der Praxis
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Schweizer Unternehmen vertrauen auf intelligente KI-Automatisierung für ihre digitale Transformation
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
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
              <div className="text-4xl font-bold text-white mb-2">150+</div>
              <div className="text-neutral-300">Schweizer Unternehmen</div>
              <div className="text-sm text-neutral-400 mt-1">Vertrauen auf KI-Automatisierung</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="text-center p-6 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
            >
              <div className="text-4xl font-bold text-white mb-2">99.8%</div>
              <div className="text-neutral-300">System-Uptime</div>
              <div className="text-sm text-neutral-400 mt-1">Enterprise-Zuverlässigkeit</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Versicherungen - Detailed Section */}
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
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 mb-8"
            >
              <Shield className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-medium">Versicherungen</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              KI für Schweizer Versicherungen
            </h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              Modernste KI-Technologie speziell für die Schweizer Versicherungsbranche. 
              Von der Schadensmeldung bis zur Risikobewertung - vollständig automatisiert.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
                <FileText className="h-8 w-8 text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Schadensmeldungen</h3>
              <p className="text-neutral-200 mb-6">
                Automatische Verarbeitung von Schadensmeldungen mit 
                intelligenter Dokumentenerkennung und Klassifizierung.
              </p>
              <ul className="text-sm text-neutral-300 space-y-3">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Automatische Schadenserfassung</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Sofortige Klassifizierung</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Intelligente Weiterleitung</li>
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
                <TrendingUp className="h-8 w-8 text-emerald-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Risikobewertung</h3>
              <p className="text-neutral-200 mb-6">
                KI-gestützte Analyse von Risikofaktoren und 
                automatische Bewertung für präzise Entscheidungen.
              </p>
              <ul className="text-sm text-neutral-300 space-y-3">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Datenanalyse in Echtzeit</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Predictive Analytics</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Automatische Empfehlungen</li>
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
                <Heart className="h-8 w-8 text-purple-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Kundenservice</h3>
              <p className="text-neutral-200 mb-6">
                24/7 intelligenter Kundenservice mit automatischer 
                Antwortgenerierung und Terminvereinbarung.
              </p>
              <ul className="text-sm text-neutral-300 space-y-3">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Sofortige Antworten</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Terminbuchung</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Mehrsprachiger Support</li>
              </ul>
            </motion.div>
          </div>

          {/* ROI Showcase for Insurance */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              💰 Versicherungs-ROI Calculator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">75%</div>
                <div className="text-neutral-300">Schnellere Schadensbearbeitung</div>
                <div className="text-sm text-neutral-400 mt-1">Durchschnittliche Zeitersparnis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">320%</div>
                <div className="text-neutral-300">ROI im ersten Jahr</div>
                <div className="text-sm text-neutral-400 mt-1">Typische Investitionsrendite</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-neutral-300">Automatisierte Verfügbarkeit</div>
                <div className="text-sm text-neutral-400 mt-1">Rund um die Uhr Service</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* KMU - Detailed Section */}
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
              className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-8"
            >
              <Building className="h-5 w-5 text-orange-400 mr-2" />
              <span className="text-orange-300 text-sm font-medium">KMU Lösungen</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Skalierbare KI für KMU
            </h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
              Kosteneffiziente KI-Automatisierung für kleine und mittlere Unternehmen. 
              Flexible Einstiegspakete mit sofortigen Effizienzgewinnen.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
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
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mr-4"
                  >
                    <Clock className="h-8 w-8 text-orange-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white">Zeitersparnis</h3>
                </div>
                <p className="text-neutral-200 mb-6">
                  Automatisierung von wiederkehrenden Aufgaben spart 
                  wertvolle Zeit für wichtigere Geschäftstätigkeiten.
                </p>
                <ul className="text-sm text-neutral-300 space-y-3">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-orange-400 mr-3" />85% weniger manuelle Arbeit</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-orange-400 mr-3" />Sofortige Dokumentenverarbeitung</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-orange-400 mr-3" />Automatische E-Mail-Bearbeitung</li>
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
                  <h3 className="text-2xl font-bold text-white">Kosteneffizienz</h3>
                </div>
                <p className="text-neutral-200 mb-6">
                  Flexible Preismodelle speziell für KMU mit 
                  schneller Amortisation der Investition.
                </p>
                <ul className="text-sm text-neutral-300 space-y-3">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-3" />Ab CHF 299/Monat</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-3" />Break-even nach 2.5 Monaten</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-3" />300% ROI pro Jahr</li>
                </ul>
              </div>
            </motion.div>

            {/* KMU Benefits Visualization */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">🚀 KMU Automatisierung</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Dokumentenverarbeitung</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-neutral-700 rounded-full h-2 mr-3">
                      <div className="bg-orange-400 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <span className="text-orange-400 font-bold">85%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">E-Mail Management</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-neutral-700 rounded-full h-2 mr-3">
                      <div className="bg-blue-400 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <span className="text-blue-400 font-bold">75%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Terminplanung</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-neutral-700 rounded-full h-2 mr-3">
                      <div className="bg-green-400 h-2 rounded-full" style={{width: '90%'}}></div>
                    </div>
                    <span className="text-green-400 font-bold">90%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Kundenanfragen</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-neutral-700 rounded-full h-2 mr-3">
                      <div className="bg-purple-400 h-2 rounded-full" style={{width: '70%'}}></div>
                    </div>
                    <span className="text-purple-400 font-bold">70%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-neutral-700">
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                  <p className="text-sm text-green-300 font-medium">💡 Durchschnittliche Zeitersparnis: 3.2 Stunden/Tag</p>
                  <p className="text-sm text-green-300">📈 Jährliche Kosteneinsparung: CHF 28,500</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* KMU Pricing Tiers */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6 text-center">
              <h4 className="text-xl font-bold text-white mb-4">Starter</h4>
              <div className="text-3xl font-bold text-orange-400 mb-2">CHF 299</div>
              <div className="text-sm text-neutral-400 mb-6">pro Monat</div>
              <ul className="text-sm text-neutral-300 space-y-2 mb-6">
                <li>• Bis 15 Mitarbeiter</li>
                <li>• Basis-Automatisierung</li>
                <li>• E-Mail Support</li>
              </ul>
              <div className="text-xs text-green-400">Ideal für kleine Teams</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-2xl p-6 text-center">
              <h4 className="text-xl font-bold text-white mb-4">Professional</h4>
              <div className="text-3xl font-bold text-orange-400 mb-2">CHF 599</div>
              <div className="text-sm text-neutral-400 mb-6">pro Monat</div>
              <ul className="text-sm text-neutral-300 space-y-2 mb-6">
                <li>• Bis 30 Mitarbeiter</li>
                <li>• Vollautomatisierung</li>
                <li>• Priority Support</li>
              </ul>
              <div className="text-xs text-orange-400">⭐ Beliebteste Option</div>
            </div>
            
            <div className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6 text-center">
              <h4 className="text-xl font-bold text-white mb-4">Enterprise</h4>
              <div className="text-3xl font-bold text-orange-400 mb-2">CHF 999</div>
              <div className="text-sm text-neutral-400 mb-6">pro Monat</div>
              <ul className="text-sm text-neutral-300 space-y-2 mb-6">
                <li>• 30+ Mitarbeiter</li>
                <li>• Maßgeschneidert</li>
                <li>• 24/7 Dedicated Support</li>
              </ul>
              <div className="text-xs text-green-400">Für wachsende Unternehmen</div>
            </div>
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
              Ihre Branche, Ihre Lösung
            </h2>
            <p className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto">
              Entdecken Sie, wie intelligente KI-Systeme speziell für Ihre Branche maßgeschneiderte 
              Automatisierungslösungen entwickelt.
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
                  Branchenspezifische Demo
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
                  Branchenberatung anfragen
                </Link>
              </motion.div>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-neutral-400 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Branchenexpertise seit 2020
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Swiss Compliance
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                24/7 Enterprise Support
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}