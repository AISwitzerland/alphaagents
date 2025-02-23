'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Icons für die Sidebar
const DashboardIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { name: 'Dokumente', href: '/dashboard/documents', icon: DocumentIcon },
  { name: 'Upload', href: '/dashboard/upload', icon: UploadIcon },
  { name: 'Einstellungen', href: '/dashboard/settings', icon: SettingsIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg md:block hidden"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 bg-primary-900">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">AlphaAgents</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md text-white hover:bg-primary-800"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-primary-600 group"
              >
                <item.icon />
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Mobile menu */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={`${isMobileMenuOpen ? 'block' : 'hidden'} fixed inset-0 z-50 md:hidden`}
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
        
        {/* Menu panel */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-xl"
        >
          <div className="flex h-16 items-center justify-between px-4 bg-primary-900">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">AlphaAgents</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md text-white hover:bg-primary-800"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-3 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-primary-600 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon />
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex flex-col ${isSidebarOpen ? 'md:pl-64' : ''}`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-gray-500 hover:text-primary-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`${isSidebarOpen ? 'hidden' : ''} hidden md:block p-2 text-gray-500 hover:text-primary-600`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <input
                type="search"
                placeholder="Dokumente durchsuchen..."
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* Profile */}
            <button className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                N
              </div>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 