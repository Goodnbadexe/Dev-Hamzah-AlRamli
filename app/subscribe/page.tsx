'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Briefcase, Check, CheckCircle2,
  Clock, Compass, Eye, Gauge, History, Hourglass, Layers, Loader2, Lock, Mail, Rocket,
  Sparkles, Target, TrendingUp, User, Wrench, Zap, type LucideIcon,
} from "lucide-react"
import { QUIZ, QUIZ_TOTAL } from "@/lib/subscribe/quiz"
import {
  BUILD_STEPS, PLANS, PRODUCT, PROMO_WINDOW_MS, buildPromoCode, planById, type Plan,
} from "@/lib/subscribe/config"
import { MoyasarPayment } from "./MoyasarPayment"

const ICONS: Record<string, LucideIcon> = {
  user: User, zap: Zap, wrench: Wrench, alert: AlertTriangle, layers: Layers, clock: Clock,
  eye: Eye, target: Target, trending: TrendingUp, sparkles: Sparkles, gauge: Gauge,
  compass: Compass, briefcase: Briefcase, book: BookOpen, hourglass: Hourglass, history: History,
  lock: Lock, rocket: Rocket, id: BadgeCheck, mail: Mail,
}

const OFFER_KEY = "gnb_vault_offer_expires"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Phase = "intro" | "quiz" | "loading" | "plan" | "pay" | "success" | "payfail"

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
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [promo, setPromo] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<number | null>(null)
  const [selected, setSelected] = useState<Plan["id"]>("month")
  const [payResult, setPayResult] = useState<{ status: string; id: string | null; message: string | null } | null>(null)
  const topRef = useRef<HTMLDivElement>(null)

  const { display: countdown, expired } = useCountdown(expiresAt)
  const name = answers.name ?? ""
  const email = answers.email ?? ""

  const scrollTop = useCallback(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  // Moyasar redirects the browser back here after 3-D Secure with
  // ?id=&status=&message= — read it and show the result, then clean the URL.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const status = sp.get("status")
    if (!status) return
    setPayResult({ status, id: sp.get("id"), message: sp.get("message") })
    setPhase(status === "paid" ? "success" : "payfail")
    window.history.replaceState({}, "", "/subscribe")
  }, [])

  // Fire-and-forget lead capture (never blocks the funnel).
  const sendLead = useCallback((plan?: string, code?: string | null) => {
    if (!answers.name || !EMAIL_RE.test(answers.email ?? "")) return
    const payload = {
      name: answers.name,
      email: answers.email,
      plan,
      promo: code ?? promo ?? undefined,
      answers,
    }
    fetch("/api/subscribe/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {})
  }, [answers, promo])

  // Persistent (honest) 10-min offer window — reuse a live one, don't reset it.
  const startBuild = useCallback(() => {
    const code = buildPromoCode(answers.name ?? "")
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
  }, [answers, sendLead, scrollTop])

  const q = QUIZ[qIndex]
  const current = answers[q?.id]
  const canAdvanceText =
    q?.type === "text" && (q.field === "email" ? EMAIL_RE.test(current ?? "") : (current ?? "").trim().length > 0)

  const next = useCallback(() => {
    if (qIndex < QUIZ_TOTAL - 1) {
      setQIndex((i) => i + 1)
      scrollTop()
    } else {
      startBuild()
    }
  }, [qIndex, startBuild, scrollTop])

  const pickSingle = useCallback((qid: string, value: string) => {
    setAnswers((a) => ({ ...a, [qid]: value }))
    window.setTimeout(() => next(), 240)
  }, [next])

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

  const handleGetPlan = useCallback(() => {
    sendLead(selected, promo) // capture the lead, then pay in-page (no exit)
    setPhase("pay")
    scrollTop()
  }, [selected, promo, sendLead, scrollTop])

  const progressPct = useMemo(() => Math.round((qIndex / QUIZ_TOTAL) * 100), [qIndex])

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
            Curated AI tools & underground repos — a weekly toolkit, built around you.
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

              {q.type === "single" ? (
                <div className="space-y-2.5">
                  {q.options.map((opt) => {
                    const isSel = current === opt.value
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
              ) : (
                <div className="space-y-3">
                  <input
                    type={q.inputType}
                    inputMode={q.inputType === "email" ? "email" : "text"}
                    autoComplete={q.inputType === "email" ? "email" : "given-name"}
                    value={current ?? ""}
                    onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
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

        {/* ── PLAN / PAYWALL ─────────────────────────────────────────────── */}
        {phase === "plan" && promo && (
          <section className="animate-[os-panel-in_0.45s_cubic-bezier(0.16,1,0.3,1)_both] space-y-5">

            <div className="text-center">
              <h2 className="text-xl font-bold leading-tight text-zinc-100 sm:text-2xl" dir="rtl">
                {PRODUCT.headlineAr}
              </h2>
              <p className="mt-1.5 font-mono text-xs text-zinc-500">
                {PRODUCT.headlineEn.replace("personalized AI plan", "")}<span className="text-emerald-400">personalized AI plan</span>
              </p>
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

            {/* Plans (radio-select) */}
            <div className="space-y-3">
              {PLANS.map((plan) => {
                const isSel = selected === plan.id
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelected(plan.id)}
                    className={[
                      "w-full rounded-xl border p-4 text-left transition-all",
                      isSel ? "border-emerald-500 bg-emerald-950/25 ring-1 ring-emerald-500/40" : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className={["mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border", isSel ? "border-emerald-500 bg-emerald-500 text-emerald-950" : "border-zinc-600"].join(" ")}>
                          {isSel && <Check className="h-3 w-3" />}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-xs font-semibold uppercase tracking-wide text-zinc-200">{plan.en}</span>
                            {plan.tag && (
                              <span className={["rounded px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest", plan.best ? "bg-yellow-500/15 text-yellow-400 border border-yellow-700/40" : "bg-emerald-500/15 text-emerald-400 border border-emerald-700/40"].join(" ")}>
                                {plan.tag}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-zinc-500" dir="rtl">{plan.ar}</p>
                          {plan.badge && <p className="mt-1 font-mono text-[10px] text-emerald-500">{plan.badge}</p>}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="flex items-baseline justify-end gap-1.5">
                          <span className="font-mono text-[11px] text-zinc-600 line-through">{plan.original}</span>
                          <span className={["font-mono text-2xl font-bold", isSel ? "text-emerald-300" : "text-zinc-200"].join(" ")}>{plan.price}</span>
                          <span className="font-mono text-xs text-zinc-500">SAR</span>
                        </div>
                        <p className="mt-0.5 font-mono text-[10px] text-zinc-600">{plan.perDay}</p>
                        <p className="font-mono text-[9px] text-zinc-700">{plan.usd}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Primary CTA */}
            <button
              type="button"
              onClick={handleGetPlan}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-4 font-mono text-sm font-bold uppercase tracking-wide text-emerald-950 transition-all hover:-translate-y-px hover:bg-emerald-400"
            >
              GET MY PLAN <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center font-mono text-[11px] text-emerald-600/80" dir="rtl">{PRODUCT.socialProofAr}</p>

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

            <p className="text-center font-mono text-[10px] text-zinc-700" dir="rtl">
              إلغاء في أي وقت · بدون تجديد تلقائي · cancel anytime
            </p>
          </section>
        )}

        {/* ── PAY (in-page Moyasar card form — no exit before paying) ─────── */}
        {phase === "pay" && promo && (() => {
          const sel = planById(selected)
          return (
            <section className="animate-[os-panel-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both] space-y-4">
              <button
                type="button"
                onClick={() => { setPhase("plan"); scrollTop() }}
                className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-zinc-600 hover:text-zinc-400"
              >
                <ArrowLeft className="h-3 w-3" /> change plan
              </button>

              <div className="rounded-xl border border-emerald-800 bg-emerald-950/15 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-wide text-zinc-200">{sel.en}</p>
                    <p className="text-xs text-zinc-500" dir="rtl">{sel.ar}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-2xl font-bold text-emerald-300">{sel.price}</span>
                    <span className="font-mono text-xs text-zinc-500"> SAR</span>
                    <p className="font-mono text-[10px] text-zinc-600">{sel.perDay}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 border-t border-emerald-900/40 pt-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="font-mono text-[10px] text-emerald-600">promo <span className="text-emerald-400">{promo}</span> applied</span>
                </div>
              </div>

              <MoyasarPayment
                amountSar={sel.price}
                description={`Toolkit Vault · ${sel.en} · ${promo}`}
                metadata={{ plan: sel.id, promo: promo ?? "", name, email }}
              />

              <p className="text-center font-mono text-[10px] text-zinc-700" dir="rtl">
                دفع آمن · إلغاء في أي وقت · secure payment
              </p>
            </section>
          )
        })()}

        {/* ── SUCCESS (Moyasar returned paid) ─────────────────────────────── */}
        {phase === "success" && (
          <section className="animate-[os-panel-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both] space-y-4 pt-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
            <h2 className="text-xl font-bold text-zinc-100" dir="rtl">تم الدفع! أهلاً فيك</h2>
            <p className="text-sm text-zinc-400" dir="rtl">بنرسل لك أول حقيبة أدوات على إيميلك قريب.</p>
            <p className="font-mono text-xs text-zinc-600">
              Payment confirmed — your first toolkit is on its way.
              {payResult?.id ? ` (ref ${payResult.id.slice(0, 12)})` : ""}
            </p>
          </section>
        )}

        {/* ── PAYMENT FAILED ──────────────────────────────────────────────── */}
        {phase === "payfail" && (
          <section className="animate-[os-panel-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both] space-y-4 pt-8 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-red-400" />
            <h2 className="text-xl font-bold text-zinc-100" dir="rtl">ما تم الدفع</h2>
            <p className="text-sm text-zinc-400" dir="rtl">صار خطأ في الدفع. جرّب مرة ثانية.</p>
            {payResult?.message && <p className="font-mono text-[11px] text-zinc-600">{payResult.message}</p>}
            <button
              type="button"
              onClick={() => { setPhase("plan"); scrollTop() }}
              className="mx-auto flex items-center gap-2 rounded-md border border-zinc-700 px-4 py-2.5 font-mono text-xs text-zinc-300 transition-colors hover:border-zinc-500"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> try again
            </button>
          </section>
        )}

      </div>
    </main>
  )
}
