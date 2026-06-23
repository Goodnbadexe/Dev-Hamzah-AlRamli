"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

/** Per-page accent hues — each OS app owns one, so routes stop feeling identical. */
export type OSAccent = "emerald" | "cyan" | "red" | "purple" | "amber" | "rose" | "blue"

/** Interior breathing room. `default` is the luxe standard (Personnel's 26px). */
export type OSPadding = "none" | "compact" | "default" | "prominent"

interface OSWindowProps {
  children: ReactNode
  className?: string
  title?: string
  label?: string
  status?: "active" | "idle" | "alert"
  /** Renders without the chrome (title bar) — raw panel only */
  bare?: boolean
  /** Accent hue for dot, top strip, shimmer and hover glow. Default emerald. */
  accent?: OSAccent
  /** Interior padding scale. Default = 24/28px luxe rhythm. */
  padding?: OSPadding
}

const paddingMap: Record<OSPadding, string> = {
  none: "p-0",
  compact: "p-4",
  default: "p-6 lg:p-7",
  prominent: "p-7 lg:p-9",
}

/* Full literal strings per hue — Tailwind JIT can't see interpolated classes. */
const accentMap: Record<
  OSAccent,
  { dot: string; strip: string; shimmer: string; hoverGlow: string }
> = {
  emerald: {
    dot: "bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)]",
    strip: "bg-emerald-500/30 group-hover/window:bg-emerald-500/55",
    shimmer: "bg-[linear-gradient(90deg,transparent_20%,rgba(16,185,129,0.05)_50%,transparent_80%)]",
    hoverGlow: "hover:shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_24px_rgba(16,185,129,0.07),0_0_0_1px_rgba(255,255,255,0.03)]",
  },
  cyan: {
    dot: "bg-cyan-400 shadow-[0_0_6px_theme(colors.cyan.400)]",
    strip: "bg-cyan-400/30 group-hover/window:bg-cyan-400/55",
    shimmer: "bg-[linear-gradient(90deg,transparent_20%,rgba(34,211,238,0.06)_50%,transparent_80%)]",
    hoverGlow: "hover:shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_24px_rgba(34,211,238,0.08),0_0_0_1px_rgba(255,255,255,0.03)]",
  },
  red: {
    dot: "bg-red-500 shadow-[0_0_6px_theme(colors.red.500)]",
    strip: "bg-red-500/30 group-hover/window:bg-red-500/55",
    shimmer: "bg-[linear-gradient(90deg,transparent_20%,rgba(239,68,68,0.06)_50%,transparent_80%)]",
    hoverGlow: "hover:shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_24px_rgba(239,68,68,0.07),0_0_0_1px_rgba(255,255,255,0.03)]",
  },
  purple: {
    dot: "bg-purple-400 shadow-[0_0_6px_theme(colors.purple.400)]",
    strip: "bg-purple-400/30 group-hover/window:bg-purple-400/55",
    shimmer: "bg-[linear-gradient(90deg,transparent_20%,rgba(192,132,252,0.06)_50%,transparent_80%)]",
    hoverGlow: "hover:shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_24px_rgba(192,132,252,0.08),0_0_0_1px_rgba(255,255,255,0.03)]",
  },
  amber: {
    dot: "bg-amber-400 shadow-[0_0_6px_theme(colors.amber.400)]",
    strip: "bg-amber-400/30 group-hover/window:bg-amber-400/55",
    shimmer: "bg-[linear-gradient(90deg,transparent_20%,rgba(251,191,36,0.06)_50%,transparent_80%)]",
    hoverGlow: "hover:shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_24px_rgba(251,191,36,0.07),0_0_0_1px_rgba(255,255,255,0.03)]",
  },
  rose: {
    dot: "bg-rose-400 shadow-[0_0_6px_theme(colors.rose.400)]",
    strip: "bg-rose-400/30 group-hover/window:bg-rose-400/55",
    shimmer: "bg-[linear-gradient(90deg,transparent_20%,rgba(251,113,133,0.06)_50%,transparent_80%)]",
    hoverGlow: "hover:shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_24px_rgba(251,113,133,0.08),0_0_0_1px_rgba(255,255,255,0.03)]",
  },
  blue: {
    dot: "bg-blue-400 shadow-[0_0_6px_theme(colors.blue.400)]",
    strip: "bg-blue-400/30 group-hover/window:bg-blue-400/55",
    shimmer: "bg-[linear-gradient(90deg,transparent_20%,rgba(96,165,250,0.06)_50%,transparent_80%)]",
    hoverGlow: "hover:shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_24px_rgba(96,165,250,0.08),0_0_0_1px_rgba(255,255,255,0.03)]",
  },
}

const statusDot: Record<NonNullable<OSWindowProps["status"]>, (a: OSAccent) => string> = {
  active: (a) => accentMap[a].dot,
  idle: () => "bg-zinc-600",
  alert: () => "bg-red-500 shadow-[0_0_6px_theme(colors.red.500)]",
}

/**
 * OSWindow — the core surface primitive for the Goodnbad OS interface.
 * Provides the panel chrome (title bar + border) that makes every section
 * feel like a module inside the OS desktop.
 *
 * `accent` gives each route its own hue (contact=cyan, security=red, ai=purple…)
 * `padding` controls interior breathing room — default is the luxe 24/28px rhythm.
 */
export function OSWindow({
  children,
  className,
  title,
  label,
  status = "idle",
  bare,
  accent = "emerald",
  padding = "default",
}: OSWindowProps) {
  const hue = accentMap[accent]

  if (bare) {
    return (
      <div
        className={cn(
          "rounded-md border border-zinc-800 bg-gradient-to-b from-zinc-900/70 to-zinc-950/50 backdrop-blur-sm",
          className
        )}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group/window rounded-md border border-zinc-800 bg-gradient-to-b from-zinc-900/70 to-zinc-950/50 backdrop-blur-sm overflow-hidden",
        "transition-all duration-300",
        "hover:border-zinc-700",
        hue.hoverGlow,
        className
      )}
    >
      {/* Title bar */}
      <div className={cn(
        "relative flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-950/50 overflow-hidden",
        "transition-colors duration-300 group-hover/window:bg-zinc-950/70",
      )}>
        {/* Scan-line shimmer on hover */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 group-hover/window:opacity-100 transition-opacity duration-500",
            hue.shimmer,
            "bg-[length:200%_100%]",
            "[animation:shimmer-sweep_2.4s_linear_infinite]"
          )}
        />

        <span className={cn("h-2 w-2 rounded-full shrink-0 transition-all duration-300", statusDot[status](accent))} />
        {label && (
          <span className="font-mono text-[11px] text-zinc-600 uppercase tracking-widest select-none group-hover/window:text-zinc-500 transition-colors duration-300">
            {label}
          </span>
        )}
        {title && (
          <span className="font-mono text-xs text-zinc-400 truncate select-none ml-auto group-hover/window:text-zinc-300 transition-colors duration-300">
            {title}
          </span>
        )}

        {/* Active status glow strip at top edge */}
        {status === "active" && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-0 left-3 right-3 h-px transition-colors duration-300",
              hue.strip
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className={paddingMap[padding]}>
        {children}
      </div>
    </div>
  )
}
