'use client'

// === METADATA ===
// Purpose: Multi-agent status dashboard inspired by claude-council patterns
// Author: @Goodnbad.exe
// Inputs: none (all state managed in React)
// Outputs: AgentConsole UI with 4 agents, deploy controls, status indicators
// Assumptions: Tailwind + lucide-react available; no backend required
// === END METADATA ===

import { useState, useCallback } from 'react'
import { Terminal, Eye, BarChart2, Zap, CheckCircle2, Clock, Loader2, Play } from 'lucide-react'

type AgentStatus = 'ACTIVE' | 'IDLE' | 'PROCESSING'

interface Agent {
  id: string
  name: string
  role: string
  status: AgentStatus
  lastAction: string
  tasksCompleted: number
  color: string
  borderColor: string
  bgColor: string
  badgeActive: string
  badgeIdle: string
  badgeProcessing: string
  icon: React.ReactNode
}

const INITIAL_AGENTS: Agent[] = [
  {
    id: 'recon',
    name: 'RECON-AGENT',
    role: 'Passive & active reconnaissance',
    status: 'ACTIVE',
    lastAction: 'Enumerated subdomains for target.tld',
    tasksCompleted: 47,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    bgColor: 'bg-purple-500/5',
    badgeActive: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    badgeIdle: 'bg-zinc-700/50 text-zinc-400 border-zinc-600/30',
    badgeProcessing: 'bg-purple-600/30 text-purple-200 border-purple-400/40',
    icon: <Eye className="h-5 w-5" />,
  },
  {
    id: 'analyze',
    name: 'ANALYZE-AGENT',
    role: 'Threat analysis & correlation',
    status: 'PROCESSING',
    lastAction: 'Correlating IOCs against MITRE ATT&CK',
    tasksCompleted: 133,
    color: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    bgColor: 'bg-blue-500/5',
    badgeActive: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    badgeIdle: 'bg-zinc-700/50 text-zinc-400 border-zinc-600/30',
    badgeProcessing: 'bg-blue-600/30 text-blue-200 border-blue-400/40',
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    id: 'monitor',
    name: 'MONITOR-AGENT',
    role: 'Real-time SIEM monitoring',
    status: 'ACTIVE',
    lastAction: 'Watching 12 active event streams',
    tasksCompleted: 892,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/5',
    badgeActive: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    badgeIdle: 'bg-zinc-700/50 text-zinc-400 border-zinc-600/30',
    badgeProcessing: 'bg-emerald-600/30 text-emerald-200 border-emerald-400/40',
    icon: <Terminal className="h-5 w-5" />,
  },
  {
    id: 'respond',
    name: 'RESPOND-AGENT',
    role: 'Automated incident response',
    status: 'IDLE',
    lastAction: 'Executed playbook IR-042 successfully',
    tasksCompleted: 29,
    color: 'text-red-400',
    borderColor: 'border-red-500/40',
    bgColor: 'bg-red-500/5',
    badgeActive: 'bg-red-500/20 text-red-300 border-red-500/30',
    badgeIdle: 'bg-zinc-700/50 text-zinc-400 border-zinc-600/30',
    badgeProcessing: 'bg-red-600/30 text-red-200 border-red-400/40',
    icon: <Zap className="h-5 w-5" />,
  },
]

const STATUS_ICONS: Record<AgentStatus, React.ReactNode> = {
  ACTIVE: <CheckCircle2 className="h-3.5 w-3.5" />,
  IDLE: <Clock className="h-3.5 w-3.5" />,
  PROCESSING: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
}

export function AgentConsole() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS)

  const deployAgent = useCallback((agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, status: 'PROCESSING' as AgentStatus } : a))
    )

    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agentId
            ? {
                ...a,
                status: 'ACTIVE' as AgentStatus,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: `Deployed task at ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
              }
            : a
        )
      )
    }, 3000)
  }, [])

  const getBadgeClass = (agent: Agent): string => {
    if (agent.status === 'ACTIVE') return agent.badgeActive
    if (agent.status === 'PROCESSING') return agent.badgeProcessing
    return agent.badgeIdle
  }

  return (
    <div className="font-mono">
      {/* Console header bar */}
      <div className="flex items-center gap-3 border border-zinc-700 rounded-t bg-zinc-900 px-4 py-2 mb-0">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="text-zinc-500 text-xs ml-2 select-none">agent-council — council@goodnbad — 4 agents</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-500 text-xs">COUNCIL ONLINE</span>
        </div>
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-zinc-700 border-t-0 rounded-b p-4 bg-zinc-900/60">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`border rounded ${agent.borderColor} ${agent.bgColor} p-4 flex flex-col gap-3 transition-all duration-300`}
          >
            {/* Agent name + icon */}
            <div className="flex items-center gap-2">
              <span className={agent.color}>{agent.icon}</span>
              <span className={`text-sm font-bold tracking-wider ${agent.color}`}>{agent.name}</span>
            </div>

            {/* Role */}
            <p className="text-zinc-500 text-xs leading-snug">{agent.role}</p>

            {/* Status badge */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs border rounded px-2 py-0.5 font-semibold tracking-wider transition-colors ${getBadgeClass(agent)}`}
              >
                {STATUS_ICONS[agent.status]}
                {agent.status}
              </span>
            </div>

            {/* Last action */}
            <div className="bg-black/40 border border-zinc-800 rounded px-3 py-2">
              <div className="text-zinc-600 text-[10px] mb-1 uppercase tracking-widest">Last Action</div>
              <p className="text-zinc-300 text-xs leading-snug">{agent.lastAction}</p>
            </div>

            {/* Tasks counter + deploy button */}
            <div className="flex items-center justify-between mt-auto">
              <div>
                <span className="text-zinc-600 text-[10px] uppercase tracking-widest">Tasks</span>
                <div className={`text-lg font-bold tabular-nums ${agent.color}`}>{agent.tasksCompleted}</div>
              </div>

              <button
                onClick={() => deployAgent(agent.id)}
                disabled={agent.status === 'PROCESSING'}
                className={`flex items-center gap-1.5 text-xs border rounded px-3 py-1.5 transition-all duration-200 ${
                  agent.status === 'PROCESSING'
                    ? 'border-zinc-700 text-zinc-600 cursor-not-allowed'
                    : `${agent.borderColor} ${agent.color} hover:opacity-80 active:scale-95`
                }`}
              >
                {agent.status === 'PROCESSING' ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    RUNNING
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    DEPLOY
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
