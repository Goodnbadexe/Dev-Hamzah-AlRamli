'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Terminal, X, Send, CalendarCheck, Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

/**
 * Floating bilingual AI SDR chat widget.
 *
 * Mounted on the /services routes. Chats against POST /api/sdr and can open an
 * inline booking form that reuses POST /api/book-meeting. All copy is bilingual
 * via the language provider's t(ar, en) helper and the layout follows `dir`.
 */

const SPRINT_SERVICE = 'SME Cyber & AI Readiness Sprint (14-Day)'
const BOOKING_DURATION_MINS = 20
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'] as const

type ChatRole = 'user' | 'assistant'
interface ChatMessage {
  role: ChatRole
  content: string
}

/** Tomorrow (AST) as a yyyy-mm-dd string — the earliest bookable date. */
function minBookingDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export function SdrAssistant() {
  const { t, lang, dir } = useLanguage()
  const isRtl = dir === 'rtl'

  const [isOpen, setIsOpen] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [messages, setMessages] = useState<readonly ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)

  const panelRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const launcherRef = useRef<HTMLButtonElement | null>(null)

  const greeting = t(
    'مرحباً 👋 أنا مساعد الأمن. اسألني عن جاهزيتك الأمنية أو احجز مراجعة مجانية لمدة 20 دقيقة.',
    "Hi 👋 I'm the Security Assistant. Ask me about your security readiness, or book a free 20-minute review.",
  )

  // Seed the greeting the first time the panel opens.
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: greeting }])
    }
    // greeting depends on lang; we only want to seed once on open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Focus management: move focus into the panel on open.
  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
    else launcherRef.current?.focus()
  }, [isOpen])

  // Keep the transcript scrolled to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isSending])

  // Close on Escape while open.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isSending) return

      const nextHistory: ChatMessage[] = [...messages, { role: 'user', content: trimmed }]
      // Strip the seeded greeting (assistant-first) before sending; the API
      // requires a user-led history.
      const apiHistory = nextHistory.filter((m, i) => !(i === 0 && m.role === 'assistant'))

      setMessages(nextHistory)
      setInput('')
      setIsSending(true)

      try {
        const res = await fetch('/api/sdr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiHistory.slice(-20), lang }),
        })
        const data: { ok?: boolean; reply?: string; error?: string } = await res.json()
        if (!res.ok || !data.ok || !data.reply) {
          throw new Error(data.error ?? 'Request failed')
        }
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply! }])
      } catch {
        toast.error(t('تعذّر الوصول إلى المساعد. حاول مرة أخرى.', 'Could not reach the assistant. Please try again.'))
      } finally {
        setIsSending(false)
        inputRef.current?.focus()
      }
    },
    [isSending, messages, lang, t],
  )

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      void sendMessage(input)
    },
    [input, sendMessage],
  )

  const launcherSide = isRtl ? 'left-5' : 'right-5'

  return (
    <>
      {/* Launcher */}
      {!isOpen && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setIsOpen(true)}
          dir={dir}
          aria-label={t('افتح مساعد الأمن', 'Open the Security Assistant')}
          className={cn(
            'fixed bottom-5 z-50 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-[#09090b]/90 px-4 py-3',
            'font-mono text-sm text-emerald-300 shadow-[0_0_25px_-4px_rgba(52,211,153,0.6)] backdrop-blur',
            'transition-all hover:border-emerald-400 hover:text-emerald-200 hover:shadow-[0_0_35px_-2px_rgba(52,211,153,0.75)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]',
            launcherSide,
          )}
        >
          <Terminal className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">{t('مساعد الأمن', 'Security Assistant')}</span>
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          ref={panelRef}
          dir={dir}
          role="dialog"
          aria-modal="false"
          aria-label={t('مساعد الأمن', 'Security Assistant')}
          className={cn(
            'fixed bottom-0 z-50 flex flex-col border border-zinc-800 bg-[#09090b] font-mono text-zinc-200 shadow-2xl',
            'inset-x-0 h-[85vh] rounded-t-xl',
            'sm:inset-x-auto sm:bottom-5 sm:h-[560px] sm:w-[360px] sm:rounded-xl',
            isRtl ? 'sm:left-5' : 'sm:right-5',
          )}
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-950/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden />
              <span className="text-xs uppercase tracking-widest text-emerald-400">
                {t('مساعد الأمن', 'Security Assistant')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowBooking((v) => !v)}
                aria-pressed={showBooking}
                className="flex items-center gap-1.5 rounded-md border border-emerald-500/30 px-2 py-1 text-[11px] text-emerald-300 transition-colors hover:border-emerald-400 hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <CalendarCheck className="h-3.5 w-3.5" aria-hidden />
                {t('مراجعة مجانية', 'Free review')}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={t('إغلاق', 'Close')}
                className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </header>

          {showBooking && <BookingForm onDone={() => setShowBooking(false)} />}

          {/* Transcript */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-relaxed',
                    m.role === 'user'
                      ? 'bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-500/30'
                      : 'bg-zinc-900 text-zinc-200 ring-1 ring-zinc-800',
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm text-zinc-400 ring-1 ring-zinc-800">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  {t('يكتب…', 'Typing…')}
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-zinc-800 px-3 py-3">
            <label htmlFor="sdr-input" className="sr-only">
              {t('اكتب رسالتك', 'Type your message')}
            </label>
            <input
              id="sdr-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
              placeholder={t('اكتب رسالتك…', 'Type your message…')}
              className="min-w-0 flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label={t('إرسال', 'Send')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30 transition-colors hover:bg-emerald-500/25 hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-40"
            >
              <Send className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

// ── Inline booking form ───────────────────────────────────────────────────────

interface BookingFormProps {
  onDone: () => void
}

function BookingForm({ onDone }: BookingFormProps) {
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState<string>(TIME_SLOTS[0])
  const [isBooking, setIsBooking] = useState(false)
  const [meetLink, setMeetLink] = useState<string | null>(null)

  const minDate = minBookingDate()

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (isBooking) return
      if (!name.trim() || !email.trim() || !date) {
        toast.error(t('يرجى تعبئة الاسم والبريد والتاريخ.', 'Please fill in name, email and date.'))
        return
      }

      setIsBooking(true)
      const startISO = `${date}T${time}:00+03:00`
      try {
        const res = await fetch('/api/book-meeting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            company: company.trim(),
            service: SPRINT_SERVICE,
            message: t(
              'حجز عبر مساعد الأمن — مراجعة مجانية 20 دقيقة.',
              'Booked via the Security Assistant — free 20-minute review.',
            ),
            startISO,
            durationMins: BOOKING_DURATION_MINS,
          }),
        })
        const data: { ok?: boolean; meetLink?: string; error?: string } = await res.json()
        if (!res.ok || !data.ok) {
          throw new Error(data.error ?? 'Booking failed')
        }
        setMeetLink(data.meetLink ?? null)
        toast.success(t('تم الحجز بنجاح ✅', 'Booked successfully ✅'))
      } catch (err) {
        toast.error(
          err instanceof Error && err.message
            ? err.message
            : t('فشل الحجز. حاول مرة أخرى.', 'Booking failed. Please try again.'),
        )
      } finally {
        setIsBooking(false)
      }
    },
    [isBooking, name, email, company, date, time, t],
  )

  if (meetLink !== null) {
    return (
      <div className="border-b border-zinc-800 bg-emerald-500/5 px-4 py-4 text-sm">
        <p className="mb-2 font-semibold text-emerald-300">{t('تم تأكيد موعدك', 'Your review is confirmed')}</p>
        <p className="mb-3 text-zinc-400">
          {t('سيصلك تأكيد على بريدك. رابط الاجتماع:', "You'll get a confirmation email. Meeting link:")}
        </p>
        <a
          href={meetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 break-all text-emerald-400 underline-offset-4 hover:underline"
        >
          {meetLink}
          <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        </a>
        <button
          type="button"
          onClick={onDone}
          className="mt-3 block text-xs text-zinc-500 transition-colors hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          {t('رجوع إلى المحادثة', 'Back to chat')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2.5 border-b border-zinc-800 bg-zinc-950/40 px-4 py-4 text-sm">
      <p className="text-xs uppercase tracking-widest text-emerald-400">
        {t('احجز مراجعة مجانية (20 دقيقة)', 'Book a free review (20 min)')}
      </p>

      <FieldInput
        id="sdr-name"
        label={t('الاسم', 'Name')}
        value={name}
        onChange={setName}
        required
        autoComplete="name"
      />
      <FieldInput
        id="sdr-email"
        label={t('البريد الإلكتروني', 'Email')}
        type="email"
        value={email}
        onChange={setEmail}
        required
        autoComplete="email"
      />
      <FieldInput
        id="sdr-company"
        label={t('الشركة (اختياري)', 'Company (optional)')}
        value={company}
        onChange={setCompany}
        autoComplete="organization"
      />

      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="sdr-date" className="mb-1 block text-xs text-zinc-400">
            {t('التاريخ', 'Date')}
          </label>
          <input
            id="sdr-date"
            type="date"
            value={date}
            min={minDate}
            required
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 [color-scheme:dark] focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="sdr-time" className="mb-1 block text-xs text-zinc-400">
            {t('الوقت (بتوقيت السعودية)', 'Time (AST)')}
          </label>
          <select
            id="sdr-time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isBooking}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-200 ring-1 ring-emerald-500/40 transition-colors hover:bg-emerald-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50"
      >
        {isBooking ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <CalendarCheck className="h-4 w-4" aria-hidden />}
        {t('تأكيد الحجز', 'Confirm booking')}
      </button>
    </form>
  )
}

// ── Small labelled text input ────────────────────────────────────────────────

interface FieldInputProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  autoComplete?: string
}

function FieldInput({ id, label, value, onChange, type = 'text', required, autoComplete }: FieldInputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs text-zinc-400">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
      />
    </div>
  )
}
