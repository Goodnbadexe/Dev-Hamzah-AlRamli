"use client"

import { useState } from "react"
import { RotateCcw } from "lucide-react"
import { BootSequence, GlobeLoader, OSWindow } from "@/components/os"

// ---------------------------------------------------------------------------
// LoaderPreview — side-by-side comparison of the two entry loaders.
//   • left:  BootSequence  (the "basic" terminal boot — kept, still swappable)
//   • right: GlobeLoader   (the new live loader, ported from Claude Design)
// Each runs inside a contained frame; "Replay" remounts via a key bump.
// ---------------------------------------------------------------------------

const FRAME = "relative h-[360px] overflow-hidden rounded-md border border-zinc-800 bg-zinc-950"

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
  const [bootKey, setBootKey] = useState(0)
  const [globeKey, setGlobeKey] = useState(0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          Loader experiments
        </p>
        <span className="rounded border border-emerald-500/20 bg-black/60 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
          GlobeLoader = LIVE
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Basic — BootSequence */}
        <OSWindow label="loader.basic" title="BootSequence" status="idle">
          <div className="space-y-3">
            <div className={FRAME}>
              <BootSequence key={bootKey} embedded onComplete={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-zinc-500">
                Terminal boot log · the original desktop entry (kept as fallback).
              </p>
              <ReplayButton onClick={() => setBootKey((k) => k + 1)} />
            </div>
          </div>
        </OSWindow>

        {/* New — GlobeLoader */}
        <OSWindow label="loader.globe" title="GlobeLoader" status="active">
          <div className="space-y-3">
            <div className={FRAME}>
              <GlobeLoader key={globeKey} embedded loop />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-zinc-500">
                Orthographic globe + comet whirl · dark/emerald port of the Claude Design loader.
              </p>
              <ReplayButton onClick={() => setGlobeKey((k) => k + 1)} />
            </div>
          </div>
        </OSWindow>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-700">
        Swap the live loader anytime via <span className="text-zinc-500">{`<OSDesktop loader="boot" | "globe" />`}</span>
      </p>
    </div>
  )
}
