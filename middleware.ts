import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── Routes blocked in production ────────────────────────────────────────────
// Returns 404 to avoid disclosing internal tooling to scanners or crawlers.
const PRODUCTION_BLOCKED: string[] = [
  '/admin',
  '/debug',
  '/memory',
  '/flags/alpha',
]

// ─── Routes blocked in ALL environments ──────────────────────────────────────
// Test harnesses that should never be routable, even in staging/preview.
const ALWAYS_BLOCKED: string[] = [
  '/test-ctf',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Block in all environments
  for (const prefix of ALWAYS_BLOCKED) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return new NextResponse(null, { status: 404 })
    }
  }

  // Block in production only
  if (process.env.NODE_ENV === 'production') {
    for (const prefix of PRODUCTION_BLOCKED) {
      if (pathname === prefix || pathname.startsWith(prefix + '/')) {
        return new NextResponse(null, { status: 404 })
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/test-ctf/:path*',
    '/admin/:path*',
    '/debug/:path*',
    '/memory/:path*',
    '/flags/:path*',
  ],
}
