// === METADATA ===
// Purpose: Vault content manifest. Members see OUTCOME names only — the underlying
//          source books/tools are never named (that's the "hide what we give them"
//          rule). Each deliverable maps to generated PDF files keyed by {tool,os}
//          variant; resolveFile() falls back to the default variant when a specific
//          {tool,os} build hasn't been generated yet.
// Honesty: this catalog lists ONLY deliverables that physically exist under
//          content/vault/. New weeks/tracks are added here as their PDFs are
//          produced — the funnel never advertises a file that isn't there.
// Storage: content/vault/<track>/<fileStem>__<tool>__<os>.pdf  (NOT in public/ —
//          paid files are served only through the gated, signed, watermarked route).
// === END METADATA ===

import {
  type TrackId,
  type ToolId,
  type OsId,
  DEFAULT_TOOL,
  DEFAULT_OS,
} from "@/lib/subscribe/tracks"

export interface Deliverable {
  /** stable slug, unique across the whole vault */
  id: string
  week: 1 | 2 | 3 | 4
  /** public, outcome-framed name — never reveals the source */
  outcomeEn: string
  outcomeAr: string
  /** filename stem; real file = `${fileStem}__${tool}__${os}.pdf` */
  fileStem: string
  /** which variant builds have actually been generated */
  variants: { tools: ToolId[]; os: OsId[] }
}

export const VAULT: Record<TrackId, Deliverable[]> = {
  security: [
    {
      id: "recon-playbook",
      week: 1,
      outcomeEn: "Map any target in an afternoon — recon, run with your AI",
      outcomeAr: "ارسم خريطة أي هدف في عصرية — استطلاع تشغّله مع الـ AI",
      fileStem: "recon-playbook",
      variants: { tools: [DEFAULT_TOOL], os: [DEFAULT_OS] },
    },
  ],
  developers: [],
  agents: [],
  automation: [],
}

const VAULT_ROOT = "content/vault"

function pickVariant<T extends string>(want: T, available: T[], fallback: T): T {
  if (available.includes(want)) return want
  if (available.includes(fallback)) return fallback
  return available[0] ?? fallback
}

/**
 * Repo-relative path to the best matching PDF for a deliverable + member stack.
 * Gracefully falls back to the default ({other}/{windows}) build.
 */
export function resolveFile(track: TrackId, d: Deliverable, tool: ToolId, os: OsId): string {
  const t = pickVariant(tool, d.variants.tools, DEFAULT_TOOL)
  const o = pickVariant(os, d.variants.os, DEFAULT_OS)
  return `${VAULT_ROOT}/${track}/${d.fileStem}__${t}__${o}.pdf`
}

export function deliverableById(id: string): { track: TrackId; deliverable: Deliverable } | null {
  for (const track of Object.keys(VAULT) as TrackId[]) {
    const deliverable = VAULT[track].find((d) => d.id === id)
    if (deliverable) return { track, deliverable }
  }
  return null
}

/** Every deliverable across all tracks (flat), for catalog rendering. */
export function allDeliverables(): { track: TrackId; deliverable: Deliverable }[] {
  const out: { track: TrackId; deliverable: Deliverable }[] = []
  for (const track of Object.keys(VAULT) as TrackId[]) {
    for (const deliverable of VAULT[track]) out.push({ track, deliverable })
  }
  return out
}
