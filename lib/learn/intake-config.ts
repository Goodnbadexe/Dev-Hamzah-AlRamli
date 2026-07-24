// === METADATA ===
// Purpose: Learning Lab intake configuration — packages, tracks, self-check
//          questions, and consent copy for the /learn prototype (Phase 2).
//          Bilingual by construction: every learner-facing string is {ar, en}.
//          Canonical field spec: docs/learning-lab/INTAKE-SCHEMA.md (v2).
// Author: @Goodnbad.exe
// Inputs: none (static config)
// Outputs: typed config consumed by app/learn/* components
// Tests: type-checked via `npx tsc --noEmit`; behavior in tests/learn-assessment.test.ts
// Complexity: O(1)
// === END METADATA ===

export interface Bi {
  ar: string
  en: string
}

export type PackageId = "guided_path" | "academic_sprint" | "private_mentorship"
export type TrackId =
  | "fundamentals"
  | "programming"
  | "cybersecurity"
  | "data_science"
  | "ai_automation"
  | "university"
  | "custom"
export type LevelId = "beginner" | "intermediate" | "advanced"

export interface LearnPackage {
  id: PackageId
  /** OS-flavored file name shown in the card chrome, e.g. "guided-path.pkg" */
  osName: string
  name: Bi
  /** One-sentence boundary rule (POLICIES §4) — the disambiguator on the card */
  boundary: Bi
  includes: Bi[]
  cadence: Bi
}

export const PACKAGES: LearnPackage[] = [
  {
    id: "guided_path",
    osName: "guided-path.pkg",
    name: { en: "Guided Path", ar: "المسار الموجّه" },
    boundary: {
      en: "Your own skill goal, on your own timeline.",
      ar: "هدفك المهاري الخاص، وفق جدولك الزمني.",
    },
    includes: [
      { en: "Diagnostic assessment", ar: "تقييم تشخيصي" },
      { en: "Personalized learning plan", ar: "خطة تعلّم شخصية" },
      { en: "Steps unlock one at a time, verified", ar: "خطوات تُفتح واحدة تلو الأخرى بعد التحقق" },
      { en: "Written feedback + one revision cycle", ar: "ملاحظات مكتوبة + دورة مراجعة واحدة" },
    ],
    cadence: { en: "Plan deadlines, async", ar: "مواعيد ضمن الخطة، غير متزامن" },
  },
  {
    id: "academic_sprint",
    osName: "academic-sprint.pkg",
    name: { en: "Academic Sprint", ar: "السباق الأكاديمي" },
    boundary: {
      en: "You have a graded brief and a fixed institutional deadline.",
      ar: "لديك تكليف جامعي مُقيَّم وموعد تسليم محدد.",
    },
    includes: [
      { en: "Brief + rubric analysis", ar: "تحليل التكليف ومعايير التقييم" },
      { en: "Execution plan with milestones", ar: "خطة تنفيذ بمراحل واضحة" },
      { en: "Concept teaching + examples", ar: "شرح المفاهيم مع أمثلة" },
      { en: "Review of YOUR work before submission", ar: "مراجعة عملك أنت قبل التسليم" },
    ],
    cadence: { en: "~1 week, scope-configurable", ar: "أسبوع تقريبًا، حسب النطاق" },
  },
  {
    id: "private_mentorship",
    osName: "private-mentorship.pkg",
    name: { en: "Private Mentorship", ar: "الإرشاد الخاص" },
    boundary: {
      en: "You want it live, one-to-one.",
      ar: "تريد التعلّم مباشرة، وجهًا لوجه.",
    },
    includes: [
      { en: "Pre-session diagnostic + agenda", ar: "تشخيص وجدول أعمال قبل الجلسة" },
      { en: "Live 1:1 session in your timezone", ar: "جلسة مباشرة فردية بتوقيتك" },
      { en: "Session notes + next steps", ar: "ملاحظات الجلسة والخطوات التالية" },
      { en: "Optional follow-up exercises", ar: "تمارين متابعة اختيارية" },
    ],
    cadence: { en: "Booked, single or bundle", ar: "بالحجز، جلسة أو باقة" },
  },
]

