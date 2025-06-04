'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AutonomysNavbar from '@/components/AutonomysNavbar'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Building2, FileText, Clock, Users, TrendingUp, Mail, Phone } from 'lucide-react'

export default function KMUPage() {
  const [companySize, setCompanySize] = useState(12)
  const [adminHours, setAdminHours] = useState(3)
  const [hourlyRate, setHourlyRate] = useState(35)

  const calculateKMUROI = () => {
    const workDaysPerYear = 250
    const currentAdminCosts = adminHours * hourlyRate * workDaysPerYear
    
    let monthlySubscription = 299
    if (companySize > 15) monthlySubscription = 599
    if (companySize > 30) monthlySubscription = 999
    
    const annualSubscription = monthlySubscription * 12
    const automationEfficiency = 0.85
    const remainingAdminCosts = currentAdminCosts * (1 - automationEfficiency)
    const totalWithAlpha = annualSubscription + remainingAdminCosts
    const savings = currentAdminCosts - totalWithAlpha
    const roi = Math.round((savings / totalWithAlpha) * 100)
    const breakeven = Math.round((totalWithAlpha / savings) * 12 * 10) / 10
    const timeSaved = adminHours * automationEfficiency
    
    return {
      currentAdminCosts: Math.round(currentAdminCosts),
      totalWithAlpha: Math.round(totalWithAlpha),
      savings: Math.round(savings),
      roi: Math.max(0, roi),
      breakeven: Math.round(breakeven * 10) / 10,
      timeSaved: Math.round(timeSaved * 10) / 10
    }
  }

  const { currentAdminCosts, totalWithAlpha, savings, roi, breakeven, timeSaved } = calculateKMUROI()

  return (
    <div className="min-h-screen bg-black">
      <AutonomysNavbar />
      
      {/* Hero Section - Autonomys Style */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 to-neutral-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-xl"
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
            className="absolute bottom-20 right-10 w-48 h-48 bg-red-500/10 rounded-full blur-xl"
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
              <span className="text-neutral-300 text-sm font-medium">Swiss SME AI</span>
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
                className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Schweizer KMU
              </motion.span>
            </motion.h1>
            
            {/* Animated Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-neutral-200 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Kostengünstige und effektive AlphaAgents speziell für kleine und mittlere Unternehmen. 
              Automatisieren Sie Ihre Prozesse ohne großes IT-Budget oder komplexe Implementierungen.
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
                  KMU Demo testen
                  <Building2 className="ml-2 h-5 w-5" />
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
                  KMU-Beratung anfragen
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

      {/* KMU Challenges - Dark Theme */}
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
              Verstehen wir Ihre KMU-Herausforderungen
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Speziell entwickelt für die Bedürfnisse kleiner und mittlerer Unternehmen
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
                className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center mb-6"
              >
                <Clock className="h-8 w-8 text-red-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Zeitmangel</h3>
              <p className="text-neutral-200 mb-6">
                Kleine Teams, viele Aufgaben. Administrative Tätigkeiten fressen 
                wertvolle Zeit für das Kerngeschäft.
              </p>
              <p className="text-sm text-emerald-400 font-medium">
                ✓ 87% Zeitersparnis durch Alpha AI-Automatisierung
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6"
              >
                <Users className="h-8 w-8 text-blue-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Personalmangel</h3>
              <p className="text-neutral-200 mb-6">
                Schwierige Rekrutierung, hohe Personalkosten. 
                Automatisierung als Alternative zu zusätzlichen Mitarbeitern.
              </p>
              <p className="text-sm text-emerald-400 font-medium">
                ✓ Ersetzt 2-3 administrative Vollzeitstellen
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6"
              >
                <TrendingUp className="h-8 w-8 text-emerald-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">Kostendruck</h3>
              <p className="text-neutral-200 mb-6">
                Begrenzte Budgets für teure IT-Lösungen. 
                Bezahlbare Automatisierung mit sofortigem ROI.
              </p>
              <p className="text-sm text-emerald-400 font-medium">
                ✓ ROI bereits nach 3-4 Monaten
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* KMU Solutions - Dark Theme */}
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
              Alpha AI-Lösungen perfekt für KMU
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Sofort einsetzbar, kostengünstig und ohne IT-Kenntnisse
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
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">E-Mail Automatisierung</h3>
                    <p className="text-neutral-300 mb-4">
                      Automatische Bearbeitung eingehender E-Mails. Rechnungen, 
                      Bestellungen und Anfragen werden sofort erkannt und weitergeleitet.
                    </p>
                    <ul className="text-sm text-neutral-400 space-y-2">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-2" />Rechnungen automatisch erfassen</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-2" />Bestellungen ins System übertragen</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-2" />Kundenanfragen klassifizieren</li>
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
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Dokumenten-Verarbeitung</h3>
                    <p className="text-neutral-300 mb-4">
                      Alpha AI OCR-Erkennung für alle Geschäftsdokumente. Von Rechnungen 
                      bis Verträge - alles wird automatisch digitalisiert.
                    </p>
                    <ul className="text-sm text-neutral-400 space-y-2">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Lieferantenfaktura scannen</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Belege für Buchhaltung</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Verträge archivieren</li>
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
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Kundenbetreuung 24/7</h3>
                    <p className="text-neutral-300 mb-4">
                      Alpha AI Chat-Assistent beantwortet Kundenanfragen rund um die Uhr. 
                      Auch ohne Nachtdienst oder Wochenendbesetzung.
                    </p>
                    <ul className="text-sm text-neutral-400 space-y-2">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-2" />FAQ automatisch beantworten</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-2" />Termine vereinbaren</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-2" />Notfälle an Bereitschaft weiterleiten</li>
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
                💼 KMU Erfolgsbeispiel
              </h3>
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h4 className="font-bold text-lg text-white">Handwerksbetrieb (12 Mitarbeiter)</h4>
                  <p className="text-sm text-neutral-400">Sanitär & Heizung, Zürich</p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-neutral-700/30 p-4 rounded-lg border border-neutral-600/50">
                    <h4 className="font-semibold text-white mb-2">Vorher:</h4>
                    <ul className="text-sm text-neutral-300 space-y-1">
                      <li className="flex items-center"><span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>3 Std/Tag für Rechnungserfassung</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>Kundenanfragen nur während Bürozeiten</li>
                      <li className="flex items-center"><span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>Häufige Fehler bei manueller Eingabe</li>
                    </ul>
                  </div>
                  
                  <div className="bg-neutral-700/30 p-4 rounded-lg border border-emerald-500/30">
                    <h4 className="font-semibold text-white mb-2">Nachher:</h4>
                    <ul className="text-sm text-emerald-300 space-y-1">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />15 Min/Tag für Rechnungskontrolle</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />24/7 Kundenbetreuung per Chat</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />99.5% fehlerfreie Datenerfassung</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">CHF 35'000</div>
                  <div className="text-sm text-emerald-300">Jährliche Einsparung</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* KMU Pricing - Dark Theme */}
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
              KMU-freundliche Preisgestaltung
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Transparente Kosten ohne versteckte Gebühren
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
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Starter</h3>
              <div className="text-4xl font-bold text-blue-400 mb-2">CHF 299</div>
              <div className="text-neutral-400 mb-6">/Monat</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Bis 500 Dokumente/Monat</li>
                <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />E-Mail Automatisierung</li>
                <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Chat-Assistent</li>
                <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Standard Support</li>
              </ul>
              <Link href="/kontakt" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-center block hover:bg-blue-700 transition-colors">
                Starter wählen
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-neutral-800/30 backdrop-blur-xl border-2 border-emerald-500/50 rounded-2xl p-8 relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Beliebt
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Business</h3>
              <div className="text-4xl font-bold text-emerald-400 mb-2">CHF 599</div>
              <div className="text-neutral-400 mb-6">/Monat</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Bis 2000 Dokumente/Monat</li>
                <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Alle Automatisierungen</li>
                <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />API-Zugang</li>
                <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Priority Support</li>
              </ul>
              <Link href="/kontakt" className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg text-center block hover:bg-emerald-700 transition-colors">
                Business wählen
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
              <div className="text-4xl font-bold text-purple-400 mb-2">Individuell</div>
              <div className="text-neutral-400 mb-6">nach Bedarf</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Unbegrenzte Dokumente</li>
                <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />Maßgeschneiderte Workflows</li>
                <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />On-Premise möglich</li>
                <li className="flex items-center text-sm"><CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />24/7 Support</li>
              </ul>
              <Link href="/kontakt" className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg text-center block hover:bg-purple-700 transition-colors">
                Angebot anfragen
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ROI Calculator for KMU - Dark Theme */}
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
              Berechnen Sie Ihre KMU-Einsparungen
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Ermitteln Sie Ihr individuelles ROI-Potenzial mit unserem interaktiven Kalkulator
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">📊 KMU ROI Kalkulator</h3>
              
              {/* Unternehmensgröße Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Anzahl Mitarbeiter Ihres Unternehmens
                </label>
                <div className="relative">
                  <input 
                    type="range" 
                    min="3" 
                    max="50" 
                    value={companySize}
                    onChange={(e) => setCompanySize(parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>3</span>
                    <span>25</span>
                    <span>50</span>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-medium">{companySize} Mitarbeiter</span>
                </div>
              </div>

              {/* Admin Zeit Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Stunden/Tag für administrative Aufgaben
                </label>
                <div className="relative">
                  <input 
                    type="range" 
                    min="1" 
                    max="8" 
                    step="0.5"
                    value={adminHours}
                    onChange={(e) => setAdminHours(parseFloat(e.target.value))}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>1h</span>
                    <span>4h</span>
                    <span>8h</span>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">{adminHours} Stunden/Tag</span>
                </div>
              </div>

              {/* Stundenlohn Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Durchschnittlicher Stundenlohn (CHF)
                </label>
                <div className="relative">
                  <input 
                    type="range" 
                    min="25" 
                    max="65" 
                    step="2.5"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>CHF 25</span>
                    <span>CHF 45</span>
                    <span>CHF 65</span>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">CHF {hourlyRate}/Stunde</span>
                </div>
              </div>

              {/* Berechnungsergebnisse */}
              <div className="space-y-4 border-t border-neutral-700 pt-6 mt-8">
                <div className="flex justify-between items-center py-3">
                  <span className="text-neutral-400">Aktuelle Jahreskosten (Admin-Aufgaben)</span>
                  <span className="font-semibold text-white">CHF {currentAdminCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-neutral-400">Mit AlphaAgents + monatliche Gebühren</span>
                  <span className="font-semibold text-emerald-400">CHF {totalWithAlpha.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-t border-neutral-700">
                  <span className="text-neutral-300 font-medium">Jährliche Einsparung</span>
                  <span className="font-bold text-3xl text-emerald-400">CHF {savings.toLocaleString()}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg text-center">
                    <p className="text-sm text-green-300 font-medium">
                      💰 ROI von <span className="font-bold text-lg">{roi}%</span> im ersten Jahr
                    </p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg text-center">
                    <p className="text-sm text-blue-300 font-medium">
                      ⚡ Break-even nach <span className="font-semibold text-lg">{breakeven} Monaten</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                  <p className="text-sm text-yellow-300 text-center">
                    💡 Zeit-Ersparnis: <span className="font-semibold">{timeSaved} Stunden/Tag</span> mehr für Ihr Kerngeschäft
                  </p>
                </div>
              </div>

              <style jsx>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: #ea580c;
                  cursor: pointer;
                  border: 2px solid #ffffff;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                .slider::-moz-range-thumb {
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: #ea580c;
                  cursor: pointer;
                  border: 2px solid #ffffff;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
              `}</style>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Implementation for KMU - Dark Theme */}
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
              Einfache Implementierung in 2 Wochen
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Keine IT-Kenntnisse erforderlich - wir übernehmen alles
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
              whileHover={{ scale: 1.02 }}
              className="text-center bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-4">Kostenlose Beratung</h3>
              <p className="text-neutral-300 text-sm">
                Analyse Ihrer Prozesse und Identifikation der besten 
                Automatisierungsmöglichkeiten.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="text-center bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold text-emerald-400">2</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-4">Setup & Integration</h3>
              <p className="text-neutral-300 text-sm">
                Wir richten alles ein und integrieren mit Ihren 
                bestehenden Systemen (E-Mail, Buchhaltung).
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="text-center bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6"
            >
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold text-purple-400">3</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-4">Schulung & Test</h3>
              <p className="text-neutral-300 text-sm">
                Umfassende Schulung Ihres Teams und ausgiebige 
                Tests mit Ihren echten Daten.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="text-center bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6"
            >
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold text-orange-400">4</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-4">Go-Live & Support</h3>
              <p className="text-neutral-300 text-sm">
                Produktiver Betrieb mit kontinuierlichem 
                Support und Optimierung.
              </p>
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
              Bereit für den nächsten Schritt?
            </h2>
            <p className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto">
              Starten Sie noch heute mit einer kostenlosen Prozessanalyse für Ihr KMU
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
                  Kostenlose Demo für KMU
                  <Building2 className="ml-2 h-5 w-5" />
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
                  KMU-Beratung buchen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-neutral-400 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Swiss SME Expertise
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Kostenlose Beratung
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Sofortiger ROI
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}