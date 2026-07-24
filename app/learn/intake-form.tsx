"use client"

// === METADATA ===
// Purpose: Learning Lab multi-step intake wizard — Phase 2 PROTOTYPE. Client-side
//          only: validates, runs the assessment-preview rules, and renders the
//          preliminary assessment. NO network calls — nothing leaves the browser.
//          Field spec: docs/learning-lab/INTAKE-SCHEMA.md v2 (subset for prototype).
// Author: @Goodnbad.exe
// Inputs: preselectedPackage (from package cards)
// Outputs: on-screen preliminary assessment preview
// Tests: engine in tests/learn-assessment.test.ts; visual pass in docs/learning-lab
// Complexity: O(1) per interaction
// === END METADATA ===

import { useEffect, useMemo, useState } from "react"
import { OSWindow } from "@/components/os"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import {
  CONSENTS,
  EXPERIENCE_LEVELS,
  PACKAGES,
  SELF_CHECKS,
  TRACKS,
  type LevelId,
  type PackageId,
  type TrackId,
} from "@/lib/learn/intake-config"
import { buildAssessmentPreview, type AssessmentPreview } from "@/lib/learn/assessment-preview"

interface FormState {
  pkg: PackageId | null
  track: TrackId | null
  fullName: string
  email: string
  language: "en" | "ar" | "bilingual"
  statedLevel: LevelId | null
  topic: string
  desiredOutcome: string
  weeklyHours: number
  targetDate: string
  briefText: string
  sessionGoal: string
  answers: Record<string, number>
  consents: Record<string, boolean>
  hp_website: string
}

const INITIAL: FormState = {
  pkg: null,
  track: null,
  fullName: "",
  email: "",
  language: "en",
  statedLevel: null,
  topic: "",
  desiredOutcome: "",
  weeklyHours: 5,
  targetDate: "",
  briefText: "",
  sessionGoal: "",
  answers: {},
  consents: {},
  hp_website: "",
}

const STEPS = ["package", "you", "goal", "diagnostic", "consent", "review"] as const
type Step = (typeof STEPS)[number]

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500 mb-1.5 block">{label}</span>
      {children}
      {error && <span className="text-xs text-red-400 mt-1 block">{error}</span>}
    </label>
  )
}

const inputCls =
  "w-full rounded-sm border border-zinc-800 bg-zinc-950/70 px-3 py-2.5 text-sm text-zinc-200 " +
  "placeholder:text-zinc-600 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-800/50 transition-colors"