export interface LearnTrack {
  id: TrackId
  label: Bi
  osTag: string
}

export const TRACKS: LearnTrack[] = [
  { id: "fundamentals", label: { en: "Computer fundamentals", ar: "أساسيات الحاسوب" }, osTag: "core.sys" },
  { id: "programming", label: { en: "Programming", ar: "البرمجة" }, osTag: "code.exe" },
  { id: "cybersecurity", label: { en: "Cybersecurity", ar: "الأمن السيبراني" }, osTag: "shield.sys" },
  { id: "data_science", label: { en: "Data & analytics", ar: "البيانات والتحليل" }, osTag: "data.db" },
  { id: "ai_automation", label: { en: "AI, agents & automation", ar: "الذكاء الاصطناعي والأتمتة" }, osTag: "agent.ai" },
  { id: "university", label: { en: "University support", ar: "الدعم الجامعي" }, osTag: "campus.doc" },
  { id: "custom", label: { en: "Something else", ar: "موضوع آخر" }, osTag: "custom.cfg" },
]

/** Self-check question (ASSESSMENT.md §1) — options ordered novice → fluent (0/1/2 points). */
export interface SelfCheck {
  id: string
  question: Bi
  options: [Bi, Bi, Bi]
}

export const SELF_CHECKS: Partial<Record<TrackId, SelfCheck[]>> = {
  fundamentals: [
    {
      id: "F1",
      question: { en: "What happens when you save a file?", ar: "ماذا يحدث عند حفظ ملف؟" },
      options: [
        { en: "It just… saves?", ar: "يُحفظ فحسب؟" },
        { en: "It's written to storage on disk", ar: "يُكتب إلى وحدة التخزين" },
        { en: "The OS buffers it, writes blocks, updates file-system metadata", ar: "يخزّنه النظام مؤقتًا ثم يكتب الكتل ويحدّث بيانات نظام الملفات" },
      ],
    },
    {
      id: "F2",
      question: { en: "RAM vs storage — the difference?", ar: "ما الفرق بين الذاكرة والتخزين؟" },
      options: [
        { en: "Not sure", ar: "لست متأكدًا" },
        { en: "RAM is temporary, storage is permanent", ar: "الذاكرة مؤقتة والتخزين دائم" },
        { en: "I can also explain why programs load INTO RAM", ar: "أستطيع أيضًا شرح لماذا تُحمَّل البرامج إلى الذاكرة" },
      ],
    },
    {
      id: "F3",
      question: { en: "What is a folder, really?", ar: "ما هو المجلد فعليًا؟" },
      options: [
        { en: "A place files live", ar: "مكان توضع فيه الملفات" },
        { en: "A container the OS uses to organize files", ar: "حاوية ينظّم بها النظام الملفات" },
        { en: "A directory entry mapping names to file references", ar: "قيد دليل يربط الأسماء بمراجع الملفات" },
      ],
    },
  ],
  programming: [
    {
      id: "P1",
      question: { en: "Have you written a loop that processes a list?", ar: "هل كتبت حلقة تعالج قائمة؟" },
      options: [
        { en: "Never", ar: "أبدًا" },
        { en: "With help / tutorials", ar: "بمساعدة أو عبر دروس" },
        { en: "Regularly — comfortable with nested logic", ar: "بانتظام — ومرتاح مع المنطق المتداخل" },
      ],
    },
    {
      id: "P2",
      question: { en: "A program crashes with an error. First move?", ar: "انهار البرنامج برسالة خطأ. ما أول خطوة؟" },
      options: [
        { en: "Panic / retry", ar: "أعيد المحاولة" },
        { en: "Read the message and search it", ar: "أقرأ الرسالة وأبحث عنها" },
        { en: "Read the stack trace, locate the line, reason about state", ar: "أقرأ تتبّع الاستدعاءات وأحدد السطر وأحلل الحالة" },
      ],
    },
    {
      id: "P3",
      question: { en: "Could you write a function returning the Nth Fibonacci number?", ar: "هل تستطيع كتابة دالة تعيد رقم فيبوناتشي N؟" },
      options: [
        { en: "Don't know where to start", ar: "لا أعرف من أين أبدأ" },
        { en: "With a reference", ar: "بالاستعانة بمرجع" },
        { en: "Yes — iteratively or recursively, and explain the difference", ar: "نعم — تكراريًا أو عوديًا، مع شرح الفرق" },
      ],
    },
  ],
  cybersecurity: [
    {
      id: "C1",
      question: { en: "What is the CIA triad?", ar: "ما هو ثالوث CIA؟" },
      options: [
        { en: "Haven't heard of it", ar: "لم أسمع به" },
        { en: "Confidentiality, Integrity, Availability", ar: "السرية والسلامة والتوافر" },
        { en: "I can map real attacks to each pillar", ar: "أستطيع ربط هجمات حقيقية بكل ركن" },
      ],
    },
    {
      id: "C2",
      question: { en: "You type a URL and press Enter — what happens?", ar: "تكتب عنوانًا وتضغط Enter — ماذا يحدث؟" },
      options: [
        { en: "Not sure", ar: "لست متأكدًا" },
        { en: "DNS → server → response", ar: "DNS ثم الخادم ثم الاستجابة" },
        { en: "DNS, TCP/TLS handshake, HTTP, rendering — and where attacks fit", ar: "DNS ومصافحة TCP/TLS وHTTP والعرض — وأين تقع الهجمات" },
      ],
    },
    {
      id: "C3",
      question: { en: "Used a security lab environment?", ar: "هل استخدمت بيئة مختبر أمني؟" },
      options: [
        { en: "Never", ar: "أبدًا" },
        { en: "Guided platforms (THM/HTB tiers)", ar: "منصات موجهة (THM/HTB)" },
        { en: "Own VMs / CTFs / structured lab work", ar: "أجهزتي الافتراضية / CTF / عمل مخبري منظم" },
      ],
    },
  ],
  data_science: [
    {
      id: "D1",
      question: { en: "Given a messy spreadsheet — first move?", ar: "أمامك جدول بيانات فوضوي — ما أول خطوة؟" },
      options: [
        { en: "Not sure", ar: "لست متأكدًا" },
        { en: "Look for blanks/duplicates and clean", ar: "أبحث عن الفراغات والتكرارات وأنظّف" },
        { en: "Profile distributions, define a strategy, document assumptions", ar: "أحلل التوزيعات وأضع استراتيجية وأوثّق الافتراضات" },
      ],
    },
    {
      id: "D2",
      question: { en: "Mean vs median — when does it matter?", ar: "المتوسط مقابل الوسيط — متى يهم الفرق؟" },
      options: [
        { en: "Don't remember", ar: "لا أتذكر" },
        { en: "Outliers skew the mean", ar: "القيم الشاذة تحرف المتوسط" },
        { en: "I choose per distribution and justify it", ar: "أختار بحسب التوزيع وأبرر الاختيار" },
      ],
    },
    {
      id: "D3",
      question: { en: "Loaded data with code (Python/R)?", ar: "هل حمّلت بيانات برمجيًا (بايثون/R)؟" },
      options: [
        { en: "Never", ar: "أبدًا" },
        { en: "Following tutorials", ar: "باتباع دروس" },
        { en: "Regularly — joins, groupby, the works", ar: "بانتظام — دمج وتجميع وغيرها" },
      ],
    },
  ],
  ai_automation: [
    {
      id: "A1",
      question: { en: "An LLM agent vs a plain chat prompt?", ar: "ما الفرق بين وكيل ذكاء اصطناعي ومحادثة عادية؟" },
      options: [
        { en: "Not sure", ar: "لست متأكدًا" },
        { en: "An AI that can take actions / use tools", ar: "ذكاء اصطناعي ينفّذ إجراءات ويستخدم أدوات" },
        { en: "A model in a loop with tools, memory, stop conditions — and failure modes", ar: "نموذج في حلقة مع أدوات وذاكرة وشروط توقف — وأعرف أين يفشل" },
      ],
    },
    {
      id: "A2",
      question: { en: "Built any automation (scripts, Zapier/n8n, bots)?", ar: "هل بنيت أي أتمتة (سكربتات، Zapier/n8n، بوتات)؟" },
      options: [
        { en: "Never", ar: "أبدًا" },
        { en: "Simple no-code flows", ar: "تدفقات بسيطة دون كود" },
        { en: "Multi-step flows with error handling or code", ar: "تدفقات متعددة الخطوات مع معالجة أخطاء أو كود" },
      ],
    },
    {
      id: "A3",
      question: { en: "What is a prompt injection?", ar: "ما هو حقن الأوامر (Prompt Injection)؟" },
      options: [
        { en: "Never heard of it", ar: "لم أسمع به" },
        { en: "Tricking an AI into ignoring instructions", ar: "خداع الذكاء الاصطناعي لتجاهل تعليماته" },
        { en: "Untrusted input crossing into the instruction context — and mitigations", ar: "مدخلات غير موثوقة تعبر إلى سياق التعليمات — وأعرف سبل التخفيف" },
      ],
    },
  ],
}

