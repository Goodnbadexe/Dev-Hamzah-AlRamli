'use client'

import { Shield, Globe, Search, Eye, Database, AlertTriangle } from 'lucide-react'

type Status = 'ACTIVE' | 'STANDBY' | 'SCANNING'

interface OsintTool {
  name: string
  description: string
  status: Status
  icon: React.ReactNode
}

const TOOLS: OsintTool[] = [
  {
    name: 'Network Recon',
    description: 'Port scanning, service enumeration, and topology mapping',
    status: 'ACTIVE',
    icon: <Globe className="h-5 w-5" />,
  },
  {
    name: 'Domain Intel',
    description: 'WHOIS, DNS records, subdomain enumeration, certificate logs',
    status: 'SCANNING',
    icon: <Search className="h-5 w-5" />,
  },
  {
    name: 'Social Footprint',
    description: 'Social media profiling, username enumeration, leak detection',
    status: 'STANDBY',
    icon: <Eye className="h-5 w-5" />,
  },
  {
    name: 'Dark Web Monitoring',
    description: 'Tor onion indexing, paste site monitoring, credential leaks',
    status: 'SCANNING',
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    name: 'Certificate Transparency',
    description: 'CT log monitoring for new certs issued against target domains',
    status: 'ACTIVE',
    icon: <Shield className="h-5 w-5" />,
  },
  {
    name: 'Threat Feeds',
    description: 'IOC ingestion from commercial and open-source threat feeds',
    status: 'ACTIVE',
    icon: <Database className="h-5 w-5" />,
  },
]

const STATUS_STYLES: Record<Status, { badge: string; dot: string; label: string }> = {
  ACTIVE: {
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
    label: 'ACTIVE',
  },
  STANDBY: {
    badge: 'bg-zinc-700/50 text-zinc-400 border-zinc-600/30',
    dot: 'bg-zinc-500',
    label: 'STANDBY',
  },
  SCANNING: {
    badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    dot: 'bg-yellow-400 animate-pulse',
    label: 'SCANNING',
  },
}

export function OSINTCapabilities() {
  return (
    <div className="font-mono">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((tool) => {
          const s = STATUS_STYLES[tool.status]
          return (
            <div
              key={tool.name}
              className="bg-zinc-900/60 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-emerald-400 group-hover:scale-110 transition-transform inline-block">
                  {tool.icon}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold border rounded px-2 py-0.5 tracking-widest ${s.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
              </div>
              <h3 className="text-sm font-bold text-zinc-100 mb-1 tracking-wide">{tool.name}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{tool.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
