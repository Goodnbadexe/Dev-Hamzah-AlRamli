'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GlitchText } from '@/components/glitch-text'
import { MatrixBackground } from '@/components/matrix-background'
import { toast } from 'sonner'
import {
  Shield, Search, Monitor, BookOpen, ArrowLeft,
  CheckCircle2, Zap, Users, AlertTriangle, Lock,
  Mail, Phone, Clock, ChevronRight, FileText
} from 'lucide-react'

const SERVICES = [
  {
    id: 'pentest',
    icon: <Search className="h-6 w-6" />,
    color: 'text-red-400',
    border: 'border-red-500/30',
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
    icon: <Shield className="h-6 w-6" />,
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
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
    icon: <Lock className="h-6 w-6" />,
    color: 'text-blue-400',
    border: 'border-blue-500/30',
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
    icon: <Monitor className="h-6 w-6" />,
    color: 'text-purple-400',
    border: 'border-purple-500/30',
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
    icon: <BookOpen className="h-6 w-6" />,
    color: 'text-yellow-400',
    border: 'border-yellow-500/30',
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
    icon: <AlertTriangle className="h-6 w-6" />,
    color: 'text-orange-400',
    border: 'border-orange-500/30',
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
}

type SubmitState = 'idle' | 'sending' | 'success' | 'error'

// Earliest selectable date: tomorrow
function minDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

// Build ISO datetime string from date + time inputs (AST = UTC+3)
function toISO(date: string, time: string) {
  return `${date}T${time}:00+03:00`
}

export default function ServicesPage() {
  const [form, setForm] = useState<FormData>({
    name: '', email: '', company: '', service: '', message: '',
    preferredDate: '', preferredTime: '10:00',
  })
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [meetLink, setMeetLink] = useState('')

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
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

      {/* Header */}
      <header className="container mx-auto py-5 px-4 relative z-10 border-b border-zinc-900">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/images/newlogovector.png" alt="Goodnbad.exe" width={34} height={34} className="rounded-full bg-zinc-800/60 p-0.5 ring-1 ring-zinc-700 group-hover:ring-emerald-800 transition-all" />
            <GlitchText text="Goodnbad.exe" className="font-mono font-semibold text-sm text-emerald-400" />
          </Link>
          <Button variant="ghost" size="sm" className="border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 font-mono text-xs" asChild>
            <Link href="/"><ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> PORTFOLIO</Link>
          </Button>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="container mx-auto px-4 pt-16 pb-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded border border-emerald-800/60 bg-emerald-950/25 px-3 py-1.5 font-mono text-[10px] text-emerald-400 uppercase tracking-widest mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_4px_theme(colors.emerald.500)]" />
            Available for Hire
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <GlitchText text="Security Services" />
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mb-8 leading-relaxed">
            Certified cybersecurity professional based in Riyadh. I help Saudi and GCC businesses find vulnerabilities,
            achieve compliance, and stay protected — in Arabic and English.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {["CEH (pursuing)", "CompTIA Security+", "Microsoft Azure Security", "NCA / SAMA Familiar"].map(cert => (
              <span key={cert} className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 border border-zinc-800 rounded px-2.5 py-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />{cert}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#inquiry"
              className="inline-flex items-center justify-center gap-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-3 text-sm transition-all duration-200 hover:shadow-[0_0_24px_rgba(16,185,129,0.35)]"
            >
              <Mail className="h-4 w-4" /> Get a Free Quote
            </a>
            <a
              href="tel:+966508501717"
              className="inline-flex items-center justify-center gap-2 rounded border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white font-mono px-5 py-3 text-sm transition-all duration-200"
            >
              <Phone className="h-4 w-4" /> +966 50 850 1717
            </a>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container mx-auto px-4 pb-16 max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <div>
              <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Engagements</p>
              <h2 className="text-2xl font-bold text-zinc-100"><GlitchText text="What I Offer" /></h2>
            </div>
            <span className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent hidden sm:block" />
            <p className="text-xs text-zinc-600 font-mono shrink-0 hidden sm:block">clear scope · fixed timeline · real deliverables</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <div
                key={s.id}
                className={`group relative flex flex-col rounded-md border ${s.border} bg-zinc-900/50 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]`}
              >
                {/* Top accent line */}
                <span className={`absolute top-0 left-0 right-0 h-px opacity-60 group-hover:opacity-100 transition-opacity`}
                  style={{ background: `linear-gradient(90deg, transparent, currentColor, transparent)` }}
                />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`${s.color} transition-transform duration-200 group-hover:scale-110`}>{s.icon}</span>
                    <span className={`font-mono text-[9px] border rounded px-2 py-0.5 uppercase tracking-widest ${s.badge}`}>{s.tag}</span>
                  </div>
                  <h3 className="text-base font-semibold text-zinc-100 mb-1">{s.title}</h3>
                  <p className="font-mono text-[11px] text-zinc-500 mb-3">{s.subtitle}</p>
                  <p className="text-zinc-400 text-xs mb-4 leading-relaxed flex-1">{s.description}</p>
                  <ul className="space-y-1.5 mb-5">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-xs text-zinc-500">
                        <span className={`mt-1.5 h-1 w-1 rounded-full shrink-0 ${s.color.replace('text-', 'bg-').replace('-400', '-500')}`} />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800/70">
                    <span className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-600">
                      <Clock className="h-3 w-3" />{s.duration}
                    </span>
                    <a
                      href="#inquiry"
                      className={`inline-flex items-center gap-1 font-mono text-[11px] ${s.color} border ${s.border} rounded px-2.5 py-1 transition-all duration-200 hover:opacity-80`}
                    >
                      Inquire <ChevronRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lead Capture Form */}
        <section id="inquiry" className="container mx-auto px-4 py-16 max-w-2xl">
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded border border-emerald-800/50 bg-emerald-950/20 px-3 py-1.5 font-mono text-[10px] text-emerald-500 uppercase tracking-widest mb-4">
                <FileText className="w-3 h-3" /> Free Consultation
              </div>
              <h2 className="text-3xl font-bold mb-2"><GlitchText text="Request a Quote" /></h2>
              <p className="text-zinc-500 text-sm">
                Tell me what you need. I'll respond within 24 hours with a scoped proposal.
              </p>
            </div>

            <Card className="bg-zinc-900/70 border border-zinc-800 shadow-[0_0_60px_rgba(0,0,0,0.4)]">
              <CardContent className="pt-6">
                {submitState === 'success' ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white">Meeting Booked!</h3>
                    <p className="text-zinc-400 text-sm max-w-sm mx-auto">
                      A calendar invite with a Google Meet link has been sent to your email.
                      Please <strong className="text-white">accept the invite</strong> to confirm your slot.
                    </p>
                    {meetLink && (
                      <a
                        href={meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-500 text-black font-bold px-6 py-3 rounded text-sm"
                      >
                        <Phone className="h-4 w-4" /> Open Meeting Link
                      </a>
                    )}
                    <div>
                      <button
                        onClick={() => { setSubmitState('idle'); setMeetLink('') }}
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors mt-2"
                      >
                        Book another session
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-widest">Your Name *</label>
                        <input type="text" value={form.name} onChange={set('name')} placeholder="Your full name"
                          className="w-full bg-black border border-zinc-700 rounded px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono" required />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-widest">Email *</label>
                        <input type="email" value={form.email} onChange={set('email')} placeholder="you@company.com"
                          className="w-full bg-black border border-zinc-700 rounded px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono" required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-widest">Company / Organization</label>
                      <input type="text" value={form.company} onChange={set('company')} placeholder="Acme Corp Ltd."
                        className="w-full bg-black border border-zinc-700 rounded px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono" />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-widest">Service Needed *</label>
                      <select value={form.service} onChange={set('service')}
                        className="w-full bg-black border border-zinc-700 rounded px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono" required>
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

                    {/* Preferred meeting time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-widest">Preferred Date *</label>
                        <input type="date" value={form.preferredDate} onChange={set('preferredDate')} min={minDate()}
                          className="w-full bg-black border border-zinc-700 rounded px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono" required />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-widest">Preferred Time (AST)</label>
                        <select value={form.preferredTime} onChange={set('preferredTime')}
                          className="w-full bg-black border border-zinc-700 rounded px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono">
                          {['09:00','09:30','10:00','10:30','11:00','11:30','12:00',
                            '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'].map(t => (
                            <option key={t} value={t}>{t} AST</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-600 font-mono -mt-2">45-minute session · Google Meet link sent to your email</p>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-widest">Tell Me About Your Situation</label>
                      <textarea value={form.message} onChange={set('message')} rows={4}
                        placeholder="Brief description of your environment, what you're worried about, any compliance requirements, timeline..."
                        className="w-full bg-black border border-zinc-700 rounded px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono resize-none" />
                    </div>

                    <Button type="submit" disabled={submitState === 'sending'}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 text-base">
                      {submitState === 'sending' ? (
                        <span className="flex items-center gap-2 justify-center">
                          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Booking meeting...
                        </span>
                      ) : '→ Book Free Consultation'}
                    </Button>

                    <p className="text-center text-xs text-zinc-600">
                      You'll receive a Google Calendar invite + Meet link immediately. No spam, no obligation.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Trust signals */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: <Clock className="h-4 w-4" />, label: '24h Response', sub: 'Guaranteed' },
                { icon: <Users className="h-4 w-4" />, label: 'Arabic & English', sub: 'Bilingual' },
                { icon: <Shield className="h-4 w-4" />, label: 'NDA Available', sub: 'Confidential' },
              ].map(t => (
                <div key={t.label} className="rounded-md border border-zinc-800 bg-zinc-950/50 p-3 text-center">
                  <div className="text-emerald-500 flex justify-center mb-2">{t.icon}</div>
                  <div className="font-mono text-xs font-semibold text-zinc-200">{t.label}</div>
                  <div className="font-mono text-[10px] text-zinc-600 mt-0.5">{t.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 relative z-10 mt-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest">
            GOODNBAD.EXE © {new Date().getFullYear()}
          </span>
          <div className="flex gap-5">
            {[
              { href: "/",         label: "Portfolio"      },
              { href: "/security", label: "Security Atlas" },
              { href: "/personnel",label: "Dossier"        },
              { href: "mailto:alramli.hamzah@gmail.com", label: "Email" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="font-mono text-[10px] text-zinc-700 hover:text-zinc-400 uppercase tracking-widest transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
