import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { startHttp } from '../server/http.mjs';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { root } from '../scripts/build.mjs';
import { PROBE_QUESTION } from '../shared/context.mjs';
const server = await startHttp({ port: 0 });
let browser;
const base = `http://127.0.0.1:${server.address().port}`;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage(); const errors = [];
  page.setDefaultTimeout(30000);
  page.setDefaultNavigationTimeout(30000);
  page.on('pageerror', error => errors.push(error.message));
  await mkdir(resolve(root, 'artifacts/screenshots'), { recursive: true });
  for (const type of ['probe', 'kg', 'assessment', 'collection']) {
    await page.goto(`${base}/preview?type=${type}`);
    const frame = page.frameLocator('#widget');
    await frame.locator('#ask').waitFor();
    await frame.locator('#ask:not([disabled])').waitFor({ timeout: 30000 });
    if (type !== 'probe') await frame.locator('.atar-status[data-state="ready"]').waitFor({ timeout: 30000 });
    if (type !== 'probe') await frame.locator('#question').fill(`Test ${type} question`);
    if (type === 'kg') await frame.locator('#selection').selectOption('value');
    await frame.locator('#ask').click();
    await frame.locator('#delivery').filter({ hasText: 'Host accepted' }).waitFor();
    const received = await page.evaluate(() => window.received);
    assert.equal(received.length, 1); assert.equal(received[0].role, 'user');
    assert.equal(received[0].content[0].text, type === 'probe' ? PROBE_QUESTION : `Test ${type} question`);
    const contexts = await page.evaluate(() => window.contexts);
    assert.equal(contexts.length, 1);
    assert.match(contexts[0].content[0].text, /Preserve the current stage/);
    assert.deepEqual(await page.evaluate(() => window.deliveryEvents), ['context', 'message']);
    if (type === 'kg') assert.match(contexts[0].content[0].text, /"selectedId":"value"/);
    if (type !== 'probe') {
      const tab = type === 'kg' ? 'ai' : 'aiquery';
      await frame.locator(`[data-tab="${tab}"]`).click();
      await frame.locator('.atar-ai-input').fill(`Native ${type} panel question`);
      await frame.locator('.atar-ai-ask').click();
      await page.waitForFunction(() => window.received.length === 2);
      const native = await page.evaluate(() => window.received[1]);
      assert.equal(native.content[0].text, `Native ${type} panel question`);
      assert.equal((await page.evaluate(() => window.contexts)).length, 2);
      assert.equal(await frame.locator('.atar-ai-copybtn').count(), 0);
    }
    await page.locator('#widget').screenshot({ path: resolve(root, `artifacts/screenshots/${type}.png`) });
    console.log(`Simulated host: ${type} question accepted.`);
  }
  await page.goto(`${base}/preview?type=assessment&he=1`);
  const frame = page.frameLocator('#widget');
  await frame.locator('#ask:not([disabled])').waitFor();
  assert.equal(await frame.locator('html').getAttribute('dir'), 'rtl');
  assert.equal(await frame.locator('html').getAttribute('lang'), 'he');
  await frame.locator('#question').fill(''); await frame.locator('#copy').click();
  await frame.locator('#delivery').filter({ hasText: 'כתוב שאלה' }).waitFor();
  assert.equal((await page.evaluate(() => window.received)).length, 0);
  await frame.locator('#question').fill('מה חסר במידע?'); await frame.locator('#ask').click();
  await frame.locator('#delivery').filter({ hasText: 'המארח קיבל' }).waitFor();
  for (const mode of ['reject', 'timeout']) {
    await page.goto(`${base}/preview?type=probe&mode=${mode}`);
    await frame.locator('#ask:not([disabled])').waitFor(); await frame.locator('#ask').click();
    await frame.locator('#delivery').filter({ hasText: mode === 'reject' ? 'host rejected' : 'could not be confirmed' }).waitFor({ timeout: 15000 });
    assert.equal((await page.evaluate(() => window.received)).length, 1);
  }
  for (const context of ['unsupported', 'reject', 'timeout']) {
    await page.goto(`${base}/preview?type=probe&context=${context}`);
    await frame.locator('#ask:not([disabled])').waitFor(); await frame.locator('#ask').click();
    await frame.locator('#delivery').filter({ hasText: 'The question was not sent' }).waitFor({ timeout: 15000 });
    assert.equal((await page.evaluate(() => window.received)).length, 0);
  }
  assert.deepEqual(errors, []);
  console.log('Browser protocol checks passed. Actual ChatGPT/Claude conversation acceptance is not tested by this harness.');
} finally { await browser?.close(); await new Promise(r => server.close(r)); }
