import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service — Goodnbad Auto-Poster",
  description:
    "Terms of Service for the Goodnbad personal content-automation tool that posts to its own TikTok account via the TikTok Content Posting API.",
  alternates: {
    canonical: "https://www.goodnbad.info/terms",
  },
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 text-zinc-200">
      <h1 className="mb-2 text-3xl font-bold text-white">Terms of Service</h1>
      <p className="mb-8 text-sm text-zinc-500">Last updated: 16 June 2026</p>

      <div className="space-y-6 leading-relaxed">
        <p>
          This application (the &quot;App&quot;) is a personal content-automation tool operated
          by Goodnbad (the &quot;Operator&quot;) that reformats videos the Operator owns or is
          licensed to use and posts them to the Operator&apos;s own TikTok account via
          TikTok&apos;s official Content Posting API. By using the App you agree to these terms.
        </p>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">1. Permitted use</h2>
          <p>
            The App is intended solely for posting content the Operator owns or holds the
            necessary rights and licenses to distribute. It must not be used to post content
            that infringes the intellectual-property rights of any third party.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">2. Compliance with TikTok</h2>
          <p>
            Use of the App is subject to TikTok&apos;s Terms of Service, Developer Terms, and
            Community Guidelines. The App uses TikTok&apos;s Content Posting API and acts only on
            behalf of the authenticated account owner.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">3. No warranty</h2>
          <p>
            The App is provided &quot;as is&quot;, without warranty of any kind. The Operator is
            not liable for any loss arising from its use, including failed uploads, account
            actions taken by TikTok, or service interruptions.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">4. Account responsibility</h2>
          <p>
            The Operator is responsible for all content posted through the App and for keeping
            API credentials secure.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">5. Changes</h2>
          <p>
            These terms may be updated from time to time. Continued use after changes
            constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">6. Contact</h2>
          <p>
            Questions:{" "}
            <a className="text-sky-400 underline" href="mailto:alramli.hamzah@gmail.com">
              alramli.hamzah@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
