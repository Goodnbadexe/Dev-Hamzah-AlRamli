// === METADATA ===
// Purpose: Vault catalog. One product per track — each track is its OWN 4-week
//          path (the week-by-week curriculum lives in lib/subscribe/tracks.ts),
//          NOT "week N of a 6-week series". Rendered from content/vault/issues/*.json
//          by scripts/build-vault-pdfs.mjs into a full PDF (payers) + a blurred
//          teaser PDF (free lead magnet).
// Note:    Gumroad currently delivers the files, so the gated route below is
//          dormant; this manifest stays the single source of truth for what each
//          product is. Member-facing names are outcome-framed.
// Storage: content/vault/<track>/<track>-vault.pdf  (+ ...-vault-teaser.pdf).
//          Paid files are NOT in public/.
// === END METADATA ===

import type { TrackId, OsId } from "@/lib/subscribe/tracks"

export interface Deliverable {
  id: string
  outcomeEn: string
  outcomeAr: string
  /** file stem → content/vault/<track>/<fileStem>.pdf (+ <fileStem>-teaser.pdf) */
  fileStem: string
}

export const VAULT: Record<TrackId, Deliverable[]> = {
  security: [
    {
      id: "security-vault",
      outcomeEn: "Security — 5 underground tools + paste-ready prompts",
      outcomeAr: "الأمن — ٥ أدوات سرية مع برومبتات جاهزة",
      fileStem: "security-vault",
    },
  ],
  developers: [
    {
      id: "developers-vault",
      outcomeEn: "Developers — 5 tools that ship you faster",
      outcomeAr: "المطوّرين — ٥ أدوات تنجزك أسرع",
      fileStem: "developers-vault",
    },
  ],
  agents: [
    {
      id: "agents-vault",
      outcomeEn: "Agents — 5 tools to build real AI agents",
      outcomeAr: "الوكلاء — ٥ أدوات تبني بها وكلاء فعليين",
      fileStem: "agents-vault",
    },
  ],
  automation: [
    {
      id: "automation-vault",
      outcomeEn: "Automation — 5 tools that run your stack",
      outcomeAr: "الأتمتة — ٥ أدوات تشغّل أدواتك عنك",
      fileStem: "automation-vault",
    },
  ],
  quant: [
    {
      id: "quant-vault",
      outcomeEn: "Quant & Trading — 5 open-source engines funds run",
      outcomeAr: "التداول الكمّي — ٥ محركات مفتوحة تستخدمها الصناديق",
      fileStem: "quant-vault",
    },
  ],
  creative: [
    {
      id: "creative-vault",
      outcomeEn: "Build in the Browser — 5 no-install 3D & creative tools",
      outcomeAr: "ابنِ في المتصفح — ٥ أدوات إبداعية و3D بدون تثبيت",
      fileStem: "creative-vault",
    },
  ],
}

const VAULT_ROOT = "content/vault"

/** Repo-relative path to a deliverable's OS-tuned full (payer) PDF. */
export function resolveFile(track: TrackId, d: Deliverable, os: OsId = "windows"): string {
  return `${VAULT_ROOT}/${track}/${d.fileStem}-${os}.pdf`
}

/** Repo-relative path to the free blurred teaser PDF. */
export function teaserFile(track: TrackId, d: Deliverable): string {
  return `${VAULT_ROOT}/${track}/${d.fileStem}-teaser.pdf`
}

export function deliverableById(id: string): { track: TrackId; deliverable: Deliverable } | null {
  for (const track of Object.keys(VAULT) as TrackId[]) {
    const deliverable = VAULT[track].find((d) => d.id === id)
    if (deliverable) return { track, deliverable }
  }
  return null
}

export function allDeliverables(): { track: TrackId; deliverable: Deliverable }[] {
  const out: { track: TrackId; deliverable: Deliverable }[] = []
  for (const track of Object.keys(VAULT) as TrackId[]) {
    for (const deliverable of VAULT[track]) out.push({ track, deliverable })
  }
  return out
}
