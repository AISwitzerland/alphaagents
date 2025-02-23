'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-primary-900/90 backdrop-blur-lg shadow-lg' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${
              isScrolled 
                ? 'text-white' 
                : 'bg-gradient-to-r from-primary-400 to-primary-600 text-transparent bg-clip-text'
            }`}>
              AlphaAgents
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/features" isScrolled={isScrolled} isActive={pathname === '/features'}>
              Features
            </NavLink>
            <NavLink href="/about" isScrolled={isScrolled} isActive={pathname === '/about'}>
              Über uns
            </NavLink>
            <NavLink href="/contact" isScrolled={isScrolled} isActive={pathname === '/contact'}>
              Kontakt
            </NavLink>
            <Link 
              href="/dashboard" 
              className={`px-4 py-2 rounded-full transition-colors duration-200 backdrop-blur-sm ${
                isScrolled
                  ? 'bg-white text-primary-900 hover:bg-primary-50'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-white hover:bg-primary-800/50"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0,
          y: isMobileMenuOpen ? 0 : -20 
        }}
        transition={{ duration: 0.2 }}
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:hidden absolute top-16 inset-x-0 bg-primary-900/95 backdrop-blur-lg shadow-lg`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          <MobileNavLink 
            href="/features" 
            isActive={pathname === '/features'}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </MobileNavLink>
          <MobileNavLink 
            href="/about" 
            isActive={pathname === '/about'}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Über uns
          </MobileNavLink>
          <MobileNavLink 
            href="/contact" 
            isActive={pathname === '/contact'}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Kontakt
          </MobileNavLink>
          <div className="pt-2">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-md text-center text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </motion.div>
    </nav>
  );
}

function NavLink({ href, children, isScrolled, isActive }: { 
  href: string; 
  children: React.ReactNode; 
  isScrolled: boolean;
  isActive: boolean;
}) {
  return (
    <Link 
      href={href}
      className={`font-medium transition-colors duration-200 ${
        isActive
          ? isScrolled
            ? 'text-white'
            : 'text-primary-600'
          : isScrolled
            ? 'text-primary-100 hover:text-white'
            : 'text-white hover:text-primary-200'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ 
  href, 
  children, 
  isActive,
  onClick 
}: { 
  href: string; 
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-2 rounded-md text-base font-medium ${
        isActive
          ? 'text-white bg-primary-800'
          : 'text-primary-100 hover:text-white hover:bg-primary-800/50'
      }`}
    >
      {children}
    </Link>
  );
} 