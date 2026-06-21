// === METADATA ===
// Purpose: Turn the quiz answers into ONE tailored segment + tool set, so the
//          paywall stops being one-size-fits-all. `niche` is the primary signal;
//          `role`, `goal`, `level`, `apply` nudge the score. Pure + deterministic
//          — no side effects, no I/O — so it's trivially testable and safe to run
//          on every render.
//
// Hard rule: tool sets NEVER cross domains. A developer is shown dev/AI tooling,
//            a security person is shown security tooling — full stop. The scoring
//            is biased so that whoever's niche says "security" lands on the
//            security set even if a supporting answer leans elsewhere.
//
// Platforms: every tool carries a `platforms` tag. We prefer genuinely
//            cross-platform tools (Windows + Linux + macOS). A few legitimately
//            mac-only tools (e.g. cmux) are tagged macOS-only so the UI can show
//            an honest platform badge instead of implying universal support.
// === END METADATA ===

export type Bilingual = { ar: string; en: string }

export type Platform = "Windows" | "Linux" | "macOS"

export type SegmentTool = {
  name: string
  blurb: Bilingual
  platforms: Platform[]
}

export type SegmentId =
  | "developer"
  | "security"
  | "ai-builder"
  | "founder-automation"
  | "creator"

export type SegmentDef = {
  id: SegmentId
  label: Bilingual
  /** one-line "your vault is tuned for…" tagline */
  tagline: Bilingual
  tools: SegmentTool[]
}

export type SegmentResult = SegmentDef & {
  /** confidence-ish score that won the match (debug / analytics only) */
  score: number
}

const ALL: Platform[] = ["Windows", "Linux", "macOS"]

// ── Tool sets ────────────────────────────────────────────────────────────────
// Each set is self-contained to its domain. Cross-platform first; mac-only flagged.

const DEVELOPER_TOOLS: SegmentTool[] = [
  {
    name: "Cursor",
    blurb: { ar: "محرّر أكواد مبني على الـ AI لإنجاز أسرع", en: "AI-native code editor for shipping faster" },
    platforms: [...ALL],
  },
  {
    name: "Claude Code",
    blurb: { ar: "وكيل برمجي بالـ terminal يكتب ويصلح كودك", en: "Terminal coding agent that writes and fixes your code" },
    platforms: [...ALL],
  },
  {
    name: "Aider",
    blurb: { ar: "زوج برمجة بالـ AI داخل git مباشرة", en: "AI pair-programmer wired straight into git" },
    platforms: [...ALL],
  },
  {
    name: "Zed",
    blurb: { ar: "محرّر فائق السرعة بتعاون AI مدمج", en: "Blazing-fast editor with built-in AI collab" },
    platforms: ["Linux", "macOS"],
  },
  {
    name: "cmux",
    blurb: { ar: "مدير جلسات terminal موجّه للوكلاء (macOS فقط)", en: "Agent-oriented terminal multiplexer (macOS only)" },
    platforms: ["macOS"],
  },
  {
    name: "Repomix",
    blurb: { ar: "يحزم الريبو كامل في prompt واحد للـ AI", en: "Packs a whole repo into one AI-ready prompt" },
    platforms: [...ALL],
  },
]

const SECURITY_TOOLS: SegmentTool[] = [
  {
    name: "Nuclei",
    blurb: { ar: "ماسح ثغرات سريع بقوالب مجتمعية", en: "Fast template-driven vulnerability scanner" },
    platforms: [...ALL],
  },
  {
    name: "Caido",
    blurb: { ar: "بروكسي اعتراض حديث لاختبار الويب", en: "Modern intercept proxy for web app testing" },
    platforms: [...ALL],
  },
  {
    name: "PentestGPT",
    blurb: { ar: "مساعد AI يوجّه اختبار الاختراق خطوة بخطوة", en: "AI assistant that guides pentests step by step" },
    platforms: [...ALL],
  },
  {
    name: "Subfinder",
    blurb: { ar: "اكتشاف النطاقات الفرعية للاستطلاع", en: "Subdomain discovery for recon" },
    platforms: [...ALL],
  },
  {
    name: "Trivy",
    blurb: { ar: "فحص ثغرات الحاويات والكود والإعدادات", en: "Scans containers, code & configs for vulns" },
    platforms: [...ALL],
  },
]

