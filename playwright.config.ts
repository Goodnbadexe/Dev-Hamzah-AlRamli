import { defineConfig, devices } from '@playwright/test'

// ─── Target selection ─────────────────────────────────────────────────────────
// DEFAULT: a local production build (deterministic, fast, and crucially NOT behind
// Vercel Attack-Challenge Mode). The previous default — live prod — served the
// "Vercel Security Checkpoint" 429 interstitial to automated WebKit, which made
// 14/25 mobile-safari tests flake on missing meta tags / inflated TTFB. That was
// the bot wall, not a Safari bug.
//
// Override E2E_BASE to smoke-test a real deployment (preview/prod). When doing so,
// set VERCEL_AUTOMATION_BYPASS_SECRET (Vercel → Project → Deployment Protection →
// Protection Bypass for Automation) so the challenge is skipped for the test client.
const BASE = process.env.E2E_BASE ?? 'http://localhost:3000'
const isLocal = /(localhost|127\.0\.0\.1)/.test(BASE)
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Retries absorb the occasional transient (rate-limit 429, cold start) on remote
  // targets without masking real failures.
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Vercel-sanctioned way to let automation past the bot challenge on a
    // protected deployment. No-op when the secret isn't set (i.e. local build).
    ...(bypassSecret
      ? {
          extraHTTPHeaders: {
            'x-vercel-protection-bypass': bypassSecret,
            'x-vercel-set-bypass-cookie': 'true',
          },
        }
      : {}),
  },

  // Build + serve the app locally unless we're pointed at a remote URL.
  ...(isLocal
    ? {
        webServer: {
          command: 'npm run build && npm run start',
          url: 'http://localhost:3000',
          timeout: 180_000,
          reuseExistingServer: !process.env.CI,
        },
      }
    : {}),

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
  ],
})
