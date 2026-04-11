"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type NotificationVariant = "info" | "success" | "alert" | "system"

export interface OSNotificationItem {
  id: string
  variant?: NotificationVariant
  title: string
  body?: string
  /** Auto-dismiss after ms. Pass 0 to disable. Default: 4000 */
  duration?: number
}

const variantStyles: Record<NotificationVariant, string> = {
  info:    "border-zinc-700 text-zinc-300",
  success: "border-emerald-800 text-emerald-400",
  alert:   "border-red-900 text-red-400",
  system:  "border-zinc-800 text-zinc-500",
}

const variantDot: Record<NotificationVariant, string> = {
  info:    "bg-zinc-500",
  success: "bg-emerald-500 shadow-[0_0_5px_theme(colors.emerald.500)]",
  alert:   "bg-red-500 shadow-[0_0_5px_theme(colors.red.500)]",
  system:  "bg-zinc-700",
}

interface OSNotificationProps {
  notification: OSNotificationItem
  onDismiss: (id: string) => void
}

/**
 * OSNotification — a single ambient notification toast for the OS.
 * Positioned by the parent stack; animates in and auto-dismisses.
 */
export function OSNotification({ notification, onDismiss }: OSNotificationProps) {
  const { id, variant = "info", title, body, duration = 4000 } = notification
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 10)

    // Auto-dismiss
    if (duration > 0) {
      const hideTimer = setTimeout(() => {
        setVisible(false)
        setTimeout(() => onDismiss(id), 300)
      }, duration)
      return () => { clearTimeout(showTimer); clearTimeout(hideTimer) }
    }

    return () => clearTimeout(showTimer)
  }, [id, duration, onDismiss])

  return (
    <div
      role="status"
      className={cn(
        "w-72 rounded border bg-zinc-950/95 backdrop-blur-sm px-3 py-2.5 shadow-lg",
        "transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start gap-2">
        <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full shrink-0", variantDot[variant])} />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[11px] font-medium uppercase tracking-wider truncate">
            {title}
          </p>
          {body && (
            <p className="mt-0.5 text-[11px] text-zinc-500 leading-snug">
              {body}
            </p>
          )}
        </div>
        <button
          onClick={() => { setVisible(false); setTimeout(() => onDismiss(id), 300) }}
          className="shrink-0 text-zinc-700 hover:text-zinc-500 text-xs leading-none ml-1"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  )
}

/**
 * OSNotificationStack — manages and renders a stack of OS notifications.
 * Place once near the root of a page, outside of scrollable content.
 */
export function OSNotificationStack({ items, onDismiss }: {
  items: OSNotificationItem[]
  onDismiss: (id: string) => void
}) {
  if (items.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 items-end">
      {items.map(item => (
        <OSNotification key={item.id} notification={item} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
