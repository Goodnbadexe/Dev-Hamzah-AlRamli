"use client"

/**
 * IocInspector
 * ------------
 * The IOC detail interaction. A list of live indicators is shown; hovering a
 * globe dot or clicking a list row pins it, and a detailed card slides into the
 * center of the screen.
 *
 * placement:
 *   "rail"   — fixed slim rail pinned to the right edge (legacy / standalone use)
 *   "inline" — renders the list in normal flow, to be embedded beside the
 *              signal feed in the homepage left column
 *
 * Controlled inputs:
 *   recent   — live stream of IOCs (newest first)
 *   hovered  — IOC currently hovered on the globe (null when none)
 * Internal:
 *   pinned   — IOC the user clicked; takes precedence over hover for the card
 */

import { useEffect, useState } from "react"
import { X, ShieldAlert, Crosshair, ExternalLink } from "lucide-react"
import type { ThreatIoc } from "@/app/api/threats/route"
import { IOC_COLOR } from "@/components/signal/ThreatGlobe"

const SEV_BADGE: Record<ThreatIoc["severity"], string> = {
  critical: "text-rose-300 border-rose-500/40 bg-rose-500/12",
  high:     "text-orange-300 border-orange-500/40 bg-orange-500/12",
  medium:   "text-yellow-300 border-yellow-500/35 bg-yellow-500/10",
  low:      "text-zinc-400 border-zinc-700 bg-zinc-800/30",
}

const typeLabel = (t: ThreatIoc["type"]) => t.replace("_", " ").toUpperCase()

// Plain-English explainer per indicator type — so a non-specialist understands
// what they're looking at, not just a colored dot.
const IOC_EXPLAINER: Record<ThreatIoc["type"], string> = {
  c2_server:
    "A command-and-control (C2) server is the attacker's remote control panel — infected machines quietly “call home” to it to receive orders and ship out stolen data.",
  malware_host:
    "A malware host is a server handing out malicious files. Victims get infected by downloading from it, often through a booby-trapped link or a drive-by page.",
  phishing:
    "A phishing host serves fake login or payment pages that impersonate a trusted brand to trick people into typing in their credentials.",
  malicious_url:
    "A malicious URL is a web address flagged for hosting malware, scams, or phishing — simply visiting it can compromise your device.",
  ransomware:
    "A ransomware indicator marks a confirmed victim of a ransomware crew: files are encrypted and held hostage until a ransom is paid.",
}

// Best-effort "view source report" link. AbuseIPDB resolves to a per-IP report;
// the others land on the feed's own browse/listing page (honest — no fabricated
// deep links). Returns null when no sensible target exists.
function sourceReportUrl(ioc: ThreatIoc): string | null {
  const ref = ioc.ref ?? ""
  switch (ioc.source) {
    case "AbuseIPDB":      return ref ? `https://www.abuseipdb.com/check/${encodeURIComponent(ref)}` : "https://www.abuseipdb.com"
    case "URLhaus":        return `https://urlhaus.abuse.ch/browse.php?search=${encodeURIComponent(ref)}`
    case "Feodo Tracker":  return "https://feodotracker.abuse.ch/browse/"
    case "C2IntelFeeds":   return "https://github.com/drb-ra/C2IntelFeeds"
    case "Ransomware.live": return "https://www.ransomware.live/recentvictims"
    case "AlienVault OTX": return "https://otx.alienvault.com"
    default:               return null
  }
}

interface Props {
  recent: ThreatIoc[]
  hovered: ThreatIoc | null
  /** "rail" = fixed right rail; "inline" = in-flow block (e.g. beside the feed). */
  placement?: "rail" | "inline"
  /** Hide the rail entirely (only relevant for placement="rail"). */
  railHidden?: boolean
  /** Controlled pinned IOC (e.g. set by clicking a globe dot). Omit for uncontrolled. */
  pinned?: ThreatIoc | null
  /** Called when the pinned IOC changes (row click, dot click, close). */
  onPin?: (ioc: ThreatIoc | null) => void
  /** Called when the surface itself is dismissed (e.g. the rail close button). */
  onClose?: () => void
}

