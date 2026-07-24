"use client"

// === METADATA ===
// Purpose: Learning Lab (/learn) page content — academy.exe. Phase 2 UX prototype:
//          all sections render real bilingual copy; the intake wizard is client-side
//          only (no data leaves the browser). Spec: docs/learning-lab/PRD.md §7.
// Author: @Goodnbad.exe
// Inputs: none (config from lib/learn/intake-config)
// Outputs: page sections inside OSPageShell
// Tests: tests/learn-assessment.test.ts (engine); visual pass in docs/learning-lab/evidence
// Complexity: O(1) render
// === END METADATA ===

import { useState } from "react"
import { OSWindow } from "@/components/os"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { PACKAGES, TRACKS } from "@/lib/learn/intake-config"
import { IntakeForm } from "./intake-form"

/** Monospace section header — `NN // NAME` in the house style. */
function SectionHead({ code, en, ar, id }: { code: string; en: string; ar: string; id?: string }) {
  const { t } = useLanguage()
  return (
    <div id={id} className="flex items-baseline gap-3 mb-5 scroll-mt-16">
      <span className="font-mono text-xs text-emerald-600 tracking-widest select-none">{code}</span>
      <h2 className="font-mono text-sm text-zinc-300 uppercase tracking-[0.2em]">{t(ar, en)}</h2>
      <span className="hidden sm:block flex-1 h-px bg-zinc-800/80 self-center" />
    </div>
  )
}

/** Redacted bar — the visual signature: paid path stays classified until unlocked. */
function Redacted({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block h-3 rounded-[2px] bg-zinc-700/70 align-middle select-none", className)}
    />
  )
}

function Hero() {
  const { t } = useLanguage()
  return (
    <section className="px-4 pt-14 pb-12 sm:pt-20 sm:pb-16 max-w-5xl mx-auto">
      <p className="font-mono text-[11px] text-emerald-600 tracking-[0.3em] uppercase mb-4 os-panel-in">
        academy.exe // {t("مختبر التعلّم", "learning lab")}
      </p>
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-100 max-w-3xl leading-[1.05] mb-6">
        {t("تعلّم النظام،", "Learn the system,")}
        <br />
        <span className="text-emerald-500">{t("لا الإجابة فقط.", "not only the answer.")}</span>
      </h1>
      <p className="text-zinc-400 max-w-2xl text-base sm:text-lg leading-relaxed mb-3">
        {t(
          "تعليم تقني شخصي يُبنى حول هدفك أنت: تشخيص مجاني، ثم خطة يعتمدها مرشدك، ثم تعلّم يُفتح خطوة مؤكدة تلو الأخرى.",
          "Personalized technical teaching built around YOUR goal: a free diagnostic, a mentor-approved plan, then learning that unlocks one verified step at a time."
        )}
      </p>
      <p className="font-mono text-xs text-zinc-400/90 mb-8">
        {t(
          "فكّر كإنسان. نفّذ كآلة. علّم كأستاذ.",
          "Think like a human. Execute like a machine. Teach like a professor."
        )}
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="#intake"
          className="font-mono text-xs uppercase tracking-widest px-5 py-3 rounded-sm bg-emerald-600 text-zinc-950 font-semibold hover:bg-emerald-500 transition-colors"
        >
          {t("ابدأ التشخيص المجاني", "Start the free diagnostic")}
        </a>
        <a
          href="#packages"
          className="font-mono text-xs uppercase tracking-widest px-5 py-3 rounded-sm border border-zinc-700 text-zinc-300 hover:border-emerald-700 hover:text-emerald-400 transition-colors"
        >
          {t("استعرض الباقات", "See the packages")}
        </a>
      </div>
    </section>
  )
}

