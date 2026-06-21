import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = pathToFileURL(join(__dirname, 'toolkit-week-01.html')).href;

const browser = await chromium.launch();

// ---- FULL PDF (payers): no teaser class, nothing blurred ----
{
  const page = await browser.newPage();
  await page.goto(src, { waitUntil: 'networkidle' });
  await page.pdf({
    path: join(__dirname, 'toolkit-vault-week-01.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  await page.close();
  console.log('full pdf done -> toolkit-vault-week-01.pdf');
}

// ---- TEASER PDF (non-payers): add body.teaser so paywall-hidden blurs ----
{
  const page = await browser.newPage();
  await page.goto(src, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.body.classList.add('teaser'));
  await page.pdf({
    path: join(__dirname, 'toolkit-vault-week-01-teaser.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  // Screenshot a tool page (BitNet) to confirm the blur visually.
  await page.setViewportSize({ width: 794, height: 1123 });
  const bitnet = page.locator('section.page').nth(2);
  await bitnet.screenshot({ path: join(__dirname, 'teaser-bitnet.png') });
  await page.close();
  console.log('teaser pdf done -> toolkit-vault-week-01-teaser.pdf (+ teaser-bitnet.png)');
}

await browser.close();
console.log('all done');
