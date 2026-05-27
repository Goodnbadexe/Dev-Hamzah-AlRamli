'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white relative overflow-hidden">
      <MatrixBackground />

      {/* Header */}
      <header className="container mx-auto py-6 px-4 relative z-10">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/newlogovector.png" alt="Goodnbad.exe" width={40} height={40} className="rounded-full bg-zinc-800 p-0.5" />
            <GlitchText text="Goodnbad.exe" className="font-bold text-lg" />
          </Link>
          <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/20" asChild>
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Portfolio</Link>
          </Button>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16 text-center">
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Zap className="w-3 h-3 mr-1" /> Available for Hire
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <GlitchText text="Security Services" />
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Certified cybersecurity professional based in Riyadh. I help Saudi and GCC businesses find vulnerabilities,
            achieve compliance, and stay protected — in Arabic and English.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-4">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> CEH Certified
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> CompTIA Security+
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Microsoft Azure Security
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> NCA / SAMA Familiar
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold" asChild>
              <a href="#inquiry"><Mail className="mr-2 h-4 w-4" /> Get a Free Quote</a>
            </Button>
            <Button size="lg" variant="outline" className="border-zinc-600 text-zinc-300 hover:border-zinc-400" asChild>
              <a href="tel:+966508501717"><Phone className="mr-2 h-4 w-4" /> +966 50 850 1717</a>
            </Button>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3"><GlitchText text="What I Offer" /></h2>
            <p className="text-zinc-400">Every engagement comes with a clear scope, fixed timeline, and real deliverables.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <Card key={s.id} className={`bg-zinc-900/60 border ${s.border} hover:brightness-110 transition-all duration-300 flex flex-col`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <span className={s.color}>{s.icon}</span>
                    <Badge className={`text-[10px] font-mono border ${s.badge}`}>{s.tag}</Badge>
                  </div>
                  <CardTitle className="text-white">{s.title}</CardTitle>
                  <CardDescription className="text-zinc-400 text-sm">{s.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <p className="text-zinc-300 text-sm mb-4 leading-relaxed">{s.description}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-xs text-zinc-400">
                        <CheckCircle2 className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${s.color}`} />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <Clock className="h-3 w-3" /> {s.duration}
                    </div>
                    <Button size="sm" variant="outline" className={`border text-xs ${s.border} ${s.color} hover:opacity-80`} asChild>
                      <a href="#inquiry">Inquire <ChevronRight className="h-3 w-3 ml-1" /></a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Lead Capture Form */}
        <section id="inquiry" className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <FileText className="w-3 h-3 mr-1" /> Free Consultation
              </Badge>
              <h2 className="text-3xl font-bold mb-3"><GlitchText text="Request a Quote" /></h2>
              <p className="text-zinc-400">
                Tell me what you need. I'll respond within 24 hours with a scoped proposal.
              </p>
            </div>

            <Card className="bg-zinc-900/80 border border-zinc-700">
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
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[
                { icon: <Clock className="h-5 w-5" />, label: '24h Response', sub: 'Guaranteed' },
                { icon: <Users className="h-5 w-5" />, label: 'Arabic & English', sub: 'Bilingual' },
                { icon: <Shield className="h-5 w-5" />, label: 'NDA Available', sub: 'Confidential' },
              ].map(t => (
                <div key={t.label} className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4">
                  <div className="text-emerald-400 flex justify-center mb-2">{t.icon}</div>
                  <div className="text-sm font-semibold text-white">{t.label}</div>
                  <div className="text-xs text-zinc-500">{t.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <span>© {new Date().getFullYear()} Hamzah Al-Ramli — Goodnbad.exe</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Portfolio</Link>
            <Link href="/security" className="hover:text-zinc-300 transition-colors">Security Atlas</Link>
            <a href="mailto:alramli.hamzah@gmail.com" className="hover:text-zinc-300 transition-colors">Email</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
