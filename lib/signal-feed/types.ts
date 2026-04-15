// === SIGNAL FEED — Data Contract ===
// All external cyber threat sources are normalized to this shape.
// Never add fields that aren't provided by the source.

/** Display category for each item — drives ordering and badge colours */
export type FeedItemCategory = "advisory" | "kev" | "ioc" | "news"

/** Lower number = rendered first */
export const CATEGORY_PRIORITY: Record<FeedItemCategory, number> = {
  kev:      0,
  advisory: 1,
  ioc:      2,
  news:     3,
}

/** Source display metadata — one entry per approved source */
export interface SourceMeta {
  name:   string  // e.g. "CISA KEV"
  domain: string  // e.g. "cisa.gov"
  badge:  string  // Tailwind colour token for the badge
}

export const SOURCE_ALLOWLIST: Record<string, SourceMeta> = {
  "cisa.gov":             { name: "CISA",           domain: "cisa.gov",             badge: "emerald" },
  "msrc.microsoft.com":   { name: "MSRC",           domain: "msrc.microsoft.com",   badge: "blue"    },
  "api.msrc.microsoft.com": { name: "MSRC",         domain: "msrc.microsoft.com",   badge: "blue"    },
  "threatfox.abuse.ch":   { name: "ThreatFox",      domain: "threatfox.abuse.ch",   badge: "red"     },
  "threatfox-api.abuse.ch": { name: "ThreatFox",    domain: "threatfox.abuse.ch",   badge: "red"     },
  "urlhaus.abuse.ch":     { name: "URLhaus",         domain: "urlhaus.abuse.ch",     badge: "orange"  },
  "urlhaus-api.abuse.ch": { name: "URLhaus",         domain: "urlhaus.abuse.ch",     badge: "orange"  },
  "bleepingcomputer.com": { name: "BleepingComputer",domain: "bleepingcomputer.com", badge: "yellow"  },
  "www.bleepingcomputer.com": { name: "BleepingComputer", domain: "bleepingcomputer.com", badge: "yellow" },
  "nvd.nist.gov":         { name: "NVD",            domain: "nvd.nist.gov",         badge: "zinc"    },
}

/** Resolved source meta (after normalization) */
export interface ResolvedSource {
  name:   string
  domain: string
  badge:  string
}

/** A single normalized cyber-threat signal item */
export interface SignalFeedItem {
  /** Canonical URL — opens the original source page when clicked */
  url:          string
  /** Original title from the source — never AI-rewritten */
  title:        string
  /** Source name for display, e.g. "CISA KEV" */
  source:       string
  /** Source domain for badge lookup, e.g. "cisa.gov" */
  sourceDomain: string
  /** Tailwind colour token for the source badge */
  sourceBadge:  string
  /** ISO 8601 published timestamp */
  publishedAt:  string
  /** Content category */
  category:     FeedItemCategory
  /** Short description — ONLY if the source provides it; never generated */
  summary?:     string
  /** CVE identifier if the source provides it, e.g. "CVE-2025-1234" */
  cve?:         string
}

/** Shape returned by /api/signal-feed and aggregateSignalFeed() */
export interface SignalFeedResponse {
  items:        SignalFeedItem[]
  fetchedAt:    string
  /** Names of sources that failed — section still renders with remaining items */
  sourceErrors: string[]
}
