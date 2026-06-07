"use client"

/**
 * PortfolioAssistant
 *
 * A small, safe, self-contained chat guide to Hamzah's work. It is NOT an LLM:
 * it runs entirely client-side against a fixed knowledge base (lib/assistant/faq)
 * with no network calls, so it can't be prompt-injected and can't leak the
 * site's hidden content — it only ever hints that a game exists. See faq.ts for
 * the security model.
 */

import { useEffect, useRef, useState, useCallback, Fragment } from "react"
import { MessageSquare, X, Send, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { answerFor, GREETING, type FaqReply } from "@/lib/assistant/faq"

interface ChatMessage {
  role: "user" | "assistant"
  text: string
  suggestions?: string[]
}

// ---------------------------------------------------------------------------
// Lightweight, safe linkifier — turns internal routes, emails, and known
// profile domains into links. Everything else stays plain text (no raw HTML).
// ---------------------------------------------------------------------------
const LINK_RE = /(\/[a-z][a-z0-9-]*(?:\/[a-z0-9-]+)*|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|(?:linkedin\.com|github\.com)\/[^\s]+)/gi

function Linkified({ text }: { text: string }) {
  const parts = text.split(LINK_RE)
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null
        const isRoute = /^\/[a-z]/i.test(part)
        const isEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(part)
        const isDomain = /^(?:linkedin\.com|github\.com)\//i.test(part)
        if (isRoute || isEmail || isDomain) {
          const href = isEmail ? `mailto:${part}` : isDomain ? `https://${part}` : part
          const external = isEmail || isDomain
          return (
            <a
              key={i}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-emerald-400 underline decoration-emerald-700/60 underline-offset-2 transition-colors hover:text-emerald-300"
            >
              {part}
            </a>
          )
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}

export function PortfolioAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Seed the greeting the first time the panel opens.
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", text: GREETING.text, suggestions: GREETING.suggestions }])
    }
    if (open) requestAnimationFrame(() => inputRef.current?.focus())
  }, [open, messages.length])

  // Keep the latest message in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, typing])

  useEffect(() => () => { if (typingTimer.current) clearTimeout(typingTimer.current) }, [])

  const send = useCallback((raw: string) => {
    const text = raw.trim()
    if (!text || typing) return
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text }])
    setTyping(true)

    const reply: FaqReply = answerFor(text)
    // Small, length-aware "thinking" delay so it feels considered, not instant.
    const delay = Math.min(900, 320 + reply.text.length * 4)
    typingTimer.current = setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, { role: "assistant", text: reply.text, suggestions: reply.suggestions }])
    }, delay)
  }, [typing])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    send(input)
  }

  // Chips from the most recent assistant message only.
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant")
  const chips = !typing ? lastAssistant?.suggestions ?? [] : []

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition-all duration-200",
          open
            ? "border-zinc-700 bg-zinc-900 text-zinc-400"
            : "border-emerald-800 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 shadow-[0_0_16px_theme(colors.emerald.900)]"
        )}
        aria-label={open ? "Close assistant" : "Ask the portfolio assistant"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 flex w-[min(400px,calc(100vw-2rem))] h-[min(560px,calc(100vh-7rem))] flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-2.5 border-b border-zinc-800/60 px-4 py-3 shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)] animate-pulse motion-reduce:animate-none" />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Portfolio Assistant
            </span>
            <span className="ml-auto flex items-center gap-1 font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
              <ShieldCheck className="h-3 w-3" />
              safe mode
            </span>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 min-h-0 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                    m.role === "user"
                      ? "rounded-br-sm bg-emerald-600/90 text-emerald-50"
                      : "rounded-bl-sm border border-zinc-800 bg-zinc-900/70 text-zinc-200"
                  )}
                >
                  {m.role === "assistant" ? <Linkified text={m.text} /> : m.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-zinc-800 bg-zinc-900/70 px-3.5 py-3">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce motion-reduce:animate-none"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggestion chips */}
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-t border-zinc-900 px-3 pt-2.5 pb-1 shrink-0">
              {chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => send(c)}
                  className="rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 font-mono text-[10px] text-zinc-400 transition-colors hover:border-emerald-800 hover:text-emerald-300"
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-zinc-800/60 p-2.5 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Hamzah's work…"
              aria-label="Ask the portfolio assistant a question"
              maxLength={300}
              className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-[13px] text-zinc-200 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-800"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-800 bg-emerald-950 text-emerald-400 transition-colors hover:bg-emerald-900 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
