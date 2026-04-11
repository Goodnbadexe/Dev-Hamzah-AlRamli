// === METADATA ===
// Purpose: Endpoint to accept LinkedIn update payloads and refresh resume data
// Author: @Goodnbad.exe
// Inputs: JSON { role, company, location, description[] }
// Outputs: JSON { ok }
// Assumptions: For now, updates are appended to Memory Plan timeline
// Tests: curl POST with Authorization: Bearer <WEBHOOK_SECRET>
// Security: Requires WEBHOOK_SECRET env var; rejects unauthenticated calls
// Complexity: O(1) append
// === END METADATA ===
import { NextResponse } from 'next/server'
import { memoryPlan } from '@/lib/memory/plan'

function isAuthorized(request: Request): boolean {
  const secret = process.env.WEBHOOK_SECRET
  if (!secret) return false
  const authHeader = request.headers.get('authorization') ?? ''
  return authHeader === `Bearer ${secret}`
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

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
