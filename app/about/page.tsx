import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Hamzah Al-Ramli (Goodnbad)",
  description:
    "Hamzah Al-Ramli (Goodnbad) is a cybersecurity and automation-focused systems architect based in Saudi Arabia.",
  alternates: {
    canonical: "https://www.goodnbad.info/about",
  },
}

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://www.goodnbad.info/about#aboutpage",
    "url": "https://www.goodnbad.info/about",
    "name": "About Hamzah Al-Ramli (Goodnbad)",
    "mainEntity": {
      "@id": "https://www.goodnbad.info/#person",
    },
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-emerald-400 text-sm uppercase tracking-wider mb-4">About</p>
        <h1 className="text-4xl font-bold mb-6">Hamzah Al-Ramli (Goodnbad)</h1>
        <p className="text-zinc-300 leading-8 mb-6">
          Hamzah Al-Ramli, known digitally as Goodnbad, is a cybersecurity-driven systems thinker focused on building scalable digital architectures. His work centers around automation, AI integration, workflow orchestration, and secure infrastructure design.
        </p>
        <p className="text-zinc-300 leading-8 mb-6">
          He prioritizes execution over theory, scalability over temporary fixes, and clarity over complexity. His approach combines cybersecurity principles with automation engineering to create systems that are efficient, controlled, and future-ready.
        </p>

        <div className="mt-10 rounded-lg border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-xl font-semibold mb-4">Core Focus Areas</h2>
          <ul className="list-disc list-inside text-zinc-300 space-y-2">
            <li>Cybersecurity</li>
            <li>Workflow Automation</li>
            <li>AI Agents</li>
            <li>Systems Architecture</li>
            <li>Digital Infrastructure</li>
          </ul>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
    </main>
  )
}
