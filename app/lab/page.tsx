// GOODNBAD OS — /lab [REDACTED]
// This route is intentionally obscure.
// Not linked from the public OS desktop.
// Discoverable only via terminal: cd lab
// Passphrase gate to be wired in Phase 4 via LAB_PASSPHRASE env var.
import { OSPageShell } from "@/components/os/OSPageShell"

export const metadata = {
  title: "Access Denied | Goodnbad.exe",
  robots: {
    index:  false,
    follow: false,
  },
}

export default function LabPage() {
  return (
    <OSPageShell osName="[REDACTED]" label="Restricted Zone">
      <div className="container mx-auto px-4 py-24 max-w-xl">
        <div className="font-mono space-y-5 os-panel-in">
          {/* Classification header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_6px_theme(colors.yellow.500)]" />
            <span className="text-[10px] text-zinc-600 uppercase tracking-[0.4em]">
              restricted access
            </span>
          </div>

          {/* Redacted classification block */}
          <div className="border border-zinc-800 rounded px-4 py-5 space-y-3 bg-zinc-950/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-700 uppercase tracking-widest">file</span>
              <span className="text-[10px] text-yellow-800 uppercase tracking-widest">█████████████</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-700 uppercase tracking-widest">classification</span>
              <span className="text-[10px] text-yellow-700 uppercase tracking-widest">RESTRICTED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-700 uppercase tracking-widest">access</span>
              <span className="text-[10px] text-red-900 uppercase tracking-widest">DENIED</span>
            </div>
          </div>

          {/* Auth prompt placeholder — wired to LAB_PASSPHRASE in Phase 4 */}
          <div className="border border-zinc-900 rounded px-4 py-4 space-y-2">
            <div className="text-[10px] text-zinc-700 uppercase tracking-widest mb-3">
              clearance required
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-700">
              <span className="text-emerald-900">$</span>
              <span>enter passphrase:</span>
              <span className="h-3.5 w-1.5 bg-zinc-800" />
            </div>
            <div className="text-[10px] text-zinc-800 pt-2">
              — passphrase gate active in Phase 4 —
            </div>
          </div>

          {/* Navigation hint */}
          <p className="text-[10px] text-zinc-800 text-center pt-4 uppercase tracking-widest">
            if you found this, you know what to do
          </p>
        </div>
      </div>
    </OSPageShell>
  )
}
