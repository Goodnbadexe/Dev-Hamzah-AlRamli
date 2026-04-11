import { NextResponse } from 'next/server'

export async function GET() {
  const content = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    'Disallow: /debug',
    'Disallow: /flags',
    'Disallow: /lab',
    'Disallow: /memory',
    'Disallow: /test-ctf',
    'Sitemap: https://www.goodnbad.info/sitemap.xml',
    '',
  ].join('\n')

  return new NextResponse(content, { headers: { 'Content-Type': 'text/plain' } })
}
