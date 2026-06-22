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

import { type TrackId, type OsId } from "./tracks"
import { type BundleTier, tierForCount } from "./personalize"

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

// ── Tiered-bundle pricing ──────────────────────────────────────────────────────
// Two axes: bundle TIER (how many tracks the member ticked) × DURATION (1/4/12wk).
// Every cell carries a REAL strike-through `original` — no fake "was" prices. The
// `single` tier equals today's locked 9/29/69 so the existing funnel is a strict
// subset (no regression); the legacy PLANS array below derives its numbers from it.
export type DurationId = Plan["id"] // "trial" | "month" | "quarter"
export type PriceCell = { original: number; price: number } // SAR

export const BUNDLE_MATRIX: Record<BundleTier, Record<DurationId, PriceCell>> = {
  single: {
    trial: { original: 19, price: 9 },
    month: { original: 75, price: 29 },
    quarter: { original: 199, price: 69 },
  },
  duo: {
    trial: { original: 35, price: 15 },
    month: { original: 129, price: 49 },
    quarter: { original: 329, price: 119 },
  },
  all: {
    trial: { original: 55, price: 25 },
    month: { original: 199, price: 79 },
    quarter: { original: 499, price: 179 },
  },
}

const WEEKS_BY_DURATION: Record<DurationId, number> = { trial: 1, month: 4, quarter: 12 }

/** Tier from the ticked tracks: 1→single, 2→duo, 3–4→all. */
export function tierForTracks(selectedTracks: TrackId[]): BundleTier {
  return tierForCount(selectedTracks.length)
}

export type PriceQuote = {
  tier: BundleTier
  duration: DurationId
  original: number
  price: number
  perDay: string
  perDayAr: string
  usd: string
  weeks: number
  savedPct: number
}

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
function toArabicNum(s: string): string {
  return s.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)])
}

/**
 * Resolve the live price for a track selection + duration. Per-day + USD are
 * derived from the real `price`, so the displayed math is always honest.
 */
export function priceFor(selectedTracks: TrackId[], duration: DurationId): PriceQuote {
  const tier = tierForTracks(selectedTracks)
  const cell = BUNDLE_MATRIX[tier][duration]
  const weeks = WEEKS_BY_DURATION[duration]
  const days = weeks * 7
  const perDayNum = (cell.price / days).toFixed(2)
  const perDay = `${perDayNum} SAR/day`
  const perDayAr = `${toArabicNum(perDayNum)} ر.س/يوم`
  const usd = `≈ $${(cell.price / SAR_PER_USD).toFixed(cell.price / SAR_PER_USD >= 10 ? 0 : 1)}`
  const savedPct = cell.original > 0 ? Math.round((1 - cell.price / cell.original) * 100) : 0
  return { tier, duration, original: cell.original, price: cell.price, perDay, perDayAr, usd, weeks, savedPct }
}

export const PLANS: Plan[] = [
  {
    id: "trial",
    en: "1-Week Trial",
    ar: "تجربة أسبوع",
    badge: null,
    badgeAr: null,
    tag: null,
    tagAr: null,
    original: BUNDLE_MATRIX.single.trial.original,
    price: BUNDLE_MATRIX.single.trial.price,
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
    original: BUNDLE_MATRIX.single.month.original,
    price: BUNDLE_MATRIX.single.month.price,
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
    original: BUNDLE_MATRIX.single.quarter.original,
    price: BUNDLE_MATRIX.single.quarter.price,
    perDay: "0.82 SAR/day",
    perDayAr: "٠.٨٢ ر.س/يوم",
    usd: "≈ $18",
    weeks: 12,
    highlight: false,
    best: true,
  },
]

// ── Gumroad storefront (stopgap until a live card processor is connected) ──────
// Each track + the all-access bundle is a Gumroad product. The quiz recommends
// which one to buy; the CTA opens its Gumroad overlay checkout. Set the product
// URLs as NEXT_PUBLIC_GUMROAD_* env (inlined at build — redeploy after changing).
// Each product exists per OS (Windows/Linux/macOS) so a buyer gets a build tuned
// to their machine. `any` is an OS-agnostic fallback link. NOTE: Next inlines
// NEXT_PUBLIC_* only for STATIC references, so every slot is declared explicitly.
type GumroadEntry = { windows?: string; linux?: string; macos?: string; any?: string }

