// === METADATA ===
// Purpose: Internal status page showing recent updates and dry-run state
// Author: @Goodnbad.exe
// Inputs: public/updates.json
// Outputs: UI with latest events, env indicators
// Assumptions: Dev-only write; production may show empty if serverless
// Tests: Open /admin/automation-status after posting webhook
// Security: No secrets; only shows flags
// Complexity: O(N) render
// === END METADATA ===
'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type UpdateEvent = {
  ts: string
  source: string
  title: string
  message: string
  url?: string
}

export default function AutomationStatus() {
  const [events, setEvents] = useState<UpdateEvent[]>([])

  useEffect(() => {
    fetch('/updates.json')
      .then(r => r.ok ? r.json() : [])
      .then(setEvents)
      .catch(() => setEvents([]))
  }, [])

  const dryRun = process.env.NEXT_PUBLIC_SOCIAL_DRY_RUN === 'true'

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-6">
          <Badge className="bg-emerald-500/10 text-emerald-500 border-none">Automation</Badge>
          <span className="text-zinc-400">Status</span>
        </div>
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardHeader>
            <CardTitle>Latest Update Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-sm text-zinc-400">Dry-run mode: {dryRun ? 'enabled' : 'disabled'} (set NEXT_PUBLIC_SOCIAL_DRY_RUN and SOCIAL_DRY_RUN)</div>
            {events.length === 0 ? (
              <div className="text-zinc-400">No events yet.</div>
            ) : (
              <div className="space-y-4">
                {events.map((e, i) => (
                  <div key={i} className="border border-zinc-700 rounded p-3">
                    <div className="text-emerald-400 text-sm">{new Date(e.ts).toLocaleString()} — {e.source}</div>
                    <div className="text-white font-medium">{e.title}</div>
                    <div className="text-zinc-300 text-sm mt-1">{e.message}</div>
                    {e.url ? (
                      <a className="text-emerald-400 text-sm" href={e.url} target="_blank">Link</a>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}