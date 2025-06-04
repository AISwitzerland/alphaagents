'use client'

import { useState, useEffect } from 'react'
import { Activity, CheckCircle, AlertCircle, Clock, Bot, FileText, Mail, MessageSquare, Shield } from 'lucide-react'
import { apiCall } from '@/lib/utils'

interface AgentHealthStatus {
  name: string
  status: 'healthy' | 'warning' | 'error' | 'offline'
  lastHeartbeat: string
  uptime: number
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const AGENT_ICONS = {
  'Manager-Agent': Shield,
  'Document-Agent': FileText,
  'OCR-Agent': Bot,
  'E-Mail-Agent': Mail,
  'Chat-Agent': MessageSquare
}

export default function AgentStatus() {
  const [agents, setAgents] = useState<AgentHealthStatus[]>([])
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'warning' | 'error'>('healthy')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAgentStatus()
    const interval = setInterval(fetchAgentStatus, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchAgentStatus = async () => {
    try {
      const response = await apiCall<{
        agents: Array<{
          name: string
          status: string
          lastHeartbeat: string
          uptime: number
          description: string
        }>
        systemHealth: string
      }>('/api/health')

      const agentsWithIcons: AgentHealthStatus[] = response.agents.map(agent => ({
        ...agent,
        status: agent.status as 'healthy' | 'warning' | 'error' | 'offline',
        icon: AGENT_ICONS[agent.name as keyof typeof AGENT_ICONS] || Bot
      }))

      setAgents(agentsWithIcons)
      setSystemHealth(response.systemHealth as 'healthy' | 'warning' | 'error')
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch agent status:', error)
      // Show offline status if API is unreachable
      const offlineAgents: AgentHealthStatus[] = [
        { name: 'Manager-Agent', status: 'offline', lastHeartbeat: '', uptime: 0, description: 'System-Überwachung', icon: Shield },
        { name: 'Document-Agent', status: 'offline', lastHeartbeat: '', uptime: 0, description: 'Dokumenten-Verarbeitung', icon: FileText },
        { name: 'OCR-Agent', status: 'offline', lastHeartbeat: '', uptime: 0, description: 'Text-Erkennung', icon: Bot },
        { name: 'E-Mail-Agent', status: 'offline', lastHeartbeat: '', uptime: 0, description: 'E-Mail-Verarbeitung', icon: Mail },
        { name: 'Chat-Agent', status: 'offline', lastHeartbeat: '', uptime: 0, description: 'Chat-Interface', icon: MessageSquare }
      ]
      setAgents(offlineAgents)
      setSystemHealth('error')
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'offline': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />
      case 'warning': return <AlertCircle className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      case 'offline': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'Aktiv'
      case 'warning': return 'Warnung'
      case 'error': return 'Fehler'
      case 'offline': return 'Offline'
      default: return 'Unbekannt'
    }
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatLastHeartbeat = (timestamp: string) => {
    if (!timestamp) return 'Nie'
    const date = new Date(timestamp)
    return date.toLocaleTimeString('de-CH')
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          System Status
        </h2>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(systemHealth)}`}>
          <Activity className="w-4 h-4" />
          <span className="text-sm font-medium">
            {systemHealth === 'healthy' ? 'Gesund' : 
             systemHealth === 'warning' ? 'Warnung' : 
             'Fehler'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => {
          const IconComponent = agent.icon
          return (
            <div key={agent.name} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-500">{agent.description}</p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getStatusColor(agent.status)}`}>
                  {getStatusIcon(agent.status)}
                  <span className="text-xs font-medium">
                    {getStatusText(agent.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Letzter Check:</span>
                  <br />
                  {formatLastHeartbeat(agent.lastHeartbeat)}
                </div>
                <div>
                  <span className="font-medium">Betriebszeit:</span>
                  <br />
                  {agent.uptime > 0 ? formatUptime(agent.uptime) : 'Offline'}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Letzte Aktualisierung:</span>
          <span>{new Date().toLocaleTimeString('de-CH')}</span>
        </div>
      </div>
    </div>
  )
}