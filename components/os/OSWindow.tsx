"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface OSWindowProps {
  children: ReactNode
  className?: string
  title?: string
  label?: string
  status?: "active" | "idle" | "alert"
  /** Renders without the chrome (title bar) — raw panel only */
  bare?: boolean
}

const statusDot: Record<NonNullable<OSWindowProps["status"]>, string> = {
  active: "bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)]",
  idle:   "bg-zinc-600",
  alert:  "bg-red-500 shadow-[0_0_6px_theme(colors.red.500)]",
}

/**
 * OSWindow — the core surface primitive for the Goodnbad OS interface.
 * Provides the panel chrome (title bar + border) that makes every section
 * feel like a module inside the OS desktop.
 */
export function OSWindow({ children, className, title, label, status = "idle", bare }: OSWindowProps) {
  if (bare) {
    return (
      <div
        className={cn(
          "rounded-md border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm",
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
        "group/window rounded-md border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm overflow-hidden",
        "transition-all duration-300",
        "hover:border-zinc-700 hover:shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.03)]",
        className
      )}
    >
      {/* Title bar */}
      <div className={cn(
        "relative flex items-center gap-2 px-3 py-2 border-b border-zinc-800/80 bg-zinc-950/50 overflow-hidden",
        "transition-colors duration-300 group-hover/window:bg-zinc-950/70",
      )}>
        {/* Scan-line shimmer on hover */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 group-hover/window:opacity-100 transition-opacity duration-500",
            "bg-[linear-gradient(90deg,transparent_20%,rgba(16,185,129,0.05)_50%,transparent_80%)]",
            "bg-[length:200%_100%]",
            "[animation:shimmer-sweep_2.4s_linear_infinite]"
          )}
        />

        <span className={cn("h-2 w-2 rounded-full shrink-0 transition-all duration-300", statusDot[status])} />
        {label && (
          <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest select-none group-hover/window:text-zinc-500 transition-colors duration-300">
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
            className="pointer-events-none absolute top-0 left-3 right-3 h-px bg-emerald-500/30 group-hover/window:bg-emerald-500/55 transition-colors duration-300"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
