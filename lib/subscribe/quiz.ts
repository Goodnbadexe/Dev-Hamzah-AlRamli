// === METADATA ===
// Purpose: Quiz content for the /subscribe funnel — bilingual (Arabic-first),
//          sequenced for conversion psychology, not random order.
// Flow:    opener/identity → agitate pain → amplify desire → qualify/personalize
//          → pick tracks → micro-commitments → name + email. Each easy tap is a
//          small commitment that makes the next one (and the paywall) feel like a
//          natural continuation rather than a cold ask.
// Shape:   21 questions. SINGLE-select where "pick one" is correct — including the
//          two variant selectors `ai_tool` (Claude/Codex/Gemini/ChatGPT/Other) and
//          `os` (Windows/Linux/macOS), which choose a tuned build of each PDF.
//          MULTI-select where a person legitimately has several answers (tick many).
//          The `tracks` question's values equal TrackId and ALSO drive pricing.
// Author:  @Goodnbad.exe
// === END METADATA ===

import { TRACK_IDS } from "./tracks"

export type QuizOption = { value: string; en: string; ar: string }

export type QuizQuestion =
  | {
      id: string
      type: "single"
      icon: string
      en: string
      ar: string
      /** small English helper under the Arabic prompt */
      subEn?: string
      options: QuizOption[]
    }
  | {
      id: string
      type: "multi"
      icon: string
      en: string
      ar: string
      subEn?: string
      options: QuizOption[]
      /** require at least this many ticks before "Continue" enables (default 1) */
      minSelect?: number
      /** cap the number of ticks (omit for unlimited) */
      maxSelect?: number
    }
  | {
      id: string
      type: "text"
      icon: string
      en: string
      ar: string
      subEn?: string
      inputType: "text" | "email"
      placeholder: string
      placeholderAr: string
      /** field this maps to on the lead payload */
      field: "name" | "email"
    }

export const QUIZ: QuizQuestion[] = [
  // ── 1 · Identity (frictionless opener) ─────────────────────────────────────
  {
    id: "role",
    type: "multi",
    icon: "user",
    ar: "وش يوصفك؟ (اختر كل ما ينطبق)",
    en: "What describes you? (tick all that apply)",
    minSelect: 1,
    options: [
      { value: "student", ar: "طالب / متعلّم", en: "Student / learner" },
      { value: "dev", ar: "مطوّر / مبرمج", en: "Developer" },
      { value: "founder", ar: "صاحب مشروع / مستقل", en: "Founder / freelancer" },
      { value: "creator", ar: "صانع محتوى / تسويق", en: "Creator / marketer" },
      { value: "security", ar: "مهتم بالأمن السيبراني", en: "Into cybersecurity" },
      { value: "other", ar: "غير ذلك", en: "Something else" },
    ],
  },
  {
    // VARIANT SELECTOR — values MUST equal ToolId. Pick ONE primary tool; the
    // toolkit you receive is tuned to it.
    id: "ai_tool",
    type: "single",
    icon: "wrench",
    ar: "أداتك الأساسية؟ (نخصّص لك على أساسها)",
    en: "Your primary AI tool?",
    subEn: "We tune every toolkit to the one you actually use.",
    options: [
      { value: "claude", ar: "Claude", en: "Claude" },
      { value: "codex", ar: "Codex / Cursor / Copilot", en: "Codex / Cursor / Copilot" },
      { value: "gemini", ar: "Gemini", en: "Gemini" },
      { value: "chatgpt", ar: "ChatGPT", en: "ChatGPT" },
      { value: "other", ar: "غير ذلك / خليط", en: "Other / a mix" },
    ],
  },
  {
    // VARIANT SELECTOR — values MUST equal OsId. Tailors commands + setup steps.
    id: "os",
    type: "single",
    icon: "monitor",
    ar: "نظام جهازك؟",
    en: "Your operating system?",
    subEn: "So setup steps and commands match your machine.",
    options: [
      { value: "windows", ar: "ويندوز", en: "Windows" },
      { value: "linux", ar: "لينكس", en: "Linux" },
      { value: "macos", ar: "ماك", en: "macOS" },
    ],
  },

  // ── 2 · Desire + focus (drives match% and the recommendation) ──────────────
  {
    id: "goals",
    type: "multi",
    icon: "target",
    ar: "وش تبي توصل له؟ (اختر كل ما ينطبق)",
    en: "What are you trying to achieve? (tick all)",
    minSelect: 1,
    options: [
      { value: "income", ar: "دخل إضافي", en: "Extra income" },
      { value: "ship", ar: "أنجز مشاريعي أسرع", en: "Ship projects faster" },
      { value: "master", ar: "أتقن workflow الـ AI", en: "Master AI workflows" },
      { value: "automate", ar: "أتمتة شغلي", en: "Automate my work" },
      { value: "career", ar: "وظيفة / فرصة أفضل", en: "A better role" },
    ],
  },
  {
    id: "niche",
    type: "multi",
    icon: "compass",
    ar: "مجالاتك؟ (اختر كل ما ينطبق)",
    en: "Your focus areas? (tick all)",
    minSelect: 1,
    options: [
      { value: "security", ar: "الأمن السيبراني", en: "Cybersecurity" },
      { value: "dev", ar: "البرمجة / التطوير", en: "Dev / coding" },
      { value: "automation", ar: "الأتمتة", en: "Automation" },
      { value: "content", ar: "المحتوى / التسويق", en: "Content / marketing" },
      { value: "business", ar: "ريادة / أعمال", en: "Business / startup" },
    ],
  },

  // ── 3 · Pick your tracks (THIS drives the bundle price) ─────────────────────
  {
    // values MUST equal TrackId. Number of ticks → bundle tier (1=single, 2=duo,
    // 3–4=all). This is both the personalization signal AND the product selection.
    id: "tracks",
    type: "multi",
    icon: "layers",
    ar: "وش الحقائب اللي تبيها؟ (اختر كل ما تبي — يحدّد باقتك)",
    en: "Which vaults do you want? (pick what you need)",
    subEn: "The more you pick, the better the bundle price.",
    minSelect: 1,
    maxSelect: TRACK_IDS.length,
    options: [
      { value: "security", ar: "الأمن", en: "Security" },
      { value: "developers", ar: "المطوّرين والأدوات", en: "Developers & Tools" },
      { value: "agents", ar: "الوكلاء", en: "Agents" },
      { value: "automation", ar: "الأتمتة", en: "Automation" },
      { value: "quant", ar: "التداول الكمّي", en: "Quant & Trading" },
      { value: "creative", ar: "ابنِ في المتصفح", en: "Build in the Browser" },
    ],
  },

  // ── 4 · Capture (personalize the plan + reach them) ────────────────────────
  {
    id: "name",
    type: "text",
    icon: "id",
    ar: "وش اسمك الأول؟",
    en: "What's your first name?",
    subEn: "So we can personalize your plan and promo code.",
    inputType: "text",
    placeholder: "Your first name",
    placeholderAr: "اسمك الأول",
    field: "name",
  },
  {
    id: "email",
    type: "text",
    icon: "mail",
    ar: "وين نرسل خطتك الأسبوعية؟",
    en: "Where should we send your weekly plan?",
    subEn: "Your personalized toolkit lands here every week. No spam.",
    inputType: "email",
    placeholder: "you@email.com",
    placeholderAr: "بريدك الإلكتروني",
    field: "email",
  },
]

export const QUIZ_TOTAL = QUIZ.length
