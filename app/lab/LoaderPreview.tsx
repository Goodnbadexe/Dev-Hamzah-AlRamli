"use client"

import { useState } from "react"
import { RotateCcw } from "lucide-react"
import { BootSequence, GlobeLoader, OSLoader, OSWindow } from "@/components/os"

// ---------------------------------------------------------------------------
// LoaderPreview — showcases the entry loaders.
//   • top:   OSLoader     — the LIVE merged loader (globe 50% / boot log 50%)
//   • bottom: the two source pieces it composes, kept as standalone variants:
//       – GlobeLoader   (globe only, canvas)
//       – BootSequence  (boot log only, canvas-free)
// Each runs inside a contained frame; "Replay" remounts via a key bump.
// ---------------------------------------------------------------------------

const FRAME = "relative h-[360px] overflow-hidden rounded-md border border-zinc-800 bg-zinc-950"
const FRAME_TALL = "relative h-[560px] overflow-hidden rounded-md border border-zinc-800 bg-zinc-950"

function ReplayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400 transition hover:border-emerald-800 hover:text-emerald-300"
    >
      <RotateCcw className="h-3 w-3" />
      Replay
    </button>
  )
}

export function LoaderPreview() {
  const [mergedKey, setMergedKey] = useState(0)
  const [bootKey, setBootKey] = useState(0)
  const [globeKey, setGlobeKey] = useState(0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          Loader experiments
        </p>
        <span className="rounded border border-emerald-500/20 bg-black/60 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
          OSLoader = LIVE
        </span>
      </div>

      {/* Merged — the live entry loader */}
      <OSWindow label="loader.merged" title="OSLoader · 50 / 50" status="active">
        <div className="space-y-3">
          <div className={FRAME_TALL}>
            <OSLoader key={mergedKey} embedded loop />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-zinc-500">
              Globe (top 50%) + boot log (bottom 50%) in one crossfading overlay · adapts to the
              device: canvas globe on desktop, canvas-free SVG globe on mobile / reduced-motion.
            </p>
            <ReplayButton onClick={() => setMergedKey((k) => k + 1)} />
          </div>
        </div>
      </OSWindow>

      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-700">
        Source pieces (still available standalone)
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Globe only */}
        <OSWindow label="loader.globe" title="GlobeLoader" status="idle">
          <div className="space-y-3">
            <div className={FRAME}>
              <GlobeLoader key={globeKey} embedded loop />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-zinc-500">
                Orthographic globe + comet whirl · the canvas top-half of the merged loader.
              </p>
              <ReplayButton onClick={() => setGlobeKey((k) => k + 1)} />
            </div>
          </div>
        </OSWindow>

        {/* Boot log only */}
        <OSWindow label="loader.boot" title="BootSequence" status="idle">
          <div className="space-y-3">
            <div className={FRAME}>
              <BootSequence key={bootKey} embedded onComplete={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-zinc-500">
                Terminal boot log · the canvas-free bottom-half of the merged loader.
              </p>
              <ReplayButton onClick={() => setBootKey((k) => k + 1)} />
            </div>
          </div>
        </OSWindow>
      </div>
    </div>
  )
}
