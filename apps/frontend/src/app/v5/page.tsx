'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  ArrowRight, Shield, Zap, BarChart3, Clock, ChevronRight, ChevronLeft,
  Play, Sparkles, FileText, MessageSquare, Mail, Star, Quote
} from 'lucide-react';

// KONZEPT 5: SWISS INTERACTIVE
// Kombination aus V1 (Swiss Precision) und V4 (Hybrid Premium)
// Helles, elegantes Design mit Gold-Akzenten + Interaktive Elemente

export default function SwissInteractivePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeShowcase, setActiveShowcase] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Spotlight effect (subtle gold version)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  useEffect(() => {
    setIsLoaded(true);
    
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

  const stats = [
    { value: '99.7%', label: 'Präzision', desc: 'bei der Dokumentenerkennung' },
    { value: '< 2s', label: 'Verarbeitung', desc: 'pro Dokument' },
    { value: '150+', label: 'Unternehmen', desc: 'vertrauen uns' },
    { value: '24/7', label: 'Verfügbar', desc: 'ohne Unterbruch' },
  ];

  const features = [
    { icon: Shield, title: 'Swiss Data Protection', desc: 'Ihre Daten bleiben in der Schweiz. Vollständig DSGVO-konform.', highlight: '100%' },
    { icon: Zap, title: 'Intelligente Automation', desc: 'KI-gestützte Verarbeitung von Dokumenten und E-Mails.', highlight: '< 2s' },
    { icon: BarChart3, title: 'Messbare Resultate', desc: 'Durchschnittlich 85% Zeitersparnis im ersten Jahr.', highlight: '280%' },
    { icon: Clock, title: 'Sofort einsatzbereit', desc: 'Integration in bestehende Systeme innerhalb von 48h.', highlight: '48h' },
  ];

  const showcaseSlides = [
    {
      title: "Dashboard",
      desc: "Alle Dokumente auf einen Blick. Echtzeit-Verarbeitung mit Live-Status.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop"
    },
    {
      title: "OCR-Verarbeitung",
      desc: "Automatische Texterkennung mit 99.7% Genauigkeit.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop"
    },
    {
      title: "Chat-Assistent",
      desc: "Intelligente Kundenbetreuung rund um die Uhr.",
      image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=1200&h=800&fit=crop"
    },
  ];

  const testimonials = [
    {
      quote: "Alpha Informatik hat unsere Dokumentenverarbeitung revolutioniert. Die Präzision übertrifft alles, was wir kannten.",
      author: "Thomas Müller",
      role: "CEO",
      company: "Schweizer Versicherung AG",
      metric: "85% Zeitersparnis"
    },
    {
      quote: "Die Integration war reibungslos und der Support erstklassig. Ein echter Partner auf Augenhöhe.",
      author: "Sandra Weber",
      role: "Digitalisierungs-Beauftragte",
      company: "Zürich Treuhand",
      metric: "99.7% Genauigkeit"
    },
    {
      quote: "Endlich eine Lösung, die hält was sie verspricht. Swiss Quality in der Automation.",
      author: "Marc Hofmann",
      role: "Operations Manager",
      company: "Alpine Finance Group",
      metric: "280% ROI"
    },
  ];

  const galleryImages = [
    { src: "https://images.unsplash.com/photo-1541447271487-09612b3f49f7?w=600&h=400&fit=crop", alt: "Schweizer Alpen" },
    { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop", alt: "Modern Office" },
    { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop", alt: "Team Meeting" },
    { src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop", alt: "Tech Setup" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] overflow-x-hidden">
      {/* Subtle spotlight effect (gold tinted) */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${smoothX.get()}px ${smoothY.get()}px, rgba(201, 169, 98, 0.08), transparent 40%)`,
        }}
      />

      {/* Grain texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02] z-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-xl border-b border-[#0A0A0A]/5"
      >
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <Link href="/v5" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-[#0A0A0A] rounded-lg flex items-center justify-center group-hover:bg-[#C9A962] transition-colors">
              <span className="text-white font-bold">α</span>
            </div>
            <span className="font-semibold tracking-tight text-lg">Alpha Informatik</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {['Lösungen', 'Showcase', 'Kunden', 'Kontakt'].map((item) => (
              <Link 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="px-5 py-2 text-sm text-[#0A0A0A]/60 hover:text-[#0A0A0A] hover:bg-[#0A0A0A]/5 rounded-full transition-all"
              >
                {item}
              </Link>
            ))}
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link 
              href="/demo"
              className="group flex items-center space-x-2 bg-[#0A0A0A] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#1A1A1A] transition-all shadow-lg shadow-[#0A0A0A]/10"
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
          className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A962] to-transparent"
        />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-[#0A0A0A]/5 rounded-full px-5 py-2.5 mb-8"
          >
            <span className="w-2 h-2 bg-[#C9A962] rounded-full animate-pulse" />
            <span className="text-sm font-medium">Swiss AI Platform</span>
            <span className="text-[#0A0A0A]/30">•</span>
            <span className="text-sm text-[#0A0A0A]/60">GPT-4 Powered</span>
          </motion.div>

          {/* Main heading */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-4 leading-[1.1]">
              Präzision in
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-8 text-[#0A0A0A]/30">
              jeder Automation.
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl text-[#0A0A0A]/50 max-w-2xl mx-auto mb-12 font-light"
          >
            KI-Agenten, die Ihre Dokumentenprozesse revolutionieren.
            <br />Entwickelt für Schweizer Unternehmen.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/demo"
                className="group flex items-center space-x-3 bg-[#0A0A0A] text-white px-8 py-4 rounded-full text-base font-medium hover:bg-[#1A1A1A] transition-all shadow-xl shadow-[#0A0A0A]/20"
              >
                <span>Live Demo erleben</span>
                <Play className="w-5 h-5 fill-current" />
              </Link>
            </motion.div>
            <Link 
              href="/kontakt"
              className="group flex items-center space-x-3 border-2 border-[#0A0A0A]/10 text-[#0A0A0A]/70 hover:text-[#0A0A0A] px-8 py-4 rounded-full text-base font-medium hover:border-[#C9A962] transition-all"
            >
              <span>Beratung anfragen</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          </div>
      </section>

      {/* Trusted By Logos */}
      <section className="py-12 border-y border-[#0A0A0A]/5">
        <div className="max-w-6xl mx-auto px-8">
          <p className="text-center text-[#0A0A0A]/30 text-sm mb-8">Vertrauen von führenden Schweizer Unternehmen</p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {['Küng Treuhand', 'Bernasconi AG', 'Meier & Partner', 'Huber Logistik', 'Schmid Consulting', 'Berner KMU'].map((company) => (
              <motion.div 
                key={company} 
                whileHover={{ scale: 1.1 }}
                className="text-xl font-semibold text-[#0A0A0A]/20 hover:text-[#C9A962] transition-colors cursor-default"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-[#0A0A0A] text-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-light mb-2 text-[#C9A962]">{stat.value}</div>
                <div className="text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-white/50">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Carousel Section */}
      <section id="showcase" className="py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-sm font-medium text-[#C9A962] tracking-widest uppercase mb-4 block">Live Demo</span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              Sehen Sie es <span className="font-semibold text-[#0A0A0A]/30">in Aktion</span>
            </h2>
            <p className="text-lg text-[#0A0A0A]/50">Entdecken Sie unsere Plattform in verschiedenen Anwendungsszenarien.</p>
          </motion.div>

          {/* Carousel */}
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative aspect-video rounded-3xl overflow-hidden border border-[#0A0A0A]/10 bg-white shadow-2xl"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeShowcase}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <img 
                    src={showcaseSlides[activeShowcase].image}
                    alt={showcaseSlides[activeShowcase].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-2xl font-semibold text-white mb-2">{showcaseSlides[activeShowcase].title}</h3>
                    <p className="text-white/70">{showcaseSlides[activeShowcase].desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              <button 
                onClick={() => setActiveShowcase((prev) => (prev - 1 + showcaseSlides.length) % showcaseSlides.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg"
              >
                <ChevronLeft className="w-6 h-6 text-[#0A0A0A]" />
              </button>
              <button 
                onClick={() => setActiveShowcase((prev) => (prev + 1) % showcaseSlides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg"
              >
                <ChevronRight className="w-6 h-6 text-[#0A0A0A]" />
              </button>
            </motion.div>

            {/* Tab buttons */}
            <div className="flex justify-center items-center space-x-4 mt-8">
              {showcaseSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  onClick={() => setActiveShowcase(index)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all ${
                    activeShowcase === index 
                      ? 'bg-[#0A0A0A] text-white' 
                      : 'bg-[#0A0A0A]/5 text-[#0A0A0A]/60 hover:bg-[#0A0A0A]/10'
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
      <section id="lösungen" className="py-32 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <span className="text-sm font-medium text-[#C9A962] tracking-widest uppercase mb-4 block">Unsere Lösungen</span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
              Exzellenz in <span className="font-semibold text-[#0A0A0A]/30">jedem Detail</span>
            </h2>
            <p className="text-lg text-[#0A0A0A]/50 max-w-2xl mx-auto">
              Massgeschneiderte KI-Lösungen, die sich nahtlos in Ihre bestehenden Prozesse integrieren.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group p-10 bg-white border border-[#0A0A0A]/5 rounded-2xl hover:border-[#C9A962]/30 hover:shadow-xl hover:shadow-[#C9A962]/10 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-[#0A0A0A] rounded-xl flex items-center justify-center group-hover:bg-[#C9A962] transition-colors duration-500">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-3xl font-light text-[#0A0A0A]/10 group-hover:text-[#C9A962]/30 transition-colors">{feature.highlight}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-[#0A0A0A]/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section id="kunden" className="py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-sm font-medium text-[#C9A962] tracking-widest uppercase mb-4 block">Referenzen</span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              Was unsere <span className="font-semibold text-[#0A0A0A]/30">Kunden sagen</span>
            </h2>
            <p className="text-lg text-[#0A0A0A]/50">Über 150 Schweizer Unternehmen vertrauen auf Alpha Informatik.</p>
          </motion.div>

          {/* Testimonial Card */}
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-10 md:p-14 border border-[#0A0A0A]/5 shadow-xl"
              >
                <div className="w-12 h-px bg-[#C9A962] mb-8" />
                
                {/* Stars */}
                <div className="flex space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#C9A962] fill-[#C9A962]" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-[#0A0A0A]/80">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>

                {/* Metric badge */}
                <div className="inline-block bg-[#C9A962]/10 text-[#9A7B4A] px-4 py-2 rounded-full text-sm font-medium mb-8">
                  {testimonials[activeTestimonial].metric}
                </div>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#C9A962] to-[#9A7B4A] rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonials[activeTestimonial].author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonials[activeTestimonial].author}</div>
                    <div className="text-sm text-[#0A0A0A]/50">
                      {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="w-12 h-12 bg-[#0A0A0A]/5 hover:bg-[#0A0A0A]/10 rounded-full flex items-center justify-center transition-all"
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
                      activeTestimonial === index ? 'w-8 bg-[#C9A962]' : 'w-2 bg-[#0A0A0A]/20'
                    }`}
                  />
                ))}
              </div>
              
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="w-12 h-12 bg-[#0A0A0A]/5 hover:bg-[#0A0A0A]/10 rounded-full flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery - Made in Zürich */}
      <section id="galerie" className="py-24 px-8 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              Made in <span className="font-semibold text-[#C9A962]">Zürich</span>
            </h2>
            <p className="text-lg text-[#0A0A0A]/50">Schweizer Qualität. Lokale Präsenz.</p>
          </motion.div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
              <motion.div
                key={img.alt}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`relative overflow-hidden rounded-2xl cursor-pointer ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <img 
                  src={img.src} 
                  alt={img.alt}
                  className={`w-full object-cover ${index === 0 ? 'h-full min-h-[300px]' : 'h-48'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-sm font-medium text-white">{img.alt}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="kontakt" className="py-32 bg-[#0A0A0A] text-white relative overflow-hidden">
        {/* Gold accent blurs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A962]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C9A962]/20 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Sparkles className="w-10 h-10 text-[#C9A962] mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
              Bereit für den
              <br />
              <span className="font-semibold text-white/30">nächsten Schritt?</span>
            </h2>
            <p className="text-xl text-white/50 mb-10 max-w-xl mx-auto">
              Kostenlose Erstberatung. Unverbindlich. Persönlich.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/kontakt"
                  className="group flex items-center space-x-3 bg-[#C9A962] text-[#0A0A0A] px-8 py-4 rounded-full text-base font-semibold hover:bg-[#D4B06E] transition-all"
                >
                  <span>Beratung anfragen</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <Link href="tel:+41783406665" className="text-white/50 hover:text-white transition-colors text-sm">
                oder anrufen: +41 78 340 66 65
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-[#FAFAFA] border-t border-[#0A0A0A]/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-[#0A0A0A] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">α</span>
              </div>
              <span className="font-semibold">Alpha Informatik</span>
            </div>
            <div className="flex items-center space-x-8 text-sm text-[#0A0A0A]/50">
              <Link href="/impressum" className="hover:text-[#0A0A0A] transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-[#0A0A0A] transition-colors">Datenschutz</Link>
              <span>© 2025 Alpha Informatik</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Version indicator */}
      <div className="fixed bottom-4 left-4 bg-gradient-to-r from-[#C9A962] to-[#9A7B4A] text-[#0A0A0A] px-4 py-2 rounded-full text-xs font-bold z-50 flex items-center space-x-2">
        <Sparkles className="w-3 h-3" />
        <span>Konzept 5: Swiss Interactive</span>
      </div>
      
      {/* Navigation to other concepts */}
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
        <Link href="/v4" className="bg-[#0A0A0A]/10 text-[#0A0A0A] px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#0A0A0A]/20 transition-colors">V4</Link>
        <Link href="/v5" className="bg-[#C9A962] text-[#0A0A0A] px-3 py-1.5 rounded-full text-xs font-bold">V5</Link>
        <Link href="/v6" className="bg-[#0A0A0A]/10 text-[#0A0A0A] px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#0A0A0A]/20 transition-colors">V6</Link>
        <Link href="/v7" className="bg-[#0A0A0A]/10 text-[#0A0A0A] px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#0A0A0A]/20 transition-colors">V7</Link>
      </div>
    </div>
  );
}

