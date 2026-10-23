import { cp, mkdir, mkdtemp, readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve, relative } from 'node:path';
import { spawn } from 'node:child_process';
import { root, repo } from './build.mjs';

export const skillNames = ['assess', 'claim-extractor', 'connection-test', 'dashboard',
  'knowledge-graph', 'read-assessment', 'read-collection', 'stage-spec'];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

async function filesIn(directory) {
  const files = [];
  async function walk(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) throw new Error('Delivery must not contain links.');
      const full = resolve(path, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.isFile()) files.push(full);
      else throw new Error('Delivery contains an unsupported filesystem entry.');
    }
  }
  await walk(directory);
  return files.sort();
}

export async function inspectDeliveryPlugin(directory, endpoint) {
  const files = await filesIn(directory);
  const paths = files.map(file => relative(directory, file).replaceAll('\\', '/'));
  const allowedRootFiles = new Set(['plugin.json', 'mcp.json', '.mcp.json', 'README.md',
    'INSTALL.md', 'LICENSE', 'ADAPTATION.md', 'BUILD-MANIFEST.json', '.codex-plugin/plugin.json']);
  for (const path of paths) {
    if (!allowedRootFiles.has(path) && !/^skills\/[a-z-]+\/(SKILL\.md|references\/[a-z0-9-]+\.md)$/.test(path)) {
      throw new Error(`Unexpected delivery file: ${path}`);
    }
  }
  const plugin = JSON.parse(await readFile(resolve(directory, 'plugin.json'), 'utf8'));
  const codex = JSON.parse(await readFile(resolve(directory, '.codex-plugin/plugin.json'), 'utf8'));
  if (plugin.name !== 'insites-chatgpt' || plugin.name !== codex.name || plugin.version !== codex.version ||
      plugin.extensions?.['com.openai']?.apps || codex.apps || codex.mcpServers !== './.mcp.json') {
    throw new Error('Delivery identity or account-independent MCP wiring is invalid.');
  }
  for (const filename of ['mcp.json', '.mcp.json']) {
    const config = JSON.parse(await readFile(resolve(directory, filename), 'utf8'));
    const names = Object.keys(config.mcpServers ?? {});
    const server = config.mcpServers?.insites;
    if (names.length !== 1 || names[0] !== 'insites' || server.type !== 'streamable-http' ||
        server.url !== endpoint || Object.keys(server).some(key => !['type', 'url'].includes(key))) {
      throw new Error(`Invalid remote MCP declaration: ${filename}`);
    }
  }
  const actualSkills = paths.filter(path => path.endsWith('/SKILL.md')).map(path => path.split('/')[1]).sort();
  if (JSON.stringify(actualSkills) !== JSON.stringify(skillNames)) throw new Error('Delivery must contain the eight InSites skills.');
  for (const name of skillNames) {
    const content = await readFile(resolve(directory, 'skills', name, 'SKILL.md'), 'utf8');
    if (!new RegExp(`^---\\r?\\nname: ${name}\\r?\\n`).test(content)) throw new Error(`Skill identity differs: ${name}`);
  }
  const provenance = JSON.parse(await readFile(resolve(directory, 'BUILD-MANIFEST.json'), 'utf8'));
  if (provenance.pluginVersion !== plugin.version) throw new Error('Provenance version differs.');
  return { plugin, provenance, files, paths };
}

// Fixed ZIP timestamps and file permissions make repeated builds inspectable.
async function deterministicZip(folder, destination) {
  const code = `import pathlib,sys,zipfile
p=pathlib.Path(sys.argv[1])
with zipfile.ZipFile(sys.argv[2],"w",zipfile.ZIP_DEFLATED) as z:
 for f in sorted(p.rglob("*")):
  if f.is_file():
   i=zipfile.ZipInfo(f.relative_to(p.parent).as_posix(),(2026,10,9,0,0,0))
   i.create_system=3
   i.external_attr=0o100644<<16
   i.compress_type=zipfile.ZIP_DEFLATED
   z.writestr(i,f.read_bytes())
`;
  await new Promise((ok, fail) => {
    const child = spawn('python', ['-c', code, folder, destination], { windowsHide: true, stdio: 'inherit' });
    child.on('error', fail);
    child.on('exit', status => status === 0 ? ok() : fail(new Error('Delivery ZIP failed.')));
  });
}

export async function createDelivery(portable, {
  endpoint, archivePath = resolve(repo, 'downloads/insites-chatgpt.zip'),
  recordPath = resolve(repo, 'downloads/insites-chatgpt-package.json')
}) {
  const url = new URL(endpoint);
  if (url.protocol !== 'https:' || url.pathname !== '/mcp' || url.username || url.password || url.search || url.hash) {
    throw new Error('Delivery requires a credential-free HTTPS /mcp URL.');
  }
  await mkdir(resolve(root, 'dist'), { recursive: true });
  const staging = await mkdtemp(resolve(root, 'dist/delivery-'));
  const pluginFolder = resolve(staging, 'insites-chatgpt');
  await cp(portable, pluginFolder, { recursive: true });
  await cp(resolve(root, 'distribution/INSTALL.md'), resolve(pluginFolder, 'INSTALL.md'));
  const inspected = await inspectDeliveryPlugin(pluginFolder, url.href);
  await mkdir(dirname(archivePath), { recursive: true });
  await mkdir(dirname(recordPath), { recursive: true });
  await deterministicZip(pluginFolder, archivePath);
  const fileRecords = await Promise.all(inspected.files.map(async (file, index) => ({
    path: `insites-chatgpt/${inspected.paths[index]}`, sha256: digest(await readFile(file))
  })));
  const record = {
    formatVersion: 1, pluginName: inspected.plugin.name, pluginVersion: inspected.plugin.version,
    specificationVersion: inspected.provenance.specificationVersion, runtimeVersion: inspected.provenance.runtimeVersion,
    endpoint: url.href, authentication: 'none', skillNames,
    archiveSHA256: digest(await readFile(archivePath)), files: fileRecords
  };
  await writeFile(recordPath, JSON.stringify(record, null, 2) + '\n');
  return record;
}
