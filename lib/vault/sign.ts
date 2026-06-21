// === METADATA ===
// Purpose: HMAC sign/verify for short-lived vault download URLs. The token proves
//          a URL was issued by us and hasn't expired; it is NOT the authoritative
//          gate (entitlement is re-checked server-side on every download).
// Server-only: uses node:crypto + VAULT_SIGNING_SECRET. Never import client-side.
// === END METADATA ===
import "server-only"
import crypto from "node:crypto"

export interface VaultClaim {
  id: string // deliverable id
  email: string
  exp: number // unix seconds
}

export const TOKEN_TTL_SECONDS = 300 // 5 minutes

function secret(): string {
  const s = process.env.VAULT_SIGNING_SECRET
  if (!s) throw new Error("VAULT_SIGNING_SECRET not set")
  return s
}

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}
function unb64url(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64")
}
function hmac(body: string): string {
  return b64url(crypto.createHmac("sha256", secret()).update(body).digest())
}

export function signClaim(claim: VaultClaim): string {
  const body = b64url(Buffer.from(JSON.stringify(claim)))
  return `${body}.${hmac(body)}`
}

/** Returns the claim if the signature is valid AND not expired, else null. */
export function verifyToken(token: string): VaultClaim | null {
  const dot = token.indexOf(".")
  if (dot <= 0) return null
  const body = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = hmac(body)
  // constant-time compare
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  let claim: VaultClaim
  try {
    claim = JSON.parse(unb64url(body).toString("utf8"))
  } catch {
    return null
  }
  if (!claim || typeof claim.id !== "string" || typeof claim.email !== "string" || typeof claim.exp !== "number") {
    return null
  }
  if (claim.exp * 1000 < Date.now()) return null
  return claim
}
