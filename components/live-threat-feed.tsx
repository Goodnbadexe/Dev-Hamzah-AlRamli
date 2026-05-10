'use client'

import { useEffect, useRef, useState } from 'react'
import { Radio } from 'lucide-react'

type Severity = 'Critical' | 'High' | 'Medium'
type ThreatType = 'Phishing' | 'Ransomware' | 'DDoS' | 'SQLi' | 'XSS' | 'APT'

interface ThreatEvent {
  id: number
  timestamp: Date
  type: ThreatType
  severity: Severity
  sourceCountry: string
  targetSector: string
}

const THREAT_TYPES: ThreatType[] = ['Phishing', 'Ransomware', 'DDoS', 'SQLi', 'XSS', 'APT']
const SEVERITIES: Severity[] = ['Critical', 'High', 'Medium']
const SEVERITY_WEIGHTS = [0.25, 0.45, 0.30] // Critical, High, Medium

const SOURCE_COUNTRIES = [
  'CN', 'RU', 'KP', 'IR', 'BR', 'NG', 'UA', 'RO', 'US', 'DE',
  'PK', 'IN', 'VN', 'TR', 'PH', 'ID', 'MX', 'ZA', 'EG', 'TH',
]

const TARGET_SECTORS = [
  'Finance', 'Healthcare', 'Government', 'Energy', 'Defense',
  'Education', 'Retail', 'Telecom', 'Transport', 'Media',
]

function weightedSeverity(): Severity {
  const r = Math.random()
  if (r < SEVERITY_WEIGHTS[0]) return 'Critical'
  if (r < SEVERITY_WEIGHTS[0] + SEVERITY_WEIGHTS[1]) return 'High'
  return 'Medium'
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateEvent(id: number): ThreatEvent {
  return {
    id,
    timestamp: new Date(),
    type: randomFrom(THREAT_TYPES),
    severity: weightedSeverity(),
    sourceCountry: randomFrom(SOURCE_COUNTRIES),
    targetSector: randomFrom(TARGET_SECTORS),
  }
}

function formatTime(date: Date): string {
  return date.toISOString().replace('T', ' ').slice(0, 19) + 'Z'
}

const SEVERITY_STYLES: Record<Severity, string> = {
  Critical: 'text-red-500',
  High: 'text-orange-400',
  Medium: 'text-yellow-400',
}

const SEVERITY_BADGE: Record<Severity, string> = {
  Critical: 'bg-red-500/10 text-red-500 border border-red-500/30',
  High: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
  Medium: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
}

const TYPE_COLOR: Record<ThreatType, string> = {
  Phishing: 'text-blue-400',
  Ransomware: 'text-red-400',
  DDoS: 'text-orange-400',
  SQLi: 'text-purple-400',
  XSS: 'text-pink-400',
  APT: 'text-red-500',
}

const MAX_EVENTS = 12
let nextId = 1

// Seed with some initial events
function seedEvents(): ThreatEvent[] {
  const now = Date.now()
  return Array.from({ length: 6 }, (_, i) => {
    const e = generateEvent(nextId++)
    e.timestamp = new Date(now - (6 - i) * 3000)
    return e
  })
}

export function LiveThreatFeed() {
  const [events, setEvents] = useState<ThreatEvent[]>(() => seedEvents())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setEvents(prev => {
        const newEvent = generateEvent(nextId++)
        const updated = [newEvent, ...prev]
        return updated.slice(0, MAX_EVENTS)
      })
    }, 3000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col h-full bg-black border border-zinc-800 rounded-lg overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-950 shrink-0">
        <span className="text-zinc-400 tracking-widest uppercase text-[10px]">Threat Feed</span>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-red-500 font-bold tracking-widest text-[10px]">LIVE</span>
          <Radio className="h-3 w-3 text-red-500" />
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[90px_70px_56px_28px_70px] gap-1 px-3 py-1.5 border-b border-zinc-800/50 bg-zinc-950/50 shrink-0">
        <span className="text-zinc-600 uppercase tracking-wider text-[9px]">Timestamp</span>
        <span className="text-zinc-600 uppercase tracking-wider text-[9px]">Type</span>
        <span className="text-zinc-600 uppercase tracking-wider text-[9px]">Severity</span>
        <span className="text-zinc-600 uppercase tracking-wider text-[9px]">Src</span>
        <span className="text-zinc-600 uppercase tracking-wider text-[9px]">Target</span>
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto">
        {events.map((event, idx) => (
          <div
            key={event.id}
            className={`grid grid-cols-[90px_70px_56px_28px_70px] gap-1 px-3 py-1.5 border-b border-zinc-900/50 transition-colors ${
              idx === 0 ? 'bg-zinc-900/60 animate-pulse-once' : 'hover:bg-zinc-900/30'
            }`}
          >
            <span className="text-zinc-600 text-[9px] leading-4 truncate">
              {formatTime(event.timestamp).slice(11)}
            </span>
            <span className={`${TYPE_COLOR[event.type]} font-semibold truncate leading-4`}>
              {event.type}
            </span>
            <span className={`${SEVERITY_STYLES[event.severity]} leading-4`}>
              {event.severity}
            </span>
            <span className="text-zinc-400 leading-4">{event.sourceCountry}</span>
            <span className="text-zinc-300 truncate leading-4">{event.targetSector}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-zinc-800 bg-zinc-950/80 shrink-0 flex items-center justify-between">
        <span className="text-zinc-600 text-[9px]">showing {events.length} / max {MAX_EVENTS}</span>
        <span className="text-zinc-600 text-[9px]">interval 3s</span>
      </div>
    </div>
  )
}
