'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full animate-float opacity-10">
            <div className="w-full h-full bg-primary-400 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 animate-float opacity-10" style={{ animationDelay: '-3s' }}>
            <div className="w-full h-full bg-primary-600 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          {/* Centered Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-primary-200 to-white text-transparent bg-clip-text">
                Revolutionieren Sie Ihr
              </span>
              <br />
              Dokumentenmanagement
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <p className="text-lg md:text-xl text-primary-100 mb-8">
                KI-gestützte Automatisierung für Versicherungsunternehmen. 
                Sparen Sie Zeit und Ressourcen mit unserer innovativen Lösung.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/dashboard"
                  className="inline-flex justify-center items-center px-8 py-4 rounded-full bg-white text-primary-600 font-semibold hover:bg-primary-50 
                    transition-all duration-300 transform hover:scale-105"
                >
                  Demo anfordern
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex justify-center items-center px-8 py-4 rounded-full bg-glass-primary backdrop-blur-sm text-white font-semibold
                    border border-white/10 hover:bg-glass-secondary transition-all duration-300 transform hover:scale-105"
                >
                  Mehr erfahren
                </Link>
              </div>
            </motion.div>

            {/* Feature Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden backdrop-blur-lg bg-glass-primary border border-white/10
                shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 via-transparent to-primary-600/10"></div>
                <div className="relative p-8">
                  <div className="space-y-4">
                    {/* Mock Document Processing UI */}
                    <div className="h-8 w-3/4 bg-white/10 rounded-lg animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-white/10 rounded-lg animate-pulse"></div>
                    <div className="h-32 w-full bg-white/5 rounded-lg border border-white/10 p-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-lg bg-primary-500/20"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-white/10 rounded"></div>
                          <div className="h-3 w-24 bg-white/5 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 