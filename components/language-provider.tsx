"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

export type Lang = "ar" | "en"

type LanguageContextValue = {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  isAr: boolean
  /** Pick the right string for the active language. */
  t: (ar: string, en: string) => string
  dir: "rtl" | "ltr"
}

const STORAGE_KEY = "gnb_language"
const LanguageContext = createContext<LanguageContextValue | null>(null)

/**
 * Site-wide language state. SSR renders English (matching <html lang="en">);
 * the client corrects to the stored preference or the browser language on mount,
 * then reflects the choice to <html lang/dir> and localStorage. This is the single
 * source of truth so the main site and the /subscribe funnel stay in sync.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")

  // Mount: restore stored choice, else fall back to browser Arabic detection.
  useEffect(() => {
    let initial: Lang | null = null
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === "ar" || stored === "en") initial = stored
    } catch {}
    if (!initial && typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("ar")) {
      initial = "ar"
    }
    if (initial && initial !== lang) setLangState(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reflect to <html lang/dir> + persist on every change.
  useEffect(() => {
    const el = document.documentElement
    el.lang = lang
    el.dir = lang === "ar" ? "rtl" : "ltr"
    try { localStorage.setItem(STORAGE_KEY, lang) } catch {}
  }, [lang])

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const toggle = useCallback(() => setLangState((p) => (p === "ar" ? "en" : "ar")), [])

  const isAr = lang === "ar"
  const value: LanguageContextValue = {
    lang,
    setLang,
    toggle,
    isAr,
    t: (ar, en) => (isAr ? ar : en),
    dir: isAr ? "rtl" : "ltr",
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

/** Read the active language. Safe outside the provider (defaults to English). */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    return { lang: "en", setLang: () => {}, toggle: () => {}, isAr: false, t: (_ar, en) => en, dir: "ltr" }
  }
  return ctx
}
