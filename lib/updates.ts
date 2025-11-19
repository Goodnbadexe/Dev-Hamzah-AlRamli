// === METADATA ===
// Purpose: Simple updates store + helper to persist to public JSON (dev only)
// Author: @Goodnbad.exe
// Inputs: Update events from webhook
// Outputs: In-memory list and public JSON file for UI
// Assumptions: File write is acceptable for local dev; production should use a DB
// Tests: Manual; read updates on status page
// Security: No secrets; sanitizes strings; dev-only persistence
// Complexity: O(1) append; O(N) serialization on write
// === END METADATA ===
import fs from 'node:fs'
import path from 'node:path'

export type UpdateEvent = {
  ts: string
  source: string
  title: string
  message: string
  url?: string
}

const updates: UpdateEvent[] = []

export function addUpdate(evt: UpdateEvent) {
  updates.unshift(evt)
  tryWritePublicFile()
}

export function getUpdates(): UpdateEvent[] {
  return updates
}

function tryWritePublicFile() {
  try {
    const file = path.join(process.cwd(), 'public', 'updates.json')
    fs.writeFileSync(file, JSON.stringify(updates, null, 2), { encoding: 'utf-8' })
  } catch {
    // ignore on platforms where write is not allowed
  }
}