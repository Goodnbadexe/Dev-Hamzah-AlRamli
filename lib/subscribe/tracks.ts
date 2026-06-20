// === METADATA ===
// Purpose: Canonical definition of the 4 vault tracks + the variant axes
//          (primary AI tool, operating system). This is the SINGLE SOURCE OF
//          TRUTH imported by the quiz (lib/subscribe/quiz.ts), the personalize
//          engine (lib/subscribe/personalize.ts), the pricing matrix
//          (lib/subscribe/config.ts) and the vault manifest (lib/vault/manifest.ts).
// Contract: the `tracks` quiz question's option `value`s MUST equal TrackId, and
//           the `ai_tool` / `os` question values MUST equal ToolId / OsId — so a
//           member's tick selection flows straight into pricing + content
//           resolution with no translation layer.
// === END METADATA ===

export type TrackId = "security" | "developers" | "agents" | "automation"
export type ToolId = "claude" | "codex" | "gemini" | "chatgpt" | "other"
export type OsId = "windows" | "linux" | "macos"

export type Track = {
  id: TrackId
  week: 1 | 2 | 3 | 4
  en: string
  ar: string
  /** one-line outcome teaser shown on the track-selection step */
  tagEn: string
  tagAr: string
}

export const TRACKS: Track[] = [
  {
    id: "security",
    week: 1,
    en: "Security",
    ar: "الأمن",
    tagEn: "Offensive + defensive playbooks you run with your AI",
    tagAr: "أدوات هجوم ودفاع تشغّلها مع الـ AI",
  },
  {
    id: "developers",
    week: 2,
    en: "Developers & Tools",
    ar: "المطوّرين والأدوات",
    tagEn: "Ship faster — repos, prompts, workflows most never find",
    tagAr: "أنجز أسرع — مستودعات وبرومبتات وأدوات ما يوصلها الكل",
  },
  {
    id: "agents",
    week: 3,
    en: "Agents",
    ar: "الوكلاء",
    tagEn: "Build agents that actually do the work for you",
    tagAr: "ابنِ وكلاء يسوّون الشغل عنك فعلاً",
  },
  {
    id: "automation",
    week: 4,
    en: "Automation",
    ar: "الأتمتة",
    tagEn: "Wire your stack so it runs without you",
    tagAr: "اربط أدواتك بحيث تشتغل من دونك",
  },
]

export const TRACK_IDS: TrackId[] = TRACKS.map((t) => t.id)
export const TOOL_IDS: ToolId[] = ["claude", "codex", "gemini", "chatgpt", "other"]
export const OS_IDS: OsId[] = ["windows", "linux", "macos"]

/** Default variant used when a specific {tool,os} build hasn't been generated. */
export const DEFAULT_TOOL: ToolId = "other"
export const DEFAULT_OS: OsId = "windows"

export function isTrackId(v: string): v is TrackId {
  return (TRACK_IDS as string[]).includes(v)
}
export function isToolId(v: string): v is ToolId {
  return (TOOL_IDS as string[]).includes(v)
}
export function isOsId(v: string): v is OsId {
  return (OS_IDS as string[]).includes(v)
}

export function trackById(id: TrackId): Track {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[0]
}

/** Tracks ordered by week (stable display + deterministic personalization output). */
export function orderTracksByWeek(ids: TrackId[]): TrackId[] {
  const order = new Map(TRACKS.map((t) => [t.id, t.week]))
  return [...new Set(ids)]
    .filter(isTrackId)
    .sort((a, b) => (order.get(a) ?? 9) - (order.get(b) ?? 9))
}
