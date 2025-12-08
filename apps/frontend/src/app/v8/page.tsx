'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, AnimatePresence, useTransform } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Zap, Shield, Clock,
  FileText, MessageSquare, Mail, Brain, Play, Star,
  ChevronRight, Check, Terminal, Cpu, Database, Network,
  Code2, Bot, Braces, Binary
} from 'lucide-react';

// V8: CYBER AI - DARK TECH THEME
// Animated grid, spotlight effect, glowing elements, matrix-style

export default function CyberAIPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [typedText, setTypedText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  // Typewriter effect
  const fullText = "Intelligente Automatisierung für Schweizer Unternehmen";
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

  // Mouse move handler for spotlight
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Auto-rotate features
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { 
      icon: FileText, 
      title: 'Document AI', 
      desc: 'OCR & Datenextraktion mit 99.7% Genauigkeit',
      gradient: 'from-cyan-500 to-blue-500',
      stats: '< 2s pro Dokument'
    },
    { 
      icon: MessageSquare, 
      title: 'Chat Agent', 
      desc: 'Natürliche Konversation powered by GPT-4',
      gradient: 'from-violet-500 to-purple-500',
      stats: '24/7 verfügbar'
    },
    { 
      icon: Mail, 
      title: 'Email Agent', 
      desc: 'Automatische Klassifizierung & Antworten',
      gradient: 'from-emerald-500 to-teal-500',
      stats: '80% Zeitersparnis'
    },
    { 
      icon: Brain, 
      title: 'Multi-Agent System', 
      desc: 'Orchestrierte KI-Agenten für komplexe Tasks',
      gradient: 'from-orange-500 to-red-500',
      stats: 'Enterprise Ready'
    },
  ];

  const stats = [
    { value: '99.7%', label: 'Genauigkeit', icon: Cpu },
    { value: '<2s', label: 'Latenz', icon: Zap },
    { value: '100%', label: 'Swiss Cloud', icon: Shield },
    { value: '24/7', label: 'Uptime', icon: Clock },
  ];

  const techStack = [
    { icon: Terminal, name: 'GPT-4 Vision' },
    { icon: Database, name: 'Supabase' },
    { icon: Network, name: 'LangChain' },
    { icon: Code2, name: 'Next.js' },
    { icon: Bot, name: 'AI Agents' },
    { icon: Braces, name: 'TypeScript' },
  ];

  // Animated Grid Background
  const GridBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black" />
      
      {/* Animated grid */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}
      />
      
      {/* Glowing orbs */}
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

      {/* Scan lines effect */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />
    </div>
  );

  // Spotlight that follows cursor
  const Spotlight = () => (
    <motion.div
      className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-30"
      style={{
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
        x: useTransform(smoothMouseX, (x) => x - 300),
        y: useTransform(smoothMouseY, (y) => y - 300),
      }}
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

  // Typing cursor
  const TypingCursor = () => (
    <motion.span
      className="inline-block w-0.5 h-8 bg-cyan-400 ml-1"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    />
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-x-hidden">
      <GridBackground />
      <Spotlight />

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
          50% { box-shadow: 0 0 40px rgba(6, 182, 212, 0.6); }
        }
        @keyframes data-stream {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-2xl rounded-2xl px-6 py-4 border border-slate-700/50">
            <Link href="/v8" className="flex items-center space-x-3 group">
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
              <span className="font-mono font-bold text-lg tracking-tight">
                <span className="text-cyan-400">&lt;</span>
                Alpha
                <span className="text-cyan-400">/&gt;</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {['Features', 'Tech', 'Demo', 'Kontakt'].map((item) => (
                <Link 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-cyan-400 font-mono transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>

            <Link 
              href="/demo" 
              className="relative group px-6 py-2.5 rounded-xl text-sm font-medium overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:from-cyan-400 group-hover:to-blue-400 transition-all" />
              <span className="relative flex items-center space-x-2 text-white">
                <Terminal className="w-4 h-4" />
                <span className="font-mono">./start_demo</span>
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div 
              className="relative z-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Status Badge */}
              <motion.div 
                className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-sm font-mono text-cyan-400">System Online</span>
                <span className="text-xs text-slate-500">v4.2.1</span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="text-white">KI-Agenten für</span>
                <br />
                <GlowText className="text-5xl md:text-6xl lg:text-7xl font-bold">
                  Enterprise
                </GlowText>
              </h1>

              {/* Typewriter subtitle */}
              <div className="h-12 mb-8">
                <p className="text-xl text-slate-400 font-mono">
                  <span className="text-cyan-400">$</span> {typedText}
                  <TypingCursor />
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link 
                  href="/demo"
                  className="group relative px-8 py-4 rounded-xl font-medium overflow-hidden"
                  style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500" />
                  <span className="relative flex items-center space-x-2 text-white">
                    <Play className="w-5 h-5 fill-current" />
                    <span>Live Demo</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                
                <Link 
                  href="#features"
                  className="px-8 py-4 rounded-xl font-medium border border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all"
                >
                  <span className="flex items-center space-x-2">
                    <Code2 className="w-5 h-5 text-cyan-400" />
                    <span>Erkunden</span>
                  </span>
                </Link>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-full text-xs font-mono text-slate-400"
                  >
                    <tech.icon className="w-3 h-3 text-cyan-400" />
                    <span>{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Feature Cards */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Terminal-style container */}
              <CyberCard glow>
                {/* Terminal header */}
                <div className="flex items-center space-x-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="flex-1 text-center text-xs font-mono text-slate-500">ai-agents.tsx</span>
                </div>

                {/* Feature list */}
                <div className="p-4 space-y-3">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        activeFeature === index 
                          ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30' 
                          : 'hover:bg-slate-800/50 border border-transparent'
                      }`}
                      onClick={() => setActiveFeature(index)}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-white">{feature.title}</h3>
                            <span className="text-xs font-mono text-cyan-400">{feature.stats}</span>
                          </div>
                          <p className="text-sm text-slate-400">{feature.desc}</p>
                        </div>
                      </div>
                      
                      {/* Active indicator */}
                      {activeFeature === index && (
                        <motion.div 
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full"
                          layoutId="activeIndicator"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Terminal footer */}
                <div className="px-4 py-3 bg-slate-800/30 border-t border-slate-700/50">
                  <p className="text-xs font-mono text-slate-500">
                    <span className="text-cyan-400">→</span> Wählen Sie einen Agenten für Details
                  </p>
                </div>
              </CyberCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-sm font-mono text-cyan-400 mb-4 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                &lt;performance/&gt;
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Enterprise-Grade{' '}
                <GlowText>Performance</GlowText>
              </h2>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard glow>
                  <div className="p-8 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <stat.icon className="w-7 h-7 text-cyan-400" />
                    </div>
                    <div className="text-4xl font-bold font-mono mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-400">
                      {stat.label}
                    </div>
                  </div>
                </CyberCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Demo Section */}
      <section id="tech" className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <CyberCard glow>
            <div className="grid md:grid-cols-2">
              {/* Code Side */}
              <div className="p-8 border-r border-slate-700/50">
                <div className="flex items-center space-x-2 mb-6">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <span className="font-mono text-sm text-slate-400">integration.ts</span>
                </div>
                
                <pre className="text-sm font-mono text-slate-300 leading-relaxed overflow-x-auto">
                  <code>
{`// Initialize AI Agent
import { AlphaAI } from '@alpha/sdk';

const agent = new AlphaAI({
  apiKey: process.env.ALPHA_KEY,
  model: 'gpt-4-vision',
  region: 'ch-zurich'
});

// Process Document
const result = await agent.analyze({
  document: uploadedFile,
  extractFields: ['invoice_number', 
                  'total_amount', 
                  'due_date'],
  language: 'de-CH'
});

console.log(result.confidence);
// Output: 0.997`}
                  </code>
                </pre>
              </div>

              {/* Info Side */}
              <div className="p-8 flex flex-col justify-center">
                <span className="inline-block text-sm font-mono text-cyan-400 mb-4">
                  &lt;integration/&gt;
                </span>
                <h3 className="text-3xl font-bold mb-4">
                  Einfache <GlowText>API</GlowText>
                </h3>
                <p className="text-slate-400 mb-6">
                  Integrieren Sie unsere KI-Agenten mit wenigen Zeilen Code. 
                  Vollständige TypeScript-Unterstützung und umfassende Dokumentation.
                </p>
                
                <div className="space-y-3">
                  {['TypeScript SDK', 'REST API', 'Webhook Support', 'Real-time Events'].map((item) => (
                    <div key={item} className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-cyan-400" />
                      </div>
                      <span className="text-sm text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  href="/docs"
                  className="inline-flex items-center space-x-2 mt-8 text-cyan-400 hover:text-cyan-300 font-mono text-sm group"
                >
                  <span>Documentation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </CyberCard>
        </div>
      </section>

      {/* CTA Section */}
      <section id="kontakt" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <CyberCard glow>
            <div className="relative p-12 md:p-20 text-center overflow-hidden">
              {/* Animated background pattern */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, transparent 45%, rgba(6, 182, 212, 0.1) 45%, rgba(6, 182, 212, 0.1) 55%, transparent 55%),
                    linear-gradient(-45deg, transparent 45%, rgba(139, 92, 246, 0.1) 45%, rgba(139, 92, 246, 0.1) 55%, transparent 55%)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Bot className="w-10 h-10 text-cyan-400" />
                </div>

                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Bereit für <GlowText>die Zukunft</GlowText>?
                </h2>
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                  Starten Sie noch heute mit einer kostenlosen Demo und erleben Sie 
                  die Power von KI-Automatisierung.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link 
                    href="/demo"
                    className="group relative px-8 py-4 rounded-xl font-medium overflow-hidden"
                    style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <span className="relative flex items-center space-x-2 text-white">
                      <Terminal className="w-5 h-5" />
                      <span className="font-mono">./start_demo</span>
                    </span>
                  </Link>
                  
                  <Link 
                    href="tel:+41783406665"
                    className="text-slate-400 hover:text-cyan-400 transition-colors font-mono"
                  >
                    +41 78 340 66 65
                  </Link>
                </div>
              </motion.div>
            </div>
          </CyberCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm font-mono">
          <span>© 2025 Alpha Informatik</span>
          <span className="flex items-center space-x-2">
            <span className="text-cyan-400">&lt;</span>
            <span>Swiss Made with</span>
            <span className="text-red-400">♥</span>
            <span className="text-cyan-400">/&gt;</span>
          </span>
        </div>
      </footer>

      {/* Version Indicator */}
      <div className="fixed bottom-4 left-4 bg-slate-900 text-cyan-400 px-4 py-2 rounded-full text-xs font-mono z-50 flex items-center space-x-2 border border-cyan-500/30">
        <Binary className="w-3 h-3" />
        <span>V8: Cyber AI</span>
      </div>
      
      {/* Version Navigation */}
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
        {['V4', 'V5', 'V6', 'V7', 'V8', 'V9'].map((v) => (
          <Link 
            key={v}
            href={`/${v.toLowerCase()}`} 
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
              v === 'V8' 
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

