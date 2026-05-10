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
  Mail, Phone, Clock, Star, ChevronRight, FileText
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
    price: 'From SAR 2,500',
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
    price: 'From SAR 1,800',
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
    price: 'From SAR 2,200',
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
    price: 'From SAR 3,000/mo',
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
    price: 'From SAR 1,500',
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
    price: 'From SAR 4,000',
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

const PACKAGES = [
  {
    name: 'Startup Shield',
    price: 'SAR 3,500',
    period: 'one-time',
    color: 'border-zinc-700',
    highlight: false,
    description: 'For small businesses and startups getting security-serious for the first time.',
    includes: [
      'Security Audit (basic scope)',
      'Microsoft 365 hardening checklist',
      'Employee phishing awareness (1 session)',
      'Executive risk report',
      '30-day email support',
    ],
  },
  {
    name: 'Business Armor',
    price: 'SAR 6,800',
    period: 'one-time',
    color: 'border-emerald-500/50',
    highlight: true,
    badge: 'Most Popular',
    description: 'Full security assessment + implementation for growing businesses.',
    includes: [
      'Penetration test (web + network)',
      'Full security audit (NCA/SAMA mapped)',
      'Microsoft Entra ID + Sentinel setup',
      'Team training session (up to 20 staff)',
      '60-day remediation support',
    ],
  },
  {
    name: 'Enterprise Guard',
    price: 'Custom',
    period: 'retainer',
    color: 'border-purple-500/30',
    highlight: false,
    description: 'Ongoing security partnership for larger organizations.',
    includes: [
      'Everything in Business Armor',
      'Monthly security monitoring',
      'Quarterly penetration tests',
      'Dedicated incident response SLA',
      'Compliance reporting (NCA/SAMA/ISO)',
    ],
  },
]

interface FormData {
  name: string
  email: string
  company: string
  service: string
  message: string
}

export default function ServicesPage() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', company: '', service: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.service) {
      toast.error('Please fill in name, email, and service.')
      return
    }
    setSending(true)
    // Mailto fallback — replace with a real form backend (Formspree, Resend, etc.)
    const subject = encodeURIComponent(`[Services Inquiry] ${form.service} — ${form.company || form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nService: ${form.service}\n\nMessage:\n${form.message}`
    )
    window.open(`mailto:alramli.hamzah@gmail.com?subject=${subject}&body=${body}`)
    toast.success('Opening your email client — send the message to complete your inquiry.', { duration: 6000 })
    setSending(false)
    setForm({ name: '', email: '', company: '', service: '', message: '' })
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
                    <div>
                      <div className="text-lg font-bold text-white font-mono">{s.price}</div>
                      <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                        <Clock className="h-3 w-3" /> {s.duration}
                      </div>
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

        {/* Packages */}
        <section className="container mx-auto px-4 py-16 bg-zinc-900/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3"><GlitchText text="Bundled Packages" /></h2>
            <p className="text-zinc-400">Save money by bundling services. Best value for serious security needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PACKAGES.map((pkg) => (
              <Card key={pkg.name} className={`bg-zinc-900/80 border ${pkg.color} flex flex-col ${pkg.highlight ? 'ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-500/10' : ''}`}>
                <CardHeader>
                  {pkg.highlight && (
                    <div className="flex justify-center mb-3">
                      <Badge className="bg-emerald-500 text-black text-xs font-bold px-3">
                        <Star className="h-3 w-3 mr-1" /> {pkg.badge}
                      </Badge>
                    </div>
                  )}
                  <CardTitle className="text-center text-white">{pkg.name}</CardTitle>
                  <div className="text-center mt-2">
                    <span className="text-3xl font-bold font-mono text-emerald-400">{pkg.price}</span>
                    <span className="text-zinc-500 text-sm ml-1">/ {pkg.period}</span>
                  </div>
                  <CardDescription className="text-center text-zinc-400 text-sm mt-2">{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <ul className="space-y-3 flex-1">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-6 ${pkg.highlight ? 'bg-emerald-500 hover:bg-emerald-600 text-black font-bold' : 'border border-zinc-600 bg-transparent text-zinc-300 hover:border-zinc-400'}`}
                    asChild
                  >
                    <a href="#inquiry">Get This Package</a>
                  </Button>
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
                Tell me what you need. I'll respond within 24 hours with a scoped proposal and price.
              </p>
            </div>

            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-widest">Your Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Hamzah Al-Ramli"
                        className="w-full bg-black border border-zinc-700 rounded px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-widest">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@company.com"
                        className="w-full bg-black border border-zinc-700 rounded px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-widest">Company / Organization</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                      placeholder="Acme Corp Ltd."
                      className="w-full bg-black border border-zinc-700 rounded px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-widest">Service Needed *</label>
                    <select
                      value={form.service}
                      onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                      className="w-full bg-black border border-zinc-700 rounded px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono"
                      required
                    >
                      <option value="">Select a service...</option>
                      <option value="Penetration Testing">Penetration Testing</option>
                      <option value="Security Audit (NCA/SAMA/ISO)">Security Audit (NCA/SAMA/ISO)</option>
                      <option value="Microsoft Security Setup">Microsoft Security Setup (Azure/M365)</option>
                      <option value="Security Monitoring Retainer">Security Monitoring Retainer</option>
                      <option value="Security Awareness Training">Security Awareness Training</option>
                      <option value="Incident Response">Incident Response</option>
                      <option value="Startup Shield Package">Startup Shield Package</option>
                      <option value="Business Armor Package">Business Armor Package</option>
                      <option value="Enterprise Guard Package">Enterprise Guard — Custom Quote</option>
                      <option value="Other / Not Sure">Other / Not Sure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-widest">Tell Me About Your Situation</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      rows={4}
                      placeholder="Brief description of your environment, what you're worried about, any compliance requirements, timeline..."
                      className="w-full bg-black border border-zinc-700 rounded px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 text-base"
                  >
                    {sending ? 'Sending...' : '→ Send Inquiry'}
                  </Button>

                  <p className="text-center text-xs text-zinc-600">
                    I respond within 24 hours. No spam, no obligation.
                  </p>
                </form>
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
