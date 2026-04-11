// GOODNBAD OS — /terminal (terminal.sh)
// Phase 3: OS chrome active. Full terminal integration in Phase 4.
import { OSPageShell } from "@/components/os/OSPageShell"
import { OSWindow } from "@/components/os"

export const metadata = {
  title: "Terminal | Goodnbad.exe",
  description: "Command interface. Interactive terminal layer for the Goodnbad OS.",
  robots: { index: false },
}

export default function TerminalPage() {
  return (
    <OSPageShell osName="terminal.sh" label="Command Interface">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <OSWindow
          label="terminal.init"
          title="terminal.sh — initializing"
          status="idle"
          className="os-panel-in"
        >
          <div className="font-mono text-xs space-y-1 text-zinc-600 py-4">
            <div>
              <span className="text-emerald-800">›</span>
              {" "}GOODNBAD.EXE terminal v2.0 — loading command registry...
            </div>
            <div>
              <span className="text-emerald-800">›</span>
              {" "}loading authentication layer...
            </div>
            <div>
              <span className="text-emerald-800">›</span>
              {" "}mounting CTF engine...
            </div>
            <div>
              <span className="text-emerald-800">›</span>
              {" "}
              <span className="text-zinc-500">
                full interface integration scheduled for Phase 4 —
              </span>
              {" "}type{" "}
              <span className="text-emerald-700">help</span>
              {" "}when live
            </div>
            <div className="pt-2 flex items-center gap-1">
              <span className="text-emerald-700">$</span>
              <span className="h-3.5 w-1.5 bg-emerald-800 animate-pulse" />
            </div>
          </div>
        </OSWindow>

        <p className="mt-4 font-mono text-[10px] text-zinc-800 text-center uppercase tracking-widest">
          type{" "}
          <span className="text-zinc-700">ls -la</span>
          {" "}when the terminal is live to discover what else is here
        </p>
      </div>
    </OSPageShell>
  )
}
