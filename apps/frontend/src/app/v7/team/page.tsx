'use client';

import Link from 'next/link';
import { Award, Code, Brain, Shield, Sparkles } from 'lucide-react';

// Team Page - passend zu V7 Design
export default function TeamPage() {
  const team = [
    {
      role: 'Geschäftsleitung',
      icon: Award,
      bio: 'Strategische Führung mit über 10 Jahren Erfahrung in der Schweizer IT-Branche. Fokus auf Innovation und nachhaltiges Wachstum.',
      expertise: ['KI-Strategie', 'Business Development', 'Innovation'],
    },
    {
      role: 'Technologie',
      icon: Code,
      bio: 'Technologie-Expertise mit Fokus auf skalierbare KI-Systeme und moderne Cloud-Architekturen.',
      expertise: ['Machine Learning', 'System Architecture', 'Cloud Infrastructure'],
    },
    {
      role: 'KI-Entwicklung',
      icon: Brain,
      bio: 'Spezialisiert auf KI-Forschung und Entwicklung. Expertise in NLP und Computer Vision.',
      expertise: ['GPT-4 Integration', 'OCR', 'Natural Language Processing'],
    },
    {
      role: 'Kundenerfolg',
      icon: Shield,
      bio: 'Kundenorientierter Fokus auf nachhaltige Partnerschaften und erfolgreiche Implementierungen.',
      expertise: ['Kundenbetreuung', 'Projektmanagement', 'Schulungen'],
    },
  ];

  const expertise = [
    { icon: Brain, title: 'KI & Machine Learning', desc: 'GPT-4, Computer Vision, NLP' },
    { icon: Code, title: 'Moderne Entwicklung', desc: 'TypeScript, React, Node.js, Python' },
    { icon: Shield, title: 'Schweizer Datenschutz', desc: 'DSGVO-konform, lokales Hosting' },
    { icon: Award, title: 'Branchenerfahrung', desc: 'Versicherungen, KMU, Finanzen' },
  ];

  return (
    <div className="min-h-screen bg-[#0A1628] text-white">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#1E3A5F]/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#B8A878]/5 rounded-full blur-[128px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0A1628]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-2xl rounded-2xl px-6 py-4 border border-white/10">
            <Link href="/v7" className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#B8A878] to-[#9A8A68] rounded-xl blur-lg opacity-50" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-[#B8A878] to-[#9A8A68] rounded-xl flex items-center justify-center">
                  <span className="text-[#0A1628] font-bold text-lg">α</span>
                </div>
              </div>
              <span className="font-semibold text-lg">Alpha Informatik</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link href="/v7" className="text-white/60 hover:text-white transition-colors">
                Zurück
              </Link>
              <Link href="/kontakt" className="px-6 py-2 bg-gradient-to-r from-[#B8A878] to-[#9A8A68] text-[#0A1628] font-semibold rounded-xl hover:opacity-90 transition-opacity">
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-[#B8A878]/10 border border-[#B8A878]/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-[#B8A878]" />
            <span className="text-sm font-medium text-[#B8A878]">Unser Team</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Unsere{' '}
            <span className="bg-gradient-to-r from-[#B8A878] to-[#C4B898] bg-clip-text text-transparent">
              Expertise
            </span>
          </h1>
          
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            Ein erfahrenes Team aus KI-Experten, Entwicklern und Strategen - 
            vereint durch die Mission, Schweizer Unternehmen mit intelligenter Automatisierung zu stärken.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div 
                key={member.role}
                className="group relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-[#B8A878]/50 hover:bg-white/[0.08]"
              >
                {/* Icon Header */}
                <div className="relative h-48 bg-gradient-to-br from-[#1E3A5F]/50 to-[#0A1628] flex items-center justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#B8A878]/20 to-[#B8A878]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <member.icon className="w-12 h-12 text-[#B8A878]" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#B8A878] transition-colors">
                    {member.role}
                  </h3>
                  <p className="text-white/50 text-sm mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  
                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill) => (
                      <span 
                        key={skill}
                        className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-white/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Hover line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#B8A878] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Unsere{' '}
              <span className="text-[#B8A878]">Expertise</span>
            </h2>
            <p className="text-lg text-white/40">Was uns auszeichnet</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((item) => (
              <div 
                key={item.title}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#B8A878]/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B8A878]/20 to-[#1E3A5F]/20 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#B8A878]" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/40">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F] to-[#0A1628]" />
            <div className="relative p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Arbeiten Sie mit uns
              </h2>
              <p className="text-white/60 mb-8 max-w-xl mx-auto">
                Interessiert an einer Zusammenarbeit? Wir freuen uns darauf, 
                Ihre Herausforderungen kennenzulernen.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/kontakt"
                  className="px-8 py-4 bg-gradient-to-r from-[#B8A878] to-[#9A8A68] text-[#0A1628] font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Kontakt aufnehmen
                </Link>
                <Link 
                  href="/v7"
                  className="px-8 py-4 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                >
                  Zurück zur Startseite
                </Link>
              </div>
            </div>
          </div>
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
        <span>Team</span>
      </div>
    </div>
  );
}

