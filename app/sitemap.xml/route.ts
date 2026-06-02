import { NextResponse } from 'next/server'
import { deployments } from '@/lib/content/deployments'

type Entry = { path: string; freq: string; priority: string }

export async function GET() {
  const base = 'https://www.goodnbad.info'
  const today = new Date().toISOString().split('T')[0]

  const staticPages: Entry[] = [
    { path: '/',                 freq: 'weekly',  priority: '1.0' },
    { path: '/personnel',        freq: 'monthly', priority: '0.9' },
    { path: '/security',         freq: 'monthly', priority: '0.9' },
    { path: '/services',         freq: 'monthly', priority: '0.9' },
    { path: '/cybersecurity-ai', freq: 'monthly', priority: '0.8' },
    { path: '/deployments',      freq: 'weekly',  priority: '0.8' },
    { path: '/news',             freq: 'daily',   priority: '0.8' },
    { path: '/about',            freq: 'monthly', priority: '0.7' },
    { path: '/signal',           freq: 'daily',   priority: '0.7' },
    { path: '/horus',            freq: 'monthly', priority: '0.7' },
    { path: '/contact',          freq: 'monthly', priority: '0.6' },
    { path: '/subscribe',        freq: 'monthly', priority: '0.5' },
    { path: '/terminal',         freq: 'monthly', priority: '0.5' },
  ]

  const all: Entry[] = [
    ...staticPages,
    ...deployments.map((d) => ({ path: `/deployments/${d.slug}`, freq: 'monthly', priority: '0.6' })),
  ]

  const urls = all
    .map(({ path, freq, priority }) =>
      `<url><loc>${base}${path}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
