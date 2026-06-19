"use client"

import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

/**
 * Compact EN ⇄ العربية pill. Drops into the taskbar (and anywhere site-wide).
 * Writes to the shared language context, so the choice follows the visitor
 * across every page — including the /subscribe funnel.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage()
  const isAr = lang === "ar"
  return (
    <div
      className={cn(
        "inline-flex shrink-0 rounded-full border border-zinc-700 bg-zinc-900/70 p-0.5 font-mono text-[10px] leading-none",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLang("ar")}
        aria-pressed={isAr}
        className={cn(
          "rounded-full px-2 py-1 transition-colors",
          isAr ? "bg-emerald-500 font-semibold text-emerald-950" : "text-zinc-400 hover:text-zinc-200",
        )}
      >
        ع
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={!isAr}
        className={cn(
          "rounded-full px-2 py-1 transition-colors",
          !isAr ? "bg-emerald-500 font-semibold text-emerald-950" : "text-zinc-400 hover:text-zinc-200",
        )}
      >
        EN
      </button>
    </div>
  )
}
