"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"

function CallbackInner() {
  const params = useSearchParams()
  const code = params.get("code")
  const error = params.get("error")
  const errorDesc = params.get("error_description")
  const [copied, setCopied] = useState(false)

  const fullUrl =
    typeof window !== "undefined" ? window.location.href : ""

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-5 py-16 text-zinc-200">
      <h1 className="mb-2 text-2xl font-bold text-white">TikTok authorization</h1>

      {error ? (
        <div className="rounded-lg border border-red-800/60 bg-red-950/30 p-4">
          <p className="font-semibold text-red-300">Authorization failed</p>
          <p className="mt-1 text-sm text-red-200/80">
            {error}
            {errorDesc ? ` — ${errorDesc}` : ""}
          </p>
        </div>
      ) : code ? (
        <div className="space-y-4">
          <p className="text-emerald-300">
            ✓ Authorization successful. Copy the code below and paste it back into
            your terminal to finish linking the app.
          </p>
          <div className="rounded-lg border border-zinc-700 bg-zinc-900/70 p-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
              Authorization code
            </p>
            <code className="block break-all font-mono text-sm text-sky-300">
              {code}
            </code>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => copy(code)}
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
            >
              {copied ? "Copied!" : "Copy code"}
            </button>
            <button
              onClick={() => copy(fullUrl)}
              className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
            >
              Copy full URL
            </button>
          </div>
        </div>
      ) : (
        <p className="text-zinc-400">
          This is the OAuth redirect endpoint for the Goodnbad content-posting
          integration. After you authorize the app on TikTok, you&apos;ll be sent
          here with a one-time authorization code.
        </p>
      )}
    </main>
  )
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-2xl px-5 py-16 text-zinc-400">
          Loading…
        </main>
      }
    >
      <CallbackInner />
    </Suspense>
  )
}