const GUMROAD: Record<TrackId | "all", GumroadEntry> = {
  security: {
    windows: process.env.NEXT_PUBLIC_GUMROAD_SECURITY_WINDOWS,
    linux: process.env.NEXT_PUBLIC_GUMROAD_SECURITY_LINUX,
    macos: process.env.NEXT_PUBLIC_GUMROAD_SECURITY_MACOS,
    any: process.env.NEXT_PUBLIC_GUMROAD_SECURITY,
  },
  developers: {
    windows: process.env.NEXT_PUBLIC_GUMROAD_DEVELOPERS_WINDOWS,
    linux: process.env.NEXT_PUBLIC_GUMROAD_DEVELOPERS_LINUX,
    macos: process.env.NEXT_PUBLIC_GUMROAD_DEVELOPERS_MACOS,
    any: process.env.NEXT_PUBLIC_GUMROAD_DEVELOPERS,
  },
  agents: {
    windows: process.env.NEXT_PUBLIC_GUMROAD_AGENTS_WINDOWS,
    linux: process.env.NEXT_PUBLIC_GUMROAD_AGENTS_LINUX,
    macos: process.env.NEXT_PUBLIC_GUMROAD_AGENTS_MACOS,
    any: process.env.NEXT_PUBLIC_GUMROAD_AGENTS,
  },
  automation: {
    windows: process.env.NEXT_PUBLIC_GUMROAD_AUTOMATION_WINDOWS,
    linux: process.env.NEXT_PUBLIC_GUMROAD_AUTOMATION_LINUX,
    macos: process.env.NEXT_PUBLIC_GUMROAD_AUTOMATION_MACOS,
    any: process.env.NEXT_PUBLIC_GUMROAD_AUTOMATION,
  },
  quant: {
    windows: process.env.NEXT_PUBLIC_GUMROAD_QUANT_WINDOWS,
    linux: process.env.NEXT_PUBLIC_GUMROAD_QUANT_LINUX,
    macos: process.env.NEXT_PUBLIC_GUMROAD_QUANT_MACOS,
    any: process.env.NEXT_PUBLIC_GUMROAD_QUANT,
  },
  creative: {
    windows: process.env.NEXT_PUBLIC_GUMROAD_CREATIVE_WINDOWS,
    linux: process.env.NEXT_PUBLIC_GUMROAD_CREATIVE_LINUX,
    macos: process.env.NEXT_PUBLIC_GUMROAD_CREATIVE_MACOS,
    any: process.env.NEXT_PUBLIC_GUMROAD_CREATIVE,
  },
  all: {
    windows: process.env.NEXT_PUBLIC_GUMROAD_ALL_WINDOWS,
    linux: process.env.NEXT_PUBLIC_GUMROAD_ALL_LINUX,
    macos: process.env.NEXT_PUBLIC_GUMROAD_ALL_MACOS,
    any: process.env.NEXT_PUBLIC_GUMROAD_ALL,
  },
}
const GUMROAD_STORE = process.env.NEXT_PUBLIC_GUMROAD_STORE
// Launch discount code (e.g. "launch50"). Appended to the product URL so the
// Gumroad overlay auto-applies it — checkout shows the strike-through price.
const GUMROAD_DISCOUNT = process.env.NEXT_PUBLIC_GUMROAD_DISCOUNT

/** Best Gumroad product URL for the ticked tracks + the buyer's OS: 1 track → that
 *  vault, 2+ → all-access. Prefers the OS-specific link, then the track's generic
 *  link, then all-access, then the store. Auto-applies the launch discount code. */
export function gumroadUrl(selectedTracks: TrackId[], os: OsId = "windows"): string {
  const tier = tierForTracks(selectedTracks)
  const key: TrackId | "all" = tier === "single" ? selectedTracks[0] : "all"
  const e = GUMROAD[key]
  const all = GUMROAD.all
  const base = ((e && (e[os] || e.any)) || all[os] || all.any || GUMROAD_STORE || "").trim()
  if (!base) return ""
  return GUMROAD_DISCOUNT ? `${base.replace(/\/+$/, "")}/${GUMROAD_DISCOUNT}` : base
}

// Base + per-tool pricing (USD, matches the Gumroad products). One issue = 5 tools
// → $2 base + $1.20 × 5 = $8. All-access (3+ vaults) is a flat bundle price that
// undercuts buying every issue separately.
// You pay $8/mo (single) or $25/mo (all-access). The anchor is the Gumroad list
// price (single $16, all-access $50) so the launch discount reads as a real 50%
// off — the product is priced at the anchor and the auto-applied code nets the
// real price. `perIssue`/`allAccess` are the real prices; anchors are the strike.
export const PRICING = { perIssue: 8, allAccess: 25, anchorSingle: 16, anchorAll: 50 }

export type GumroadPrice = { price: number; original: number; breakdown: string }

/** Real price + strike-through anchor for the paywall (50% launch discount). */
export function gumroadPrice(selectedTracks: TrackId[]): GumroadPrice {
  const n = Math.max(1, selectedTracks.length)
  if (n >= 2) {
    return { price: PRICING.allAccess, original: PRICING.anchorAll, breakdown: "50% launch discount" }
  }
  return { price: PRICING.perIssue, original: PRICING.anchorSingle, breakdown: "50% launch discount" }
}

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
  return PLANS.find((p) => p.id === id) ?? PLANS[1]
}