export interface ConsentDef {
  key: "integrity" | "privacy" | "communication" | "recording" | "lab_authorization"
  label: Bi
  /** Anchor into the #terms section */
  anchor: string
  requiredFor: "all" | "private_mentorship" | "cybersecurity"
}

export const CONSENTS: ConsentDef[] = [
  {
    key: "integrity",
    label: {
      en: "I understand this service teaches and reviews — it never completes assessed work in my name.",
      ar: "أفهم أن هذه الخدمة تعلّم وتراجع — ولا تنجز أبدًا عملًا مُقيَّمًا باسمي.",
    },
    anchor: "#terms-integrity",
    requiredFor: "all",
  },
  {
    key: "privacy",
    label: {
      en: "I accept the privacy and data-retention terms.",
      ar: "أوافق على شروط الخصوصية والاحتفاظ بالبيانات.",
    },
    anchor: "#terms-privacy",
    requiredFor: "all",
  },
  {
    key: "communication",
    label: {
      en: "I agree to receive the transactional emails that run this engagement.",
      ar: "أوافق على استلام رسائل البريد الخاصة بسير هذا الاشتراك.",
    },
    anchor: "#terms-privacy",
    requiredFor: "all",
  },
  {
    key: "recording",
    label: {
      en: "Recording consent (live sessions only — declining is fully supported).",
      ar: "الموافقة على التسجيل (للجلسات المباشرة فقط — الرفض مدعوم تمامًا).",
    },
    anchor: "#terms-privacy",
    requiredFor: "private_mentorship",
  },
  {
    key: "lab_authorization",
    label: {
      en: "Hands-on security exercises stay inside labs I own or am authorized to use.",
      ar: "تبقى التمارين الأمنية العملية داخل مختبرات أملكها أو مُصرَّح لي باستخدامها.",
    },
    anchor: "#terms-lab",
    requiredFor: "cybersecurity",
  },
]

export const EXPERIENCE_LEVELS: { id: LevelId; label: Bi }[] = [
  { id: "beginner", label: { en: "Beginner", ar: "مبتدئ" } },
  { id: "intermediate", label: { en: "Intermediate", ar: "متوسط" } },
  { id: "advanced", label: { en: "Advanced", ar: "متقدم" } },
]
