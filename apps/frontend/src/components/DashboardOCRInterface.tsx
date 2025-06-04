'use client'

import { useState, useCallback } from 'react'
import { Upload, File, X, CheckCircle, AlertCircle, Clock, Eye, Database, Mail, ChevronDown, ChevronUp, FileText, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProcessedFile {
  id: string
  name: string
  size: number
  status: 'uploading' | 'ocr-processing' | 'saving' | 'email-sending' | 'completed' | 'error'
  progress: number
  result?: {
    documentRecord?: any
    ocrResult?: any
    specificRecord?: any
    supabaseUrl?: string
    classification?: string
    extractedText?: string
    confidence?: number
    extractedData?: {
      name?: string
      address?: string
      insuranceNumber?: string
      policyNumber?: string
      phoneNumber?: string
      email?: string
      dateOfBirth?: string
      incidentDate?: string
      damageAmount?: string
      companyName?: string
      [key: string]: any
    }
  }
  error?: string
  startTime?: number
  processingEndTime?: number
}

export default function DashboardOCRInterface() {
  const [files, setFiles] = useState<ProcessedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<ProcessedFile | null>(null)
  const [expandedPreviews, setExpandedPreviews] = useState<Set<string>>(new Set())

  const processFile = async (file: File, fileId: string) => {
    try {
      const startTime = Date.now()
      
      // Step 1: Upload & OCR Processing
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'ocr-processing',
          progress: 25,
          startTime 
        } : f
      ))

      const formData = new FormData()
      formData.append('file', file)

      // Use our real OCR system endpoint
      const response = await fetch('/api/ocr-save', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`OCR processing failed: ${response.statusText}`)
      }

      // Step 2: Saving to Database
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'saving',
          progress: 60 
        } : f
      ))

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.details || 'OCR processing failed')
      }

      // Step 3: Email notification (simulated)
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'email-sending',
          progress: 85 
        } : f
      ))

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 4: Completed
      const processingEndTime = Date.now()
      const actualProcessingTime = (processingEndTime - startTime) / 1000
      
      // Extract structured data from OCR result
      const extractedText = result.data.ocrResult?.extractedText || ''
      const classification = result.data.ocrResult?.classification?.type || 'Unknown'
      const structuredData = extractStructuredData(extractedText, classification)
      
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'completed',
          progress: 100,
          processingEndTime,
          result: {
            documentRecord: result.data.documentRecord,
            ocrResult: result.data.ocrResult,
            specificRecord: result.data.specificRecord,
            supabaseUrl: result.data.supabaseUrl,
            classification,
            extractedText,
            confidence: result.data.ocrResult?.classification?.confidence || 0,
            extractedData: structuredData
          }
        } : f
      ))

    } catch (error) {
      console.error('Processing error:', error)
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'error',
          error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        } : f
      ))
    }
  }

  const handleFiles = useCallback(async (fileList: File[]) => {
    const validFiles = fileList.filter(file => {
      const validTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'image/jpeg', 
        'image/png',
        'image/webp'
      ]
      const validSize = file.size <= 20 * 1024 * 1024 // 20MB
      return validTypes.includes(file.type) && validSize
    })

    const newFiles: ProcessedFile[] = validFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36),
      name: file.name,
      size: file.size,
      status: 'uploading',
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])

    // Process files sequentially for better UX
    for (const [index, file] of validFiles.entries()) {
      const fileRecord = newFiles[index]
      await processFile(file, fileRecord.id)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [handleFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }, [handleFiles])

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getProcessingTime = (file: ProcessedFile) => {
    if (!file.startTime) return '0.0s'
    
    // If completed, use the actual processing time
    if (file.status === 'completed' && file.processingEndTime && file.startTime) {
      const actualTime = (file.processingEndTime - file.startTime) / 1000
      return `${actualTime.toFixed(1)}s`
    }
    
    // For ongoing processes, show current elapsed time
    const elapsed = Date.now() - file.startTime
    return `${(elapsed / 1000).toFixed(1)}s`
  }

  const extractStructuredData = (text: string, classification: string) => {
    const extractedData: any = {}
    
    // Helper function to validate extracted data
    const isValidData = (value: string, minLength: number = 2, maxLength: number = 100) => {
      return value && value.length >= minLength && value.length <= maxLength && 
             !value.includes('undefined') && !value.includes('null')
    }
    
    // Extract names with context validation
    const namePatterns = [
      /(?:Name|Namen|Nachname|Vorname|Versicherter|Antragsteller)[\s:]+([A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+)/i,
      /(?:Herr|Frau|Mr|Mrs)\.?\s+([A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+)/i
    ]
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern)
      if (match && isValidData(match[1], 4, 50)) {
        extractedData.name = match[1].trim()
        break
      }
    }
    
    // Extract Swiss addresses with proper validation
    const addressPatterns = [
      /([A-ZÄÖÜ][a-zäöüß\s]+\s+\d+[a-z]?,?\s*\d{4}\s+[A-ZÄÖÜ][a-zäöüß\s]+)/i,
      /(?:Adresse|Anschrift|Wohnort)[\s:]+([A-ZÄÖÜ][a-zäöüß\s]+\d+[a-z]?,?\s*\d{4}\s+[A-ZÄÖÜ][a-zäöüß\s]+)/i
    ]
    
    for (const pattern of addressPatterns) {
      const match = text.match(pattern)
      if (match && isValidData(match[1], 10, 80) && match[1].match(/\d{4}/)) {
        extractedData.address = match[1].trim()
        break
      }
    }
    
    // Extract phone numbers with Swiss validation
    const phonePatterns = [
      /(?:Tel|Telefon|Phone)[\s:]*(\+41\s*\d{2}\s*\d{3}\s*\d{2}\s*\d{2})/i,
      /(?:Tel|Telefon|Phone)[\s:]*(0\d{2}\s*\d{3}\s*\d{2}\s*\d{2})/i,
      /(?:Mobile|Handy|Natel)[\s:]*(\+41\s*7\d\s*\d{3}\s*\d{2}\s*\d{2})/i
    ]
    
    for (const pattern of phonePatterns) {
      const match = text.match(pattern)
      if (match && isValidData(match[1], 8, 20)) {
        extractedData.phoneNumber = match[1].replace(/\s+/g, ' ').trim()
        break
      }
    }
    
    // Extract email addresses with validation
    const emailPattern = /(?:E-Mail|Email|Mail)[\s:]*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
    const emailMatch = text.match(emailPattern)
    if (emailMatch && isValidData(emailMatch[1], 5, 50) && emailMatch[1].includes('@')) {
      extractedData.email = emailMatch[1]
    }
    
    // Extract AHV numbers with strict validation
    const ahvPattern = /(?:AHV|AVS|Sozialversicherung)[\s:]*(\d{3}\.\d{4}\.\d{4}\.\d{2})/i
    const ahvMatch = text.match(ahvPattern)
    if (ahvMatch && ahvMatch[1].startsWith('756')) {
      extractedData.insuranceNumber = ahvMatch[1]
    }
    
    // Extract policy numbers with context
    const policyPatterns = [
      /(?:Police|Vertrag|Policen)[\s-]*(?:Nr|Nummer)[\s:]*([A-Z0-9\-]{6,20})/i,
      /(?:Vertrags)[\s-]*(?:Nr|Nummer)[\s:]*([A-Z0-9\-]{6,20})/i
    ]
    
    for (const pattern of policyPatterns) {
      const match = text.match(pattern)
      if (match && isValidData(match[1], 6, 20) && /[A-Z0-9]/.test(match[1])) {
        extractedData.policyNumber = match[1].trim()
        break
      }
    }
    
    // Extract dates with context and validation
    const datePatterns = [
      /(?:Geburtsdatum|Geboren)[\s:]*(\d{1,2}[\.\-\/]\d{1,2}[\.\-\/]\d{4})/i,
      /(?:Ereignis|Unfall|Schaden)[\s-]*(?:datum|tag)[\s:]*(\d{1,2}[\.\-\/]\d{1,2}[\.\-\/]\d{4})/i,
      /(?:Datum|vom)[\s:]*(\d{1,2}[\.\-\/]\d{1,2}[\.\-\/]\d{4})/i
    ]
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern)
      if (match && isValidData(match[1], 8, 12)) {
        const dateStr = match[1]
        if (pattern.source.includes('Geburt')) {
          extractedData.dateOfBirth = dateStr
        } else if (pattern.source.includes('Ereignis|Unfall|Schaden')) {
          extractedData.incidentDate = dateStr
        }
      }
    }
    
    // Extract amounts with context validation
    const amountPatterns = [
      /(?:Schaden|Betrag|Summe|Kosten)[\s:]*(?:CHF|Fr\.)\s*(\d{1,3}(?:[',\s]\d{3})*(?:\.\d{2})?)/i,
      /(?:CHF|Fr\.)\s*(\d{1,3}(?:[',\s]\d{3})*(?:\.\d{2})?)\s*(?:Schaden|Betrag|Summe)/i
    ]
    
    for (const pattern of amountPatterns) {
      const match = text.match(pattern)
      if (match && isValidData(match[1], 1, 15)) {
        extractedData.damageAmount = `CHF ${match[1].replace(/[',\s]/g, '')}`
        break
      }
    }
    
    // Extract company names with context
    const companyPatterns = [
      /(?:Versicherung|Versicherer|bei)[\s:]*\b(Allianz|Mobiliar|SUVA|AXA|Zurich|Helvetia|CSS|Baloise|Generali)\b/gi,
      /\b(Allianz|Mobiliar|SUVA|AXA|Zurich|Helvetia|CSS|Baloise|Generali)\s*(?:Versicherung|AG|Suisse)/gi
    ]
    
    for (const pattern of companyPatterns) {
      const match = text.match(pattern)
      if (match && isValidData(match[1], 3, 20)) {
        extractedData.companyName = match[1]
        break
      }
    }
    
    // Document type specific extractions with validation
    if (classification?.toLowerCase().includes('unfall')) {
      const injuryPattern = /(?:Verletzung|Schmerz|Bruch|verletzt)[\s:]*([a-zäöüß\s]{3,30})/i
      const injuryMatch = text.match(injuryPattern)
      if (injuryMatch && isValidData(injuryMatch[1], 3, 30)) {
        extractedData.injuryType = injuryMatch[1].trim()
      }
    }
    
    if (classification?.toLowerCase().includes('schaden')) {
      const damagePattern = /(?:Schaden|Beschädigung|defekt)[\s:]*([a-zäöüß\s]{3,30})/i
      const damageMatch = text.match(damagePattern)
      if (damageMatch && isValidData(damageMatch[1], 3, 30)) {
        extractedData.damageType = damageMatch[1].trim()
      }
    }
    
    // Final validation - remove any obviously wrong data
    Object.keys(extractedData).forEach(key => {
      const value = extractedData[key]
      if (typeof value === 'string') {
        // Remove if contains only numbers that look like random IDs
        if (key !== 'phoneNumber' && key !== 'insuranceNumber' && key !== 'policyNumber' && 
            /^\d{8,}$/.test(value.replace(/\s/g, ''))) {
          delete extractedData[key]
        }
        // Remove if contains obvious OCR errors
        if (value.includes('|||') || value.includes('___') || value.length < 2) {
          delete extractedData[key]
        }
      }
    })
    
    return extractedData
  }

  const togglePreview = (fileId: string) => {
    setExpandedPreviews(prev => {
      const newSet = new Set(prev)
      if (newSet.has(fileId)) {
        newSet.delete(fileId)
      } else {
        newSet.add(fileId)
      }
      return newSet
    })
  }

  const generateSummary = (result: ProcessedFile['result']) => {
    if (!result) return null

    const text = result.extractedText || ''
    const type = result.classification || 'Unbekannt'
    
    // Extract key information from text
    const extractKeyInfo = (text: string) => {
      const keyInfo = []
      
      // Extract names (common German names or "Name:" patterns)
      const nameMatch = text.match(/(?:Name|Namen)[\s:]+([A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+)/i)
      if (nameMatch) keyInfo.push(`👤 ${nameMatch[1]}`)
      
      // Extract dates
      const dateMatch = text.match(/(\d{1,2}[\.\-\/]\d{1,2}[\.\-\/]\d{2,4})/g)
      if (dateMatch) keyInfo.push(`📅 ${dateMatch[0]}`)
      
      // Extract amounts (CHF, EUR, etc.)
      const amountMatch = text.match(/(\d+[,\.]\d{2})\s*(?:CHF|EUR|€|Fr\.)/i)
      if (amountMatch) keyInfo.push(`💰 ${amountMatch[0]}`)
      
      // Extract policy/reference numbers
      const policyMatch = text.match(/(?:Police|Vertrag|Nr\.?|Nummer)[\s:]*([A-Z0-9\-]{6,})/i)
      if (policyMatch) keyInfo.push(`🔢 ${policyMatch[1]}`)
      
      return keyInfo
    }

    const keyInfo = extractKeyInfo(text)
    
    // Smart summary based on document type with more specific details
    let summary = ''
    let keyPoints: string[] = []

    if (type.toLowerCase().includes('unfall') || type.toLowerCase().includes('accident')) {
      // Check for specific accident details
      const hasInjury = text.toLowerCase().includes('verletzung') || text.toLowerCase().includes('schmerz')
      const hasWorkplace = text.toLowerCase().includes('arbeitsplatz') || text.toLowerCase().includes('betrieb')
      const isSuva = text.toLowerCase().includes('suva') || text.toLowerCase().includes('uvg')
      
      summary = isSuva ? 'SUVA Unfallmeldung - Arbeitsunfall erkannt' : 
                hasWorkplace ? 'Arbeitsunfall-Meldung identifiziert' :
                hasInjury ? 'Unfallbericht mit Verletzungsangaben' :
                'Allgemeine Unfallmeldung erkannt'
      
      keyPoints = [
        `🏥 ${isSuva ? 'SUVA-Dokument' : 'Unfallbericht'}`,
        `🔍 Erkennungsqualität: ${Math.round((result.confidence || 0) * 100)}%`,
        ...keyInfo,
        hasInjury ? '🩹 Verletzungsdetails vorhanden' : '',
        hasWorkplace ? '🏭 Arbeitsplatz-Kontext' : ''
      ].filter(Boolean)
    } else if (type.toLowerCase().includes('rechnung') || type.toLowerCase().includes('invoice')) {
      const hasVAT = text.toLowerCase().includes('mwst') || text.toLowerCase().includes('ust')
      const hasAmount = text.match(/(\d+[,\.]\d{2})\s*(?:CHF|EUR|€)/i)
      
      summary = hasAmount ? `Rechnung über ${hasAmount[0]} ${hasVAT ? '(inkl. MwSt.)' : ''}` :
                hasVAT ? 'Steuerrelevante Rechnung erkannt' :
                'Zahlungsdokument identifiziert'
      
      keyPoints = [
        `💰 Rechnungsdokument`,
        `🔍 Erkennungsqualität: ${Math.round((result.confidence || 0) * 100)}%`,
        ...keyInfo,
        hasVAT ? '📊 MwSt.-pflichtig' : ''
      ].filter(Boolean)
    } else if (type.toLowerCase().includes('kündigung')) {
      const hasPolicy = text.toLowerCase().includes('police') || text.toLowerCase().includes('vertrag')
      const hasInsurance = text.toLowerCase().includes('versicherung')
      
      summary = hasInsurance ? 'Versicherungskündigung eingereicht' :
                hasPolicy ? 'Vertragskündigung dokumentiert' :
                'Kündigungsschreiben verarbeitet'
      
      keyPoints = [
        `📝 ${hasInsurance ? 'Versicherungs-' : ''}Kündigung`,
        `🔍 Erkennungsqualität: ${Math.round((result.confidence || 0) * 100)}%`,
        ...keyInfo,
        hasPolicy ? '📋 Vertragsbezug erkannt' : ''
      ].filter(Boolean)
    } else {
      // Determine document purpose from content
      const isForm = text.toLowerCase().includes('formular') || text.toLowerCase().includes('antrag')
      const isInfo = text.toLowerCase().includes('information') || text.toLowerCase().includes('bedingung')
      
      summary = isForm ? 'Formular oder Antrag erkannt' :
                isInfo ? 'Informationsdokument verarbeitet' :
                `${type} - Erfolgreich klassifiziert`
      
      keyPoints = [
        `📄 ${isForm ? 'Formular' : isInfo ? 'Information' : type}`,
        `🔍 Erkennungsqualität: ${Math.round((result.confidence || 0) * 100)}%`,
        ...keyInfo,
        `📊 ${text.length} Zeichen analysiert`
      ].filter(Boolean)
    }

    return { summary, keyPoints }
  }

  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) {
      return <ImageIcon className="w-5 h-5 text-blue-400" />
    }
    return <FileText className="w-5 h-5 text-emerald-400" />
  }

  const getStatusIcon = (status: ProcessedFile['status']) => {
    switch (status) {
      case 'uploading': return <Upload className="h-4 w-4 text-blue-400" />
      case 'ocr-processing': return <Eye className="h-4 w-4 text-purple-400" />
      case 'saving': return <Database className="h-4 w-4 text-emerald-400" />
      case 'email-sending': return <Mail className="h-4 w-4 text-cyan-400" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />
      default: return <Clock className="h-4 w-4 text-neutral-400" />
    }
  }

  const getStatusText = (status: ProcessedFile['status']) => {
    switch (status) {
      case 'uploading': return 'Hochladen...'
      case 'ocr-processing': return 'OCR-Verarbeitung...'
      case 'saving': return 'In Supabase speichern...'
      case 'email-sending': return 'E-Mail versenden...'
      case 'completed': return 'Abgeschlossen'
      case 'error': return 'Fehler'
      default: return 'Unbekannt'
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          📄 Alpha Informatik OCR Verarbeitungszentrum
        </h2>
        <p className="text-neutral-300 mb-6">
          Laden Sie Ihre Schweizer Versicherungsdokumente hoch für automatische OCR-Verarbeitung 
          und intelligente Klassifizierung.
        </p>
        
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-blue-400 bg-blue-500/10'
              : 'border-neutral-600 hover:border-neutral-500 hover:bg-neutral-700/20'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <p className="text-lg font-medium text-white mb-2">
            Dokumente hier ablegen
          </p>
          <p className="text-sm text-neutral-300 mb-4">
            oder{' '}
            <label className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium underline">
              durchsuchen
              <input
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                onChange={handleFileSelect}
              />
            </label>
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-xs text-neutral-400">
            <span className="px-2 py-1 bg-neutral-700 rounded">PDF</span>
            <span className="px-2 py-1 bg-neutral-700 rounded">Word</span>
            <span className="px-2 py-1 bg-neutral-700 rounded">JPG</span>
            <span className="px-2 py-1 bg-neutral-700 rounded">PNG</span>
            <span className="px-2 py-1 bg-neutral-700 rounded">WebP</span>
            <span className="text-neutral-500">(max. 20MB)</span>
          </div>
        </div>
      </div>

      {/* Processing Queue */}
      {files.length > 0 && (
        <div className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Verarbeitungsqueue ({files.length})
          </h3>
          
          <div className="space-y-4">
            <AnimatePresence>
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-neutral-900/50 border border-neutral-700/30 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getFileTypeIcon(file.name)}
                      <div>
                        <p className="text-sm font-medium text-white">{file.name}</p>
                        <p className="text-xs text-neutral-400">
                          {formatFileSize(file.size)} • {getProcessingTime(file)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {getStatusIcon(file.status)}
                      <span className="text-sm text-neutral-300">
                        {getStatusText(file.status)}
                      </span>
                      {file.status === 'completed' && file.result && (
                        <>
                          <button
                            onClick={() => togglePreview(file.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-md transition-colors flex items-center gap-1"
                          >
                            Vorschau
                            {expandedPreviews.has(file.id) ? 
                              <ChevronUp className="w-3 h-3" /> : 
                              <ChevronDown className="w-3 h-3" />
                            }
                          </button>
                          <button
                            onClick={() => setSelectedFile(file)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
                          >
                            Details
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-neutral-400 hover:text-neutral-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {file.status !== 'completed' && file.status !== 'error' && (
                    <div className="w-full bg-neutral-700 rounded-full h-2 mb-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full"
                        style={{ width: `${file.progress}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}

                  {/* Error Display */}
                  {file.error && (
                    <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-xs">
                      {file.error}
                    </div>
                  )}

                  {/* Quick Result Preview */}
                  {file.result && file.status === 'completed' && !expandedPreviews.has(file.id) && (
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="bg-neutral-800/50 p-2 rounded">
                        <div className="text-neutral-400">Typ</div>
                        <div className="text-white font-medium">{file.result.classification}</div>
                      </div>
                      <div className="bg-neutral-800/50 p-2 rounded">
                        <div className="text-neutral-400">Vertrauen</div>
                        <div className="text-green-400 font-medium">
                          {Math.round((file.result.confidence || 0) * 100)}%
                        </div>
                      </div>
                      <div className="bg-neutral-800/50 p-2 rounded">
                        <div className="text-neutral-400">Dokument ID</div>
                        <div className="text-cyan-400 font-mono">
                          {file.result.documentRecord?.id?.substring(0, 8)}...
                        </div>
                      </div>
                      <div className="bg-neutral-800/50 p-2 rounded">
                        <div className="text-neutral-400">Status</div>
                        <div className="text-emerald-400 font-medium">Gespeichert</div>
                      </div>
                    </div>
                  )}

                  {/* Expanded Preview with Smart Summary */}
                  <AnimatePresence>
                    {expandedPreviews.has(file.id) && file.result && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 border-t border-neutral-700/50 pt-4"
                      >
                        {(() => {
                          const summaryData = generateSummary(file.result)
                          if (!summaryData) return null
                          
                          return (
                            <div className="space-y-4">
                              {/* Summary Header */}
                              <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-emerald-300 mb-2">
                                  📋 Dokument-Zusammenfassung
                                </h4>
                                <p className="text-neutral-200 text-sm mb-3">
                                  {summaryData.summary}
                                </p>
                                
                                {/* Key Points */}
                                <div className="space-y-1">
                                  {summaryData.keyPoints.map((point, index) => (
                                    <div key={index} className="text-xs text-neutral-300 flex items-start gap-2">
                                      <span className="text-emerald-400">•</span>
                                      <span>{point}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Extracted Structured Data */}
                              {file.result.extractedData && Object.keys(file.result.extractedData).length > 0 && (
                                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
                                  <h4 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
                                    <Database className="w-4 h-4" />
                                    Extrahierte Daten
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {Object.entries(file.result.extractedData).map(([key, value]) => {
                                      if (!value) return null
                                      
                                      const getFieldLabel = (field: string) => {
                                        const labels: Record<string, string> = {
                                          name: '👤 Name',
                                          address: '📍 Adresse',
                                          insuranceNumber: '🆔 Versicherungsnummer',
                                          policyNumber: '📋 Policennummer',
                                          phoneNumber: '📞 Telefon',
                                          email: '📧 E-Mail',
                                          dateOfBirth: '🎂 Geburtsdatum',
                                          incidentDate: '📅 Ereignisdatum',
                                          damageAmount: '💰 Schadenssumme',
                                          companyName: '🏢 Versicherung',
                                          injuryType: '🩹 Verletzungsart',
                                          damageType: '⚠️ Schadensart'
                                        }
                                        return labels[field] || field
                                      }
                                      
                                      return (
                                        <div key={key} className="bg-neutral-800/40 p-3 rounded-lg">
                                          <div className="text-xs text-blue-300 mb-1">
                                            {getFieldLabel(key)}
                                          </div>
                                          <div className="text-white text-sm font-medium break-words">
                                            {value}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Text Preview */}
                              <div className="bg-neutral-800/30 border border-neutral-700/30 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  OCR-Text Vorschau
                                </h4>
                                <div className="bg-neutral-900/50 p-3 rounded text-xs text-neutral-200 max-h-32 overflow-y-auto">
                                  {file.result.extractedText?.substring(0, 300) || 'Kein Text erkannt'}
                                  {(file.result.extractedText?.length || 0) > 300 && (
                                    <span className="text-neutral-400">... (Text gekürzt)</span>
                                  )}
                                </div>
                              </div>

                              {/* Processing Info */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div className="bg-neutral-800/30 p-3 rounded">
                                  <div className="text-neutral-400 mb-1">Dokument-ID</div>
                                  <div className="text-cyan-400 font-mono">
                                    {file.result.documentRecord?.id?.substring(0, 12) || file.id.substring(0, 12)}...
                                  </div>
                                </div>
                                <div className="bg-neutral-800/30 p-3 rounded">
                                  <div className="text-neutral-400 mb-1">Verarbeitungszeit</div>
                                  <div className="text-emerald-400 font-medium">
                                    {getProcessingTime(file)}
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setSelectedFile(file)}
                                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  Vollständige Details
                                </button>
                              </div>
                            </div>
                          )
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* File Details Modal */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedFile(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">OCR Ergebnisse</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-neutral-300 mb-2">Datei:</h4>
                <p className="text-white">{selectedFile.name}</p>
              </div>
              
              {selectedFile.result && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-300 mb-2">Klassifizierung:</h4>
                    <p className="text-white">{selectedFile.result.classification}</p>
                  </div>

                  {/* Extracted Structured Data in Modal */}
                  {selectedFile.result.extractedData && Object.keys(selectedFile.result.extractedData).length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-neutral-300 mb-2">Extrahierte Daten:</h4>
                      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(selectedFile.result.extractedData).map(([key, value]) => {
                            if (!value) return null
                            
                            const getFieldLabel = (field: string) => {
                              const labels: Record<string, string> = {
                                name: '👤 Name',
                                address: '📍 Adresse',
                                insuranceNumber: '🆔 Versicherungsnummer',
                                policyNumber: '📋 Policennummer',
                                phoneNumber: '📞 Telefon',
                                email: '📧 E-Mail',
                                dateOfBirth: '🎂 Geburtsdatum',
                                incidentDate: '📅 Ereignisdatum',
                                damageAmount: '💰 Schadenssumme',
                                companyName: '🏢 Versicherung',
                                injuryType: '🩹 Verletzungsart',
                                damageType: '⚠️ Schadensart'
                              }
                              return labels[field] || field
                            }
                            
                            return (
                              <div key={key} className="bg-neutral-800/40 p-3 rounded-lg">
                                <div className="text-xs text-blue-300 mb-1">
                                  {getFieldLabel(key)}
                                </div>
                                <div className="text-white text-sm font-medium break-words">
                                  {value}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-neutral-300 mb-2">Erkannter Text:</h4>
                    <div className="bg-neutral-800 p-3 rounded max-h-40 overflow-y-auto text-sm text-neutral-200">
                      {selectedFile.result.extractedText?.substring(0, 500)}
                      {(selectedFile.result.extractedText?.length || 0) > 500 && '...'}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-neutral-300 mb-2">Verarbeitungszeit:</h4>
                    <p className="text-emerald-400 text-sm">{getProcessingTime(selectedFile)}</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}