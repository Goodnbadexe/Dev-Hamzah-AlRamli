// === METADATA ===
// Purpose: Pure personalization engine. Turns the 8 quiz answers into a concrete
//          curation: which tracks the member gets, which tuned PDF variant
//          ({tool,os}) they receive, a deterministic "read factor" match score,
//          and the recommended bundle tier (which also sets the price).
// Purity: NO I/O, NO Math.random, NO Date.now — same answers always yield the same
//         output, so unit tests pin exact integers and the "X% matched" the user
//         sees is stable across renders.
// === END METADATA ===

import {
  type TrackId,
  type ToolId,
  type OsId,
  DEFAULT_TOOL,
  DEFAULT_OS,
  isToolId,
  isOsId,
  orderTracksByWeek,
  isTrackId,
} from "./tracks"

/** Multi/single/text answers are all normalized to string[] on the wire. */
export type Answers = Record<string, string[]>

export type BundleTier = "single" | "duo" | "all"
export type ReadLabel = "starter" | "tuned" | "elite"

export interface Personalization {
  selectedTracks: TrackId[]
  toolVariant: ToolId
  osVariant: OsId
  readFactor: number // 0–100 integer
  readLabel: ReadLabel
  recommendedBundle: BundleTier
}

// ── Read-factor weights (sum of maxima = 100) ──────────────────────────────────
// Re-based on the trimmed 8-question quiz: only role / goals / niche / tracks
// remain, so the score is built from niche↔track fit, how much the person told us
// (signal density), and how many vaults they committed to (engagement).
const READ_BASE = 40
const ALIGN_PER_MATCH = 7
const ALIGN_MAX = 20
const DENSITY_PER_TICK = 2
const DENSITY_MAX = 24
const ENGAGE_PER_TRACK = 4
const ENGAGE_MAX = 16

/** Niche vocabulary → track vocabulary (the only translation point in the system). */
const NICHE_TRACK: Record<string, TrackId> = {
  security: "security",
  dev: "developers",
  automation: "automation",
  content: "creative",
}

const READ_ELITE_MIN = 80
const READ_TUNED_MIN = 60

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}

function first(answers: Answers, key: string): string | undefined {
  const v = answers[key]
  return Array.isArray(v) && v.length ? v[0] : undefined
}

function list(answers: Answers, key: string): string[] {
  const v = answers[key]
  return Array.isArray(v) ? v : []
}

export function tierForCount(n: number): BundleTier {
  if (n <= 1) return "single"
  if (n === 2) return "duo"
  return "all"
}

export function readLabelFor(score: number): ReadLabel {
  if (score >= READ_ELITE_MIN) return "elite"
  if (score >= READ_TUNED_MIN) return "tuned"
  return "starter"
}

/** Deterministic 0–100 match score from niche↔track fit, signal density, engagement. */
export function computeReadFactor(answers: Answers, selectedTracks: TrackId[]): number {
  let score = READ_BASE

  // niche ↔ selected-track alignment (max 20)
  const trackSet = new Set(selectedTracks)
  let matches = 0
  for (const niche of list(answers, "niche")) {
    const mapped = NICHE_TRACK[niche]
    if (mapped && trackSet.has(mapped)) matches++
  }
  score += Math.min(matches * ALIGN_PER_MATCH, ALIGN_MAX)

  // signal density — the more they tell us (role + goals + niche), the better we match (max 24)
  const density =
    list(answers, "role").length + list(answers, "goals").length + list(answers, "niche").length
  score += Math.min(density * DENSITY_PER_TICK, DENSITY_MAX)

  // engagement — committing to more vaults reads as higher intent (max 16)
  score += Math.min(selectedTracks.length * ENGAGE_PER_TRACK, ENGAGE_MAX)

  return clamp(Math.round(score), 0, 100)
}

export function personalize(answers: Answers): Personalization {
  const selectedTracks = orderTracksByWeek(list(answers, "tracks").filter(isTrackId))

  const toolRaw = first(answers, "ai_tool")
  const toolVariant: ToolId = toolRaw && isToolId(toolRaw) ? toolRaw : DEFAULT_TOOL

  const osRaw = first(answers, "os")
  const osVariant: OsId = osRaw && isOsId(osRaw) ? osRaw : DEFAULT_OS

  const readFactor = computeReadFactor(answers, selectedTracks)

  return {
    selectedTracks,
    toolVariant,
    osVariant,
    readFactor,
    readLabel: readLabelFor(readFactor),
    recommendedBundle: tierForCount(selectedTracks.length),
  }
}
