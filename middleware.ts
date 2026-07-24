import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── Routes blocked in production ────────────────────────────────────────────
// Returns 404 to avoid disclosing internal tooling to scanners or crawlers.
// Uses prefix matching so /admin/anything and /flags/anything are both blocked.
const PRODUCTION_BLOCKED_PREFIXES: string[] = [
  '/admin',
  '/debug',
  '/memory',
  '/flags',
  '/lab',
]

// ─── Routes blocked in ALL environments ──────────────────────────────────────
// Test harnesses that should never be routable, even in staging/preview.
const ALWAYS_BLOCKED_PREFIXES: string[] = [
  '/test-ctf',
]

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  )
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Block in all environments
  if (matchesPrefix(pathname, ALWAYS_BLOCKED_PREFIXES)) {
    return new NextResponse(null, { status: 404 })
  }

  // Block in production only (or when DISABLE_DEV_ROUTES is set)
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.DISABLE_DEV_ROUTES === 'true'

  if (isProduction && matchesPrefix(pathname, PRODUCTION_BLOCKED_PREFIXES)) {
    return new NextResponse(null, { status: 404 })
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
    '/lab/:path*',
  ],
}
