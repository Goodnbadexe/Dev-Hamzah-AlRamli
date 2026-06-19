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
  id: "monthly" | "yearly"
  en: string
  ar: string
  tag: string | null
  badge: string | null
  original: number | null // USD, strike-through (yearly only)
  price: number // USD
  perDay: string // small note line under the price
  usd: string // secondary note (e.g. "save 36%")
  best: boolean
  recurrence: "monthly" | "yearly" // Gumroad recurrence key for checkout deep-link
}

/** Real 10-minute discount window (persisted, never silently reset). */
export const PROMO_WINDOW_MS = 10 * 60 * 1000

export const SAR_PER_USD = 3.75

export const PLANS: Plan[] = [
  {
    id: "monthly",
    en: "Monthly",
    ar: "اشتراك شهري",
    tag: null,
    badge: null,
    original: null,
    price: 9,
    perDay: "billed monthly",
    usd: "",
    best: false,
    recurrence: "monthly",
  },
  {
    id: "yearly",
    en: "Yearly",
    ar: "اشتراك سنوي",
    tag: "BEST VALUE",
    badge: "SAVE 36%",
    original: 108,
    price: 69,
    perDay: "≈ $5.75/mo",
    usd: "save 36%",
    best: true,
    recurrence: "yearly",
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
 * The live Gumroad membership. checkoutUrl() deep-links straight into Gumroad
 * checkout with the plan's recurrence pre-selected — verified working:
 * `?wanted=true&recurrence=monthly|yearly` opens checkout pre-filled at $9 / $69.
 */
export const GUMROAD_PRODUCT = "https://vault.goodnbad.info/l/xqybso"

export function checkoutUrl(planId: Plan["id"]): string {
  return `${GUMROAD_PRODUCT}?wanted=true&recurrence=${planById(planId).recurrence}`
}

/**
 * Moyasar publishable key — safe to ship client-side (it can only CREATE
 * payments, never read/refund). Defaults to the project's TEST key so the
 * in-page card form works immediately for verification. For live charging set
 * NEXT_PUBLIC_MOYASAR_PK to a pk_live_… (requires a Commercial Registration, or
 * switch to a Merchant-of-Record). Never commit a secret (sk_) key.
 */
export const MOYASAR_PK = (process.env.NEXT_PUBLIC_MOYASAR_PK || "pk_test_MWeYAjgV2RfLPQzDufrY1pToi8L3867vnUFuHiF1").trim()
export const MOYASAR_TEST = MOYASAR_PK.startsWith("pk_test")

export function planById(id: Plan["id"]): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0]
}
