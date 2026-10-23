import { readFile } from 'node:fs/promises';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import assert from 'node:assert/strict';
import { UI_URI } from '../server/mcp.mjs';
const config = JSON.parse(await readFile(new URL('../artifacts/connection.json', import.meta.url), 'utf8'));
const client = new Client({ name: 'insites-remote-smoke', version: '0.1.0' });
try {
  await client.connect(new StreamableHTTPClientTransport(new URL(config.endpoint), { requestInit: { headers: { 'ngrok-skip-browser-warning': 'insites-pilot' } } }));
  const tools = await client.listTools(); assert.equal(tools.tools.length, 3);
  const result = await client.callTool({ name: 'insites_connection_test', arguments: {} }); assert.equal(result._meta.insitesData.type, 'probe');
  const resource = await client.readResource({ uri: UI_URI }); assert.equal(resource.contents[0].mimeType, 'text/html;profile=mcp-app');
  console.log(`Remote HTTPS MCP verified: initialize, tools/list, connection test and resource read (${config.endpoint}). No actual host conversation was tested.`);
} finally { await client.close(); }
