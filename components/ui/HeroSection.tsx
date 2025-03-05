'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  const handleBeratungClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMehrErfahrenClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-800/85 to-primary-900/75"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/landing/office.jpg)' }}
          role="img"
          aria-label="IT-Automatisierung für Unternehmen"
        ></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <div className="bg-black/20 backdrop-blur-md p-6 rounded-xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-shadow-soft">
                  Automatisierung für Ihr Unternehmen
                </h1>
                <p className="text-lg md:text-xl text-white mb-8 max-w-2xl">
                  Unsere KI-gestützte Prozessautomatisierung optimiert Ihre Geschäftsabläufe und spart Zeit und Kosten bei repetitiven Aufgaben.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="#contact"
                    onClick={handleBeratungClick}
                    className="inline-flex justify-center items-center px-8 py-4 rounded-md bg-accent-500 text-white font-medium hover:bg-accent-600 
                      transition-all duration-300 shadow-lg"
                  >
                    Beratung anfordern
                  </a>
                  <a
                    href="#features"
                    onClick={handleMehrErfahrenClick}
                    className="inline-flex justify-center items-center px-8 py-4 rounded-md bg-white text-primary-700 font-medium 
                      hover:bg-gray-100 transition-all duration-300 shadow-lg"
                  >
                    Mehr erfahren
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-5"
            >
              <div className="bg-white rounded-lg shadow-xl p-6 backdrop-blur-lg">
                <h3 className="text-xl font-semibold text-primary-700 mb-4">
                  IT-Automatisierung leicht gemacht
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-accent-500 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Smarte Prozessoptimierung</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-accent-500 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Maßgeschneiderte KI-Lösungen</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-accent-500 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Schweizer Qualitätsstandards</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 