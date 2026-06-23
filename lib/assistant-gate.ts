/**
 * Assistant logic gate — fast, pre-built responses for the most common
 * identity / "who is this" questions.
 *
 * Why this exists: the Portfolio Assistant runs a deterministic local matcher
 * (lib/assistant/faq.ts) behind a deliberate, length-aware "thinking" delay so
 * replies feel considered. For the handful of identity questions that get asked
 * over and over, that delay is pure friction. This gate short-circuits them:
 * a single regex pass returns a canned answer instantly — no matcher scan, no
 * typing delay, and (for any future networked path) no API round-trip / tokens.
 *
 * It is intentionally tiny and dependency-free. It is checked FIRST; on no
 * match it returns null and the caller proceeds with normal handling.
 *
 * Facts below mirror lib/assistant/faq.ts (single source of truth — Riyadh,
 * Saudi Arabia; no invented claims).
 */

const IDENTITY_PATTERNS: readonly RegExp[] = [
  /who is hamzah/i,
  /who are you/i,
  /tell me about hamzah/i,
  /who is goodnbad/i,
  /about hamzah/i,
  /hamzah al.?ramli/i,
  /who made this/i,
  /who built this/i,
  /who created this/i,
  /introduce yourself/i,
  /your background/i,
]

const IDENTITY_RESPONSE = `Hamzah Al-Ramli (@Goodnbad.exe) — Cybersecurity & Automation Architect based in Riyadh, Saudi Arabia. He's also a multimedia designer and full-stack developer.

Focus areas: malware analysis & threat intelligence, OSINT, network security (CCNA), vulnerability management, and incident response — plus the automation and web platforms that run alongside them.

Credentials include Google Cybersecurity, IBM Cybersecurity Assessment (Security+ & CySA+), CCNA 200-301, and hands-on LetsDefend badges; CEH and Security+ are in progress.

This site is goodnbad.exe — his portfolio built as a small operating system. Explore the modules from the launcher, or ask me anything about his work.`

/**
 * Fast pre-built answer for common identity questions.
 *
 * @param input Raw user message.
 * @returns The canned response if an identity pattern matches, otherwise null
 *          (caller should fall through to normal handling).
 */
export function checkAssistantGate(input: string): string | null {
  if (!input) return null
  const trimmed = input.trim()
  if (!trimmed) return null

  for (const pattern of IDENTITY_PATTERNS) {
    if (pattern.test(trimmed)) {
      return IDENTITY_RESPONSE
    }
  }

  return null // no gate match — proceed to normal handling
}
