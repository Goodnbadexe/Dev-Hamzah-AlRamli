"use client"

import { cn } from "@/lib/utils"
import { OSDesktop } from "./OSDesktop"
import { OSTaskbar } from "./OSTaskbar"
import type { ReactNode } from "react"

interface OSPageShellProps {
  /** The OS system name displayed in the window chrome, e.g. "personnel.exe" */
  osName: string
  /** Human-readable label for accessibility and non-technical visitors, e.g. "Career & Credentials" */
  label: string
  children: ReactNode
  className?: string
}

/**
 * OSPageShell — the shared layout primitive for all OS app routes.
 *
 * Wraps any OS page (/personnel, /deployments, /signal, etc.) with:
 *   - OSDesktop state machine (skipBoot — the boot only plays on the homepage)
 *   - OSTaskbar (fixed top nav, always visible)
 *   - Page content offset + grid background
 *
 * Usage:
 *   export default function PersonnelPage() {
 *     return (
 *       <OSPageShell osName="personnel.exe" label="Career & Credentials">
 *         ...page content...
 *       </OSPageShell>
 *     )
 *   }
 */
export function OSPageShell({ osName, label, children, className }: OSPageShellProps) {
  return (
    <OSDesktop skipBoot>
      <OSTaskbar />
      <main
        aria-label={label}
        className={cn(
          // Offset for fixed taskbar (h-11 = 44px)
          "os-page-offset",
          // Subtle grid on the dark canvas — same as homepage
          "os-grid",
          // Full viewport height minimum
          "min-h-screen bg-zinc-950",
          className
        )}
      >
        {/* Route identity header — monospace breadcrumb, always visible */}
        <div className="border-b border-zinc-900 px-4 py-2 flex items-center gap-3">
          <span className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest select-none">
            goodnbad://
          </span>
          <span className="font-mono text-[10px] text-emerald-700 tracking-wide select-none">
            {osName}
          </span>
          <span className="h-3 w-px bg-zinc-800 shrink-0" />
          <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest select-none">
            {label}
          </span>
        </div>

        {/* Page content */}
        {children}
      </main>
    </OSDesktop>
  )
}
