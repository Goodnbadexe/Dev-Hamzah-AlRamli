'use client'

// === METADATA ===
// Purpose: Terminal-style memory management UI for AI agent memory categories
// Author: @Goodnbad.exe
// Inputs: none (all state managed in React)
// Outputs: MemoryVault UI with search, categories, and store form
// Assumptions: sonner toast present; Tailwind + lucide-react available
// === END METADATA ===

import { useState } from 'react'
import { toast } from 'sonner'
import { Search, Plus, X, Database, Shield, Brain, Layers } from 'lucide-react'

interface MemoryEntry {
  id: string
  label: string
  timestamp: string
  tags: string[]
}

interface MemoryCategory {
  key: 'THREAT_MEMORY' | 'SKILL_MEMORY' | 'CONTEXT_MEMORY'
  label: string
  color: string
  borderColor: string
  bgColor: string
  badgeColor: string
  icon: React.ReactNode
  entries: MemoryEntry[]
}

const INITIAL_CATEGORIES: MemoryCategory[] = [
  {
    key: 'THREAT_MEMORY',
    label: 'THREAT_MEMORY',
    color: 'text-red-400',
    borderColor: 'border-red-500/40',
    bgColor: 'bg-red-500/5',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: <Shield className="h-4 w-4" />,
    entries: [
      { id: 't1', label: 'APT28 TTPs stored', timestamp: '2025-01-15', tags: ['apt', 'nation-state'] },
      { id: 't2', label: 'Cobalt Strike C2 IOCs indexed', timestamp: '2025-02-08', tags: ['c2', 'malware'] },
      { id: 't3', label: 'LockBit 3.0 ransomware profile', timestamp: '2025-03-22', tags: ['ransomware', 'encryption'] },
      { id: 't4', label: 'CVE-2024-3400 exploit chain', timestamp: '2025-04-01', tags: ['cve', 'rce'] },
    ],
  },
  {
    key: 'SKILL_MEMORY',
    label: 'SKILL_MEMORY',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/5',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: <Brain className="h-4 w-4" />,
    entries: [
      { id: 's1', label: 'Kali Linux toolkit: updated', timestamp: '2025-04-20', tags: ['tools', 'kali'] },
      { id: 's2', label: 'Burp Suite Pro workflow', timestamp: '2025-03-11', tags: ['web', 'pentest'] },
      { id: 's3', label: 'Ghidra reverse-eng patterns', timestamp: '2025-02-28', tags: ['re', 'analysis'] },
      { id: 's4', label: 'SIEM query library: Sentinel', timestamp: '2025-04-15', tags: ['siem', 'azure'] },
    ],
  },
  {
    key: 'CONTEXT_MEMORY',
    label: 'CONTEXT_MEMORY',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    bgColor: 'bg-blue-500/5',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: <Layers className="h-4 w-4" />,
    entries: [
      { id: 'c1', label: 'HackTheBox Pro Labs: active', timestamp: '2025-04-30', tags: ['ctf', 'labs'] },
      { id: 'c2', label: 'Incident response runbook v3', timestamp: '2025-03-05', tags: ['ir', 'playbook'] },
      { id: 'c3', label: 'Network topology: KayanHR env', timestamp: '2025-01-20', tags: ['network', 'enterprise'] },
    ],
  },
]

type MemoryTypeKey = 'THREAT_MEMORY' | 'SKILL_MEMORY' | 'CONTEXT_MEMORY'

export function MemoryVault() {
  const [categories, setCategories] = useState<MemoryCategory[]>(INITIAL_CATEGORIES)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState<MemoryTypeKey>('THREAT_MEMORY')
  const [formContent, setFormContent] = useState('')

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    entries: cat.entries.filter(
      (e) =>
        query.trim() === '' ||
        e.label.toLowerCase().includes(query.toLowerCase()) ||
        e.tags.some((t) => t.includes(query.toLowerCase()))
    ),
  }))

  const handleSave = () => {
    if (!formContent.trim()) {
      toast.error('Memory content cannot be empty.')
      return
    }

    const newEntry: MemoryEntry = {
      id: `m-${Date.now()}`,
      label: formContent.trim(),
      timestamp: new Date().toISOString().slice(0, 10),
      tags: ['user-defined'],
    }

    setCategories((prev) =>
      prev.map((cat) =>
        cat.key === formType ? { ...cat, entries: [newEntry, ...cat.entries] } : cat
      )
    )

    toast.success(`Memory stored in ${formType}`, {
      description: newEntry.label,
      duration: 3000,
    })

    setFormContent('')
    setShowForm(false)
  }

  return (
    <div className="font-mono">
      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-6 border border-zinc-700 rounded-t bg-zinc-900 px-4 py-2">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="text-zinc-500 text-xs ml-2 select-none">memory-vault — bash — 80x24</span>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm select-none">$</span>
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search memory entries..."
          className="w-full bg-zinc-900 border border-zinc-700 rounded px-14 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat.key}
            className={`border rounded ${cat.borderColor} ${cat.bgColor} p-4`}
          >
            {/* Category header */}
            <div className="flex items-center gap-2 mb-4">
              <span className={cat.color}>{cat.icon}</span>
              <span className={`text-xs font-bold tracking-widest ${cat.color}`}>{cat.label}</span>
              <span className={`ml-auto text-xs border rounded px-1.5 py-0.5 ${cat.badgeColor}`}>
                {cat.entries.length}
              </span>
            </div>

            {/* Entries */}
            <div className="space-y-2">
              {cat.entries.length === 0 ? (
                <p className="text-zinc-600 text-xs py-2">no entries match query</p>
              ) : (
                cat.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-black/40 rounded border border-zinc-800 px-3 py-2 hover:border-zinc-600 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Database className="h-3 w-3 mt-0.5 text-zinc-600 shrink-0 group-hover:text-zinc-400 transition-colors" />
                      <p className="text-xs text-zinc-300 flex-1 leading-snug">{entry.label}</p>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex gap-1 flex-wrap">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-zinc-500 border border-zinc-800 rounded px-1"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-zinc-600 shrink-0">{entry.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Store new memory */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 rounded px-4 py-2.5 text-sm transition-colors w-full justify-center"
        >
          <Plus className="h-4 w-4" />
          STORE NEW MEMORY
        </button>
      ) : (
        <div className="border border-emerald-500/30 rounded bg-zinc-900/80 p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-emerald-400 text-xs font-bold tracking-widest">NEW MEMORY ENTRY</span>
            <button
              onClick={() => { setShowForm(false); setFormContent('') }}
              className="text-zinc-500 hover:text-zinc-300"
              aria-label="Close form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-zinc-500 text-xs block mb-1">MEMORY_TYPE</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as MemoryTypeKey)}
                className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/60 transition-colors"
              >
                <option value="THREAT_MEMORY">THREAT_MEMORY</option>
                <option value="SKILL_MEMORY">SKILL_MEMORY</option>
                <option value="CONTEXT_MEMORY">CONTEXT_MEMORY</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-500 text-xs block mb-1">CONTENT</label>
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="describe the memory to store..."
                rows={3}
                className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 rounded px-4 py-2 text-sm transition-colors"
              >
                SAVE
              </button>
              <button
                onClick={() => { setShowForm(false); setFormContent('') }}
                className="flex-1 border border-zinc-700 text-zinc-400 hover:border-zinc-500 rounded px-4 py-2 text-sm transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
