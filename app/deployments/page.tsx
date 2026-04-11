// GOODNBAD OS — /deployments (deployments.sys)
// Phase 3: OS chrome active. Mission file grid in Phase 4.
import { OSPageShell } from "@/components/os/OSPageShell"
import { OSWindow } from "@/components/os"

export const metadata = {
  title: "Deployments | Goodnbad.exe",
  description: "Active system deployments — architecture, tools, outcomes. Goodnbad.exe project registry.",
}

export default function DeploymentsPage() {
  return (
    <OSPageShell osName="deployments.sys" label="Projects & Builds">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <OSWindow
          label="registry.status"
          title="deployments.sys — loading"
          status="idle"
          className="os-panel-in"
        >
          <div className="py-8 flex flex-col items-center gap-4 text-center">
            <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
              module status
            </div>
            <div className="font-mono text-sm text-zinc-400">
              <span className="text-blue-500">deployments.sys</span>
              {" "}— mission registry build scheduled for Phase 4
            </div>
            <div className="font-mono text-[11px] text-zinc-700 max-w-xs leading-relaxed">
              Mission files · architecture diagrams · tools · outcomes — all incoming.
            </div>
            <div className="w-full max-w-sm space-y-2 mt-4">
              {["ACTIVE DEPLOYMENTS", "MISSION FILES [MF-001]", "MISSION FILES [MF-002]", "ARCHIVED MISSIONS"].map(s => (
                <div key={s} className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-zinc-700 w-44 text-right uppercase tracking-widest">
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
