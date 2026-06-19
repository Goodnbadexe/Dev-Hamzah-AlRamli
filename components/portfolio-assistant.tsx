"use client"

/**
 * PortfolioAssistant
 *
 * Floating AI chat widget for goodnbad.info. Visitors ask about Hamzah's work,
 * services, certifications, availability, and the Toolkit Vault; answers come
 * from a scoped Claude FAQ bot at POST /api/assistant (see app/api/assistant).
 *
 * Bilingual: all UI strings flow through useLanguage().t() and the panel honors
 * dir. If the API has no key it returns a graceful fallback and we render the
 * static FAQ list so the widget stays useful. Requires ANTHROPIC_API_KEY in
 * Vercel env for live Claude answers.
 */

import { useEffect, useRef, useState } from "react"
import { MessageSquare, X, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { faqItems, type FAQItem } from "@/lib/content/faq"

type ChatRole = "user" | "assistant"
type ChatMessage = { role: ChatRole; content: string }

type AssistantSuccess = { reply: string }
type AssistantFallback = { fallback: true; message: string; faq: FAQItem[] }
type AssistantError = { error: string }
type AssistantResponse = AssistantSuccess | AssistantFallback | AssistantError

const SUGGESTION_KEYS = ["who-is-hamzah", "cybersecurity-services", "availability", "toolkit-vault-what"]

export function PortfolioAssistant() {
  const { t, dir, lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Populated when the API reports no key — we show the static FAQ instead of chat.
  const [fallbackFaq, setFallbackFaq] = useState<FAQItem[] | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)

  // Keep the latest message in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading, fallbackFaq])

  const suggestions = SUGGESTION_KEYS
    .map((key) => faqItems.find((item) => item.key === key))
    .filter((item): item is FAQItem => Boolean(item))

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setError(null)
    setInput("")
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }]
    setMessages(nextMessages)
    setLoading(true)

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, lang }),
      })
      const data = (await res.json()) as AssistantResponse

      if ("fallback" in data && data.fallback) {
        // No key configured — surface the static FAQ list and a short note.
        setFallbackFaq(data.faq?.length ? data.faq : faqItems)
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
        return
      }

      if (res.ok && "reply" in data && typeof data.reply === "string") {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
        return
      }

      const msg =
        ("error" in data && data.error) ||
        t("تعذّر الوصول إلى المساعد. حاول مرة أخرى.", "Couldn't reach the assistant. Please try again.")
      setError(msg)
    } catch {
      setError(t("حدث خطأ في الشبكة. حاول مرة أخرى.", "A network error occurred. Please try again."))
    } finally {
      setLoading(false)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition-all duration-200",
          open
            ? "border-zinc-700 bg-zinc-900 text-zinc-400"
            : "border-emerald-800 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 shadow-[0_0_16px_theme(colors.emerald.900)]"
        )}
        aria-label={open ? t("إغلاق المساعد", "Close assistant") : t("اسأل مساعد البورتفوليو", "Ask the portfolio assistant")}
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          dir={dir}
          className="fixed bottom-20 right-6 z-50 flex max-h-[520px] w-[360px] flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center gap-3 border-b border-zinc-800/60 px-4 py-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400">
              {t("مساعد البورتفوليو", "Portfolio Assistant")}
            </span>
            <span className="ms-auto font-mono text-[9px] uppercase tracking-widest text-zinc-600">
              goodnbad.info
            </span>
          </div>

          {/* Message list */}
          <div ref={scrollRef} className="flex-1 min-h-0 space-y-3 overflow-y-auto px-4 py-4">
            {isEmpty && !fallbackFaq && (
              <div className="space-y-3">
                <p className="font-mono text-[11px] leading-relaxed text-zinc-500">
                  {t(
                    "اسألني عن خدمات حمزة وشهاداته وتوفّره، أو عن «خزينة الأدوات».",
                    "Ask me about Hamzah's services, certifications, availability, or the Toolkit Vault.",
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => send(t(item.q.ar, item.q.en))}
                      className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[11px] text-zinc-300 transition-colors hover:border-emerald-800 hover:text-emerald-400"
                    >
                      {t(item.q.ar, item.q.en)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[13px] leading-relaxed",
                    msg.role === "user"
                      ? "bg-emerald-900/40 text-emerald-50"
                      : "bg-zinc-900 text-zinc-200",
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-zinc-900 px-3 py-2 text-[13px] text-zinc-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {t("يكتب…", "Typing…")}
                </div>
              </div>
            )}

            {/* No-key fallback: static FAQ list */}
            {fallbackFaq && (
              <div className="space-y-2 border-t border-zinc-800/60 pt-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  {t("الأسئلة الشائعة", "Frequently asked")}
                </p>
                {fallbackFaq.map((item) => (
                  <details
                    key={item.key}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-zinc-300"
                  >
                    <summary className="cursor-pointer list-none text-[12px] font-medium text-emerald-400">
                      {t(item.q.ar, item.q.en)}
                    </summary>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-400">
                      {t(item.a.ar, item.a.en)}
                    </p>
                  </details>
                ))}
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-[12px] text-red-300">
                {error}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex shrink-0 items-center gap-2 border-t border-zinc-800/60 px-3 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("اكتب سؤالك…", "Type your question…")}
              disabled={loading}
              className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-800 focus:outline-none disabled:opacity-50"
              aria-label={t("سؤالك للمساعد", "Your question for the assistant")}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-800 bg-emerald-950 text-emerald-400 transition-colors hover:bg-emerald-900 disabled:opacity-40"
              aria-label={t("إرسال", "Send")}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
