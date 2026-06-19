import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { faqItems, portfolioContext, type FAQItem } from "@/lib/content/faq"

/**
 * Portfolio FAQ assistant — POST /api/assistant
 *
 * A scoped Claude-powered FAQ bot for Hamzah's portfolio. It answers ONLY from
 * the bilingual FAQ knowledge base in lib/content/faq.ts, in the visitor's
 * language. Anything outside the FAQ gets a "not sure" answer that points to the
 * Contact page or the Toolkit Vault.
 *
 * Request body:  { messages: ChatMessage[], lang: "ar" | "en" }
 * Response:      { reply: string }                       (live Claude answer)
 *           or:  { fallback: true, message: string, faq: FAQItem[] }
 *                                                         (no API key configured)
 *
 * Live answers require ANTHROPIC_API_KEY in the environment (Vercel). Without it
 * the route degrades gracefully to the static FAQ list so the widget stays useful.
 */

export const runtime = "nodejs"

const MODEL = "claude-sonnet-4-6"
const MAX_TOKENS = 1024
const MAX_HISTORY = 12 // cap conversation turns sent to the model

type ChatRole = "user" | "assistant"
type ChatMessage = { role: ChatRole; content: string }
type Lang = "ar" | "en"

/** Build the scoped system prompt from the FAQ + context blurb for one language. */
function buildSystemPrompt(lang: Lang): string {
  const context = lang === "ar" ? portfolioContext.ar : portfolioContext.en
  const faqBlock = faqItems
    .map((item, i) => {
      const q = lang === "ar" ? item.q.ar : item.q.en
      const a = lang === "ar" ? item.a.ar : item.a.en
      return `${i + 1}. Q: ${q}\n   A: ${a}`
    })
    .join("\n\n")

  return [
    "You are Hamzah's portfolio FAQ assistant on goodnbad.info.",
    `Answer ONLY from the provided FAQ and context, concisely, in the user's language (${lang}).`,
    "Never invent facts. If a question is outside the FAQ, say you're not sure and point",
    "the visitor to the Contact page (for hiring, services, or collaboration) or to the",
    "Toolkit Vault at goodnbad.info/subscribe (for the weekly security + AI tools PDF),",
    "whichever is more relevant. Keep answers short — two or three sentences at most.",
    "",
    "=== CONTEXT ===",
    context,
    "",
    "=== FAQ ===",
    faqBlock,
  ].join("\n")
}

/** Validate and normalize the inbound message history. */
function sanitizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return []
  const cleaned: ChatMessage[] = []
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue
    const role = (raw as { role?: unknown }).role
    const content = (raw as { content?: unknown }).content
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue
    const trimmed = content.trim()
    if (!trimmed) continue
    cleaned.push({ role, content: trimmed.slice(0, 2000) })
  }
  // The API requires the first message to be from the user.
  while (cleaned.length && cleaned[0].role !== "user") cleaned.shift()
  return cleaned.slice(-MAX_HISTORY)
}

/** Graceful no-key fallback payload — the widget renders the static FAQ list. */
function fallbackResponse(lang: Lang) {
  const message =
    lang === "ar"
      ? "المساعد المباشر غير مُفعّل حاليًا. إليك أكثر الأسئلة شيوعًا — أو تواصل عبر صفحة Contact."
      : "The live assistant isn't enabled right now. Here are the most common questions — or reach out via the Contact page."
  return NextResponse.json({ fallback: true as const, message, faq: faqItems satisfies FAQItem[] })
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const rawLang = (body as { lang?: unknown })?.lang
  const lang: Lang = rawLang === "ar" ? "ar" : "en"
  const messages = sanitizeMessages((body as { messages?: unknown })?.messages)

  if (messages.length === 0) {
    return NextResponse.json({ error: "messages must contain at least one user message" }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // No key configured — degrade gracefully instead of erroring.
    return fallbackResponse(lang)
  }

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: buildSystemPrompt(lang),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    })

    const reply = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim()

    if (!reply) {
      return fallbackResponse(lang)
    }

    return NextResponse.json({ reply })
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      // Bad/expired key — treat like "not configured" so the widget stays useful.
      return fallbackResponse(lang)
    }
    const status = error instanceof Anthropic.APIError ? error.status ?? 502 : 500
    const detail = error instanceof Error ? error.message : String(error)
    const message =
      lang === "ar"
        ? "تعذّر الوصول إلى المساعد. حاول مرة أخرى لاحقًا أو تواصل عبر صفحة Contact."
        : "Couldn't reach the assistant. Please try again later or use the Contact page."
    return NextResponse.json({ error: message, detail }, { status })
  }
}
