// GOODNBAD OS — /personnel (personnel.exe)
// Phase 3: OS chrome active. Full dossier content in Phase 4.
import { OSPageShell } from "@/components/os/OSPageShell"
import { OSWindow } from "@/components/os"

export const metadata = {
  title: "Personnel File | Goodnbad.exe",
  description: "Hamzah Al-Ramli — career history, certifications, and capabilities. Classified dossier.",
}

export default function PersonnelPage() {
  return (
    <OSPageShell osName="personnel.exe" label="Career & Credentials">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <OSWindow
          label="dossier.status"
          title="personnel.exe — loading"
          status="idle"
          className="os-panel-in"
        >
          <div className="py-8 flex flex-col items-center gap-4 text-center">
            <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
              module status
            </div>
            <div className="font-mono text-sm text-zinc-400">
              <span className="text-emerald-600">personnel.exe</span>
              {" "}— dossier build scheduled for Phase 4
            </div>
            <div className="font-mono text-[11px] text-zinc-700 max-w-xs leading-relaxed">
              CV · mission history · clearance records · capabilities — all incoming.
              The OS skeleton is verified.
            </div>
            {/* Skeleton bar indicators */}
            <div className="w-full max-w-sm space-y-2 mt-4">
              {["OPERATIVE PROFILE", "MISSION HISTORY", "CLEARANCE RECORDS", "SYSTEM CAPABILITIES"].map(s => (
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
