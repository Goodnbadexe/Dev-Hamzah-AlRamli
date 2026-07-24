"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { OS_APPS } from "./types"
import { LanguageToggle } from "@/components/language-toggle"
import { MobileNavSheet } from "./MobileNavSheet"
import { getDetectedTimeZone, getUtcOffsetLabel } from "@/lib/breach/time"

// Home entry + all registered OS apps
const NAV_ITEMS = [
  { href: "/", label: "HOME", code: "~" },
  ...OS_APPS.map(app => ({
    href: app.route,
    label: app.id.toUpperCase(),
    code: app.code,
  })),
]

function Clock() {
  const [time, setTime] = useState("")
  const [shortTime, setShortTime] = useState("")
  const [zone, setZone] = useState("")
  const [offset, setOffset] = useState("")

  useEffect(() => {
    const tz = getDetectedTimeZone()
    const tick = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      )
      setShortTime(now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }))
      setOffset(getUtcOffsetLabel(now, tz))
      setZone(`${tz} · ${getUtcOffsetLabel(now, tz)}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="flex items-baseline gap-2 select-none">
      <span
        className="hidden lg:block font-mono text-[9px] uppercase tracking-widest text-zinc-700"
        aria-label="Detected timezone"
      >
        {zone}
      </span>
      {/* Mobile: compact HH:MM + UTC offset chip. Desktop: full HH:MM:SS. */}
      <span className="md:hidden flex items-baseline gap-1.5">
        <span className="font-mono text-[11px] text-zinc-500 tabular-nums" aria-label="Local time">
          {shortTime}
        </span>
        {offset && (
          <span
            className="rounded border border-zinc-800 bg-zinc-900/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-zinc-600"
            aria-label="UTC offset"
          >
            {offset}
          </span>
        )}
      </span>
      <span className="hidden md:block font-mono text-[11px] text-zinc-500 tabular-nums" aria-label="Local time">
        {time}
      </span>
    </span>
  )
}

interface OSTaskbarProps {
  className?: string
}

/**
 * OSTaskbar — the persistent top navigation bar for the Goodnbad OS.
 * Renders the OS identity mark, primary navigation, and system status.
 */
export function OSTaskbar({ className }: OSTaskbarProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 4)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-11 flex items-center px-4 md:px-6 gap-6",
        "border-b transition-colors duration-300",
        scrolled
          ? "border-zinc-800 bg-zinc-950/90 backdrop-blur-md"
          : "border-zinc-900 bg-zinc-950/70 backdrop-blur-sm",
        className
      )}
    >
      {/* Identity mark */}
      <Link
        href="/"
        className="shrink-0 font-mono text-[13px] font-semibold text-emerald-500 hover:text-emerald-400 transition-colors tracking-tight"
      >
        GOODNBAD<span className="text-zinc-500">.EXE</span>
      </Link>

      {/* Separator */}
      <span className="hidden md:block h-4 w-px bg-zinc-800 shrink-0" />

      {/* Primary nav */}
      <nav className="hidden md:flex items-center gap-1 flex-1">
        {NAV_ITEMS.map(({ href, label, code }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px] uppercase tracking-widest transition-colors",
                active
                  ? "text-emerald-400 bg-emerald-950/40"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60"
              )}
            >
              <span className="text-zinc-700 text-[9px]">{code}</span>
              {label}
              {active && (
                <span className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_4px_theme(colors.emerald.500)]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* System status — right side */}
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        {/* Language toggle lives in the mobile sheet below md */}
        <LanguageToggle className="hidden md:inline-flex" />
        <span className="hidden md:flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_theme(colors.emerald.500)] animate-pulse" />
          <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest select-none">
            LIVE
          </span>
        </span>
        <Clock />
        {/* Mobile menu button — opens the full-height nav sheet */}
        <MobileNavSheet className="md:hidden -mr-2" />
      </div>

    </header>
  )
}
