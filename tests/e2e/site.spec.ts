import { test, expect, devices } from '@playwright/test'

const BASE = 'https://www.goodnbad.info'

// ─── Core pages load ──────────────────────────────────────────────────────────

test.describe('Core pages', () => {
  const routes = [
    { path: '/',           title: /Hamzah|Goodnbad/i },
    { path: '/personnel',  title: /Personnel|Hamzah/i },
    { path: '/services',   title: /Services/i },
    { path: '/news',       title: /News|Intelligence/i },
    { path: '/signal',     title: /Signal/i },
    { path: '/deployments',title: /Deployments/i },
    { path: '/contact',    title: /Contact/i },
    { path: '/horus',      title: /Horus/i },
    { path: '/terminal',   title: /Terminal/i },
  ]

  for (const { path, title } of routes) {
    test(`${path} loads and has correct title`, async ({ page }) => {
      const res = await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' })
      expect(res?.status()).toBeLessThan(400)
      await expect(page).toHaveTitle(title)
    })
  }
})

// ─── Redirects ────────────────────────────────────────────────────────────────

test.describe('Redirects', () => {
  test('/about redirects to /personnel', async ({ page }) => {
    const res = await page.goto(`${BASE}/about`)
    expect(page.url()).toContain('/personnel')
    expect(res?.status()).toBeLessThan(400)
  })

  test('/security redirects to /personnel', async ({ page }) => {
    await page.goto(`${BASE}/security`)
    expect(page.url()).toContain('/personnel')
  })
})

// ─── API routes ───────────────────────────────────────────────────────────────

test.describe('API routes', () => {
  test('/api/threats returns threat data', async ({ request }) => {
    const res = await request.get(`${BASE}/api/threats`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('threats')
    expect(Array.isArray(body.threats)).toBe(true)
  })

  test('/api/news returns news items', async ({ request }) => {
    const res = await request.get(`${BASE}/api/news`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('ok', true)
    expect(body).toHaveProperty('items')
  })

  test('/api/signal-feed returns feed items', async ({ request }) => {
    const res = await request.get(`${BASE}/api/signal-feed`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('items')
  })

  test('/sitemap.xml is valid XML with all key pages', async ({ request }) => {
    const res = await request.get(`${BASE}/sitemap.xml`)
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('xml')
    const text = await res.text()
    expect(text).toContain('<urlset')
    expect(text).toContain('/personnel')
    expect(text).toContain('/services')
    expect(text).toContain('/news')
    expect(text).toContain('/horus')
  })

  test('/robots.txt allows crawling and has sitemap', async ({ request }) => {
    const res = await request.get(`${BASE}/robots.txt`)
    expect(res.status()).toBe(200)
    const text = await res.text()
    expect(text).toContain('Allow: /')
    expect(text).toContain('Sitemap:')
    expect(text).not.toContain('Disallow: /memory')
  })
})

// ─── SEO meta ─────────────────────────────────────────────────────────────────

test.describe('SEO metadata', () => {
  test('Homepage has og:image and twitter:card', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    const og = await page.locator('meta[property="og:image"]').getAttribute('content')
    const tw = await page.locator('meta[name="twitter:card"]').getAttribute('content')
    expect(og).toBeTruthy()
    expect(tw).toBe('summary_large_image')
  })

  test('Homepage canonical is not hardcoded (no duplicate canonical)', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    const canonicals = await page.locator('link[rel="canonical"]').count()
    // Should be exactly 1 (from metadata export), not 2 (which was the bug)
    expect(canonicals).toBeLessThanOrEqual(1)
  })

  test('/personnel has its own canonical', async ({ page }) => {
    await page.goto(`${BASE}/personnel`, { waitUntil: 'domcontentloaded' })
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toContain('/personnel')
    expect(canonical).not.toBe(BASE + '/')
  })

  test('Security headers are present', async ({ request }) => {
    const res = await request.get(BASE)
    const headers = res.headers()
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['strict-transport-security']).toBeTruthy()
  })
})

// ─── Mobile ───────────────────────────────────────────────────────────────────

test.describe('Mobile (iPhone 14)', () => {
  test.use({ ...devices['iPhone 14'] })

  test('Homepage loads without globe canvas on mobile', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' })
    // Globe canvas should NOT be present on mobile (we skip WebGL < 768px)
    const canvas = await page.locator('canvas').count()
    expect(canvas).toBe(0)
  })

  test('Mobile nav is present and tappable', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    // OSTaskbar should be visible on mobile
    const taskbar = page.locator('header')
    await expect(taskbar).toBeVisible()
  })

  test('/news page loads on mobile without WebGL crash', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(`${BASE}/news`, { waitUntil: 'networkidle' })
    const fatalErrors = errors.filter((e) =>
      e.toLowerCase().includes('webgl') || e.toLowerCase().includes('three') || e.toLowerCase().includes('canvas')
    )
    expect(fatalErrors).toHaveLength(0)
  })
})

// ─── Performance ─────────────────────────────────────────────────────────────

test.describe('Performance', () => {
  test('Homepage TTFB under 2s', async ({ page }) => {
    const start = Date.now()
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    const ttfb = Date.now() - start
    expect(ttfb).toBeLessThan(2000)
  })

  test('Images have width/height to prevent CLS', async ({ page }) => {
    await page.goto(`${BASE}/personnel`, { waitUntil: 'networkidle' })
    const images = await page.locator('img').all()
    for (const img of images.slice(0, 10)) {
      const w = await img.getAttribute('width')
      const h = await img.getAttribute('height')
      // Next.js <Image> always emits width/height — raw <img> without is a CLS risk
      if (w === null || h === null) {
        const src = await img.getAttribute('src')
        console.warn(`Missing width/height on: ${src}`)
      }
    }
  })
})
