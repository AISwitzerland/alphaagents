'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { processIntent } from '@/services/intentService';
import { detectLanguage } from '@/services/languageService';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/types/constants';
import { getNextPrompt, validateInput, getNextStep, updateDataCollectionState } from '@/services/dataCollectionService';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { supabase } from '@/lib/supabase';
import { AppointmentForm } from '@/components/appointments/AppointmentForm';
import { AppointmentCalendar } from '@/components/appointments/AppointmentCalendar';
import { AppointmentService } from '@/services/appointmentService';
import { ChatFlowManager } from '@/services/chatFlowManager';
import { Message, UserContactData, AppointmentStep, DataCollectionStep, DataCollectionState } from '@/types/chat';

interface AppointmentFormData {
  name: string;
  email: string;
  telefon: string;
  notizen?: string;
}

// Mehrere Willkommensnachrichten für Abwechslung
const getWelcomeMessage = (): Message => {
  const greetings = [
    '👋 Hallo! Ich bin Ihr neuer Versicherungsassistent. Probieren Sie mich aus!',
    '👋 Herzlich willkommen! Ich bin Ihr digitaler Versicherungsassistent. Wie kann ich Ihnen heute helfen?',
    '👋 Guten Tag! Ich bin Ihr persönlicher Assistent für alle Versicherungsfragen. Testen Sie meine Fähigkeiten!',
    '👋 Willkommen! Ich bin Ihr neuer KI-Assistent und helfe Ihnen gerne weiter. Stellen Sie mir Ihre Fragen!'
  ];
  
  // Zufällige Begrüßung auswählen
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  
  return {
    id: 'welcome',
    type: 'bot',
    content: `${randomGreeting}\n\nIch kann Ihnen helfen bei:\n• 📅 Termin vereinbaren\n• 📄 Dokumente hochladen\n• ❓ Allgemeine Fragen zu Versicherungen (FAQs)`,
    timestamp: new Date(),
  };
};

