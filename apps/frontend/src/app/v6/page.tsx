'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  ArrowRight, Shield, Zap, Clock, ChevronRight, ChevronLeft,
  Play, Sparkles, FileText, MessageSquare, Mail, Star
} from 'lucide-react';

// KONZEPT 6: DARK GOLD PREMIUM
// Mix aus V4 (dunkel, interaktiv) + V5 (Gold-Akzente, elegant)
// Dunkles Theme mit Gold statt bunten Farben

export default function DarkGoldPremiumPage() {
  const [activeShowcase, setActiveShowcase] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Spotlight effect - Gold tinted
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 300 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 300 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Auto-rotate carousels
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveShowcase((prev) => (prev + 1) % showcaseSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const agents = [
    { icon: FileText, name: 'Document Agent', desc: 'Intelligente Dokumentenverarbeitung', stat: '99.7%' },
    { icon: Sparkles, name: 'OCR Agent', desc: 'Präzise Texterkennung', stat: '< 2s' },
    { icon: MessageSquare, name: 'Chat Agent', desc: '24/7 Kundeninteraktion', stat: '24/7' },
    { icon: Mail, name: 'Email Agent', desc: 'Automatische Klassifizierung', stat: '85%' },
  ];

  const stats = [
    { value: '99.7%', label: 'Präzision' },
    { value: '< 2s', label: 'Verarbeitung' },
    { value: '150+', label: 'Kunden' },
    { value: '24/7', label: 'Verfügbar' },
  ];

  const features = [
    { icon: Shield, title: 'Swiss Hosted', desc: 'Ihre Daten verlassen die Schweiz nie. DSGVO-konform.', highlight: '100%' },
    { icon: Zap, title: 'Blitzschnell', desc: 'Dokumente werden in unter 2 Sekunden verarbeitet.', highlight: '< 2s' },
    { icon: Clock, title: '24/7 Verfügbar', desc: 'Unsere KI-Agenten arbeiten rund um die Uhr.', highlight: '24/7' },
  ];

  const showcaseSlides = [
    { title: "Dashboard", desc: "Alle Dokumente auf einen Blick mit Live-Status.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop" },
    { title: "OCR-Verarbeitung", desc: "Automatische Texterkennung mit 99.7% Genauigkeit.", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop" },
    { title: "Chat-Assistent", desc: "Intelligente Kundenbetreuung rund um die Uhr.", image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=1200&h=800&fit=crop" },
  ];

  const testimonials = [
    { quote: "Die Präzision der OCR-Erkennung ist beeindruckend. Selbst handschriftliche Notizen werden zuverlässig erfasst.", author: "Sandra Weber", role: "Digitalisierungs-Beauftragte", company: "Zürich Treuhand", metric: "99.7% Genauigkeit" },
    { quote: "Endlich eine Lösung, die hält was sie verspricht. Swiss Quality in der Automation.", author: "Marc Hofmann", role: "Operations Manager", company: "Alpine Finance Group", metric: "280% ROI" },
    { quote: "Die Integration war reibungslos. Ein echter Partner auf Augenhöhe.", author: "Thomas Müller", role: "CEO", company: "Schweizer Versicherung AG", metric: "85% schneller" },
  ];

  const galleryImages = [
    { src: "https://images.unsplash.com/photo-1541447271487-09612b3f49f7?w=600&h=400&fit=crop", alt: "Schweizer Alpen" },
    { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop", alt: "Modern Office" },
    { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop", alt: "Team Meeting" },
    { src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop", alt: "Tech Setup" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* Gold Spotlight Effect */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${smoothX.get()}px ${smoothY.get()}px, rgba(201, 169, 98, 0.07), transparent 40%)`,
        }}
      />

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#C9A962]/10"
      >
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <Link href="/v6" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#C9A962] to-[#8B7355] rounded-lg flex items-center justify-center">
              <span className="text-[#0A0A0A] font-bold text-lg">α</span>
            </div>
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
              className="group flex items-center space-x-2 bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-[#0A0A0A] px-6 py-3 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-[#C9A962]/20 transition-all"
            >
              <span>Demo starten</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        {/* Gold accent line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A962]/50 to-transparent"
        />

        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center space-x-3 bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-full px-5 py-2.5 mb-8"
          >
            <span className="w-2 h-2 bg-[#C9A962] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-[#C9A962]">Swiss AI Platform</span>
            <span className="text-white/30">•</span>
            <span className="text-sm text-white/50">GPT-4 Powered</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4"
          >
            Automation.
          </motion.h1>
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#C9A962] to-[#8B7355]"
          >
            Perfected.
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-white/40 max-w-2xl mx-auto mb-12 font-light"
          >
            KI-Agenten, die Ihre Dokumentenprozesse revolutionieren.
            <br />Entwickelt für Schweizer Unternehmen.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/demo"
                className="group flex items-center space-x-3 bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-[#0A0A0A] px-8 py-4 rounded-full text-base font-semibold hover:shadow-xl hover:shadow-[#C9A962]/30 transition-all"
              >
                <span>Live Demo erleben</span>
                <Play className="w-5 h-5 fill-current" />
              </Link>
            </motion.div>
            <Link 
              href="/kontakt"
              className="group flex items-center space-x-3 text-white/60 hover:text-white px-8 py-4 rounded-full text-base font-medium transition-all border border-white/10 hover:border-[#C9A962]/50"
            >
              <span>Beratung anfragen</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Agent Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {agents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -8, borderColor: 'rgba(201, 169, 98, 0.3)' }}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <agent.icon className="w-6 h-6 text-white/40 group-hover:text-[#C9A962] transition-colors" />
                  <span className="text-xs text-[#C9A962]/60 font-medium">{agent.stat}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{agent.name}</h3>
                <p className="text-xs text-white/40">{agent.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trusted By Logos */}
      <section className="py-16 border-y border-[#C9A962]/10">
        <div className="max-w-6xl mx-auto px-8">
          <p className="text-center text-white/30 text-sm mb-8">Vertrauen von Schweizer Unternehmen</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 hover:opacity-60 transition-opacity">
            {['Küng Treuhand', 'Bernasconi AG', 'Meier & Partner', 'Huber Logistik', 'Schmid Consulting', 'Berner KMU'].map((company) => (
              <div key={company} className="text-lg font-semibold text-white/50 hover:text-[#C9A962] transition-colors">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#111]">
        <div className="max-w-6xl mx-auto px-8">
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
                <div className="text-4xl md:text-5xl font-light text-[#C9A962] mb-2">{stat.value}</div>
                <div className="text-sm text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Carousel */}
      <section id="showcase" className="py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-sm font-medium text-[#C9A962] tracking-widest uppercase mb-4 block">Live Demo</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Sehen Sie es <span className="text-white/30">in Aktion</span>
            </h2>
          </motion.div>

          <div className="relative">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative aspect-video rounded-3xl overflow-hidden border border-[#C9A962]/20 bg-[#111]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeShowcase}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  {/* Browser mockup header */}
                  <div className="h-10 bg-[#1A1A1A] flex items-center px-4 space-x-2 border-b border-white/5">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-white/5 rounded px-3 py-1 text-xs text-white/30">app.alphainformatik.ch/{showcaseSlides[activeShowcase].title.toLowerCase()}</div>
                    </div>
                  </div>
                  <img 
                    src={showcaseSlides[activeShowcase].image}
                    alt={showcaseSlides[activeShowcase].title}
                    className="w-full h-[calc(100%-2.5rem)] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] to-transparent p-8">
                    <h3 className="text-2xl font-semibold mb-2">{showcaseSlides[activeShowcase].title}</h3>
                    <p className="text-white/60">{showcaseSlides[activeShowcase].desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button 
                onClick={() => setActiveShowcase((prev) => (prev - 1 + showcaseSlides.length) % showcaseSlides.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#C9A962]/20 hover:bg-[#C9A962]/40 rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6 text-[#C9A962]" />
              </button>
              <button 
                onClick={() => setActiveShowcase((prev) => (prev + 1) % showcaseSlides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#C9A962]/20 hover:bg-[#C9A962]/40 rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6 text-[#C9A962]" />
              </button>
            </motion.div>

            <div className="flex justify-center items-center space-x-4 mt-8">
              {showcaseSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  onClick={() => setActiveShowcase(index)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all ${
                    activeShowcase === index 
                      ? 'bg-[#C9A962] text-[#0A0A0A]' 
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm font-medium">{slide.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="lösungen" className="py-32 px-8 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <span className="text-sm font-medium text-[#C9A962] tracking-widest uppercase mb-4 block">Unsere Lösungen</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Warum <span className="text-white/30">Alpha Informatik?</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10, borderColor: 'rgba(201, 169, 98, 0.3)' }}
                className="group relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-[#C9A962]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#C9A962]/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-[#C9A962]" />
                  </div>
                  <span className="text-3xl font-light text-[#C9A962]/30 group-hover:text-[#C9A962]/50 transition-colors">{feature.highlight}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/40">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section id="kunden" className="py-32 px-8 border-y border-[#C9A962]/10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-sm font-medium text-[#C9A962] tracking-widest uppercase mb-4 block">Referenzen</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Was unsere <span className="text-white/30">Kunden sagen</span>
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-[#C9A962]/5 to-transparent rounded-3xl p-10 md:p-14 border border-[#C9A962]/20"
              >
                <div className="w-12 h-px bg-[#C9A962] mb-8" />
                
                <div className="flex space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#C9A962] fill-[#C9A962]" />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-white/80">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>

                <div className="inline-block bg-[#C9A962]/10 text-[#C9A962] px-4 py-2 rounded-full text-sm font-medium mb-8">
                  {testimonials[activeTestimonial].metric}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#C9A962] to-[#8B7355] rounded-full flex items-center justify-center text-[#0A0A0A] font-semibold">
                    {testimonials[activeTestimonial].author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonials[activeTestimonial].author}</div>
                    <div className="text-sm text-white/40">
                      {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center space-x-4 mt-8">
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="w-12 h-12 bg-white/5 hover:bg-[#C9A962]/20 rounded-full flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-[#C9A962]" />
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2 rounded-full transition-all ${
                      activeTestimonial === index ? 'w-8 bg-[#C9A962]' : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>
              
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="w-12 h-12 bg-white/5 hover:bg-[#C9A962]/20 rounded-full flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5 text-[#C9A962]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section id="galerie" className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Made in <span className="text-[#C9A962]">Zürich</span>
            </h2>
            <p className="text-lg text-white/40">Schweizer Qualität. Lokale Präsenz.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-sm font-medium text-white/80">{img.alt}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="kontakt" className="py-32 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#C9A962]/5 to-[#0A0A0A]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A962]/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Sparkles className="w-10 h-10 text-[#C9A962] mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Bereit für den
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A962] to-[#8B7355]">nächsten Schritt?</span>
            </h2>
            <p className="text-xl text-white/40 mb-10 max-w-xl mx-auto">
              Kostenlose Erstberatung. Unverbindlich. Persönlich.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/kontakt"
                  className="group flex items-center space-x-3 bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-[#0A0A0A] px-8 py-4 rounded-full text-base font-semibold hover:shadow-xl hover:shadow-[#C9A962]/30 transition-all"
                >
                  <span>Beratung anfragen</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <Link href="tel:+41783406665" className="text-white/40 hover:text-[#C9A962] transition-colors text-sm">
                oder anrufen: +41 78 340 66 65
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#C9A962]/10">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[#C9A962] to-[#8B7355] rounded-lg flex items-center justify-center">
                <span className="text-[#0A0A0A] font-bold">α</span>
              </div>
              <span className="font-semibold">Alpha Informatik</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-white/30">
              <Link href="#" className="hover:text-[#C9A962] transition-colors">Impressum</Link>
              <Link href="#" className="hover:text-[#C9A962] transition-colors">Datenschutz</Link>
              <span>© 2025 Alpha Informatik</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Version indicator */}
      <div className="fixed bottom-4 left-4 bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-[#0A0A0A] px-4 py-2 rounded-full text-xs font-bold z-50 flex items-center space-x-2">
        <Sparkles className="w-3 h-3" />
        <span>Konzept 6: Dark Gold Premium</span>
      </div>
      
      {/* Navigation to other concepts */}
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
        <Link href="/v4" className="bg-white/10 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/20 transition-colors">V4</Link>
        <Link href="/v6" className="bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-[#0A0A0A] px-3 py-1.5 rounded-full text-xs font-bold">V6</Link>
        <Link href="/v7" className="bg-white/10 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/20 transition-colors">V7</Link>
        <Link href="/v8" className="bg-white/10 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/20 transition-colors">V8</Link>
      </div>
    </div>
  );
}

