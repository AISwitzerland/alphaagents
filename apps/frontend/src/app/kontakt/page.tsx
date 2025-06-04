'use client'

import AutonomysNavbar from '@/components/AutonomysNavbar'
import ContactForm from '@/components/ContactForm'
import Link from 'next/link'
import { ArrowRight, MapPin, Phone, Mail, Clock, CheckCircle, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

// Metadata moved to layout.tsx for client component compatibility

export default function KontaktPage() {
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
              <span className="text-neutral-300 text-sm font-medium">Expertenberatung</span>
            </motion.div>
            
            {/* Animated Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Kostenlose{' '}
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
                KI-Beratung
              </motion.span>
            </motion.h1>
            
            {/* Animated Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-neutral-200 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Sprechen Sie mit unseren Experten. Kostenlose Erstberatung, 
              maßgeschneiderte Lösungen und Live-Demo Ihrer Multi-Agent-Automatisierung.
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
                <button
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center px-8 py-3 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-all duration-300"
                >
                  Kontaktformular öffnen
                  <Mail className="ml-2 h-5 w-5" />
                </button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="https://wa.me/41783406665?text=Hallo%2C%20ich%20interessiere%20mich%20für%20Alpha%20Informatik%20und%20hätte%20gerne%20weitere%20Informationen."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-3 border border-neutral-600 text-white font-semibold rounded-lg hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-300"
                >
                  WhatsApp schreiben
                  <MessageCircle className="ml-2 h-5 w-5" />
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

      {/* Trust Indicators - Dark Theme */}
      <section className="py-16 bg-gradient-to-b from-neutral-900 to-black">
        <div className="container-professional">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-8">
              Warum unser Team wählen?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="text-center p-6 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
              >
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="font-bold text-white mb-2">Schweizer Expertise</h4>
                <p className="text-neutral-300 text-sm">
                  Lokale Experten mit tiefem Verständnis für Schweizer Geschäftsprozesse
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="text-center p-6 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
              >
                <CheckCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h4 className="font-bold text-white mb-2">Bewährte Erfolge</h4>
                <p className="text-neutral-300 text-sm">
                  150+ erfolgreich implementierte Systeme
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="text-center p-6 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
              >
                <CheckCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h4 className="font-bold text-white mb-2">Kostenlose Beratung</h4>
                <p className="text-neutral-300 text-sm">
                  Unverbindliche Erstberatung und maßgeschneiderte Lösungsvorschläge
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information & Form - Dark Theme */}
      <section className="py-24 bg-gradient-to-b from-neutral-900 to-black">
        <div className="container-professional">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-8">
                Sprechen Sie mit Experten
              </h2>
              <p className="text-lg text-neutral-300 mb-12">
                Unser Team besteht aus KI-Spezialisten, die bereits über 150 Schweizer Unternehmen 
                bei der erfolgreichen Implementierung von Alpha Informatik unterstützt haben.
              </p>
              
              <div className="space-y-8">
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 p-4 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl"
                >
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">E-Mail Kontakt</h3>
                    <p className="text-neutral-400 text-sm mb-2">Antwort innerhalb von 2 Stunden</p>
                    <Link 
                      href="mailto:info@alphainformatik.ch"
                      className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                      info@alphainformatik.ch
                    </Link>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 p-4 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl"
                >
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Telefon</h3>
                    <p className="text-neutral-400 text-sm mb-2">Mo-Fr, 8:00-18:00 Uhr</p>
                    <Link 
                      href="tel:+41783406665"
                      className="text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      +41 78 340 66 65
                    </Link>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 p-4 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl"
                >
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Standort</h3>
                    <p className="text-neutral-400 text-sm mb-2">Hauptsitz Zürich</p>
                    <p className="text-purple-400">
                      Zürich, Schweiz
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 p-4 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl"
                >
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Antwortzeit</h3>
                    <p className="text-neutral-400 text-sm mb-2">Garantiert schnelle Reaktion</p>
                    <p className="text-cyan-400">
                      E-Mail: {"<"} 2 Stunden<br />
                      Telefon: Sofort
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
              id="contact-form"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                Kostenlose Erstberatung anfragen
              </h3>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}