function Protocol() {
  const { t } = useLanguage()
  const stages = [
    {
      code: "S1",
      en: ["Diagnose — free", "You tell the system your goal, background, and time. It maps your level and gaps."],
      ar: ["التشخيص — مجانًا", "تخبر النظام بهدفك وخلفيتك ووقتك، فيحدد مستواك وفجواتك."],
    },
    {
      code: "S2",
      en: ["Quote — human-approved", "Hamzah reviews every request personally: scope, price, and delivery window. No bots decide."],
      ar: ["العرض — باعتماد بشري", "يراجع حمزة كل طلب شخصيًا: النطاق والسعر ومدة التسليم. لا قرارات آلية."],
    },
    {
      code: "S3",
      en: ["Teach — step by verified step", "After verified payment, your path unlocks one module at a time — each proven before the next."],
      ar: ["التعليم — خطوة مؤكدة تلو الأخرى", "بعد تأكيد الدفع يُفتح مسارك وحدة تلو الأخرى — كل خطوة تُثبت قبل التالية."],
    },
  ]
  return (
    <section className="px-4 pb-12 max-w-5xl mx-auto">
      <SectionHead code="01" en="protocol" ar="البروتوكول" />
      <div className="grid sm:grid-cols-3 gap-3">
        {stages.map((s, i) => (
          <OSWindow key={s.code} label={s.code} title={t("مرحلة", "stage")} status={i === 0 ? "active" : "idle"}>
            <h3 className="text-zinc-100 font-semibold mb-2">{t(s.ar[0], s.en[0])}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{t(s.ar[1], s.en[1])}</p>
          </OSWindow>
        ))}
      </div>
    </section>
  )
}

