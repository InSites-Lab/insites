# atar-runtime

The rendering runtime behind everything InSites draws: the knowledge graph, the single-assessment dashboard, and the collection dashboard.

The division of labour is the point. **The specification emits a short shell and a `DATA` object; this runtime does the drawing.** Nothing about layout, colour, right-to-left handling or map behaviour lives in the specification files, which is why the same `DATA` renders identically whether it came from Claude, Gemini or ChatGPT.

```js
AtarRuntime.mount(container, data, host)
//   container : the DOM node to render into
//   data      : a kg / assessment / collection object — see data-contract.md
//   host      : { complete?: (prompt) => Promise<string> }
```

`host` is a **capability check, never a platform check**. Where the host supplies a `complete` function the AI-query panel runs live; where it does not, the same panel falls back to copy-to-chat. The runtime never asks which platform it is on.

## What is here

| | |
|---|---|
| `src/` | The source. `mount.js` dispatches on type; `renderers/` holds the three renderers; `shared/` holds normalisation, right-to-left detection, the colour table, the map, and the AI-query panel; `styles/` holds the CSS |
| `build.mjs` | The esbuild driver: concatenates the CSS, inlines it into the bundle so a shell needs one `<script>`, and refuses to finish if `AbortController` reaches the output — it cannot cross the artifact sandbox boundary, so timeouts use `Promise.race` |
| `shells/claude-shell.jsx` | The React shell a Claude artifact emits, with the runtime URL pinned to a version |
| `data-contract.md` | The `DATA` shape for each of the three types, and the aliases that let the ChatGPT and Claude key sets both work |
| `package.json` | Published to npm as `atar-runtime`, MIT |

`dist/` is a build product and is not tracked. `npm run build` regenerates it.

## Running it

```sh
npm install     # esbuild, the only dependency
npm run build   # → dist/atar-runtime.umd.js + dist/atar-runtime.css
```

Artifacts do not load this directory. They load the published package from a CDN at a **pinned** version — never `@latest`, because the CDN caches aggressively and an artifact that silently changes renderer is worse than one that fails. To release: bump `version` in `package.json`, publish, then update the pinned URL in `shells/claude-shell.jsx` and in the shells inside the specification files.

## Licence

MIT, as published on npm — not the Apache-2.0 that covers the rest of `system/`. See [`../../LICENSING.md`](../../LICENSING.md).
