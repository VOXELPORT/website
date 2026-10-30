// Local visual and interaction checks. Uses an existing Playwright installation.
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5175';
await fs.mkdir('.qa', { recursive: true });
try {
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: '.qa/home-desktop.png', fullPage: true });
  await page.getByRole('tab', { name: /Send the invite/ }).click();
  await page.getByRole('tabpanel').getByText('play.voxelport.in:26137', { exact: true }).waitFor();
  await page.getByRole('tab', { name: /Send the invite/ }).press('Home');
  assert.equal(await page.getByRole('tab', { name: /Make yourself at home/ }).getAttribute('aria-selected'), 'true');
  await page.locator('.v3-faq summary').first().click();
  assert.equal(await page.locator('.v3-faq details').first().getAttribute('open'), '');
  const reports = [];
  for (const width of [1440, 1024, 768, 580, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const sizes = await page.evaluate(() => ({ viewport: innerWidth, body: document.documentElement.scrollWidth }));
    assert.ok(sizes.body <= sizes.viewport, `Horizontal overflow at ${width}px: ${JSON.stringify(sizes)}`);
    reports.push({ width, ...sizes });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(250);
  await page.screenshot({ path: '.qa/home-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('button', { name: 'Close', exact: true }).press('Escape');
  assert.equal(await page.getByRole('button', { name: 'Menu', exact: true }).getAttribute('aria-expanded'), 'false');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Guides', exact: true }).click();
  await page.waitForURL('**/guides');
  await page.locator('main h1').waitFor();
  assert.equal(await page.getByRole('button', { name: 'Menu', exact: true }).getAttribute('aria-expanded'), 'false');
  for (const route of ['/features', '/download', '/motd', '/faq', '/compare', '/about', '/support', '/community', '/team', '/legal', '/status', '/servers']) {
    await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    await page.locator('main').waitFor();
    await page.waitForTimeout(150);
    const heading = await page.locator('h1').first().textContent();
    assert.ok(heading?.trim(), `Missing heading: ${route}`);
    reports.push({ route, heading: heading.trim().slice(0, 65) });
    if (route === '/download') await page.screenshot({ path: '.qa/download-mobile.png', fullPage: true });
  }
  assert.deepEqual(errors, [], 'Browser runtime errors');
  await fs.writeFile('.qa/browser-results.json', JSON.stringify({ passed: true, reports, errors }, null, 2));
  console.log(JSON.stringify({ passed: true, reports, errors }, null, 2));
} finally { await browser.close(); }
