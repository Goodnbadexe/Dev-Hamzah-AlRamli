'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GlitchText } from '@/components/glitch-text'
import { MatrixBackground } from '@/components/matrix-background'
import { useLanguage } from '@/components/language-provider'
import {
  ArrowLeft, ShieldCheck, FileSearch, Bot, ScanLine, GraduationCap, FileText,
  CheckCircle2, Clock, Phone, Zap, ChevronRight, AlertTriangle, Building2,
} from 'lucide-react'

// Bilingual tuple — resolved at render via the language provider's t(ar, en).
// Technical / product names (Microsoft 365, PDPL, NCA, SDAIA, MFA, M365) stay in
// English inside Arabic prose, per the site convention.
type Bi = readonly [ar: string, en: string]

// ── Why now: live national signals (sourced from NCA / SDAIA / gov.sa, 2025) ──
const SIGNALS: { value: Bi; label: Bi }[] = [
  { value: ['15.2 مليار ر.س', 'SAR 15.2B'], label: ['الإنفاق على الأمن السيبراني', 'Cybersecurity spend'] },
  { value: ['+14٪', '+14%'],                 label: ['نمو سنوي', 'YoY growth'] },
  { value: ['68٪', '68%'],                   label: ['حصة القطاع الخاص', 'Private-sector share'] },
  { value: ['48 قراراً', '48 rulings'],      label: ['مخالفات نظام حماية البيانات', 'PDPL violation decisions'] },
]

// ── The 14-day deliverables (matches the one-page offer) ──────────────────────
const DELIVERABLES: { icon: React.ReactNode; title: Bi; detail: Bi }[] = [
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: ['فحص أمان Microsoft 365', 'Microsoft 365 security check'],
    detail: ['المصادقة الثنائية MFA، أدوار المشرفين، روابط المشاركة، مخاطر البريد، وانكشاف OneDrive / SharePoint.', 'MFA, admin roles, sharing links, mailbox risks, OneDrive / SharePoint exposure.'],
  },
  {
    icon: <FileSearch className="h-5 w-5" />,
    title: ['جاهزية نظام حماية البيانات (PDPL)', 'PDPL basic readiness'],
    detail: ['إشعار الخصوصية، خريطة جمع البيانات، فجوات الموافقة، ومعالجة WhatsApp Business وهواتف العمل.', 'Privacy notice, data-collection map, consent gaps, WhatsApp Business / business-phone handling.'],
  },
  {
    icon: <Bot className="h-5 w-5" />,
    title: ['سياسة استخدام الذكاء الاصطناعي', 'AI usage policy'],
    detail: ['ما الذي يمكن للموظفين رفعه أو حظره على ChatGPT و Gemini و Copilot وغيرها.', 'What staff can / cannot upload to ChatGPT, Gemini, Copilot, etc.'],
  },
  {
    icon: <ScanLine className="h-5 w-5" />,
    title: ['لقطة عن الثغرات', 'Vulnerability snapshot'],
    detail: ['فحص خارجي آمن، قائمة بالأصول، وتقرير بنقاط الضعف.', 'Safe external scan, asset list, weak-points report.'],
  },
  {
    icon: <GraduationCap className="h-5 w-5" />,
    title: ['جلسة توعية للموظفين', 'Staff awareness session'],
    detail: ['تدريب مباشر 60–90 دقيقة بالعربية أو الإنجليزية.', '60–90 min live training in Arabic or English.'],
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: ['التقرير النهائي', 'Final report'],
    detail: ['درجة مخاطر تنفيذية + خطة عمل لمدة 30 يوماً.', 'Executive risk score + 30-day action plan.'],
  },
]

