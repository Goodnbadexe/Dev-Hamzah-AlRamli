'use client'

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Clock, Zap, TrendingUp, BookOpen, Wrench } from "lucide-react"

type QuizStep = 0 | 1 | 2 | 3

interface QuizAnswers {
  goal: string
  level: string
  priority: string
}

const GOALS = [
  { value: "agent",      ar: "AI Agent",              en: "AI Agent",             icon: Zap         },
  { value: "automation", ar: "أتمتة (Automation)",    en: "Automation",           icon: Wrench      },
  { value: "tools",      ar: "أدوات شخصية",           en: "Personal Tools",       icon: BookOpen    },
  { value: "business",   ar: "مشروع جانبي",           en: "Side Business",        icon: TrendingUp  },
]

const LEVELS = [
  { value: "beginner",     ar: "مبتدئ",       en: "Beginner"     },
  { value: "intermediate", ar: "متوسط",       en: "Intermediate" },
  { value: "pro",          ar: "محترف",       en: "Pro"          },
]

const PRIORITIES = [
  { value: "time",    ar: "توفير الوقت",      en: "Saving Time"    },
  { value: "money",   ar: "كسب المال",        en: "Making Money"   },
  { value: "learn",   ar: "التعلم",           en: "Learning"       },
  { value: "speed",   ar: "البناء السريع",    en: "Building Fast"  },
]

const PLANS = [
  {
    id:       "trial",
    ar:       "تجربة أسبوع",
    en:       "1-WEEK TRIAL",
    badge:    null,
    original: 17,
    price:    9,
    per:      "1.28 SAR/day",
    perAr:    "1.28 ر.س / يوم",
    weeks:    1,
    accent:   "zinc",
  },
  {
    id:       "month",
    ar:       "خطة 4 أسابيع",
    en:       "4-WEEK PLAN",
    badge:    "SAVE 43%",
    original: 51,
    price:    29,
    per:      "1.03 SAR/day",
    perAr:    "1.03 ر.س / يوم",
    weeks:    4,
    accent:   "emerald",
  },
  {
    id:       "quarter",
    ar:       "خطة 12 أسبوع",
    en:       "12-WEEK PLAN",
    badge:    "SAVE 57%",
    original: 160,
    price:    69,
    per:      "0.82 SAR/day",
    perAr:    "0.82 ر.س / يوم",
    weeks:    12,
    accent:   "emerald",
  },
]

const QUIZ_DURATION_MS = 10 * 60 * 1000

function buildPromoCode(answers: QuizAnswers): string {
  const slug = answers.goal === "agent"
    ? "ai"
    : answers.goal === "automation"
    ? "auto"
    : answers.goal === "tools"
    ? "tools"
    : "biz"

  const now = new Date()
  const month = now.toLocaleString("en-US", { month: "short" }).toLowerCase()
  const day = now.getDate()

  return `hamzah_${slug}_${month}${day}`
}

