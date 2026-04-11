// GOODNBAD OS — /contact (contact.enc)
// Phase 3: OS chrome active. Encrypted comms form in Phase 4.
import { OSPageShell } from "@/components/os/OSPageShell"
import { OSWindow } from "@/components/os"

export const metadata = {
  title: "Contact | Goodnbad.exe",
  description: "Initiate a direct channel with Hamzah Al-Ramli. Cybersecurity, opportunities, collaborations.",
}

export default function ContactPage() {
  return (
    <OSPageShell osName="contact.enc" label="Get in Touch">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <OSWindow
          label="comms.channel"
          title="contact.enc — standby"
          status="idle"
          className="os-panel-in"
        >
          <div className="py-8 flex flex-col items-center gap-4 text-center">
            <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
              module status
            </div>
            <div className="font-mono text-sm text-zinc-400">
              <span className="text-purple-400">contact.enc</span>
              {" "}— encrypted channel build scheduled for Phase 4
            </div>
            <div className="font-mono text-[11px] text-zinc-700 max-w-xs leading-relaxed">
              Secure form · response protocol · known endpoints — all incoming.
            </div>
            <div className="w-full max-w-xs space-y-2 mt-4">
              {["SECURE CHANNEL", "TRANSMISSION PROTOCOLS", "KNOWN ENDPOINTS"].map(s => (
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
