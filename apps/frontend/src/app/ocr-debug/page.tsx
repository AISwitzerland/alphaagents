'use client';

import { useState } from 'react';
import AutonomysNavbar from '@/components/AutonomysNavbar';
import { motion } from 'framer-motion';
import { Upload, FileText, Brain, Database, CheckCircle, AlertCircle } from 'lucide-react';

interface OCRResult {
  extractedText: string;
  classification: {
    type: string;
    category: string;
    confidence: number;
    summary: string;
    keyFields: Record<string, any>;
  };
  processingTime: number;
  confidence: number;
}

export default function OCRDebugPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setOcrResult(null);
      setError(null);
      setProcessingSteps([]);
    }
  };

  const processDocument = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);
    setProcessingSteps(['🚀 Upload gestartet...']);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setProcessingSteps(prev => [...prev, '📄 Dokument wird analysiert...']);
      
      const response = await fetch('/api/ocr-debug', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setProcessingSteps(prev => [...prev, '🤖 OCR-Agent verarbeitet...']);
      
      const result = await response.json();
      
      if (result.success) {
        setProcessingSteps(prev => [...prev, '✅ Verarbeitung abgeschlossen!']);
        setOcrResult(result.data);
      } else {
        throw new Error(result.error || 'OCR processing failed');
      }
    } catch (err) {
      console.error('OCR Debug error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setProcessingSteps(prev => [...prev, '❌ Fehler aufgetreten']);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToSupabase = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);
    setProcessingSteps(['💾 Speichert in Supabase...']);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setProcessingSteps(prev => [...prev, '📁 Upload zu Supabase...']);
      
      const response = await fetch('/api/ocr-save', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setProcessingSteps(prev => [...prev, '🤖 OCR-Verarbeitung...']);
      setProcessingSteps(prev => [...prev, '💾 Speichere in Datenbank...']);
      
      const result = await response.json();
      
      if (result.success) {
        setProcessingSteps(prev => [...prev, '✅ In Supabase gespeichert!']);
        setOcrResult(result.data.ocrResult);
        
        // Show Supabase link
        if (result.data.supabaseUrl) {
          setProcessingSteps(prev => [...prev, `🔗 Verfügbar in Supabase: ${result.data.supabaseUrl}`]);
        }
      } else {
        throw new Error(result.error || 'Saving failed');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setProcessingSteps(prev => [...prev, '❌ Speicher-Fehler aufgetreten']);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <AutonomysNavbar />
      
      {/* Hero Section - Autonomys Style */}
      <section className="relative py-24 bg-gradient-to-b from-neutral-950 to-neutral-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-48 h-48 bg-green-500/10 rounded-full blur-xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <div className="container-professional relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-800 border border-neutral-700 mb-8"
            >
              <motion.div 
                className="w-2 h-2 bg-green-400 rounded-full mr-2"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-neutral-300 text-sm font-medium">Alpha AI OCR Development Console</span>
            </motion.div>
            
            {/* Animated Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              OCR{' '}
              <motion.span 
                className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Debug Console
              </motion.span>
            </motion.h1>
            
            {/* Animated Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-neutral-200 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Analysieren Sie Dokumente in Echtzeit mit unserem Alpha AI OCR-Agent. 
              Entwickler-Tools für GPT-4o Vision Dokumentenverarbeitung.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Console - Dark Theme */}
      <section className="py-16 bg-gradient-to-b from-neutral-900 to-black">
        <div className="container-professional">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Upload className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Dokument Upload</h2>
              </div>
              
              <div className="border-2 border-dashed border-neutral-600 rounded-lg p-8 text-center hover:border-emerald-500/50 transition-colors">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.docx"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block"
                >
                  <div className="text-neutral-400 mb-4">
                    <Upload className="mx-auto h-12 w-12" />
                  </div>
                  <span className="text-sm text-neutral-300">
                    Klicken Sie hier oder ziehen Sie eine Datei hierher
                  </span>
                  <p className="text-xs text-neutral-500 mt-2">
                    PDF, JPG, PNG, WEBP, DOCX unterstützt
                  </p>
                </label>
              </div>

              {selectedFile && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-neutral-700/30 border border-neutral-600/50 rounded-lg"
                >
                  <div className="flex items-center mb-3">
                    <FileText className="h-4 w-4 text-emerald-400 mr-2" />
                    <span className="text-sm font-medium text-white">Datei-Details</span>
                  </div>
                  <div className="space-y-1 text-sm text-neutral-300">
                    <p><strong>Name:</strong> {selectedFile.name}</p>
                    <p><strong>Größe:</strong> {(selectedFile.size / 1024).toFixed(1)} KB</p>
                    <p><strong>Typ:</strong> {selectedFile.type}</p>
                  </div>
                </motion.div>
              )}

              <div className="mt-6 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={processDocument}
                  disabled={!selectedFile || isProcessing}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Verarbeitung läuft...' : 'OCR starten'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveToSupabase}
                  disabled={!selectedFile || isProcessing}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  <Database className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Speichert...' : 'OCR + Speichern in Supabase'}
                </motion.button>
              </div>
            </motion.div>

            {/* Processing Steps */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Brain className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Verarbeitungsschritte</h2>
              </div>
              
              <div className="space-y-3">
                {processingSteps.map((step, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center text-sm text-neutral-300"
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs mr-3 font-medium">
                      {index + 1}
                    </span>
                    {step}
                  </motion.div>
                ))}
                
                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center text-sm text-blue-400"
                  >
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full mr-3"
                    />
                    Verarbeitung läuft...
                  </motion.div>
                )}
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                    <p className="text-red-300 text-sm">
                      <strong>Fehler:</strong> {error}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Results Section */}
          {ocrResult && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
                    <FileText className="h-5 w-5 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">AI Klassifizierung</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Dokumenttyp
                    </label>
                    <p className="text-lg font-semibold text-emerald-400">
                      {ocrResult.classification.type}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Kategorie
                    </label>
                    <p className="text-white">{ocrResult.classification.category}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      KI-Konfidenz
                    </label>
                    <div className="flex items-center">
                      <div className="w-full bg-neutral-700 rounded-full h-3 mr-3">
                        <motion.div 
                          className="bg-gradient-to-r from-emerald-500 to-green-400 h-3 rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${ocrResult.classification.confidence * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <span className="text-sm text-emerald-400 font-medium">
                        {(ocrResult.classification.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      AI-Zusammenfassung
                    </label>
                    <p className="text-neutral-200 text-sm leading-relaxed">
                      {ocrResult.classification.summary}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-4">
                    <CheckCircle className="h-5 w-5 text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Extrahierte Felder</h2>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {Object.entries(ocrResult.classification.keyFields).map(([key, value], index) => (
                    <motion.div 
                      key={key} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-start border-b border-neutral-700/30 pb-3"
                    >
                      <span className="text-sm font-medium text-neutral-400 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-sm text-neutral-200 text-right max-w-xs">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 lg:col-span-2"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mr-4">
                      <FileText className="h-5 w-5 text-orange-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Extrahierter Text</h2>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-neutral-400">
                    <span>⏱️ {ocrResult.processingTime}ms</span>
                    <span>📝 {ocrResult.extractedText.length} Zeichen</span>
                  </div>
                </div>
                
                <div className="bg-neutral-900/50 border border-neutral-700/30 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-neutral-200 whitespace-pre-wrap font-mono leading-relaxed">
                    {ocrResult.extractedText}
                  </pre>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}