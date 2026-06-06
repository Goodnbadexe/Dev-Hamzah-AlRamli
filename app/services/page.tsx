'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GlitchText } from '@/components/glitch-text'
import { MatrixBackground } from '@/components/matrix-background'
import { toast } from 'sonner'
import {
  Shield, Search, Monitor, BookOpen, ArrowLeft,
  CheckCircle2, Users, AlertTriangle, Lock,
  Mail, Phone, Clock, ChevronRight, FileText, Zap
} from 'lucide-react'

// ── Accent color map ──────────────────────────────────────────────────────────
// Maps each service color tier to a concrete CSS value used in box-shadows and
// gradient stops (Tailwind's `currentColor` trick doesn't reach pseudo-elements
// in inline styles, so we resolve these explicitly).
const ACCENT_COLORS: Record<string, { rgb: string; hex: string }> = {
  'text-red-400':    { rgb: '248,113,113',  hex: '#f87171' },
  'text-emerald-400':{ rgb: '52,211,153',   hex: '#34d399' },
  'text-blue-400':   { rgb: '96,165,250',   hex: '#60a5fa' },
  'text-purple-400': { rgb: '192,132,252',  hex: '#c084fc' },
  'text-yellow-400': { rgb: '250,204,21',   hex: '#facc15' },
  'text-orange-400': { rgb: '251,146,60',   hex: '#fb923c' },
}

const SERVICES = [
  {
    id: 'pentest',
    icon: <Search className="h-5 w-5" />,
    color: 'text-red-400',
    borderIdle: 'border-red-500/25',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    tag: 'Most Requested',
    title: 'Penetration Testing',
    subtitle: 'Find your weaknesses before attackers do',
    duration: '3–7 business days',
    description: 'Full-scope ethical hacking engagement: web apps, network infrastructure, or internal systems. Detailed report with CVSS scores, proof-of-concept, and remediation steps.',
    deliverables: [
      'Reconnaissance & attack surface mapping',
      'Exploitation of discovered vulnerabilities',
      'Full technical + executive report',
      'Remediation walkthrough call',
      'Re-test after fixes (1 round)',
    ],
  },
  {
    id: 'audit',
    icon: <Shield className="h-5 w-5" />,
    color: 'text-emerald-400',
    borderIdle: 'border-emerald-500/25',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    tag: 'NCA / SAMA Ready',
    title: 'Security Audit',
    subtitle: 'Compliance-ready security assessment',
    duration: '2–5 business days',
    description: 'Structured review of your security posture mapped to NCA ECC, SAMA CSF, or ISO 27001. Identifies gaps and gives you a prioritized roadmap to compliance.',
    deliverables: [
      'Gap analysis against chosen framework',
      'Risk register with severity ratings',
      'Prioritized remediation roadmap',
      'Policy & procedure recommendations',
      'Executive summary for management',
    ],
  },
  {
    id: 'azure',
    icon: <Lock className="h-5 w-5" />,
    color: 'text-blue-400',
    borderIdle: 'border-blue-500/25',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    tag: 'Microsoft Certified',
    title: 'Microsoft Security Setup',
    subtitle: 'Harden your Azure & M365 environment',
    duration: '2–4 business days',
    description: 'Configure Entra ID, Defender for Cloud, Sentinel SIEM, conditional access policies, and MFA. Turn your Microsoft stack into a security-first environment.',
    deliverables: [
      'Entra ID hardening & MFA rollout',
      'Defender for Cloud configuration',
      'Microsoft Sentinel SIEM setup',
      'Conditional access policy design',
      'Security score improvement report',
    ],
  },
  {
    id: 'monitoring',
    icon: <Monitor className="h-5 w-5" />,
    color: 'text-purple-400',
    borderIdle: 'border-purple-500/25',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    tag: 'Monthly Retainer',
    title: 'Security Monitoring',
    subtitle: 'Eyes on your infrastructure 24/7',
    duration: 'Ongoing',
    description: 'Monthly retainer: threat monitoring, SIEM alert triage, monthly security report, incident response on-call, and proactive vulnerability alerts.',
    deliverables: [
      'SIEM alert triage & escalation',
      'Monthly threat intelligence report',
      'Vulnerability feed & patch advisory',
      'Incident response (up to 8 hrs/mo)',
      'Quarterly posture review call',
    ],
  },
  {
    id: 'training',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'text-yellow-400',
    borderIdle: 'border-yellow-500/25',
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    tag: 'Teams & Corporates',
    title: 'Security Awareness Training',
    subtitle: 'Your people are your biggest risk',
    duration: 'Half or full day',
    description: 'Live training sessions for employees covering phishing, social engineering, password hygiene, incident reporting, and safe remote work. Arabic & English.',
    deliverables: [
      'Phishing simulation campaign',
      'Live workshop (Arabic/English)',
      'Customized training materials',
      'Post-training quiz & scoring',
      'Certificate of completion',
    ],
  },
  {
    id: 'ir',
    icon: <AlertTriangle className="h-5 w-5" />,
    color: 'text-orange-400',
    borderIdle: 'border-orange-500/25',
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    tag: 'Emergency Available',
    title: 'Incident Response',
    subtitle: 'Breach? Call now, not later.',
    duration: 'As needed',
    description: 'Rapid response to active breaches, ransomware, data leaks, or account compromise. Containment, forensic analysis, root cause identification, and recovery plan.',
    deliverables: [
      'Immediate remote triage',
      'Threat containment & isolation',
      'Forensic timeline reconstruction',
      'Root cause analysis report',
      'Recovery & hardening plan',
    ],
  },
]

