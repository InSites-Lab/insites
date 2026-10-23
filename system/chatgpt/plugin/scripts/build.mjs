import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
import { transform } from '../adapter/transforms.mjs';
import { VERSION } from '../shared/version.mjs';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const repo = resolve(root, '../../..');
export const output = resolve(root, 'dist/insites-chatgpt');
const sha = text => createHash('sha256').update(text).digest('hex');
async function save(path, text) { await mkdir(dirname(path), { recursive: true }); await writeFile(path, text); }
const route = {
  'stage-0.md': ['10-stage-0'], 'stage-1.md': ['11-stage-1'], 'stage-2.md': ['12-stage-2'], 'stage-3.md': ['13-stage-3'], 'stage-4.md': ['14-stage-4'], 'stage-5.md': ['15-stage-5'], 'stage-6.md': ['16-stage-6']
};
const descriptions = {
  assess: 'Run or resume InSites CBSA heritage assessment Stages 0-6. Use on requests to start, continue or revise an assessment. Apply evidence, notation and expert approval rules throughout the conversation.',
  'knowledge-graph': 'Create an InSites knowledge graph from approved findings on explicit request. Use render_insites; introduce no new analysis.',
  dashboard: 'Create an InSites assessment dashboard from approved stage outputs on explicit request. Use render_insites after user approval.',
  'read-assessment': 'Read an uploaded completed heritage assessment or completed InSites outputs. Offer one chosen analytical or interpretive reading.',
  'read-collection': 'Read uploaded material for at least two heritage assets, or an explicitly requested synthetic collection; offer one chosen analysis and an optional collection dashboard.',
  'stage-spec': 'Create a standalone specification derived from a requested InSites stage without executing that stage.',
  'connection-test': 'Test whether the InSites MCP App can send a question into this conversation. Use only when the user requests a connection test; do not start or advance an assessment.'
};
const governance = `Early development version, not yet for use in formal assessments.\n\nThe InSites core governs every turn in this conversation. Before analytical work, read references/core-rules.md if the core is not already visible. Re-read it when context loss makes the rules uncertain. Apply the Per-Claim Epistemic Gate while writing, preserve exact values and provenance, and stop after each stage for explicit expert confirmation. A revision is not confirmation. Visual-product questions do not advance a stage. Before the first Hebrew output, read references/hebrew-overlay.md. Do not load future stages in advance. Explicit user instructions take precedence over skill guidelines.\n\nThe host selects skills; this package cannot enforce an always-on skill at the host level or invoke another skill as a program. Use the bundled references to reload the rules and requested workflow as necessary. If a separate auditor is unavailable or not explicitly requested, apply a self-check and say it is a self-check. Do not spawn an auditor automatically. Do not load a single-file InSites specification beside this plugin in the same conversation. If render_insites is unavailable, ask the user to enable their InSites app in this conversation; do not fabricate a render or produce replacement rendering code.\n\n`;
export async function buildPilot() {
  const manifest = JSON.parse(await readFile(resolve(repo, 'system/modules/manifest.json'), 'utf8'));
  const mapping = JSON.parse(await readFile(resolve(repo, 'system/build/claude-plugin/skills.json'), 'utf8'));
  const sources = new Map(); const hashes = {};
  for (const module of manifest.modules) {
    const raw = await readFile(resolve(repo, 'system/modules', module.file), 'utf8'); hashes[module.id] = sha(raw); sources.set(module.id, transform(module.id, raw));
  }
  const join = ids => ids.map(id => { if (!sources.has(id)) throw new Error(`Missing module: ${id}`); return sources.get(id); }).join('\n\n');
  const core = join(['00-core-system', '02-core-rules', '03-notation', '04-title-examples']);
  const footer = await readFile(resolve(repo, 'system/build/claude-plugin/stage-footer.md'), 'utf8');
  const originalContract = await readFile(resolve(repo, 'system/atar-runtime/data-contract.md'), 'utf8');
  const contract = originalContract.replaceAll('\r\n', '\n')
    .replace(/^\*\*0\.3\.8 is[^\n]+/m, '**Bundled runtime: 0.3.8.**')
    .replace(/^The bot emits[^\n]+/m, 'The assistant sends one approved DATA object with a type discriminator. The MCP App mounts the pinned runtime. Field aliases are supported by normalize().')
    .replace('### Assessment / Collection back-compat aliases (GPT abbreviated ↔ Claude full)', '### Assessment / Collection field aliases')
    .replace('| canonical (Claude) | also accepted (GPT) |', '| canonical field | accepted alias |')
    .replace('Custom HTML tabs remain supported by the runtime; the current DeepSeek shell deliberately accepts only structured tabs.', 'Custom HTML tabs remain supported by the runtime and are sanitized by the MCP server.')
    .replace(/## host[\s\S]*$/, '## Conversation delivery\n\nThe MCP App mounts the runtime with an empty host object. The integration adapter intercepts the runtime Ask action, sends bounded view data through the host model-context channel, then sends only the question through the host message channel. The answer belongs to the existing InSites conversation; no model API is called by the server or renderer.\n');
  for (const [name, config] of Object.entries(mapping.skills)) {
    const base = resolve(output, 'skills', name);
    if (config.copy) {
      let body = await readFile(resolve(repo, config.copy), 'utf8');
      body = body.replace(/^\*\*Default transcript\*\*:[^\n]+/m, '**Default transcript**: the CBSA transcript explicitly supplied by the user. No bundled transcript is assumed.');
      body = body.replace('Extraction agent: Claude Code claim-extractor v1.1', 'Extraction protocol: InSites claim-extractor codebook v1.1');
      body = body.replace(/^Save the full report alongside[^\n]+/m, 'Offer the full report as `claim-extraction-[date].md` in the user-selected output location.');
      body = body.replace(/- v1\.0:[^\n]+/, '');
      await save(resolve(base, 'SKILL.md'), body); continue;
    }
    const references = { ...config.references, 'core-rules.md': ['00-core-system', '02-core-rules', '03-notation', '04-title-examples'] };
    if (name === 'assess') references['entity-categories.md'] = ['29-ca-ec'];
    if (name === 'read-collection') references['notation.md'] = ['03-notation'];
    const routing = Object.entries(references).map(([file, entry]) => `- \`references/${file}\`: ${(Array.isArray(entry) ? entry : entry.modules).join(', ')}${file.startsWith('stage-') ? '; read only for the requested stage' : ''}`).join('\n');
    const extra = name === 'assess' ? 'For a requested product workflow, use its installed skill if available; all product skills include the core. Before Stage 1, read vocabularies.md; use it through Stage 5. Read session-report.md only when a session report is requested, image-analysis.md for requested image reading and continuity.md on save/resume.\n\n' : '';
    await save(resolve(base, 'SKILL.md'), `---\nname: ${name}\ndescription: ${JSON.stringify(descriptions[name])}\n---\n\n# InSites ${name}\n\n${governance}${extra}Read supporting files on demand:\n${routing}\n- \`references/data-contract.md\`: display data field shapes\n\n${join(config.body ?? [])}`);
    for (const [file, entry] of Object.entries(references)) {
      const ids = Array.isArray(entry) ? entry : entry.modules;
      await save(resolve(base, 'references', file), join(ids) + (entry.footer ? footer : ''));
    }
    await save(resolve(base, 'references/data-contract.md'), contract);
  }
  await save(resolve(output, 'skills/connection-test/SKILL.md'), `---\nname: connection-test\ndescription: ${JSON.stringify(descriptions['connection-test'])}\n---\n\n# InSites conversation connection test\n\nAsk the user to supply a private marker in this conversation, then call \`insites_connection_test\`. Do not pass the marker to any tool. Ask them to click Ask in chat in the widget. When the widget message arrives, answer using the marker in conversation history; if it is unavailable, say so. Do not run a CBSA stage. The UI accepting a message is not proof of the conversation reply: confirm that the question appears and the answer recalls the marker. Record manual acceptance separately for each host.\n`);
  const plugin = { '$schema': 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', name: 'insites-chatgpt', version: VERSION, description: 'InSites CBSA heritage workflows built from specification modules. Early development version, not yet for use in formal assessments.', author: { name: 'YuvalShafriri' }, extensions: { 'com.openai': { interface: { displayName: 'InSites', shortDescription: 'Context-led heritage reading', longDescription: 'Run staged heritage assessments with epistemic notation and expert approval, read assessments and collections, and project approved findings into an InSites MCP App. The server is connected separately for ChatGPT web.', developerName: 'YuvalShafriri', category: 'Productivity', capabilities: [], defaultPrompt: 'Start an InSites heritage assessment from my uploaded material.' } } } };
  if (plugin.extensions['com.openai'].interface.shortDescription.length > 30) throw new Error('Plugin subtitle is too long');
  await save(resolve(output, 'plugin.json'), JSON.stringify(plugin, null, 2));
  await save(resolve(output, '.codex-plugin/plugin.json'), JSON.stringify({ name: plugin.name, version: plugin.version, description: plugin.description, author: plugin.author, skills: './skills/' }, null, 2));
  await save(resolve(output, 'LICENSE'), await readFile(resolve(repo, 'LICENSE'), 'utf8'));
  await save(resolve(output, 'ADAPTATION.md'), '# Build provenance\n\nMethodology and claim extraction: InSites-Lab/insites, specification 11.5 modules and claim-extractor codebook 1.1, Apache-2.0. Original analytical rules are assembled as text. Integration passages for rendering, conversation delivery, file output and model-specific usage suggestions are adapted during this build. The original repository files are not edited. Divider modules are not instruction files. No heritage source document or research transcript is bundled. See BUILD-MANIFEST.json for exact source hashes.\n');
  await save(resolve(output, 'BUILD-MANIFEST.json'), JSON.stringify({ specificationVersion: manifest.version, pluginVersion: plugin.version, runtimeVersion: '0.3.8', modules: hashes, adapterHash: sha(await readFile(resolve(root, 'adapter/transforms.mjs'), 'utf8')), excludedDividerModules: manifest.modules.filter(m => m.kind === 'divider').map(m => m.id) }, null, 2));
  await save(resolve(output, 'README.md'), '# InSites\n\nEarly development version, not yet for use in formal assessments. Use non-confidential trial material.\n\nImport the complete package with Plugin Creator and select Install plugin. In a new ChatGPT Desktop Work conversation, select @InSites, upload or paste a short text of your choice, and write "Begin assessment." Review each stage before continuing.\n\nThe delivery ZIP includes INSTALL.md with the installation steps. Connection diagnostics are available on explicit request.\n');
  const bundled = await build({ entryPoints: [resolve(root, 'web/app.mjs')], bundle: true, format: 'esm', platform: 'browser', target: 'es2022', write: false, minify: true });
  const runtime = await readFile(resolve(root, 'node_modules/atar-runtime/dist/atar-runtime.umd.js'), 'utf8');
  const template = await readFile(resolve(root, 'web/template.html'), 'utf8');
  const html = template.replace('/*RUNTIME*/', () => runtime.replace(/<\/script/gi, '<\\/script')).replace('/*APP*/', () => bundled.outputFiles[0].text.replace(/<\/script/gi, '<\\/script'));
  await save(resolve(root, 'web/dist/viewer.html'), html);
  console.log(`Built 8 skills and MCP App (specification ${manifest.version}, runtime 0.3.8).`);
  return { output, core, route, sources, manifest };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildPilot();
