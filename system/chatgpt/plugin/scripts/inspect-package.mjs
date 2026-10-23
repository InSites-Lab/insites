import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { root, output } from './build.mjs';

const response = await fetch('https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', { signal: AbortSignal.timeout(15000) });
if (!response.ok) throw new Error('Official manifest schema unavailable');
const schema = await response.json();
const ajv = new Ajv({ allErrors: true, strict: false }); addFormats(ajv);
const validate = ajv.compile(schema);
const manifest = JSON.parse(await readFile(resolve(output, 'plugin.json'), 'utf8'));
if (!validate(manifest)) throw new Error(JSON.stringify(validate.errors));
const skillDirs = await readdir(resolve(output, 'skills'));
if (skillDirs.length !== 8) throw new Error('Eight skills expected');
for (const name of skillDirs) {
  const skill = await readFile(resolve(output, 'skills', name, 'SKILL.md'), 'utf8');
  if (!skill.startsWith('---\n') && !skill.startsWith('---\r\n')) throw new Error(`Missing frontmatter: ${name}`);
  if (!skill.includes(`name: ${name}`) || !skill.includes('description:')) throw new Error(`Invalid skill metadata: ${name}`);
}
const code = 'import sys,zipfile,json; z=zipfile.ZipFile(sys.argv[1]); n=z.namelist(); assert len(set(x.split("/")[0] for x in n))==1; assert all("node_modules" not in x and "studies" not in x and "OLD" not in x and not x.endswith(".env") for x in n); assert "insites-chatgpt/plugin.json" in n; p=json.loads(z.read("insites-chatgpt/plugin.json")); assert p["name"]=="insites-chatgpt"; assert len([x for x in n if x.endswith("/SKILL.md")])==8; assert ("insites-chatgpt/mcp.json" in n)==(sys.argv[2]=="portable"); assert ("insites-chatgpt/.mcp.json" in n)==(sys.argv[2]=="portable"); assert ("insites-chatgpt/.codex-plugin/plugin.json" in n); assert sys.argv[2]!="portable" or json.loads(z.read("insites-chatgpt/mcp.json"))["mcpServers"]["insites"]["url"]==json.loads(z.read("insites-chatgpt/.mcp.json"))["mcpServers"]["insites"]["url"]; print("Archive inspected:",sys.argv[2],len(n),"files")';
for (const mode of ['web', 'portable']) {
  const checked = spawnSync('python', ['-c', code, resolve(root, `artifacts/insites-chatgpt-${mode}.zip`), mode], { windowsHide: true, encoding: 'utf8' });
  if (checked.status !== 0) throw new Error(checked.stderr);
  console.log(checked.stdout.trim());
}
await writeFile(resolve(root, 'artifacts/package-check.json'), JSON.stringify({ manifestSchema: schema.$id ?? 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', skills: skillDirs, webHasMcpDeclaration: false, portableHasMcpDeclaration: true, actualWorkspaceInstall: 'Not tested' }, null, 2));
console.log('Portable manifest validates against its official schema. Workspace installation remains untested.');
