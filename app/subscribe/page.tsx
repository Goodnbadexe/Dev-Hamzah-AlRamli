'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Briefcase, Check, CheckCircle2,
  Clock, Compass, Eye, Gauge, History, Hourglass, Layers, Loader2, Lock, Mail, Monitor, Rocket,
  Sparkles, Target, TrendingUp, User, Wrench, Zap, type LucideIcon,
} from "lucide-react"
import { QUIZ, QUIZ_TOTAL } from "@/lib/subscribe/quiz"
import {
  BUILD_STEPS, PRODUCT, PROMO_WINDOW_MS, buildPromoCode, gumroadUrl, gumroadPrice,
} from "@/lib/subscribe/config"
import { personalize } from "@/lib/subscribe/personalize"
import { TRACKS, TRACK_IDS, trackById } from "@/lib/subscribe/tracks"

const ICONS: Record<string, LucideIcon> = {
  user: User, zap: Zap, wrench: Wrench, alert: AlertTriangle, layers: Layers, clock: Clock,
  eye: Eye, target: Target, trending: TrendingUp, sparkles: Sparkles, gauge: Gauge,
  compass: Compass, briefcase: Briefcase, book: BookOpen, hourglass: Hourglass, history: History,
  lock: Lock, rocket: Rocket, id: BadgeCheck, mail: Mail, monitor: Monitor,
}

const OFFER_KEY = "gnb_vault_offer_expires"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Phase = "intro" | "quiz" | "loading" | "plan"