/** The signature visual: your path exists, but stays classified until unlocked. */
function LockedPath() {
  const { t } = useLanguage()
  const lockedRows = [
    { code: "02", w: "w-40" },
    { code: "03", w: "w-52" },
    { code: "04", w: "w-36" },
    { code: "05", w: "w-48" },
  ]
  return (
    <section className="px-4 pb-12 max-w-5xl mx-auto">
      <SectionHead code="02" en="your path — controlled release" ar="مسارك — إتاحة مضبوطة" />
      <OSWindow label="path.map" title={t("خريطة المسار", "path map")} status="active">
        <ul className="font-mono text-sm">
          <li className="flex items-center gap-3 py-2.5 border-b border-zinc-800/60">
            <span className="text-emerald-500 text-xs w-6 shrink-0">01</span>
            <span className="text-zinc-200">{t("التشخيص الأولي", "Preliminary diagnostic")}</span>
            <span className="ms-auto text-[10px] uppercase tracking-widest text-emerald-500">
              {t("مفتوح — مجاني", "open — free")}
            </span>
          </li>
          {lockedRows.map((r) => (
            <li key={r.code} className="flex items-center gap-3 py-2.5 border-b border-zinc-800/60 last:border-0">
              <span className="text-zinc-600 text-xs w-6 shrink-0">{r.code}</span>
              <Redacted className={r.w} />
              <span className="ms-auto text-[10px] uppercase tracking-widest text-zinc-600">
                {t("مقفل", "locked")}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-zinc-500 leading-relaxed">
          {t(
            "خطتك الكاملة تُبنى لك وحدك — وتُفتح بعد اعتماد النطاق وتأكيد الدفع. هذا ليس بخلًا؛ إنه نموذج العمل: التشخيص مجاني، والتعليم مدفوع، والإتقان مُتحقق منه.",
            "Your full plan is built for you alone — and unlocks after scope approval and verified payment. That's not stinginess; it's the model: diagnosis is free, teaching is paid, mastery is verified."
          )}
        </p>
      </OSWindow>
    </section>
  )
}

function Tracks() {
  const { t } = useLanguage()
  return (
    <section className="px-4 pb-12 max-w-5xl mx-auto">
      <SectionHead code="03" en="what you can study" ar="ماذا يمكنك أن تدرس" />
      <div className="flex flex-wrap gap-2">
        {TRACKS.map((tr) => (
          <span
            key={tr.id}
            className="inline-flex items-center gap-2 rounded-sm border border-zinc-800 bg-zinc-900/50 px-3 py-2"
          >
            <span className="font-mono text-[10px] text-emerald-600">{tr.osTag}</span>
            <span className="text-sm text-zinc-300">{t(tr.label.ar, tr.label.en)}</span>
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        {t(
          "من «ما هو المجلد؟» إلى بناء وكلاء الذكاء الاصطناعي — يبدأ المسار من مستواك الحقيقي، أيًا كان.",
          "From “what is a folder?” to building AI agents — the path starts at your real level, wherever that is."
        )}
      </p>
    </section>
  )
}

/** Abridged interactive teaching sample — the trust artifact (PRD §7). */
function TeachingSample() {
  const { t } = useLanguage()
  const [revealed, setRevealed] = useState(false)
  return (
    <section className="px-4 pb-12 max-w-5xl mx-auto">
      <SectionHead code="04" en="how I teach — live sample" ar="كيف أعلّم — عينة حية" />
      <OSWindow label="sample.module" title={t("الثنائي في ٥ دقائق", "binary in 5 minutes")} status="active">
        <div className="space-y-4 text-sm leading-relaxed text-zinc-300">
          <p>
            <span className="font-mono text-emerald-600 text-xs me-2">{t("١ · الفكرة", "1 · THE IDEA")}</span>
            {t(
              "أنت تعدّ بعشرة رموز لأن لديك عشرة أصابع. الحاسوب لديه «إصبع» واحد: مشغَّل أو مطفأ. لذلك يعدّ برمزين: 0 و1.",
              "You count with ten symbols because you have ten fingers. A computer has one “finger”: ON or OFF. So it counts with two symbols: 0 and 1."
            )}
          </p>
          <p>
            <span className="font-mono text-emerald-600 text-xs me-2">{t("٢ · الربط", "2 · CONNECT")}</span>
            {t(
              "حين تتجاوز 9 تكتب 10 — «مجموعة من عشرة». الثنائي يفعل الشيء نفسه لكن أبكر: تتجاوز 1 فتكتب 10 — «مجموعة من اثنين».",
              "When you pass 9 you write 10 — “one group of ten.” Binary makes the identical move, just earlier: pass 1, write 10 — “one group of TWO.”"
            )}
          </p>
          <p className="font-mono text-xs text-zinc-400 bg-zinc-950/60 border border-zinc-800 rounded-sm px-3 py-2" dir="ltr">
            0, 1, 2, 3, 4, 5&nbsp;&nbsp;↔&nbsp;&nbsp;0, 1, 10, 11, 100, 101
          </p>
          <p>
            <span className="font-mono text-emerald-600 text-xs me-2">{t("٣ · دورك", "3 · YOUR TURN")}</span>
            {t("ما قيمة ", "Without looking it up: what is ")}
            <span className="font-mono text-emerald-400" dir="ltr">110</span>
            {t(" بالأرقام العادية؟ (الخانات من اليمين: 1، 2، 4)", " in normal numbers? (Slots right-to-left: 1, 2, 4.)")}
          </p>
          {revealed ? (
            <div className="border-s-2 border-emerald-700 ps-3 space-y-2 os-panel-in">
              <p>
                <span className="font-mono text-emerald-600 text-xs me-2">{t("٤ · التحقق", "4 · CHECK")}</span>
                {t(
                  "إذا قلت ٦ — صحيح. وإذا قلت ٣ فقد قرأت الخانات من اليسار — أكثر خطأ شائع لدى المبتدئين.",
                  "If you said 6 — correct. If you said 3, you read the slots left-to-right — the single most common beginner slip."
                )}
              </p>
              <p>
                <span className="font-mono text-emerald-600 text-xs me-2">{t("٥ · لماذا؟", "5 · WHY")}</span>
                {t(
                  "نقرأ النص باتجاه واحد، لكن خانات الأرقام تكبر من اليمين في كل الأنظمة. عادتك اصطدمت بقاعدة النظام — والآن عرفت القاعدة.",
                  "We read text one way, but number slots grow right-to-left in every base. Your habit collided with the system's rule — now you know the rule."
                )}
              </p>
              <p className="text-zinc-500 text-xs">
                {t(
                  "هكذا تعمل كل وحدة: لا تحفظ إجابتي — تعيد إنتاج التفكير، نمسك نقطة الانكسار، وتُفتح الخطوة التالية حين تصبح هذه ملكك.",
                  "This is how every module works: you don't memorize my answer — you reproduce the reasoning, we catch the exact break point, and the next step unlocks when this one is truly yours."
                )}
              </p>
            </div>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-sm border border-emerald-800 text-emerald-400 hover:bg-emerald-950/40 transition-colors"
            >
              {t("تحقق من إجابتي", "Check my answer")}
            </button>
          )}
        </div>
      </OSWindow>
    </section>
  )
}

function Packages({ onPick }: { onPick: (id: string) => void }) {
  const { t } = useLanguage()
  const [hasBrief, setHasBrief] = useState<boolean | null>(null)
  const [wantsLive, setWantsLive] = useState<boolean | null>(null)
  const suggestion =
    hasBrief === null || (hasBrief === false && wantsLive === null)
      ? null
      : hasBrief
        ? "academic_sprint"
        : wantsLive
          ? "private_mentorship"
          : "guided_path"

  return (
    <section className="px-4 pb-12 max-w-5xl mx-auto">
      <SectionHead code="05" en="packages" ar="الباقات" id="packages" />

      {/* "Not sure which?" 2-question helper (POLICIES §4) */}
      <OSWindow bare className="mb-4 p-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span className="font-mono text-zinc-500 uppercase tracking-widest">
            {t("غير متأكد؟", "not sure which?")}
          </span>
          <span className="text-zinc-400">{t("لديك تكليف جامعي بموعد تسليم؟", "Graded brief with a deadline?")}</span>
          <span className="flex gap-1">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                onClick={() => setHasBrief(v)}
                className={cn(
                  "font-mono px-2 py-1 rounded-sm border transition-colors",
                  hasBrief === v
                    ? "border-emerald-700 text-emerald-400 bg-emerald-950/30"
                    : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
                )}
              >
                {v ? t("نعم", "yes") : t("لا", "no")}
              </button>
            ))}
          </span>
          {hasBrief === false && (
            <>
              <span className="text-zinc-400">{t("تفضّل جلسات مباشرة؟", "Prefer live 1:1?")}</span>
              <span className="flex gap-1">
                {[true, false].map((v) => (
                  <button
                    key={String(v)}
                    onClick={() => setWantsLive(v)}
                    className={cn(
                      "font-mono px-2 py-1 rounded-sm border transition-colors",
                      wantsLive === v
                        ? "border-emerald-700 text-emerald-400 bg-emerald-950/30"
                        : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
                    )}
                  >
                    {v ? t("نعم", "yes") : t("لا", "no")}
                  </button>
                ))}
              </span>
            </>
          )}
        </div>
      </OSWindow>

      <div className="grid md:grid-cols-3 gap-3">
        {PACKAGES.map((p) => (
          <OSWindow
            key={p.id}
            label={p.osName}
            status={suggestion === p.id ? "active" : "idle"}
            className={cn(suggestion === p.id && "border-emerald-800/70")}
          >
            <h3 className="text-lg font-semibold text-zinc-100 mb-1">{t(p.name.ar, p.name.en)}</h3>
            <p className="text-xs text-emerald-500/90 mb-3 min-h-8">{t(p.boundary.ar, p.boundary.en)}</p>
            <ul className="space-y-1.5 mb-4">
              {p.includes.map((inc, i) => (
                <li key={i} className="text-sm text-zinc-400 flex gap-2">
                  <span className="text-emerald-700 font-mono text-xs mt-0.5 shrink-0">▸</span>
                  {t(inc.ar, inc.en)}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-zinc-800/70 pt-3">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                {t(p.cadence.ar, p.cadence.en)}
              </span>
              <button
                onClick={() => onPick(p.id)}
                className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {t("اطلب تقييمًا ←", "Request assessment →")}
              </button>
            </div>
          </OSWindow>
        ))}
      </div>
      <p className="mt-3 font-mono text-[11px] text-zinc-400/80">
        {t(
          "عرض السعر خلال يومي عمل · تأكيد الدفع خلال ٢٤ ساعة · السعر يُبنى على النطاق والوقت والاستعجال.",
          "Quote within 2 business days · payment verified within 24h · pricing follows scope, time, and urgency."
        )}
      </p>
    </section>
  )
}

function Integrity() {
  const { t } = useLanguage()
  return (
    <section className="px-4 pb-12 max-w-5xl mx-auto">
      <SectionHead code="06" en="academic integrity" ar="النزاهة الأكاديمية" id="terms-integrity" />
      <OSWindow label="integrity.doc" title={t("التزام", "commitment")} status="active">
        <p className="text-zinc-200 font-semibold mb-2">
          {t("أعلّمك النظام — ولا أنجز تقييمك بدلًا عنك.", "I teach the system — I don't do your assessment for you.")}
        </p>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {t(
            "أحلّل التكليف معك، أشرح المفاهيم التي يختبرها، أساعدك على التخطيط، وأراجع وأصحّح ما تبنيه أنت. لا أكتب عملًا مُقيَّمًا باسمك، ولا أدخل امتحانات، ولا أختلق مراجع، ولا أسلّم شيئًا نيابة عنك. إن كانت جامعتك تقيّد استخدام الذكاء الاصطناعي أو المساعدة الخارجية، أخبرني في النموذج — سنعمل ضمن قواعدها. تخرج من هنا قادرًا على الشرح والإعادة والتطبيق. هذا هو الهدف.",
            "I analyze your brief with you, explain the concepts it tests, help you plan, and review and debug what YOU build. I will not write assessed work in your name, complete exams, fabricate research or citations, or submit anything on your behalf. If your institution restricts AI or external help, tell me in the intake — we'll work within those rules. You leave able to explain, reproduce, and apply what you learned. That's the point."
          )}
        </p>
      </OSWindow>
    </section>
  )
}

function FAQ() {
  const { t } = useLanguage()
  const items: { q: [string, string]; a: [string, string] }[] = [
    {
      q: ["هل هذه دورات مسجلة؟", "Is this a library of recorded courses?"],
      a: [
        "لا. كل مسار يُبنى لطالب واحد: مستواك، هدفك، وقتك، ولغتك. لا يوجد منهج موحّد.",
        "No. Every path is built for one learner: your level, your goal, your time, your language. There is no fixed curriculum.",
      ],
    },
    {
      q: ["لماذا لا أرى الخطة كاملة قبل الدفع؟", "Why can't I see the full plan before paying?"],
      a: [
        "التشخيص مجاني ويريك مستواك وفجواتك واتجاهك. الخطة الكاملة هي المنتج المدفوع — تُبنى وتُفتح بعد اعتماد النطاق وتأكيد الدفع.",
        "The diagnostic is free and shows your level, gaps, and direction. The full plan IS the paid product — it's built and unlocked after scope approval and verified payment.",
      ],
    },
    {
      q: ["هل تحلّون الواجبات الجامعية؟", "Do you complete university assignments?"],
      a: [
        "لا — نعلّمك كيف تنجزها أنت: تحليل، شرح، تخطيط، ومراجعة عملك قبل التسليم. راجع التزام النزاهة أعلاه.",
        "No — we teach you to complete them yourself: analysis, explanation, planning, and review of YOUR work before submission. See the integrity commitment above.",
      ],
    },
    {
      q: ["بالعربية أم بالإنجليزية؟", "Arabic or English?"],
      a: [
        "كلاهما، أو مزيج. تختار لغتك في النموذج وتُبنى موادك بها — بما فيها المصطلحات التقنية المتسقة.",
        "Either, or both. You choose your language in the intake and your materials are authored in it — consistent technical terminology included.",
      ],
    },
    {
      q: ["كيف يتم الدفع؟", "How does payment work?"],
      a: [
        "بعد قبول العرض تصلك تعليمات الدفع، وتُرسل مرجع العملية. لا يتغير أي شيء حتى يتحقق حمزة من الدفع بنفسه — ادعاء الدفع لا يفتح شيئًا.",
        "After accepting the quote you get payment instructions and submit the transaction reference. Nothing changes until Hamzah personally verifies it — claiming payment unlocks nothing.",
      ],
    },
  ]
  return (
    <section className="px-4 pb-12 max-w-5xl mx-auto">
      <SectionHead code="07" en="faq" ar="أسئلة شائعة" />
      <div className="space-y-2">
        {items.map((item, i) => (
          <details key={i} className="group rounded-md border border-zinc-800 bg-zinc-900/50">
            <summary className="cursor-pointer list-none px-4 py-3 flex items-center gap-3 text-sm text-zinc-300 hover:text-zinc-100 transition-colors">
              <span className="font-mono text-[10px] text-emerald-700 group-open:text-emerald-500 transition-colors shrink-0">
                [{String(i + 1).padStart(2, "0")}]
              </span>
              {t(item.q[0], item.q[1])}
              <span className="ms-auto font-mono text-zinc-600 group-open:rotate-90 transition-transform">›</span>
            </summary>
            <p className="px-4 pb-4 ps-11 text-sm text-zinc-500 leading-relaxed">{t(item.a[0], item.a[1])}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function Terms() {
  const { t } = useLanguage()
  return (
    <section className="px-4 pb-20 max-w-5xl mx-auto" id="terms">
      <SectionHead code="08" en="terms & privacy" ar="الشروط والخصوصية" />
      <div className="grid sm:grid-cols-2 gap-3 text-sm text-zinc-500 leading-relaxed">
        <OSWindow bare className="p-4" >
          <h3 id="terms-privacy" className="font-mono text-xs text-zinc-300 uppercase tracking-widest mb-2 scroll-mt-16">
            {t("الخصوصية والبيانات", "privacy & data")}
          </h3>
          <p>
            {t(
              "نجمع الحد الأدنى: بيانات النموذج فقط، والعمر كفئة لا كتاريخ ميلاد. ملفاتك في تخزين خاص لا يُشارك، ولا تصل بيانات الدفع البنكية إلينا إطلاقًا — مرجع العملية فقط. تُحذف السجلات أو تُجهَّل بعد ١٢ شهرًا من انتهاء الاشتراك. يمكنك طلب الوصول أو الحذف عبر تسجيل الدخول بنفس بريدك.",
              "We collect the minimum: intake fields only, age as a bracket never a birth date. Your files live in private storage; card data never touches this platform — only a transaction reference. Records are anonymized 12 months after an engagement ends. Request access or deletion by signing in with your own email."
            )}
          </p>
        </OSWindow>
        <OSWindow bare className="p-4">
          <h3 id="terms-lab" className="font-mono text-xs text-zinc-300 uppercase tracking-widest mb-2 scroll-mt-16">
            {t("حدود التدريب الأمني", "security-lab boundary")}
          </h3>
          <p>
            {t(
              "التمارين الأمنية العملية تبقى داخل مختبرات تملكها أو مصرَّح لك بها (أجهزة افتراضية محلية، منصات تدريبية). لا تمارين ضد أنظمة طرف ثالث، ولا استطلاع لأهداف حقيقية. الطلبات خارج هذه الحدود تُحوَّل لمراجعة يدوية مع عرض بديل نظري.",
              "Hands-on security exercises stay inside labs you own or are authorized to use (local VMs, training platforms). No exercises against third-party systems, no real-target recon. Requests outside this boundary get manual review with a theory-first counter-offer."
            )}
          </p>
        </OSWindow>
      </div>
      <p className="mt-4 font-mono text-[10px] text-zinc-700 uppercase tracking-widest">
        {t("النص الكامل للسياسات يصلك مع عرض السعر", "full policy text accompanies every quote")}
      </p>
    </section>
  )
}

export function LearnContent() {
  const { dir } = useLanguage()
  const [pickedPackage, setPickedPackage] = useState<string | null>(null)

  const pick = (id: string) => {
    setPickedPackage(id)
    document.getElementById("intake")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div dir={dir}>
      <Hero />
      <Protocol />
      <LockedPath />
      <Tracks />
      <TeachingSample />
      <Packages onPick={pick} />
      <Integrity />
      <FAQ />
      <section className="px-4 pb-12 max-w-5xl mx-auto" id="intake">
        <SectionHead code="09" en="intake — free diagnostic" ar="النموذج — التشخيص المجاني" />
        <IntakeForm preselectedPackage={pickedPackage} />
      </section>
      <Terms />
    </div>
  )
}
