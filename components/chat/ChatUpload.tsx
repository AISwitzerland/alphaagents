'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/types/constants';

interface UserInfo {
  name: string;
  email: string;
  phone?: string;
}

export function ChatUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phone: '',
  });
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !userInfo.name || !userInfo.email) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', userInfo.name);
    formData.append('email', userInfo.email);
    if (userInfo.phone) formData.append('phone', userInfo.phone);
    formData.append('source', 'chat');

    try {
      const response = await fetch('/api/document/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload fehlgeschlagen');
      }

      setStatus('success');
      setFile(null);
      setUserInfo({ name: '', email: '', phone: '' });
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Ein Fehler ist aufgetreten');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Dokument hochladen</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Benutzerinformationen */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Name *"
            value={userInfo.name}
            onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="E-Mail *"
            value={userInfo.email}
            onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="tel"
            placeholder="Telefon (optional)"
            value={userInfo.phone}
            onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
            ${status === 'error' ? 'border-red-500' : ''}`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="text-sm">
              <p className="font-medium">{file.name}</p>
              <p className="text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <p className="text-gray-500">
              {isDragActive
                ? 'Datei hier ablegen...'
                : 'Datei hierher ziehen oder klicken zum Auswählen'}
            </p>
          )}
        </div>

        {/* Fehlermeldung */}
        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || !userInfo.name || !userInfo.email || status === 'uploading'}
          className={`w-full py-2 px-4 rounded font-medium
            ${status === 'uploading'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90'}
          `}
        >
          {status === 'uploading' ? 'Wird hochgeladen...' : 'Hochladen'}
        </button>

        {/* Erfolgsmeldung */}
        {status === 'success' && (
          <p className="text-green-500 text-sm text-center">
            Dokument wurde erfolgreich hochgeladen!
          </p>
        )}
      </form>
    </div>
  );
} 