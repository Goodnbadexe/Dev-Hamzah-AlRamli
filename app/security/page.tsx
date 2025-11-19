'use client'

import { useEffect, useState } from 'react'
import { attacks as attacksI18n, hackers as hackersI18n, casesAttacks, casesHackers } from '@/lib/i18n/security-content'
import { strings } from '@/lib/i18n/security'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import * as Dialog from '@radix-ui/react-dialog'
import Link from 'next/link'
import { MatrixBackground } from '@/components/matrix-background'

export default function SecurityPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en')
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const n = navigator.language || ''
      if (n.toLowerCase().startsWith('ar')) setLang('ar')
    }
  }, [])

  const s = strings[lang]
  const attacks = attacksI18n[lang]
  const hackers = hackersI18n[lang]
  const [activeTab, setActiveTab] = useState<'attacks'|'hackers'>('attacks')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('security_lang') as 'en'|'ar'|null
      if (saved) setLang(saved)
    } catch {}
  }, [])

  const setLangPersist = (l: 'en'|'ar') => {
    setLang(l)
    try { localStorage.setItem('security_lang', l) } catch {}
  }

  const renderGrid = (items: { title: string; summary: string; tags: string[] }[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((it) => (
        <Dialog.Root key={it.title}>
          <Dialog.Trigger asChild>
            <Card className="bg-zinc-800/50 border-zinc-700 hover:border-emerald-500/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <CardHeader>
                <CardTitle className="group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>{it.title}</span>
                  <span aria-hidden>
                    {it.title.includes('Malware') ? '🦠' : it.title.includes('Phishing') ? '🎣' : it.title.includes('Ransomware') ? '🔐' : it.title.includes('Password') ? '🔑' : it.title.includes('DDoS') ? '🌊' : it.title.includes('SQL') ? '🧩' : it.title.includes('XSS') ? '💬' : '🔎'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-zinc-300 mb-3 ${lang==='ar'?'text-right':''}`}>{it.summary}</p>
                <div className={`flex flex-wrap gap-2 ${lang==='ar'?'justify-end':''}`}>
                  {it.tags.map((t) => (
                    <Badge key={t} className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Dialog.Trigger>
          <Dialog.Content className="fixed inset-0 flex items-center justify-center">
            <div className="bg-zinc-900 border border-emerald-500/30 rounded p-6 max-w-lg mx-4">
              <h3 className="text-xl font-semibold mb-2">{it.title}</h3>
              <p className={`text-zinc-300 mb-3 ${lang==='ar'?'text-right':''}`}>{it.summary}</p>
              <div className={`flex flex-wrap gap-2 mb-3 ${lang==='ar'?'justify-end':''}`}>
                {it.tags.map((t) => (
                  <Badge key={t} className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">{t}</Badge>
                ))}
              </div>
              <div className="mt-4 text-right">
                <Dialog.Close asChild>
                  <button className="border border-zinc-700 px-3 py-1 rounded">{lang==='ar'?'إغلاق':'Close'}</button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white relative" lang={lang} dir={lang==='ar'?'rtl':'ltr'}>
      <MatrixBackground />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(1200px 600px at 20% 0%, rgba(16,185,129,0.08), transparent), radial-gradient(800px 400px at 80% 10%, rgba(147,51,234,0.06), transparent)'
      }} />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src="/images/logo-green.png" alt="Goodnbad.exe" width={40} height={40} className="rounded-full" />
            <img src="/placeholder-user.jpg" alt="Hamzah" width={40} height={40} className="rounded-full" />
          </div>
          <Link href="/" className="text-emerald-400">{lang==='ar'?'الصفحة الرئيسية':'Home'}</Link>
        </div>
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-500 border-none">Security Atlas</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{s.heroTitle}</h1>
          <p className="text-zinc-400">{s.heroDesc}</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-zinc-400 text-sm">{s.switchLabel}:</span>
            <div className="flex gap-2">
              <button onClick={() => setLangPersist('en')} className={`px-3 py-1 rounded border ${lang==='en'?'border-emerald-500 text-emerald-400':'border-zinc-700 text-zinc-300'}`}>EN</button>
              <button onClick={() => setLangPersist('ar')} className={`px-3 py-1 rounded border ${lang==='ar'?'border-emerald-500 text-emerald-400':'border-zinc-700 text-zinc-300'}`}>AR</button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="attacks" className="mt-4" onValueChange={(v:any)=>setActiveTab(v)}>
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-zinc-800/50">
            <TabsTrigger value="attacks">{s.tabAttacks}</TabsTrigger>
            <TabsTrigger value="hackers">{s.tabHackers}</TabsTrigger>
          </TabsList>
          <TabsContent value="attacks" className="mt-8">
            {renderGrid(attacks)}
          </TabsContent>
          <TabsContent value="hackers" className="mt-8">
            {renderGrid(hackers)}
          </TabsContent>
        </Tabs>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">{s.casesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {([... (activeTab==='attacks' ? casesAttacks[lang] : casesHackers[lang])]
              .sort((a,b)=> new Date(b.date).getTime()-new Date(a.date).getTime()))
              .map((c) => (
                <Dialog.Root key={`${c.title}-${c.date}`}>
                  <Dialog.Trigger asChild>
                    <Card className="bg-zinc-800/50 border-zinc-700 hover:border-emerald-500/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{c.title}</span>
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">{c.type}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-zinc-400 text-sm mb-2">{new Date(c.date).toLocaleDateString(lang)}</div>
                        <p className="text-zinc-300">{c.summary}</p>
                      </CardContent>
                    </Card>
                  </Dialog.Trigger>
                  <Dialog.Content className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-zinc-900 border border-emerald-500/30 rounded p-6 max-w-lg mx-4">
                      <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
                      <div className="text-zinc-400 text-sm mb-2">{c.type} • {new Date(c.date).toLocaleDateString(lang)}</div>
                      <div className="mb-3">
                        <div className="text-emerald-400 font-medium mb-1">{lang==='ar'?'الدروس':'Lessons'}</div>
                        <ul className="space-y-1 text-zinc-300 text-sm">
                          {c.lessons.map((l,i)=>(<li key={i}>• {l}</li>))}
                        </ul>
                      </div>
                      <div className="mb-3">
                        <div className="text-emerald-400 font-medium mb-1">{lang==='ar'?'التخفيف':'Mitigations'}</div>
                        <ul className="space-y-1 text-zinc-300 text-sm">
                          {c.mitigations.map((m,i)=>(<li key={i}>• {m}</li>))}
                        </ul>
                      </div>
                      <Link className="text-emerald-400 text-sm" href={c.source} target="_blank">{c.sourceLabel}</Link>
                      <div className="mt-4 text-right">
                        <Dialog.Close asChild>
                          <button className="border border-zinc-700 px-3 py-1 rounded">{lang==='ar'?'إغلاق':'Close'}</button>
                        </Dialog.Close>
                      </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Root>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-zinc-400">
          <span>Looking for interactive practice? Try the terminal CTF on the home page and watch for special effects on successful flag submissions.</span>
          <div className="mt-3">
            <Link className="text-emerald-400" href="/">Go to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}