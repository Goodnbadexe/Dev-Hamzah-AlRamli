"use client"

// === METADATA ===
// Purpose: Client-side anti-inspect DETERRENT — suppresses right-click + common
//          devtools keystrokes across the site. This is a deterrent ONLY; it is
//          trivially bypassed (disable JS, view-source, proxy, mobile, curl). The
//          REAL protection for paid content is the gated, signed, watermarked PDF
//          route (app/api/vault/[file]). Do not rely on this for security.
// A11y:    Never blocks typing/paste/Tab/Escape, and exempts form fields entirely
//          so the quiz + inputs stay fully usable for keyboard + screen-reader users.
// === END METADATA ===

import { useEffect } from "react"

function isEditable(el: EventTarget | null): boolean {
  const node = el as HTMLElement | null
  if (!node || !node.tagName) return false
  const tag = node.tagName.toUpperCase()
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || node.isContentEditable === true
}

export function AntiInspect() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      if (isEditable(e.target)) return // allow right-click inside form fields
      e.preventDefault()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      // F12 — devtools
      if (e.key === "F12") {
        e.preventDefault()
        return
      }
      // Ctrl/Cmd+Shift+I / J / C — devtools panels
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(key)) {
        e.preventDefault()
        return
      }
      // Ctrl/Cmd+U — view source (but NOT when typing in a field)
      if ((e.ctrlKey || e.metaKey) && key === "u" && !isEditable(e.target)) {
        e.preventDefault()
      }
      // NOTE: we deliberately never touch plain keys, Tab, Enter, Escape, copy,
      // cut, paste, or Ctrl+A — keyboard navigation + form use stay intact.
    }

    window.addEventListener("contextmenu", onContextMenu)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("contextmenu", onContextMenu)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return null
}
