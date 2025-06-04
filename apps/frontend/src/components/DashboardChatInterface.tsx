'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, MessageSquare, Minimize2, Maximize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: Date
  buttons?: Array<{
    text: string
    value: string
  }>
}

interface DashboardChatInterfaceProps {
  userInfo?: {
    company: string
    email: string
  }
}

export default function DashboardChatInterface({ userInfo }: DashboardChatInterfaceProps) {
  // Generate consistent session ID with company info
  const [sessionId] = useState(() => 
    `dashboard-${userInfo?.company || 'demo'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  )
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Grüezi${userInfo?.company ? ` ${userInfo.company}` : ''}! Ich bin Ihr Alpha Informatik Chat-Assistent im Dashboard. Als Ihr intelligenter Berater kann ich Ihnen helfen bei:

📄 **Dokumentenanalyse & OCR**
• Schweizer Versicherungsdokumente verarbeiten
• OCR-Ergebnisse verbessern und optimieren
• Dokumententypen automatisch klassifizieren

📊 **Dashboard-Management**
• Übersicht Ihrer verarbeiteten Dokumente
• Status-Updates und Verarbeitungsfortschritt
• Datenexport und Berichterstellung

💡 **Fachberatung**
• Schweizer Versicherungsrecht (VVG, KVG, UVG)
• Compliance und Datenschutz-Fragen
• Prozessoptimierung und Automatisierung

Wie kann ich Ihnen heute helfen? Stellen Sie gerne spezifische Fragen zu Ihren Dokumenten oder unserem System.`,
      sender: 'agent',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleButtonClick = (buttonValue: string) => {
    handleMessage(buttonValue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    handleMessage(input.trim())
  }

  const handleMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          chatId: sessionId,
          userId: userInfo?.email || 'dashboard-user',
          context: {
            isDashboard: true,
            company: userInfo?.company,
            email: userInfo?.email,
            language: 'de-CH',
            knowledgeBase: 'swiss_insurance',
            capabilities: ['ocr_analysis', 'document_classification', 'swiss_insurance_law', 'compliance_support']
          }
        })
      })

      if (!response.ok) {
        throw new Error('Chat request failed')
      }

      const data = await response.json()

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Keine Antwort erhalten',
        sender: 'agent',
        timestamp: new Date(),
        buttons: data.buttons || undefined
      }

      setMessages(prev => [...prev, agentMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Entschuldigung, es gab einen Fehler bei der Verarbeitung Ihrer Nachricht. Bitte versuchen Sie es erneut.',
        sender: 'agent',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedQuestions = [
    "Wie kann ich meine OCR-Ergebnisse für Schweizer Dokumente verbessern?",
    "Zeige mir meine letzten Versicherungsdokumente und deren Status",
    "Welche Schweizer Versicherungsformulare erkennt das System automatisch?",
    "Wie funktioniert die automatische Klassifizierung von UVG/KVG Dokumenten?",
    "Welche Compliance-Anforderungen gelten für meine Dokumentenverarbeitung?",
    "Wie exportiere ich meine Dokumente für Revisionen oder Audits?"
  ]

  return (
    <div className="space-y-4">
      {/* Chat Header */}
      <div className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Alpha Informatik Chat Assistant
                </h2>
                <p className="text-purple-100 text-sm">
                  Schweizer Versicherungsexperte • {userInfo?.company || 'Demo Mode'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Messages Container */}
              <div 
                ref={messagesContainerRef} 
                className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-neutral-900/50 to-neutral-900/80"
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-purple-600 text-white'
                      }`}
                    >
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-neutral-400'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString('de-CH')}
                        </p>
                      </div>
                      
                      {/* Buttons for agent messages */}
                      {message.sender === 'agent' && message.buttons && (
                        <div className="flex flex-wrap gap-2 max-w-xs lg:max-w-md">
                          {message.buttons.map((button, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleButtonClick(button.value)}
                              className="px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs rounded-lg transition-all border border-purple-500/30 hover:border-purple-400/50"
                              disabled={isLoading}
                            >
                              {button.text}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {/* Loading Animation */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-neutral-800 text-neutral-200 border border-neutral-700 px-4 py-3 rounded-xl">
                      <div className="flex space-x-2">
                        <motion.div
                          className="w-2 h-2 bg-purple-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-purple-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-purple-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              {messages.length === 1 && (
                <div className="px-4 pb-4">
                  <h4 className="text-sm font-medium text-neutral-300 mb-3">💡 Häufige Fragen zu Alpha Informatik:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(question)}
                        className="text-left p-3 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/30 rounded-lg text-xs text-neutral-300 hover:text-white transition-all hover:border-purple-500/30"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-700/50">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Fragen Sie nach Ihren Dokumenten, OCR-Verarbeitung oder Schweizer Versicherungsrecht..."
                    className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Stats */}
      {!isMinimized && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-neutral-300">Session</span>
            </div>
            <div className="text-lg font-bold text-white">{messages.length - 1}</div>
            <div className="text-xs text-neutral-400">Nachrichten</div>
          </div>
          
          <div className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-neutral-300">Agent</span>
            </div>
            <div className="text-lg font-bold text-emerald-400">Online</div>
            <div className="text-xs text-neutral-400">Status</div>
          </div>
          
          <div className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-neutral-300">Benutzer</span>
            </div>
            <div className="text-lg font-bold text-white truncate">
              {userInfo?.company || 'Demo'}
            </div>
            <div className="text-xs text-neutral-400">Unternehmen</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}