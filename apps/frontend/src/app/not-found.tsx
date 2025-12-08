'use client';

import { Search, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="h-8 w-8 text-blue-600" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Seite nicht gefunden
        </h2>
        
        <p className="text-gray-600 mb-8">
          Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben. 
          Überprüfen Sie die URL oder kehren Sie zur Startseite zurück.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Zur Startseite
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Beliebte Seiten:</h3>
          <div className="space-y-2">
            <Link href="/loesungen" className="block text-blue-600 hover:underline">
              Unsere Lösungen
            </Link>
            <Link href="/branchen" className="block text-blue-600 hover:underline">
              Branchenlösungen
            </Link>
            <Link href="/vorteile" className="block text-blue-600 hover:underline">
              Vorteile & ROI
            </Link>
            <Link href="/kontakt" className="block text-blue-600 hover:underline">
              Kontakt & Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}