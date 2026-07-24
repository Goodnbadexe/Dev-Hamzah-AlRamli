// === METADATA ===
// Purpose: Public, free lead-magnet delivery. Streams a track's BLURRED teaser
//          PDF (content/vault/<track>/<track>-vault-teaser.pdf) so the /subscribe
//          welcome email can link a real, personalized download.
// Security: only ever serves *-teaser.pdf, and `track` is validated against the
//          TrackId enum (a fixed 6-value whitelist) BEFORE touching the filesystem
//          — so the path can never be attacker-controlled (no traversal) and the
//          paid OS builds stay Gumroad-gated and unreachable here.
// Runtime: nodejs — reads from the bundled filesystem. The file-tracer can't see
//          fs paths built at runtime, so next.config.mjs `outputFileTracingIncludes`
//          force-includes the teaser PDFs into this route's function bundle.
// === END METADATA ===
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { isTrackId } from "@/lib/subscribe/tracks"

export const runtime = "nodejs"

export async function GET(_req: Request, { params }: { params: Promise<{ track: string }> }) {
  const { track } = await params
  if (!isTrackId(track)) {
    return new Response("Unknown teaser", { status: 404 })
  }

  const file = join(process.cwd(), "content", "vault", track, `${track}-vault-teaser.pdf`)
  let pdf: Buffer
  try {
    pdf = await readFile(file)
  } catch {
    // Missing from the deploy bundle — surface a 404 instead of a silent empty 200.
    return new Response("Teaser unavailable", { status: 404 })
  }

  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${track}-vault-teaser.pdf"`,
      // Free + regenerated per build → cache hard at the edge and in the browser.
      "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}
