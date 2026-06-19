// === METADATA ===
// Purpose: Quiz content for the /subscribe funnel — bilingual (Arabic-first),
//          sequenced for conversion psychology, not random order.
// Flow:    opener/identity → agitate pain → amplify desire → qualify/personalize
//          → micro-commitments → name + email. The order matters: each easy tap
//          is a small commitment that makes the next one (and the paywall) feel
//          like a natural continuation rather than a cold ask.
// Routing: `niche` is the PRIMARY segmentation signal, supported by `role`,
//          `goal`, `level`, `apply`. See lib/subscribe/segment.ts — these answers
//          now actually pick the tailored tool set shown on the paywall.
// Author:  @Goodnbad.exe
// === END METADATA ===

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
  // ── A · Opener / identity (frictionless, builds momentum) ──────────────────
  {
    id: "role",
    type: "single",
    icon: "user",
    ar: "وش يوصفك أكثر؟",
    en: "What best describes you?",
    options: [
      { value: "dev", ar: "مطوّر / مبرمج", en: "Developer / engineer" },
      { value: "security", ar: "أمن سيبراني", en: "Security / hacker" },
      { value: "founder", ar: "صاحب مشروع / مستقل", en: "Founder / freelancer" },
      { value: "creator", ar: "صانع محتوى / تسويق", en: "Creator / marketer" },
      { value: "student", ar: "طالب / متعلّم", en: "Student / still exploring" },
    ],
  },
  {
    id: "ai_freq",
    type: "single",
    icon: "zap",
    ar: "كم تستخدم أدوات الذكاء الاصطناعي حالياً؟",
    en: "How deep are you with AI tools today?",
    options: [
      { value: "daily", ar: "كل يوم — جزء من شغلي", en: "Daily — part of my workflow" },
      { value: "weekly", ar: "كم مرة بالأسبوع", en: "A few times a week" },
      { value: "rarely", ar: "نادراً", en: "Rarely" },
      { value: "new", ar: "لسّا بادي", en: "Just getting started" },
    ],
  },
  {
    id: "tools",
    type: "single",
    icon: "wrench",
    ar: "أكثر أداة تعتمد عليها؟",
    en: "Which AI tool do you lean on most?",
    options: [
      { value: "claude", ar: "Claude", en: "Claude" },
      { value: "chatgpt", ar: "ChatGPT", en: "ChatGPT" },
      { value: "code", ar: "Cursor / Codex / Copilot", en: "Cursor / Codex / Copilot" },
      { value: "mix", ar: "خليط منهم", en: "A mix of them" },
      { value: "none", ar: "ولا واحد لين الحين", en: "None yet" },
    ],
  },

  // ── B · Pain / current state (agitate the gap) ─────────────────────────────
  {
    id: "frustration",
    type: "single",
    icon: "alert",
    ar: "أكبر شي يضايقك في طريقة شغلك الحالية؟",
    en: "Biggest frustration with your current setup?",
    options: [
      { value: "repeat", ar: "أعيد شرح نفسي للـ AI كل مرة", en: "Repeating myself to the AI every time" },
      { value: "messy", ar: "ملفاتي ومساحات عملي مبعثرة", en: "Messy, scattered workspaces" },
      { value: "tools", ar: "ما أعرف وش أفضل الأدوات لمجالي", en: "Don't know the best tools for my field" },
      { value: "slow", ar: "النتائج بطيئة", en: "Results come too slow" },
      { value: "lost", ar: "ما أعرف وش الممكن أصلاً", en: "Not sure what's even possible" },
    ],
  },
  {
    id: "workspace",
    type: "single",
    icon: "layers",
    ar: "كيف تقيّم تنظيم مساحة عملك؟",
    en: "How organized is your workflow right now?",
    options: [
      { value: "chaos", ar: "فوضى كاملة", en: "Total chaos" },
      { value: "some", ar: "شوي منظّم", en: "Somewhat" },
      { value: "tidy", ar: "مرتّب نوعاً ما", en: "Pretty tidy" },
      { value: "systems", ar: "عندي أنظمة جاهزة", en: "I have real systems" },
    ],
  },
  {
    id: "time_lost",
    type: "single",
    icon: "clock",
    ar: "كم ساعة بالأسبوع تضيع في شغل ممكن الـ AI يسوّيه؟",
    en: "Hours/week lost to busywork AI could handle?",
    options: [
      { value: "1-3", ar: "١-٣ ساعات", en: "1–3 hours" },
      { value: "4-7", ar: "٤-٧ ساعات", en: "4–7 hours" },
      { value: "8-15", ar: "٨-١٥ ساعة", en: "8–15 hours" },
      { value: "15+", ar: "أكثر من ١٥ ساعة", en: "15+ hours" },
    ],
  },

  // ── C · Desire / goals (paint the outcome) ─────────────────────────────────
  {
    id: "goal",
    type: "single",
    icon: "target",
    ar: "وش تبي توصل له؟",
    en: "What are you trying to achieve?",
    options: [
      { value: "ship", ar: "أنجز مشاريعي أسرع", en: "Ship projects faster" },
      { value: "master", ar: "أتقن workflow الـ AI", en: "Master AI workflows" },
      { value: "automate", ar: "أتمتة شغلي", en: "Automate my work" },
      { value: "income", ar: "دخل إضافي", en: "Extra income" },
      { value: "career", ar: "وظيفة / فرصة أفضل", en: "A better role" },
    ],
  },
  {
    id: "income_goal",
    type: "single",
    icon: "trending",
    ar: "كم تتمنى تكسب من مهاراتك أو مشاريعك الجانبية؟",
    en: "Income goal from your skills / side projects?",
    options: [
      { value: "1-2k", ar: "١-٢ ألف ريال شهرياً", en: "An extra 1–2k SAR/mo" },
      { value: "3-5k", ar: "٣-٥ آلاف شهرياً", en: "3–5k SAR/mo" },
      { value: "6-10k", ar: "٦-١٠ آلاف شهرياً", en: "6–10k SAR/mo" },
      { value: "10k+", ar: "+١٠ آلاف / أستقل بشغلي", en: "10k+ / replace my job" },
    ],
  },
  {
    id: "timeline",
    type: "single",
    icon: "clock",
    ar: "متى تبي تشوف نتيجة؟",
    en: "How soon do you want results?",
    options: [
      { value: "week", ar: "هذا الأسبوع", en: "This week" },
      { value: "month", ar: "هذا الشهر", en: "This month" },
      { value: "quarter", ar: "خلال ٣ أشهر", en: "Within 3 months" },
      { value: "explore", ar: "بس أستكشف", en: "Just exploring" },
    ],
  },

  // ── D · Qualify / personalize (so the plan feels tailored) ─────────────────
  {
    id: "niche",
    type: "single",
    icon: "compass",
    ar: "مجالك الأساسي؟ (اللي راح نبني حقيبتك حوله)",
    en: "Your main focus area?",
    subEn: "This is what we tune your toolkit around.",
    options: [
      { value: "dev", ar: "البرمجة / التطوير", en: "Dev / coding" },
      { value: "security", ar: "الأمن السيبراني", en: "Cybersecurity" },
      { value: "automation", ar: "الأتمتة وسير العمل", en: "Automation / workflows" },
      { value: "content", ar: "المحتوى / التسويق", en: "Content / marketing" },
      { value: "business", ar: "ريادة / أعمال", en: "Business / startup" },
    ],
  },
  {
    id: "level",
    type: "single",
    icon: "gauge",
    ar: "مستواك في مجالك؟",
    en: "Your level in that field?",
    options: [
      { value: "beginner", ar: "مبتدئ", en: "Beginner" },
      { value: "intermediate", ar: "متوسط", en: "Intermediate" },
      { value: "advanced", ar: "متقدّم", en: "Advanced" },
    ],
  },
  {
    id: "apply",
    type: "single",
    icon: "briefcase",
    ar: "وين تبي تطبّق هذا؟",
    en: "Where will you apply this?",
    options: [
      { value: "work", ar: "في شغلي", en: "At work" },
      { value: "side", ar: "مشروع جانبي", en: "A side business" },
      { value: "personal", ar: "مشاريع شخصية", en: "Personal projects" },
      { value: "study", ar: "دراستي", en: "My studies" },
      { value: "all", ar: "كل ما سبق", en: "All of it" },
    ],
  },
  {
    id: "learn_style",
    type: "single",
    icon: "book",
    ar: "كيف تحب تتعلّم وتطوّر؟",
    en: "How do you like to level up?",
    options: [
      { value: "kits", ar: "أدوات جاهزة أنسخها مباشرة", en: "Ready-to-use kits" },
      { value: "steps", ar: "خطوة بخطوة", en: "Step-by-step guides" },
      { value: "tools", ar: "بس أعطني الأدوات", en: "Just hand me the tools" },
      { value: "examples", ar: "أمثلة أقدر أقلّدها", en: "Examples I can copy" },
    ],
  },

  // ── E · Micro-commitments + investment (sunk-cost, then close) ──────────────
  {
    id: "invest_time",
    type: "single",
    icon: "hourglass",
    ar: "كم وقت تقدر تعطي بالأسبوع؟",
    en: "How much time/week can you put in?",
    options: [
      { value: "15m", ar: "١٥ دقيقة", en: "15 minutes" },
      { value: "30m", ar: "٣٠ دقيقة", en: "30 minutes" },
      { value: "1h", ar: "ساعة", en: "1 hour" },
      { value: "2h+", ar: "ساعتين أو أكثر", en: "2+ hours" },
    ],
  },
  {
    id: "blocker",
    type: "single",
    icon: "lock",
    ar: "وش اللي وقفك لين الحين؟",
    en: "What's held you back so far?",
    options: [
      { value: "start", ar: "ما أعرف من وين أبدأ", en: "Don't know where to start" },
      { value: "options", ar: "خيارات كثيرة ومشتتة", en: "Too many options" },
      { value: "time", ar: "ما عندي وقت أبحث", en: "No time to research" },
      { value: "cost", ar: "التكلفة", en: "Cost" },
    ],
  },
  {
    id: "ready",
    type: "single",
    icon: "rocket",
    ar: "جاهز لخطة مبنية على إجاباتك أنت؟",
    en: "Ready for a plan built around YOUR answers?",
    options: [
      { value: "yes", ar: "إي، وريني", en: "Yes — show me" },
      { value: "think", ar: "أعتقد", en: "I think so" },
    ],
  },

  // ── Capture (personalize the plan + reach them) ────────────────────────────
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
