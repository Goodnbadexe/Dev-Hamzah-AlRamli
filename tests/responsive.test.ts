// === METADATA ===
// Purpose: Unit tests for getParticleConfig responsive behavior
// Author: @Goodnbad.exe
// Inputs: Width and height values
// Outputs: Assertions verifying fontSize and particleCount scaling
// Assumptions: Node environment with vitest configured
// Tests: `npm run test`
// Security: Pure function tests; no side effects
// Complexity: O(1)
// === END METADATA ===

import { describe, it, expect } from 'vitest'
import { getParticleConfig } from '@/lib/responsive'

describe('getParticleConfig', () => {
  it('uses mobile settings for small widths', () => {
    const cfg = getParticleConfig(375, 667)
    expect(cfg.particleCount).toBeLessThan(3000)
    expect(cfg.fontSize).toBeGreaterThan(50)
  })

  it('uses tablet settings for medium widths', () => {
    const cfg = getParticleConfig(800, 1024)
    expect(cfg.particleCount).toBe(1500)
  })

  it('caps font size at max value', () => {
    const cfg = getParticleConfig(4000, 3000)
    expect(cfg.fontSize).toBeLessThanOrEqual(220)
  })
})