const AI_BUILDER_TOOLS: SegmentTool[] = [
  {
    name: "LangGraph",
    blurb: { ar: "بناء وكلاء AI بحالة وتفرّعات معقّدة", en: "Build stateful, branching AI agents" },
    platforms: [...ALL],
  },
  {
    name: "Ollama",
    blurb: { ar: "تشغيل نماذج LLM محلياً على جهازك", en: "Run open LLMs locally on your machine" },
    platforms: [...ALL],
  },
  {
    name: "LiteLLM",
    blurb: { ar: "بوابة موحّدة لكل مزوّدي النماذج", en: "One gateway across every model provider" },
    platforms: [...ALL],
  },
  {
    name: "LlamaIndex",
    blurb: { ar: "ربط بياناتك بالنماذج عبر RAG", en: "Wire your data into models with RAG" },
    platforms: [...ALL],
  },
  {
    name: "Langfuse",
    blurb: { ar: "تتبّع وتقييم استدعاءات الـ LLM", en: "Trace and evaluate your LLM calls" },
    platforms: [...ALL],
  },
]

const FOUNDER_AUTOMATION_TOOLS: SegmentTool[] = [
  {
    name: "n8n",
    blurb: { ar: "أتمتة سير العمل مفتوحة المصدر تستضيفها بنفسك", en: "Self-hostable open-source workflow automation" },
    platforms: [...ALL],
  },
  {
    name: "Activepieces",
    blurb: { ar: "أتمتة بالـ AI بديلة لـ Zapier", en: "AI-first, open Zapier alternative" },
    platforms: [...ALL],
  },
  {
    name: "Windmill",
    blurb: { ar: "تحويل السكربتات إلى سير عمل وداخليات", en: "Turn scripts into workflows & internal tools" },
    platforms: [...ALL],
  },
  {
    name: "Browser Use",
    blurb: { ar: "وكلاء يتصفّحون وينفّذون المهام نيابةً عنك", en: "Agents that browse and do tasks for you" },
    platforms: [...ALL],
  },
  {
    name: "Trigger.dev",
    blurb: { ar: "مهام خلفية طويلة موثوقة لمنتجك", en: "Reliable long-running background jobs" },
    platforms: [...ALL],
  },
]

const CREATOR_TOOLS: SegmentTool[] = [
  {
    name: "ComfyUI",
    blurb: { ar: "خطوط إنتاج صور AI بالعقد والتحكّم الكامل", en: "Node-based AI image pipelines, full control" },
    platforms: [...ALL],
  },
  {
    name: "Whisper",
    blurb: { ar: "تفريغ صوتي دقيق محلي للمحتوى", en: "Accurate local transcription for content" },
    platforms: [...ALL],
  },
  {
    name: "Descript",
    blurb: { ar: "تحرير فيديو وبودكاست بالنص", en: "Edit video & podcasts by editing text" },
    platforms: ["Windows", "macOS"],
  },
  {
    name: "CapCut",
    blurb: { ar: "تحرير مقاطع قصيرة سريع بميزات AI", en: "Fast short-form editing with AI features" },
    platforms: ["Windows", "macOS"],
  },
  {
    name: "Kling / Runway",
    blurb: { ar: "توليد فيديو بالـ AI للريلز والإعلانات", en: "AI video generation for reels & ads" },
    platforms: [...ALL],
  },
]

// ── Segment definitions ──────────────────────────────────────────────────────

