'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export function CTASection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ein Fehler ist aufgetreten');
      }

      setStatus('success');
      setFormState({
        name: '',
        email: '',
        company: '',
        message: '',
      });
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full animate-float opacity-10">
          <div className="w-full h-full bg-primary-400 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full animate-float-slow opacity-10">
          <div className="w-full h-full bg-primary-600 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Bereit für die Zukunft der Dokumentenverarbeitung?
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              Kontaktieren Sie uns für eine persönliche Demo und erfahren Sie, wie unsere KI-gestützte Lösung 
              Ihre Dokumentenprozesse revolutionieren kann.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-primary-100">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Schweizer Datenschutz-Standards</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-100">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Modernste KI-Technologie</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-100">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Persönliche Beratung</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden backdrop-blur-lg bg-glass-primary border border-white/10 p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/5 via-transparent to-primary-600/5"></div>
              <div className="relative">
                <h3 className="text-2xl font-semibold text-white mb-6">Kontaktieren Sie uns</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-primary-100 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-primary-200
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ihr Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary-100 mb-1">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-primary-200
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="ihre@email.ch"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-primary-100 mb-1">
                      Unternehmen
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formState.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-primary-200
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ihr Unternehmen"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-primary-100 mb-1">
                      Nachricht *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-primary-200
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ihre Nachricht an uns"
                    ></textarea>
                  </div>

                  {/* Status Messages */}
                  {status === 'error' && (
                    <div className="text-red-400 text-sm">
                      {errorMessage || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'}
                    </div>
                  )}
                  {status === 'success' && (
                    <div className="text-green-400 text-sm">
                      Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className={`w-full px-6 py-3 rounded-lg bg-primary-500 text-white font-medium
                      hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      focus:ring-offset-primary-900 transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {status === 'submitting' ? 'Wird gesendet...' : 'Jetzt Kontakt aufnehmen'}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 