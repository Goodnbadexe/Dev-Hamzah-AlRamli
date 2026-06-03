"use client"

import { useState, useEffect, useCallback } from "react"
import { BootSequence } from "./BootSequence"
import { GlobeLoader } from "./GlobeLoader"
import { cn } from "@/lib/utils"

const BOOT_SEEN_KEY = "goodnbad_boot_v2"

/** Which entry loader to play on first visit. Swap freely — both share the
 *  same `{ onComplete }` contract. "globe" is the current live default. */
export type OSLoader = "globe" | "boot"

interface OSDesktopProps {
  children: React.ReactNode
  /** Skip the boot sequence even on first visit — useful for sub-pages */
  skipBoot?: boolean
  /** Entry loader variant (default: the Globe Loader). */
  loader?: OSLoader
  className?: string
}

export function OSDesktop({ children, skipBoot = false, loader = "globe", className }: OSDesktopProps) {
  // null = not yet determined (avoids flash before sessionStorage is checked)
  // "booting"  → BootSequence playing, children hidden
  // "entering" → BootSequence done, children fading in
  // "ready"    → fully visible
  const [state, setState] = useState<"booting" | "entering" | "ready" | null>(null)
  // The GlobeLoader uses a <canvas>; on mobile we keep WebGL/canvas off the
  // first paint (perf) and fall back to the canvas-free BootSequence.
  const [useGlobeLoader, setUseGlobeLoader] = useState(false)

  useEffect(() => {
    setUseGlobeLoader(loader === "globe" && window.innerWidth >= 768)
    if (skipBoot || sessionStorage.getItem(BOOT_SEEN_KEY)) {
      // Already booted this session — show content immediately, no overlay
      setState("ready")
    } else {
      // First visit — play the boot sequence
      setState("booting")
    }
  }, [skipBoot, loader])

  // Stable reference — must not change across renders or BootSequence's effect
  // will teardown and restart its timers every time the page re-renders
  // (e.g. ThreatGlobe onAttack calls setLiveEntries which bubbles up here).
  const handleBootComplete = useCallback(() => {
    sessionStorage.setItem(BOOT_SEEN_KEY, "1")
    setState("entering")
    setTimeout(() => setState("ready"), 200)
  }, [])

  return (
    <>
      {/* Only mount the entry loader when we're actively booting.
          GlobeLoader on desktop; canvas-free BootSequence on mobile. */}
      {state === "booting" &&
        (useGlobeLoader ? (
          <GlobeLoader onComplete={handleBootComplete} />
        ) : (
          <BootSequence onComplete={handleBootComplete} />
        ))}

      <div
        className={cn(
          "min-h-screen bg-zinc-950 transition-opacity duration-700",
          // Hidden while booting or before state is known; visible once done
          state === null || state === "booting" ? "opacity-0" : "opacity-100",
          className
        )}
      >
        {children}
      </div>
    </>
  )
}
