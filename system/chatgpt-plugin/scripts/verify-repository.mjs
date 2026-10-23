import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { root, repo } from './build.mjs';

const protectedRoots = ['system/modules', 'system/build', 'system/claude-plugin/insites', 'system/atar-runtime/src'];
async function hashes() {
  const results = {};
  const walk = async path => {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      if (['OLD', 'node_modules'].includes(entry.name)) continue;
      const child = resolve(path, entry.name);
      if (entry.isDirectory()) await walk(child);
      else if (entry.isFile()) results[relative(repo, child)] = createHash('sha256').update(await readFile(child)).digest('hex');
    }
  };
  for (const directory of protectedRoots) await walk(resolve(repo, directory));
  return results;
}
const before = await hashes();
const generated = resolve(repo, 'system/claude-plugin/insites');
if (!generated.startsWith(resolve(repo, 'system/claude-plugin') + '\\') && !generated.startsWith(resolve(repo, 'system/claude-plugin') + '/')) throw new Error('Generated target is outside its intended parent');
const check = spawnSync(process.execPath, ['system/build/build.mjs', '--check'], { cwd: repo, encoding: 'utf8', windowsHide: true });
if (check.status !== 0) throw new Error(check.stderr || check.stdout || 'Repository build check failed');
const after = await hashes();
if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error('Protected source/output bytes changed');
await mkdir(resolve(root, 'artifacts'), { recursive: true });
await writeFile(resolve(root, 'artifacts/repository-hashes.json'), JSON.stringify(after, null, 2));
console.log('Existing build --check passed. Module, adapter, generated plugin and runtime source bytes are unchanged.');
