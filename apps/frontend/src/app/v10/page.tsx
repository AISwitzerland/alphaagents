'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
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
  MapPin
} from 'lucide-react'
import { LampContainer } from '@/components/ui/lamp'
import { Globe } from '@/components/ui/globe'
import { BorderBeam } from '@/components/ui/border-beam'
import { NumberTicker } from '@/components/ui/number-ticker'

export default function V10Page() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      
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
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
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
                features: ['OCR & NLP', 'Multi-Format Support', 'ERP Integration']
              },
              {
                icon: Mail,
                title: 'E-Mail Automatisierung',
                description: 'Intelligente Kategorisierung und automatische Beantwortung von Kundenanfragen.',
                features: ['Smart Routing', 'Auto-Response', 'Sentiment Analysis']
              },
              {
                icon: Brain,
                title: 'Custom AI Agents',
                description: 'Speziell entwickelte KI-Agenten für Ihre individuellen Geschäftsanforderungen.',
                features: ['Massgeschneidert', 'On-Premise Option', '24/7 Support']
              },
              {
                icon: Shield,
                title: 'Compliance & Security',
                description: 'Schweizer Datenschutz-Standards. DSGVO-konform. ISO 27001 zertifiziert.',
                features: ['Swiss Hosting', 'Audit Logs', 'Verschlüsselung']
              },
              {
                icon: Zap,
                title: 'Prozess-Optimierung',
                description: 'Identifikation und Automatisierung ineffizienter Workflows.',
                features: ['Process Mining', 'RPA Integration', 'KPI Dashboards']
              },
              {
                icon: GlobeIcon,
                title: 'Multilingual Support',
                description: 'Volle Unterstützung für Deutsch, Französisch, Italienisch und Englisch.',
                features: ['4 Sprachen', 'Auto-Detection', 'Cultural Adaptation']
              }
            ].map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.04] transition-all duration-500"
              >
                <BorderBeam size={250} duration={12} delay={index * 2} />
                
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <solution.icon className="w-6 h-6 text-cyan-400" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{solution.title}</h3>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">{solution.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {solution.features.map((feature) => (
                    <span key={feature} className="text-xs bg-white/5 text-white/60 px-3 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Globe */}
      <section id="stats" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Stats */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Zahlen, die
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> überzeugen</span>
                </h2>
                <p className="text-lg text-white/50 mb-12">
                  Unsere Lösungen liefern messbare Resultate für Schweizer Unternehmen.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-8">
                {[
                  { value: 50, suffix: '+', label: 'Enterprise Kunden' },
                  { value: 98, suffix: '%', label: 'Kundenzufriedenheit' },
                  { value: 2, suffix: 'M+', label: 'Dokumente verarbeitet', multiplier: true },
                  { value: 40, suffix: '%', label: 'Zeitersparnis' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/[0.02] border border-white/5 rounded-2xl p-6"
                  >
                    <div className="text-4xl font-bold text-cyan-400 mb-2">
                      <NumberTicker value={stat.value} />
                      <span>{stat.suffix}</span>
                    </div>
                    <div className="text-sm text-white/50">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Globe */}
            <div className="relative h-[500px] hidden lg:block">
              <Globe className="opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-sm text-white/60">Hauptsitz Zürich</p>
                </div>
              </div>
            </div>
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
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Bereit für
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> intelligente Automatisierung?</span>
            </h2>
            <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
              Lassen Sie uns in einem unverbindlichen Gespräch besprechen, 
              wie wir Ihre Prozesse optimieren können.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                href="mailto:info@alpha-informatik.ch" 
                className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                <span>info@alpha-informatik.ch</span>
              </Link>
              <a 
                href="tel:+41445001234" 
                className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-semibold transition-all"
              >
                <Phone className="w-5 h-5" />
                <span>+41 44 500 12 34</span>
              </a>
            </div>

            <div className="flex items-center justify-center space-x-2 text-white/40 text-sm">
              <MapPin className="w-4 h-4" />
              <span>Bahnhofstrasse 100, 8001 Zürich</span>
            </div>
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

