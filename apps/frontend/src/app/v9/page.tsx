'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Zap, Shield, Clock,
  FileText, MessageSquare, Mail, Brain, Play, Star,
  Check, Users, Building2, Globe, Award, TrendingUp, Lock, CheckCircle2
} from 'lucide-react';
import { DotShaderBackground } from '@/components/ui/dot-shader-background';

// V9: CLEAN PROFESSIONAL - BENTO GRID + DOT SHADER BACKGROUND
// Interactive shader background, light mode, subtle gradients

export default function CleanProfessionalPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { 
      icon: FileText, 
      title: 'Document AI', 
      desc: 'Intelligente Dokumentenverarbeitung mit höchster Präzision',
      metric: '99.7%',
      metricLabel: 'Genauigkeit',
      color: 'bg-blue-500',
    },
    { 
      icon: MessageSquare, 
      title: 'Chat Agent', 
      desc: 'Natürliche Konversationen rund um die Uhr',
      metric: '24/7',
      metricLabel: 'Verfügbar',
      color: 'bg-violet-500',
    },
    { 
      icon: Mail, 
      title: 'Email Agent', 
      desc: 'Automatisierte E-Mail-Verarbeitung',
      metric: '80%',
      metricLabel: 'Zeitersparnis',
      color: 'bg-emerald-500',
    },
    { 
      icon: Brain, 
      title: 'Multi-Agent', 
      desc: 'Orchestrierte KI für komplexe Workflows',
      metric: '∞',
      metricLabel: 'Skalierbar',
      color: 'bg-orange-500',
    },
  ];

  const stats = [
    { value: '500+', label: 'Unternehmen', icon: Building2 },
    { value: '2M+', label: 'Dokumente/Monat', icon: FileText },
    { value: '99.9%', label: 'Uptime', icon: TrendingUp },
    { value: '<2s', label: 'Antwortzeit', icon: Zap },
  ];

  const testimonials = [
    { 
      quote: "Alpha Informatik hat unsere Dokumentenprozesse revolutioniert. Die Genauigkeit ist beeindruckend.",
      author: "Dr. Sandra Weber",
      role: "CTO, FinanceSwiss AG",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
    },
    { 
      quote: "Endlich eine KI-Lösung, die unsere Compliance-Anforderungen erfüllt. 100% Swiss Hosted.",
      author: "Marc Häberli",
      role: "CISO, SecureTech GmbH",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    { 
      quote: "Die Integration war erstaunlich einfach. Unser Team war innerhalb eines Tages produktiv.",
      author: "Lisa Brunner",
      role: "Head of Operations, LogiFlow",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
  ];

  const trustedBy = [
    'Swiss Re', 'UBS', 'Novartis', 'Nestlé', 'ABB', 'Swisscom'
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F5] text-slate-900 overflow-x-hidden relative">
      {/* Interactive Dot Shader Background */}
      <div className="fixed inset-0 z-0">
        <DotShaderBackground theme="light" className="w-full h-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/v9" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-white font-bold text-lg">α</span>
              </div>
              <span className="font-semibold text-xl text-slate-900">Alpha Informatik</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: 'Lösungen', href: '#features' },
                { name: 'Kunden', href: '#customers' },
                { name: 'Preise', href: '#pricing' },
                { name: 'Über uns', href: '#about' },
              ].map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Anmelden
              </Link>
              <Link 
                href="/demo" 
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-slate-900/10"
              >
                <span>Demo starten</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Trust Badge */}
            <motion.div 
              className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-lg shadow-slate-200/50 border border-slate-100 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex -space-x-2">
                {[1,2,3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 border-2 border-white" />
                ))}
              </div>
              <span className="text-sm font-medium text-slate-600">
                Vertraut von <span className="text-slate-900">500+ Unternehmen</span>
              </span>
              <div className="flex items-center space-x-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-slate-900 mix-blend-exclusion">
              KI-Automatisierung
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                die überzeugt
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Dokumentenverarbeitung, Chat und E-Mail – alles in einer Plattform. 
              Entwickelt für Schweizer Unternehmen, gehostet in der Schweiz.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Link 
                href="/demo"
                className="group inline-flex items-center space-x-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-base font-medium transition-all shadow-xl shadow-slate-900/20"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Kostenlose Demo</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/contact"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl text-base font-medium transition-all border border-slate-200 shadow-lg"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Beratung buchen</span>
              </Link>
            </div>

            {/* Trust Logos */}
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
              {trustedBy.map((company) => (
                <span key={company} className="text-lg font-semibold text-slate-400">
                  {company}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {/* Large Card - Document AI */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2 md:row-span-2 group"
            >
              <div className="h-full bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/50 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-300 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-bold text-blue-600">99.7%</span>
                      <p className="text-sm text-slate-500">Genauigkeit</p>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">Document AI</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Verarbeiten Sie Rechnungen, Verträge und Formulare automatisch. 
                    Unsere KI extrahiert alle relevanten Daten mit höchster Präzision.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {['OCR', 'PDF-Parsing', 'Handschrift', 'Multi-Sprache'].map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden group-hover:scale-[1.02] transition-transform">
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop" 
                      alt="Document AI Dashboard"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-4">
                      <span className="text-white text-sm font-medium">Live Dashboard</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Medium Card - Chat Agent */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2 group"
            >
              <div className="h-full bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/50 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-violet-200/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-transparent opacity-50" />
                
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 mb-4">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Chat Agent</h3>
                    <p className="text-slate-600 text-sm">
                      24/7 Kundenservice mit natürlicher Sprache
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-violet-600">24/7</span>
                    <p className="text-xs text-slate-500">Verfügbar</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Medium Card - Email Agent */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group"
            >
              <div className="h-full bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/50 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-200/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-50" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-slate-900">Email Agent</h3>
                  <p className="text-slate-600 text-sm mb-3">Auto-Klassifizierung</p>
                  <span className="text-2xl font-bold text-emerald-600">80%</span>
                  <span className="text-xs text-slate-500 ml-1">Zeitersparnis</span>
                </div>
              </div>
            </motion.div>

            {/* Small Card - Multi-Agent */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group"
            >
              <div className="h-full bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/50 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-200/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-50" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-4">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-slate-900">Multi-Agent</h3>
                  <p className="text-slate-600 text-sm">Orchestrierung</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 bg-white/80 backdrop-blur-sm border-y border-slate-200/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-slate-600" />
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="customers" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-blue-600 mb-4">KUNDENSTIMMEN</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Was unsere Kunden sagen
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-200/50"
              >
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <img 
                    src={testimonials[activeTestimonial].image} 
                    alt={testimonials[activeTestimonial].author}
                    className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                  />
                  <div className="flex-1">
                    <div className="flex mb-4">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <blockquote className="text-2xl font-medium text-slate-900 mb-6 leading-relaxed">
                      &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                    </blockquote>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonials[activeTestimonial].author}</div>
                      <div className="text-slate-500">{testimonials[activeTestimonial].role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeTestimonial 
                      ? 'bg-blue-600 w-8' 
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 bg-slate-900 text-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-sm font-semibold text-blue-400 mb-4">SICHERHEIT & COMPLIANCE</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Enterprise-Ready.
                <br />
                <span className="text-slate-400">Swiss Hosted.</span>
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Ihre Daten bleiben in der Schweiz. Wir erfüllen alle Anforderungen 
                des Schweizer Datenschutzgesetzes und der DSGVO.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, label: 'DSGVO-konform' },
                  { icon: Lock, label: 'Ende-zu-Ende verschlüsselt' },
                  { icon: Globe, label: '100% Swiss Hosted' },
                  { icon: Award, label: 'ISO 27001 zertifiziert' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-violet-600/20 rounded-3xl blur-3xl" />
              <div className="relative bg-slate-800 rounded-3xl p-8 border border-slate-700">
                <div className="flex items-center space-x-2 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span className="font-semibold">Security Checklist</span>
                </div>
                
                <div className="space-y-4">
                  {[
                    'Daten gehostet in Schweizer Rechenzentrum',
                    'AES-256 Verschlüsselung',
                    'Multi-Faktor-Authentifizierung',
                    'Regelmässige Sicherheitsaudits',
                    'SOC 2 Type II compliant',
                    'Automatische Backups',
                  ].map((item, i) => (
                    <motion.div 
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <Check className="w-5 h-5 text-emerald-400" />
                      <span className="text-slate-300">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl shadow-blue-600/25">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Bereit für intelligente Automatisierung?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Starten Sie noch heute mit einer kostenlosen Demo und erleben Sie, 
              wie unsere KI Ihre Prozesse transformiert.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/demo"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl text-base font-semibold transition-all shadow-xl"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Demo starten</span>
              </Link>
              
              <Link 
                href="tel:+41783406665"
                className="inline-flex items-center space-x-2 text-white/90 hover:text-white transition-colors"
              >
                <span>oder anrufen:</span>
                <span className="font-semibold">+41 78 340 66 65</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white/80 backdrop-blur-sm border-t border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">α</span>
              </div>
              <span className="font-semibold text-slate-900">Alpha Informatik</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <Link href="/privacy" className="hover:text-slate-900 transition-colors">Datenschutz</Link>
              <Link href="/terms" className="hover:text-slate-900 transition-colors">AGB</Link>
              <Link href="/imprint" className="hover:text-slate-900 transition-colors">Impressum</Link>
            </div>

            <span className="text-sm text-slate-500 mt-4 md:mt-0">
              © 2025 Alpha Informatik · Swiss Made
            </span>
          </div>
        </div>
      </footer>

      {/* Version Indicator */}
      <div className="fixed bottom-4 left-4 bg-white text-slate-600 px-4 py-2 rounded-full text-xs font-medium z-50 flex items-center space-x-2 border border-slate-200 shadow-lg">
        <Sparkles className="w-3 h-3 text-blue-500" />
        <span>V9: Dot Shader</span>
      </div>
      
      {/* Version Navigation */}
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
        {['V4', 'V5', 'V6', 'V7', 'V8', 'V9'].map((v) => (
          <Link 
            key={v}
            href={`/${v.toLowerCase()}`} 
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm ${
              v === 'V9' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {v}
          </Link>
        ))}
      </div>
    </div>
  );
}
