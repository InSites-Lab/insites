import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { buildPilot, root, output } from './build.mjs';
import { VERSION } from '../shared/version.mjs';

async function zip(folder, destination) {
  const code = 'import pathlib,sys,zipfile; p=pathlib.Path(sys.argv[1]); z=zipfile.ZipFile(sys.argv[2],"w",zipfile.ZIP_DEFLATED); [z.write(f, f.relative_to(p.parent).as_posix()) for f in sorted(p.rglob("*")) if f.is_file()]; z.close()';
  await new Promise((resolvePromise, reject) => { const child = spawn('python', ['-c', code, folder, destination], { windowsHide: true, stdio: 'inherit' }); child.on('error', reject); child.on('exit', code => code === 0 ? resolvePromise() : reject(new Error('ZIP packaging failed'))); });
}

async function sourceZip(destination) {
  const code = 'import pathlib,sys,zipfile; p=pathlib.Path(sys.argv[1]); z=zipfile.ZipFile(sys.argv[2],"w",zipfile.ZIP_DEFLATED); roots=["adapter","config","scripts","server","shared","web","fixtures","tests"]; files=[p/x for x in ["package.json","package-lock.json","README.md","Dockerfile",".dockerignore",".gcloudignore"]]; files += [f for r in roots for f in (p/r).rglob("*") if f.is_file() and "dist" not in f.relative_to(p).parts]; [z.write(f, (pathlib.Path(p.name)/f.relative_to(p)).as_posix()) for f in sorted(files)]; z.close()';
  await new Promise((resolvePromise, reject) => { const child = spawn('python', ['-c', code, root, destination], { windowsHide: true, stdio: 'inherit' }); child.on('error', reject); child.on('exit', code => code === 0 ? resolvePromise() : reject(new Error('Source ZIP failed'))); });
}

export async function packagePilot(endpoint = '') {
  const config = JSON.parse(await readFile(resolve(root, 'config/remote-mcp.json'), 'utf8'));
  const url = new URL(endpoint || config.endpoint);
  if (url.protocol !== 'https:' || url.pathname !== '/mcp' || url.username || url.password || url.search || url.hash) throw new Error('Use a verified HTTPS /mcp endpoint.');
  const response = await fetch(new URL('/health', url), { signal: AbortSignal.timeout(15000) });
  const health = await response.json();
  if (!response.ok || health.name !== 'insites-mcp' || health.version !== VERSION) throw new Error(`Endpoint must serve InSites MCP ${VERSION}.`);

  await buildPilot();
  const artifacts = resolve(root, 'artifacts'); await mkdir(artifacts, { recursive: true });
  await zip(output, resolve(artifacts, 'insites-chatgpt-web.zip'));
  await sourceZip(resolve(artifacts, 'insites-chatgpt-source.zip'));
  const portable = resolve(root, 'dist/portable/insites-chatgpt');
  await cp(output, portable, { recursive: true });
  const servers = { insites: { type: 'streamable-http', url: url.href } };
  await writeFile(resolve(portable, 'mcp.json'), JSON.stringify({ '$schema': 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json', mcpServers: servers }, null, 2));
  await writeFile(resolve(portable, '.mcp.json'), JSON.stringify({ mcpServers: servers }, null, 2));
  const codexPath = resolve(portable, '.codex-plugin/plugin.json');
  const codex = JSON.parse(await readFile(codexPath, 'utf8'));
  codex.mcpServers = './.mcp.json';
  await writeFile(codexPath, JSON.stringify(codex, null, 2));
  await zip(portable, resolve(artifacts, 'insites-chatgpt-portable.zip'));
  await writeFile(resolve(artifacts, 'connection.json'), JSON.stringify({ endpoint: url.href, transport: 'streamable-http', authentication: 'none', version: VERSION }, null, 2));
  console.log(`Packages ready for ${url.href}`);
}
if (process.argv[1] && resolve(process.argv[1]) === resolve(root, 'scripts/package.mjs')) await packagePilot(process.argv[2] ?? '');
