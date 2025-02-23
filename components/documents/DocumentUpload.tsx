'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/types/constants';
import { DatabaseService } from '@/services/databaseService';
import { supabase } from '@/lib/supabase';

interface DocumentUploadProps {
  source: 'chat' | 'dashboard';
  contactData?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  skipAuth?: boolean;
}

export function DocumentUpload({ source = 'dashboard', contactData, skipAuth = false }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const db = DatabaseService.getInstance();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrorMessage('Nicht unterstützter Dateityp');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('Datei ist zu groß (max. 20MB)');
      return;
    }

    setFile(file);
    setErrorMessage('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/tiff': ['.tiff', '.tif']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    try {
      setStatus('uploading');
      setProgress(0);
      console.log('Starte Upload-Prozess...');

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Current session:', session ? 'Found' : 'Not found');

      if (!session && !skipAuth) {
        throw new Error('Keine gültige Session verfügbar');
      }

      // Erstelle FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('source', source);
      
      // Add contact data if from chat
      if (source === 'chat' && contactData) {
        formData.append('name', contactData.name || '');
        formData.append('email', contactData.email || '');
        formData.append('phone', contactData.phone || '');
      }

      // Add auth header if session exists
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      
      if (session?.access_token && !skipAuth) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      // Send request
      const response = await fetch('/api/document/upload', {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include', // Important for sending cookies
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Upload fehlgeschlagen: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      console.log('Upload erfolgreich:', result);

      setProgress(100);
      setStatus('success');
      setFile(null);
      
    } catch (error) {
      console.error('Upload-Fehler:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropzone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dokument *</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'}
              ${status === 'error' ? 'border-red-500 bg-red-50' : ''}`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="text-sm">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2">
                  {isDragActive
                    ? 'Datei hier ablegen...'
                    : 'Datei hierher ziehen oder klicken zum Auswählen'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        {(status === 'uploading' || status === 'processing') && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                {status === 'uploading' ? 'Wird hochgeladen...' : 'Wird verarbeitet...'}
              </span>
              <span className="text-gray-700">{progress}%</span>
            </div>
            <div className="overflow-hidden rounded-full bg-gray-200">
              <motion.div
                className="h-2 rounded-full bg-primary-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Success Message */}
        {status === 'success' && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">
                  Dokument wurde erfolgreich hochgeladen und wird verarbeitet
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || status === 'uploading' || status === 'processing'}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
            ${status === 'uploading' || status === 'processing'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'}
          `}
        >
          {status === 'uploading' ? 'Wird hochgeladen...' :
           status === 'processing' ? 'Wird verarbeitet...' :
           'Hochladen'}
        </button>
      </form>
    </div>
  );
} 