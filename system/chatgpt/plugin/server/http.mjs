import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { makeMcpServer } from './mcp.mjs';
import { fixtures } from '../fixtures/sample.mjs';
import { VERSION } from '../shared/version.mjs';

const LIMIT = 2 * 1024 * 1024;
const localHosts = new Set(['localhost', '127.0.0.1', '[::1]']);
export function startHttp({ port = Number(process.env.PORT ?? 8787), publicUrl = process.env.PUBLIC_URL ?? '', bindHost = process.env.BIND_HOST ?? '127.0.0.1' } = {}) {
  const hosts = new Set(localHosts);
  if (publicUrl) hosts.add(new URL(publicUrl).hostname);
  const app = createServer(async (req, res) => {
    try {
    const finish = (code, text) => res.writeHead(code, { 'content-type': 'application/json', 'cache-control': 'no-store' }).end(JSON.stringify(text));
    let url;
    try { url = new URL(req.url, `http://${req.headers.host}`); } catch { return finish(400, { error: 'Invalid request URL' }); }
    if (!hosts.has(url.hostname)) return finish(421, { error: 'Unknown host' });
    const origin = req.headers.origin;
    if (origin) {
      let allowed = false;
      try { const u = new URL(origin); allowed = (u.protocol === 'http:' && localHosts.has(u.hostname)) || (u.protocol === 'https:' && (u.hostname === 'chatgpt.com' || u.hostname.endsWith('.chatgpt.com') || u.hostname === 'claude.ai' || u.hostname.endsWith('.claude.ai') || u.hostname === 'claude.com' || u.hostname.endsWith('.claude.com') || origin === new URL(publicUrl || 'https://invalid.invalid').origin)); } catch { /* Invalid origin */ }
      if (!allowed) return finish(403, { error: 'Origin is not allowed' });
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
    if (url.pathname === '/health' && req.method === 'GET') return finish(200, { name: 'insites-mcp', version: VERSION, stateless: true });
    // A tunnel cannot access preview fixtures, even though its upstream is loopback.
    if (url.pathname.startsWith('/preview') && localHosts.has(url.hostname) && !req.headers['x-forwarded-for'] && !req.headers['forwarded']) {
      if (req.method !== 'GET') return finish(405, { error: 'GET only' });
      if (url.pathname === '/preview/fixture') return finish(200, fixtures[url.searchParams.get('type')] ?? fixtures.probe);
      const path = url.pathname === '/preview/viewer' ? '../web/dist/viewer.html' : '../web/harness.html';
      const html = await readFile(new URL(path, import.meta.url), 'utf8');
      return res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }).end(html);
    }
    if (url.pathname !== '/mcp') return finish(404, { error: 'Not found' });
    if (req.method === 'OPTIONS') return res.writeHead(204, { 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type, mcp-protocol-version, mcp-session-id' }).end();
    if (req.method !== 'POST') return res.writeHead(405, { Allow: 'POST' }).end();
    let parsed;
    try {
      let size = 0; const chunks = [];
      for await (const chunk of req) { size += chunk.length; if (size > LIMIT) { finish(413, { error: 'Request exceeds 2 MiB' }); return; } chunks.push(chunk); }
      parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch { return finish(400, { error: 'Invalid JSON body' }); }
    // Opt-in diagnostics contain protocol routing only, never assessment data.
    if (process.env.INSITES_TRACE === '1') {
      const entry = { time: new Date().toISOString(), method: parsed.method };
      if (parsed.method === 'tools/call') entry.tool = parsed.params?.name;
      if (parsed.method === 'resources/read') entry.uri = parsed.params?.uri;
      res.once('finish', () => console.log(JSON.stringify({ ...entry, status: res.statusCode })));
    }
    const server = await makeMcpServer(publicUrl);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    res.on('close', () => { void transport.close(); void server.close(); });
    try { await server.connect(transport); await transport.handleRequest(req, res, parsed); }
    catch { if (!res.headersSent) finish(500, { error: 'MCP request failed' }); }
    } catch {
      if (!res.headersSent) res.writeHead(500, { 'content-type': 'application/json', 'cache-control': 'no-store' }).end(JSON.stringify({ error: 'MCP service unavailable' }));
      else if (!res.writableEnded) res.end();
    }
  });
  app.requestTimeout = 30000;
  app.headersTimeout = 10000;
  return new Promise((resolve, reject) => { app.once('error', reject); app.listen(port, bindHost, () => resolve(app)); });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = await startHttp();
  console.log(`InSites MCP listening on ${server.address().address}:${server.address().port}/mcp`);
}
