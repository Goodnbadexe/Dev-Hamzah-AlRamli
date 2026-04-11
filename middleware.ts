import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes blocked entirely in production. Returns 404 to avoid disclosing their existence.
const PRODUCTION_BLOCKED_PREFIXES = [
  '/admin',
  '/debug',
  '/memory',
  '/flags/alpha',
  '/test-ctf',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (process.env.NODE_ENV === 'production') {
    for (const prefix of PRODUCTION_BLOCKED_PREFIXES) {
      if (pathname === prefix || pathname.startsWith(prefix + '/')) {
        return new NextResponse('Not Found', { status: 404 })
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/debug/:path*',
    '/memory',
    '/flags/alpha/:path*',
    '/test-ctf/:path*',
  ],
}
