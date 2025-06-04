'use client'

import { motion } from 'framer-motion'
import AutonomysNavbar from '@/components/AutonomysNavbar'
import Link from 'next/link'
import { ArrowRight, CheckCircle, MessageCircle, Brain, Clock, Users, Zap, Shield, Calendar, Phone } from 'lucide-react'

export default function ChatAssistentenPage() {
  return (
    <div className="min-h-screen bg-black">
      <AutonomysNavbar />
      
      {/* Hero Section - Autonomys Style */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 to-neutral-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl"
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
            className="absolute bottom-20 right-10 w-48 h-48 bg-green-500/10 rounded-full blur-xl"
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
              <span className="text-neutral-300 text-sm font-medium">Alpha AI Chat-Agent</span>
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
                className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Chat-Assistenten
              </motion.span>
            </motion.h1>
            
            {/* Animated Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-neutral-200 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Revolutionäre Chat-Technologie mit Alpha AI für Schweizer Unternehmen. 
              24/7 verfügbar, intelligent und spezialisiert auf Versicherungsthemen.
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
                  Live Demo testen
                  <MessageCircle className="ml-2 h-5 w-5" />
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
                  Chat-Lösung anfragen
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

      {/* Core Features - Dark Theme */}
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
              Alpha AI Powered Kundenbetreuung
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Enterprise-Grade KI-Technologie für überlegene Kundenerfahrungen
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
                <Brain className="h-8 w-8 text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Alpha Chat Intelligence</h3>
              <p className="text-neutral-200 mb-6">
                Unsere proprietäre KI-Technologie für natürliche Gespräche und 
                intelligente Antworten auf komplexe Versicherungsfragen.
              </p>
              <ul className="text-sm text-neutral-300 space-y-3">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Natürliche Sprachverarbeitung</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Kontextuelle Antworten</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-3" />Mehrsprachig (DE/FR/IT/EN)</li>
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
                <Clock className="h-8 w-8 text-emerald-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">24/7 Verfügbarkeit</h3>
              <p className="text-neutral-200 mb-6">
                Ihre Kunden erhalten rund um die Uhr professionelle Betreuung. 
                Keine Wartezeiten, keine Geschäftszeiten-Beschränkungen.
              </p>
              <ul className="text-sm text-neutral-300 space-y-3">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Sofortige Antworten</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Keine Wartezeiten</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Wochenend-Service</li>
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
                <Shield className="h-8 w-8 text-purple-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Versicherungs-Expertise</h3>
              <p className="text-neutral-200 mb-6">
                Spezialisiert auf Schweizer Versicherungsthemen wie Unfallversicherung, 
                Krankenversicherung und Sozialversicherung. Präzise Antworten zu komplexen Fachfragen.
              </p>
              <ul className="text-sm text-neutral-300 space-y-3">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Unfallversicherung Expertise</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Kranken- & Sozialversicherung</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-3" />Schweizer Recht</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Chat Functions - Dark Theme */}
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
              Vielseitige Chat-Funktionen
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Von FAQ bis Terminbuchung - alles in einem intelligenten System
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <div className="space-y-8">
              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-start space-x-4 p-4 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">FAQ & Kundenberatung</h3>
                  <p className="text-neutral-300">
                    Automatische Beantwortung häufiger Fragen zu Versicherungspolicen, 
                    Leistungen und Verfahren mit personalisierten, präzisen Antworten.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-start space-x-4 p-4 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Terminbuchung</h3>
                  <p className="text-neutral-300">
                    Intelligente Kalender-Integration für automatische Terminvereinbarungen. 
                    Berücksichtigt Verfügbarkeiten und Präferenzen beider Seiten.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-start space-x-4 p-4 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl"
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Lead-Qualifizierung</h3>
                  <p className="text-neutral-300">
                    Intelligente Erfassung von Kundenbedürfnissen und automatische 
                    Weiterleitung an den passenden Berater oder Spezialisten.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 10 }}
                className="flex items-start space-x-4 p-4 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl"
              >
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Eskalations-Management</h3>
                  <p className="text-neutral-300">
                    Automatische Erkennung komplexer Anfragen und nahtlose Weiterleitung 
                    an menschliche Experten mit vollständigem Gesprächskontext.
                  </p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Chat-Interface Demo</h3>
              <div className="bg-neutral-900/50 rounded-lg p-4 space-y-4 max-h-96 overflow-y-auto">
                <div className="flex justify-start">
                  <div className="bg-neutral-800 px-4 py-2 rounded-lg shadow-sm max-w-xs">
                    <p className="text-sm text-neutral-200">
                      Hallo! Ich bin Ihr AlphaAgents Assistent. Wie kann ich Ihnen helfen?
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg max-w-xs">
                    <p className="text-sm">
                      Ich hätte eine Frage zu meiner Unfallversicherung
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-neutral-800 px-4 py-2 rounded-lg shadow-sm max-w-xs">
                    <p className="text-sm text-neutral-200">
                      Gerne helfe ich Ihnen bei Ihrer Unfallversicherungs-Frage! Um Ihnen bestmöglich zu helfen, können Sie mir mehr Details zu Ihrem Anliegen mitteilen?
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg max-w-xs">
                    <p className="text-sm">
                      Ich möchte einen Arbeitsunfall melden
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-neutral-800 px-4 py-2 rounded-lg shadow-sm max-w-xs">
                    <p className="text-sm text-neutral-200">
                      Ich verstehe, Sie möchten einen Arbeitsunfall melden. Das kann ich für Sie koordinieren! Hier ist was wir benötigen...
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-300 font-medium">
                  💡 Echte Konversationen mit kontextuellem Verständnis
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits - Dark Theme */}
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
              Messbare Vorteile für Ihr Unternehmen
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Konkrete Verbesserungen in Effizienz und Kundenzufriedenheit
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6"
            >
              <div className="text-3xl font-bold text-blue-400 mb-2">87%</div>
              <h3 className="font-bold text-white mb-2">Kostenreduktion</h3>
              <p className="text-sm text-neutral-400">Weniger Personal für Kundenbetreuung</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6"
            >
              <div className="text-3xl font-bold text-emerald-400 mb-2">24/7</div>
              <h3 className="font-bold text-white mb-2">Verfügbarkeit</h3>
              <p className="text-sm text-neutral-400">Rund um die Uhr Service</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6"
            >
              <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
              <h3 className="font-bold text-white mb-2">Kundenzufriedenheit</h3>
              <p className="text-sm text-neutral-400">Sofortige, präzise Antworten</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6"
            >
              <div className="text-3xl font-bold text-orange-400 mb-2">73%</div>
              <h3 className="font-bold text-white mb-2">Mehr Conversions</h3>
              <p className="text-sm text-neutral-400">Bessere Lead-Qualifizierung</p>
            </motion.div>
          </motion.div>
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
              Revolutionieren Sie Ihre Kundenbetreuung!
            </h2>
            <p className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto">
              Starten Sie mit unserem intelligenten Chat-Assistenten und begeistern Sie Ihre Kunden
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
                  Live Chat Demo
                  <MessageCircle className="ml-2 h-5 w-5" />
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
                  Persönliche Beratung
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