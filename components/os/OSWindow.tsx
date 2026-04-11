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
        "rounded-md border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm overflow-hidden",
        className
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800/80 bg-zinc-950/40">
        <span className={cn("h-2 w-2 rounded-full shrink-0", statusDot[status])} />
        {label && (
          <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest select-none">
            {label}
          </span>
        )}
        {title && (
          <span className="font-mono text-xs text-zinc-400 truncate select-none ml-auto">
            {title}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
