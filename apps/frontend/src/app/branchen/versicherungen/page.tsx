'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AutonomysNavbar from '@/components/AutonomysNavbar'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Shield, FileText, Users, Clock, TrendingUp, Heart, Building } from 'lucide-react'

export default function VersicherungenPage() {
  const [employees, setEmployees] = useState(5)
  const [salary, setSalary] = useState(80000)
  const [documents, setDocuments] = useState(200)

  const calculateROI = () => {
    const currentCosts = employees * salary
    const alphaSystemCosts = 40000
    const reducedPersonnelCosts = Math.max(1, Math.ceil(employees * 0.2)) * salary
    const withAlphaCosts = alphaSystemCosts + reducedPersonnelCosts
    const savings = currentCosts - withAlphaCosts
    const roi = Math.round((savings / withAlphaCosts) * 100)
    const breakeven = Math.round((withAlphaCosts / savings) * 12 * 10) / 10
    
    return {
      currentCosts,
      withAlphaCosts,
      savings,
      roi: Math.max(0, roi),
      breakeven
    }
  }

  const { currentCosts, withAlphaCosts, savings, roi, breakeven } = calculateROI()

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
              <span className="text-neutral-300 text-sm font-medium">Swiss Insurance AI</span>
            </motion.div>
            
            {/* Animated Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Alpha AI für{' '}
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
                Versicherungen
              </motion.span>
            </motion.h1>
            
            {/* Animated Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-neutral-200 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Spezialisierte AlphaAgents für UVG, KVG und AHV. Automatisieren Sie 
              Schadenmeldungen, Dokumentenverarbeitung und Kundenbetreuung mit modernster Alpha AI.
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
                  UVG Demo testen
                  <Shield className="ml-2 h-5 w-5" />
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
                  Versicherungs-Beratung
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

      {/* Insurance Types - Dark Theme */}
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
              Schweizer Versicherungsexpertise
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Tiefes Verständnis für alle Schweizer Versicherungszweige und -prozesse
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
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <Shield className="h-8 w-8 text-blue-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-4">UVG Unfallversicherung</h3>
              <p className="text-neutral-300">
                Unfallversicherung, Arbeitsunfälle, UVG-Formulare und Rehabilitationsmanagement
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <Heart className="h-8 w-8 text-red-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-4">KVG & Krankenkassen</h3>
              <p className="text-neutral-300">
                Krankenversicherung, Leistungsabrechnungen und Kostengutsprachen
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <Users className="h-8 w-8 text-emerald-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-4">AHV & Pensionskassen</h3>
              <p className="text-neutral-300">
                Sozialversicherung, Rentenberechnungen und Vorsorgeplanung
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-6"
              >
                <Building className="h-8 w-8 text-purple-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-4">Privatversicherungen</h3>
              <p className="text-neutral-300">
                Lebens-, Sach- und Haftpflichtversicherungen für Privatkunden
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases - Dark Theme */}
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
              Alpha AI Anwendungsfälle
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Automatisierung entlang der gesamten Versicherungs-Wertschöpfungskette
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">UVG Unfallmeldungen</h3>
                    <p className="text-neutral-300 mb-4">
                      Automatische Erkennung und Verarbeitung von UVG-Formularen. 
                      Extraktion von Unfalldaten, Diagnosen und Behandlungskosten.
                    </p>
                    <ul className="text-sm text-neutral-400 space-y-2">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-red-400 mr-2" />Unfallmeldung UVG (Form 1)</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-red-400 mr-2" />Arztrechnungen und Spitalberichte</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-red-400 mr-2" />Arbeitsunfähigkeitszeugnisse</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Krankenversicherung KVG</h3>
                    <p className="text-neutral-300 mb-4">
                      Intelligente Verarbeitung von Krankenversicherungsanträgen, 
                      Leistungsabrechnungen und Kostengutsprachen.
                    </p>
                    <ul className="text-sm text-neutral-400 space-y-2">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-2" />Versicherungsanträge</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-2" />Leistungsabrechnungen</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-2" />Kostengutsprachen</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Schadenmeldungen</h3>
                    <p className="text-neutral-300 mb-4">
                      Automatische Klassifizierung und Weiterleitung von Schadenmeldungen 
                      an die zuständigen Sachbearbeiter.
                    </p>
                    <ul className="text-sm text-neutral-400 space-y-2">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Sachschäden (Fahrzeuge, Gebäude)</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Haftpflichtschäden</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Reiseversicherungsschäden</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                UVG Workflow Beispiel
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">E-Mail Eingang</h4>
                    <p className="text-sm text-neutral-400">UVG-Formular als PDF-Anhang</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Alpha AI Erkennung</h4>
                    <p className="text-sm text-neutral-400">Alpha AI analysiert das Formular</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Datenextraktion</h4>
                    <p className="text-sm text-neutral-400">Unfalldatum, Versichertennr., Diagnose</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Automatische Erfassung</h4>
                    <p className="text-sm text-neutral-400">Daten werden ins Fallmanagement-System übertragen</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Sachbearbeiter Info</h4>
                    <p className="text-sm text-neutral-400">Zuständiger Mitarbeiter erhält strukturierte Zusammenfassung</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-300 font-medium text-center">
                  ⏱️ Zeitersparnis: Von 45 Minuten auf 90 Sekunden
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits for Insurance - Dark Theme */}
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
              Vorteile für Versicherungsunternehmen
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Messbare Verbesserungen in allen Kernbereichen
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">92% Schnellere Bearbeitung</h3>
              <p className="text-neutral-300">
                Schadenmeldungen werden in Minuten statt Stunden bearbeitet. 
                Kunden erhalten schnellere Rückmeldungen und Auszahlungen.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">99.7% Compliance Rate</h3>
              <p className="text-neutral-300">
                Automatische Einhaltung aller Schweizer Versicherungsvorschriften 
                und Datenschutzbestimmungen.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">87% Kostenreduktion</h3>
              <p className="text-neutral-300">
                Weniger Personal für Routineaufgaben. Mitarbeiter können sich 
                auf komplexe Fälle und Kundenberatung konzentrieren.
              </p>
            </motion.div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Verbesserte Kundenzufriedenheit</h3>
                  <p className="text-neutral-300">
                    24/7 verfügbare Kundenbetreuung mit sofortigen Antworten 
                    auf Standardfragen und schnellere Schadensabwicklung.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Weniger Bearbeitungsfehler</h3>
                  <p className="text-neutral-300">
                    Alpha AI eliminiert menschliche Eingabefehler und sorgt für 
                    konsistente, genaue Datenerfassung bei allen Dokumenten.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Skalierbare Kapazitäten</h3>
                  <p className="text-neutral-300">
                    Automatische Skalierung bei Spitzenzeiten ohne zusätzliche 
                    Personalkosten oder Wartezeiten für Kunden.
                  </p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">📊 Alpha AI ROI Kalkulator</h3>
              
              {/* Anzahl Mitarbeiter Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Anzahl Mitarbeiter für Dokumentenverarbeitung
                </label>
                <div className="relative">
                  <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    value={employees}
                    onChange={(e) => setEmployees(parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>1</span>
                    <span>10</span>
                    <span>20</span>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">{employees} Mitarbeiter</span>
                </div>
              </div>

              {/* Durchschnittslohn Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Durchschnittslohn pro Mitarbeiter (CHF/Jahr)
                </label>
                <div className="relative">
                  <input 
                    type="range" 
                    min="60000" 
                    max="120000" 
                    step="5000"
                    value={salary}
                    onChange={(e) => setSalary(parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>CHF 60k</span>
                    <span>CHF 90k</span>
                    <span>CHF 120k</span>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium">CHF {salary.toLocaleString()}/Jahr</span>
                </div>
              </div>

              {/* Dokumentenvolumen Slider */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Dokumente pro Tag
                </label>
                <div className="relative">
                  <input 
                    type="range" 
                    min="50" 
                    max="1000" 
                    step="50"
                    value={documents}
                    onChange={(e) => setDocuments(parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>50</span>
                    <span>500</span>
                    <span>1000</span>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">{documents} Dokumente/Tag</span>
                </div>
              </div>

              {/* Berechnungsergebnisse */}
              <div className="space-y-4 border-t border-neutral-700 pt-6">
                <div className="flex justify-between items-center py-3">
                  <span className="text-neutral-400">Aktuelle Personalkosten</span>
                  <span className="font-semibold text-white">CHF {currentCosts.toLocaleString()}/Jahr</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-neutral-400">Mit AlphaAgents (1 FTE + System)</span>
                  <span className="font-semibold text-emerald-400">CHF {withAlphaCosts.toLocaleString()}/Jahr</span>
                </div>
                <div className="flex justify-between items-center py-3 border-t border-neutral-700">
                  <span className="text-neutral-300 font-medium">Jährliche Einsparung</span>
                  <span className="font-bold text-2xl text-emerald-400">CHF {savings.toLocaleString()}</span>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                  <p className="text-sm text-green-300 text-center font-medium">
                    💡 ROI von <span className="font-bold">{roi}%</span> bereits im ersten Jahr
                  </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                  <p className="text-xs text-blue-300 text-center">
                    💡 Break-even nach nur <span className="font-semibold">{breakeven} Monaten</span>
                  </p>
                </div>
              </div>

              <style jsx>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: #3b82f6;
                  cursor: pointer;
                  border: 2px solid #ffffff;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                .slider::-moz-range-thumb {
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: #3b82f6;
                  cursor: pointer;
                  border: 2px solid #ffffff;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
              `}</style>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Success - Dark Theme */}
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
              Alpha AI Erfolgsgeschichten
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Schweizer Versicherungsunternehmen vertrauen auf AlphaAgents
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mr-4">
                  <Building className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Mittelständische Versicherung</h3>
                  <p className="text-sm text-neutral-400">UVG & Sachversicherung</p>
                </div>
              </div>
              <p className="text-neutral-300 mb-6">
                "Mit Alpha AI haben wir unsere SUVA-Bearbeitung um 94% beschleunigt. 
                Was früher Stunden dauerte, erledigt die KI in wenigen Minuten."
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">94%</div>
                  <div className="text-xs text-neutral-400">Zeitersparnis</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">98%</div>
                  <div className="text-xs text-neutral-400">Genauigkeit</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">CHF 180k</div>
                  <div className="text-xs text-neutral-400">Jährliche Einsparung</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4">
                  <Heart className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Regionale Krankenkasse</h3>
                  <p className="text-sm text-neutral-400">KVG & Zusatzversicherungen</p>
                </div>
              </div>
              <p className="text-neutral-300 mb-6">
                "Die automatische Klassifizierung von Krankenversicherungsanträgen 
                hat unsere Bearbeitungszeit halbiert und die Kundenzufriedenheit erhöht."
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">50%</div>
                  <div className="text-xs text-neutral-400">Schneller</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">96%</div>
                  <div className="text-xs text-neutral-400">Kundenzufriedenheit</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">24/7</div>
                  <div className="text-xs text-neutral-400">Service</div>
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
              Alpha AI für Ihre Versicherungsprozesse
            </h2>
            <p className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto">
              Testen Sie AlphaAgents kostenlos mit Ihren eigenen UVG-Formularen und Dokumenten
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
                  UVG Demo starten
                  <Shield className="ml-2 h-5 w-5" />
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
                  Versicherungs-Experten kontaktieren
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-neutral-400 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Swiss Compliance
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                UVG/KVG Expertise
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