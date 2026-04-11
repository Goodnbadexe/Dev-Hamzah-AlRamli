/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
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
