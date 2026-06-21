// === METADATA ===
// Purpose: Vault catalog. One designed magazine ISSUE per track (week), rendered
//          from content/vault/issues/*.json by scripts/build-vault-pdfs.mjs into
//          a full PDF (payers) + a blurred teaser PDF (free lead magnet).
// Note:    Gumroad currently delivers the files, so the gated route below is
//          dormant; this manifest stays the single source of truth for what each
//          product is. Member-facing names are outcome-framed.
// Storage: content/vault/<track>/<track>-vault.pdf  (+ ...-vault-teaser.pdf).
//          Paid files are NOT in public/.
// === END METADATA ===

import type { TrackId, OsId } from "@/lib/subscribe/tracks"

export interface Deliverable {
  id: string
  week: 1 | 2 | 3 | 4 | 5 | 6
  outcomeEn: string
  outcomeAr: string
  /** file stem → content/vault/<track>/<fileStem>.pdf (+ <fileStem>-teaser.pdf) */
  fileStem: string
}

export const VAULT: Record<TrackId, Deliverable[]> = {
  security: [
    {
      id: "security-vault",
      week: 1,
      outcomeEn: "Week 1 · Security — 5 underground tools + paste-ready prompts",
      outcomeAr: "الأسبوع ١ · الأمن — ٥ أدوات سرية مع برومبتات جاهزة",
      fileStem: "security-vault",
    },
  ],
  developers: [
    {
      id: "developers-vault",
      week: 2,
      outcomeEn: "Week 2 · Developers — 5 tools that ship you faster",
      outcomeAr: "الأسبوع ٢ · المطوّرين — ٥ أدوات تنجزك أسرع",
      fileStem: "developers-vault",
    },
  ],
  agents: [
    {
      id: "agents-vault",
      week: 3,
      outcomeEn: "Week 3 · Agents — 5 tools to build real AI agents",
      outcomeAr: "الأسبوع ٣ · الوكلاء — ٥ أدوات تبني بها وكلاء فعليين",
      fileStem: "agents-vault",
    },
  ],
  automation: [
    {
      id: "automation-vault",
      week: 4,
      outcomeEn: "Week 4 · Automation — 5 tools that run your stack",
      outcomeAr: "الأسبوع ٤ · الأتمتة — ٥ أدوات تشغّل أدواتك عنك",
      fileStem: "automation-vault",
    },
  ],
  quant: [
    {
      id: "quant-vault",
      week: 5,
      outcomeEn: "Week 5 · Quant & Trading — 5 open-source engines funds run",
      outcomeAr: "الأسبوع ٥ · التداول الكمّي — ٥ محركات مفتوحة تستخدمها الصناديق",
      fileStem: "quant-vault",
    },
  ],
  creative: [
    {
      id: "creative-vault",
      week: 6,
      outcomeEn: "Week 6 · Build in the Browser — 5 no-install 3D & creative tools",
      outcomeAr: "الأسبوع ٦ · ابنِ في المتصفح — ٥ أدوات إبداعية و3D بدون تثبيت",
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
