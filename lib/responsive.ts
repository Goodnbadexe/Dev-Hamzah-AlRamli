// === METADATA ===
// Purpose: Shared responsive configuration for particle animation sizing and behavior.
// Author: @Goodnbad.exe
// Inputs: width (number), height (number)
// Outputs: ParticleConfig object containing sizing, counts, and text options
// Assumptions: Called in browser with a mounted canvas; no DOM access required.
// Tests: `npm run test` (vitest) for responsive config behavior
// Security: No external I/O; pure computation; safe defaults for mobile/desktop
// Complexity: O(1) per call
// === END METADATA ===

export interface ParticleConfig {
  particleCount: number
  textArray: string[]
  mouseRadius: number
  particleSize: number
  forceMultiplier: number
  returnSpeed: number
  velocityDamping: number
  colorMultiplier: number
  saturationMultiplier: number
  textChangeInterval: number
  rotationForceMultiplier: number
  fontSize: number
  fontSpacing: number
}

export function getParticleConfig(width: number, height: number): ParticleConfig {
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024

  // Slightly larger text for better legibility and area coverage
  const fontSize = Math.min(width * 0.18, height * 0.28, 220)

  return {
    particleCount: isMobile ? 800 : isTablet ? 1500 : 2500,
    textArray: ["Stay curious.", "Break limits.", "Build meaning."],
    mouseRadius: isMobile ? 0.15 : 0.1,
    particleSize: isMobile ? 1.5 : 2,
    forceMultiplier: 0.001,
    returnSpeed: 0.005,
    velocityDamping: 0.95,
    colorMultiplier: 40000,
    saturationMultiplier: 1000,
    textChangeInterval: 10000,
    rotationForceMultiplier: 0.5,
    fontSize,
    fontSpacing: isMobile ? 2 : 3,
  }
}