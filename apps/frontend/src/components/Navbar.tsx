'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const mainNavItems = [
    { href: '/', label: 'Home' },
    { 
      label: 'Lösungen', 
      dropdown: [
        { href: '/loesungen/ocr-dokumentenverarbeitung', label: 'OCR Dokumentenverarbeitung' },
        { href: '/loesungen/chat-assistenten', label: 'KI Chat-Assistenten' },
        { href: '/loesungen/workflow-automation', label: 'Workflow-Automation' },
      ]
    },
    { 
      label: 'Branchen', 
      dropdown: [
        { href: '/branchen/versicherungen', label: 'Versicherungen' },
        { href: '/branchen/kmu', label: 'KMU' },
      ]
    },
    { href: '/vorteile', label: 'Vorteile' },
    { href: '/ueber-uns', label: 'Über uns' },
    { href: '/kontakt', label: 'Kontakt' }
  ];

  const devNavItems = [
    { href: '/demo', label: 'Demo', icon: '🚀' },
    { href: '/ocr-debug', label: 'OCR Debug', icon: '🔍' },
    { href: '/status', label: 'System Status', icon: '⚡' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="text-xl font-bold text-blue-600 mr-2">⚡</div>
                <div className="hidden sm:block">
                  <div className="text-lg font-bold text-gray-800">Alpha Informatik</div>
                  <div className="text-xs text-gray-500 -mt-1">Effizienz durch Innovation</div>
                </div>
                <div className="sm:hidden">
                  <div className="text-base font-bold text-gray-800">Alpha Informatik</div>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {mainNavItems.map((item) => (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative group"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                      {item.label}
                      <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-0 w-64 bg-white shadow-xl border rounded-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform translate-y-2 group-hover:translate-y-0">
                        <div className="py-2">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150 border-l-2 border-transparent hover:border-blue-500"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            
            {/* CTA Button Desktop */}
            <Link
              href="/demo"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Demo anfragen
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* CTA Button Mobile */}
            <Link
              href="/demo"
              className="lg:hidden bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Demo
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Dev Navigation (conditional) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="hidden xl:flex items-center space-x-2 ml-4 border-l pl-4">
              {devNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-gray-100 text-gray-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {mainNavItems.map((item) => (
                <div key={item.label}>
                  {item.dropdown ? (
                    <div>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        {item.label}
                        <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {openDropdown === item.label && (
                        <div className="pl-6 space-y-1">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 text-base font-medium transition-colors ${
                        pathname === item.href
                          ? 'text-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Dev Navigation Mobile */}
            {process.env.NODE_ENV === 'development' && (
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Development
                </div>
                <div className="space-y-1">
                  {devNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-3 py-2 text-sm transition-colors ${
                        pathname === item.href
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}