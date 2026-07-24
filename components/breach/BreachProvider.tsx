"use client"

// === METADATA ===
// Purpose: Breach Mode provider — flips html[data-theme="breach"] during the
//          5:05–5:09 local-time window (AM + PM) and renders a non-blocking
//          cosmetic alert overlay. Server render is ALWAYS the normal theme.
// Author: @Goodnbad.exe
// Inputs: client clock via lib/breach/time (IANA timezone; UTC fallback);
//         `?breach=preview` query forces a 30s preview
// Outputs: data-theme attribute on <html>, overlay UI (never blocks nav/forms)
// Tests: tests/breach.test.ts (pure time logic)
// Security: purely cosmetic, site-scoped; never claims the visitor is compromised
// Complexity: O(1) per 15s tick
// === END METADATA ===

import { useCallback, useEffect, useRef, useState } from "react"
import { breachSecondsRemaining, isBreachWindow } from "@/lib/breach/time"

const DISMISS_KEY = "goodnbad_breach_dismissed"
const CHECK_MS = 15_000
const PREVIEW_MS = 30_000
const ALERT_TEXT = "INTRUSION DETECTED — WELCOME TO GOODNBAD"

/** Minimal line-art skull — brand glyph for the 505 breach event, not a threat claim. */
function SkullGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-10 w-10 text-red-500 motion-safe:animate-pulse motion-reduce:animate-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.5a7.5 7.5 0 0 0-7.5 7.5c0 2.3 1.1 4.3 2.8 5.7v3.1a1.7 1.7 0 0 0 1.7 1.7h6a1.7 1.7 0 0 0 1.7-1.7v-3.1c1.7-1.4 2.8-3.4 2.8-5.7A7.5 7.5 0 0 0 12 2.5Z" />
      <circle cx="9" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 13.2l-1 1.8h2l-1-1.8Z" fill="currentColor" stroke="none" />
      <path d="M10 20.5v-2M12 20.5v-2M14 20.5v-2" />
    </svg>
  )
}

function readDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1"
  } catch {
    return false
  }
}

/** Typed-out alert line. Renders full text immediately under reduced motion. */
function TypedAlert({ text }: { text: string }) {
  const [shown, setShown] = useState("")
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    if (mq.matches) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 35)
    return () => clearInterval(id)
  }, [text])

  return (
    <span className="font-mono text-[12px] tracking-wide text-[var(--os-breach-text,#fca5a5)]">
      {reduced ? text : shown}
      {!reduced && shown.length < text.length && <span aria-hidden>▌</span>}
    </span>
  )
}

export function BreachProvider() {
  const [active, setActive] = useState(false)
  const [remaining, setRemaining] = useState(0)
  const previewUntil = useRef<number | null>(null)
  const dismissed = useRef(false)

  const evaluate = useCallback(() => {
    const now = new Date()
    const inPreview = previewUntil.current !== null && Date.now() < previewUntil.current
    if (previewUntil.current !== null && !inPreview) previewUntil.current = null
    const shouldBeActive = !dismissed.current && (inPreview || isBreachWindow(now))
    setActive(shouldBeActive)
    setRemaining(
      inPreview
        ? Math.max(0, Math.ceil(((previewUntil.current ?? 0) - Date.now()) / 1000))
        : breachSecondsRemaining(now)
    )
    const root = document.documentElement
    if (shouldBeActive) root.setAttribute("data-theme", "breach")
    else if (root.getAttribute("data-theme") === "breach") root.removeAttribute("data-theme")
  }, [])

  // Mount: read dismissal + preview param, then poll every 15s (1s while active for the countdown).
  useEffect(() => {
    dismissed.current = readDismissed()
    try {
      if (new URLSearchParams(window.location.search).get("breach") === "preview") {
        dismissed.current = false
        previewUntil.current = Date.now() + PREVIEW_MS
      }
    } catch {
      /* ignore malformed search */
    }
    evaluate()
    const id = setInterval(evaluate, CHECK_MS)
    return () => clearInterval(id)
  }, [evaluate])

  // 1s countdown tick while active
  useEffect(() => {
    if (!active) return
    const id = setInterval(evaluate, 1000)
    return () => clearInterval(id)
  }, [active, evaluate])

  const exitBreach = useCallback(() => {
    dismissed.current = true
    previewUntil.current = null
    try {
      sessionStorage.setItem(DISMISS_KEY, "1")
    } catch {
      /* session storage unavailable — dismissal still holds for this page life */
    }
    evaluate()
  }, [evaluate])

  // Escape dismisses the breach state while active
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitBreach()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [active, exitBreach])

  if (!active) return null

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0")
  const ss = String(remaining % 60).padStart(2, "0")

  return (
    <>
      {/* Cosmetic red tint + scanlines — CSS only, never intercepts input */}
      <div aria-hidden className="breach-overlay fixed inset-0 z-[70] pointer-events-none" />

      {/* Centered alert — wrapper never blocks the page; only the panel itself is interactive */}
      <div className="pointer-events-none fixed inset-0 z-[80] grid place-items-center p-4">
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-auto w-full max-w-[min(92vw,440px)] rounded-md border border-red-900/80 bg-zinc-950/95 p-6 text-center shadow-[0_8px_48px_rgba(127,29,29,0.35)] backdrop-blur-md"
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px flex-1 bg-red-900/60" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-400">system alert</span>
            <span className="h-px flex-1 bg-red-900/60" aria-hidden />
          </div>
          <div className="mb-2 flex justify-center">
            <SkullGlyph />
          </div>
          <p
            aria-label="Breach event five zero five"
            className="mb-3 font-mono text-4xl font-bold tracking-[0.35em] text-red-500"
          >
            505
          </p>
          <TypedAlert text={ALERT_TEXT} />
          <p className="mt-3 font-mono text-[11px] text-zinc-400">
            breach window 05:05 — containment in{" "}
            <span className="tabular-nums text-red-300">{mm}:{ss}</span> — site fully operational
          </p>
          <button
            type="button"
            onClick={exitBreach}
            className="mt-4 inline-flex items-center rounded border border-red-800 bg-red-950/40 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-red-300 transition-colors hover:border-red-600 hover:text-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            Exit breach mode
          </button>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">esc to dismiss</p>
        </div>
      </div>
    </>
  )
}
