// === METADATA ===
// Purpose: Rules-based preliminary-assessment preview for the /learn prototype.
//          Implements ASSESSMENT.md §2 (level bands) and §4 (duration formula) in
//          miniature, entirely client-side — no data leaves the browser in Phase 2.
//          Anti-canned rule: output echoes the learner's topic, outcome, and target
//          date (ASSESSMENT.md §5). Excludes plan content per the pre-payment
//          boundary in USAGE-RULES.md.
// Author: @Goodnbad.exe
// Inputs: track, self-check answers (0|1|2 each), self-stated level, weekly hours,
//         topic, desired outcome, optional target date
// Outputs: AssessmentPreview — estimated level, gaps, duration band, consistency flag
// Tests: tests/learn-assessment.test.ts
// Complexity: O(1)
// === END METADATA ===

import type { Bi, LevelId, TrackId } from "./intake-config"

export interface AssessmentInput {
  track: TrackId
  /** One 0|1|2 score per self-check question (empty for tracks without checks). */
  answers: number[]
  statedLevel: LevelId
  weeklyHours: number
  topic: string
  desiredOutcome: string
  targetDate?: string
}

export interface AssessmentPreview {
  estimatedLevel: LevelId
  /** True when stated vs estimated differ by 2 bands → manual review (ASSESSMENT §2). */
  inconsistent: boolean
  gaps: Bi[]
  durationBand: Bi
  /** Whether the learner's target date fits inside the band (undefined = no date given). */
  targetFits?: boolean
}

const LEVEL_INDEX: Record<LevelId, number> = { beginner: 0, intermediate: 1, advanced: 2 }

/** ASSESSMENT.md §4 baseHours per track (university/custom are owner-scoped). */
const BASE_HOURS: Record<TrackId, number> = {
  fundamentals: 10,
  programming: 16,
  cybersecurity: 18,
  data_science: 16,
  ai_automation: 14,
  university: 12,
  custom: 12,
}

/** ASSESSMENT.md §3 gap library — [beginner, intermediate, advanced] per track. */
const GAPS: Record<TrackId, [Bi[], Bi[], Bi[]]> = {
  fundamentals: [
    [
      { en: "a mental model of hardware vs software", ar: "نموذج ذهني للعتاد مقابل البرمجيات" },
      { en: "file-system basics", ar: "أساسيات نظام الملفات" },
    ],
    [
      { en: "how the OS manages processes and memory", ar: "كيف يدير النظام العمليات والذاكرة" },
      { en: "number systems (binary/hex)", ar: "أنظمة العد (الثنائي والسادس عشر)" },
    ],
    [
      { en: "internals depth: caching, scheduling, the storage stack", ar: "أعماق النظام: التخزين المؤقت والجدولة" },
    ],
  ],
  programming: [
    [
      { en: "computational thinking", ar: "التفكير الحاسوبي" },
      { en: "syntax fluency in one language", ar: "إتقان أساسيات لغة واحدة" },
    ],
    [
      { en: "debugging discipline", ar: "منهجية تصحيح الأخطاء" },
      { en: "data structures beyond arrays", ar: "هياكل البيانات بعد المصفوفات" },
    ],
    [
      { en: "architecture and patterns", ar: "المعمارية وأنماط التصميم" },
      { en: "testing habits", ar: "عادات الاختبار" },
    ],
  ],
  cybersecurity: [
    [
      { en: "networking fundamentals", ar: "أساسيات الشبكات" },
      { en: "the security mindset — threat framing", ar: "العقلية الأمنية وتأطير التهديدات" },
    ],
    [
      { en: "protocol depth (TCP/TLS/DNS)", ar: "عمق البروتوكولات (TCP/TLS/DNS)" },
      { en: "structured lab methodology", ar: "منهجية مخبرية منظمة" },
    ],
    [
      { en: "specialization depth (DFIR/SOC/offensive path)", ar: "عمق التخصص (DFIR/SOC/الهجومي)" },
    ],
  ],
  data_science: [
    [
      { en: "the spreadsheet→code transition", ar: "الانتقال من الجداول إلى الكود" },
      { en: "statistics vocabulary", ar: "مفردات الإحصاء" },
    ],
    [
      { en: "pandas/R fluency", ar: "إتقان pandas أو R" },
      { en: "a data-cleaning strategy", ar: "استراتيجية تنظيف البيانات" },
    ],
    [
      { en: "modeling judgment", ar: "حُسن اختيار النماذج" },
      { en: "communicating results", ar: "إيصال النتائج" },
    ],
  ],
  ai_automation: [
    [
      { en: "what LLMs actually do (tokens, context)", ar: "ما تفعله النماذج اللغوية فعلًا" },
      { en: "prompt structure", ar: "بنية الأوامر" },
    ],
    [
      { en: "tool-use and agent patterns", ar: "أنماط الوكلاء واستخدام الأدوات" },
      { en: "failure modes and guardrails", ar: "أنماط الفشل والضوابط" },
    ],
    [
      { en: "evaluating and testing agents", ar: "تقييم الوكلاء واختبارهم" },
      { en: "security of AI systems", ar: "أمن أنظمة الذكاء الاصطناعي" },
    ],
  ],
  university: [
    [
      { en: "reading a brief like a rubric", ar: "قراءة التكليف بعين معايير التقييم" },
      { en: "planning backwards from the deadline", ar: "التخطيط عكسيًا من موعد التسليم" },
    ],
    [
      { en: "connecting course theory to the practical task", ar: "ربط نظرية المقرر بالمهمة العملية" },
    ],
    [
      { en: "defense and presentation readiness", ar: "الجاهزية للعرض والمناقشة" },
    ],
  ],
  custom: [
    [{ en: "to be mapped in your review — custom topics get a manual first pass", ar: "تُحدَّد في المراجعة اليدوية — المواضيع المخصصة تُقيَّم يدويًا أولًا" }],
    [{ en: "to be mapped in your review", ar: "تُحدَّد في المراجعة اليدوية" }],
    [{ en: "to be mapped in your review", ar: "تُحدَّد في المراجعة اليدوية" }],
  ],
}