// ── Pricing tiers ─────────────────────────────────────────────────────────────
const TIERS: {
  id: string
  name: Bi
  price: Bi
  cadence: Bi
  blurb: Bi
  includes: readonly Bi[]
  featured?: boolean
}[] = [
  {
    id: 'basic',
    name: ['سبرنت الجاهزية الأساسي', 'Basic Readiness Sprint'],
    price: ['4,500 ر.س', 'SAR 4,500'],
    cadence: ['دفعة واحدة', 'one-time'],
    blurb: ['نقطة انطلاق سريعة لاكتشاف أهم المخاطر.', 'A fast starting point to surface your top risks.'],
    includes: [
      ['فحص أمان Microsoft 365', 'Microsoft 365 security check'],
      ['جاهزية PDPL الأساسية', 'PDPL basic readiness'],
      ['سياسة استخدام الذكاء الاصطناعي', 'AI usage policy'],
      ['تقرير تنفيذي + خطة 30 يوماً', 'Executive report + 30-day plan'],
    ],
  },
  {
    id: 'full',
    name: ['سبرنت الأمن + الذكاء الاصطناعي الكامل', 'Full Cyber + AI Sprint'],
    price: ['8,500 ر.س', 'SAR 8,500'],
    cadence: ['دفعة واحدة', 'one-time'],
    blurb: ['الحزمة الكاملة لمدة 14 يوماً — كل المخرجات الستة.', 'The complete 14-day package — all six deliverables.'],
    includes: [
      ['كل ما في الباقة الأساسية', 'Everything in Basic'],
      ['لقطة عن الثغرات (فحص خارجي آمن)', 'Vulnerability snapshot (safe external scan)'],
      ['جلسة توعية مباشرة للموظفين', 'Live staff awareness session'],
      ['مكالمة شرح لخطوات المعالجة', 'Remediation walkthrough call'],
    ],
    featured: true,
  },
  {
    id: 'retainer',
    name: ['اشتراك شهري', 'Monthly Retainer'],
    price: ['1,500–4,000 ر.س', 'SAR 1,500–4,000'],
    cadence: ['شهرياً', 'per month'],
    blurb: ['دعم مستمر بعد السبرنت للحفاظ على التحسّن.', 'Ongoing support after the sprint to keep improving.'],
    includes: [
      ['مراجعة شهرية للوضع الأمني', 'Monthly posture review'],
      ['تحديث السياسات والتوثيق', 'Policy & documentation upkeep'],
      ['تنبيهات استباقية بالثغرات', 'Proactive vulnerability alerts'],
      ['تنسيق مع مزوّدين مرخّصين عند الحاجة', 'Coordination with licensed providers as needed'],
    ],
  },
]

const TARGETS: Bi[] = [
  ['شركات العقار', 'Real estate'],
  ['العيادات', 'Clinics'],
  ['المقاولون الصغار', 'Small contractors'],
  ['العلامات التجارية للتجزئة', 'Retail brands'],
  ['وكالات التسويق', 'Marketing agencies'],
  ['المدارس ومراكز التدريب', 'Schools & training centers'],
]

