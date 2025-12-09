'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Zap, Shield, Clock,
  FileText, MessageSquare, Mail, Brain, Play,
  Check, Terminal, Cpu, Database, Network,
  Code2, Bot, Braces, Binary
} from 'lucide-react';
import { SplineScene } from '@/components/ui/spline-scene';
import { Spotlight } from '@/components/ui/spotlight';
import { Card } from '@/components/ui/card';
import { Globe } from '@/components/ui/globe';

// V8: CYBER AI - DARK TECH THEME with 3D Spline Scene
// Interactive 3D, spotlight effect, glowing elements

export default function CyberAIPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [typedText, setTypedText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

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
      stats: '< 2s pro Dokument'
    },
    { 
      icon: MessageSquare, 
      title: 'Chat Agent', 
      desc: 'Natürliche Konversation powered by GPT-4',
      stats: '24/7 verfügbar'
    },
    { 
      icon: Mail, 
      title: 'Email Agent', 
      desc: 'Automatische Klassifizierung & Antworten',
      stats: '80% Zeitersparnis'
    },
    { 
      icon: Brain, 
      title: 'Multi-Agent System', 
      desc: 'Orchestrierte KI-Agenten für komplexe Tasks',
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
        @keyframes spotlight {
          0% { opacity: 0; transform: translate(-72%, -62%) scale(0.5); }
          100% { opacity: 1; transform: translate(-50%, -40%) scale(1); }
        }
        .animate-spotlight {
          animation: spotlight 2s ease forwards;
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

      {/* Hero Section with 3D Spline */}
      <section className="relative min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Hero Card with 3D Scene */}
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
                  <span className="text-sm font-mono text-cyan-400">System Online</span>
                  <span className="text-xs text-slate-500">GPT-4 Vision</span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  <span className="text-white">KI-Agenten für</span>
                  <br />
                  <GlowText className="text-4xl md:text-5xl lg:text-6xl font-bold">
                    Enterprise
                  </GlowText>
                </h1>

                {/* Typewriter subtitle */}
                <div className="h-12 mb-8">
                  <p className="text-lg text-slate-400 font-mono">
                    <span className="text-cyan-400">$</span> {typedText}
                    <TypingCursor />
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
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
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
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

      {/* Features Cards */}
      <section id="tech" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-mono text-cyan-400 mb-4 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20">
              &lt;agents/&gt;
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Unsere <GlowText>KI-Agenten</GlowText>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard glow className="h-full">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-xl bg-slate-800 border border-cyan-500/30 flex items-center justify-center">
                        <feature.icon className="w-7 h-7 text-cyan-400" />
                      </div>
                      <span className="text-xs font-mono text-cyan-400 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                        {feature.stats}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                    <p className="text-slate-400">{feature.desc}</p>
                  </div>
                </CyberCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Globe Section - Global Reach */}
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
              {/* Glow Effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="w-80 h-80 rounded-full bg-cyan-500/20 blur-[100px]"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </div>
              
              <Globe className="opacity-90" />
              
              {/* Orbit Ring */}
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
              
              {/* Floating Label */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-center bg-slate-900/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-cyan-500/30">
                  <span className="text-sm font-mono text-cyan-400">Zürich HQ</span>
                  <p className="text-xs text-slate-500">47.37°N 8.54°E</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-sm font-mono text-cyan-400 mb-4 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                &lt;global/&gt;
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Swiss Made,{' '}
                <GlowText>Global Ready</GlowText>
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Von Zürich aus bedienen wir Kunden weltweit. Schweizer Präzision 
                trifft auf internationale AI-Expertise.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '🇨🇭', label: 'Swiss Hosting' },
                  { value: '🌍', label: 'Global CDN' },
                  { value: '🔒', label: 'GDPR Compliant' },
                  { value: '⚡', label: '<100ms Latency' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                  >
                    <span className="text-2xl">{item.value}</span>
                    <span className="text-sm text-slate-400">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="kontakt" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <CyberCard glow>
            <div className="relative p-12 md:p-20 text-center overflow-hidden">
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
        <span>V8: Cyber AI + 3D</span>
      </div>
      
      {/* Version Navigation */}
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
        {['V4', 'V6', 'V7', 'V8', 'V9'].map((v) => (
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
