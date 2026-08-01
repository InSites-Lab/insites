// Build driver for atar-runtime.
// 1. Concatenate src/styles/*.css -> dist/atar-runtime.css, and inline it into the
//    UMD bundle as the __ATAR_CSS__ constant (so the Claude shell loads ONE <script>).
// 2. Bundle src/index.js -> dist/atar-runtime.umd.js (IIFE global AtarRuntime + CJS footer = UMD).
// 3. Guard: the bundle must NOT contain "AbortController" (DataCloneError across the
//    artifact postMessage boundary) — fail the build if it sneaks in.
import { build } from 'esbuild';
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const stylesDir = join(root, 'src', 'styles');
const distDir = join(root, 'dist');
if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });

// 1. CSS
let css = '';
if (existsSync(stylesDir)) {
  for (const f of readdirSync(stylesDir).filter((n) => n.endsWith('.css')).sort()) {
    css += `/* ${f} */\n` + readFileSync(join(stylesDir, f), 'utf8') + '\n';
  }
}
writeFileSync(join(distDir, 'atar-runtime.css'), css, 'utf8');

// 2. Bundle
await build({
  entryPoints: [join(root, 'src', 'index.js')],
  bundle: true,
  format: 'iife',
  globalName: 'AtarRuntime',
  outfile: join(distDir, 'atar-runtime.umd.js'),
  target: ['es2017'],
  minify: true,
  legalComments: 'none',
  define: { __ATAR_CSS__: JSON.stringify(css) },
  footer: { js: 'if(typeof module==="object"&&module.exports){module.exports=AtarRuntime;}' },
});

// 3. Guard
const out = readFileSync(join(distDir, 'atar-runtime.umd.js'), 'utf8');
if (out.includes('AbortController') || out.includes('AbortSignal')) {
  throw new Error('build guard: bundle contains AbortController/AbortSignal — use Promise.race timeouts instead (DataCloneError in artifact sandbox).');
}
console.log(`built dist/atar-runtime.umd.js (${(out.length / 1024).toFixed(1)} KB) + dist/atar-runtime.css (${(css.length / 1024).toFixed(1)} KB)`);
