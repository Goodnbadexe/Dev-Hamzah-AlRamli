"use client"

import { cn } from "@/lib/utils"
import { OSDesktop } from "./OSDesktop"
import { OSTaskbar } from "./OSTaskbar"
import dynamic from "next/dynamic"
import type { ReactNode } from "react"

// Globe — SSR-safe lazy load
const ThreatGlobe = dynamic(
  () => import("@/components/signal/ThreatGlobe").then((m) => ({ default: m.ThreatGlobe })),
  { ssr: false, loading: () => null }
)

/** Per-page accent — full literal classes (Tailwind JIT can't read interpolation). */
const breadcrumbAccent = {
  emerald: { name: "text-emerald-700", dot: "bg-emerald-600" },
  cyan: { name: "text-cyan-600", dot: "bg-cyan-500" },
  red: { name: "text-red-700", dot: "bg-red-600" },
  purple: { name: "text-purple-600", dot: "bg-purple-500" },
  amber: { name: "text-amber-600", dot: "bg-amber-500" },
  rose: { name: "text-rose-600", dot: "bg-rose-500" },
  blue: { name: "text-blue-600", dot: "bg-blue-500" },
} as const

export type OSPageAccent = keyof typeof breadcrumbAccent

interface OSPageShellProps {
  /** The OS system name displayed in the window chrome, e.g. "personnel.exe" */
  osName: string
  /** Human-readable label for accessibility and non-technical visitors, e.g. "Career & Credentials" */
  label: string
  /** Page accent hue — colors the breadcrumb identity so each route reads distinct. */
  accent?: OSPageAccent
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
export function OSPageShell({ osName, label, accent = "emerald", children, className }: OSPageShellProps) {
  const hue = breadcrumbAccent[accent]
  return (
    <OSDesktop skipBoot>
      {/* Globe — fixed full-viewport background layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ThreatGlobe interactive={false} />
      </div>

      {/* Dark radial vignette — keeps content readable over globe */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 85% at 50% 50%, rgba(9,9,11,0.50) 0%, rgba(9,9,11,0.85) 100%)",
        }}
      />

      <OSTaskbar />
      <main
        aria-label={label}
        className={cn(
          // Offset for fixed taskbar (h-11 = 44px)
          "os-page-offset",
          // Subtle grid on the dark canvas — same as homepage
          "os-grid",
          // Full viewport height minimum — transparent so globe shows through
          "relative z-10 min-h-screen",
          className
        )}
      >
        {/* Route identity header — monospace breadcrumb, always visible */}
        <div className="border-b border-zinc-900/80 bg-zinc-950/30 px-5 py-3 flex items-center gap-3 backdrop-blur-sm">
          <span className="font-mono text-[11px] text-zinc-700 uppercase tracking-widest select-none">
            goodnbad://
          </span>
          <span className={`font-mono text-[11px] tracking-wide select-none ${hue.name}`}>
            {osName}
          </span>
          <span className="h-3 w-px bg-zinc-800 shrink-0" />
          <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest select-none">
            {label}
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${hue.dot}`} />
            <span className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest select-none hidden sm:block">active</span>
          </span>
        </div>

        {/* Page content */}
        {children}
      </main>
    </OSDesktop>
  )
}
