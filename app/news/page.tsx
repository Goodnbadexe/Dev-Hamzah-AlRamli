import { redirect } from 'next/navigation'

/**
 * /news is retired — it duplicated /signal (the canonical threat-intel feed).
 * Kept as a permanent redirect so any existing inbound links resolve to /signal.
 */
export default function NewsPage() {
  redirect('/signal')
}