// ── Live indicator list (shared by both placements) ─────────────────────────
function IocList({
  recent,
  onPick,
  max = 6,
}: {
  recent: ThreatIoc[]
  onPick: (ioc: ThreatIoc) => void
  max?: number
}) {
  return (
    <ul className="space-y-0.5">
      {recent.length === 0 && (
        <li className="px-2 py-3 font-mono text-[10px] leading-relaxed text-zinc-600">
          Awaiting indicators… each entry is real malicious infrastructure, no fake arcs.
        </li>
      )}
      {recent.slice(0, max).map((ioc, i) => (
        <li key={`${ioc.id}-${i}`}>
          <button
            type="button"
            onClick={() => onPick(ioc)}
            className="group flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-left transition-colors hover:bg-zinc-900/70"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: IOC_COLOR[ioc.type], boxShadow: `0 0 6px ${IOC_COLOR[ioc.type]}` }}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-mono text-[11px] text-zinc-300 group-hover:text-zinc-100">
                {typeLabel(ioc.type)}
              </span>
              <span className="block truncate font-mono text-[9px] text-zinc-600">
                {ioc.source} · {ioc.country}
              </span>
            </span>
            <span className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider ${SEV_BADGE[ioc.severity]}`}>
              {ioc.severity}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export function IocInspector({ recent, hovered, placement = "rail", railHidden = false, pinned: pinnedProp, onPin, onClose }: Props) {
  // Controlled when `pinned`/`onPin` are supplied (e.g. globe dot clicks lift it
  // to the page); otherwise falls back to internal state for standalone use.
  const [internalPinned, setInternalPinned] = useState<ThreatIoc | null>(null)
  const pinned = pinnedProp !== undefined ? pinnedProp : internalPinned
  const setPinned = (ioc: ThreatIoc | null) => { onPin ? onPin(ioc) : setInternalPinned(ioc) }
  const detail = pinned ?? hovered
  const open = Boolean(detail)

  // Esc clears the pinned card
  useEffect(() => {
    if (!pinned) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPinned(null) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [pinned])

  return (
    <>
      {/* ── Inline surface — embedded in the content column beside the feed ── */}
      {placement === "inline" && (
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <ShieldAlert className="h-3 w-3 text-rose-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              live IOC surface
            </span>
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-zinc-700">
              click to inspect
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_theme(colors.rose.500)] animate-pulse motion-reduce:animate-none" />
            </span>
          </div>
          <IocList recent={recent} onPick={setPinned} />
        </div>
      )}

      {/* ── Fixed right rail (legacy / standalone) ──────────────────────────── */}
      {placement === "rail" && !railHidden && (
        <aside className="fixed right-4 top-1/2 z-30 hidden w-[244px] -translate-y-1/2 lg:block">
          <div className="rounded-md border border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
            {/* Draggable header with close */}
            <div className="flex cursor-move items-center justify-between border-b border-zinc-800/60 px-3 py-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                live · ioc surface
              </span>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-zinc-600 transition-colors hover:text-zinc-300"
                  aria-label="Close IOC surface"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 border-b border-zinc-800/80 px-3 py-2">
              <ShieldAlert className="h-3 w-3 text-rose-400" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                live IOC surface
              </span>
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_theme(colors.rose.500)] animate-pulse" />
            </div>
            <div className="max-h-[46vh] overflow-hidden p-1.5">
              <IocList recent={recent} onPick={setPinned} max={7} />
            </div>
            <div className="border-t border-zinc-800/80 px-3 py-1.5 font-mono text-[8px] uppercase tracking-widest text-zinc-700">
              click an indicator → inspect
            </div>
          </div>
        </aside>
      )}

      {/* ── Center detail card — slides in from the side (global overlay) ───── */}
      <div
        className={`pointer-events-none fixed inset-0 z-40 flex items-center justify-center px-4 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!open}
      >
        {/* backdrop only when pinned (hover preview stays light) */}
        <button
          type="button"
          aria-label="Close inspector"
          onClick={() => setPinned(null)}
          className={`absolute inset-0 bg-zinc-950/55 backdrop-blur-[2px] transition-opacity duration-300 ${
            pinned ? "pointer-events-auto opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`relative w-[min(420px,calc(100vw-2rem))] rounded-lg border border-zinc-800 bg-zinc-950/90 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 ease-out ${
            open ? "translate-x-0 scale-100" : "translate-x-10 scale-95"
          } ${pinned ? "pointer-events-auto" : "pointer-events-none"}`}
          style={detail ? { boxShadow: `0 24px 80px rgba(0,0,0,0.6), inset 0 0 0 1px ${IOC_COLOR[detail.type]}33` } : undefined}
        >
          {detail && (
            <>
              <div className="flex items-center gap-2 border-b border-zinc-800/80 px-4 py-2.5">
                <Crosshair className="h-3.5 w-3.5" style={{ color: IOC_COLOR[detail.type] }} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  ioc.inspector
                </span>
                {pinned && (
                  <button
                    type="button"
                    onClick={() => setPinned(null)}
                    className="ml-auto text-zinc-600 transition-colors hover:text-zinc-200"
                    aria-label="Close"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="p-4">
                <div className="mb-1 font-mono text-base font-semibold tracking-wide" style={{ color: IOC_COLOR[detail.type] }}>
                  {typeLabel(detail.type)}
                </div>
                <div className="mb-4 break-all font-mono text-[11px] leading-relaxed text-zinc-300">
                  {detail.ref ?? "—"}
                </div>

                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-[11px]">
                  <dt className="self-center text-[9px] uppercase tracking-widest text-zinc-600">Source</dt>
                  <dd className="text-zinc-200">{detail.source}</dd>
                  {detail.malware && (
                    <>
                      <dt className="self-center text-[9px] uppercase tracking-widest text-zinc-600">Family</dt>
                      <dd className="text-zinc-200">{detail.malware}</dd>
                    </>
                  )}
                  <dt className="self-center text-[9px] uppercase tracking-widest text-zinc-600">Country</dt>
                  <dd className="text-zinc-200">{detail.country}</dd>
                  <dt className="self-center text-[9px] uppercase tracking-widest text-zinc-600">Geo</dt>
                  <dd className="text-zinc-200">{detail.lat.toFixed(2)}, {detail.lng.toFixed(2)}</dd>
                  <dt className="self-center text-[9px] uppercase tracking-widest text-zinc-600">Severity</dt>
                  <dd>
                    <span className={`inline-block rounded border px-2 py-0.5 text-[9px] uppercase tracking-widest ${SEV_BADGE[detail.severity]}`}>
                      {detail.severity}
                    </span>
                  </dd>
                </dl>

                {/* Plain-English explainer */}
                <p className="mt-4 border-t border-zinc-800/80 pt-3 text-[12px] leading-relaxed text-zinc-400">
                  {IOC_EXPLAINER[detail.type]}
                </p>

                {/* View source report */}
                {(() => {
                  const url = sourceReportUrl(detail)
                  return url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 rounded border border-zinc-700 bg-zinc-900/60 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-400 transition-colors hover:border-emerald-700 hover:bg-emerald-950/40 hover:text-emerald-300"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View source report
                    </a>
                  ) : null
                })()}

                <p className="mt-3 font-mono text-[9px] leading-relaxed text-zinc-700">
                  Indicator of compromise — no fabricated attacker→target relationship.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