function ChoiceRow<T extends string>({
  options,
  value,
  onPick,
}: {
  options: { id: T; label: string }[]
  value: T | null
  onPick: (id: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onPick(o.id)}
          className={cn(
            "rounded-sm border px-3 py-2 text-sm transition-colors",
            value === o.id
              ? "border-emerald-700 bg-emerald-950/30 text-emerald-300"
              : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function IntakeForm({ preselectedPackage }: { preselectedPackage: string | null }) {
  const { t, isAr } = useLanguage()
  const [step, setStep] = useState<Step>("package")
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [result, setResult] = useState<AssessmentPreview | null>(null)

  useEffect(() => {
    if (preselectedPackage && PACKAGES.some((p) => p.id === preselectedPackage)) {
      setForm((f) => ({ ...f, pkg: preselectedPackage as PackageId }))
      setStep((s) => (s === "package" ? "you" : s))
    }
  }, [preselectedPackage])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const selfChecks = form.track ? (SELF_CHECKS[form.track] ?? []) : []
  const activeConsents = CONSENTS.filter(
    (c) =>
      c.requiredFor === "all" ||
      (c.requiredFor === "private_mentorship" && form.pkg === "private_mentorship") ||
      (c.requiredFor === "cybersecurity" && form.track === "cybersecurity")
  )

  const stepIndex = STEPS.indexOf(step)

  const validate = (s: Step): boolean => {
    const e: Record<string, string> = {}
    const need = (cond: boolean, key: string, ar: string, en: string) => {
      if (cond) e[key] = t(ar, en)
    }
    if (s === "package") {
      need(!form.pkg, "pkg", "اختر باقة", "Pick a package")
      need(!form.track, "track", "اختر مجالًا", "Pick a track")
    }
    if (s === "you") {
      need(form.fullName.trim().length < 2, "fullName", "الاسم مطلوب", "Name is required")
      need(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email), "email", "بريد غير صالح", "Valid email required")
    }
    if (s === "goal") {
      need(form.topic.trim().length < 3, "topic", "الموضوع مطلوب", "Topic is required")
      need(
        form.desiredOutcome.trim().length < 10,
        "desiredOutcome",
        "صف النتيجة بجملة على الأقل",
        "Describe the outcome in at least a sentence"
      )
      need(!form.statedLevel, "statedLevel", "اختر مستواك", "Pick your level")
      if (form.targetDate) {
        const d = new Date(form.targetDate + "T00:00:00")
        need(
          Number.isNaN(d.getTime()) || d.getTime() < Date.now() + 86_400_000,
          "targetDate",
          "التاريخ يجب أن يكون مستقبلًا",
          "Date must be at least tomorrow"
        )
      }
    }
    if (s === "diagnostic") {
      need(
        selfChecks.some((q) => form.answers[q.id] === undefined),
        "answers",
        "أجب عن كل الأسئلة",
        "Answer every question"
      )
      if (form.pkg === "academic_sprint")
        need(
          form.briefText.trim().length < 30,
          "briefText",
          "الصق نص التكليف (٣٠ حرفًا على الأقل)",
          "Paste your brief (at least 30 characters)"
        )
      if (form.pkg === "private_mentorship")
        need(
          form.sessionGoal.trim().length < 10,
          "sessionGoal",
          "حدد هدف الجلسة",
          "State the session goal"
        )
    }
    if (s === "consent") {
      need(
        activeConsents.some((c) => !form.consents[c.key]),
        "consents",
        "كل الموافقات مطلوبة للمتابعة",
        "All consents are required to proceed"
      )
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate(step)) return
    const nextStep = STEPS[stepIndex + 1]
    if (nextStep) setStep(nextStep)
  }
  const back = () => {
    const prev = STEPS[stepIndex - 1]
    if (prev) setStep(prev)
  }

  const submit = () => {
    if (form.hp_website !== "") return // honeypot — silent no-op
    if (!validate("consent") || !form.track || !form.statedLevel) return
    setResult(
      buildAssessmentPreview({
        track: form.track,
        answers: selfChecks.map((q) => form.answers[q.id] ?? 0),
        statedLevel: form.statedLevel,
        weeklyHours: form.weeklyHours,
        topic: form.topic,
        desiredOutcome: form.desiredOutcome,
        targetDate: form.targetDate || undefined,
      })
    )
  }

  const levelLabel = useMemo(
    () => (lvl: LevelId) => {
      const found = EXPERIENCE_LEVELS.find((l) => l.id === lvl)
      return found ? t(found.label.ar, found.label.en) : lvl
    },
    [t]
  )

  if (result) {
    return (
      <OSWindow label="assessment.out" title={t("التقييم الأولي", "preliminary assessment")} status="active">
        <div className="space-y-3 text-sm leading-relaxed text-zinc-300">
          <p>
            {t("هدفك: ", "Your goal: ")}
            <span className="text-emerald-400">{form.desiredOutcome.trim()}</span>
            {t(" — في موضوع ", " — in ")}
            <span className="text-emerald-400">{form.topic.trim()}</span>.
          </p>
          <p>
            {t("تشير إجاباتك إلى نقطة بداية عند مستوى ", "Your answers suggest starting at ")}
            <span className="text-emerald-400 font-semibold">{levelLabel(result.estimatedLevel)}</span>
            {result.inconsistent &&
              t(
                " (يختلف عن تقييمك الذاتي — سيُراجع يدويًا)",
                " (differs from your self-rating — this gets a manual review)"
              )}
            .
          </p>
          <div>
            <p className="mb-1">{t("الفجوات الأكثر تأثيرًا:", "The gaps most likely to slow you down:")}</p>
            <ul className="space-y-1">
              {result.gaps.map((g, i) => (
                <li key={i} className="flex gap-2 text-zinc-400">
                  <span className="text-emerald-700 font-mono text-xs mt-0.5">▸</span>
                  {t(g.ar, g.en)}
                </li>
              ))}
            </ul>
          </div>
          <p>
            {t("بمعدل ", "At ")}
            <span className="text-emerald-400">{form.weeklyHours}</span>
            {t(" ساعة أسبوعيًا، تقع المدة عادة ضمن نطاق ", " h/week this typically lands in the ")}
            <span className="text-emerald-400 font-semibold">{t(result.durationBand.ar, result.durationBand.en)}</span>
            {result.targetFits !== undefined &&
              (result.targetFits
                ? t(" — هدفك الزمني واقعي.", " — your target date is realistic.")
                : t(" — هدفك الزمني ضيق؛ سنؤكد النطاق في العرض.", " — your target is tight; we'd confirm scope at quote."))}
          </p>
          <p className="text-zinc-500 text-xs border-t border-zinc-800 pt-3">
            {t(
              "الخطة الكاملة خطوة-بخطوة تُجهَّز بعد اعتماد النطاق وتأكيد الدفع.",
              "The full step-by-step plan is prepared after scope approval and verified payment."
            )}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-500/80">
            {t(
              "نموذج أولي — لم يُرسل طلبك بعد: منصة الاستقبال قيد البناء",
              "prototype — your request was NOT transmitted: the intake backend is still being built"
            )}
          </p>
          <button
            type="button"
            onClick={() => {
              setResult(null)
              setForm(INITIAL)
              setStep("package")
            }}
            className="font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-sm border border-zinc-700 text-zinc-400 hover:border-zinc-500 transition-colors"
          >
            {t("ابدأ من جديد", "Start over")}
          </button>
        </div>
      </OSWindow>
    )
  }

  return (
    <OSWindow label="intake.form" title={t("تشخيص مجاني", "free diagnostic")} status="active">
      {/* Progress rail */}
      <div className="flex items-center gap-1 mb-6" aria-hidden>
        {STEPS.map((s, i) => (
          <span
            key={s}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i < stepIndex ? "bg-emerald-700" : i === stepIndex ? "bg-emerald-500" : "bg-zinc-800"
            )}
          />
        ))}
      </div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-5">
        {t("خطوة", "step")} {stepIndex + 1}/{STEPS.length}
      </p>

      <div className="space-y-5">
        {step === "package" && (
          <>
            <Field label={t("الباقة", "package")} error={errors.pkg}>
              <ChoiceRow
                options={PACKAGES.map((p) => ({ id: p.id, label: t(p.name.ar, p.name.en) }))}
                value={form.pkg}
                onPick={(id) => set("pkg", id)}
              />
            </Field>
            <Field label={t("المجال", "track")} error={errors.track}>
              <ChoiceRow
                options={TRACKS.map((tr) => ({ id: tr.id, label: t(tr.label.ar, tr.label.en) }))}
                value={form.track}
                onPick={(id) => set("track", id)}
              />
            </Field>
          </>
        )}

        {step === "you" && (
          <>
            <Field label={t("الاسم الكامل", "full name")} error={errors.fullName}>
              <input
                className={inputCls}
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                maxLength={120}
                autoComplete="name"
              />
            </Field>
            <Field label={t("البريد الإلكتروني", "email")} error={errors.email}>
              <input
                className={inputCls}
                type="email"
                dir="ltr"
                value={form.email}
                onChange={(e) => set("email", e.target.value.toLowerCase())}
                maxLength={254}
                autoComplete="email"
              />
            </Field>
            <Field label={t("لغة التعلّم", "learning language")}>
              <ChoiceRow
                options={[
                  { id: "en" as const, label: "English" },
                  { id: "ar" as const, label: "العربية" },
                  { id: "bilingual" as const, label: t("ثنائي اللغة", "Bilingual") },
                ]}
                value={form.language}
                onPick={(id) => set("language", id)}
              />
            </Field>
            {/* Honeypot — visually hidden, real name-like field */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              value={form.hp_website}
              onChange={(e) => set("hp_website", e.target.value)}
            />
          </>
        )}

        {step === "goal" && (
          <>
            <Field label={t("الموضوع تحديدًا", "topic, specifically")} error={errors.topic}>
              <input
                className={inputCls}
                value={form.topic}
                onChange={(e) => set("topic", e.target.value)}
                maxLength={300}
                placeholder={t("مثال: بناء أداة استخراج بيانات", "e.g. building a web scraper")}
              />
            </Field>
            <Field label={t("ماذا تريد أن تستطيع فعله؟", "what should you be able to DO?")} error={errors.desiredOutcome}>
              <textarea
                className={cn(inputCls, "min-h-20 resize-y")}
                value={form.desiredOutcome}
                onChange={(e) => set("desiredOutcome", e.target.value)}
                maxLength={1000}
              />
            </Field>
            <Field label={t("مستواك الحالي (تقديرك الذاتي)", "your current level (self-rating)")} error={errors.statedLevel}>
              <ChoiceRow
                options={EXPERIENCE_LEVELS.map((l) => ({ id: l.id, label: t(l.label.ar, l.label.en) }))}
                value={form.statedLevel}
                onPick={(id) => set("statedLevel", id)}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t("ساعات متاحة أسبوعيًا", "hours available / week")}>
                <input
                  className={inputCls}
                  type="number"
                  min={1}
                  max={40}
                  value={form.weeklyHours}
                  onChange={(e) => set("weeklyHours", Math.min(40, Math.max(1, Number(e.target.value) || 1)))}
                />
              </Field>
              <Field label={t("تاريخ مستهدف (اختياري)", "target date (optional)")} error={errors.targetDate}>
                <input
                  className={inputCls}
                  type="date"
                  dir="ltr"
                  value={form.targetDate}
                  onChange={(e) => set("targetDate", e.target.value)}
                />
              </Field>
            </div>
          </>
        )}

        {step === "diagnostic" && (
          <>
            {selfChecks.length > 0 ? (
              <div className="space-y-5">
                {selfChecks.map((q) => (
                  <Field key={q.id} label={`${q.id} — ${t(q.question.ar, q.question.en)}`}>
                    <div className="space-y-1.5">
                      {q.options.map((opt, score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => set("answers", { ...form.answers, [q.id]: score })}
                          className={cn(
                            "block w-full text-start rounded-sm border px-3 py-2 text-sm transition-colors",
                            form.answers[q.id] === score
                              ? "border-emerald-700 bg-emerald-950/30 text-emerald-300"
                              : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
                          )}
                        >
                          {t(opt.ar, opt.en)}
                        </button>
                      ))}
                    </div>
                  </Field>
                ))}
                {errors.answers && <p className="text-xs text-red-400">{errors.answers}</p>}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                {t(
                  "لا أسئلة تشخيصية لهذا المجال — سيُقيَّم طلبك يدويًا.",
                  "No self-checks for this track — your request gets a manual first pass."
                )}
              </p>
            )}
            {form.pkg === "academic_sprint" && (
              <Field label={t("الصق نص التكليف", "paste your assignment brief")} error={errors.briefText}>
                <textarea
                  className={cn(inputCls, "min-h-28 resize-y")}
                  value={form.briefText}
                  onChange={(e) => set("briefText", e.target.value)}
                  maxLength={3000}
                  placeholder={t("الملفات تُشارك لاحقًا بعد المراجعة", "files can be shared after review")}
                />
              </Field>
            )}
            {form.pkg === "private_mentorship" && (
              <Field label={t("هدف الجلسة", "session goal")} error={errors.sessionGoal}>
                <textarea
                  className={cn(inputCls, "min-h-20 resize-y")}
                  value={form.sessionGoal}
                  onChange={(e) => set("sessionGoal", e.target.value)}
                  maxLength={500}
                />
              </Field>
            )}
          </>
        )}

        {step === "consent" && (
          <div className="space-y-3">
            {activeConsents.map((c) => (
              <label key={c.key} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={!!form.consents[c.key]}
                  onChange={(e) => set("consents", { ...form.consents, [c.key]: e.target.checked })}
                  className="mt-1 h-4 w-4 shrink-0 accent-emerald-600"
                />
                <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors leading-relaxed">
                  {t(c.label.ar, c.label.en)}{" "}
                  <a href={c.anchor} className="text-emerald-600 hover:text-emerald-400 font-mono text-xs">
                    [{t("النص", "text")}]
                  </a>
                </span>
              </label>
            ))}
            {errors.consents && <p className="text-xs text-red-400">{errors.consents}</p>}
          </div>
        )}

        {step === "review" && (
          <div className="font-mono text-xs space-y-1.5 text-zinc-400" dir={isAr ? "rtl" : "ltr"}>
            {[
              [t("الباقة", "package"), PACKAGES.find((p) => p.id === form.pkg)?.osName ?? "—"],
              [t("المجال", "track"), TRACKS.find((tr) => tr.id === form.track)?.osTag ?? "—"],
              [t("الاسم", "name"), form.fullName || "—"],
              [t("البريد", "email"), form.email || "—"],
              [t("الموضوع", "topic"), form.topic || "—"],
              [t("س/أسبوع", "h/week"), String(form.weeklyHours)],
              [t("الهدف الزمني", "target"), form.targetDate || t("مرن", "flexible")],
            ].map(([k, v]) => (
              <p key={k} className="flex gap-3">
                <span className="text-zinc-600 w-24 shrink-0 uppercase tracking-wider">{k}</span>
                <span className="text-zinc-300 break-all">{v}</span>
              </p>
            ))}
            <p className="pt-3 text-amber-500/80 uppercase tracking-widest text-[10px]">
              {t(
                "نموذج أولي — الإرسال لا ينقل بيانات بعد",
                "prototype — submitting does not transmit data yet"
              )}
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between mt-7 pt-4 border-t border-zinc-800/70">
        <button
          type="button"
          onClick={back}
          disabled={stepIndex === 0}
          className="font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-sm border border-zinc-800 text-zinc-500 hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {t("→ السابق", "← Back")}
        </button>
        {step === "review" ? (
          <button
            type="button"
            onClick={submit}
            className="font-mono text-xs uppercase tracking-widest px-5 py-2.5 rounded-sm bg-emerald-600 text-zinc-950 font-semibold hover:bg-emerald-500 transition-colors"
          >
            {t("أظهر تقييمي", "Show my assessment")}
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="font-mono text-xs uppercase tracking-widest px-5 py-2.5 rounded-sm border border-emerald-800 text-emerald-400 hover:bg-emerald-950/40 transition-colors"
          >
            {t("← التالي", "Next →")}
          </button>
        )}
      </div>
    </OSWindow>
  )
}
