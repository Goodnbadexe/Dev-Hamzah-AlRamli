"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"

interface CodePenEmbedProps {
  /** CodePen pen URL, e.g. "https://codepen.io/Goodnbadexe/pen/JjmNvVQ" */
  penUrl: string
  /** Which tab to show by default: result | html | css | js */
  defaultTab?: "result" | "html" | "css" | "js"
  /** Optional height in pixels */
  height?: number
}

function parseCodepenUrl(url: string): { user: string; penId: string } | null {
  const match = url.match(/codepen\.io\/([^/]+)\/(?:pen|full|details)\/([A-Za-z]+)/)
  if (!match) return null
  return { user: match[1], penId: match[2] }
}

/**
 * CodePenEmbed — renders a CodePen pen as an iframe using the standard embed URL.
 * Uses click-to-load to avoid third-party JS on first paint.
 */
export function CodePenEmbed({ penUrl, defaultTab = "result", height = 480 }: CodePenEmbedProps) {
  const [loaded, setLoaded] = useState(false)
  const parsed = parseCodepenUrl(penUrl)

  if (!parsed) {
    return (
      <a
        href={penUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-emerald-400"
      >
        Open on CodePen <ExternalLink className="h-3 w-3" />
      </a>
    )
  }

  const embedSrc = `https://codepen.io/${parsed.user}/embed/${parsed.penId}?default-tab=${defaultTab}&theme-id=dark`

  if (!loaded) {
    return (
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="group relative flex w-full items-center justify-center overflow-hidden rounded border border-zinc-800 bg-zinc-950/50 transition hover:border-zinc-700"
        style={{ height }}
      >
        <div
          className="absolute inset-0 opacity-70 transition-opacity group-hover:opacity-90"
          style={{
            background:
              "repeating-linear-gradient(45deg, #09090b, #09090b 10px, #0e0e10 10px, #0e0e10 20px)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-yellow-500">codepen · creative coding</span>
          <p className="text-lg font-semibold text-zinc-100">Load CodePen embed</p>
          <p className="max-w-md text-xs text-zinc-500">
            Tap to load the live CodePen pen — the result renders right here, and you can flip to HTML, CSS, or JS tabs.
          </p>
          <span className="mt-2 rounded border border-yellow-800 bg-yellow-950/30 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-yellow-400">
            Run pen ↗
          </span>
        </div>
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <iframe
        title="CodePen pen"
        src={embedSrc}
        className="w-full rounded border border-zinc-800 bg-zinc-950"
        style={{ height }}
        allow="fullscreen"
        allowFullScreen
        loading="lazy"
      />
      <a
        href={penUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-yellow-400"
      >
        Open on CodePen <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  )
}
