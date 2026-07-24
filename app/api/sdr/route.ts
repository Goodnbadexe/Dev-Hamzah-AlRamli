import { NextResponse } from "next/server"
import { z } from "zod"
import { sdrComplete, type SdrMessage } from "@/lib/sdr/openrouter"
import { SDR_SYSTEM_PROMPT_AR, SDR_SYSTEM_PROMPT_EN } from "@/content/sdr/knowledge"

/**
 * AI SDR assistant — POST /api/sdr
 *
 * Takes the running chat history plus the visitor's language, prepends the
 * matching bilingual system prompt, and returns a single OpenRouter completion.
 * Best-effort in-memory per-IP rate limiting guards the upstream spend.
 *
 * Request body:  { messages: { role: "user" | "assistant"; content: string }[], lang: "ar" | "en" }
 * Response:      { ok: true, reply: string }  |  { ok: false, error: string }
 */

export const runtime = "nodejs"

const MAX_HISTORY = 20 // cap conversation turns sent upstream
const MAX_MESSAGE_LEN = 2000 // cap each message's character length

// ── Best-effort rate limiting (per IP, fixed window) ──────────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 15
const hits = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT_MAX) return true
  // Immutable update of the counter for this window.
  hits.set(ip, { count: entry.count + 1, resetAt: entry.resetAt })
  return false
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]!.trim()
  return req.headers.get("x-real-ip")?.trim() || "unknown"
}

const bodySchema = z.object({
  lang: z.enum(["ar", "en"]),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(MAX_MESSAGE_LEN),
      }),
    )
    .min(1)
    .max(MAX_HISTORY),
})

export async function POST(req: Request) {
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait a moment and try again." },
      { status: 429 },
    )
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request payload." }, { status: 400 })
  }

  const { lang, messages } = parsed.data

  // Graceful degradation: if the LLM isn't configured yet, don't error on the
  // live page — steer the visitor to the booking action instead.
  if (!process.env.OPENROUTER_API_KEY) {
    const reply =
      lang === "ar"
        ? 'المساعد الذكي غير متاح مؤقتاً. للبدء، اضغط زر «احجز مراجعة مجانية» أعلاه — مراجعة 20 دقيقة لانكشافك السيبراني والذكاء الاصطناعي، بلا التزام.'
        : 'The AI assistant is briefly offline. To get started, tap "Book free review" above — a no-obligation 20-min review of your Cyber & AI exposure.'
    return NextResponse.json({ ok: true, reply })
  }

  const systemPrompt = lang === "ar" ? SDR_SYSTEM_PROMPT_AR : SDR_SYSTEM_PROMPT_EN

  const payload: SdrMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ]

  try {
    const reply = await sdrComplete(payload)
    return NextResponse.json({ ok: true, reply })
  } catch (err) {
    console.error("[sdr]", err instanceof Error ? err.message : err)
    return NextResponse.json(
      { ok: false, error: "The assistant is unavailable right now. Please try again shortly." },
      { status: 502 },
    )
  }
}
