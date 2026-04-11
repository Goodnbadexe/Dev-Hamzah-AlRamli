import type { Metadata } from "next"
import { Lock, ShieldCheck, Terminal } from "lucide-react"
import { OSPageShell } from "@/components/os/OSPageShell"
import { OSWindow } from "@/components/os"
import { hasLabAccess, unlockLab } from "./actions"

export const metadata: Metadata = {
  title: "Restricted Lab | Goodnbad.exe",
  description: "Restricted Goodnbad.exe lab access.",
  robots: {
    index: false,
    follow: false,
  },
}

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function LabPage({ searchParams }: Props) {
  const [{ error }, unlocked] = await Promise.all([searchParams, hasLabAccess()])

  return (
    <OSPageShell osName="[REDACTED]" label="Restricted Lab">
      <div className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
        {unlocked ? <UnlockedLab /> : <LockedLab error={error} />}
      </div>
    </OSPageShell>
  )
}

function LockedLab({ error }: { error?: string }) {
  return (
    <OSWindow label="restricted.access" title="passphrase required" status="alert" className="os-panel-in">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-yellow-400">
            <Lock className="h-5 w-5" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
              Private lab
            </p>
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-100">Access required</h1>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            This area is intentionally not part of the public site. Enter the lab passphrase to continue.
          </p>
        </div>

        <form action={unlockLab} className="space-y-4 rounded-md border border-zinc-800 bg-zinc-950/45 p-4">
          <label htmlFor="passphrase" className="block font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            Lab passphrase
          </label>
          <input
            id="passphrase"
            name="passphrase"
            type="password"
            required
            autoComplete="off"
            className="w-full rounded-md border border-zinc-800 bg-black px-3 py-3 font-mono text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-emerald-700"
            placeholder="Enter passphrase"
          />
          {error && (
            <p className="text-sm text-red-400">
              {error === "not-configured" ? "Lab access is not configured." : "Access denied."}
            </p>
          )}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:border-emerald-600 hover:bg-emerald-950/70"
          >
            <ShieldCheck className="h-4 w-4" />
            Unlock lab
          </button>
        </form>

        <p className="text-center font-mono text-[10px] uppercase tracking-widest text-zinc-800">
          No public links. No indexed content.
        </p>
      </div>
    </OSWindow>
  )
}

function UnlockedLab() {
  return (
    <OSWindow label="lab.session" title="restricted workspace" status="active" className="os-panel-in">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400">
            <Terminal className="h-5 w-5" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
              Lab unlocked
            </p>
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-100">Restricted workspace</h1>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            Access is active for this browser session. Keep experiments small, private, and separate from the public navigation.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Mode", "Private"],
            ["Indexing", "Disabled"],
            ["Public links", "None"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-zinc-800 bg-zinc-950/45 p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">{label}</p>
              <p className="mt-2 text-sm font-semibold text-zinc-100">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-zinc-800 bg-zinc-950/45 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Current lab status</p>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            The gate is live. Future lab experiments can be added here without exposing them to normal visitors or public navigation.
          </p>
        </div>
      </div>
    </OSWindow>
  )
}
