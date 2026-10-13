import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { root, output } from '../scripts/build.mjs';
import { createDelivery, inspectDeliveryPlugin, skillNames } from '../scripts/delivery.mjs';

const endpoint = 'https://insites-mcp-528503455330.me-west1.run.app/mcp';
async function portableFixture() {
  await mkdir(resolve(root, 'dist'), { recursive: true });
  const temp = await mkdtemp(resolve(root, 'dist/delivery-test-'));
  const portable = resolve(temp, 'portable');
  await cp(output, portable, { recursive: true });
  const servers = { insites: { type: 'streamable-http', url: endpoint } };
  await writeFile(resolve(portable, 'mcp.json'), JSON.stringify({ mcpServers: servers }));
  await writeFile(resolve(portable, '.mcp.json'), JSON.stringify({ mcpServers: servers }));
  const codexPath = resolve(portable, '.codex-plugin/plugin.json');
  const manifest = JSON.parse(await readFile(codexPath, 'utf8'));
  manifest.mcpServers = './.mcp.json';
  await writeFile(codexPath, JSON.stringify(manifest));
  return { temp, portable };
}

test('delivery ZIP preserves the full plugin, instructions and hidden MCP declarations', async () => {
  const { temp, portable } = await portableFixture();
  const options = { endpoint, archivePath: resolve(temp, 'delivery.zip'), recordPath: resolve(temp, 'record.json') };
  const record = await createDelivery(portable, options);
  assert.deepEqual(record.skillNames, skillNames);
  assert.equal(record.authentication, 'none');
  assert.equal(record.files.filter(file => file.path.endsWith('/SKILL.md')).length, 8);
  assert.equal(record.archiveSHA256, createHash('sha256').update(await readFile(options.archivePath)).digest('hex'));
  const inspection = spawnSync('python', ['-c',
    'import sys,zipfile; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; print("\\n".join(z.namelist()))',
    options.archivePath], { encoding: 'utf8', windowsHide: true });
  assert.equal(inspection.status, 0, inspection.stderr);
  const paths = inspection.stdout.trim().split(/\r?\n/);
  assert.ok(paths.includes('insites-chatgpt/INSTALL.md'));
  assert.ok(paths.includes('insites-chatgpt/.mcp.json'));
  assert.ok(paths.includes('insites-chatgpt/.codex-plugin/plugin.json'));
  assert.ok(paths.every(path => path.startsWith('insites-chatgpt/')));
  assert.ok(!paths.some(path => /\.app\.json|node_modules|studies\/|OLD\/|installer|server\//.test(path)));
  const first = await readFile(options.archivePath);
  await createDelivery(portable, options);
  assert.deepEqual(await readFile(options.archivePath), first, 'Repeated packaging must preserve ZIP bytes.');
});

test('delivery rejects account bindings, missing skills and credentials', async () => {
  const { portable } = await portableFixture();
  await writeFile(resolve(portable, '.app.json'), JSON.stringify({ apps: {} }));
  await assert.rejects(inspectDeliveryPlugin(portable, endpoint), /Unexpected delivery file/);
  const { portable: withCredentials } = await portableFixture();
  await writeFile(resolve(withCredentials, '.mcp.json'), JSON.stringify({
    mcpServers: { insites: { type: 'streamable-http', url: endpoint, headers: { Authorization: 'synthetic' } } }
  }));
  await assert.rejects(inspectDeliveryPlugin(withCredentials, endpoint), /Invalid remote MCP declaration/);
  const { portable: missingSkill } = await portableFixture();
  await writeFile(resolve(missingSkill, 'skills/assess/SKILL.md'), '---\nname: missing\n---\n');
  await assert.rejects(inspectDeliveryPlugin(missingSkill, endpoint), /Skill identity differs/);
});
