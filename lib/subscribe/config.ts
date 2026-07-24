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

import { type TrackId, type OsId, TRACK_IDS } from "./tracks"
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
// Each track + the all-access bundle is a Gumroad product; the CTA opens its
// Gumroad overlay checkout. Links resolve by CONVENTION from the product slug
// (see gumroadSlug) instead of a per-link env map — so creating a new OS build
// with its conventional slug wires it into the funnel with no env edit or redeploy.
const GUMROAD_USER = "hamzahramli"
// 50%-off launch code, pre-applied on single-vault checkout so the overlay
// charges the exact $8 the paywall advertises. Empty it to end the promo.
const LAUNCH_OFFER = "LAUNCH50"

/** Gumroad product slug for a tier key + OS, by convention: tracks are
 *  `<track>-vault-<os>`, the bundle is `all-access-<os>`. */
function gumroadSlug(key: TrackId | "all", os: OsId): string {
  return key === "all" ? `all-access-${os}` : `${key}-vault-${os}`
}

/** Best Gumroad checkout URL for the ticked tracks + the buyer's OS: 1 track →
 *  that vault with the launch discount pre-applied, 2+ → all-access at $25 list. */
export function gumroadUrl(selectedTracks: TrackId[], os: OsId = "windows"): string {
  const tier = tierForTracks(selectedTracks)
  const key: TrackId | "all" = tier === "single" ? selectedTracks[0] : "all"
  const url = `https://${GUMROAD_USER}.gumroad.com/l/${gumroadSlug(key, os)}`
  // Launch discount applies to single vaults only; all-access stays at $25 list.
  return key === "all" || !LAUNCH_OFFER ? url : `${url}/${LAUNCH_OFFER}`
}

// Base + per-tool pricing (USD). One issue = 5 tools → $2 base + $1.20 × 5 = $8 —
// the net after the 50% launch code on the $16 `listPerIssue`. All-access (2+
// vaults) is a flat $25 bundle that undercuts buying every issue separately.
export const PRICING = { base: 2, perTool: 1.2, toolsPerIssue: 5, perIssue: 8, listPerIssue: 16, allAccess: 25 }

export type GumroadPrice = { price: number; original: number; breakdown: string }

/** USD price + honest strike-through + a base/per-tool breakdown line for the paywall. */
export function gumroadPrice(selectedTracks: TrackId[]): GumroadPrice {
  const n = Math.max(1, selectedTracks.length)
  // 1 vault = its own product; 2+ has no multi-pick product, so it routes to
  // all-access (matching gumroadUrl) at the flat $25 bundle price.
  if (n >= 2) {
    const original = PRICING.listPerIssue * TRACK_IDS.length // list value of all vaults bought separately
    return { price: PRICING.allAccess, original, breakdown: `all ${TRACK_IDS.length} vaults · one price` }
  }
  const tools = PRICING.toolsPerIssue * n
  const price = Math.round(PRICING.base + PRICING.perTool * tools)
  return { price, original: PRICING.listPerIssue * n, breakdown: `$${PRICING.base} base + $${PRICING.perTool}/tool × ${tools}` }
}

export const PRODUCT = {
  brandAr: "خزينة الأدوات",
  brandEn: "the toolkit vault",
  // Headline shown on the paywall (reframed per the "elevate your AI workflow" pitch)
  headlineAr: "افتح إمكانياتك بخطة ذكاء اصطناعي مصمّمة لك",
  headlineEn: "Unlock your potential with a personalized AI plan",
  benefits: [
    { ar: "كل حقيبة مسار ٤ أسابيع (PDF) جاهزة تنسخها في Claude أو ChatGPT أو Codex", en: "Each vault is a guided 4-week path (PDF) you drop straight into Claude, ChatGPT or Codex" },
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
