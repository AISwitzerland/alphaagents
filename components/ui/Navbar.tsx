'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

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

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Schließe das mobile Menü, falls geöffnet
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleProcessClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const processSection = document.getElementById('process');
    if (processSection) {
      processSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Schließe das mobile Menü, falls geöffnet
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleFeaturesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Schließe das mobile Menü, falls geöffnet
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
      isScrolled ? 'shadow-md' : 'bg-opacity-80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${
              isScrolled 
                ? 'text-primary-700' 
                : 'text-primary-700'
            }`}>
              Alpha Informatik
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a 
              href="#process"
              onClick={handleProcessClick}
              className={`font-medium transition-colors duration-200 ${
                pathname === '/product'
                  ? 'text-primary-700 border-b-2 border-primary-600 pb-1'
                  : 'text-gray-700 hover:text-primary-700 hover:border-b-2 hover:border-primary-600 pb-1'
              }`}
            >
              Unser Prozess
            </a>
            <a 
              href="#features"
              onClick={handleFeaturesClick}
              className={`font-medium transition-colors duration-200 ${
                pathname === '/services'
                  ? 'text-primary-700 border-b-2 border-primary-600 pb-1'
                  : 'text-gray-700 hover:text-primary-700 hover:border-b-2 hover:border-primary-600 pb-1'
              }`}
            >
              Unsere Lösungen
            </a>
            <a 
              href="#contact"
              onClick={handleContactClick}
              className={`font-medium transition-colors duration-200 ${
                pathname === '/contact'
                  ? 'text-primary-700 border-b-2 border-primary-600 pb-1'
                  : 'text-gray-700 hover:text-primary-700 hover:border-b-2 hover:border-primary-600 pb-1'
              }`}
            >
              Kontakt
            </a>
            <NavLink href="/dashboard" isScrolled={isScrolled} isActive={pathname === '/dashboard'}>
              Dashboard
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md text-primary-700 hover:bg-primary-50`}
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
        } md:hidden absolute top-20 inset-x-0 bg-white shadow-lg border-t border-gray-200`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          <div className={`block px-4 py-2 rounded-md text-base font-medium ${
            pathname === '/product'
              ? 'text-primary-700 bg-gray-100'
              : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
          }`}>
            <a 
              href="#process"
              onClick={handleProcessClick}
            >
              Unser Prozess
            </a>
          </div>
          <div className={`block px-4 py-2 rounded-md text-base font-medium ${
            pathname === '/services'
              ? 'text-primary-700 bg-gray-100'
              : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
          }`}>
            <a 
              href="#features"
              onClick={handleFeaturesClick}
            >
              Unsere Lösungen
            </a>
          </div>
          <div className={`block px-4 py-2 rounded-md text-base font-medium ${
            pathname === '/contact'
              ? 'text-primary-700 bg-gray-100'
              : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
          }`}>
            <a 
              href="#contact"
              onClick={handleContactClick}
            >
              Kontakt
            </a>
          </div>
          <div className="pt-2 space-y-2">
            <MobileNavLink
              href="/dashboard"
              isActive={pathname === '/dashboard'}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </MobileNavLink>
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
          ? 'text-primary-700 border-b-2 border-primary-600 pb-1'
          : 'text-gray-700 hover:text-primary-700 hover:border-b-2 hover:border-primary-600 pb-1'
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
          ? 'text-primary-700 bg-gray-100'
          : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );
} 