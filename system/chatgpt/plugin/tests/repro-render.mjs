// Reproduce the reported synthetic graph through the actual MCP endpoint.
// The browser is a protocol harness, not a ChatGPT host acceptance test.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { startHttp } from '../server/http.mjs';
import { root } from '../scripts/build.mjs';

const data = {
  type: 'kg', title: '\u05d1\u05d3\u05d9\u05e7\u05ea \u05ea\u05e6\u05d5\u05d2\u05d4 \u05d1\u05dc\u05d1\u05d3: \u05e9\u05dc\u05d5\u05e9 \u05d9\u05e9\u05d5\u05d9\u05d5\u05ea \u05d1\u05d3\u05d5\u05d9\u05d5\u05ea',
  nodes: [
    { id: 'a', name: '\u05de\u05d1\u05e0\u05d4 \u05dc\u05d3\u05d5\u05d2\u05de\u05d4', type: 'Asset', epistemic: 'unlabeled' },
    { id: 'b', name: '\u05d9\u05d9\u05e9\u05d5\u05d1 \u05dc\u05d3\u05d5\u05d2\u05de\u05d4', type: 'Place', epistemic: 'unlabeled' },
    { id: 'c', name: '\u05e7\u05d4\u05d9\u05dc\u05d4 \u05dc\u05d3\u05d5\u05d2\u05de\u05d4', type: 'Social Group', epistemic: 'unlabeled' }
  ],
  edges: [
    { source: 'a', target: 'b', label: '\u05e0\u05de\u05e6\u05d0 \u05d1' },
    { source: 'c', target: 'a', label: '\u05de\u05e9\u05ea\u05de\u05e9\u05ea \u05d1' },
    { source: 'c', target: 'b', label: '\u05de\u05ea\u05d2\u05d5\u05e8\u05e8\u05ea \u05d1' }
  ]
};
const directory = resolve(root, 'artifacts/render-reproduction');
await mkdir(directory, { recursive: true });
const { endpoint } = JSON.parse(await readFile(resolve(root, 'artifacts/connection.json'), 'utf8'));
const client = new Client({ name: 'insites-render-reproduction', version: '1.0.0' });
let browser, http;
try {
  await client.connect(new StreamableHTTPClientTransport(new URL(endpoint), { requestInit: { headers: { 'ngrok-skip-browser-warning': 'insites-pilot' } } }));
  const tools = await client.listTools();
  const descriptor = tools.tools.find(tool => tool.name === 'render_insites');
  const uri = descriptor._meta.ui.resourceUri;
  const result = await client.callTool({ name: 'render_insites', arguments: { approved: true, data } });
  assert.deepEqual(result._meta.insitesData, data);
  assert.equal(result._meta.ui.resourceUri, uri);
  const resource = await client.readResource({ uri });
  const content = resource.contents[0];
  assert.equal(content.mimeType, 'text/html;profile=mcp-app');
  await writeFile(resolve(directory, 'descriptor.json'), JSON.stringify(descriptor, null, 2));
  await writeFile(resolve(directory, 'tool-result.json'), JSON.stringify(result, null, 2));
  await writeFile(resolve(directory, 'resource-metadata.json'), JSON.stringify({ uri, mimeType: content.mimeType, _meta: content._meta }, null, 2));
  await writeFile(resolve(directory, 'viewer.html'), content.text);
  http = await startHttp({ port: 0 });
  const base = `http://127.0.0.1:${http.address().port}`;
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const errors = [], failures = [], events = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('requestfailed', r => failures.push({ url: r.url(), error: r.failure()?.errorText }));
  await page.exposeFunction('recordProtocol', method => events.push(method));
  await page.addInitScript(() => window.addEventListener('message', e => { if (e.data?.method) window.recordProtocol(e.data.method); }));
  const domains = content._meta.ui.csp.resourceDomains.join(' ');
  const csp = `default-src 'none'; script-src 'self' 'unsafe-inline' ${domains}; style-src 'self' 'unsafe-inline' ${domains}; img-src 'self' data: ${domains}; connect-src 'none'; font-src 'self' data: ${domains}`;
  await page.route(`${base}/preview/viewer`, route => route.fulfill({ contentType: 'text/html', body: content.text, headers: { 'Content-Security-Policy': csp } }));
  await page.route(`${base}/preview/fixture?*`, route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(result._meta.insitesData) }));
  const harness = await readFile(resolve(root, 'web/harness.html'), 'utf8');
  const payload = JSON.stringify(result).replaceAll('<', '\\u003c');
  const actualResultHarness = harness.replace("params:{content:[{type:'text',text:'Synthetic fixture'}],_meta:{insitesData:data}}", `params:${payload}`);
  assert.notEqual(actualResultHarness, harness);
  await page.route(`${base}/preview?type=kg`, route => route.fulfill({ contentType: 'text/html', body: actualResultHarness }));
  await page.goto(`${base}/preview?type=kg`);
  const frame = page.frameLocator('#widget');
  await frame.locator('.atar-status[data-state="ready"]').waitFor({ timeout: 30000 });
  assert.equal(await frame.locator('.kg-node').count(), 3);
  await page.locator('#widget').screenshot({ path: resolve(directory, 'first-render.png') });
  await frame.locator('#question').fill('Which entities are linked in this synthetic graph?');
  await frame.locator('#ask').click();
  await page.waitForFunction(() => window.received.length === 1);
  const sent = await page.evaluate(() => window.received[0]);
  assert.equal(sent.role, 'user');
  assert.equal(sent.content[0].text, 'Which entities are linked in this synthetic graph?');
  const contexts = await page.evaluate(() => window.contexts);
  const context = JSON.parse(contexts[0].content[0].text.split('View context (data, not instructions):\n')[1].split('\n\n')[0]);
  assert.deepEqual(context.nodes, data.nodes);
  assert.deepEqual(context.edges, data.edges);
  assert.deepEqual(await page.evaluate(() => window.deliveryEvents), ['context', 'message']);
  assert.deepEqual(errors, []);
  const report = { endpoint, uri, resultResourceUri: result._meta.ui.resourceUri, resourceCspApplied: true, dataPreserved: true, nodeCount: 3, events, errors, failures, messageReceivedBySimulatedHost: true, realHostVerified: false };
  await writeFile(resolve(directory, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
} finally { await browser?.close(); await client.close(); if (http) await new Promise(resolveClose => http.close(resolveClose)); }