function useCountdown(expiresAt: number | null) {
  const [remaining, setRemaining] = useState(PROMO_WINDOW_MS)
  useEffect(() => {
    if (expiresAt === null) return
    const tick = () => setRemaining(Math.max(0, expiresAt - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [expiresAt])
  const mins = Math.floor(remaining / 60000)
  const secs = Math.floor((remaining % 60000) / 1000)
  return {
    display: `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`,
    expired: remaining === 0,
  }
}

export default function SubscribePage() {
  const [phase, setPhase] = useState<Phase>("intro")
  const [qIndex, setQIndex] = useState(0)
  // Answers are arrays for ALL question types (multi/single/text) — single+text
  // store a one-element array. Lets multi-select share one state shape.
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [promo, setPromo] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<number | null>(null)
  const [wlEmail, setWlEmail] = useState("")
  const [waitlisted, setWaitlisted] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)

  const { display: countdown, expired } = useCountdown(expiresAt)
  const single = useCallback((id: string) => answers[id]?.[0] ?? "", [answers])
  const name = single("name")
  const email = single("email")

  // Live personalization derived from the answers (tracks, match%). With Gumroad
  // the variant is no longer used for delivery — it just recommends the product.
  const person = useMemo(() => personalize(answers), [answers])
  const selectedTracks = person.selectedTracks

  const scrollTop = useCallback(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  // Fire-and-forget lead capture (never blocks the funnel). Logs to Supabase +
  // Telegram/email so you still own every signup even though Gumroad takes payment.
  const sendLead = useCallback((plan?: string, code?: string | null) => {
    if (!name || !EMAIL_RE.test(email)) return
    const payload = {
      name,
      email,
      plan,
      bundle: person.recommendedBundle,
      promo: code ?? promo ?? undefined,
      tracks: selectedTracks,
      tool: person.toolVariant,
      os: person.osVariant,
      readFactor: person.readFactor,
      source: "funnel" as const,
      answers,
    }
    fetch("/api/subscribe/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {})
  }, [answers, promo, name, email, person, selectedTracks])

  // "Coming soon" waitlist — capture the email so we can notify them when this
  // vault goes live. Logged to Supabase (+ Telegram/email) via the lead route.
  const joinWaitlist = useCallback(() => {
    const e = (wlEmail || email).trim()
    if (!EMAIL_RE.test(e)) return
    fetch("/api/subscribe/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        name: name || "Waitlist",
        email: e,
        bundle: person.recommendedBundle,
        promo: promo ?? undefined,
        tracks: selectedTracks,
        tool: person.toolVariant,
        os: person.osVariant,
        readFactor: person.readFactor,
        source: "waitlist",
        answers,
      }),
    }).catch(() => {})
    setWaitlisted(true)
  }, [wlEmail, email, name, person, promo, selectedTracks, answers])

  // Persistent (honest) 10-min offer window — reuse a live one, don't reset it.
  const startBuild = useCallback(() => {
    const code = buildPromoCode(name)
    setPromo(code)
    let exp: number
    try {
      const stored = Number(localStorage.getItem(OFFER_KEY))
      exp = stored && stored > Date.now() ? stored : Date.now() + PROMO_WINDOW_MS
      localStorage.setItem(OFFER_KEY, String(exp))
    } catch {
      exp = Date.now() + PROMO_WINDOW_MS
    }
    setExpiresAt(exp)
    sendLead(undefined, code)
    setPhase("loading")
    scrollTop()
  }, [name, sendLead, scrollTop])

  const q = QUIZ[qIndex]
  const currentVal = single(q?.id ?? "")
  const currentArr = answers[q?.id ?? ""] ?? []
  const canAdvanceText =
    q?.type === "text" && (q.field === "email" ? EMAIL_RE.test(currentVal) : currentVal.trim().length > 0)
  const canAdvanceMulti = q?.type === "multi" && currentArr.length >= (q.minSelect ?? 1)

  const next = useCallback(() => {
    if (qIndex < QUIZ_TOTAL - 1) {
      setQIndex((i) => i + 1)
      scrollTop()
    } else {
      startBuild()
    }
  }, [qIndex, startBuild, scrollTop])

  const pickSingle = useCallback((qid: string, value: string) => {
    setAnswers((a) => ({ ...a, [qid]: [value] }))
    window.setTimeout(() => next(), 240)
  }, [next])

  const toggleMulti = useCallback((qid: string, value: string, max?: number) => {
    setAnswers((a) => {
      const arr = a[qid] ?? []
      if (arr.includes(value)) return { ...a, [qid]: arr.filter((v) => v !== value) }
      if (max && arr.length >= max) return a
      return { ...a, [qid]: [...arr, value] }
    })
  }, [])

  // Loading beat → reveal plan after the build animation.
  const [buildPct, setBuildPct] = useState(0)
  const [buildStep, setBuildStep] = useState(0)
  useEffect(() => {
    if (phase !== "loading") return
    setBuildPct(0)
    setBuildStep(0)
    const start = Date.now()
    const DURATION = 2600
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / DURATION)
      setBuildPct(Math.round(t * 100))
      setBuildStep(Math.min(BUILD_STEPS.length - 1, Math.floor(t * BUILD_STEPS.length)))
      if (t >= 1) {
        clearInterval(id)
        setPhase("plan")
        scrollTop()
      }
    }, 90)
    return () => clearInterval(id)
  }, [phase, scrollTop])

  // Load Gumroad's overlay script so the buy button opens an in-page checkout modal.
  useEffect(() => {
    if (phase !== "plan") return
    if (document.querySelector("script[data-gumroad]")) return
    const s = document.createElement("script")
    s.src = "https://gumroad.com/js/gumroad.js"
    s.setAttribute("data-gumroad", "1")
    s.async = true
    document.body.appendChild(s)
  }, [phase])

  const progressPct = useMemo(() => Math.round((qIndex / QUIZ_TOTAL) * 100), [qIndex])
  const tracksLabel = selectedTracks.map((t) => trackById(t).en).join(" + ")
  const buyUrl = gumroadUrl(selectedTracks, person.osVariant)
  const price = gumroadPrice(selectedTracks)
  const vaultName = person.recommendedBundle === "single" ? `${tracksLabel} Vault` : "All-Access Vault"

  // Upsell: all-access upgrade + other individual tracks not in the recommendation
  const allAccessUrl = gumroadUrl(TRACK_IDS, person.osVariant)
  const otherTracks = TRACKS.filter((t) => !selectedTracks.includes(t.id))
  const showUpsell = selectedTracks.length > 0 && selectedTracks.length < TRACK_IDS.length

  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-100 pb-24">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 60%)" }}
        aria-hidden
      />

      <div ref={topRef} className="relative z-10 mx-auto max-w-lg px-4 pt-10 sm:pt-14">

        {/* Brand header */}
        <div className="mb-7 text-center">
          <span className="mb-3 inline-block rounded border border-emerald-900 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald-700">
            goodnbad · {PRODUCT.brandEn}
          </span>
          <h1 className="mb-1 text-2xl font-bold leading-tight text-zinc-100 sm:text-3xl" dir="rtl">
            {PRODUCT.brandAr}
          </h1>
          <p className="font-mono text-sm leading-snug text-zinc-500">
            Curated AI tools & underground repos — six guided 4-week paths, built around you.
          </p>
        </div>

        {/* ── INTRO ──────────────────────────────────────────────────────── */}
        {phase === "intro" && (
          <section className="animate-[os-panel-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both] space-y-5 text-center">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
              <Rocket className="mx-auto mb-4 h-7 w-7 text-emerald-500" />
              <h2 className="text-xl font-bold text-zinc-100" dir="rtl">
                خلّنا نبني خطتك في دقيقة
              </h2>
              <p className="mt-1.5 text-sm text-zinc-400" dir="rtl">
                {QUIZ_TOTAL} سؤال سريع، وبنطلّع لك خطة أدوات مصمّمة على مقاسك.
              </p>
              <p className="mt-2 font-mono text-[11px] text-zinc-600">
                {QUIZ_TOTAL} quick taps → your personalized AI toolkit plan.
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setPhase("quiz"); scrollTop() }}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-3.5 font-mono text-sm font-semibold uppercase tracking-wide text-emerald-950 transition-all hover:-translate-y-px hover:bg-emerald-400"
            >
              <span dir="rtl">ابدأ · Start</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="font-mono text-[10px] text-zinc-700">free · no card to take the quiz</p>
          </section>
        )}

        {/* ── QUIZ ───────────────────────────────────────────────────────── */}
        {phase === "quiz" && q && (
          <section className="space-y-4">
            <div className="space-y-2">
              <div className="h-0.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                {qIndex > 0 ? (
                  <button type="button" onClick={() => { setQIndex((i) => i - 1); scrollTop() }} className="flex items-center gap-1 hover:text-zinc-400">
                    <ArrowLeft className="h-3 w-3" /> back
                  </button>
                ) : <span />}
                <span>{qIndex + 1} / {QUIZ_TOTAL}</span>
              </div>
            </div>

            <div key={q.id} className="animate-[os-panel-in_0.35s_cubic-bezier(0.16,1,0.3,1)_both] rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-start justify-between gap-3" dir="rtl">
                <div className="flex-1">
                  <p className="text-base font-semibold text-zinc-100">{q.ar}</p>
                  <p className="mt-1 font-mono text-[11px] text-zinc-500" dir="ltr">{q.en}</p>
                  {"subEn" in q && q.subEn && <p className="mt-1 text-[11px] text-zinc-600" dir="ltr">{q.subEn}</p>}
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-emerald-900/70 bg-emerald-950/20 text-emerald-500">
                  {(() => { const Icon = ICONS[q.icon] ?? Sparkles; return <Icon className="h-4 w-4" /> })()}
                </span>
              </div>

              {q.type === "single" && (
                <div className="space-y-2.5">
                  {q.options.map((opt) => {
                    const isSel = currentVal === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => pickSingle(q.id, opt.value)}
                        className={[
                          "flex w-full items-center justify-between gap-3 rounded-md border px-4 py-3.5 text-sm font-medium transition-all duration-150",
                          isSel
                            ? "border-emerald-600 bg-emerald-950/50 text-emerald-300"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900",
                        ].join(" ")}
                      >
                        <span className="font-mono text-[11px] text-zinc-500">{opt.en}</span>
                        <span dir="rtl">{opt.ar}</span>
                      </button>
                    )
                  })}
                </div>
              )}

              {q.type === "multi" && (
                <div className="space-y-2.5">
                  {q.options.map((opt) => {
                    const isSel = currentArr.includes(opt.value)
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={isSel}
                        onClick={() => toggleMulti(q.id, opt.value, q.maxSelect)}
                        className={[
                          "flex w-full items-center justify-between gap-3 rounded-md border px-4 py-3.5 text-sm font-medium transition-all duration-150",
                          isSel
                            ? "border-emerald-600 bg-emerald-950/50 text-emerald-300"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900",
                        ].join(" ")}
                      >
                        <span className="flex items-center gap-2">
                          <span className={[
                            "grid h-4 w-4 shrink-0 place-items-center rounded border",
                            isSel ? "border-emerald-500 bg-emerald-500 text-emerald-950" : "border-zinc-600",
                          ].join(" ")}>
                            {isSel && <Check className="h-3 w-3" />}
                          </span>
                          <span className="font-mono text-[11px] text-zinc-500">{opt.en}</span>
                        </span>
                        <span dir="rtl">{opt.ar}</span>
                      </button>
                    )
                  })}
                  <button
                    type="button"
                    onClick={next}
                    disabled={!canAdvanceMulti}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-3 font-mono text-sm font-semibold text-emerald-950 transition-all hover:-translate-y-px hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {qIndex === QUIZ_TOTAL - 1 ? "Build my plan" : "Continue"} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {q.type === "text" && (
                <div className="space-y-3">
                  <input
                    type={q.inputType}
                    inputMode={q.inputType === "email" ? "email" : "text"}
                    autoComplete={q.inputType === "email" ? "email" : "given-name"}
                    value={currentVal}
                    onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: [e.target.value] }))}
                    onKeyDown={(e) => { if (e.key === "Enter" && canAdvanceText) next() }}
                    placeholder={q.placeholder}
                    dir="ltr"
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={next}
                    disabled={!canAdvanceText}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-3 font-mono text-sm font-semibold text-emerald-950 transition-all hover:-translate-y-px hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {qIndex === QUIZ_TOTAL - 1 ? "Build my plan" : "Continue"} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── LOADING ────────────────────────────────────────────────────── */}
        {phase === "loading" && (
          <section className="animate-[os-panel-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both] space-y-5 pt-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500" />
            <div>
              <p className="text-lg font-semibold text-zinc-100" dir="rtl">نبني خطتك…</p>
              <p className="mt-1 font-mono text-sm text-emerald-400">{BUILD_STEPS[buildStep]?.en}</p>
              <p className="mt-0.5 text-xs text-zinc-500" dir="rtl">{BUILD_STEPS[buildStep]?.ar}</p>
            </div>
            <div className="mx-auto h-1 w-56 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full bg-emerald-500 transition-all duration-100" style={{ width: `${buildPct}%` }} />
            </div>
            <p className="font-mono text-[11px] text-zinc-700">{buildPct}%</p>
          </section>
        )}

        {/* ── PLAN / PAYWALL (Gumroad) ───────────────────────────────────── */}
        {phase === "plan" && promo && (
          <section className="animate-[os-panel-in_0.45s_cubic-bezier(0.16,1,0.3,1)_both] space-y-5">

            <div className="text-center">
              <h2 className="text-xl font-bold leading-tight text-zinc-100 sm:text-2xl" dir="rtl">
                {PRODUCT.headlineAr}
              </h2>
              {selectedTracks.length > 0 && (
                <p className="mt-2 font-mono text-[11px] text-emerald-400">
                  {person.readFactor}% matched · {tracksLabel}
                </p>
              )}
            </div>

            {/* Promo + real countdown */}
            <div className="rounded-xl border border-emerald-800 bg-emerald-950/20 p-4 text-center backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-600">promo applied · كود {name}</span>
              </div>
              <p className="font-mono text-xl font-bold tracking-widest text-emerald-300">{promo}</p>
              <div className={["mt-3 flex items-center justify-center gap-2 font-mono text-sm", expired ? "text-red-400" : "text-yellow-400"].join(" ")}>
                <Clock className="h-3.5 w-3.5" />
                {expired
                  ? <span dir="rtl">انتهى العرض · offer expired</span>
                  : <span>expires in <span className="font-bold tabular-nums">{countdown}</span></span>}
              </div>
            </div>

            {/* Recommended vault + price */}
            <div className="rounded-xl border border-emerald-700/60 bg-emerald-950/20 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600">your vault</p>
                  <p className="mt-1 text-lg font-bold text-zinc-100">{vaultName}</p>
                  <p className="mt-0.5 text-xs text-zinc-500" dir="rtl">{tracksLabel}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="flex items-baseline justify-end gap-1.5">
                    {price.original > price.price && (
                      <span className="font-mono text-[11px] text-zinc-600 line-through">${price.original}</span>
                    )}
                    <span className="font-mono text-3xl font-bold text-emerald-300">${price.price}</span>
                    <span className="font-mono text-xs text-zinc-500">/mo</span>
                  </div>
                  <p className="mt-0.5 font-mono text-[10px] text-emerald-600/80">{price.breakdown}</p>
                  <p className="font-mono text-[10px] text-zinc-700">per month · cancel anytime</p>
                </div>
              </div>
            </div>

            {/* Primary CTA → Gumroad overlay checkout */}
            {buyUrl ? (
              <a
                href={buyUrl}
                onClick={() => sendLead("gumroad", promo)}
                data-gumroad-overlay-checkout="true"
                className="gumroad-button flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-4 font-mono text-sm font-bold uppercase tracking-wide text-emerald-950 transition-all hover:-translate-y-px hover:bg-emerald-400"
              >
                GET MY VAULT <ArrowRight className="h-4 w-4" />
              </a>
            ) : waitlisted ? (
              <div className="rounded-xl border border-emerald-700/60 bg-emerald-950/25 p-5 text-center">
                <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                <p className="font-mono text-sm font-semibold text-emerald-300">You&apos;re on the list ✓</p>
                <p className="mt-1 text-xs text-zinc-400">We&apos;ll email you the moment {vaultName} goes live.</p>
                <p className="mt-1 text-[11px] text-zinc-500" dir="rtl">بنرسل لك أول ما تنزل.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-5">
                <p className="text-center font-mono text-[10px] uppercase tracking-widest text-emerald-600">coming soon</p>
                <p className="mt-1.5 text-center text-sm text-zinc-300">
                  {vaultName} drops shortly. Leave your email — we&apos;ll send it the second it&apos;s live.
                </p>
                <p className="mt-1 text-center text-[11px] text-zinc-500" dir="rtl">اترك إيميلك ونرسلها لك أول ما تنزل.</p>
                <div className="mt-3 flex gap-2">
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={wlEmail || email}
                    onChange={(e) => setWlEmail(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") joinWaitlist() }}
                    placeholder="you@email.com"
                    dir="ltr"
                    className="min-w-0 flex-1 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={joinWaitlist}
                    disabled={!EMAIL_RE.test((wlEmail || email).trim())}
                    className="shrink-0 rounded-md bg-emerald-500 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-emerald-950 transition-all hover:-translate-y-px hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Notify me
                  </button>
                </div>
              </div>
            )}

            {/* What you get */}
            <div className="space-y-2 rounded-xl border border-zinc-800/60 bg-zinc-900/30 px-4 py-4">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-zinc-600">what you get · ما تحصل عليه</p>
              {PRODUCT.benefits.map((b) => (
                <div key={b.en} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <div>
                    <p className="text-xs text-zinc-300" dir="rtl">{b.ar}</p>
                    <p className="font-mono text-[10px] text-zinc-600">{b.en}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Your guided 4-week path — each selected track is its own curriculum
                with week-to-week dependencies (start here → needs wk N). */}
            {selectedTracks.length > 0 && (
              <div className="space-y-4 rounded-xl border border-zinc-800/60 bg-zinc-900/30 px-4 py-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  your 4-week path · مسارك — ٤ أسابيع لكل حقيبة
                </p>
                {selectedTracks.map((tid) => {
                  const tr = trackById(tid)
                  return (
                    <div key={tid} className="space-y-2">
                      <div className="flex items-baseline justify-between gap-2 border-b border-zinc-800/50 pb-1.5">
                        <p className="text-xs font-semibold text-zinc-200">{tr.en}</p>
                        <p className="font-mono text-[10px] text-zinc-500" dir="rtl">{tr.ar}</p>
                      </div>
                      <ol className="space-y-1.5">
                        {tr.weeks.map((w) => (
                          <li key={w.n} className="flex items-start gap-2.5">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-emerald-800/70 bg-emerald-950/30 font-mono text-[10px] font-bold tabular-nums text-emerald-400">
                              {w.n}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline justify-between gap-2">
                                <p className="text-xs text-zinc-300" dir="rtl">{w.ar}</p>
                                <p className="shrink-0 font-mono text-[9px] text-zinc-600">{w.effort}</p>
                              </div>
                              <div className="flex items-baseline justify-between gap-2">
                                <p className="font-mono text-[10px] text-zinc-600">{w.en}</p>
                                <p className="shrink-0 font-mono text-[9px] text-emerald-700/80">
                                  {w.dependsOn.length === 0 ? "start here" : `needs wk ${w.dependsOn.join(", ")}`}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )
                })}
              </div>
            )}

            <p className="text-center font-mono text-[10px] text-zinc-700" dir="rtl">
              وصول فوري · دفع آمن عبر Gumroad · instant access
            </p>

            {/* ── UPSELL: other vaults ───────────────────────────────────── */}
            {showUpsell && (
              <div className="space-y-3 border-t border-zinc-800/60 pt-5">
                <p className="text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  expand your vault · وسّع خزينتك
                </p>

                {/* All-access upgrade — always show unless user already matched all tracks */}
                {allAccessUrl && (
                  <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/10 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600/70">
                          best deal · أفضل صفقة
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-zinc-100">All-Access Vault</p>
                        <p className="text-xs text-zinc-500" dir="rtl">
                          كل الـ {TRACK_IDS.length} خزائن — سعر واحد
                        </p>
                        <p className="font-mono text-[10px] text-zinc-600">
                          All {TRACK_IDS.length} vaults · one price
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-[11px] text-zinc-600 line-through">
                          ${TRACK_IDS.length * 8}
                        </p>
                        <p className="font-mono text-xl font-bold text-emerald-300">
                          $25<span className="text-xs font-normal text-zinc-500">/mo</span>
                        </p>
                      </div>
                    </div>
                    <a
                      href={allAccessUrl}
                      onClick={() => sendLead("gumroad-all", promo)}
                      data-gumroad-overlay-checkout="true"
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-emerald-700 bg-emerald-950/30 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-emerald-300 transition-all hover:bg-emerald-900/40 hover:text-emerald-200"
                    >
                      Upgrade to All-Access <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}

                {/* Individual tracks not in the recommendation — show up to 3 */}
                {otherTracks.slice(0, 3).map((track) => {
                  const trackUrl = gumroadUrl([track.id], person.osVariant)
                  return (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/20 px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-zinc-300" dir="rtl">
                          {track.ar}
                        </p>
                        <p className="font-mono text-[10px] text-zinc-600 truncate">
                          {track.tagEn}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-xs font-bold text-zinc-400">$8<span className="text-[10px] font-normal text-zinc-600">/mo</span></p>
                      </div>
                      {trackUrl ? (
                        <a
                          href={trackUrl}
                          onClick={() => sendLead(`gumroad-${track.id}`, promo)}
                          data-gumroad-overlay-checkout="true"
                          className="shrink-0 rounded border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200"
                        >
                          Add
                        </a>
                      ) : (
                        <span className="shrink-0 rounded border border-zinc-800 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-zinc-700">
                          Soon
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <p className="text-center font-mono text-[11px] text-emerald-600/80" dir="rtl">{PRODUCT.socialProofAr}</p>

          </section>
        )}

      </div>
    </main>
  )
}
