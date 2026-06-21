// === METADATA ===
// Purpose: Post-purchase landing page. Set this as the Gumroad product
//          "Redirect after purchase" URL (https://www.goodnbad.info/welcome) so
//          buyers come back to the site instead of staying on Gumroad.
// Note:    static + safe to share; no secrets, no purchase data required. If a
//          ?to=subscribe param is present we deep-link the "next drop" CTA.
// === END METADATA ===
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "You're in · The Toolkit Vault",
  description: "Welcome to the Toolkit Vault — your issue is on its way.",
  robots: { index: false, follow: false },
}

export default function WelcomePage() {
  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(16,185,129,0.10) 0%, transparent 60%)" }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-16">
        <div className="text-center">
          <span className="mb-4 inline-block rounded border border-emerald-900 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald-700">
            goodnbad · the toolkit vault
          </span>
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-emerald-700/60 bg-emerald-950/30 text-2xl text-emerald-400">
            ▣
          </div>
          <h1 className="text-3xl font-bold leading-tight text-zinc-100 sm:text-4xl" dir="rtl">
            تم! أنت داخل الخزينة
          </h1>
          <p className="mt-2 font-mono text-sm text-emerald-400">You&apos;re in. Welcome to the Vault.</p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Your issue download is on the Gumroad receipt and in your email. Open it, pick one tool, and
            paste its prompt into your AI today — that&apos;s the whole point.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500" dir="rtl">
            رابط التحميل في إيصال Gumroad وفي بريدك. افتح الملف، اختر أداة وحدة، والصق برومبتها في الـ AI اليوم.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/40 p-4">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-600">what&apos;s next</p>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex items-start gap-2"><span className="text-emerald-500">→</span> Check your email / Gumroad receipt for the PDF.</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500">→</span> Run one prompt this week. Reply to the email if you get stuck.</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500">→</span> A new issue drops every week — same vault, fresh picks.</li>
            </ul>
          </div>

          <Link
            href="/subscribe"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-3.5 font-mono text-sm font-bold uppercase tracking-wide text-emerald-950 transition-all hover:-translate-y-px hover:bg-emerald-400"
          >
            See the other vaults →
          </Link>
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-md border border-zinc-700 px-4 py-3 font-mono text-xs uppercase tracking-wide text-zinc-300 transition-colors hover:border-zinc-500"
          >
            Explore goodnbad.info
          </Link>
        </div>

        <p className="mt-8 text-center font-mono text-[10px] text-zinc-700">
          curated by Hamzah Al-Ramli · goodnbad.info
        </p>
      </div>
    </main>
  )
}
