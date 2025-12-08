'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Play, Cpu, MessageSquare, FileText, Mail, Check, Zap, Shield, Clock, ChevronLeft, ChevronRight, Quote, Star, Building2, Users, TrendingUp } from 'lucide-react';

// KONZEPT 4: HYBRID PREMIUM
// Clean wie V1 + Interaktiv wie V2
// Mit Bildern und Karussell

export default function HybridPremiumPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [absoluteMouse, setAbsoluteMouse] = useState({ x: 0, y: 0 });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeShowcase, setActiveShowcase] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
      setAbsoluteMouse({
        x: e.clientX,
        y: e.clientY,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate features & testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const agents = [
    { icon: FileText, name: 'Document Agent', desc: 'Intelligente Dokumentenverarbeitung', stat: '1,000+ Docs/h' },
    { icon: Cpu, name: 'OCR Agent', desc: 'Präzise Texterkennung', stat: '99.7% Genauigkeit' },
    { icon: MessageSquare, name: 'Chat Agent', desc: '24/7 Kundeninteraktion', stat: '< 2s Antwortzeit' },
    { icon: Mail, name: 'Email Agent', desc: 'Automatische Klassifizierung', stat: '85% Zeitersparnis' },
  ];

  const testimonials = [
    {
      quote: "Alpha Informatik hat unsere Schadenbearbeitung komplett transformiert. Was früher Tage dauerte, erledigen wir jetzt in Stunden.",
      author: "Thomas Müller",
      role: "Leiter Operations",
      company: "Schweizer Versicherung AG",
      rating: 5,
      image: "TM",
      metric: "85% schneller"
    },
    {
      quote: "Die Präzision der OCR-Erkennung ist beeindruckend. Selbst handschriftliche Notizen werden zuverlässig erfasst.",
      author: "Sandra Weber",
      role: "Digitalisierungs-Beauftragte",
      company: "Zürich Treuhand",
      rating: 5,
      image: "SW",
      metric: "99.7% Genauigkeit"
    },
    {
      quote: "Der Chat-Agent beantwortet 70% unserer Kundenanfragen selbstständig. Unser Team kann sich auf komplexe Fälle konzentrieren.",
      author: "Marco Bernasconi",
      role: "Kundenservice-Leiter",
      company: "Alpine Insurance",
      rating: 5,
      image: "MB",
      metric: "70% Automatisierung"
    },
  ];

  const showcaseSlides = [
    {
      title: "Dashboard",
      desc: "Alle Dokumente auf einen Blick. Echtzeit-Verarbeitung mit Live-Status.",
      gradient: "from-blue-500/20 to-purple-500/20",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop"
    },
    {
      title: "OCR-Verarbeitung",
      desc: "Automatische Texterkennung mit KI. Auch bei komplexen Layouts.",
      gradient: "from-purple-500/20 to-pink-500/20",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop"
    },
    {
      title: "Chat-Assistent",
      desc: "Intelligente Kundenbetreuung rund um die Uhr.",
      gradient: "from-pink-500/20 to-orange-500/20",
      image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=1200&h=800&fit=crop"
    },
  ];

  const stats = [
    { value: '150+', label: 'Unternehmen', icon: Building2 },
    { value: '99.7%', label: 'Präzision', icon: TrendingUp },
    { value: '< 2s', label: 'Verarbeitung', icon: Zap },
    { value: '24/7', label: 'Verfügbar', icon: Clock },
  ];

  const nextTestimonial = () => setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* Grid background */}
      <div 
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Spotlight */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${absoluteMouse.x}px ${absoluteMouse.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />

      {/* Navigation - mit solidem Hintergrund */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <Link href="/v4" className="flex items-center space-x-3 group">
            <motion.div 
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <span className="text-[#0A0A0A] font-bold text-xl">α</span>
            </motion.div>
            <span className="font-semibold text-lg tracking-tight">Alpha Informatik</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {['Lösungen', 'Showcase', 'Kunden', 'Kontakt'].map((item) => (
              <Link 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="px-5 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                {item}
              </Link>
            ))}
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link 
              href="/demo"
              className="group flex items-center space-x-2 bg-white text-[#0A0A0A] px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-all"
            >
              <span>Demo starten</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-block mb-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
              <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 flex items-center space-x-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Swiss AI Platform</span>
                <span className="text-white/40">•</span>
                <span className="text-sm text-white/60">GPT-4 Powered</span>
              </div>
            </div>
          </motion.div>

          {/* Headline with 3D */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)` }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
              <span className="block text-white">Automation.</span>
              <span className="block text-white/20">Perfected.</span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-white/40 max-w-2xl mx-auto mb-12 font-light"
          >
            KI-Agenten, die Ihre Dokumentenprozesse revolutionieren.
            <br />
            <span className="text-white/60">Entwickelt für Schweizer Unternehmen.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/demo" className="group flex items-center space-x-3 bg-white text-[#0A0A0A] px-8 py-4 rounded-full text-base font-semibold">
                <span>Live Demo erleben</span>
                <Play className="w-5 h-5 fill-current" />
              </Link>
            </motion.div>
            <Link href="/kontakt" className="group flex items-center space-x-3 text-white/60 hover:text-white px-6 py-4 transition-colors">
              <span>Beratung anfragen</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Agent Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {agents.map((agent, index) => (
              <motion.div
                key={agent.name}
                onHoverStart={() => setHoveredAgent(index)}
                onHoverEnd={() => setHoveredAgent(null)}
                whileHover={{ y: -8 }}
                className="relative cursor-pointer"
              >
                <div className={`relative p-6 rounded-2xl border transition-all duration-500 ${
                  hoveredAgent === index || activeFeature === index ? 'bg-white/10 border-white/30' : 'bg-white/[0.02] border-white/5'
                }`}>
                  <div className={`absolute inset-0 rounded-2xl bg-white/10 blur-xl -z-10 transition-opacity ${hoveredAgent === index ? 'opacity-50' : 'opacity-0'}`} />
                  <agent.icon className={`w-8 h-8 mb-4 transition-colors ${hoveredAgent === index || activeFeature === index ? 'text-white' : 'text-white/40'}`} />
                  <h3 className="font-semibold text-sm mb-1">{agent.name}</h3>
                  <p className="text-xs text-white/40 mb-3">{agent.desc}</p>
                  <AnimatePresence>
                    {(hoveredAgent === index || activeFeature === index) && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="text-xs font-mono text-white/60">
                        {agent.stat}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trusted By Logos */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-8">
          <p className="text-center text-white/30 text-sm mb-8">Vertrauen von führenden Schweizer Unternehmen</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 hover:opacity-60 transition-opacity">
            {['Küng Treuhand', 'Bernasconi AG', 'Meier & Partner', 'Huber Logistik', 'Schmid Consulting', 'Berner KMU'].map((company) => (
              <div key={company} className="text-xl font-bold text-white/60 hover:text-white/80 transition-colors">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/10 transition-colors">
                  <stat.icon className="w-6 h-6 text-white/60" />
                </div>
                <motion.div className="text-4xl md:text-5xl font-light mb-2 text-white" whileHover={{ scale: 1.1 }}>
                  {stat.value}
                </motion.div>
                <div className="text-sm text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SHOWCASE CAROUSEL ========== */}
      <section id="showcase" className="py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Sehen Sie es <span className="text-white/30">in Aktion</span>
            </h2>
            <p className="text-lg text-white/40 max-w-xl mx-auto">
              Entdecken Sie unsere Plattform in verschiedenen Anwendungsszenarien.
            </p>
          </motion.div>

          {/* Showcase Carousel */}
          <div className="relative">
            {/* Main Display */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeShowcase}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-0 bg-gradient-to-br ${showcaseSlides[activeShowcase].gradient}`}
                >
                  {/* Mock Dashboard UI */}
                  <div className="absolute inset-6 bg-[#0A0A0A]/80 rounded-2xl border border-white/10 overflow-hidden">
                    {/* Top Bar */}
                    <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-4 space-x-2">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="bg-white/5 rounded-lg px-4 py-1 text-xs text-white/40 font-mono">
                          app.alphainformatik.ch/{showcaseSlides[activeShowcase].title.toLowerCase()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-6 flex flex-col items-center justify-center h-[calc(100%-3rem)]">
                      {activeShowcase === 0 && (
                        <div className="w-full max-w-md space-y-4">
                          <div className="grid grid-cols-3 gap-3">
                            {['847', '842', '5'].map((num, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 rounded-xl p-4 text-center"
                              >
                                <div className="text-2xl font-bold">{num}</div>
                                <div className="text-xs text-white/40">{['Total', 'Fertig', 'Offen'][i]}</div>
                              </motion.div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            {['SUVA_Unfall.pdf', 'Rechnung.pdf', 'Vertrag.docx'].map((file, i) => (
                              <motion.div
                                key={file}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2"
                              >
                                <div className="flex items-center space-x-3">
                                  <FileText className="w-4 h-4 text-white/40" />
                                  <span className="text-sm font-mono">{file}</span>
                                </div>
                                <Check className="w-4 h-4 text-green-400" />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                      {activeShowcase === 1 && (
                        <div className="w-full max-w-md">
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm font-medium">OCR Analyse</span>
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">99.7%</span>
                            </div>
                            <div className="space-y-3">
                              {['Name: Max Mustermann', 'Datum: 15.03.2024', 'Betrag: CHF 1,250.00'].map((item, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ width: 0 }}
                                  animate={{ width: '100%' }}
                                  transition={{ delay: i * 0.2, duration: 0.5 }}
                                  className="bg-white/10 rounded-lg px-4 py-2 text-sm font-mono"
                                >
                                  {item}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {activeShowcase === 2 && (
                        <div className="w-full max-w-sm">
                          <div className="space-y-3">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/5 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
                              <p className="text-sm">Wie kann ich meine Versicherung kündigen?</p>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white/10 rounded-2xl rounded-br-sm px-4 py-3 max-w-[80%] ml-auto">
                              <p className="text-sm">Gerne helfe ich Ihnen. Eine Kündigung können Sie per E-Mail oder Brief einreichen...</p>
                            </motion.div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={() => setActiveShowcase((prev) => (prev - 1 + showcaseSlides.length) % showcaseSlides.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setActiveShowcase((prev) => (prev + 1) % showcaseSlides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>

            {/* Carousel Indicators */}
            <div className="flex justify-center items-center space-x-4 mt-8">
              {showcaseSlides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => setActiveShowcase(index)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                    activeShowcase === index ? 'bg-white text-[#0A0A0A]' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm font-medium">{slide.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS CAROUSEL ========== */}
      <section id="kunden" className="py-32 px-8 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Was unsere <span className="text-white/30">Kunden sagen</span>
            </h2>
            <p className="text-lg text-white/40 max-w-xl mx-auto">
              Über 150 Schweizer Unternehmen vertrauen auf Alpha Informatik.
            </p>
          </motion.div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 md:p-12 border border-white/10"
              >
                {/* Quote Icon */}
                <Quote className="w-12 h-12 text-white/20 mb-6" />
                
                {/* Stars */}
                <div className="flex space-x-1 mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-white/90">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>

                {/* Metric Badge */}
                <div className="inline-block bg-white/10 rounded-full px-4 py-2 mb-8">
                  <span className="text-sm font-semibold text-white/80">{testimonials[activeTestimonial].metric}</span>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold">
                    {testimonials[activeTestimonial].image}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{testimonials[activeTestimonial].author}</div>
                    <div className="text-white/50">{testimonials[activeTestimonial].role}</div>
                    <div className="text-white/30 text-sm">{testimonials[activeTestimonial].company}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Dots */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activeTestimonial ? 'w-8 bg-white' : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery - Zürich & Team */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Made in <span className="text-white/30">Zürich</span>
            </h2>
            <p className="text-lg text-white/40">Schweizer Qualität. Lokale Präsenz.</p>
          </motion.div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: "https://images.unsplash.com/photo-1541447271487-09612b3f49f7?w=600&h=400&fit=crop", alt: "Schweizer Alpen" },
              { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop", alt: "Modern Office" },
              { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop", alt: "Team Meeting" },
              { src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop", alt: "Tech Setup" },
            ].map((img, index) => (
              <motion.div
                key={img.alt}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`relative overflow-hidden rounded-2xl ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <img 
                  src={img.src} 
                  alt={img.alt}
                  className={`w-full object-cover ${index === 0 ? 'h-full min-h-[300px]' : 'h-48'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-sm font-medium text-white/80">{img.alt}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="lösungen" className="py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Warum <span className="text-white/30">Alpha Informatik?</span>
            </h2>
            <p className="text-lg text-white/40 max-w-xl mx-auto">Präzise. Schnell. Swiss-made.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Blitzschnell', desc: 'Dokumente werden in unter 2 Sekunden verarbeitet.', highlight: '< 2s' },
              { icon: Shield, title: 'Swiss Hosted', desc: 'Ihre Daten verlassen die Schweiz nie. DSGVO-konform.', highlight: '100%' },
              { icon: Clock, title: '24/7 Verfügbar', desc: 'Unsere KI-Agenten arbeiten rund um die Uhr.', highlight: '24/7' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-8 rounded-3xl border border-white/5 group-hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <feature.icon className="w-7 h-7 text-white/60 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-3xl font-light text-white/20 group-hover:text-white/40 transition-colors">{feature.highlight}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-white/40">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Bereit für den<br /><span className="text-white/30">nächsten Schritt?</span>
            </h2>
            <p className="text-xl text-white/40 mb-10 max-w-xl mx-auto">Kostenlose Erstberatung. Unverbindlich. Persönlich.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/kontakt" className="group flex items-center space-x-3 bg-white text-[#0A0A0A] px-8 py-4 rounded-full text-base font-semibold">
                  <span>Beratung anfragen</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <Link href="tel:+41783406665" className="text-white/40 hover:text-white transition-colors text-sm">
                oder anrufen: +41 78 340 66 65
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#0A0A0A] font-bold">α</span>
              </div>
              <span className="font-semibold">Alpha Informatik</span>
              <span className="text-white/30">•</span>
              <span className="text-white/30 text-sm">Zürich, Schweiz</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-white/30">
              <Link href="#" className="hover:text-white transition-colors">Impressum</Link>
              <Link href="#" className="hover:text-white transition-colors">Datenschutz</Link>
              <span>© 2025</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Version indicator */}
      <div className="fixed bottom-4 left-4 bg-white text-[#0A0A0A] px-3 py-1.5 rounded-full text-xs font-bold z-50">
        Konzept 4: Hybrid Premium
      </div>
      
      {/* Navigation */}
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
        <Link href="/v4" className="bg-white text-[#0A0A0A] px-3 py-1.5 rounded-full text-xs font-bold">V4</Link>
        <Link href="/v6" className="bg-white/10 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/20 transition-colors">V6</Link>
        <Link href="/v7" className="bg-white/10 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/20 transition-colors">V7</Link>
        <Link href="/v8" className="bg-white/10 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/20 transition-colors">V8</Link>
        <Link href="/v10" className="bg-white/10 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/20 transition-colors">V10</Link>
      </div>
    </div>
  );
}
