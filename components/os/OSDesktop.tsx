"use client"

import { useState, useEffect } from "react"
import { BootSequence } from "./BootSequence"
import { cn } from "@/lib/utils"

const BOOT_SEEN_KEY = "goodnbad_boot_v2"

interface OSDesktopProps {
  children: React.ReactNode
  /** Skip the boot sequence even on first visit — useful for sub-pages */
  skipBoot?: boolean
  className?: string
}

/**
 * OSDesktop — the top-level state machine for the Goodnbad OS experience.
 *
 * States:
 *   booting   → BootSequence overlay is visible above the live desktop
 *   entering  → BootSequence has completed
 *   ready     → full desktop is visible and interactive
 *
 * The boot sequence runs once per browser session (sessionStorage flag).
 * Sub-pages should use skipBoot={true} so they don't replay the boot.
 */
export function OSDesktop({ children, skipBoot = false, className }: OSDesktopProps) {
  const [state, setState] = useState<"booting" | "entering" | "ready">("booting")

  useEffect(() => {
    // If skipBoot or already booted this session, go straight to ready
    if (skipBoot || sessionStorage.getItem(BOOT_SEEN_KEY)) {
      setState("ready")
      return
    }
  }, [skipBoot])

  function handleBootComplete() {
    sessionStorage.setItem(BOOT_SEEN_KEY, "1")
    setState("entering")
    setTimeout(() => setState("ready"), 200)
  }

  return (
    <>
      {state === "booting" && (
        <BootSequence onComplete={handleBootComplete} />
      )}

      <div
        className={cn(
          "min-h-screen bg-zinc-950 transition-opacity duration-700 opacity-100",
          className
        )}
      >
        {children}
      </div>
    </>
  )
}