export default function CyberSprintPage() {
  const { t, dir } = useLanguage()

  return (
    <div dir={dir} className="min-h-screen bg-[#09090b] text-white relative overflow-hidden">
      <MatrixBackground />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            'radial-gradient(700px 400px at 10% 0%, rgba(16,185,129,0.05), transparent)',
            'radial-gradient(500px 300px at 90% 20%, rgba(96,165,250,0.03), transparent)',
          ].join(', '),
        }}
      />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="border-b border-zinc-900 relative z-10">
        <div className="container mx-auto py-4 px-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/images/newlogovector.png"
                alt="Goodnbad.exe"
                width={32}
                height={32}
                className="rounded-full bg-zinc-800/60 p-0.5 ring-1 ring-zinc-700 group-hover:ring-emerald-800/60 transition-all"
              />
              <GlitchText text="Goodnbad.exe" className="font-mono font-semibold text-sm text-emerald-400" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="border border-zinc-800 text-zinc-500 hover:text-zinc-100 hover:border-zinc-700 font-mono text-[11px] uppercase tracking-widest"
              asChild
            >
              <Link href="/services"><ArrowLeft className="mr-1.5 h-3 w-3" /> {t('الخدمات', 'Services')}</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="relative z-10">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section dir={dir} className="container mx-auto px-4 pt-16 pb-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded border border-emerald-800/60 bg-emerald-950/20 px-3 py-1.5 font-mono text-[10px] text-emerald-400 uppercase tracking-widest mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            {t('سبرنت 14 يوماً · جاهز لـ NCA و PDPL', '14-Day Sprint · NCA & PDPL Ready')}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            <GlitchText text={t('جاهزية الأمن السيبراني والذكاء الاصطناعي للشركات', 'SME Cyber & AI Readiness Sprint')} />
          </h1>

          <p className="text-base text-zinc-400 max-w-2xl mb-6 leading-relaxed">
            {t(
              'حزمة خدمة محدّدة النطاق للشركات الصغيرة والمتوسطة في السعودية التي تحتاج إلى الأمن السيبراني، وتنظيف Microsoft 365، وجاهزية نظام حماية البيانات الشخصية (PDPL)، وقواعد استخدام الذكاء الاصطناعي — دون توظيف فريق أمني كامل. خلال 14 يوماً نكتشف مخاطرك ونسلّمك تقريراً تنفيذياً واضحاً وإصلاحات عملية.',
              'A scoped service for Saudi SMEs that need cybersecurity, Microsoft 365 cleanup, PDPL readiness, and AI usage rules — without hiring a full security team. In 14 days we find your risks and hand you a clear executive report and practical fixes.',
            )}
          </p>

          <p className="text-sm text-zinc-600 max-w-2xl mb-8 leading-relaxed">
            {t(
              'لماذا الآن؟ بلغ الإنفاق على الأمن السيبراني في المملكة 15.2 مليار ريال بنمو 14٪، ويشكّل القطاع الخاص 68٪ منه. وأصدرت سدايا 48 قراراً بمخالفة نظام حماية البيانات خلال عام واحد، و2026 هو عام الذكاء الاصطناعي رسمياً. الامتثال لم يعد "لاحقاً".',
              'Why now? Saudi cybersecurity spend hit SAR 15.2B (+14%), with the private sector at 68%. SDAIA issued 48 PDPL violation decisions in a single year, and 2026 is officially the Year of AI. Compliance is no longer "later".',
            )}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/services#inquiry"
              className="inline-flex items-center justify-center gap-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-3 text-sm transition-all duration-200 hover:shadow-[0_0_28px_rgba(16,185,129,0.35)]"
            >
              <Zap className="h-4 w-4" /> {t('احجز مراجعة الانكشاف المجانية', 'Book Free Exposure Review')}
            </a>
            <a
              href="tel:+966508501717"
              className="inline-flex items-center justify-center gap-2 rounded border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 font-mono px-5 py-3 text-sm transition-all duration-200"
            >
              <Phone className="h-4 w-4" /> +966 50 850 1717
            </a>
          </div>
          <p className="font-mono text-[10px] text-zinc-700 mt-3">
            {t('مراجعة مجانية 20 دقيقة لانكشافك السيبراني والذكاء الاصطناعي · بلا التزام', 'Free 20-min Cyber & AI Exposure Review · No obligation')}
          </p>
        </section>

        {/* ── Why-now stat row ──────────────────────────────────────────── */}
        <div dir={dir} className="border-y border-zinc-900 bg-zinc-950/50 relative z-10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-zinc-900">
              {SIGNALS.map((s) => (
                <div key={s.label[1]} className="px-6 py-4 text-center">
                  <div className="font-mono text-base font-bold text-emerald-300 mb-0.5">{t(...s.value)}</div>
                  <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">{t(...s.label)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── What's included ───────────────────────────────────────────── */}
        <section dir={dir} className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="flex items-center gap-4 mb-10">
            <div>
              <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-1">{t('خلال 14 يوماً', 'In 14 days')}</p>
              <h2 className="text-2xl font-bold text-zinc-100"><GlitchText text={t('ما الذي تحصل عليه', 'What You Get')} /></h2>
            </div>
            <span className="h-px flex-1 bg-zinc-900 hidden sm:block" />
            <p className="text-[11px] text-zinc-700 font-mono shrink-0 hidden sm:block">
              {t('نطاق واضح · 14 يوماً · مخرجات حقيقية', 'clear scope · 14 days · real deliverables')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DELIVERABLES.map((d) => (
              <div
                key={d.title[1]}
                className="group relative flex flex-col rounded-md border border-emerald-500/20 bg-zinc-900/40 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_0_1px_rgba(52,211,153,0.2)]"
              >
                <span className="absolute top-0 left-0 right-0 h-px opacity-50 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                <div className="p-5 flex-1 flex flex-col">
                  <div
                    className="w-9 h-9 rounded border border-zinc-800/80 flex items-center justify-center text-emerald-400 mb-4 transition-all duration-200 group-hover:scale-105"
                    style={{ background: 'rgba(52,211,153,0.08)' }}
                  >
                    {d.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100 mb-2 leading-snug">{t(...d.title)}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed flex-1">{t(...d.detail)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pricing ───────────────────────────────────────────────────── */}
        <section dir={dir} className="container mx-auto px-4 pb-16 max-w-6xl">
          <div className="flex items-center gap-4 mb-10">
            <div>
              <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-1">{t('الأسعار', 'Pricing')}</p>
              <h2 className="text-2xl font-bold text-zinc-100"><GlitchText text={t('اختر نقطة البداية', 'Pick Your Starting Point')} /></h2>
            </div>
            <span className="h-px flex-1 bg-zinc-900 hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-md border ${
                  tier.featured ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-zinc-800 bg-zinc-900/40'
                } overflow-hidden transition-all duration-300 hover:-translate-y-0.5`}
              >
                {tier.featured && (
                  <span className="absolute top-3 ltr:right-3 rtl:left-3 font-mono text-[9px] uppercase tracking-widest text-emerald-300 border border-emerald-500/40 bg-emerald-500/10 rounded px-2 py-0.5">
                    {t('الأكثر طلباً', 'Most Popular')}
                  </span>
                )}
                <span className={`absolute top-0 left-0 right-0 h-px ${tier.featured ? 'bg-gradient-to-r from-transparent via-emerald-400 to-transparent' : 'bg-zinc-800'}`} />
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-sm font-semibold text-zinc-100 mb-1 leading-snug pe-20">{t(...tier.name)}</h3>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-2xl font-bold text-white">{t(...tier.price)}</span>
                    <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">{t(...tier.cadence)}</span>
                  </div>
                  <p className="text-zinc-500 text-xs mb-5 leading-relaxed">{t(...tier.blurb)}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.includes.map((inc) => (
                      <li key={inc[1]} className="flex items-start gap-2 text-xs text-zinc-400">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        {t(...inc)}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/services#inquiry"
                    className={`inline-flex items-center justify-center gap-1.5 rounded px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                      tier.featured
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black hover:shadow-[0_0_24px_rgba(16,185,129,0.3)]'
                        : 'border border-zinc-700 text-zinc-300 hover:border-emerald-600 hover:text-emerald-300'
                    }`}
                  >
                    {t('ابدأ', 'Get Started')} <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Who it's for ──────────────────────────────────────────────── */}
        <section dir={dir} className="container mx-auto px-4 pb-12 max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-4 w-4 text-zinc-600" />
            <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">{t('الأنسب لـ', 'Best for')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TARGETS.map((target) => (
              <span
                key={target[1]}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 border border-zinc-800 rounded px-2.5 py-1 bg-zinc-900/50 hover:border-zinc-700 transition-colors"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                {t(...target)}
              </span>
            ))}
          </div>
        </section>

        {/* ── Positioning / scope disclaimer (compliance honesty) ───────── */}
        <section dir={dir} className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="rounded-md border border-zinc-800 bg-zinc-950/60 p-5 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-500 leading-relaxed">
              {t(
                'هذه الخدمة جاهزية وتحصين وتوعية وتوثيق وتنسيق — وليست مركز عمليات أمنية مُدار (MSOC) أو خدمة مراقبة مرخّصة. أعمال المراقبة الأكبر تُنفّذ بالشراكة مع مزوّدين مرخّصين من الهيئة الوطنية للأمن السيبراني (NCA).',
                'This is a readiness, hardening, awareness, documentation, and coordination service — not a licensed MSOC or monitoring provider. Larger monitoring work is delivered in partnership with NCA-licensed providers.',
              )}
            </p>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────── */}
        <section dir={dir} className="container mx-auto px-4 pb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-3 tracking-tight">
            <GlitchText text={t('ابدأ بمراجعة مجانية', 'Start With a Free Review')} />
          </h2>
          <p className="text-zinc-500 text-sm mb-7 max-w-md mx-auto leading-relaxed">
            {t(
              'مراجعة 20 دقيقة لانكشافك السيبراني والذكاء الاصطناعي. بلا إزعاج، بلا التزام — فقط صورة واضحة عن وضعك وأهم 3 إصلاحات.',
              'A 20-min review of your Cyber & AI exposure. No spam, no obligation — just a clear picture of where you stand and your top 3 fixes.',
            )}
          </p>
          <a
            href="/services#inquiry"
            className="inline-flex items-center justify-center gap-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 text-sm transition-all duration-200 hover:shadow-[0_0_28px_rgba(16,185,129,0.35)]"
          >
            <Zap className="h-4 w-4" /> {t('احجز مراجعة الانكشاف المجانية', 'Book Free Exposure Review')}
          </a>
          <p className="font-mono text-[10px] text-zinc-700 mt-4 flex items-center justify-center gap-1.5">
            <Clock className="h-3 w-3" /> {t('استجابة خلال 24 ساعة · عربي + إنجليزي', '24h response · Arabic + English')}
          </p>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer dir={dir} className="border-t border-zinc-900 py-6 relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest">
            GOODNBAD.EXE © {new Date().getFullYear()}
          </span>
          <div className="flex gap-5">
            {[
              { href: '/services',  label: t('الخدمات', 'Services')      },
              { href: '/',          label: t('الأعمال', 'Portfolio')      },
              { href: '/security',  label: t('أطلس الأمن', 'Security Atlas') },
              { href: 'mailto:alramli.hamzah@gmail.com', label: t('البريد', 'Email') },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-mono text-[10px] text-zinc-700 hover:text-zinc-400 uppercase tracking-widest transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
