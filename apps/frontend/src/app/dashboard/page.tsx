'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Activity, 
  FileText, 
  Users, 
  TrendingUp, 
  Upload, 
  MessageSquare,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  LogOut
} from 'lucide-react'
import AutonomysNavbar from '@/components/AutonomysNavbar'
import DashboardOCRInterface from '@/components/DashboardOCRInterface'
import DashboardChatInterface from '@/components/DashboardChatInterface'
import DashboardDataTables from '@/components/DashboardDataTables'

interface DemoUser {
  company: string
  email: string
  loginTime: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<DemoUser | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const demoUser = localStorage.getItem('demoUser')
    if (!demoUser) {
      router.push('/demo')
      return
    }
    setUser(JSON.parse(demoUser))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('demoUser')
    router.push('/demo')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Übersicht', icon: Activity },
    { id: 'ocr', label: 'OCR Verarbeitung', icon: FileText },
    { id: 'documents', label: 'Dokumente', icon: Upload },
    { id: 'chat', label: 'Chat Assistent', icon: MessageSquare },
  ]

  const kpiData = [
    {
      title: 'Schweizer Dokumente',
      value: '2,847',
      change: '+24%',
      trend: 'up',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'UVG/KVG Erkennung',
      value: '97.8%',
      change: '+1.2%',
      trend: 'up',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Verarbeitungszeit',
      value: '6.7s',
      change: '-0.3s',
      trend: 'up',
      icon: Clock,
      color: 'purple'
    },
    {
      title: 'Compliance Status',
      value: 'DSGVO',
      change: '100%',
      trend: 'up',
      icon: Shield,
      color: 'emerald'
    }
  ]

  const recentActivities = [
    { type: 'ocr', message: 'SUVA Unfallmeldung erfolgreich klassifiziert', time: '2 Min. ago', status: 'success' },
    { type: 'chat', message: 'Versicherungsberatung zu UVG-Fragen', time: '5 Min. ago', status: 'success' },
    { type: 'document', message: 'Allianz Kündigung in Supabase gespeichert', time: '8 Min. ago', status: 'success' },
    { type: 'error', message: 'Scanqualität unzureichend - Neuer Upload erforderlich', time: '15 Min. ago', status: 'error' },
    { type: 'system', message: 'Schweizer Compliance-Check erfolgreich', time: '1 Std. ago', status: 'success' }
  ]

  return (
    <div className="min-h-screen bg-black">
      <AutonomysNavbar />
      
      {/* Dashboard Header */}
      <section className="py-8 bg-gradient-to-b from-neutral-950 to-neutral-900 border-b border-neutral-800">
        <div className="container-professional">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                Alpha Informatik Dashboard
              </h1>
              <p className="text-neutral-300">
                Willkommen, <span className="text-blue-400">{user.company}</span> • {user.email}
              </p>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden
            </motion.button>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-6 bg-neutral-900 border-b border-neutral-800">
        <div className="container-professional">
          <div className="flex space-x-1 bg-neutral-800/50 p-1 rounded-lg w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-4 md:py-8 bg-gradient-to-b from-neutral-900 to-black min-h-screen">
        <div className="container-professional px-4 md:px-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 md:space-y-8"
            >
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {kpiData.map((kpi, index) => {
                  const Icon = kpi.icon
                  return (
                    <motion.div
                      key={kpi.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-4 md:p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Icon className={`h-8 w-8 text-${kpi.color}-400`} />
                        <span className={`text-xs px-2 py-1 rounded-full bg-${kpi.color}-500/10 text-${kpi.color}-400`}>
                          {kpi.change}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{kpi.value}</div>
                      <div className="text-sm text-neutral-400">{kpi.title}</div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Recent Activities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-neutral-800/30 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-6">Letzte Aktivitäten</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-neutral-700/50 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className={`h-2 w-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-400' :
                          activity.status === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                        }`} />
                        <span className="text-neutral-200">{activity.message}</span>
                      </div>
                      <span className="text-neutral-400 text-sm">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* OCR Tab Content */}
          {activeTab === 'ocr' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <DashboardOCRInterface />
            </motion.div>
          )}

          {/* Documents Tab Content */}
          {activeTab === 'documents' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <DashboardDataTables />
            </motion.div>
          )}

          {/* Chat Tab Content */}
          {activeTab === 'chat' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <DashboardChatInterface userInfo={user} />
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}