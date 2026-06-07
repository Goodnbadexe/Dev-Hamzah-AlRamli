'use client'

import { useEffect, useRef, useState } from "react"
import { MOYASAR_PK, MOYASAR_TEST } from "@/lib/subscribe/config"

// Moyasar Payment Form (mpf) — loaded from CDN at runtime.
const MPF_CSS = "https://cdn.moyasar.com/mpf/1.14.0/moyasar.css"
const MPF_JS = "https://cdn.moyasar.com/mpf/1.14.0/moyasar.js"

declare global {
  interface Window {
    Moyasar?: { init: (opts: Record<string, unknown>) => void }
  }
}

function ensureCss() {
  if (document.querySelector(`link[data-mpf]`)) return
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = MPF_CSS
  link.setAttribute("data-mpf", "1")
  document.head.appendChild(link)
}

function ensureScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Moyasar) return resolve()
    const existing = document.querySelector<HTMLScriptElement>(`script[data-mpf]`)
    if (existing) {
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () => reject(new Error("mpf")))
      return
    }
    const s = document.createElement("script")
    s.src = MPF_JS
    s.setAttribute("data-mpf", "1")
    s.onload = () => resolve()
    s.onerror = () => reject(new Error("mpf"))
    document.head.appendChild(s)
  })
}

/**
 * In-page Moyasar card form. Renders the real payment form (Mada + cards) right
 * inside the funnel — no redirect to an external page before paying. On submit,
 * Moyasar handles 3-D Secure and returns the browser to `callback_url`
 * (`/subscribe?id=…&status=…`), which the funnel reads to show the result.
 */
export function MoyasarPayment({
  amountSar,
  description,
  metadata,
}: {
  amountSar: number
  description: string
  metadata: Record<string, string>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true // guard synchronously — parent re-renders each second (countdown)
    let cancelled = false
    ;(async () => {
      try {
        ensureCss()
        await ensureScript()
        if (cancelled || !window.Moyasar || !ref.current) return
        window.Moyasar.init({
          element: ".mysr-form",
          amount: Math.round(amountSar * 100), // halalas
          currency: "SAR",
          description,
          publishable_api_key: MOYASAR_PK,
          callback_url: `${window.location.origin}/subscribe`,
          methods: ["creditcard"],
          metadata,
        })
      } catch {
        if (!cancelled) setError("Couldn't load the payment form. Please refresh and try again.")
      }
    })()
    return () => { cancelled = true }
  }, [amountSar, description, metadata])

  return (
    <div className="space-y-3">
      <div ref={ref} className="mysr-form" />
      {error && <p className="text-center font-mono text-[11px] text-red-400">{error}</p>}
      {MOYASAR_TEST && (
        <div className="rounded-md border border-yellow-800/50 bg-yellow-950/15 px-3 py-2.5 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-yellow-500">test mode</p>
          <p className="mt-1 font-mono text-[11px] text-zinc-400">
            Card <span className="text-zinc-200">4111 1111 1111 1111</span> · any future date · CVC <span className="text-zinc-200">123</span> · OTP <span className="text-zinc-200">123456</span>
          </p>
        </div>
      )}
    </div>
  )
}
