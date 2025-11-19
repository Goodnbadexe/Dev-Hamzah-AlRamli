// === METADATA ===
// Purpose: Verify broadcaster returns dry-run results when SOCIAL_DRY_RUN=true
// Author: @Goodnbad.exe
// Inputs: Env flag; broadcaster function
// Outputs: Vitest assertions
// Assumptions: Vitest configured; Node ESM
// Tests: `npm run test`
// Security: No secrets used
// === END METADATA ===
import { describe, it, expect } from 'vitest'
import { broadcastAll } from '@/lib/social/broadcaster'

describe('broadcaster dry-run', () => {
  it('returns dry-run for all platforms when enabled', async () => {
    process.env.SOCIAL_DRY_RUN = 'true'
    const res = await broadcastAll({ title: 't', message: 'm' })
    expect(res.length).toBeGreaterThan(0)
    expect(res.every(r => r.detail === 'dry-run')).toBe(true)
  })
})