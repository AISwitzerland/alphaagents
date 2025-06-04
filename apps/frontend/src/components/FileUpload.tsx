'use client'

import { useState, useCallback } from 'react'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { apiCall } from '@/lib/utils'

interface UploadedFile {
  id: string
  name: string
  size: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  result?: {
    extractedText?: string
    documentType?: string
    confidence?: number
  }
  error?: string
}

export default function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const uploadFile = async (file: File, fileId: string) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress: 50 } : f
      ))

      const response = await fetch(`${process.env.API_GATEWAY_URL || 'http://localhost:3001'}/api/upload`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()

      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'processing',
          progress: 75 
        } : f
      ))

      // Process with OCR Agent
      const ocrResponse = await apiCall<{
        extractedText: string
        documentType: string
        confidence: number
      }>('/api/process-document', {
        method: 'POST',
        body: JSON.stringify({
          documentId: result.documentId,
          fileName: file.name
        })
      })

      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'completed',
          progress: 100,
          result: ocrResponse
        } : f
      ))

    } catch (error) {
      console.error('Upload error:', error)
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'error',
          error: 'Fehler beim Hochladen oder Verarbeiten der Datei'
        } : f
      ))
    }
  }

  const handleFiles = useCallback(async (fileList: File[]) => {
    const validFiles = fileList.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
      const validSize = file.size <= 20 * 1024 * 1024 // 20MB
      return validTypes.includes(file.type) && validSize
    })

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36),
      name: file.name,
      size: file.size,
      status: 'uploading',
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])

    for (const [index, file] of validFiles.entries()) {
      const fileRecord = newFiles[index]
      await uploadFile(file, fileRecord.id)
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Dokumente hochladen
      </h2>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Dokumente hier ablegen
        </p>
        <p className="text-sm text-gray-500 mb-4">
          oder <label className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium">
            durchsuchen
            <input
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />
          </label>
        </p>
        <p className="text-xs text-gray-400">
          Unterstützte Formate: PDF, Word, JPG, PNG (max. 20MB)
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-gray-900">
            Hochgeladene Dateien ({files.length})
          </h3>
          
          {files.map((file) => (
            <div key={file.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {file.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {file.status !== 'completed' && file.status !== 'error' && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}

              <p className="text-xs text-gray-600 mb-2">
                Status: {
                  file.status === 'uploading' ? 'Wird hochgeladen...' :
                  file.status === 'processing' ? 'Wird verarbeitet...' :
                  file.status === 'completed' ? 'Abgeschlossen' :
                  file.status === 'error' ? 'Fehler' : file.status
                }
              </p>

              {file.result && (
                <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">
                    <strong>Dokumenttyp:</strong> {file.result.documentType || 'Unbekannt'}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Vertrauenswert:</strong> {Math.round((file.result.confidence || 0) * 100)}%
                  </p>
                  {file.result.extractedText && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1"><strong>Erkannter Text:</strong></p>
                      <p className="text-xs text-gray-700 max-h-20 overflow-y-auto">
                        {file.result.extractedText.substring(0, 200)}
                        {file.result.extractedText.length > 200 && '...'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {file.error && (
                <p className="text-xs text-red-600 mt-2">{file.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}