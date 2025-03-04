'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { DocumentService } from '@/services/documentService';
import { supabase } from '@/services/supabaseClient';
import { useDocumentStore } from '@/store/documentStore';
import { v4 as uuidv4 } from 'uuid';
import { DocumentType } from '@/types/document';
import { DocumentStatus } from '@/types';

export default function UploadPage() {
  const [files, setFiles] = useState<Array<File & { preview?: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'idle' | 'uploading' | 'success' | 'error' }>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Document Store verwenden
  const { addDocument } = useDocumentStore();
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Fügt Vorschau-URLs zu Dateien hinzu
    const filesWithPreview = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    
    setFiles(prev => [...prev, ...filesWithPreview]);
    
    // Initialisiere Upload-Status für neue Dateien
    const newUploadStatus: { [key: string]: 'idle' } = {};
    const newUploadProgress: { [key: string]: number } = {};
    
    filesWithPreview.forEach(file => {
      newUploadStatus[file.name] = 'idle';
      newUploadProgress[file.name] = 0;
    });
    
    setUploadStatus(prev => ({ ...prev, ...newUploadStatus }));
    setUploadProgress(prev => ({ ...prev, ...newUploadProgress }));
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  });
  
  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
    
    // Finde die Datei, um die Vorschau zu bereinigen
    const fileToRemove = files.find(file => file.name === fileName);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    // Entferne aus Upload-Status
    const newUploadStatus = { ...uploadStatus };
    delete newUploadStatus[fileName];
    setUploadStatus(newUploadStatus);
    
    // Entferne aus Upload-Fortschritt
    const newUploadProgress = { ...uploadProgress };
    delete newUploadProgress[fileName];
    setUploadProgress(newUploadProgress);
  };
  
  // Supabase Auth Status überprüfen
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Fehler beim Abrufen der Session:', error);
        return;
      }
      
      if (session) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        console.log('Benutzer angemeldet:', session.user.email);
        console.log('Benutzer-ID:', session.user.id);
      } else {
        // Versuche Auto-Login falls keine Session
        try {
          const { data, error: loginError } = await supabase.auth.signInWithPassword({
            email: 'aiagent.test.demo@gmail.com',
            password: 'Test123',
          });
          
          if (loginError) {
            console.error('Auto-Login fehlgeschlagen:', loginError);
            return;
          }
          
          if (data.session) {
            setIsAuthenticated(true);
            setUserId(data.session.user.id);
            console.log('Auto-Login erfolgreich:', data.session.user.email);
            console.log('Benutzer-ID:', data.session.user.id);
          }
        } catch (e) {
          console.error('Unerwarteter Fehler beim Login:', e);
        }
      }
    };
    
    checkAuth();
  }, []);
  
  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    // Überprüfen, ob wir authentifiziert sind
    if (!isAuthenticated) {
      console.error('Benutzer ist nicht authentifiziert, versuche erneut anzumelden');
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'aiagent.test.demo@gmail.com',
          password: 'Test123',
        });
        
        if (error) {
          console.error('Login fehlgeschlagen:', error);
          alert('Upload fehlgeschlagen: Anmeldung nicht möglich.');
          return;
        }
        
        if (data.session) {
          setIsAuthenticated(true);
          setUserId(data.session.user.id);
        } else {
          alert('Upload fehlgeschlagen: Keine Session nach Anmeldung.');
          return;
        }
      } catch (e) {
        console.error('Unerwarteter Fehler beim Login:', e);
        alert('Upload fehlgeschlagen: Anmeldefehler.');
        return;
      }
    }
    
    setUploading(true);
    
    // Verwende den DocumentService für den Upload
    const documentService = DocumentService.getInstance();
    
    // Für jede Datei einen Upload durchführen
    const uploadPromises = files.map(async (file) => {
      try {
        setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }));
        setUploadProgress(prev => ({ ...prev, [file.name]: 10 }));
        
        // Echter Benutzer mit ID aus der Authentifizierung
        const userData = {
          name: 'Test Benutzer',
          email: 'aiagent.test.demo@gmail.com',
          id: userId || '550e8400-e29b-41d4-a716-446655440000' // Verwende die echte ID wenn verfügbar
        };
        
        console.log('Upload mit Benutzer-ID:', userData.id);
        
        // Start des Uploads mit Updates für den Fortschritt
        const simulateProgress = () => {
          let progress = 10;
          const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 90) progress = 90; // Wir lassen die letzten 10% für den tatsächlichen Abschluss
            
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: Math.round(progress)
            }));
            
            if (progress >= 90) {
              clearInterval(interval);
            }
          }, 300);
          
          return interval;
        };
        
        const progressInterval = simulateProgress();
        
        // Echter Upload mit DocumentService
        console.log('Starte Upload für:', file.name);
        const result = await documentService.uploadDocument(file, userData);
        console.log('Upload-Ergebnis für', file.name, ':', result);
        
        // Bereinige den Fortschritts-Interval
        clearInterval(progressInterval);
        
        if (result.success) {
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
          setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
          
          // Erstelle ein Document-Objekt für den lokalen Store
          if (result.processId) {
            const docId = result.documentId || uuidv4(); // Fallback, wenn keine ID zurückgegeben wird
            
            // Erstelle Dokument für lokalen Store
            const documentForStore = {
              id: docId,
              type: 'misc' as DocumentType, // Explizites Type-Casting zu DocumentType
              status: {
                status: 'eingereicht' as DocumentStatus, // Korrekter Typ für Status
                progress: 100,
                message: 'Dokument wurde hochgeladen'
              },
              metadata: {
                originalName: file.name,
                size: file.size,
                mimeType: file.type,
                uploadedBy: userData,
                uploadedAt: new Date().toISOString(),
                source: 'chat' as const // Literal-Typ
              },
              filePath: result.path || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            
            // Füge das Dokument zum lokalen Store hinzu
            await addDocument(documentForStore);
            
            console.log('Dokument wurde zum lokalen Store hinzugefügt:', docId);
          }
        } else {
          setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
          console.error('Upload fehlgeschlagen:', result.error);
        }
        
        return {
          fileName: file.name,
          success: result.success,
          processId: result.processId
        };
      } catch (error) {
        console.error('Fehler beim Upload von', file.name, ':', error);
        setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
        
        return {
          fileName: file.name,
          success: false,
          error
        };
      }
    });
    
    // Warte auf alle Uploads
    const results = await Promise.all(uploadPromises);
    console.log('Alle Uploads abgeschlossen:', results);
    
    // Nach Abschluss aller Uploads
    setUploading(false);
  };
  
  const cancelUpload = () => {
    setUploading(false);
    // In einer echten App würden hier die laufenden Uploads abgebrochen
  };
  
  const resetAll = () => {
    // Bereinige Vorschau-URLs
    files.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    
    setFiles([]);
    setUploadStatus({});
    setUploadProgress({});
    setUploading(false);
  };
  
  // Bestimme das Symbol für den Dateityp
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return (
          <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        );
      case 'doc':
      case 'docx':
        return (
          <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'xls':
      case 'xlsx':
        return (
          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
        return (
          <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };
  
  // Bestimme das Badge für den Upload-Status
  const getStatusBadge = (status: 'idle' | 'uploading' | 'success' | 'error') => {
    switch (status) {
      case 'idle':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Bereit</span>;
      case 'uploading':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Wird hochgeladen...</span>;
      case 'success':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Erfolgreich</span>;
      case 'error':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Fehler</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl shadow-lg">
        <div className="px-6 py-8 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl font-bold text-white"
              >
                Dokumente hochladen
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-1 text-primary-100"
              >
                Laden Sie neue Dokumente zur Verarbeitung hoch
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden"
      >
        <div className="p-6">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-200
              ${isDragActive 
                ? 'border-primary-400 bg-primary-50' 
                : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="text-center">
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {isDragActive 
                    ? 'Dateien hier ablegen...' 
                    : 'Ziehen Sie Dateien hierher oder klicken Sie zum Auswählen'}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  PDF, Word, Excel und Bilder bis zu 10MB
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={(e) => {
                  e.stopPropagation();
                  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                  if (fileInput) fileInput.click();
                }}
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Dateien auswählen
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* File List */}
      {files.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Ausgewählte Dateien</h3>
            <div className="flex space-x-3">
              {!uploading ? (
                <>
                  <button
                    onClick={resetAll}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Alle entfernen
                  </button>
                  <button
                    onClick={uploadFiles}
                    disabled={files.length === 0}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload starten
                  </button>
                </>
              ) : (
                <button
                  onClick={cancelUpload}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Abbrechen
                </button>
              )}
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {files.map((file, index) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-gray-100">
                      {getFileIcon(file.name)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary-600 truncate max-w-md">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Status Badge */}
                  {getStatusBadge(uploadStatus[file.name] || 'idle')}
                  
                  {/* Progress Bar */}
                  {uploadStatus[file.name] === 'uploading' && (
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress[file.name] || 0}%` }}
                      ></div>
                    </div>
                  )}
                  
                  {/* Remove Button (only if not uploading) */}
                  {uploadStatus[file.name] !== 'uploading' && (
                    <button
                      onClick={() => removeFile(file.name)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      disabled={uploading}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                {files.length} {files.length === 1 ? 'Datei' : 'Dateien'} ausgewählt
                {uploading && (
                  <span className="ml-2">
                    ({Object.values(uploadStatus).filter(status => status === 'success').length} von {files.length} abgeschlossen)
                  </span>
                )}
              </p>
              
              {/* Total Progress Bar */}
              {uploading && (
                <div className="w-48 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ 
                      width: `${Math.round(
                        Object.values(uploadProgress).reduce((sum, current) => sum + current, 0) / 
                        (files.length * 100) * 100
                      )}%` 
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Instructions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Hinweise zum Hochladen</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Unterstützte Dateitypen</h4>
                <p className="mt-1 text-xs text-gray-500">PDF, Word (doc, docx), Excel (xls, xlsx), Bilder (jpg, png)</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Verarbeitungszeit</h4>
                <p className="mt-1 text-xs text-gray-500">Die Verarbeitung kann je nach Dokumentengröße und -typ einige Minuten dauern.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Hinweis</h4>
                <p className="mt-1 text-xs text-gray-500">Stellen Sie sicher, dass die Dokumente gut lesbar und nicht passwortgeschützt sind.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 