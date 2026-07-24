// === METADATA ===
// Purpose: Canonical definition of the 6 vault tracks + the variant axes
//          (primary AI tool, operating system). This is the SINGLE SOURCE OF
//          TRUTH imported by the quiz (lib/subscribe/quiz.ts), the personalize
//          engine (lib/subscribe/personalize.ts), the pricing matrix
//          (lib/subscribe/config.ts) and the vault manifest (lib/vault/manifest.ts).
// Model:   Each track is a PARALLEL topic (Security, Developers, …), NOT "week N
//          of a 6-week series". A track owns its OWN 4-week curriculum (`weeks`)
//          where the weeks run in a dependency chain (week 1 → 2 → 3 → 4), sized
//          by how long the material takes to learn. `order` is only a stable
//          cross-track display order — it is never shown to members as "Week N".
// Contract: the `tracks` quiz question's option `value`s MUST equal TrackId, and
//           the `ai_tool` / `os` question values MUST equal ToolId / OsId — so a
//           member's tick selection flows straight into pricing + content
//           resolution with no translation layer.
// === END METADATA ===

export type TrackId = "security" | "developers" | "agents" | "automation" | "quant" | "creative"
export type ToolId = "claude" | "codex" | "gemini" | "chatgpt" | "other"
export type OsId = "windows" | "linux" | "macos"

/**
 * One week inside a track's curriculum. Weeks are taken in order; `dependsOn`
 * lists the week numbers that must be completed first (the learning-dependency
 * chain). For a linear path that is simply `[n - 1]`, and `[]` for week 1.
 */
export type WeekModule = {
  n: 1 | 2 | 3 | 4
  en: string
  ar: string
  /** rough learning effort for the week — expresses "how long it takes to learn" */
  effort: string
  /** prerequisite week numbers: [] to start, [n-1] for the linear chain */
  dependsOn: number[]
}

export type Track = {
  id: TrackId
  /** stable cross-track DISPLAY order (1–6). NOT shown to users as "Week N". */
  order: 1 | 2 | 3 | 4 | 5 | 6
  en: string
  ar: string
  /** one-line outcome teaser shown on the track-selection step */
  tagEn: string
  tagAr: string
  /** the track's OWN 4-week curriculum (linear dependency chain) */
  weeks: WeekModule[]
}

/** Build a linear 4-week chain: week 1 starts, each later week depends on the prior. */
function linearWeeks(
  steps: [en: string, ar: string, effort: string][],
): WeekModule[] {
  return steps.map(([en, ar, effort], i) => ({
    n: (i + 1) as WeekModule["n"],
    en,
    ar,
    effort,
    dependsOn: i === 0 ? [] : [i],
  }))
}

export const TRACKS: Track[] = [
  {
    id: "security",
    order: 1,
    en: "Security",
    ar: "الأمن",
    tagEn: "Offensive + defensive playbooks you run with your AI",
    tagAr: "أدوات هجوم ودفاع تشغّلها مع الـ AI",
    weeks: linearWeeks([
      ["Recon & toolkit setup", "الاستطلاع وإعداد العدّة", "~4–5 hrs"],
      ["Offensive playbooks", "أدلة الهجوم", "~5–6 hrs"],
      ["Defensive playbooks", "أدلة الدفاع", "~5–6 hrs"],
      ["Automate & report", "الأتمتة والتقارير", "~3–4 hrs"],
    ]),
  },
  {
    id: "developers",
    order: 2,
    en: "Developers & Tools",
    ar: "المطوّرين والأدوات",
    tagEn: "Ship faster — repos, prompts, workflows most never find",
    tagAr: "أنجز أسرع — مستودعات وبرومبتات وأدوات ما يوصلها الكل",
    weeks: linearWeeks([
      ["Repos & dev environment", "المستودعات وبيئة العمل", "~3–4 hrs"],
      ["Prompt-driven coding", "البرمجة بالبرومبت", "~5–6 hrs"],
      ["Review & refactor", "المراجعة وإعادة الهيكلة", "~4–5 hrs"],
      ["Ship & automate", "الإطلاق والأتمتة", "~4 hrs"],
    ]),
  },
  {
    id: "agents",
    order: 3,
    en: "Agents",
    ar: "الوكلاء",
    tagEn: "Build agents that actually do the work for you",
    tagAr: "ابنِ وكلاء يسوّون الشغل عنك فعلاً",
    weeks: linearWeeks([
      ["Agent foundations", "أساسيات الوكلاء", "~4–5 hrs"],
      ["Your first working agent", "أول وكيل شغّال لك", "~5–6 hrs"],
      ["Multi-agent orchestration", "تنسيق عدّة وكلاء", "~6 hrs"],
      ["Deploy & observe", "النشر والمراقبة", "~4 hrs"],
    ]),
  },
  {
    id: "automation",
    order: 4,
    en: "Automation",
    ar: "الأتمتة",
    tagEn: "Wire your stack so it runs without you",
    tagAr: "اربط أدواتك بحيث تشتغل من دونك",
    weeks: linearWeeks([
      ["Map your workflows", "ارسم تدفّقاتك", "~3 hrs"],
      ["Wire the triggers", "اربط المشغّلات", "~4–5 hrs"],
      ["Pipelines & schedules", "خطوط التشغيل والجدولة", "~5 hrs"],
      ["Monitor & self-heal", "المراقبة والإصلاح الذاتي", "~4 hrs"],
    ]),
  },
  {
    id: "quant",
    order: 5,
    en: "Quant & Trading",
    ar: "التداول الكمّي",
    tagEn: "The open-source engines real quant funds run — backtest first",
    tagAr: "محركات مفتوحة المصدر تستخدمها صناديق الكوانت — تعلّم وجرّب أولاً",
    weeks: linearWeeks([
      ["Data & environment", "البيانات والبيئة", "~4–5 hrs"],
      ["Strategy & signals", "الاستراتيجية والإشارات", "~6 hrs"],
      ["Backtest & validate", "الاختبار التاريخي والتحقق", "~6 hrs"],
      ["Risk & paper-trade", "المخاطر والتداول الورقي", "~5 hrs"],
    ]),
  },
  {
    id: "creative",
    order: 6,
    en: "Build in the Browser",
    ar: "ابنِ في المتصفح",
    tagEn: "3D worlds, models & scenes — built and shared from the browser",
    tagAr: "عوالم ونماذج ومشاهد ثلاثية الأبعاد — تبنيها وتشاركها من المتصفح",
    weeks: linearWeeks([
      ["Browser-3D foundations", "أساسيات 3D في المتصفح", "~3–4 hrs"],
      ["Models & assets", "النماذج والأصول", "~5 hrs"],
      ["Interaction & motion", "التفاعل والحركة", "~5 hrs"],
      ["Publish & share", "النشر والمشاركة", "~3 hrs"],
    ]),
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

/** Tracks in stable cross-track display order (deterministic personalization output). */
export function orderTracksByDisplay(ids: TrackId[]): TrackId[] {
  const order = new Map(TRACKS.map((t) => [t.id, t.order]))
  return [...new Set(ids)]
    .filter(isTrackId)
    .sort((a, b) => (order.get(a) ?? 9) - (order.get(b) ?? 9))
}
