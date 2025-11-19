// === METADATA ===
// Purpose: Endpoint to accept LinkedIn update payloads and refresh resume data
// Author: @Goodnbad.exe
// Inputs: JSON { role, company, location, description[] }
// Outputs: JSON { ok }
// Assumptions: For now, updates are appended to Memory Plan timeline
// Tests: curl POST; verify /memory shows new item
// Security: No secrets; future auth required for production
// Complexity: O(1) append
// === END METADATA ===
import { NextResponse } from 'next/server'
import { memoryPlan } from '@/lib/memory/plan'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body.role !== 'string') {
    return NextResponse.json({ ok: false, error: 'invalid payload' }, { status: 400 })
  }

  const item = {
    date: body.date || new Date().toLocaleDateString(),
    title: `${body.role} — ${body.company || ''} ${body.location ? `(${body.location})` : ''}`.trim(),
    details: Array.isArray(body.description) ? body.description.slice(0, 10) : [],
  }

  memoryPlan.timeline.unshift(item)
  return NextResponse.json({ ok: true })
}