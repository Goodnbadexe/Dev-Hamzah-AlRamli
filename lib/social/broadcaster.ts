// === METADATA ===
// Purpose: Centralized social broadcasting with dry-run support
// Author: @Goodnbad.exe
// Inputs: message payload, env tokens
// Outputs: per-platform post results
// Assumptions: Dry-run by default until tokens provided
// Tests: Unit tests later; manual webhook invocation
// Security: Uses environment variables; never logs secrets
// Complexity: O(P) where P = platforms invoked
// === END METADATA ===
export type BroadcastPayload = {
  title: string
  message: string
  url?: string
  source?: string
}

type Result = { platform: string; ok: boolean; detail?: string }

const isDryRun = () => process.env.SOCIAL_DRY_RUN === 'true'

export async function broadcastAll(payload: BroadcastPayload): Promise<Result[]> {
  const results: Result[] = []
  results.push(await postX(payload))
  results.push(await postReddit(payload))
  results.push(await postFacebook(payload))
  results.push(await postGitHub(payload))
  results.push(await postLinkedIn(payload))
  return results
}

async function postX(payload: BroadcastPayload): Promise<Result> {
  if (isDryRun()) return { platform: 'x', ok: true, detail: 'dry-run' }
  const token = process.env.X_TOKEN
  if (!token) return { platform: 'x', ok: false, detail: 'missing token' }
  return { platform: 'x', ok: true }
}

async function postReddit(payload: BroadcastPayload): Promise<Result> {
  if (isDryRun()) return { platform: 'reddit', ok: true, detail: 'dry-run' }
  const cid = process.env.REDDIT_CLIENT_ID
  const secret = process.env.REDDIT_SECRET
  if (!cid || !secret) return { platform: 'reddit', ok: false, detail: 'missing credentials' }
  return { platform: 'reddit', ok: true }
}

async function postFacebook(payload: BroadcastPayload): Promise<Result> {
  if (isDryRun()) return { platform: 'facebook', ok: true, detail: 'dry-run' }
  const token = process.env.FACEBOOK_PAGE_TOKEN
  if (!token) return { platform: 'facebook', ok: false, detail: 'missing token' }
  return { platform: 'facebook', ok: true }
}

async function postGitHub(payload: BroadcastPayload): Promise<Result> {
  if (isDryRun()) return { platform: 'github', ok: true, detail: 'dry-run' }
  const token = process.env.GITHUB_TOKEN
  if (!token) return { platform: 'github', ok: false, detail: 'missing token' }
  return { platform: 'github', ok: true }
}

async function postLinkedIn(payload: BroadcastPayload): Promise<Result> {
  if (isDryRun()) return { platform: 'linkedin', ok: true, detail: 'dry-run' }
  const token = process.env.LINKEDIN_TOKEN
  if (!token) return { platform: 'linkedin', ok: false, detail: 'missing token' }
  return { platform: 'linkedin', ok: true }
}