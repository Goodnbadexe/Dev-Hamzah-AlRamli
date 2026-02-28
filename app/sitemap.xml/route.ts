import { NextResponse } from 'next/server'

export async function GET() {
  const pages = ['/', '/about', '/security', '/memory', '/cybersecurity-ai']
  const base = 'https://www.goodnbad.info'
  const urls = pages.map(p => `<url><loc>${base}${p}</loc><changefreq>weekly</changefreq></url>`).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}