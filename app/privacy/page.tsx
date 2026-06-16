import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — Goodnbad Auto-Poster",
  description:
    "Privacy Policy for the Goodnbad personal content-automation tool that posts to its own TikTok account via the TikTok Content Posting API.",
  alternates: {
    canonical: "https://www.goodnbad.info/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 text-zinc-200">
      <h1 className="mb-2 text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mb-8 text-sm text-zinc-500">Last updated: 16 June 2026</p>

      <div className="space-y-6 leading-relaxed">
        <p>
          This application (the &quot;App&quot;), operated by Goodnbad (the &quot;Operator&quot;),
          is a personal automation tool that posts the Operator&apos;s own video content to the
          Operator&apos;s own TikTok account using TikTok&apos;s official Content Posting API.
          This policy explains what data the App handles.
        </p>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">1. Data we use</h2>
          <p>
            The App uses TikTok OAuth credentials (client key, client secret, access token,
            refresh token, and the account&apos;s open ID) solely to authenticate with TikTok and
            publish videos to the authenticated account. These credentials are stored as
            encrypted secrets in the Operator&apos;s own environment and are never shared with
            third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">2. Data we do NOT collect</h2>
          <p>
            The App has no end users other than the Operator. It does not collect, store, sell,
            or share any personal data belonging to TikTok users, viewers, or any third party. It
            uses no analytics, tracking, or advertising.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">3. Content</h2>
          <p>
            Video files processed by the App are downloaded, reformatted, uploaded to TikTok, and
            then exist only transiently in the Operator&apos;s automation environment. A record of
            which source videos have been posted is kept to prevent duplicate posting.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">4. Third-party services</h2>
          <p>
            The App interacts with TikTok (for posting) and YouTube (for retrieving the
            Operator&apos;s own source videos). Their data handling is governed by their
            respective privacy policies.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">5. Data retention &amp; deletion</h2>
          <p>
            OAuth tokens are retained only while the App is in use and can be revoked at any time
            from the TikTok account&apos;s connected-apps settings. Revoking access immediately
            stops all data processing.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-white">6. Contact</h2>
          <p>
            Questions or data requests:{" "}
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
