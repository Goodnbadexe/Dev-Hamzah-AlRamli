'use client'

import { useState } from 'react'
import { i18nFallbacks } from '@/lib/i18n/security-content'
import { strings } from '@/lib/i18n/security'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import * as Dialog from '@radix-ui/react-dialog'
import Link from 'next/link'
import { useLanguage } from '@/components/language-provider'
import { MatrixBackground } from '@/components/matrix-background'
import { FullscreenButton } from '@/components/fullscreen'
import { InteractiveHackerElements, FloatingBinaryBackground } from '@/components/interactive-elements'
import { ThreatStats } from '@/components/threat-stats'
import { LiveThreatFeed } from '@/components/live-threat-feed'
import { ThreatGlobe } from '@/components/threat-globe'
import { Shield, Radio, ChevronRight, X } from 'lucide-react'

export function SecurityContent() {
  // Shared, site-wide language state — follows the global toggle in the taskbar.
  const { lang, isAr, dir } = useLanguage()

  const s = strings[lang]
  const attacks = i18nFallbacks.attacks(lang)
  const hackers = i18nFallbacks.hackers(lang)
  const [activeTab, setActiveTab] = useState<'attacks' | 'hackers'>('attacks')

  const attackIconSrc = (title: string) => {
    if (title.toLowerCase().includes('malware') || title.includes('البرمجيات الخبيثة')) return '/icons/attacks/malware.svg'
    if (title.toLowerCase().includes('phishing') || title.includes('التصيد')) return '/icons/attacks/phishing.svg'
    if (title.toLowerCase().includes('ransom') || title.includes('الفدية')) return '/icons/attacks/ransomware.svg'
    if (title.toLowerCase().includes('ddos') || title.includes('حجب الخدمة')) return '/icons/attacks/ddos.svg'
    if (title.toLowerCase().includes('sql') || title.includes('SQL')) return '/icons/attacks/sqli.svg'
    if (title.toLowerCase().includes('xss') || title.includes('XSS')) return '/icons/attacks/xss.svg'
    if (title.toLowerCase().includes('white') || title.includes('البيضاء')) return '/icons/hats/white.svg'
    if (title.toLowerCase().includes('black') || title.includes('السوداء')) return '/icons/hats/black.svg'
    if (title.toLowerCase().includes('gray') || title.includes('الرمادية')) return '/icons/hats/gray.svg'
    if (title.toLowerCase().includes('red') || title.includes('الحمراء')) return '/icons/hats/red.svg'
    if (title.toLowerCase().includes('blue') || title.includes('الزرقاء')) return '/icons/hats/blue.svg'
    return '/favicon.svg'
  }

  const renderGrid = (items: { title: string; summary: string; tags: string[] }[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((it, index) => (
        <Dialog.Root key={it.title}>
          <Dialog.Trigger asChild>
            <div
              className="group relative flex flex-col rounded-md border border-zinc-800 bg-zinc-900/60 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(16,185,129,0.08)] focus:outline-none focus:ring-1 focus:ring-emerald-500/60 card-enter"
              style={{ animationDelay: `${index * 0.07}s` }}
              tabIndex={0}
              role="button"
            >
              {/* top edge glow on hover */}
              <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="p-5 flex flex-col flex-1">
                {/* icon row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                    <img
                      src={attackIconSrc(it.title)}
                      alt="icon"
                      width={18}
                      height={18}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all duration-200" />
                </div>

                {/* title */}
                <h3 className="text-sm font-semibold text-zinc-100 mb-2 group-hover:text-emerald-300 transition-colors leading-snug">
                  {it.title}
                </h3>

                {/* summary */}
                <p className={`text-zinc-500 text-xs leading-relaxed mb-4 flex-1 ${isAr ? 'text-right' : ''}`}>
                  {it.summary}
                </p>

                {/* tags */}
                <div className={`flex flex-wrap gap-1.5 ${isAr ? 'justify-end' : ''}`}>
                  {it.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/8 text-emerald-600 border border-emerald-500/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* bottom scan line */}
              <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent group-hover:via-emerald-500/25 transition-colors duration-300" />
            </div>
          </Dialog.Trigger>

          {/* Modal */}
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
              <div className="relative bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8)]">
                {/* modal title bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/50">
                  <div className="flex items-center gap-2">
                    <img src={attackIconSrc(it.title)} alt="icon" width={16} height={16} />
                    <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest truncate max-w-[280px]">
                      {it.title}
                    </span>
                  </div>
                  <Dialog.Close asChild>
                    <button className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5" aria-label="Close">
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>
                {/* top accent */}
                <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-2">{it.title}</h3>
                  <p className={`text-zinc-400 text-sm leading-relaxed mb-4 ${isAr ? 'text-right' : ''}`}>
                    {it.summary}
                  </p>
                  <div className={`flex flex-wrap gap-1.5 ${isAr ? 'justify-end' : ''}`}>
                    {it.tags.map((t) => (
                      <Badge key={t} className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono text-[10px]">{t}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ))}
    </div>
  )

  return (
    <div
      className="min-h-screen bg-[#050507] text-white relative fullscreen-container"
      dir={dir}
    >
      <MatrixBackground />
      <FloatingBinaryBackground />
      <InteractiveHackerElements />

      {/* Ambient radial glows */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: [
          'radial-gradient(900px 500px at 15% 0%, rgba(16,185,129,0.06), transparent)',
          'radial-gradient(600px 350px at 85% 5%, rgba(147,51,234,0.04), transparent)',
          'radial-gradient(400px 300px at 50% 85%, rgba(16,185,129,0.03), transparent)',
        ].join(', ')
      }} />

      <div className="container mx-auto px-4 py-10 relative z-10">
        <FullscreenButton />

        {/* ── Threat Stats Bar ─────────────────────────────────────────── */}
        <div className="mb-8">
          <ThreatStats />
        </div>

        {/* ── Nav row ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/newlogovector.png"
              alt="Goodnbad.exe"
              width={36}
              height={36}
              className="rounded-full bg-zinc-800/60 p-0.5 ring-1 ring-zinc-700"
            />
            <div>
              <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest leading-none mb-0.5">
                Security Atlas
              </div>
              <div className="font-mono text-xs text-zinc-400">Goodnbad.exe</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-mono text-[11px] text-zinc-500 hover:text-emerald-400 uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              <ChevronRight className="h-3 w-3 rotate-180" />
              Home
            </Link>
          </div>
        </div>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="max-w-2xl mb-14 hero-enter">
          <div className="inline-flex items-center gap-2 rounded border border-emerald-800/60 bg-emerald-950/20 px-3 py-1.5 font-mono text-[10px] text-emerald-400 uppercase tracking-widest mb-5">
            <Shield className="h-3 w-3" />
            Security Atlas
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
            {s.heroTitle}
          </h1>
          <p className="text-zinc-500 text-base leading-relaxed max-w-xl">
            {s.heroDesc}
          </p>
        </div>

        {/* ── ThreatGlobe — hero section ───────────────────────────────── */}
        <div className="relative mb-12 rounded-lg overflow-hidden border border-zinc-800/80 bg-zinc-950/60 shadow-[0_0_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.04)]">
          {/* top accent */}
          <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent z-10" />

          {/* header bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/70 bg-zinc-900/40">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              </div>
              <span className="font-mono text-[11px] font-semibold text-zinc-300 uppercase tracking-widest">
                Global Threat Map
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
                <span className="font-mono text-[10px] text-red-400 uppercase tracking-widest">Live</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-600 hidden sm:block">
                Real-time threat telemetry
              </span>
            </div>
          </div>

          {/* globe */}
          <div className="relative">
            <ThreatGlobe height={380} />
            {/* bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-zinc-950/80 to-transparent pointer-events-none" />
          </div>

          {/* bottom accent */}
          <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />
        </div>

        {/* ── Main 2-col: atlas content + live feed ────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left: tabs + cards */}
          <div className="flex-1 min-w-0">

            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Intelligence Database</span>
              <span className="h-px flex-1 bg-zinc-800" />
            </div>

            <Tabs
              defaultValue="attacks"
              onValueChange={(v: any) => setActiveTab(v)}
            >
              <TabsList className="inline-flex bg-zinc-900/80 border border-zinc-800 rounded-md p-1 mb-8 gap-1">
                <TabsTrigger
                  value="attacks"
                  className="font-mono text-[11px] uppercase tracking-widest px-5 py-2 rounded data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400 data-[state=active]:border data-[state=active]:border-emerald-500/25 text-zinc-500 hover:text-zinc-300 transition-all duration-200"
                >
                  {s.tabAttacks}
                </TabsTrigger>
                <TabsTrigger
                  value="hackers"
                  className="font-mono text-[11px] uppercase tracking-widest px-5 py-2 rounded data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400 data-[state=active]:border data-[state=active]:border-emerald-500/25 text-zinc-500 hover:text-zinc-300 transition-all duration-200"
                >
                  {s.tabHackers}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="attacks" className="mt-0">
                {renderGrid(attacks)}
              </TabsContent>
              <TabsContent value="hackers" className="mt-0">
                {renderGrid(hackers)}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: live feed */}
          <div className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="sticky top-6">
              <div className="flex items-center gap-2 mb-3">
                <Radio className="h-3 w-3 text-red-400 animate-pulse" />
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Live Intel Feed</span>
              </div>
              <div className="rounded-md border border-zinc-800/80 overflow-hidden" style={{ height: '540px' }}>
                <LiveThreatFeed />
              </div>
            </div>
          </div>
        </div>

        {/* ── Case Studies ─────────────────────────────────────────────── */}
        <div className="mt-20 pt-12 border-t border-zinc-900">
          <div className="flex items-center gap-4 mb-10">
            <div>
              <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest block mb-1">
                {activeTab === 'attacks' ? 'Attack Incidents' : 'Threat Actor Cases'}
              </span>
              <h2 className="text-2xl font-bold text-zinc-100">{s.casesTitle}</h2>
            </div>
            <span className="h-px flex-1 bg-zinc-800 hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {([...(activeTab === 'attacks' ? i18nFallbacks.casesAttacks(lang) : i18nFallbacks.casesHackers(lang))]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
              .map((c, index) => (
                <Dialog.Root key={`${c.title}-${c.date}`}>
                  <Dialog.Trigger asChild>
                    <div
                      className="group relative rounded-md border border-zinc-800 bg-zinc-900/50 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] card-enter"
                      style={{ animationDelay: `${index * 0.07}s` }}
                      tabIndex={0}
                      role="button"
                    >
                      <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-300 transition-colors leading-snug pr-3">
                            {c.title}
                          </h3>
                          <span className="shrink-0 font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            {c.type}
                          </span>
                        </div>
                        <div className="font-mono text-[10px] text-zinc-600 mb-2">
                          {new Date(c.date).toLocaleDateString(lang)}
                        </div>
                        <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{c.summary}</p>
                      </div>
                    </div>
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                      <div className="relative bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8)]">
                        <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
                        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/50">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              {c.type}
                            </span>
                            <span className="font-mono text-[10px] text-zinc-500">
                              {new Date(c.date).toLocaleDateString(lang)}
                            </span>
                          </div>
                          <Dialog.Close asChild>
                            <button className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5" aria-label="Close">
                              <X className="h-4 w-4" />
                            </button>
                          </Dialog.Close>
                        </div>
                        <div className="p-5 space-y-4">
                          <h3 className="text-base font-semibold text-white">{c.title}</h3>
                          <p className="text-zinc-400 text-sm leading-relaxed">{c.summary}</p>
                          <div>
                            <div className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest mb-2">
                              {isAr ? 'الدروس' : 'Lessons Learned'}
                            </div>
                            <ul className="space-y-1.5">
                              {c.lessons.map((l: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                                  <span className="mt-1.5 h-1 w-1 rounded-full bg-emerald-500/70 shrink-0" />
                                  {l}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest mb-2">
                              {isAr ? 'التخفيف' : 'Mitigations'}
                            </div>
                            <ul className="space-y-1.5">
                              {c.mitigations.map((m: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                                  <span className="mt-1.5 h-1 w-1 rounded-full bg-zinc-600 shrink-0" />
                                  {m}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="pt-2 border-t border-zinc-800">
                            <Link
                              className="font-mono text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                              href={c.source}
                              target="_blank"
                            >
                              {c.sourceLabel}
                              <ChevronRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              ))}
          </div>
        </div>

        {/* ── Footer CTA ───────────────────────────────────────────────── */}
        <div className="mt-20 pt-12 border-t border-zinc-900">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-2xl">
            <div>
              <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-1">
                Interactive Practice
              </div>
              <p className="text-zinc-400 text-sm">
                Try the terminal CTF on the home page — flag submissions trigger special effects.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 border border-emerald-500/30 rounded px-4 py-2.5 bg-emerald-500/8 hover:bg-emerald-500/15 transition-all duration-200 uppercase tracking-widest"
              >
                Home <ChevronRight className="h-3 w-3" />
              </Link>
              <Link
                href="/test-ctf"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-purple-400 border border-purple-500/30 rounded px-4 py-2.5 bg-purple-500/8 hover:bg-purple-500/15 transition-all duration-200 uppercase tracking-widest"
              >
                CTF <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
