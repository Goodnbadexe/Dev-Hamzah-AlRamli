import { NextResponse } from 'next/server'
import { deployments } from '@/lib/content/deployments'

export async function GET() {
  const base = 'https://www.goodnbad.info'
  const publicPages = [
    '/',
    '/personnel',
    '/deployments',
    ...deployments.map((deployment) => `/deployments/${deployment.slug}`),
    '/signal',
    '/contact',
  ]

  const urls = publicPages
    .map((path) => `<url><loc>${base}${path}</loc><changefreq>weekly</changefreq></url>`)
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}
