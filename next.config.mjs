/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // NOTE: unoptimized was previously true, disabling all image compression and
    // resizing. Re-enabled Next.js image optimization. If any remote image hosts
    // are added later, list them under `remotePatterns` here.
  },
  async redirects() {
    return [
      // Legacy routes → GOODNBAD OS architecture
      {
        source: '/about',
        destination: '/personnel',
        permanent: true,
      },
      {
        source: '/security',
        destination: '/personnel',
        permanent: true,
      },
      {
        source: '/cybersecurity-ai',
        destination: '/deployments',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
