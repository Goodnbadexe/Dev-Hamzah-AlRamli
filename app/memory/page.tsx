// === METADATA ===
// Purpose: Memory Plan page rendering structured timeline, goals, and CTF info
// Author: @Goodnbad.exe
// Inputs: memoryPlan from lib/memory/plan
// Outputs: UI for personal Memory Plan
// Assumptions: TailwindCSS present; app router enabled
// Tests: Manual check at /memory
// Security: No secrets; static content only
// Complexity: O(N) where N = items rendered
// === END METADATA ===
'use client'

import { memoryPlan } from '@/lib/memory/plan'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { GlitchText } from '@/components/glitch-text'
import { MatrixBackground } from '@/components/matrix-background'
import { MemoryVault } from '@/components/memory-vault'
import { AgentConsole } from '@/components/agent-console'

export default function MemoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white relative overflow-hidden">
      <MatrixBackground />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-500 border-none">Memory Plan</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <GlitchText text="MEMORY VAULT // AGENT COUNCIL" />
          </h1>
          <p className="text-zinc-400">{memoryPlan.summary}</p>
        </div>

        {/* Memory Vault */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Memory Vault</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
          <MemoryVault />
        </div>

        {/* Agent Council */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Agent Council</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
          <AgentConsole />
        </div>

        {/* Divider before existing plan content */}
        <div className="flex items-center gap-3 mb-10">
          <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Learning Plan</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {memoryPlan.timeline.map((t, i) => (
                  <div key={i}>
                    <div className="text-emerald-400 font-medium">{t.date}</div>
                    <div className="text-white font-semibold">{t.title}</div>
                    <ul className="mt-2 space-y-1 text-zinc-300">
                      {t.details.map((d, j) => (
                        <li key={j} className="flex items-start">
                          <span className="text-emerald-500 mr-2">›</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader>
              <CardTitle>Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {memoryPlan.goals.map((g, i) => (
                  <div key={i}>
                    <div className="text-white font-semibold">{g.area}</div>
                    <ul className="mt-2 space-y-1 text-zinc-300">
                      {g.targets.map((t, j) => (
                        <li key={j} className="flex items-start">
                          <span className="text-emerald-500 mr-2">›</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader>
              <CardTitle>CTF</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {memoryPlan.ctf.map((c, i) => (
                  <div key={i}>
                    <div className="text-white font-semibold">{c.event}</div>
                    {c.writeupUrl ? (
                      <a className="text-emerald-400" href={c.writeupUrl} target="_blank">Write-up</a>
                    ) : null}
                    <ul className="mt-2 space-y-1 text-zinc-300">
                      {c.highlights.map((h, j) => (
                        <li key={j} className="flex items-start">
                          <span className="text-emerald-500 mr-2">›</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}