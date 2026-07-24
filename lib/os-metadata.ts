// === METADATA ===
// Purpose: Shared Next.js Metadata helper for GOODNBAD OS routes — keeps
//          titles, canonical URLs, and OG defaults consistent per app page.
// Author: @Goodnbad.exe
// Inputs: title, description, route path
// Outputs: Metadata object for App Router `export const metadata`
// Tests: type-checked via `npx tsc --noEmit`
// Complexity: O(1)
// === END METADATA ===
import type { Metadata } from "next"

const SITE_URL = "https://www.goodnbad.info"
const SITE_NAME = "GOODNBAD OS — Hamzah Al-Ramli"

export interface OsPageMeta {
  /** Page title, e.g. "Personnel File" — suffixed with the site identity. */
  title: string
  description: string
  /** Route path beginning with "/", e.g. "/personnel". */
  path: string
}

export function osPageMetadata({ title, description, path }: OsPageMeta): Metadata {
  const url = `${SITE_URL}${path}`
  return {
    title: `${title} | Hamzah Al-Ramli`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
  }
}
