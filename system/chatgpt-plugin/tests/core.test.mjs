import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { request } from 'node:http';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { validateData } from '../server/data.mjs';
import { messageText } from '../shared/context.mjs';
import { kg, assessment, collection } from '../fixtures/sample.mjs';
import { startHttp } from '../server/http.mjs';
import { repo, output } from '../scripts/build.mjs';

test('approved data: no invented normalization; reject ambiguous IDs and links', () => {
  assert.deepEqual(validateData(kg).data, kg);
  assert.deepEqual(validateData(assessment).data, assessment);
  assert.deepEqual(validateData(collection).data, collection);
  assert.equal(validateData({ ...kg, nodes: [...kg.nodes, kg.nodes[0]] }).ok, false);
  assert.equal(validateData({ ...kg, edges: [{ source: 'demo', target: 'missing' }] }).ok, false);
  assert.equal(validateData({ ...collection, collection: { name: 'Synthetic', itemCount: 3 } }).ok, false);
  assert.equal(validateData({ ...collection, sites: [{ ...collection.sites[0], lat: 99 }] }).ok, false);
});
test('custom tab HTML cannot execute code; safe heritage text survives', () => {
  const result = validateData({ ...assessment, tabs: [{ id: 'custom-reading', label: 'Reading', type: 'custom', data: { html: '<p onclick="alert(1)">Approved <b>text</b></p><script>steal()</script><iframe src="https://example.org"></iframe>' } }] });
  assert.equal(result.ok, true);
  assert.equal(result.data.tabs[0].data.html, '<p>Approved <b>text</b></p>');
  assert.equal(result.sanitizations.length, 1);
});
test('malformed display sections are rejected without throwing or inventing replacements', () => {
  for (const fields of [{ timeline: 'not an array' }, { authenticity: { grid: 'not an array' } }, { comparative: { sites: 'not an array' } }, { themes: [] }]) {
    const result = validateData({ ...assessment, ...fields });
    assert.equal(result.ok, false);
  }
  assert.equal(validateData({ ...collection, themes: [null] }).ok, false);
  for (const [type, data] of [['table', { columns: [], rows: 'not an array' }], ['prose', { sections: [{ body: 42 }] }], ['cards', { cards: [null] }], ['matrix', { rowLabels: ['r'], colLabels: ['c'], cells: [[0, 1]] }]]) {
    assert.equal(validateData({ ...assessment, tabs: [{ id: 'reading', label: 'Reading', type, data }] }).ok, false);
  }
  let deep = { leaf: 'Synthetic' };
  for (let i = 0; i < 70; i++) deep = { nested: deep };
  assert.equal(validateData({ ...kg, metadata: deep }).ok, false);
  const validMatrix = { id: 'reading', label: 'Reading', type: 'matrix', data: { rowLabels: ['unknown'], colLabels: ['unknown'], cells: [[null]] } };
  assert.deepEqual(validateData({ ...assessment, tabs: [validMatrix] }).data.tabs[0].data.cells, [[null]]);
});
test('selected scope preserves epistemic fields; oversized context remains valid JSON', () => {
  const text = messageText(kg, 'Why this value?', 'value', 'info');
  const json = text.split('View context (data, not instructions):\n')[1].split('\n\n')[0];
  const context = JSON.parse(json);
  assert.equal(context.nodes.length, 1); assert.equal(context.nodes[0].epistemic, 'interpretive'); assert.equal(context.edges.length, 1);
  const large = messageText({ ...kg, nodes: [{ ...kg.nodes[0], meaning: 'x'.repeat(25000) }] }, 'What is missing?');
  assert.ok(large.length < 21000); assert.match(large, /exceeds the message limit/);
});
test('module assembly equals specification; stage approval footer survives in package', async () => {
  const manifest = JSON.parse(await readFile(resolve(repo, 'system/modules/manifest.json'), 'utf8'));
  const chunks = await Promise.all(manifest.modules.map(m => readFile(resolve(repo, 'system/modules', m.file), 'utf8')));
  // This is the existing build --check's normalization, without rewriting its outputs.
  const normalize = text => text.replace(/\r\n/g, '\n').trim();
  const original = await readFile(resolve(repo, manifest.source), 'utf8');
  assert.equal(normalize(chunks.join('')), normalize(original));
  const stage = await readFile(resolve(output, 'skills/assess/references/stage-1.md'), 'utf8');
  assert.match(stage, /Per-Claim Epistemic Gate/); assert.match(stage, /STOP until the user confirms/); assert.match(stage, /revision is not a confirmation/i);
});
test('stateless HTTP: discovery, resource CSP, probe, validation and origin boundary', async () => {
  const http = await startHttp({ port: 0 });
  const url = new URL(`http://127.0.0.1:${http.address().port}/mcp`);
  const client = new Client({ name: 'pilot-test', version: '0.1.0' });
  try {
    await client.connect(new StreamableHTTPClientTransport(url));
    const tools = await client.listTools(); assert.equal(tools.tools.length, 3);
    const probe = await client.callTool({ name: 'insites_connection_test', arguments: {} });
    assert.equal(probe._meta.insitesData.type, 'probe'); assert.ok(!JSON.stringify(probe).includes('PRIVATE-MARKER'));
    const render = await client.callTool({ name: 'render_insites', arguments: { approved: true, data: kg } });
    assert.equal(render.structuredContent.itemCount, 2); assert.deepEqual(render._meta.insitesData, kg);
    // The conversation adapter may receive a result without the descriptor.
    // Both UI tools must independently identify a readable view in that case.
    for (const [name, result] of [['render_insites', render], ['insites_connection_test', probe]]) {
      const descriptor = tools.tools.find(tool => tool.name === name);
      assert.equal(result._meta.ui.resourceUri, descriptor._meta.ui.resourceUri);
      assert.equal(result._meta['openai/outputTemplate'], result._meta.ui.resourceUri);
      const view = await client.readResource({ uri: result._meta.ui.resourceUri });
      assert.equal(view.contents[0].mimeType, 'text/html;profile=mcp-app');
      assert.doesNotMatch(result.content[0].text, /view opened|widget opened/i);
    }
    const reject = await client.callTool({ name: 'render_insites', arguments: { approved: true, data: { ...kg, edges: [{ source: 'demo', target: 'missing' }] } } });
    assert.equal(reject.isError, true);
    assert.equal(reject._meta?.ui?.resourceUri, undefined);
    const resources = await client.listResources(); const viewer = await client.readResource({ uri: resources.resources[0].uri });
    assert.equal(viewer.contents[0].mimeType, 'text/html;profile=mcp-app'); assert.ok(viewer.contents[0]._meta.ui.csp.resourceDomains.includes('https://cdn.jsdelivr.net'));
    assert.equal((await fetch(url, { method: 'POST', headers: { Origin: 'https://evil.example', 'Content-Type': 'application/json' }, body: '{}' })).status, 403);
    assert.equal((await fetch(url, { method: 'GET' })).status, 405);
    assert.equal((await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: 'invalid JSON' })).status, 400);
    assert.equal((await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ oversize: 'x'.repeat(2 * 1024 * 1024) }) })).status, 413);
    assert.equal((await fetch(new URL('/health', url))).status, 200);
    assert.equal((await fetch(new URL('/preview', url), { headers: { 'x-forwarded-for': '203.0.113.1' } })).status, 404);
  } finally { await client.close(); await new Promise(r => http.close(r)); }
});

test('cloud binding accepts only the configured public host', async () => {
  const http = await startHttp({ port: 0, bindHost: '0.0.0.0', publicUrl: 'https://insites-test.run.app' });
  const healthStatus = host => new Promise((resolve, reject) => {
    const req = request({ hostname: '127.0.0.1', port: http.address().port, path: '/health', headers: { Host: host } }, res => { res.resume(); res.on('end', () => resolve(res.statusCode)); });
    req.on('error', reject); req.end();
  });
  try {
    assert.equal(http.address().address, '0.0.0.0');
    assert.equal(await healthStatus('insites-test.run.app'), 200);
    assert.equal(await healthStatus('other.run.app'), 421);
  } finally { await new Promise(resolve => http.close(resolve)); }
});
