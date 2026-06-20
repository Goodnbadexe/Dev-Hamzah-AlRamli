// === METADATA ===
// Purpose: Stamp a per-buyer watermark onto a PDF before it's served, so a leaked
//          file is traceable to the account that downloaded it. Results are cached
//          per {file,email} to avoid re-stamping on every download (watermark CPU
//          is a real DoS vector under load).
// Runtime: pdf-lib requires the nodejs runtime (not Edge).
// === END METADATA ===
import "server-only"
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib"

const cache = new Map<string, Uint8Array>()
const CACHE_MAX = 200

export interface Stamp {
  email: string
  orderId: string
}

async function stamp(bytes: Uint8Array, { email, orderId }: Stamp): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes, { updateMetadata: false })
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const label = `${email}  ·  ${orderId}`
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize()
    // diagonal, low-opacity, repeated lightly down the page
    for (let y = height * 0.15; y < height; y += height * 0.33) {
      page.drawText(label, {
        x: width * 0.08,
        y,
        size: 16,
        font,
        color: rgb(0.55, 0.55, 0.6),
        opacity: 0.16,
        rotate: degrees(35),
      })
    }
  }
  return doc.save()
}

/** Stamp with a per-{file,email} cache. `cacheKey` should be the resolved file path + email. */
export async function stampCached(cacheKey: string, bytes: Uint8Array, s: Stamp): Promise<Uint8Array> {
  const hit = cache.get(cacheKey)
  if (hit) return hit
  const out = await stamp(bytes, s)
  if (cache.size >= CACHE_MAX) cache.clear() // simple bound; fine for this scale
  cache.set(cacheKey, out)
  return out
}
