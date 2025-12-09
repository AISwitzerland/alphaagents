'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Zap, Shield, Clock,
  MessageSquare, Mail, Brain, Play, Check, Terminal, 
  Cpu, Bot, Binary, Building2, Stethoscope, Scale, 
  Landmark, ShoppingBag, Factory, Scissors, Car, 
  UtensilsCrossed, GraduationCap, Calendar, FileSearch,
  Receipt, Workflow, Users, Headphones, Globe2,
  MessageCircle, Phone, Instagram, Send, Heart,
  ChevronRight, Star, Briefcase, Calculator
} from 'lucide-react';
import { SplineScene } from '@/components/ui/spline-scene';
import { Spotlight } from '@/components/ui/spotlight';
import { Card } from '@/components/ui/card';
import { Globe } from '@/components/ui/globe';

// V9: FULL SERVICE - Automations & AI Chat Agents for all Industries
// Based on V8 design, expanded content

export default function FullServicePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [activeAutomation, setActiveAutomation] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter effect
  const fullText = "KI-Automatisierung für jede Branche";
  useEffect(() => {
    setIsLoaded(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate industries
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndustry((prev) => (prev + 1) % industries.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Industries
  const industries = [
    { 
      icon: Stethoscope, 
      name: 'Gesundheitswesen',
      desc: 'Praxen & Kliniken',
      examples: ['Terminbuchung', 'Patientenkommunikation', 'Rezeptanfragen']
    },
    { 
      icon: Building2, 
      name: 'Immobilien',
      desc: 'Makler & Verwaltungen',
      examples: ['Besichtigungstermine', 'Interessenten-Qualifizierung', 'Exposé-Versand']
    },
    { 
      icon: Scale, 
      name: 'Rechtsanwälte & Notare',
      desc: 'Kanzleien & Notariate',
      examples: ['Mandantenanfragen', 'Dokumentenprüfung', 'Terminkoordination']
    },
    { 
      icon: Landmark, 
      name: 'Finanzdienstleister',
      desc: 'Vermögensberater & Versicherungen',
      examples: ['Kundenberatung', 'Schadenmeldungen', 'Kunden-Onboarding']
    },
    { 
      icon: Calculator, 
      name: 'Buchhaltung & Treuhand',
      desc: 'Buchhalter & Treuhänder',
      examples: ['Belegverarbeitung', 'Rechnungsprüfung', 'Mandantenanfragen']
    },
    { 
      icon: Scissors, 
      name: 'Beauty & Wellness',
      desc: 'Salons & Studios',
      examples: ['Online-Terminbuchung', 'Terminerinnerungen', 'Produktempfehlungen']
    },
    { 
      icon: ShoppingBag, 
      name: 'E-Commerce & Retail',
      desc: 'Online-Shops & Einzelhandel',
      examples: ['Bestellstatus-Anfragen', 'Produktberatung', 'Retouren-Handling']
    },
    { 
      icon: Factory, 
      name: 'Industrie & Produktion',
      desc: 'Fertigung & Logistik',
      examples: ['Auftragsabwicklung', 'Lieferantenkommunikation', 'Qualitätsmeldungen']
    },
  ];

  // Automation Services
  const automations = [
    {
      icon: Mail,
      title: 'Email-Automatisierung',
      desc: 'Intelligente Klassifizierung & Auto-Antworten',
      stats: '80% Zeitersparnis',
      details: 'Automatische Kategorisierung eingehender Mails, smarte Antwortvorschläge und vollautomatische Beantwortung von Standardanfragen.'
    },
    {
      icon: Users,
      title: 'Lead-Generierung',
      desc: 'Qualifizierung & Nurturing',
      stats: '3x mehr Leads',
      details: 'KI-gestützte Lead-Bewertung, automatische Follow-ups und personalisierte Ansprache für höhere Conversion.'
    },
    {
      icon: Calendar,
      title: 'Termin-Buchung',
      desc: '24/7 Online-Reservierung',
      stats: '0 No-Shows',
      details: 'Nahtlose Integration in Ihren Kalender, automatische Erinnerungen und intelligente Terminvorschläge.'
    },
    {
      icon: Headphones,
      title: 'Kundensupport',
      desc: 'First-Level automatisiert',
      stats: '70% entlastet',
      details: 'Sofortige Beantwortung häufiger Fragen, Ticket-Erstellung und nahtlose Übergabe an Mitarbeiter bei komplexen Anfragen.'
    },
    {
      icon: Workflow,
      title: 'Workflow-Automatisierung',
      desc: 'Prozesse digitalisieren',
      stats: '50% schneller',
      details: 'Automatisierte Freigabeprozesse, Benachrichtigungen und dokumentierte Arbeitsabläufe ohne manuelle Eingriffe.'
    },
    {
      icon: FileSearch,
      title: 'Datenextraktion',
      desc: 'OCR & Dokumentenanalyse',
      stats: '99.7% Genauigkeit',
      details: 'Automatische Erfassung von Rechnungsdaten, Vertragsklauseln und Formularen mit KI-gestützter Validierung.'
    },
    {
      icon: Receipt,
      title: 'Rechnungsverarbeitung',
      desc: 'Kreditorenbuchhaltung',
      stats: '<2s pro Rechnung',
      details: 'Vollautomatische Erfassung, Prüfung und Verbuchung eingehender Rechnungen mit Freigabe-Workflow.'
    },
  ];

  // AI Chat Agent Channels
  const chatChannels = [
    { icon: Globe2, name: 'Website', desc: 'Eingebetteter Chat' },
    { icon: MessageCircle, name: 'WhatsApp', desc: 'Business API' },
    { icon: Instagram, name: 'Social Media', desc: 'DM Automation' },
    { icon: Phone, name: 'Telefon', desc: 'Voice AI (Coming)' },
  ];

  // Industry-specific Chat Bots
  const chatBots = [
    { name: 'Beauty', icon: Scissors, color: 'from-pink-500 to-rose-500' },
    { name: 'Fitness', icon: Heart, color: 'from-green-500 to-emerald-500' },
    { name: 'Fahrschule', icon: GraduationCap, color: 'from-blue-500 to-cyan-500' },
    { name: 'Tech', icon: Cpu, color: 'from-violet-500 to-purple-500' },
    { name: 'Marketing', icon: Sparkles, color: 'from-orange-500 to-amber-500' },
    { name: 'Immobilien', icon: Building2, color: 'from-cyan-500 to-teal-500' },
    { name: 'Restaurant', icon: UtensilsCrossed, color: 'from-red-500 to-orange-500' },
    { name: 'Autohaus', icon: Car, color: 'from-slate-500 to-zinc-500' },
  ];

  // USPs
  const usps = [
    { icon: Shield, title: 'Swiss Hosting', desc: 'Alle Daten in der Schweiz' },
    { icon: Headphones, title: 'Persönlicher Support', desc: 'Direkter Ansprechpartner' },
    { icon: Zap, title: 'Schnelle Umsetzung', desc: 'Live in wenigen Tagen' },
    { icon: Star, title: 'Massgeschneidert', desc: 'Auf Ihre Branche abgestimmt' },
  ];

  // Stats
  const stats = [
    { value: '99.7%', label: 'KI-Genauigkeit' },
    { value: '24/7', label: 'Erreichbarkeit' },
    { value: '80%', label: 'Zeitersparnis' },
    { value: '100%', label: 'Swiss Made' },
  ];

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    interest: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.name.split(' ')[0] || formData.name,
          lastName: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          interest: formData.interest,
          message: formData.message,
          privacy: true
        }),
      });
      
      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', company: '', phone: '', interest: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };


  // Typing cursor
  const TypingCursor = () => (
    <motion.span
      className="inline-block w-0.5 h-8 bg-cyan-400 ml-1"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    />
  );

  // Glowing text effect
  const GlowText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <span className={`relative ${className}`}>
      <span className="absolute blur-2xl opacity-50 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        {children}
      </span>
      <span className="relative bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
        {children}
      </span>
    </span>
  );

  // Animated border card
  const CyberCard = ({ children, className = '', glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) => (
    <div className={`relative group ${className}`}>
      {glow && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
      )}
      <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden group-hover:border-cyan-500/50 transition-all duration-300">
        {children}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        <motion.div 
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
            left: '10%',
            top: '20%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            right: '10%',
            bottom: '20%',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* CSS Keyframes */}
      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 40px rgba(6, 182, 212, 0.6); }
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-2xl rounded-2xl px-6 py-4 border border-slate-700/50">
            <Link href="/v9" className="flex items-center space-x-3 group">
              <div className="relative">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-lg opacity-50"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Binary className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="font-bold text-lg tracking-tight">
                Alpha <span className="text-cyan-400">Informatik</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {['Branchen', 'Automationen', 'Chat Agents', 'Kontakt'].map((item) => (
                <Link 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>

            <Link 
              href="/v7/demo" 
              className="relative group px-6 py-2.5 rounded-xl text-sm font-medium overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:from-cyan-400 group-hover:to-blue-400 transition-all" />
              <span className="relative flex items-center space-x-2 text-white">
                <Bot className="w-4 h-4" />
                <span>Demo testen</span>
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <Card className="w-full min-h-[600px] bg-black/[0.96] relative overflow-hidden border-slate-800">
            <Spotlight
              className="from-cyan-500/20 via-blue-500/20 to-violet-500/20"
              size={400}
            />
            
            <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
              {/* Left content */}
              <div className="flex-1 p-8 lg:p-12 relative z-10 flex flex-col justify-center">
                {/* Status Badge */}
                <motion.div 
                  className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-8 w-fit"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  <span className="text-sm text-cyan-400">Swiss AI Solutions</span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  <span className="text-white">Smarte Lösungen</span>
                  <br />
                  <span className="text-white">für </span>
                  <GlowText className="text-4xl md:text-5xl lg:text-6xl font-bold">
                    Ihr Business
                  </GlowText>
                </h1>

                {/* Typewriter subtitle */}
                <div className="h-12 mb-8">
                  <p className="text-lg text-slate-400">
                    <span className="text-cyan-400">→</span> {typedText}
                    <TypingCursor />
                  </p>
                </div>

                {/* Active Industry Showcase */}
                <motion.div 
                  className="mb-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                  key={activeIndustry}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    {(() => {
                      const Icon = industries[activeIndustry].icon;
                      return <Icon className="w-6 h-6 text-cyan-400" />;
                    })()}
                    <span className="font-semibold text-white">{industries[activeIndustry].name}</span>
                    <span className="text-sm text-slate-500">• {industries[activeIndustry].desc}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {industries[activeIndustry].examples.map((ex, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-full">
                        {ex}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/v7/demo"
                    className="group relative px-8 py-4 rounded-xl font-medium overflow-hidden"
                    style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <span className="relative flex items-center space-x-2 text-white">
                      <Play className="w-5 h-5 fill-current" />
                      <span>Jetzt Demo testen</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  
                  <Link 
                    href="#branchen"
                    className="px-8 py-4 rounded-xl font-medium border border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all"
                  >
                    <span className="flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-cyan-400" />
                      <span>Alle Branchen</span>
                    </span>
                  </Link>
                </div>
              </div>

              {/* Right content - 3D Spline Scene */}
              <div className="flex-1 relative min-h-[400px] lg:min-h-0">
                <SplineScene 
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-slate-900/50 rounded-2xl border border-slate-800"
              >
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="branchen" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-sm text-cyan-400 mb-4 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                Branchenlösungen
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Für <GlowText>jede Branche</GlowText> die passende Lösung
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Unsere KI-Lösungen sind speziell auf die Anforderungen verschiedener Branchen zugeschnitten.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard glow className="h-full">
                  <div className="p-6 flex flex-col h-full min-h-[200px]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-cyan-500/30 flex items-center justify-center">
                        <industry.icon className="w-6 h-6 text-cyan-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-1 text-white">{industry.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">{industry.desc}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {industry.examples.map((ex, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-slate-800/50 text-slate-400 rounded-full border border-slate-700/50">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </CyberCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Automations Section */}
      <section id="automationen" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-sm text-cyan-400 mb-4 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                Automatisierungen
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                <GlowText>Repetitive Tasks</GlowText> automatisieren
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Von E-Mail bis Rechnungsverarbeitung – wir automatisieren Ihre zeitintensiven Prozesse.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automations.map((auto, index) => (
              <motion.div
                key={auto.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard 
                  glow 
                  className="h-full cursor-pointer"
                >
                  <div 
                    className="p-6"
                    onClick={() => setActiveAutomation(activeAutomation === index ? null : index)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-cyan-500/30 flex items-center justify-center">
                        <auto.icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <span className="text-xs text-cyan-400 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                        {auto.stats}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{auto.title}</h3>
                    <p className="text-sm text-slate-400 mb-3">{auto.desc}</p>
                    
                    <AnimatePresence>
                      {activeAutomation === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 border-t border-slate-700/50">
                            <p className="text-sm text-slate-500">{auto.details}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center text-cyan-400 text-sm mt-3">
                      <span>Details</span>
                      <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${activeAutomation === index ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                </CyberCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat Agents Section */}
      <section id="chat-agents" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-sm text-cyan-400 mb-4 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                KI Chat Agents
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                <GlowText>24/7 erreichbar</GlowText> auf allen Kanälen
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Unsere KI-Chat-Agenten betreuen Ihre Kunden rund um die Uhr – auf Website, WhatsApp und Social Media.
              </p>
            </motion.div>
          </div>

          {/* Channels */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {chatChannels.map((channel, index) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 text-center hover:border-cyan-500/50 transition-all"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <channel.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">{channel.name}</h3>
                <p className="text-xs text-slate-500">{channel.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Bot Types */}
          <div className="mb-8">
            <h3 className="text-center text-lg text-slate-400 mb-8">Branchenspezifische Chat Bots</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {chatBots.map((bot, index) => (
                <motion.div
                  key={bot.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 hover:border-cyan-500/50 transition-all cursor-pointer"
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${bot.color} flex items-center justify-center`}>
                    <bot.icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{bot.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Demo CTA */}
          <div className="text-center">
            <Link 
              href="/v7/demo"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white font-medium hover:from-cyan-400 hover:to-blue-400 transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat Bots live testen</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Globe Section - Swiss Made */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Globe */}
            <motion.div 
              className="relative h-[500px]"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="w-80 h-80 rounded-full bg-cyan-500/20 blur-[100px]"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </div>
              
              <Globe className="opacity-90" />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  className="w-[350px] h-[350px] border border-cyan-500/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-[280px] h-[280px] border border-violet-500/20 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-center bg-slate-900/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-cyan-500/30">
                  <span className="text-sm font-semibold text-cyan-400">Zürich HQ</span>
                  <p className="text-xs text-slate-500">Swiss Quality</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: USPs */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-sm text-cyan-400 mb-4 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                Warum Alpha Informatik?
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                <GlowText>Schweizer Qualität</GlowText>
                <br />
                <span className="text-white">& persönlicher Service</span>
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Wir sind keine anonyme Plattform – bei uns bekommen Sie einen persönlichen Ansprechpartner, 
                der Ihre Branche versteht und Sie durch den gesamten Prozess begleitet.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {usps.map((usp, i) => (
                  <motion.div
                    key={usp.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <usp.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{usp.title}</h4>
                      <p className="text-xs text-slate-500">{usp.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section with Form */}
      <section id="kontakt" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm text-cyan-400 mb-4 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20">
              Kontakt
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              <GlowText>Kostenlose Beratung</GlowText> anfragen
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Erzählen Sie uns von Ihrem Business – wir zeigen Ihnen, wie unsere KI-Lösungen Ihre Prozesse revolutionieren können.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Globe & Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Globe */}
              <div className="relative h-[350px] mb-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="w-64 h-64 rounded-full bg-cyan-500/20 blur-[80px]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </div>
                <Globe className="opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    className="w-[280px] h-[280px] border border-cyan-500/20 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="text-center bg-slate-900/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-cyan-500/30">
                    <span className="text-sm font-semibold text-cyan-400">Zürich HQ</span>
                    <p className="text-xs text-slate-500">Swiss Made</p>
                  </div>
                </motion.div>
              </div>

              {/* Contact Quick Links */}
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  href="mailto:info@alphainformatik.ch"
                  className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all"
                >
                  <Mail className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium text-white">E-Mail</p>
                    <p className="text-xs text-slate-500">info@alphainformatik.ch</p>
                  </div>
                </Link>

                <Link 
                  href="tel:+41783406665"
                  className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all"
                >
                  <Phone className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Telefon</p>
                    <p className="text-xs text-slate-500">+41 78 340 66 65</p>
                  </div>
                </Link>

                <Link 
                  href="https://wa.me/41783406665"
                  target="_blank"
                  className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium text-white">WhatsApp</p>
                    <p className="text-xs text-slate-500">Chat starten</p>
                  </div>
                </Link>

                <div className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <Globe2 className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Standort</p>
                    <p className="text-xs text-slate-500">Zürich, Schweiz</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <CyberCard glow>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Nachricht senden</h3>
                  
                  {formStatus === 'success' ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-8 h-8 text-green-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">Vielen Dank!</h4>
                      <p className="text-slate-400 mb-6">Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
                      <button
                        onClick={() => setFormStatus('idle')}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        Neue Nachricht senden
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">Name *</label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleFormChange}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                            placeholder="Max Muster"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">E-Mail *</label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleFormChange}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                            placeholder="max@firma.ch"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">Unternehmen</label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleFormChange}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                            placeholder="Firma AG"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">Telefon</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleFormChange}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                            placeholder="+41 79 123 45 67"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Interesse</label>
                        <select
                          name="interest"
                          value={formData.interest}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors"
                        >
                          <option value="">Bitte wählen...</option>
                          <option value="chat">KI-Chat-Assistenten</option>
                          <option value="email">E-Mail-Automatisierung</option>
                          <option value="workflow">Workflow-Automatisierung</option>
                          <option value="ocr">Dokumentenverarbeitung</option>
                          <option value="custom">Individuelle Lösung</option>
                          <option value="demo">Live-Demo anfragen</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Nachricht *</label>
                        <textarea
                          name="message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                          placeholder="Beschreiben Sie kurz Ihr Anliegen..."
                        />
                      </div>

                      {formStatus === 'error' && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                          Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={formStatus === 'loading'}
                        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        {formStatus === 'loading' ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Wird gesendet...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Nachricht senden</span>
                          </>
                        )}
                      </button>

                      <p className="text-xs text-slate-500 text-center">
                        Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu.
                      </p>
                    </form>
                  )}
                </div>
              </CyberCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
          <span>© 2025 Alpha Informatik AG • Zürich</span>
          <span className="flex items-center space-x-2 mt-4 md:mt-0">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>100% Swiss Hosting</span>
          </span>
        </div>
      </footer>

      {/* Version Indicator */}
      <div className="fixed bottom-4 left-4 bg-slate-900 text-cyan-400 px-4 py-2 rounded-full text-xs z-50 flex items-center space-x-2 border border-cyan-500/30">
        <Sparkles className="w-3 h-3" />
        <span>V9: Full Service</span>
      </div>
      
      {/* Version Navigation */}
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
        {['V4', 'V6', 'V7', 'V8', 'V9'].map((v) => (
          <Link 
            key={v}
            href={`/${v.toLowerCase()}`} 
            className={`px-3 py-1.5 rounded-full text-xs transition-all ${
              v === 'V9' 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                : 'bg-slate-800/50 text-slate-500 hover:bg-slate-700/50'
            }`}
          >
            {v}
          </Link>
        ))}
      </div>
    </div>
  );
}