export const SEGMENTS: Record<SegmentId, SegmentDef> = {
  developer: {
    id: "developer",
    label: { ar: "المطوّرين", en: "Developers" },
    tagline: {
      ar: "أدوات وأكواد ووكلاء برمجة تنقلك من فكرة إلى شحن أسرع.",
      en: "Coding tools, repos & agents that take you from idea to shipped, faster.",
    },
    tools: DEVELOPER_TOOLS,
  },
  security: {
    id: "security",
    label: { ar: "الأمن السيبراني", en: "Security & Hacking" },
    tagline: {
      ar: "ترسانة استطلاع وفحص واختبار اختراق مبنية حول الـ AI.",
      en: "A recon, scanning & pentest arsenal built around AI.",
    },
    tools: SECURITY_TOOLS,
  },
  "ai-builder": {
    id: "ai-builder",
    label: { ar: "بُناة الذكاء الاصطناعي", en: "AI Builders" },
    tagline: {
      ar: "أطر بناء الوكلاء و RAG وتشغيل النماذج محلياً.",
      en: "Frameworks for agents, RAG, and running models locally.",
    },
    tools: AI_BUILDER_TOOLS,
  },
  "founder-automation": {
    id: "founder-automation",
    label: { ar: "المؤسّسين والأتمتة", en: "Founders & Automation" },
    tagline: {
      ar: "أتمتة سير العمل والمهام لتشغّل عملك على الطيّار الآلي.",
      en: "Workflow & task automation to run your business on autopilot.",
    },
    tools: FOUNDER_AUTOMATION_TOOLS,
  },
  creator: {
    id: "creator",
    label: { ar: "صنّاع المحتوى", en: "Creators" },
    tagline: {
      ar: "أدوات صوت وصورة وفيديو بالـ AI تضاعف إنتاجك.",
      en: "AI audio, image & video tools that multiply your output.",
    },
    tools: CREATOR_TOOLS,
  },
}

// ── Scoring ──────────────────────────────────────────────────────────────────
// `niche` is dominant (weight 5) so domains never bleed. Supporting answers add
// small nudges to break ties between adjacent segments (e.g. dev vs ai-builder).

const NICHE_TO_SEGMENT: Record<string, SegmentId> = {
  dev: "developer",
  security: "security",
  automation: "founder-automation",
  content: "creator",
  business: "founder-automation",
}

const ROLE_TO_SEGMENT: Record<string, SegmentId> = {
  dev: "developer",
  security: "security",
  founder: "founder-automation",
  creator: "creator",
  // `student` is intentionally unmapped — too ambiguous to add weight.
}

const GOAL_TO_SEGMENT: Record<string, SegmentId> = {
  ship: "developer",
  master: "ai-builder",
  automate: "founder-automation",
  // `income` / `career` are segment-neutral.
}

const APPLY_TO_SEGMENT: Partial<Record<string, SegmentId>> = {
  side: "founder-automation",
}

const NICHE_WEIGHT = 5
const ROLE_WEIGHT = 2
const GOAL_WEIGHT = 2
const APPLY_WEIGHT = 1
// Advanced + "master AI workflows" tips a developer toward the AI-builder set.
const LEVEL_AI_BUILDER_WEIGHT = 2

const FALLBACK: SegmentId = "developer"

function bump(scores: Record<SegmentId, number>, seg: SegmentId | undefined, by: number) {
  if (seg) scores[seg] += by
}

/**
 * Pure, deterministic segmentation. Returns the single best-matched segment with
 * its tailored tool set. Unknown/empty answers degrade gracefully to a sensible
 * default rather than throwing.
 */
export function segment(answers: Record<string, string>): SegmentResult {
  const scores: Record<SegmentId, number> = {
    developer: 0,
    security: 0,
    "ai-builder": 0,
    "founder-automation": 0,
    creator: 0,
  }

  bump(scores, NICHE_TO_SEGMENT[answers.niche], NICHE_WEIGHT)
  bump(scores, ROLE_TO_SEGMENT[answers.role], ROLE_WEIGHT)
  bump(scores, GOAL_TO_SEGMENT[answers.goal], GOAL_WEIGHT)
  bump(scores, APPLY_TO_SEGMENT[answers.apply], APPLY_WEIGHT)

  // Nudge experienced AI tinkerers (advanced + master goal) into ai-builder,
  // but only as a supporting signal — niche still dominates.
  if (answers.level === "advanced" && answers.goal === "master") {
    bump(scores, "ai-builder", LEVEL_AI_BUILDER_WEIGHT)
  }

  let winner: SegmentId = FALLBACK
  let best = -1
  // Stable tie-break by following the declared key order.
  for (const id of Object.keys(scores) as SegmentId[]) {
    if (scores[id] > best) {
      best = scores[id]
      winner = id
    }
  }

  return { ...SEGMENTS[winner], score: best }
}
