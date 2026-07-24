"use client"

/**
 * MobileNavSheet — the < 768px navigation for GOODNBAD.EXE.
 *
 * A hamburger trigger in the taskbar opens a full-height right drawer with
 * all OS modules as large touch rows, plus the language toggle, LIVE status
 * and the full detected-timezone readout. Built on Radix Dialog so focus
 * trapping, Escape/backdrop dismissal, aria-expanded/aria-controls and body
 * scroll-lock all come for free.
 *
 * z-index: overlay/content sit at z-[60] — deliberately BELOW the breach
 * alert layers (z-[70]/z-[80] in components/breach/BreachProvider.tsx).
 */

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as Dialog from "@radix-ui/react-dialog"
import { Menu, X, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { OS_APPS } from "./types"
import { LanguageToggle } from "@/components/language-toggle"
import { getDetectedTimeZone, getUtcOffsetLabel } from "@/lib/breach/time"

const SHEET_ID = "os-mobile-nav-sheet"

const NAV_ITEMS = [
  { href: "/", code: "~", label: "HOME", sub: "Desktop · Threat surface" },
  ...OS_APPS.map(app => ({
    href: app.route,
    code: app.code,
    label: app.id.toUpperCase(),
    sub: app.label,
  })),
]

function TimezoneReadout() {
  const [zone, setZone] = useState("")
  useEffect(() => {
    const tz = getDetectedTimeZone()
    setZone(`${tz} · ${getUtcOffsetLabel(new Date(), tz)}`)
  }, [])
  return (
    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600" aria-label="Detected timezone">
      {zone}
    </span>
  )
}

export function MobileNavSheet({ className }: { className?: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the sheet whenever the route changes (link tapped).
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-controls={SHEET_ID}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded text-zinc-400 transition-colors",
            "hover:text-zinc-100 hover:bg-zinc-900/70",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400",
            className
          )}
        >
          <Menu className="h-5 w-5" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            "motion-reduce:animate-none"
          )}
        />
        <Dialog.Content
          id={SHEET_ID}
          aria-describedby={undefined}
          className={cn(
            "fixed inset-y-0 right-0 z-[60] flex h-full w-[min(20rem,88vw)] flex-col",
            "border-l border-zinc-800 bg-zinc-950/95 backdrop-blur-md",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=open]:duration-300",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=closed]:duration-200",
            "motion-reduce:animate-none motion-reduce:transition-none"
          )}
        >
          {/* Header */}
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-zinc-900 pl-4 pr-1">
            <Dialog.Title className="font-mono text-[12px] font-semibold tracking-tight text-emerald-500">
              GOODNBAD<span className="text-zinc-500">.EXE</span>
              <span className="ml-2 font-normal uppercase tracking-widest text-zinc-600 text-[9px]">nav</span>
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close navigation"
                className="flex h-11 w-11 items-center justify-center rounded text-zinc-500 transition-colors hover:text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Nav rows — ≥48px touch targets */}
          <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto py-2">
            {NAV_ITEMS.map(({ href, code, label, sub }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-[48px] items-center gap-3 px-4 py-2 font-mono transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-400",
                    active
                      ? "border-l-2 border-emerald-500 bg-emerald-950/30 text-emerald-400"
                      : "border-l-2 border-transparent text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-100"
                  )}
                >
                  <span className="w-5 shrink-0 text-[10px] text-zinc-600">{code}</span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[13px] uppercase tracking-widest">{label}</span>
                    <span className="truncate text-[10px] normal-case tracking-normal text-zinc-600">{sub}</span>
                  </span>
                  <ChevronRight className={cn("h-4 w-4 shrink-0", active ? "text-emerald-500" : "text-zinc-700")} />
                </Link>
              )
            })}
          </nav>

          {/* Footer — language, LIVE status, timezone */}
          <div className="shrink-0 space-y-3 border-t border-zinc-900 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Language</span>
              <LanguageToggle />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_theme(colors.emerald.500)] animate-pulse motion-reduce:animate-none" />
                <span className="select-none font-mono text-[10px] uppercase tracking-widest text-zinc-500">LIVE</span>
              </span>
              <TimezoneReadout />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
