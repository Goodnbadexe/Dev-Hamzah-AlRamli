// === METADATA ===
// Purpose: Pricing, product copy, promo + checkout config for the /subscribe
//          funnel. Prices follow the locked decision (9 / 29 / 69 SAR) framed as
//          1-week / 4-week / 12-week. Strike-through originals are set so the
//          discount math is REAL (no fake "was" prices) and lands on the same
//          61% / 65% the reference paywall used.
// Payment: each plan's CTA points at an env-configured checkout link
//          (Moyasar / Tap / Stripe Payment Link). If a link isn't set, the
//          funnel falls back to capturing the lead + emailing the plan — it
//          never fakes a charge.
// === END METADATA ===

export type Plan = {
  id: "trial" | "month" | "quarter"
  en: string
  ar: string
  badge: string | null
  badgeAr: string | null
  tag: string | null
  tagAr: string | null
  original: number // SAR, strike-through
  price: number // SAR
  perDay: string // "1.04 SAR/day"
  perDayAr: string // "١.٠٤ ر.س/يوم"
  usd: string // "≈ $7.7"
  weeks: number
  highlight: boolean
  best: boolean
}

/** Real 10-minute discount window (persisted, never silently reset). */
export const PROMO_WINDOW_MS = 10 * 60 * 1000

export const SAR_PER_USD = 3.75

export const PLANS: Plan[] = [
  {
    id: "trial",
    en: "1-Week Trial",
    ar: "تجربة أسبوع",
    badge: null,
    badgeAr: null,
    tag: null,
    tagAr: null,
    original: 19,
    price: 9,
    perDay: "1.29 SAR/day",
    perDayAr: "١.٢٩ ر.س/يوم",
    usd: "≈ $2.4",
    weeks: 1,
    highlight: false,
    best: false,
  },
  {
    id: "month",
    en: "4-Week Plan",
    ar: "خطة ٤ أسابيع",
    badge: "SAVE 61%",
    badgeAr: "وفّر ٦١٪",
    tag: "MOST POPULAR",
    tagAr: "الأكثر اختياراً",
    original: 75,
    price: 29,
    perDay: "1.04 SAR/day",
    perDayAr: "١.٠٤ ر.س/يوم",
    usd: "≈ $7.7",
    weeks: 4,
    highlight: true,
    best: false,
  },
  {
    id: "quarter",
    en: "12-Week Plan",
    ar: "خطة ١٢ أسبوع",
    badge: "SAVE 65%",
    badgeAr: "وفّر ٦٥٪",
    tag: "BEST VALUE",
    tagAr: "أفضل قيمة",
    original: 199,
    price: 69,
    perDay: "0.82 SAR/day",
    perDayAr: "٠.٨٢ ر.س/يوم",
    usd: "≈ $18",
    weeks: 12,
    highlight: false,
    best: true,
  },
]

export const PRODUCT = {
  brandAr: "خزينة الأدوات",
  brandEn: "the toolkit vault",
  // Headline shown on the paywall (reframed per the "elevate your AI workflow" pitch)
  headlineAr: "افتح إمكانياتك بخطة ذكاء اصطناعي مصمّمة لك",
  headlineEn: "Unlock your potential with a personalized AI plan",
  benefits: [
    { ar: "حقيبة أدوات أسبوعية (PDF) جاهزة تنسخها في Claude أو ChatGPT أو Codex", en: "A weekly toolkit (PDF) you drop straight into Claude, ChatGPT or Codex" },
    { ar: "مختارة حسب مجالك وأهدافك من إجاباتك", en: "Curated to your niche & goals from your answers" },
    { ar: "أدوات ومستودعات سرية ما يوصلها الكل", en: "Underground tools & repos most people never find" },
    { ar: "workflow أنظف ومساحات عمل مترابطة", en: "A cleaner workflow & connected workspaces" },
    { ar: "وصول فوري · إلغاء في أي وقت", en: "Instant access · cancel anytime" },
  ],
  // Honest, aspirational social proof — no fabricated research citation.
  socialProofAr: "أعضاء الـ ١٢ أسبوع يوصلون أبعد — الحقيبة تتراكم كل أسبوع فوق اللي قبله.",
  socialProofEn: "12-week members go furthest — the toolkit compounds every week on the last.",
}

/** Loading-screen status lines (the 2.5s "building your plan" beat). */
export const BUILD_STEPS: { ar: string; en: string }[] = [
  { ar: "نحلّل إجاباتك…", en: "Analyzing your answers…" },
  { ar: "نطابق الأدوات مع أهدافك…", en: "Matching tools to your goals…" },
  { ar: "نرتّب مساحة عملك…", en: "Structuring your workspace…" },
  { ar: "نبني خطتك الشخصية…", en: "Building your personalized plan…" },
]

/**
 * Personalized promo code from the visitor's first name + month/day.
 * e.g. "sara_jun07". Mirrors the reference (alra_may30) but makes the code
 * the visitor's own — small ownership cue that lifts conversion.
 */
export function buildPromoCode(firstName: string): string {
  const slug = (firstName || "you")
    .trim()
    .toLowerCase()
    .replace(/[^a-z؀-ۿ]/g, "")
    .slice(0, 8) || "you"
  const now = new Date()
  const month = now.toLocaleString("en-US", { month: "short" }).toLowerCase()
  const day = String(now.getDate()).padStart(2, "0")
  return `${slug}_${month}${day}`
}

/**
 * Resolve the checkout URL for a plan. Env (NEXT_PUBLIC_CHECKOUT_*) holds the
 * Moyasar/Tap/Stripe Payment Link. Returns "" when unconfigured so the funnel
 * uses the lead-capture fallback instead of a broken/fake checkout.
 */
export function checkoutUrl(planId: Plan["id"]): string {
  const map: Record<Plan["id"], string | undefined> = {
    trial: process.env.NEXT_PUBLIC_CHECKOUT_TRIAL,
    month: process.env.NEXT_PUBLIC_CHECKOUT_MONTH,
    quarter: process.env.NEXT_PUBLIC_CHECKOUT_QUARTER,
  }
  return (map[planId] ?? "").trim()
}
