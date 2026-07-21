'use client'

// === METADATA ===
// Purpose: Responsive terminal entry point for the /terminal page.
// Author: @Goodnbad.exe
// Why: The page previously rendered the 963-line desktop <HackerTerminal/> for
//   everyone, so phone visitors got a cramped desktop terminal. This splits the
//   surface: desktop keeps the inline hacker terminal; mobile gets a launch
//   button that opens the touch-optimized <MobileTerminal/> (same engine, shared
//   progress). Desktop behavior is unchanged.
// Security: Client-only; no secrets.
// === END METADATA ===

import { useState } from 'react'
import { Terminal, Sparkles } from 'lucide-react'
import { HackerTerminal } from '@/components/hacker-terminal'
import { MobileTerminal } from '@/components/mobile-terminal'

export function TerminalSurface() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop / tablet: full inline hacker terminal */}
      <div className="hidden md:block">
        <HackerTerminal />
      </div>

      {/* Mobile: launch the touch-optimized terminal */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-950/40 px-4 font-mono text-sm font-semibold text-emerald-300 transition-colors active:bg-emerald-900/60"
        >
          <Terminal className="h-4 w-4" />
          Launch terminal
        </button>
        <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] leading-5 text-zinc-500">
          <Sparkles className="h-3 w-3 shrink-0 text-emerald-500/70" />
          Full command set, easter eggs &amp; CTF — progress syncs with desktop.
        </p>
      </div>

      {/* Self-gated: renders only on mobile (md:hidden) and only when open. */}
      <MobileTerminal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
