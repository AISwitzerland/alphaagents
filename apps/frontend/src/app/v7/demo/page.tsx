'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Scissors, Dumbbell, Car, Monitor, Megaphone } from 'lucide-react';

// Demo Page - Side-by-Side Layout für Chatbot-Tests
export default function DemoPage() {
  const [activeBot, setActiveBot] = useState(0);

  const chatbots = [
    {
      id: 'beauty',
      name: 'Beauty Bot',
      icon: Scissors,
      description: 'Beratung zu Kosmetik, Hautpflege und Beauty-Treatments.',
      color: '#E91E8C',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=400&fit=crop&q=80',
      // Hier später den Embedding-Code einfügen
      embedCode: null,
    },
    {
      id: 'fitness',
      name: 'Fitness Bot',
      icon: Dumbbell,
      description: 'Trainingsplanung, Ernährungstipps und Fitness-Beratung.',
      color: '#22C55E',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop&q=80',
      embedCode: null,
    },
    {
      id: 'fahrschule',
      name: 'Fahrschule Bot',
      icon: Car,
      description: 'Führerschein-Fragen, Prüfungsvorbereitung und Fahrstunden-Buchung.',
      color: '#3B82F6',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=400&fit=crop&q=80',
      embedCode: null,
    },
    {
      id: 'tech',
      name: 'Tech Bot',
      icon: Monitor,
      description: 'IT-Support, Tech-Beratung und Produkt-Empfehlungen.',
      color: '#8B5CF6',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop&q=80',
      embedCode: null,
    },
    {
      id: 'marketing',
      name: 'Marketing Bot',
      icon: Megaphone,
      description: 'Marketing-Strategien, Social Media und Kampagnen-Beratung.',
      color: '#F59E0B',
      image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=400&fit=crop&q=80',
      embedCode: null,
    },
  ];

  const currentBot = chatbots[activeBot];

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#1E3A5F]/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#B8A878]/5 rounded-full blur-[128px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0A1628]">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-2xl rounded-2xl px-6 py-3 border border-white/10">
            <Link href="/v7" className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#B8A878] to-[#9A8A68] rounded-xl blur-lg opacity-50" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-[#B8A878] to-[#9A8A68] rounded-xl flex items-center justify-center">
                  <span className="text-[#0A1628] font-bold text-lg">α</span>
                </div>
              </div>
              <span className="font-semibold text-lg">Alpha Informatik</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/v7" 
                className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Zurück</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative pt-28 pb-12 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#B8A878]/10 border border-[#B8A878]/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#B8A878]" />
              <span className="text-sm font-medium text-[#B8A878]">Live Demo</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Testen Sie unsere{' '}
              <span className="bg-gradient-to-r from-[#B8A878] to-[#C4B898] bg-clip-text text-transparent">
                KI-Assistenten
              </span>
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Wählen Sie einen Bot aus und starten Sie eine Unterhaltung.
            </p>
          </div>

          {/* Side-by-Side Layout */}
          <div className="grid lg:grid-cols-[350px_1fr] gap-8">
            {/* Left: Bot Selection Cards */}
            <div className="space-y-4">
              <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                Wählen Sie einen Bot
              </h2>
              
              {chatbots.map((bot, index) => (
                <button
                  key={bot.id}
                  onClick={() => setActiveBot(index)}
                  className={`w-full text-left rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                    activeBot === index
                      ? 'bg-white/10 shadow-lg'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]'
                  }`}
                  style={{
                    borderColor: activeBot === index ? bot.color : undefined,
                    boxShadow: activeBot === index ? `0 10px 40px -10px ${bot.color}30` : undefined,
                  }}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={bot.image} 
                      alt={bot.name}
                      className="w-full h-full object-cover transition-transform duration-500"
                      style={{ 
                        transform: activeBot === index ? 'scale(1.05)' : 'scale(1)',
                      }}
                    />
                    <div 
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{ 
                        background: `linear-gradient(to top, #0A1628 0%, ${bot.color}10 20%, transparent 40%)`,
                      }}
                    />
                    {/* Active Badge on Image */}
                    {activeBot === index && (
                      <span 
                        className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium text-white"
                        style={{ background: bot.color }}
                      >
                        Aktiv
                      </span>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 -mt-8 relative z-10"
                        style={{
                          background: `linear-gradient(135deg, ${bot.color}, ${bot.color}99)`,
                        }}
                      >
                        <bot.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 
                        className="font-semibold transition-colors"
                        style={{ color: activeBot === index ? bot.color : 'white' }}
                      >
                        {bot.name}
                      </h3>
                    </div>
                    <p className="text-sm text-white/50 mt-2">
                      {bot.description}
                    </p>
                  </div>
                </button>
              ))}

              {/* Info Box */}
              <div className="mt-6 p-4 rounded-xl bg-[#1E3A5F]/30 border border-[#1E3A5F]/50">
                <p className="text-xs text-white/40 leading-relaxed">
                  💡 <strong className="text-white/60">Tipp:</strong> Probieren Sie verschiedene Bots aus, 
                  um zu sehen wie sie auf unterschiedliche Anfragen reagieren.
                </p>
              </div>
            </div>

            {/* Right: Chat Window */}
            <div className="relative">
              <div className="sticky top-28">
                {/* Chat Header */}
                <div className="bg-white/10 backdrop-blur-xl rounded-t-2xl border border-white/10 border-b-0 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${currentBot.color}, ${currentBot.color}99)` }}
                    >
                      <currentBot.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: currentBot.color }}>{currentBot.name}</h3>
                      <p className="text-xs text-emerald-400 flex items-center">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2" />
                        Online
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Body - Placeholder for Embedding */}
                <div 
                  className="bg-[#0A1628]/80 backdrop-blur-xl border border-white/10 border-t-0 rounded-b-2xl overflow-hidden"
                  style={{ height: '500px' }}
                >
                  {currentBot.embedCode ? (
                    // Hier wird der Embedding-Code eingefügt
                    <div 
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: currentBot.embedCode }}
                    />
                  ) : (
                    // Placeholder wenn kein Code vorhanden
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                      <div 
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                        style={{ background: `${currentBot.color}15` }}
                      >
                        <currentBot.icon className="w-10 h-10" style={{ color: `${currentBot.color}80` }} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: currentBot.color }}>
                        {currentBot.name}
                      </h3>
                      <p className="text-white/40 mb-6 max-w-sm">
                        Der Chatbot wird hier eingebettet, sobald der Embedding-Code hinterlegt ist.
                      </p>
                      <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/30 font-mono">
                        {`<!-- Embedding-Code für ${currentBot.id} -->`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Version Indicator */}
      <div className="fixed bottom-4 left-4 bg-[#1E3A5F] text-[#B8A878] px-4 py-2 rounded-full text-xs font-medium z-50 flex items-center space-x-2 border border-[#B8A878]/20">
        <Sparkles className="w-3 h-3" />
        <span>Demo</span>
      </div>
    </div>
  );
}

