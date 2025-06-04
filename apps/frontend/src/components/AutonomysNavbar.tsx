'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AutonomysNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <>
      <style jsx>{`
        .navbar {
          padding-top: 20px;
        }
        @media only screen and (max-width: 991px) {
          .navbar {
            margin-top: 20px;
            padding-top: 0px;
          }
        }
      `}</style>
      <nav className={`navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-800' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div>
                <div className={`font-bold text-lg group-hover:text-blue-400 transition-colors ${
                  scrolled ? 'text-white' : 'text-neutral-800'
                }`}>
                  Alpha Informatik
                </div>
                <div className={`text-xs -mt-0.5 ${
                  scrolled ? 'text-neutral-300' : 'text-neutral-600'
                }`}>
                  Effizienz durch Innovation
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Exact Autonomys Structure */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Lösungen - Simple Link */}
            <Link
              href="/loesungen"
              className={`transition-colors ${
                scrolled 
                  ? `text-white hover:text-blue-400 ${pathname === '/loesungen' ? 'text-blue-400' : ''}` 
                  : `text-neutral-800 hover:text-blue-600 ${pathname === '/loesungen' ? 'text-blue-600' : ''}`
              }`}
            >
              Lösungen
            </Link>

            {/* Branchen - Simple Link */}
            <Link
              href="/branchen"
              className={`transition-colors ${
                scrolled 
                  ? `text-white hover:text-blue-400 ${pathname === '/branchen' ? 'text-blue-400' : ''}` 
                  : `text-neutral-800 hover:text-blue-600 ${pathname === '/branchen' ? 'text-blue-600' : ''}`
              }`}
            >
              Branchen
            </Link>

            {/* Simple Links */}
            <Link
              href="/vorteile"
              className={`transition-colors ${
                scrolled 
                  ? `text-white hover:text-blue-400 ${pathname === '/vorteile' ? 'text-blue-400' : ''}` 
                  : `text-neutral-800 hover:text-blue-600 ${pathname === '/vorteile' ? 'text-blue-600' : ''}`
              }`}
            >
              Vorteile
            </Link>
            
            <Link
              href="/ueber-uns"
              className={`transition-colors ${
                scrolled 
                  ? `text-white hover:text-blue-400 ${pathname === '/ueber-uns' ? 'text-blue-400' : ''}` 
                  : `text-neutral-800 hover:text-blue-600 ${pathname === '/ueber-uns' ? 'text-blue-600' : ''}`
              }`}
            >
              Über uns
            </Link>

            <Link
              href="/kontakt"
              className={`transition-colors ${
                scrolled 
                  ? `text-white hover:text-blue-400 ${pathname === '/kontakt' ? 'text-blue-400' : ''}` 
                  : `text-neutral-800 hover:text-blue-600 ${pathname === '/kontakt' ? 'text-blue-600' : ''}`
              }`}
            >
              Kontakt
            </Link>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3 ml-4">
              <Link
                href="/demo"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Live Demo
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-neutral-800 bg-neutral-900/95 backdrop-blur-xl"
            >
              <div className="px-4 py-6 space-y-4">
                <div>
                  <Link
                    href="/loesungen"
                    className="block text-neutral-300 hover:text-white transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Lösungen
                  </Link>
                </div>

                <div>
                  <Link
                    href="/branchen"
                    className="block text-neutral-300 hover:text-white transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Branchen
                  </Link>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/vorteile"
                    className="block text-neutral-300 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Vorteile
                  </Link>
                  <Link
                    href="/ueber-uns"
                    className="block text-neutral-300 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Über uns
                  </Link>
                  <Link
                    href="/kontakt"
                    className="block text-neutral-300 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Kontakt
                  </Link>
                </div>

                <div className="pt-4 border-t border-neutral-800">
                  <Link
                    href="/demo"
                    className="inline-flex items-center w-full justify-center px-4 py-3 bg-white text-neutral-900 font-medium rounded-lg hover:bg-neutral-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Live Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
    </>
  );
}