/** Score → band per ASSESSMENT.md §2 (0–1 beginner, 2–4 intermediate, 5–6 advanced). */
export function estimateLevel(answers: number[], statedLevel: LevelId): LevelId {
  if (answers.length === 0) return statedLevel
  const score = answers.reduce((a, b) => a + b, 0)
  if (score <= 1) return "beginner"
  if (score <= 4) return "intermediate"
  return "advanced"
}

export function buildAssessmentPreview(input: AssessmentInput): AssessmentPreview {
  const estimatedLevel = estimateLevel(input.answers, input.statedLevel)
  const inconsistent =
    Math.abs(LEVEL_INDEX[estimatedLevel] - LEVEL_INDEX[input.statedLevel]) >= 2

  const gaps = GAPS[input.track][LEVEL_INDEX[estimatedLevel]]

  // Duration band (ASSESSMENT §4): levelGap defaults to +1 band toward the outcome.
  const levelGap = Math.max(1, 2 - LEVEL_INDEX[estimatedLevel])
  const estHours = BASE_HOURS[input.track] * levelGap
  const weeklyHours = Math.min(40, Math.max(1, input.weeklyHours))
  const weeks = Math.ceil(estHours / weeklyHours)
  const durationBand: Bi =
    weeks <= 3
      ? { en: "2–3 weeks", ar: "أسبوعان إلى ٣" }
      : weeks <= 6
        ? { en: "4–6 weeks", ar: "٤–٦ أسابيع" }
        : weeks <= 10
          ? { en: "6–10 weeks", ar: "٦–١٠ أسابيع" }
          : { en: "10+ weeks (phased)", ar: "أكثر من ١٠ أسابيع (على مراحل)" }

  let targetFits: boolean | undefined
  if (input.targetDate) {
    const target = new Date(input.targetDate + "T00:00:00")
    if (!Number.isNaN(target.getTime())) {
      const daysAvailable = (target.getTime() - Date.now()) / 86_400_000
      targetFits = daysAvailable >= weeks * 7
    }
  }

  return { estimatedLevel, inconsistent, gaps, durationBand, targetFits }
}
