import "server-only"

/**
 * OpenRouter chat-completions helper for the AI SDR assistant.
 *
 * Server-side only. Calls OpenRouter's OpenAI-compatible endpoint with the
 * key from the environment. No streaming — a single completion string is
 * returned. All failure modes (missing key, non-200, malformed body) throw a
 * clean Error so callers can degrade gracefully.
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const DEFAULT_MODEL = "anthropic/claude-3.5-haiku"
const TEMPERATURE = 0.4
const MAX_TOKENS = 600

export type SdrRole = "system" | "user" | "assistant"
export type SdrMessage = { role: SdrRole; content: string }

type OpenRouterChoice = { message?: { content?: string } }
type OpenRouterResponse = { choices?: OpenRouterChoice[]; error?: { message?: string } }

/**
 * Send `messages` (including the system prompt) to OpenRouter and return the
 * assistant's reply text.
 *
 * @throws Error when the API key is missing, the request fails, or the upstream
 *   response is non-200 / empty.
 */
export async function sdrComplete(messages: readonly SdrMessage[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured")
  }

  const model = process.env.SDR_MODEL || DEFAULT_MODEL

  let response: Response
  try {
    response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
      }),
    })
  } catch (cause) {
    throw new Error("Failed to reach OpenRouter", { cause })
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "")
    throw new Error(`OpenRouter returned ${response.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`)
  }

  let data: OpenRouterResponse
  try {
    data = (await response.json()) as OpenRouterResponse
  } catch (cause) {
    throw new Error("OpenRouter returned a malformed response", { cause })
  }

  const reply = data.choices?.[0]?.message?.content?.trim()
  if (!reply) {
    throw new Error(data.error?.message ?? "OpenRouter returned an empty completion")
  }

  return reply
}
