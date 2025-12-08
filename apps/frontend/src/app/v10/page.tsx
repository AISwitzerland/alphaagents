'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'
import { 
  Brain, 
  Shield, 
  FileSearch, 
  Zap, 
  Globe as GlobeIcon, 
  Building2,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Sparkles
} from 'lucide-react'
import { LampContainer } from '@/components/ui/lamp'
import { Globe } from '@/components/ui/globe'
import { BorderBeam } from '@/components/ui/border-beam'
import { NumberTicker } from '@/components/ui/number-ticker'
import { FloatingElements, GridBackground } from '@/components/ui/floating-elements'
import { TiltCard } from '@/components/ui/tilt-card'
import { ParticlesBackground } from '@/components/ui/particles-bg'

export default function V10Page() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 text-white overflow-x-hidden relative">
      {/* Global Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <GridBackground />
        <ParticlesBackground count={40} />
      </div>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Alpha Informatik</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#solutions" className="text-sm text-white/60 hover:text-white transition-colors">Lösungen</a>
            <a href="#about" className="text-sm text-white/60 hover:text-white transition-colors">Über uns</a>
            <a href="#stats" className="text-sm text-white/60 hover:text-white transition-colors">Referenzen</a>
            <a href="#contact" className="text-sm text-white/60 hover:text-white transition-colors">Kontakt</a>
          </div>

          <Link 
            href="#contact" 
            className="hidden md:flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            <span>Beratung anfragen</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section with Lamp Effect */}
      <LampContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-white/70">Schweizer Qualität seit 2020</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            Enterprise AI
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              für die Schweiz
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Wir automatisieren Ihre Geschäftsprozesse mit modernster KI-Technologie. 
            Datenschutzkonform. Sicher. Made in Zürich.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="#contact" 
              className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
            >
              <span>Kostenloses Erstgespräch</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="#solutions" 
              className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-semibold transition-all"
            >
              <span>Unsere Lösungen</span>
            </Link>
          </div>
        </motion.div>
      </LampContainer>

      {/* Trusted By Section */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-white/40 mb-8">Vertrauen von führenden Schweizer Unternehmen</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-40">
            {['Swiss Re', 'UBS', 'Swisscom', 'Novartis', 'Roche'].map((company) => (
              <div key={company} className="text-xl font-semibold text-white/60">{company}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-24 relative">
        <FloatingElements />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400">Unsere Kernkompetenzen</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              KI-Lösungen für Ihr
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Business</span>
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Massgeschneiderte Automatisierungslösungen, die echten Mehrwert schaffen
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileSearch,
                title: 'Dokumenten-Verarbeitung',
                description: 'Automatische Extraktion und Klassifizierung von Dokumenten mit 99.9% Genauigkeit.',
                features: ['OCR & NLP', 'Multi-Format Support', 'ERP Integration'],
                gradient: 'from-cyan-500 to-blue-600'
              },
              {
                icon: Mail,
                title: 'E-Mail Automatisierung',
                description: 'Intelligente Kategorisierung und automatische Beantwortung von Kundenanfragen.',
                features: ['Smart Routing', 'Auto-Response', 'Sentiment Analysis'],
                gradient: 'from-blue-500 to-purple-600'
              },
              {
                icon: Brain,
                title: 'Custom AI Agents',
                description: 'Speziell entwickelte KI-Agenten für Ihre individuellen Geschäftsanforderungen.',
                features: ['Massgeschneidert', 'On-Premise Option', '24/7 Support'],
                gradient: 'from-purple-500 to-pink-600'
              },
              {
                icon: Shield,
                title: 'Compliance & Security',
                description: 'Schweizer Datenschutz-Standards. DSGVO-konform. ISO 27001 zertifiziert.',
                features: ['Swiss Hosting', 'Audit Logs', 'Verschlüsselung'],
                gradient: 'from-green-500 to-cyan-600'
              },
              {
                icon: Zap,
                title: 'Prozess-Optimierung',
                description: 'Identifikation und Automatisierung ineffizienter Workflows.',
                features: ['Process Mining', 'RPA Integration', 'KPI Dashboards'],
                gradient: 'from-orange-500 to-red-600'
              },
              {
                icon: GlobeIcon,
                title: 'Multilingual Support',
                description: 'Volle Unterstützung für Deutsch, Französisch, Italienisch und Englisch.',
                features: ['4 Sprachen', 'Auto-Detection', 'Cultural Adaptation'],
                gradient: 'from-cyan-500 to-teal-600'
              }
            ].map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 40, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <TiltCard className="h-full p-8 hover:border-cyan-500/30 transition-colors duration-500">
                  <BorderBeam size={250} duration={12} delay={index * 2} />
                  
                  {/* Animated Icon Container */}
                  <motion.div 
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: [0, -5, 5, 0],
                      boxShadow: "0 0 30px rgba(0, 212, 255, 0.4)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <solution.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold mb-3">{solution.title}</h3>
                  <p className="text-white/50 text-sm mb-6 leading-relaxed">{solution.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {solution.features.map((feature, i) => (
                      <motion.span 
                        key={feature} 
                        className="text-xs bg-white/5 text-white/60 px-3 py-1.5 rounded-full border border-white/5"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + i * 0.05 }}
                      >
                        {feature}
                      </motion.span>
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Globe */}
      <section id="stats" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-cyan-500/5" />
        
        {/* Animated Background Orbs */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          style={{ top: '10%', right: '-10%' }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Stats */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Zahlen, die
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> überzeugen</span>
                </h2>
                <p className="text-lg text-white/50 mb-12">
                  Unsere Lösungen liefern messbare Resultate für Schweizer Unternehmen.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: 50, suffix: '+', label: 'Enterprise Kunden', icon: '🏢' },
                  { value: 98, suffix: '%', label: 'Kundenzufriedenheit', icon: '⭐' },
                  { value: 2, suffix: 'M+', label: 'Dokumente verarbeitet', icon: '📄' },
                  { value: 40, suffix: '%', label: 'Zeitersparnis', icon: '⚡' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.15,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 120
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-cyan-500/30 transition-colors">
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div className="text-4xl font-bold text-cyan-400 mb-2">
                        <NumberTicker value={stat.value} />
                        <span>{stat.suffix}</span>
                      </div>
                      <div className="text-sm text-white/50">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Globe with 3D Container */}
            <motion.div 
              className="relative h-[500px] hidden lg:block"
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              {/* Glow Effect Behind Globe */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full bg-cyan-500/20 blur-[80px] animate-pulse" />
              </div>
              
              <Globe className="opacity-90" />
              
              {/* Floating Label */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-center bg-slate-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-cyan-500/30">
                  <MapPin className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                  <p className="text-sm font-medium text-white">Hauptsitz Zürich</p>
                  <p className="text-xs text-white/50">47.3769° N, 8.5417° E</p>
                </div>
              </motion.div>
              
              {/* Orbit Ring */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  className="w-[400px] h-[400px] border border-cyan-500/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Swiss Quality
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> AI</span>
              </h2>
              <p className="text-lg text-white/50 mb-8 leading-relaxed">
                Als Schweizer AG mit Sitz in Zürich verstehen wir die Anforderungen lokaler Unternehmen. 
                Wir kombinieren internationale KI-Expertise mit schweizerischer Präzision und Diskretion.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Schweizer Datenschutz-Standards',
                  'ISO 27001 zertifiziertes Rechenzentrum',
                  'Persönlicher Ansprechpartner',
                  'Deutsche Muttersprache im Team',
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <span className="text-white/70">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="font-semibold">Alpha Informatik AG</p>
                  <p className="text-sm text-white/50">Gegründet 2020 in Zürich</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-3xl p-1">
                <div className="bg-slate-950 rounded-3xl p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <pre className="text-sm font-mono text-white/70 overflow-x-auto">
{`// AI Document Processing
const result = await alpha.process({
  document: invoice,
  language: 'de-CH',
  extractFields: [
    'amount', 'date', 
    'vendor', 'lineItems'
  ],
  compliance: 'swiss-dpa'
});

// 99.9% accuracy guaranteed
console.log(result.confidence);
// → 0.998`}
                  </pre>
                </div>
              </div>
              <BorderBeam size={300} duration={15} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent" />
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full bg-cyan-500/5 blur-[150px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{ bottom: '-20%', left: '50%', transform: 'translateX(-50%)' }}
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-5 py-2 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-sm text-cyan-400">Verfügbar für neue Projekte</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Bereit für
              <br />
              <motion.span 
                className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent bg-[length:200%_auto]"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                intelligente Automatisierung?
              </motion.span>
            </h2>
            <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
              Lassen Sie uns in einem unverbindlichen Gespräch besprechen, 
              wie wir Ihre Prozesse optimieren können.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="mailto:info@alpha-informatik.ch" 
                  className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 px-8 py-4 rounded-xl font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
                >
                  <Mail className="w-5 h-5" />
                  <span>info@alpha-informatik.ch</span>
                </Link>
              </motion.div>
              <motion.a 
                href="tel:+41445001234" 
                className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-white px-8 py-4 rounded-xl font-semibold transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone className="w-5 h-5" />
                <span>+41 44 500 12 34</span>
              </motion.a>
            </div>

            <motion.div 
              className="flex items-center justify-center space-x-2 text-white/40 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <MapPin className="w-4 h-4" />
              <span>Bahnhofstrasse 100, 8001 Zürich</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">Alpha Informatik AG</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-white/40">
              <a href="#" className="hover:text-white transition-colors">Impressum</a>
              <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
              <a href="#" className="hover:text-white transition-colors">AGB</a>
            </div>
            
            <p className="text-sm text-white/40">
              © 2024 Alpha Informatik AG. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>

      {/* Version Navigation */}
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
        {['V4', 'V6', 'V7', 'V8', 'V10'].map((v) => (
          <Link 
            key={v} 
            href={`/${v.toLowerCase()}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              v === 'V10' 
                ? 'bg-cyan-500 text-slate-950 font-bold' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {v}
          </Link>
        ))}
      </div>
    </div>
  )
}

