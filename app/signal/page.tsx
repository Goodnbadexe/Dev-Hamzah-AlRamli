// GOODNBAD OS — /signal (signal.feed)
// Phase 3: OS chrome active. Live feed integration in Phase 4.
import { OSPageShell } from "@/components/os/OSPageShell"
import { OSWindow } from "@/components/os"

export const metadata = {
  title: "Signal Feed | Goodnbad.exe",
  description: "Live activity — GitHub commits, certifications, deployments, and current operations.",
}

export default function SignalPage() {
  return (
    <OSPageShell osName="signal.feed" label="Live Activity">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <OSWindow
          label="feed.status"
          title="signal.feed — connecting"
          status="active"
          className="os-panel-in"
        >
          <div className="py-8 flex flex-col items-center gap-4 text-center">
            <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
              module status
            </div>
            <div className="font-mono text-sm text-zinc-400">
              <span className="text-yellow-500">signal.feed</span>
              {" "}— live feed integration scheduled for Phase 4
            </div>
            <div className="font-mono text-[11px] text-zinc-700 max-w-xs leading-relaxed">
              GitHub activity · certification log · current operation · intelligence notes — all incoming.
            </div>
            <div className="w-full max-w-sm space-y-2 mt-4">
              {["SYSTEM LOG", "CERTIFICATION UPDATES", "CURRENT OPERATION", "INTELLIGENCE NOTES"].map(s => (
                <div key={s} className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-zinc-700 w-40 text-right uppercase tracking-widest">
                    {s}
                  </span>
                  <div className="h-px flex-1 bg-zinc-900" />
                  <span className="font-mono text-[9px] text-zinc-800 uppercase tracking-widest">
                    pending
                  </span>
                </div>
              ))}
            </div>
          </div>
        </OSWindow>
      </div>
    </OSPageShell>
  )
}