function useCountdown(expiresAt: number | null) {
  const [remaining, setRemaining] = useState<number>(QUIZ_DURATION_MS)

  useEffect(() => {
    if (expiresAt === null) return

    const tick = () => {
      const diff = expiresAt - Date.now()
      setRemaining(Math.max(0, diff))
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [expiresAt])

  const mins = Math.floor(remaining / 60000)
  const secs = Math.floor((remaining % 60000) / 1000)
  const expired = remaining === 0

  return {
    display: `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`,
    expired,
    remaining,
  }
}

function QuizOption({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-right rounded-md border px-4 py-3.5 transition-all duration-150 text-sm font-medium",
        selected
          ? "border-emerald-600 bg-emerald-950/50 text-emerald-300"
          : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function ProgressBar({ step }: { step: number }) {
  const pct = Math.round(((step) / 3) * 100)
  return (
    <div className="w-full h-0.5 bg-zinc-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-emerald-500 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export default function SubscribePage() {
  const [step, setStep]           = useState<QuizStep>(0)
  const [answers, setAnswers]     = useState<Partial<QuizAnswers>>({})
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<number | null>(null)
  const topRef                    = useRef<HTMLDivElement>(null)

  const { display: countdown, expired } = useCountdown(expiresAt)

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function selectGoal(v: string) {
    setAnswers(prev => ({ ...prev, goal: v }))
  }

  function selectLevel(v: string) {
    setAnswers(prev => ({ ...prev, level: v }))
  }

  function selectPriority(v: string) {
    setAnswers(prev => ({ ...prev, priority: v }))
  }

  function advance() {
    if (step === 2) {
      const full = answers as QuizAnswers
      const code = buildPromoCode(full)
      setPromoCode(code)
      setExpiresAt(Date.now() + QUIZ_DURATION_MS)
      setStep(3)
    } else {
      setStep(prev => (prev + 1) as QuizStep)
    }
    scrollTop()
  }

  const canAdvance =
    (step === 0 && !!answers.goal) ||
    (step === 1 && !!answers.level) ||
    (step === 2 && !!answers.priority)

  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 60%)",
        }}
        aria-hidden
      />

      <div ref={topRef} className="relative z-10 mx-auto max-w-lg px-4 pt-12 sm:pt-16">

        <div className="mb-8 text-center">
          <span className="inline-block font-mono text-[10px] uppercase tracking-widest text-emerald-700 border border-emerald-900 rounded px-2 py-0.5 mb-4">
            repo vault
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 leading-tight mb-1" dir="rtl">
            خزينة المستودعات السرية
          </h1>
          <p className="text-zinc-500 text-sm font-mono leading-snug">
            Curated underground GitHub repos — updated weekly.
          </p>
        </div>

        {step < 3 && (
          <div className="mb-6 space-y-2">
            <ProgressBar step={step} />
            <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest text-center">
              {step + 1} / 3
            </p>
          </div>
        )}

        {step === 0 && (
          <section className="animate-[os-panel-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
            <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm mb-4">
              <p className="text-right text-base font-semibold text-zinc-200 mb-1" dir="rtl">
                ماذا تريد أن تبني؟
              </p>
              <p className="text-right text-xs text-zinc-500 mb-4" dir="rtl">
                What are you trying to build?
              </p>
              <div className="space-y-2.5">
                {GOALS.map(({ value, ar, en, icon: Icon }) => (
                  <QuizOption
                    key={value}
                    selected={answers.goal === value}
                    onClick={() => selectGoal(value)}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-zinc-500">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-mono text-[11px]">{en}</span>
                      </span>
                      <span className="text-right">{ar}</span>
                    </span>
                  </QuizOption>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={advance}
              disabled={!canAdvance}
              className="w-full flex items-center justify-center gap-2 rounded-md border border-emerald-800 bg-emerald-950/40 px-4 py-3 font-mono text-sm text-emerald-400 transition-all hover:bg-emerald-950/70 hover:border-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              التالي <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        )}

        {step === 1 && (
          <section className="animate-[os-panel-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
            <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm mb-4">
              <p className="text-right text-base font-semibold text-zinc-200 mb-1" dir="rtl">
                ما هو مستواك؟
              </p>
              <p className="text-right text-xs text-zinc-500 mb-4" dir="rtl">
                What's your level?
              </p>
              <div className="space-y-2.5">
                {LEVELS.map(({ value, ar, en }) => (
                  <QuizOption
                    key={value}
                    selected={answers.level === value}
                    onClick={() => selectLevel(value)}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] text-zinc-500">{en}</span>
                      <span>{ar}</span>
                    </span>
                  </QuizOption>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={advance}
              disabled={!canAdvance}
              className="w-full flex items-center justify-center gap-2 rounded-md border border-emerald-800 bg-emerald-950/40 px-4 py-3 font-mono text-sm text-emerald-400 transition-all hover:bg-emerald-950/70 hover:border-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              التالي <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="animate-[os-panel-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
            <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm mb-4">
              <p className="text-right text-base font-semibold text-zinc-200 mb-1" dir="rtl">
                ماذا يهمك أكثر؟
              </p>
              <p className="text-right text-xs text-zinc-500 mb-4" dir="rtl">
                What matters most to you?
              </p>
              <div className="space-y-2.5">
                {PRIORITIES.map(({ value, ar, en }) => (
                  <QuizOption
                    key={value}
                    selected={answers.priority === value}
                    onClick={() => selectPriority(value)}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] text-zinc-500">{en}</span>
                      <span>{ar}</span>
                    </span>
                  </QuizOption>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={advance}
              disabled={!canAdvance}
              className="w-full flex items-center justify-center gap-2 rounded-md border border-emerald-800 bg-emerald-950/40 px-4 py-3 font-mono text-sm text-emerald-400 transition-all hover:bg-emerald-950/70 hover:border-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              أظهر لي الكود <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        )}

        {step === 3 && promoCode && (
          <section className="animate-[os-panel-in_0.4s_cubic-bezier(0.16,1,0.3,1)_both] space-y-5">

            <div className="rounded-md border border-emerald-800 bg-emerald-950/20 p-5 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-600">
                  promo code applied
                </span>
              </div>
              <p className="font-mono text-xl font-bold text-emerald-300 tracking-widest mb-1">
                {promoCode}
              </p>
              <p className="text-xs text-zinc-500 font-mono" dir="rtl">
                تم تطبيق كود الخصم تلقائياً عند الدفع
              </p>

              <div
                className={[
                  "mt-4 flex items-center justify-center gap-2 font-mono text-sm",
                  expired ? "text-red-400" : "text-yellow-400",
                ].join(" ")}
              >
                <Clock className="w-3.5 h-3.5 shrink-0" />
                {expired ? (
                  <span>انتهى الكود · Code expired</span>
                ) : (
                  <span>
                    ينتهي خلال <span className="font-bold tabular-nums">{countdown}</span>
                    <span className="text-zinc-600 ml-1">· expires in</span>
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                  اختر خطتك · choose your plan
                </span>
                <span className="h-px flex-1 bg-zinc-900" />
              </div>

              {PLANS.map((plan) => {
                const isHighlighted = plan.accent === "emerald"
                return (
                  <div
                    key={plan.id}
                    className={[
                      "rounded-md border p-4 transition-all",
                      isHighlighted
                        ? "border-emerald-800 bg-emerald-950/15"
                        : "border-zinc-800 bg-zinc-900/40",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex flex-col items-start gap-1">
                        {plan.badge && (
                          <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-500 border border-emerald-900 rounded px-1.5 py-0.5">
                            {plan.badge}
                          </span>
                        )}
                        <span className="font-mono text-xs font-semibold text-zinc-300 uppercase tracking-wide">
                          {plan.en}
                        </span>
                        <span className="text-xs text-zinc-500" dir="rtl">
                          {plan.ar}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-baseline gap-1.5 justify-end">
                          <span className="font-mono text-[11px] text-zinc-600 line-through">
                            {plan.original} ر.س
                          </span>
                          <span
                            className={[
                              "font-mono text-2xl font-bold",
                              isHighlighted ? "text-emerald-300" : "text-zinc-200",
                            ].join(" ")}
                          >
                            {plan.price}
                          </span>
                          <span className="font-mono text-xs text-zinc-500">ر.س</span>
                        </div>
                        <p className="font-mono text-[10px] text-zinc-600 mt-0.5 text-right">
                          {plan.perAr}
                        </p>
                        <p className="font-mono text-[9px] text-zinc-700 text-right">
                          {plan.per}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/subscribe/checkout?plan=${plan.id}&promo=${promoCode}`}
                      className={[
                        "flex items-center justify-between w-full rounded border px-3 py-2.5 font-mono text-xs transition-all",
                        isHighlighted
                          ? "border-emerald-800 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-950/70 hover:border-emerald-700"
                          : "border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200",
                      ].join(" ")}
                    >
                      <span dir="rtl">ابدأ الآن · Start Now</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </Link>
                  </div>
                )
              })}
            </div>

            <div className="rounded-md border border-zinc-800/50 bg-zinc-900/30 px-4 py-3 space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-2">
                what you get · ما تحصل عليه
              </p>
              {[
                { ar: "مستودعات GitHub سرية أسبوعية",  en: "Weekly underground GitHub repos"        },
                { ar: "مصنّفة حسب مجالك وأهدافك",      en: "Curated to your niche and goals"        },
                { ar: "نشرة إيميل خاصة كل أسبوع",      en: "Private email digest every week"        },
                { ar: "وصول فوري بعد الاشتراك",         en: "Instant access after subscribing"      },
              ].map(({ ar, en }) => (
                <div key={en} className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-700 shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-300" dir="rtl">{ar}</p>
                    <p className="font-mono text-[10px] text-zinc-600">{en}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center font-mono text-[10px] text-zinc-700 pt-2">
              no auto-renewal · يمكنك الإلغاء في أي وقت
            </p>
          </section>
        )}

      </div>
    </main>
  )
}
