"use client"

import { useState, useEffect, useCallback } from "react"
import { OSLoader } from "./OSLoader"
import { cn } from "@/lib/utils"

const BOOT_SEEN_KEY = "goodnbad_boot_v2"

interface OSDesktopProps {
  children: React.ReactNode
  /** Skip the entry loader even on first visit — used for sub-pages. */
  skipBoot?: boolean
  className?: string
}

/**
 * OSDesktop — owns the "first visit plays the entry loader" state machine.
 * The loader itself is the merged {@link OSLoader} (globe + boot log, 50/50),
 * which adapts to the device internally — canvas globe on desktop, canvas-free
 * globe on mobile — so there's no longer a desktop/mobile branch here.
 */
export function OSDesktop({ children, skipBoot = false, className }: OSDesktopProps) {
  // null = not yet determined (avoids flash before sessionStorage is checked)
  // "booting"  → OSLoader playing, children hidden
  // "entering" → loader done, children fading in
  // "ready"    → fully visible
  const [state, setState] = useState<"booting" | "entering" | "ready" | null>(null)

  useEffect(() => {
    if (skipBoot || sessionStorage.getItem(BOOT_SEEN_KEY)) {
      // Already booted this session — show content immediately, no overlay.
      setState("ready")
    } else {
      // First visit — play the entry loader.
      setState("booting")
    }
  }, [skipBoot])

  // Stable reference — must not change across renders or the loader's effect
  // would teardown/restart its timers on every parent re-render (e.g. when
  // ThreatGlobe's onAttack bubbles state up here).
  const handleBootComplete = useCallback(() => {
    sessionStorage.setItem(BOOT_SEEN_KEY, "1")
    setState("entering")
    setTimeout(() => setState("ready"), 200)
  }, [])

  return (
    <>
      {state === "booting" && <OSLoader onComplete={handleBootComplete} />}

      <div
        className={cn(
          "min-h-screen bg-zinc-950 transition-opacity duration-700",
          // Hidden while booting or before state is known; visible once done.
          state === null || state === "booting" ? "opacity-0" : "opacity-100",
          className,
        )}
      >
        {children}
      </div>
    </>
  )
}
