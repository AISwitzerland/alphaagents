'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

interface FormData {
  firstName: string
  lastName: string
  email: string
  company: string
  phone: string
  interest: string
  message: string
  privacy: boolean
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    interest: '',
    message: '',
    privacy: false
  })
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement
      setFormData(prev => ({ ...prev, [name]: target.checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          phone: '',
          interest: '',
          message: '',
          privacy: false
        })
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Ein Fehler ist aufgetreten')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Netzwerkfehler. Bitte versuchen Sie es später erneut.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vielen Dank!</h2>
          <p className="text-gray-600 mb-6">
            Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns innerhalb von 24 Stunden bei Ihnen.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Neue Nachricht senden
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Nachricht senden</h2>
      
      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{errorMessage}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              Vorname *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Max"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Nachname *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Muster"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-Mail-Adresse *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="max.muster@unternehmen.ch"
          />
        </div>
        
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Unternehmen
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ihr Unternehmen AG"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Telefonnummer
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+41 79 123 45 67"
          />
        </div>
        
        <div>
          <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2">
            Interesse
          </label>
          <select
            id="interest"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Bitte wählen Sie...</option>
            <option value="ocr">OCR & Dokumentenverarbeitung</option>
            <option value="chat">KI-Chat-Assistenten</option>
            <option value="email">E-Mail-Automatisierung</option>
            <option value="workflow">Workflow-Automatisierung</option>
            <option value="custom">Maßgeschneiderte Lösung</option>
            <option value="demo">Live-Demo anfragen</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Nachricht *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Beschreiben Sie kurz Ihre Anforderungen oder welche Prozesse Sie automatisieren möchten..."
          ></textarea>
        </div>
        
        <div className="flex items-start">
          <input
            type="checkbox"
            id="privacy"
            name="privacy"
            required
            checked={formData.privacy}
            onChange={handleChange}
            className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="privacy" className="text-sm text-gray-600">
            Ich habe die Datenschutzerklärung gelesen 
            und stimme der Verarbeitung meiner Daten zu. *
          </label>
        </div>
        
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Wird gesendet...
            </>
          ) : (
            <>
              Nachricht senden
              <Send className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}