export function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAppointment, setShowAppointment] = useState(false);
  const [appointmentStep, setAppointmentStep] = useState<AppointmentStep>('form');
  const [appointmentData, setAppointmentData] = useState<AppointmentFormData | null>(null);
  const [dataCollection, setDataCollection] = useState<DataCollectionState>({
    step: 'idle',
    data: {},
    confirmed: false,
    retries: 0,
  });
  
  // Add refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat service authentication
  useEffect(() => {
    const initializeChatAuth = async () => {
      if (!isOpen) return;
      
      console.log('Initializing chat service authentication...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'aiagent.test.demo@gmail.com',
        password: 'Test123'
      });

      if (error) {
        console.error('Chat service authentication failed:', error);
        setError('Fehler bei der Initialisierung des Chat-Services');
      } else {
        console.log('Chat service authenticated successfully');
      }
    };

    initializeChatAuth();
  }, [isOpen]);

  // Show welcome message when chat is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([getWelcomeMessage()]);
    }
  }, [isOpen]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setError(null);
    const newMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const flowManager = ChatFlowManager.getInstance();
      
      // Check for context switch
      const { shouldSwitchContext, newFlow, response } = await flowManager.handleMessage(newMessage.content);

      if (shouldSwitchContext && newFlow === 'insurance_query') {
        // Clear data collection state immediately
        setDataCollection({
          step: 'idle',
          data: {},
          confirmed: false,
          retries: 0
        });
        
        // Add the bot's response if provided
        if (response) {
          const switchMessage: Message = {
            id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'bot',
            content: response,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, switchMessage]);
        }
        
        setIsTyping(false);
        return; // Exit before data collection validation
      }

      if (shouldSwitchContext && newFlow) {
        // Handle other context switches
        flowManager.switchFlow(newFlow);
        
        if (response) {
          const switchMessage: Message = {
            id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'bot',
            content: response,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, switchMessage]);
        }

        // Reset states when switching context
        if (newFlow === 'appointment') {
          setShowAppointment(true);
          setAppointmentStep('form');
          setAppointmentData(null);
          setDataCollection({
            step: 'idle',
            data: {},
            confirmed: false,
            retries: 0,
          });
        } else {
          setShowAppointment(false);
          setAppointmentStep('form');
          setAppointmentData(null);
          setDataCollection({
            step: newFlow === 'document_upload' ? 'collecting_name' : 'idle',
            data: {},
            confirmed: false,
            retries: 0,
          });
        }
        
        setIsTyping(false);
        return;
      }

      // Handle data collection if in progress
      if (dataCollection.step !== 'idle' && dataCollection.step !== 'ready_for_upload') {
        const validationError = validateInput(dataCollection.step, inputValue.trim());
        if (validationError) {
          const errorMessage: Message = {
            id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'bot',
            content: validationError,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorMessage]);
          setIsTyping(false);
          return;
        }

        // Update data collection state
        const updatedData = {
          ...dataCollection.data,
          [dataCollection.step.replace('collecting_', '')]: inputValue.trim()
        };

        const nextStep = getNextStep(dataCollection.step);
        
        setDataCollection({
          step: nextStep,
          data: updatedData,
          confirmed: nextStep === 'ready_for_upload',
          retries: 0,
        });

        // Get next prompt
        const nextPrompt = getNextPrompt(nextStep, updatedData);
        if (nextPrompt) {
          const promptMessage: Message = {
            id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'bot',
            content: nextPrompt,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, promptMessage]);
        }
        setIsTyping(false);
        return;
      }

      // Normal chat flow
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage].map(msg => ({
            type: msg.type,
            content: msg.content,
          })),
          currentFlow: flowManager.getCurrentFlow().currentFlow,
        }),
      });

      if (!chatResponse.ok) {
        throw new Error('Chat request failed');
      }

      const data = await chatResponse.json();
      const botResponse: Message = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'bot',
        content: data.content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      console.error('Chat Error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Check if we have completed data collection
    if (dataCollection.step !== 'ready_for_upload') {
      setError('Bitte geben Sie zuerst Ihre Kontaktdaten an.');
      return;
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Nicht unterstützter Dateityp. Erlaubt sind nur PDF und Bilddateien.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Die Datei ist zu groß. Maximale Größe ist 10MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('source', 'chat');
      formData.append('name', dataCollection.data.name || '');
      formData.append('email', dataCollection.data.email || '');
      if (dataCollection.data.phone) {
        formData.append('phone', dataCollection.data.phone);
      }

      const response = await fetch('/api/document/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Hochladen der Datei');
      }

      // Add success message to chat
      const uploadMessage: Message = {
        id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'user',
        content: `Datei hochgeladen: ${file.name}`,
        timestamp: new Date(),
        fileName: file.name,
        fileUrl: data.url
      };

      setMessages(prev => [...prev, uploadMessage]);

      // Add bot response
      const botResponse: Message = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'bot',
        content: 'Danke für das Hochladen der Datei. Ich werde sie analysieren und Ihnen gleich Feedback geben.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);

      // Reset data collection state
      setDataCollection({
        step: 'idle',
        data: {},
        confirmed: false,
        retries: 0,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Hochladen der Datei');
      console.error('Upload Error:', err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Add appointment handlers
  const handleAppointmentFormSubmit = async (data: AppointmentFormData) => {
    setAppointmentData(data);
    setAppointmentStep('calendar');
  };

  const handleAppointmentSlotSelect = async (slot: Date) => {
    if (!appointmentData) return;

    try {
      const appointmentService = AppointmentService.getInstance();
      const appointment = await appointmentService.createAppointment({
        ...appointmentData,
        termin_datum: slot
      });

      const confirmationMessage: Message = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'bot',
        content: `Ihr Termin wurde erfolgreich gebucht für ${slot.toLocaleString('de-CH')}. Eine Bestätigung wurde an ${appointmentData.email} gesendet.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, confirmationMessage]);
      setShowAppointment(false);
      setAppointmentStep('form');
      setAppointmentData(null);
    } catch (error) {
      console.error('Appointment creation error:', error);
      const errorMessage: Message = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'bot',
        content: `Entschuldigung, bei der Terminbuchung ist ein Fehler aufgetreten. Ich lerne noch und entwickle mich stetig weiter. Sie können uns jederzeit unter 0800 123 456 oder support@alphaagents.ch erreichen, um den Termin direkt zu vereinbaren.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setError('Der Termin konnte nicht gebucht werden. Bitte kontaktieren Sie uns telefonisch oder per E-Mail.');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 
          transition-all duration-300 flex items-center justify-center"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          )}
        </svg>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-96 bg-white rounded-lg shadow-xl 
              border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-6rem)]"
          >
            {/* Header */}
            <div className="p-4 bg-primary-600 text-white flex-shrink-0">
              <h3 className="text-lg font-semibold">Alpha Informatik Chat</h3>
              <p className="text-sm text-primary-100">Wie können wir Ihnen helfen?</p>
            </div>

            {/* Messages */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[calc(100vh-12rem)]"
              onDragOver={handleDragOver}
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.fileName && (
                      <div className="mt-2 text-sm">
                        <span className="opacity-70">📎 {message.fileName}</span>
                      </div>
                    )}
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-lg p-3 space-x-1 flex">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </motion.div>
              )}
              {showAppointment && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center w-full my-4"
                >
                  <div className="w-full">
                    {appointmentStep === 'form' && (
                      <AppointmentForm
                        onSubmit={handleAppointmentFormSubmit}
                        onCancel={() => {
                          setShowAppointment(false);
                          const cancelMessage: Message = {
                            id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            type: 'bot',
                            content: 'Terminvereinbarung abgebrochen. Wie kann ich Ihnen sonst helfen?',
                            timestamp: new Date()
                          };
                          setMessages(prev => [...prev, cancelMessage]);
                        }}
                      />
                    )}
                    {appointmentStep === 'calendar' && appointmentData && (
                      <AppointmentCalendar
                        onSelectSlot={handleAppointmentSlotSelect}
                        onBack={() => setAppointmentStep('form')}
                      />
                    )}
                  </div>
                </motion.div>
              )}
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="bg-blue-100 text-blue-600 rounded-lg p-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Datei wird hochgeladen... {uploadProgress}%</span>
                    </div>
                  </div>
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="bg-red-100 text-red-600 rounded-lg p-3 text-sm">
                    {error}
                  </div>
                </motion.div>
              )}
              {dataCollection.step === 'ready_for_upload' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center w-full my-4"
                >
                  <div className="w-full">
                    <DocumentUpload 
                      source="chat"
                      skipAuth={true}
                      contactData={{
                        name: dataCollection.data.name,
                        email: dataCollection.data.email,
                        phone: dataCollection.data.phone
                      }}
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ihre Nachricht..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none 
                    focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping || isUploading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 
                    transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 