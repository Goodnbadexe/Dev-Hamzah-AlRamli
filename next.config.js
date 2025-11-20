/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['calma.sa', 'cdn.jsdelivr.net', 'raw.githubusercontent.com', 'images.unsplash.com'],
    remotePatterns: [
      { protocol: 'https', hostname: 'calma.sa' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}

module.exports = nextConfig