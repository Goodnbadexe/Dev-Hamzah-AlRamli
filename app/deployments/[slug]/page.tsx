// GOODNBAD OS — /deployments/[slug] (mission file)
// Phase 3: OS chrome active. Full mission file layout in Phase 4.
import { OSPageShell } from "@/components/os/OSPageShell"
import { OSWindow } from "@/components/os"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function MissionFilePage({ params }: Props) {
  const { slug } = await params

  return (
    <OSPageShell osName="deployments.sys" label="Mission File">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <OSWindow
          label={`MF-${slug}`}
          title={`deployments.sys/${slug} — decrypting`}
          status="idle"
          className="os-panel-in"
        >
          <div className="py-8 flex flex-col items-center gap-4 text-center">
            <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
              mission file
            </div>
            <div className="font-mono text-sm text-zinc-400">
              <span className="text-blue-500">{slug}</span>
              {" "}— mission file build scheduled for Phase 4
            </div>
            <div className="font-mono text-[11px] text-zinc-700 max-w-xs leading-relaxed">
              Architecture · tools · problem → outcome — incoming.
            </div>
          </div>
        </OSWindow>
      </div>
    </OSPageShell>
  )
}
