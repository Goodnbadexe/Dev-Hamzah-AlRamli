/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ship the gated vault PDFs with the serverless function that reads them — the
  // file-tracer can't see fs.readFile paths built at runtime, so include them here.
  outputFileTracingIncludes: {
    '/api/vault/[file]': ['./content/vault/**/*.pdf'],
    // The funnel welcome email links /teasers/<track>, served by a route that
    // fs.readFile's the committed teaser PDFs — force-include them or it 404s in prod.
    '/teasers/[track]': ['./content/vault/**/*-teaser.pdf'],
  },
  images: {
    // NOTE: unoptimized was previously true, disabling all image compression and
    // resizing. Re-enabled Next.js image optimization. If any remote image hosts
    // are added later, list them under `remotePatterns` here.
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ]
  },
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      // Legacy routes → GOODNBAD OS architecture
      {
        source: '/about',
        destination: '/personnel',
        permanent: true,
      },
      {
        source: '/cybersecurity-ai',
        destination: '/deployments',
        permanent: true,
      },
      // NOTE: /signal is the canonical threat-intel page (app/signal/page.tsx).
      // /news is retired and redirects to /signal (see app/news/page.tsx). Do NOT
      // add a /signal -> /news redirect here: it pairs with that one to form an
      // infinite redirect loop (ERR_TOO_MANY_REDIRECTS) that takes BOTH routes down.
    ]
  },
}

export default nextConfig
