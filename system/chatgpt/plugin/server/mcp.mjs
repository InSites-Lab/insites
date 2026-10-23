import { readFile } from 'node:fs/promises';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';
import { z } from 'zod';
import { dataSchema, validateData, summarize } from './data.mjs';
import { probe } from '../fixtures/sample.mjs';
import { VERSION } from '../shared/version.mjs';

export const UI_URI = `ui://insites/viewer/${VERSION}.html`;
// Preserve the descriptor link and repeat it on the result. The desktop
// conversation adapter can resolve this fallback, but some host display paths
// require descriptor metadata. This does not prove that a widget was opened.
const viewMetadata = { ui: { resourceUri: UI_URI }, 'openai/outputTemplate': UI_URI };
export async function makeMcpServer(publicUrl = '') {
  const html = await readFile(new URL('../web/dist/viewer.html', import.meta.url), 'utf8');
  const server = new McpServer({ name: 'insites-mcp', version: VERSION }, { instructions: 'InSites methodology lives in the installed skills and conversation. Render only user-approved projections. Widget questions belong to this conversation; do not advance the current stage. The server is stateless and has no AI model.' });
  const ui = { prefersBorder: false, csp: { connectDomains: [], resourceDomains: ['https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com', 'https://a.tile.openstreetmap.org', 'https://b.tile.openstreetmap.org', 'https://c.tile.openstreetmap.org'] } };
  if (publicUrl) ui.domain = new URL(publicUrl).origin;
  registerAppResource(server, 'insites-viewer', UI_URI, {}, async () => ({ contents: [{ uri: UI_URI, mimeType: RESOURCE_MIME_TYPE, text: html, _meta: { ui, 'openai/ui': { availableDisplayModes: ['inline', 'fullscreen'] }, 'openai/widgetDescription': 'InSites viewer. Its Ask button sends the question and view context to the existing conversation.' } }] }));
  const annotations = { readOnlyHint: true, destructiveHint: false, openWorldHint: false };
  registerAppTool(server, 'insites_connection_test', { title: 'Test InSites chat connection', description: 'Open a synthetic diagnostic widget. First ask the user to give the conversation a private marker. The widget does not receive that marker. Its button asks the conversation to recall it; no assessment stage is run.', inputSchema: {}, annotations, _meta: viewMetadata }, async () => ({ content: [{ type: 'text', text: 'Synthetic connection widget prepared. Rendering must be confirmed in the host. Click Ask in chat if the widget appears, then confirm that the question appears here and the reply recalls the marker supplied earlier in this conversation.' }], structuredContent: { type: 'probe', synthetic: true }, _meta: { ...viewMetadata, insitesData: probe } }));
  registerAppTool(server, 'render_insites', { title: 'View approved InSites data', description: 'Render a knowledge graph, assessment dashboard or collection dashboard. Project only already-approved findings; preserve exact names, provenance, unknowns and epistemic status. approved=true records the assistant assertion of user approval; it is not an independent approval verifier.', inputSchema: { approved: z.literal(true), data: dataSchema }, annotations, _meta: viewMetadata }, async ({ data }) => {
    const result = validateData(data);
    if (!result.ok) return { isError: true, content: [{ type: 'text', text: `Invalid DATA: ${result.issues.join('; ')}` }] };
    return { content: [{ type: 'text', text: `InSites ${data.type} view data prepared. Rendering must be confirmed in the host.${result.sanitizations.length ? ' Unsafe custom HTML was removed.' : ''}` }], structuredContent: summarize(result.data), _meta: { ...viewMetadata, insitesData: result.data, sanitizations: result.sanitizations, runtimeVersion: '0.3.8' } };
  });
  server.registerTool('validate_insites_data', { title: 'Validate InSites display data', description: 'Check structure, IDs, graph endpoints, coordinate ranges and custom HTML safety without generating findings or opening a view.', inputSchema: { data: dataSchema }, annotations }, async ({ data }) => {
    const result = validateData(data);
    const summary = result.ok ? { valid: true, ...summarize(result.data), sanitizations: result.sanitizations } : { valid: false, issues: result.issues };
    return { content: [{ type: 'text', text: JSON.stringify(summary) }], structuredContent: summary, isError: !result.ok };
  });
  return server;
}
