'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useScroll } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Zap, Shield, Clock,
  FileText, MessageSquare, Mail, Brain, Play, Star,
  ChevronRight, Check
} from 'lucide-react';

// KONZEPT 7: AURORA PREMIUM - REFINED
// Dezente Farben (Navy/Champagner), weniger Animation, elegant

export default function AuroraPremiumPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for 3D effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // No particles - just set loaded
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // No auto-rotate - hover only

  const features = [
    { 
      icon: FileText, 
      title: 'Document AI', 
      desc: '99.7% Genauigkeit', 
      color: '#B8A878', 
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      fullDesc: 'Unser Document AI nutzt GPT-4 Vision, um Dokumente mit 99.7% Genauigkeit zu analysieren. Von Rechnungen über Verträge bis zu handschriftlichen Notizen - wir extrahieren alle relevanten Daten automatisch und strukturiert.'
    },
    { 
      icon: MessageSquare, 
      title: 'Chat Agent', 
      desc: '24/7 verfügbar', 
      color: '#B8A878', 
      image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=400&h=300&fit=crop',
      fullDesc: 'Der Chat Agent beantwortet Kundenanfragen rund um die Uhr in natürlicher Sprache. Er versteht Kontext, lernt aus Interaktionen und kann Termine vereinbaren, Offerten erstellen und komplexe Fragen beantworten.'
    },
    { 
      icon: Mail, 
      title: 'Email Agent', 
      desc: 'Auto-Klassifizierung', 
      color: '#B8A878', 
      image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop',
      fullDesc: 'Der Email Agent klassifiziert eingehende E-Mails automatisch, extrahiert Anhänge zur Verarbeitung und kann intelligente Antworten generieren. Reduzieren Sie Ihre E-Mail-Bearbeitungszeit um bis zu 80%.'
    },
    { 
      icon: Brain, 
      title: 'Multi-Agent', 
      desc: 'Orchestrierung', 
      color: '#B8A878', 
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
      fullDesc: 'Das Multi-Agent System koordiniert alle KI-Agenten intelligent. Es entscheidet, welcher Agent für welche Aufgabe zuständig ist, und sorgt für nahtlose Zusammenarbeit zwischen Document AI, Chat und Email Agent.'
    },
  ];

  const stats = [
    { value: '99.7%', label: 'Präzision', icon: Sparkles },
    { value: '<2s', label: 'Verarbeitung', icon: Zap },
    { value: '100%', label: 'Swiss Hosted', icon: Shield },
    { value: '24/7', label: 'Verfügbar', icon: Clock },
  ];

  // Simple Card wrapper - no 3D effects
  const TiltCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    return <div className={className}>{children}</div>;
  };

  // Simple Button Component - no magnetic effect
  const MagneticButton = ({ children, href, className = '', primary = false }: { 
    children: React.ReactNode; 
    href: string; 
    className?: string;
    primary?: boolean;
  }) => {
    return (
      <a
        href={href}
        className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
      >
        {primary && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#B8A878] to-[#9A8A68]" />
        )}
        <span className="relative flex items-center space-x-2">{children}</span>
      </a>
    );
  };

  // Animated Text Component
  const AnimatedText = ({ text, className = '' }: { text: string; className?: string }) => {
    return (
      <span className={className}>
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    );
  };

  // Simple wrapper - no floating animation
  const FloatingElement = ({ children }: { children: React.ReactNode; delay?: number }) => {
    return <div>{children}</div>;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A1628] text-white overflow-x-hidden">
      {/* Animated Background - Professional Navy/Gold */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Static Gradient - No animation */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(30, 58, 95, 0.4), transparent 50%)'
          }}
        />

        {/* Static Orbs - Subtle background */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#1E3A5F]/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#B8A878]/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-[#1E3A5F]/15 rounded-full blur-[128px]" />

        {/* No particles - clean background */}

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* No cursor glow - clean design */}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0A1628]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-2xl rounded-2xl px-6 py-4 border border-white/10">
            <Link href="/v7" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#B8A878] to-[#9A8A68] rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-[#B8A878] to-[#9A8A68] rounded-xl flex items-center justify-center">
                  <span className="text-[#0A1628] font-bold text-lg">α</span>
                </div>
              </div>
              <span className="font-semibold text-lg">Alpha Informatik</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {[
                { name: 'Features', href: '#features' },
                { name: 'Demo', href: '/v7/demo' },
                { name: 'Team', href: '/v7/team' },
                { name: 'Kontakt', href: '#kontakt' },
              ].map((item, i) => (
                <div key={item.name}>
                  <Link 
                    href={item.href} 
                    className="px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>

            <MagneticButton 
              href="/demo" 
              primary
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Demo starten</span>
            </MagneticButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-[#B8A878]/10 border border-[#B8A878]/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-[#B8A878]" />
                <span className="text-sm font-medium text-[#B8A878]">GPT-4 Vision Powered</span>
                <span className="w-2 h-2 bg-emerald-400/70 rounded-full" />
              </div>

              {/* Main Heading */}
              <div className="mb-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
                  Die Zukunft der
                </h1>
                <div className="relative">
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-[#B8A878] via-[#C4B898] to-[#B8A878] bg-clip-text text-transparent">
                    Automation
                  </span>
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#B8A878]/40">.</span>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-xl text-white/40 mb-10 max-w-xl leading-relaxed">
                KI-Agenten, die Ihre Dokumentenprozesse verstehen, lernen und 
                optimieren. Entwickelt in der Schweiz.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                <MagneticButton 
                  href="/demo" 
                  primary
                  className="px-8 py-4 rounded-2xl text-base font-medium text-white"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Live Demo erleben</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
                
                <MagneticButton 
                  href="/kontakt"
                  className="px-8 py-4 rounded-2xl text-base font-medium border border-white/20 hover:bg-white/10 transition-all"
                >
                  <span>Gespräch vereinbaren</span>
                </MagneticButton>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6">
                {['Swiss Hosted', 'DSGVO-konform', 'Enterprise Ready'].map((badge) => (
                  <div key={badge} className="flex items-center space-x-2 text-sm text-white/40">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Feature Cards with Images */}
            <div className="relative">
              {/* Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F]/20 via-[#B8A878]/10 to-[#1E3A5F]/20 rounded-3xl blur-3xl" />
              
              {/* Card Grid */}
              <div className="relative grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={feature.title}
                    onClick={() => setSelectedFeature(index)}
                    className="group relative rounded-2xl bg-white/5 backdrop-blur-xl border-2 border-white/10 cursor-pointer overflow-hidden transition-all duration-300 hover:border-[#B8A878] hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#B8A878]/20"
                  >
                    {/* Feature Image */}
                    <div className="relative h-24 overflow-hidden">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent" />
                    </div>
                    
                    <div className="p-4">
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 -mt-8 relative z-10 transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${feature.color}, ${feature.color}99)` }}
                      >
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="font-semibold mb-1 text-sm transition-colors duration-300 group-hover:text-[#B8A878]">{feature.title}</h3>
                      <p className="text-xs text-white/40">{feature.desc}</p>
                    </div>
                    
                    {/* Click hint */}
                    <div className="absolute top-2 right-2 text-xs text-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      Klicken für Details
                    </div>
                    
                    {/* Hover Indicator - Gold line at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#B8A878] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                ))}
              </div>

              {/* Feature Detail Modal */}
              {selectedFeature !== null && (
                <div 
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                  onClick={() => setSelectedFeature(null)}
                >
                  <div 
                    className="relative max-w-lg w-full bg-[#0A1628] border border-[#B8A878]/30 rounded-3xl overflow-hidden shadow-2xl shadow-[#B8A878]/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={features[selectedFeature].image} 
                        alt={features[selectedFeature].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/50 to-transparent" />
                      
                      {/* Close Button */}
                      <button 
                        onClick={() => setSelectedFeature(null)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    
                    {/* Modal Content */}
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${features[selectedFeature].color}, ${features[selectedFeature].color}99)` }}
                        >
                          {(() => {
                            const IconComponent = features[selectedFeature].icon;
                            return <IconComponent className="w-7 h-7 text-white" />;
                          })()}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{features[selectedFeature].title}</h3>
                          <p className="text-[#B8A878]">{features[selectedFeature].desc}</p>
                        </div>
                      </div>
                      
                      <p className="text-white/70 leading-relaxed mb-6">
                        {features[selectedFeature].fullDesc}
                      </p>
                      
                      <button 
                        onClick={() => setSelectedFeature(null)}
                        className="w-full py-3 bg-gradient-to-r from-[#B8A878] to-[#9A8A68] text-[#0A1628] font-semibold rounded-xl hover:opacity-90 transition-opacity"
                      >
                        Verstanden
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </section>

      {/* Stats Section with 3D Cards */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block text-sm font-medium text-[#B8A878] mb-4 px-4 py-2 bg-[#B8A878]/10 rounded-full border border-[#B8A878]/20">
              Warum Alpha Informatik?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Gebaut für{' '}
              <span className="bg-gradient-to-r from-[#B8A878] to-[#C4B898] bg-clip-text text-transparent">
                Exzellenz
              </span>
            </h2>
          </div>

          {/* 3D Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <TiltCard>
                  <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 text-center overflow-hidden hover:border-white/20 transition-colors">
                    {/* Icon */}
                    <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B8A878]/15 to-[#1E3A5F]/15 flex items-center justify-center">
                      <stat.icon className="w-7 h-7 text-[#B8A878]/80" />
                    </div>
                    
                    {/* Value */}
                    <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    
                    {/* Label */}
                    <div className="text-sm text-white/40">
                      {stat.label}
                    </div>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Sehen Sie es{' '}
              <span className="bg-gradient-to-r from-[#B8A878] to-[#C4B898] bg-clip-text text-transparent">
                in Aktion
              </span>
            </h2>
          </div>

          {/* Browser Mockup */}
          <div className="relative">
            <TiltCard className="mx-auto max-w-5xl">
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
                {/* Glow */}
                <div className="absolute -inset-px bg-gradient-to-r from-[#B8A878]/50 via-[#9A8A68]/50 to-[#B8A878]/50 rounded-3xl blur-sm opacity-50" />
                
                {/* Content */}
                <div className="relative">
                  {/* Browser Header */}
                  <div className="h-12 bg-black/50 backdrop-blur-xl flex items-center px-4 space-x-3 border-b border-white/10">
                    <div className="flex space-x-2">
                      <motion.div whileHover={{ scale: 1.2 }} className="w-3 h-3 rounded-full bg-red-500/80" />
                      <motion.div whileHover={{ scale: 1.2 }} className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <motion.div whileHover={{ scale: 1.2 }} className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-white/5 rounded-lg px-4 py-1 text-xs text-white/40 flex items-center space-x-2">
                        <span>🔒</span>
                        <span>app.alphainformatik.ch</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Demo Content - Real Dashboard Image */}
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop"
                      alt="Alpha Informatik Dashboard"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/80 via-transparent to-transparent" />
                    
                    {/* Center Play Button */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#B8A878]/30 rounded-full blur-xl" />
                        <div className="relative w-20 h-20 bg-gradient-to-r from-[#B8A878] to-[#9A8A68] rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#B8A878]/50 transition-shadow">
                          <Play className="w-8 h-8 text-[#0A1628] fill-current ml-1" />
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Caption */}
                    <div className="absolute bottom-6 left-6">
                      <span className="text-lg font-semibold">Live Dashboard Demo</span>
                      <p className="text-sm text-white/60">Sehen Sie unsere Plattform in Aktion</p>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-medium text-[#B8A878] mb-4">Kundenstimmen</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Geliebt von{' '}
              <span className="bg-gradient-to-r from-[#B8A878] to-[#C4B898] bg-clip-text text-transparent">
                Innovatoren
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Die beste KI-Lösung auf dem Schweizer Markt.", author: "Sandra W.", role: "CTO", stars: 5 },
              { quote: "Hat unsere Prozesse revolutioniert. Unglaublich schnell.", author: "Marc H.", role: "Operations", stars: 5 },
              { quote: "Endlich eine Lösung, der wir vertrauen können.", author: "Lisa B.", role: "CISO", stars: 5 },
            ].map((testimonial) => (
              <div key={testimonial.author}>
                <TiltCard>
                  <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 h-full hover:border-white/20 transition-colors">
                    {/* Stars */}
                    <div className="flex space-x-1 mb-6">
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-[#B8A878]/60 fill-[#B8A878]/60" />
                      ))}
                    </div>
                    
                    <blockquote className="text-lg font-medium mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#B8A878] to-[#9A8A68] rounded-full flex items-center justify-center text-[#0A1628] font-bold">
                        {testimonial.author[0]}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-sm text-white/40">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Made in <span className="text-[#B8A878]">Zürich</span>
            </h2>
            <p className="text-lg text-white/40">Schweizer Qualität. Lokale Präsenz.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: 'https://images.unsplash.com/photo-1541447271487-09612b3f49f7?w=600&h=400&fit=crop', alt: 'Schweizer Alpen', span: 'md:col-span-2 md:row-span-2' },
              { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', alt: 'Modern Office' },
              { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop', alt: 'Team Collaboration' },
              { src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop', alt: 'Tech Innovation' },
              { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', alt: 'Data Analytics' },
            ].map((img) => (
              <div
                key={img.alt}
                className={`relative overflow-hidden rounded-2xl group ${img.span || ''}`}
              >
                <img 
                  src={img.src} 
                  alt={img.alt}
                  className={`w-full object-cover ${img.span ? 'h-full min-h-[300px]' : 'h-48'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-sm font-medium text-white/80">{img.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="kontakt" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <TiltCard>
            <div className="relative overflow-hidden rounded-[3rem] p-12 md:p-20">
              {/* Static Gradient Background */}
              <div 
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2A4A6F 50%, #1E3A5F 100%)' }}
              />
              
              {/* Overlay Pattern */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at center, white 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 mx-auto mb-8">
                  <div className="w-full h-full bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Bereit für die Zukunft?
                </h2>
                <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                  Starten Sie heute mit einer kostenlosen Demo.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <MagneticButton 
                    href="/demo"
                    className="bg-white text-[#0A1628] px-8 py-4 rounded-2xl text-base font-semibold shadow-2xl"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>Demo starten</span>
                  </MagneticButton>
                  <Link 
                    href="tel:+41783406665"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    oder anrufen: <span className="font-semibold">+41 78 340 66 65</span>
                  </Link>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/40 text-sm">
          © 2025 Alpha Informatik · Swiss Made with ❤️
        </div>
      </footer>

      {/* Version Indicator */}
      <div className="fixed bottom-4 left-4 bg-[#1E3A5F] text-[#B8A878] px-4 py-2 rounded-full text-xs font-medium z-50 flex items-center space-x-2 border border-[#B8A878]/20">
        <Sparkles className="w-3 h-3" />
        <span>V7: Refined</span>
      </div>
      
      {/* Version Navigation */}
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
        {['V4', 'V5', 'V6', 'V7'].map((v) => (
          <Link 
            key={v}
            href={`/${v.toLowerCase()}`} 
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              v === 'V7' 
                ? 'bg-[#B8A878]/20 text-[#B8A878] border border-[#B8A878]/30' 
                : 'bg-white/5 text-white/40 hover:bg-white/10'
            }`}
          >
            {v}
          </Link>
        ))}
      </div>
    </div>
  );
}
