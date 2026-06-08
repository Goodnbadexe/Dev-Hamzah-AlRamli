// === METADATA ===
// Purpose: Lightweight in-memory fixed-window rate limiter for API routes.
// Author: @Goodnbad.exe
// Inputs: A string key (typically client IP) + { limit, windowMs }.
// Outputs: { ok, remaining, resetAt } — ok=false when the window is exhausted.
// Assumptions: Serverless functions reuse warm instances, so the Map persists
//   per-instance between invocations. This is BEST-EFFORT: it raises the bar on
//   abuse meaningfully but is not a globally-consistent limiter. For strict
//   global limits, back this with Upstash/Redis. Documented intentionally.
// Complexity: O(1) amortized per call; opportunistic pruning is O(n) but rare.
// Security: Pure rate accounting — no secrets, no user data stored beyond the key.
// === END METADATA ===

interface Bucket {
  count: number
  resetAt: number
}

const store = new Map<string, Bucket>()

// Prevent unbounded growth on long-lived instances: prune expired buckets once
// the map gets large rather than on every call.
const PRUNE_THRESHOLD = 5000

function pruneExpired(now: number): void {
  if (store.size < PRUNE_THRESHOLD) return
  for (const [key, bucket] of store) {
    if (now > bucket.resetAt) store.delete(key)
  }
}

export interface RateLimitResult {
  ok: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now()
  pruneExpired(now)

  const bucket = store.get(key)

  if (!bucket || now > bucket.resetAt) {
    const resetAt = now + opts.windowMs
    store.set(key, { count: 1, resetAt })
    return { ok: true, remaining: opts.limit - 1, resetAt }
  }

  if (bucket.count >= opts.limit) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt }
  }

  bucket.count += 1
  return { ok: true, remaining: opts.limit - bucket.count, resetAt: bucket.resetAt }
}

// Test-only helper to reset state between cases. Not used in production paths.
export function __resetRateLimit(): void {
  store.clear()
}
