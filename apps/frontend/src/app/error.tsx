'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error caught:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Etwas ist schiefgelaufen
        </h1>
        
        <p className="text-gray-600 mb-6">
          Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut 
          oder kehren Sie zur Startseite zurück.
        </p>
        
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Fehlerdetails:</h3>
            <pre className="text-sm text-gray-700 overflow-auto whitespace-pre-wrap">
              {error.message}
            </pre>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Erneut versuchen
          </button>
          
          <Link
            href="/"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Zur Startseite
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Falls das Problem weiterhin besteht, kontaktieren Sie uns unter{' '}
            <a href="mailto:wehrlinatasha@gmail.com" className="text-blue-600 hover:underline">
              wehrlinatasha@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}