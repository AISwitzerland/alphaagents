'use client'

import AutonomysNavbar from '@/components/AutonomysNavbar'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DemoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    accessCode: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Demo access codes
  const validCodes = ['Test123', 'Demo123', 'Alpha123', 'Preview123']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
    if (!formData.company || !formData.email || !formData.accessCode) {
      setError('Bitte füllen Sie alle Felder aus.')
      setLoading(false)
      return
    }

    // Check demo access code
    if (!validCodes.includes(formData.accessCode)) {
      setError('Ungültiger Zugangscode. Bitte kontaktieren Sie uns für einen Zugang.')
      setLoading(false)
      return
    }

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Store demo session
    localStorage.setItem('demoUser', JSON.stringify({
      company: formData.company,
      email: formData.email,
      loginTime: new Date().toISOString()
    }))

    // Redirect to dashboard
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black">
      <AutonomysNavbar />
      
      {/* Header - Dark Theme */}
      <section className="py-24 bg-gradient-to-b from-neutral-950 to-neutral-900">
        <div className="container-professional">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center mb-8"
          >
            <Link 
              href="/"
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Zurück zur Homepage
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Live Demo
              </span>
            </h1>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto mb-8">
              Testen Sie unsere Multi-Agent-KI-Automatisierung direkt in Ihrem Browser. 
              Erleben Sie, wie unser KI-System Ihre Dokumente verarbeitet und intelligente Antworten generiert. 
              Zugang erhalten Sie durch ein unverbindliches Erstgespräch mit unserem Team.
            </p>
            
            {/* Demo Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center justify-center space-x-2 text-green-400"
              >
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">OCR-Agent Live Test</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center justify-center space-x-2 text-blue-400"
              >
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Chat-Agent Interaktion</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center justify-center space-x-2 text-purple-400"
              >
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Real-Time Processing</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Performance & Login - Side by Side */}
      <section className="py-16 bg-gradient-to-b from-neutral-900 to-black">
        <div className="container-professional">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Demo Performance */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Live Demo Performance
              </h2>
              <p className="text-lg text-neutral-300 mb-8">
                Echte Metriken aus unserer Demo-Umgebung - so performant ist unser System in der Praxis
              </p>
              
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
                >
                  <div className="text-3xl font-bold text-blue-400 mb-2">6.7s</div>
                  <div className="text-white font-medium">OCR Processing</div>
                  <div className="text-sm text-neutral-400 mt-1">Durchschnittliche Zeit</div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
                >
                  <div className="text-3xl font-bold text-emerald-400 mb-2">99.2%</div>
                  <div className="text-white font-medium">Genauigkeit</div>
                  <div className="text-sm text-neutral-400 mt-1">DE/CH Dokumente</div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
                >
                  <div className="text-3xl font-bold text-purple-400 mb-2">{"<"}2s</div>
                  <div className="text-white font-medium">Chat Response</div>
                  <div className="text-sm text-neutral-400 mt-1">Agent-Antwortzeit</div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl"
                >
                  <div className="text-3xl font-bold text-cyan-400 mb-2">24/7</div>
                  <div className="text-white font-medium">Verfügbarkeit</div>
                  <div className="text-sm text-neutral-400 mt-1">Demo-System</div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right: Customer Login */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  🔐 Kundenbereich Zugang
                </h2>
                <p className="text-neutral-300 mb-8 text-center">
                  Melden Sie sich an, um Zugang zum vollständigen KI-Dashboard 
                  mit Live OCR-Processing und Management-Tools zu erhalten.
                </p>
                
                <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <h4 className="font-semibold text-amber-300 mb-2">Individueller Zugang:</h4>
                  <p className="text-sm text-amber-200">
                    Benötigen Sie einen personalisierten Demo-Zugang für Ihr Unternehmen?
                  </p>
                  <Link 
                    href="/kontakt"
                    className="inline-block mt-2 text-amber-300 hover:text-amber-200 underline text-sm"
                  >
                    Jetzt Demo-Zugang anfordern →
                  </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-neutral-300 mb-2">
                      Unternehmen
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ihr Unternehmen"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                      E-Mail-Adresse
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ihre.email@unternehmen.ch"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="access-code" className="block text-sm font-medium text-neutral-300 mb-2">
                      Demo-Zugangscode
                    </label>
                    <input
                      type="password"
                      id="access-code"
                      name="accessCode"
                      value={formData.accessCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Zugangscode eingeben..."
                      disabled={loading}
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Anmelden...' : 'Dashboard öffnen'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark Theme */}
      <section className="py-16 bg-gradient-to-b from-neutral-900 to-black">
        <div className="container-professional text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Überzeugt von unserer Lösung?
            </h2>
            <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
              Erleben Sie, wie unser KI-System Ihre Geschäftsprozesse revolutionieren kann. 
              Kontaktieren Sie uns für eine maßgeschneiderte Implementierung.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/kontakt"
                  className="inline-flex items-center px-8 py-4 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-100 transition-all duration-300"
                >
                  Jetzt Beratung anfragen
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/loesungen"
                  className="inline-flex items-center px-8 py-4 border border-neutral-600 text-white font-semibold rounded-lg hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-300"
                >
                  Alle Lösungen entdecken
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}