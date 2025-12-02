'use client'

import { useEffect, useState } from 'react'
import { attacks as attacksI18n, hackers as hackersI18n, casesAttacks, casesHackers, i18nFallbacks } from '@/lib/i18n/security-content'
import { strings } from '@/lib/i18n/security'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import * as Dialog from '@radix-ui/react-dialog'
import Link from 'next/link'
import { MatrixBackground } from '@/components/matrix-background'
import { FullscreenButton } from '@/components/fullscreen'
import { InteractiveHackerElements, FloatingBinaryBackground } from '@/components/interactive-elements'

export default function SecurityPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en')
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const n = navigator.language || ''
      if (n.toLowerCase().startsWith('ar')) setLang('ar')
    }
  }, [])

  const s = strings[lang]
  const attacks = i18nFallbacks.attacks(lang)
  const hackers = i18nFallbacks.hackers(lang)
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
      {items.map((it, index) => (
        <Dialog.Root key={it.title}>
          <Dialog.Trigger asChild>
            <Card className="bg-zinc-800/50 border-zinc-700 hover:border-emerald-500/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 animate-card-hover animate-slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <CardHeader>
                <CardTitle className="group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>{it.title}</span>
                  <span aria-hidden>
                    <img src={
                      (it.title.toLowerCase().includes('malware') || it.title.includes('البرمجيات الخبيثة')) ? '/icons/attacks/malware.svg' :
                      (it.title.toLowerCase().includes('phishing') || it.title.includes('التصيد')) ? '/icons/attacks/phishing.svg' :
                      (it.title.toLowerCase().includes('ransom') || it.title.includes('الفدية')) ? '/icons/attacks/ransomware.svg' :
                      (it.title.toLowerCase().includes('ddos') || it.title.includes('حجب الخدمة')) ? '/icons/attacks/ddos.svg' :
                      (it.title.toLowerCase().includes('sql') || it.title.includes('SQL')) ? '/icons/attacks/sqli.svg' :
                      (it.title.toLowerCase().includes('xss') || it.title.includes('XSS')) ? '/icons/attacks/xss.svg' :
                      (it.title.toLowerCase().includes('white') || it.title.includes('البيضاء')) ? '/icons/hats/white.svg' :
                      (it.title.toLowerCase().includes('black') || it.title.includes('السوداء')) ? '/icons/hats/black.svg' :
                      (it.title.toLowerCase().includes('gray') || it.title.includes('الرمادية')) ? '/icons/hats/gray.svg' :
                      (it.title.toLowerCase().includes('red') || it.title.includes('الحمراء')) ? '/icons/hats/red.svg' :
                      (it.title.toLowerCase().includes('blue') || it.title.includes('الزرقاء')) ? '/icons/hats/blue.svg' : '/favicon.svg'
                    } alt="icon" width={24} height={24} className="transition-transform duration-300 group-hover:scale-110" />
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
            <Dialog.Close asChild>
              <div className="fixed inset-0 bg-black/50" />
            </Dialog.Close>
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
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white relative fullscreen-container" lang={lang} dir={lang==='ar'?'rtl':'ltr'}>
      <MatrixBackground />
      <FloatingBinaryBackground />
      <InteractiveHackerElements />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(1200px 600px at 20% 0%, rgba(16,185,129,0.08), transparent), radial-gradient(800px 400px at 80% 10%, rgba(147,51,234,0.06), transparent)'
      }} />
      <div className="container mx-auto px-4 py-12 relative z-10 animate-slide-in-up">
        <FullscreenButton />
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/images/logo-green.png" alt="Goodnbad.exe" width={40} height={40} className="rounded-full" />
            <img src="/images/hacker-avatar.svg" alt="Hamzah" width={40} height={40} className="rounded-full" />
          </div>
          <Link href="/" className="text-emerald-400">{lang==='ar'?'الصفحة الرئيسية':'Home'}</Link>
        </div>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge className="mb-6 bg-emerald-500/10 text-emerald-500 border-none animate-slide-in-up">Security Atlas</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-in-up" style={{animationDelay: '0.1s'}}>{s.heroTitle}</h1>
          <p className="text-zinc-400 text-lg mb-8 animate-slide-in-up" style={{animationDelay: '0.2s'}}>{s.heroDesc}</p>
          <div className="mt-8 flex items-center justify-center gap-4 animate-slide-in-up" style={{animationDelay: '0.3s'}}>
            <span className="text-zinc-400 text-sm">{s.switchLabel}:</span>
            <div className="flex gap-3">
              <button 
                onClick={() => setLangPersist('en')} 
                className={`px-4 py-2 rounded-lg border transition-all duration-300 ${lang==='en'?'border-emerald-500 text-emerald-400 bg-emerald-500/10':'border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLangPersist('ar')} 
                className={`px-4 py-2 rounded-lg border transition-all duration-300 ${lang==='ar'?'border-emerald-500 text-emerald-400 bg-emerald-500/10':'border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
              >
                AR
              </button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="attacks" className="mt-12" onValueChange={(v:any)=>setActiveTab(v)}>
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-zinc-800/50 mb-12">
            <TabsTrigger value="attacks" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 transition-all duration-300">{s.tabAttacks}</TabsTrigger>
            <TabsTrigger value="hackers" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 transition-all duration-300">{s.tabHackers}</TabsTrigger>
          </TabsList>
          <TabsContent value="attacks" className="mt-8">
            {renderGrid(attacks)}
          </TabsContent>
          <TabsContent value="hackers" className="mt-8">
            {renderGrid(hackers)}
          </TabsContent>
        </Tabs>

        <div className="mt-20">
          <h2 className="text-3xl font-semibold mb-8 text-center animate-slide-in-up">{s.casesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {([... (activeTab==='attacks' ? i18nFallbacks.casesAttacks(lang) : i18nFallbacks.casesHackers(lang))]
              .sort((a,b)=> new Date(b.date).getTime()-new Date(a.date).getTime()))
              .map((c, index) => (
                <Dialog.Root key={`${c.title}-${c.date}`}>
                  <Dialog.Trigger asChild>
                    <Card className="bg-zinc-800/50 border-zinc-700 hover:border-emerald-500/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 animate-card-hover animate-slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
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
                          {c.lessons.map((l: string,i: number)=>(<li key={i}>• {l}</li>))}
                        </ul>
                      </div>
                      <div className="mb-3">
                        <div className="text-emerald-400 font-medium mb-1">{lang==='ar'?'التخفيف':'Mitigations'}</div>
                        <ul className="space-y-1 text-zinc-300 text-sm">
                          {c.mitigations.map((m: string,i: number)=>(<li key={i}>• {m}</li>))}
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

        <div className="mt-24 text-center text-sm text-zinc-400 animate-slide-in-up">
          <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="text-emerald-400 font-mono text-sm mb-3">
              [INTERACTIVE_PRACTICE_AVAILABLE]
            </div>
            <p className="text-zinc-300 mb-4">
              Looking for interactive practice? Try the terminal CTF on the home page and watch for special effects on successful flag submissions.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-300 group" 
                href="/"
              >
                <span className="group-hover:text-emerald-300">Go to Home</span>
              </Link>
              <Link 
                className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-400 hover:bg-purple-500/20 transition-all duration-300 group" 
                href="/test-ctf"
              >
                <span className="group-hover:text-purple-300">Try CTF</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}