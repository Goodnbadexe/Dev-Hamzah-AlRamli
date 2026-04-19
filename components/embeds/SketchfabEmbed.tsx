"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"

interface SketchfabEmbedProps {
  /** Sketchfab profile URL, e.g. "https://sketchfab.com/Goodnbad.exe" */
  profileUrl: string
  /** Optional featured model UID for a specific model embed instead of the profile */
  modelUid?: string
}

/**
 * SketchfabEmbed — renders an iframe to the user's Sketchfab profile or a specific model.
 * Uses lazy loading and a click-to-load cover to keep initial page weight down.
 */
export function SketchfabEmbed({ profileUrl, modelUid }: SketchfabEmbedProps) {
  const [loaded, setLoaded] = useState(false)
  const embedSrc = modelUid
    ? `https://sketchfab.com/models/${modelUid}/embed?autostart=0&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=1`
    : profileUrl

  if (!loaded) {
    return (
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="group relative flex h-[420px] w-full items-center justify-center overflow-hidden rounded border border-zinc-800 bg-zinc-950/50 transition hover:border-zinc-700"
      >
        <div
          className="absolute inset-0 opacity-70 transition-opacity group-hover:opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 45%, rgba(16,185,129,0.12) 0%, rgba(9,9,11,0) 60%), radial-gradient(ellipse 100% 100% at 50% 50%, #0a0a0c 40%, #000 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-500">sketchfab · 3d viewer</span>
          <p className="text-lg font-semibold text-zinc-100">Load interactive 3D viewer</p>
          <p className="max-w-md text-xs text-zinc-500">
            Tap to load the embedded Sketchfab viewer — you can rotate, zoom, and inspect the 3D models directly.
          </p>
          <span className="mt-2 rounded border border-emerald-800 bg-emerald-950/30 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-emerald-400">
            Activate viewer ↗
          </span>
        </div>
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <div className="relative h-[480px] w-full overflow-hidden rounded border border-zinc-800 bg-zinc-950">
        <iframe
          title="Sketchfab 3D viewer"
          src={embedSrc}
          className="h-full w-full"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-emerald-400"
      >
        Open Sketchfab profile <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  )
}