interface FormData {
  name: string
  email: string
  company: string
  service: string
  message: string
  preferredDate: string
  preferredTime: string
  website: string // honeypot — must stay empty
}

type SubmitState = 'idle' | 'sending' | 'success' | 'error'

function minDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

function toISO(date: string, time: string) {
  return `${date}T${time}:00+03:00`
}

// Shared input/select class
const inputCls =
  'w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:shadow-[0_0_0_1px_rgba(16,185,129,0.2)] transition-all duration-150 font-mono'

export default function ServicesPage() {
  const [form, setForm] = useState<FormData>({
    name: '', email: '', company: '', service: '', message: '',
    preferredDate: '', preferredTime: '10:00', website: '',
  })
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [meetLink, setMeetLink] = useState('')

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.service || !form.preferredDate) {
      toast.error('Please fill in name, email, service, and preferred date.')
      return
    }
    setSubmitState('sending')
    try {
      const res = await fetch('/api/book-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          service: form.service,
          message: form.message,
          startISO: toISO(form.preferredDate, form.preferredTime),
          durationMins: 45,
          website: form.website, // honeypot
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Booking failed')
      setMeetLink(data.meetLink)
      setSubmitState('success')
      toast.success('Meeting booked! Check your email for the calendar invite.', { duration: 8000 })
    } catch (err: any) {
      setSubmitState('error')
      toast.error(err.message ?? 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white relative overflow-hidden">
      <MatrixBackground />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            'radial-gradient(700px 400px at 10% 0%, rgba(16,185,129,0.04), transparent)',
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
              <Link href="/"><ArrowLeft className="mr-1.5 h-3 w-3" /> Portfolio</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="relative z-10">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 pt-16 pb-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded border border-emerald-800/60 bg-emerald-950/20 px-3 py-1.5 font-mono text-[10px] text-emerald-400 uppercase tracking-widest mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            Available for Hire · Riyadh, KSA
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            <GlitchText text="Security Services" />
          </h1>

          <p className="text-base text-zinc-500 max-w-xl mb-8 leading-relaxed">
            Certified cybersecurity professional based in Riyadh. I help Saudi and GCC businesses find
            vulnerabilities, achieve compliance, and stay protected — in Arabic and English.
          </p>

          {/* Cert tags */}
          <div className="flex flex-wrap gap-2 mb-10">
            {['CEH (pursuing)', 'CompTIA Security+', 'Microsoft Azure Security', 'NCA / SAMA Familiar'].map(cert => (
              <span
                key={cert}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 border border-zinc-800 rounded px-2.5 py-1 bg-zinc-900/50 hover:border-zinc-700 transition-colors"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                {cert}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#inquiry"
              className="inline-flex items-center justify-center gap-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-3 text-sm transition-all duration-200 hover:shadow-[0_0_28px_rgba(16,185,129,0.35)]"
            >
              <Mail className="h-4 w-4" /> Get a Free Quote
            </a>
            <a
              href="tel:+966508501717"
              className="inline-flex items-center justify-center gap-2 rounded border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 font-mono px-5 py-3 text-sm transition-all duration-200"
            >
              <Phone className="h-4 w-4" /> +966 50 850 1717
            </a>
          </div>
        </section>

        {/* ── Separator stat row ────────────────────────────────────────── */}
        <div className="border-y border-zinc-900 bg-zinc-950/50 relative z-10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-zinc-900">
              {[
                { value: '6', label: 'Service types' },
                { value: 'KSA + GCC', label: 'Coverage' },
                { value: 'Arabic / EN', label: 'Languages' },
                { value: '24 h', label: 'Response SLA' },
              ].map(s => (
                <div key={s.label} className="px-6 py-4 text-center">
                  <div className="font-mono text-base font-bold text-zinc-200 mb-0.5">{s.value}</div>
                  <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Services Grid ─────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="flex items-center gap-4 mb-10">
            <div>
              <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Engagements</p>
              <h2 className="text-2xl font-bold text-zinc-100"><GlitchText text="What I Offer" /></h2>
            </div>
            <span className="h-px flex-1 bg-zinc-900 hidden sm:block" />
            <p className="text-[11px] text-zinc-700 font-mono shrink-0 hidden sm:block">
              clear scope · fixed timeline · real deliverables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s) => {
              const accent = ACCENT_COLORS[s.color] ?? { rgb: '52,211,153', hex: '#34d399' }
              return (
                <div
                  key={s.id}
                  className={`group relative flex flex-col rounded-md border ${s.borderIdle} bg-zinc-900/40 overflow-hidden transition-all duration-300 hover:-translate-y-0.5`}
                  style={{
                    '--accent-rgb': accent.rgb,
                  } as React.CSSProperties}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.boxShadow = `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(${accent.rgb},0.2), inset 0 1px 0 rgba(${accent.rgb},0.06)`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = ''
                  }}
                >
                  {/* Top accent line — explicit color */}
                  <span
                    className="absolute top-0 left-0 right-0 h-px opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${accent.hex}, transparent)` }}
                  />

                  <div className="p-5 flex-1 flex flex-col">
                    {/* icon + tag row */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-9 h-9 rounded border border-zinc-800/80 flex items-center justify-center ${s.color} transition-all duration-200 group-hover:scale-105`}
                        style={{ background: `rgba(${accent.rgb}, 0.08)` }}
                      >
                        {s.icon}
                      </div>
                      <span className={`font-mono text-[9px] border rounded px-2 py-0.5 uppercase tracking-widest ${s.badge}`}>
                        {s.tag}
                      </span>
                    </div>

                    {/* title + subtitle */}
                    <h3 className={`text-sm font-semibold text-zinc-100 mb-1 group-hover:${s.color.replace('text-', 'text-')} transition-colors leading-snug`}>
                      {s.title}
                    </h3>
                    <p className="font-mono text-[11px] text-zinc-600 mb-3 leading-snug">{s.subtitle}</p>

                    {/* description */}
                    <p className="text-zinc-500 text-xs mb-4 leading-relaxed flex-1">{s.description}</p>

                    {/* deliverables */}
                    <ul className="space-y-1.5 mb-5">
                      {s.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-xs text-zinc-600">
                          <span
                            className="mt-1.5 h-1 w-1 rounded-full shrink-0"
                            style={{ background: accent.hex, opacity: 0.7 }}
                          />
                          {d}
                        </li>
                      ))}
                    </ul>

                    {/* footer row */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                      <span className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-700">
                        <Clock className="h-3 w-3 shrink-0" />{s.duration}
                      </span>
                      <a
                        href="#inquiry"
                        className={`inline-flex items-center gap-1 font-mono text-[11px] ${s.color} border ${s.borderIdle} rounded px-2.5 py-1 transition-all duration-200 hover:opacity-80`}
                      >
                        Inquire <ChevronRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  {/* Bottom scan line */}
                  <span
                    className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${accent.hex}, transparent)` }}
                  />
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Inquiry / Booking Form ────────────────────────────────────── */}
        <section id="inquiry" className="container mx-auto px-4 pb-20 max-w-2xl">

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded border border-emerald-800/50 bg-emerald-950/20 px-3 py-1.5 font-mono text-[10px] text-emerald-500 uppercase tracking-widest mb-4">
              <FileText className="w-3 h-3" /> Free Consultation
            </div>
            <h2 className="text-3xl font-bold mb-2 tracking-tight">
              <GlitchText text="Request a Quote" />
            </h2>
            <p className="text-zinc-600 text-sm font-mono">
              Tell me what you need. I'll respond within 24 hours with a scoped proposal.
            </p>
          </div>

          {/* Terminal-framed form */}
          <div className="relative rounded-md border border-zinc-800 bg-zinc-900/70 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]">
            {/* Top accent */}
            <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            {/* Title bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800/80 bg-zinc-950/60">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              </div>
              <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                book_consultation.sh
              </span>
            </div>

            <div className="p-6">
              {submitState === 'success' ? (
                <div className="text-center py-10 space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">Meeting Booked</h3>
                  <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                    A calendar invite with a Google Meet link has been sent to your email.
                    Please <strong className="text-white">accept the invite</strong> to confirm your slot.
                  </p>
                  {meetLink && (
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-emerald-500 text-black font-bold px-6 py-3 rounded text-sm hover:bg-emerald-400 transition-colors"
                    >
                      <Phone className="h-4 w-4" /> Open Meeting Link
                    </a>
                  )}
                  <div>
                    <button
                      onClick={() => { setSubmitState('idle'); setMeetLink('') }}
                      className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors font-mono mt-2"
                    >
                      Book another session
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot: hidden from humans, irresistible to bots. Never rendered visibly. */}
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={set('website')}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] text-zinc-500 mb-1.5 uppercase tracking-widest">
                        Your Name <span className="text-emerald-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={set('name')}
                        placeholder="Your full name"
                        className={inputCls}
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-zinc-500 mb-1.5 uppercase tracking-widest">
                        Email <span className="text-emerald-600">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={set('email')}
                        placeholder="you@company.com"
                        className={inputCls}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-zinc-500 mb-1.5 uppercase tracking-widest">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={set('company')}
                      placeholder="Acme Corp Ltd."
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-zinc-500 mb-1.5 uppercase tracking-widest">
                      Service Needed <span className="text-emerald-600">*</span>
                    </label>
                    <select
                      value={form.service}
                      onChange={set('service')}
                      className={inputCls}
                      required
                    >
                      <option value="">Select a service...</option>
                      <option value="Penetration Testing">Penetration Testing</option>
                      <option value="Security Audit (NCA/SAMA/ISO)">Security Audit (NCA/SAMA/ISO)</option>
                      <option value="Microsoft Security Setup (Azure/M365)">Microsoft Security Setup (Azure/M365)</option>
                      <option value="Security Monitoring Retainer">Security Monitoring Retainer</option>
                      <option value="Security Awareness Training">Security Awareness Training</option>
                      <option value="Incident Response">Incident Response</option>
                      <option value="Other / Not Sure">Other / Not Sure</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] text-zinc-500 mb-1.5 uppercase tracking-widest">
                        Preferred Date <span className="text-emerald-600">*</span>
                      </label>
                      <input
                        type="date"
                        value={form.preferredDate}
                        onChange={set('preferredDate')}
                        min={minDate()}
                        className={inputCls}
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-zinc-500 mb-1.5 uppercase tracking-widest">
                        Preferred Time (AST)
                      </label>
                      <select
                        value={form.preferredTime}
                        onChange={set('preferredTime')}
                        className={inputCls}
                      >
                        {['09:00','09:30','10:00','10:30','11:00','11:30','12:00',
                          '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'].map(t => (
                          <option key={t} value={t}>{t} AST</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <p className="font-mono text-[10px] text-zinc-700 -mt-2">
                    45-min session · Google Meet link sent to your email
                  </p>

                  <div>
                    <label className="block font-mono text-[10px] text-zinc-500 mb-1.5 uppercase tracking-widest">
                      Situation Brief
                    </label>
                    <textarea
                      value={form.message}
                      onChange={set('message')}
                      rows={4}
                      placeholder="Brief description of your environment, what you're worried about, any compliance requirements, timeline..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitState === 'sending'}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-3 text-sm rounded transition-all duration-200 hover:shadow-[0_0_24px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                  >
                    {submitState === 'sending' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Booking meeting...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Book Free Consultation
                      </>
                    )}
                  </button>

                  <p className="text-center font-mono text-[10px] text-zinc-700">
                    Google Calendar invite sent immediately · No spam · No obligation
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Trust signals */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { icon: <Clock className="h-3.5 w-3.5" />, label: '24h Response', sub: 'Guaranteed' },
              { icon: <Users className="h-3.5 w-3.5" />, label: 'AR + EN', sub: 'Bilingual' },
              { icon: <Shield className="h-3.5 w-3.5" />, label: 'NDA Available', sub: 'Confidential' },
            ].map(t => (
              <div
                key={t.label}
                className="rounded border border-zinc-800 bg-zinc-950/60 p-3 text-center hover:border-zinc-700 transition-colors"
              >
                <div className="text-emerald-500 flex justify-center mb-2">{t.icon}</div>
                <div className="font-mono text-[11px] font-semibold text-zinc-300">{t.label}</div>
                <div className="font-mono text-[9px] text-zinc-600 mt-0.5 uppercase tracking-widest">{t.sub}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900 py-6 relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest">
            GOODNBAD.EXE © {new Date().getFullYear()}
          </span>
          <div className="flex gap-5">
            {[
              { href: '/',          label: 'Portfolio'      },
              { href: '/security',  label: 'Security Atlas' },
              { href: '/personnel', label: 'Dossier'        },
              { href: 'mailto:alramli.hamzah@gmail.com', label: 'Email' },
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
