'use client'

import AutonomysNavbar from '@/components/AutonomysNavbar'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Users, Target, Award, Globe, Heart, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

// Metadata moved to layout.tsx for client component compatibility

export default function UeberUnsPage() {
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
              <span className="text-neutral-300 text-sm font-medium">Swiss AI Innovation Leaders</span>
            </motion.div>
            
            {/* Animated Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Über{' '}
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
                Alpha Informatik
              </motion.span>
            </motion.h1>
            
            {/* Animated Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-neutral-200 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Wir sind Pioniere der Swiss AI 3.0 Revolution. Seit 2020 entwickeln wir AlphaAgents - 
              die Multi-Agent-Plattform für Schweizer Unternehmen, die Effizienz durch Innovation definiert.
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
                  href="/kontakt"
                  className="inline-flex items-center px-8 py-3 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-all duration-300"
                >
                  Team kennenlernen
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
                  Unsere Technologie
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

      {/* Mission & Vision - Dark Theme */}
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
              Unsere Mission
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Swiss AI 3.0 für jedes Schweizer Unternehmen zugänglich machen
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
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6"
              >
                <Target className="h-8 w-8 text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Unsere Mission</h3>
              <p className="text-neutral-200 mb-6">
                Wir demokratisieren künstliche Intelligenz für Schweizer Unternehmen. AlphaAgents macht 
                Enterprise-Grade KI-Automatisierung für KMU genauso zugänglich wie für Großkonzerne.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-blue-400 mr-3" />
                  Swiss Data Sovereignty garantiert
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-blue-400 mr-3" />
                  DSGVO-konforme Lösungen
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-blue-400 mr-3" />
                  Transparente Schweizer Qualität
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ x: -10 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6"
              >
                <Globe className="h-8 w-8 text-emerald-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Unsere Vision</h3>
              <p className="text-neutral-200 mb-6">
                Die Schweiz als führende Nation im Bereich ethischer KI-Innovation zu etablieren. 
                Bis 2030 soll jedes Schweizer Unternehmen von AlphaAgents profitieren können.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mr-3" />
                  Swiss AI 3.0 Standard setzen
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mr-3" />
                  Nachhaltige Digitalisierung
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mr-3" />
                  Menschenzentrierte KI-Entwicklung
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Company Values - Dark Theme */}
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
              Unsere Werte
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Die Prinzipien, die uns bei der Entwicklung von AlphaAgents leiten
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
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <Heart className="h-8 w-8 text-purple-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-3">Menschenzentriert</h3>
              <p className="text-neutral-300">
                KI soll Menschen unterstützen, nicht ersetzen. Unsere Agenten verstärken menschliche Fähigkeiten.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="h-8 w-8 text-cyan-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-3">Vertrauenswürdig</h3>
              <p className="text-neutral-300">
                Transparenz, Sicherheit und Zuverlässigkeit sind die Grundpfeiler unserer Technologie.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <Zap className="h-8 w-8 text-green-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-3">Innovativ</h3>
              <p className="text-neutral-300">
                Wir forschen kontinuierlich an der nächsten Generation der Multi-Agent-Systeme.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <Award className="h-8 w-8 text-orange-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-3">Exzellent</h3>
              <p className="text-neutral-300">
                Swiss Quality in jedem Aspekt - von der Entwicklung bis zum Support.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Stats - Dark Theme */}
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
              Alpha Informatik in Zahlen
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Unser Wachstum und Erfolg seit der Gründung
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
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
            >
              <div className="text-4xl font-bold text-white mb-2">2020</div>
              <div className="text-neutral-300">Gründungsjahr</div>
              <div className="text-sm text-neutral-400 mt-1">Start der AlphaAgents Vision</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
            >
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-neutral-300">Zufriedene Kunden</div>
              <div className="text-sm text-neutral-400 mt-1">Schweizer Unternehmen</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
            >
              <div className="text-4xl font-bold text-white mb-2">1M+</div>
              <div className="text-neutral-300">Verarbeitete Dokumente</div>
              <div className="text-sm text-neutral-400 mt-1">Pro Monat mit AlphaAgents</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
            >
              <div className="text-4xl font-bold text-white mb-2">99.8%</div>
              <div className="text-neutral-300">Kundenzufriedenheit</div>
              <div className="text-sm text-neutral-400 mt-1">Basierend auf Feedback</div>
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
              Werden Sie Teil der Swiss AI 3.0 Revolution
            </h2>
            <p className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto">
              Entdecken Sie, wie AlphaAgents Ihr Unternehmen in die Zukunft führen kann.
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
                  Persönliches Gespräch
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/demo"
                  className="inline-flex items-center px-8 py-4 border border-neutral-600 text-white font-semibold rounded-lg hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-300"
                >
                  Live Demo erleben
                </Link>
              </motion.div>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-neutral-400 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Swiss Quality
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                DSGVO-konform
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