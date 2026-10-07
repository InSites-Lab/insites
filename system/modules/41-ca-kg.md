## [CA-KG] Knowledge Graph — CBSA Integration

Generate an interactive Knowledge Graph artifact when the user explicitly requests a Knowledge Graph ("kg", "knowledge graph", "create kg").

> **Cross-platform reference**: Visual tokens follow `[CA-UX]`, entity colors follow `[CA-EC]`, AI Query follows `[CA-AIQ]`. See `artifact-ux-contract.md` for the cross-platform source of truth.
>
> **Platform note (Claude — externalized runtime)**: The KG renders via the shared **`atar-runtime`** package (vanilla D3, loaded from npm/jsdelivr) — **not** inline component code. You emit a thin React **shell** (§4) that loads the runtime and passes a `DATA` object; the runtime owns all force layout, sidebar tabs, epistemic display, legend, search/filter, zoom/drag, RTL, and the **live** AI Query via `window.claude.complete`. Do **not** generate d3/SVG/force code yourself.

### 1. Trigger and Artifact Enforcement

- Execute this appendix only on explicit Knowledge Graph requests.
- Respond **only** with the artifact (no surrounding prose).
- The artifact is the **shell in §4** (loads `atar-runtime`, passes `DATA` + `host`). The AI Query tab is **live** via `window.claude.complete` (no API key), with graceful copy-to-chat fallback — both handled by the runtime.
- KG rendering follows the **mandatory exclusive-shell rule** in [CA-DB-F]: never hand-write d3/SVG/force code — emit the shell even if the runtime fails (its `load-error` branch handles it); a failed load is a finding, not a reason to substitute your own renderer.

### 2. CBSA Data Projection → DATA

1. Re-read the approved stage outputs (contexts, timeline, values, comparisons). Project only findings already present there; do not conduct a new analytical pass while building the graph.
2. List candidate nodes (target 10–15, maximum 20) in this priority order:
   - **Value-bearing entities** central to Stage 2 (the things that carry identified values)
   - **Key places/structures** and **major events** (the central heritage subject and temporal anchors)
   - **Context anchors** (geographic, social, political entities that shape significance)
   - **Social actors** (individuals, groups, communities relevant to the asset)
   - **Cultural Value nodes required to represent the approved findings**, preserving exact site-specific or uncatalogued value names. Never silently drop a unique value to satisfy the target count; if the graph would exceed 20 nodes, ask whether to generate an expanded graph or a user-approved focused view.
3. Capture only relationships already stated in approved outputs, using concise verbs (`located_in`, `expresses_value`, `part_of`, `commemorates`, `influenced_by`, `supports`, etc.). Do not infer a new edge during graph generation.
4. Drop duplicate nodes only. Prefer connected nodes, but never invent an edge or drop an approved uncatalogued value merely to avoid an orphan or because it lacks a [CA-V] mapping.
5. Assign each node a `type` from the [CA-EC] entity categories. Default to the closest existing category. A new type may be introduced only when a node genuinely falls outside all 15 categories and forcing a match would misrepresent its heritage role — in that case, name the new type clearly and add it to the colour map.
6. **Preserve epistemic status (mandatory)** — Copy each node/claim's approved epistemic status from the upstream output. Do not reclassify it in the graph layer. For `inferred`/`interpretive` nodes, copy or compress the existing rationale into `epistemic_note` (≤15 words). If no upstream status exists, use `unlabeled`; do not decide the status inside the visualization layer.

### 3. DATA Schema (strict)

⚠ Apply Language Policy to all KG fields.

```json
{
  "nodes": [
    {
      "id": "unique_id",
      "name": "Display Name",
      "type": "Entity Type",
      "meaning": "Optional concise approved description of its heritage role",
      "value_label": "Optional exact value name from the approved output",
      "mapped_value_category": "Optional [CA-V] or other taxonomy mapping only when upstream/requested",
      "epistemic": "sourced | inferred | interpretive | unlabeled",
      "epistemic_note": "Optional copied upstream rationale: <=15 words"
    }
  ],
  "edges": [
    { "source": "source_id", "target": "target_id", "label": "relationship_verb" }
  ]
}
```

**Rules**:
- `type` must use English tokens from [CA-EC] for colour mapping (the renderer automatically translates to display labels when needed).
- `meaning` is an optional concise copy or light compression of an approved, site-specific description. Do not compose a new heritage role in the graph layer. Follow the Language Policy.
- Optional `value_label` preserves the exact source/site-specific value name, including uncatalogued values. `mapped_value_category` is separate and appears only when a mapping was already approved or explicitly requested.
- Edges use lowercase verbs; keep total edges ≤ 25.
- `epistemic` copies the model's claim-level self-assessment already produced upstream: `sourced`, `inferred` (〰️), or `interpretive` (💭). If the upstream claim was not assessed, use `unlabeled`; never convert a missing label to `sourced`. Copy an existing `epistemic_note` for non-sourced claims when available. Surface it in the Info tab and review list only — never on the node glyph.

Place the projected graph in the shell's `DATA` object (`type: 'kg'`) — see §4 and `atar-runtime/data-contract.md`. RTL is auto-detected from Hebrew content by the runtime (no manual `dir` needed).

### 4. Artifact — `atar-runtime` shell

Emit exactly the React shell below as the artifact, replacing **only** `DATA` with the projected, already-approved graph findings (`type: 'kg'`). The shell loads the shared **`atar-runtime`** package (vanilla D3) from npm/jsdelivr and calls `mount(container, DATA, host)`. The runtime owns everything visual — force layout (node tiers Asset 16 / Cultural-Value 11 / other 9; link distance 140, charge −350; curved arcs + arrowheads), the Info/Analytics/AI-Query sidebar tabs, the epistemic 💭/〰️ display (Info panel + the Analytics "entities to review" list only — **never** on the node glyph), the entity-type legend, search + type filters, zoom/drag, RTL auto-detection, the **live** AI Query via `window.claude.complete`, and the copy-to-chat fallback. **Do not generate any d3/SVG/force code yourself** — only the shell + `DATA`.

```jsx
import { useEffect, useRef, useState } from 'react';

// Pinned runtime version — never change to @latest (published versions are immutable).
const RUNTIME_URL = 'https://cdn.jsdelivr.net/npm/atar-runtime@0.3.7/dist/atar-runtime.umd.js';

// ↓↓↓ Replace DATA with the projected approved graph findings. Schema: §3 + atar-runtime/data-contract.md (type:'kg'). ↓↓↓
const DATA = {
  type: 'kg',
  title: 'Knowledge Graph',
  nodes: [
    { id: 'asset', name: 'Heritage Asset', type: 'Asset', meaning: 'The primary subject' }
    // … 10–15 nodes (≤20); set epistemic + epistemic_note on non-sourced nodes per §2/§3 …
  ],
  edges: [
    // { source: 'a', target: 'b', label: 'relationship_verb' }   (lowercase verbs, ≤25)
  ]
};

export default function App() {
  const ref = useRef(null);
  const [status, setStatus] = useState('loading');
  useEffect(() => {
    function go() {
      const live = typeof window !== 'undefined' && window.claude && typeof window.claude.complete === 'function';
      const host = live ? { complete: window.claude.complete.bind(window.claude) } : {};
      try { window.AtarRuntime.mount(ref.current, DATA, host); setStatus('ok'); }
      catch (e) { setStatus('error'); }
    }
    if (window.AtarRuntime) { go(); return; }
    const s = document.createElement('script');
    s.src = RUNTIME_URL; s.onload = go; s.onerror = () => setStatus('load-error');
    document.head.appendChild(s);
  }, []);
  return (
    <div style={{ height: '82vh', minHeight: 540 }}>
      <div ref={ref} style={{ height: '100%' }} />
      {status === 'load-error' && (
        <div style={{ padding: 16, font: '14px system-ui' }}>
          <p style={{ color: '#b45309', fontWeight: 700 }}>Graph runtime unavailable — node / edge list:</p>
          <ul>{DATA.nodes.map((n, i) => <li key={i}>{n.name} <i style={{ color: '#64748b' }}>({n.type})</i></li>)}</ul>
        </div>
      )}
    </div>
  );
}
```

The shell's `load-error` branch is the only render code that stays in-prompt — a never-blank fallback. Full field shapes + the GPT/Claude key aliases live in `atar-runtime/data-contract.md` (`type:'kg'`).

### 5. Final Checklist

1. **Counts**: target 10–15 nodes (≤20) and ≤25 edges. Preserve every approved distinct value; if that exceeds the display target, ask for an expanded graph or a user-approved focus. Do not invent edges to eliminate orphans.
2. **Fields**: every node has `id`, `name`, and `type` (English [CA-EC] display token); `meaning` is optional approved text. Value nodes preserve exact `value_label`; any controlled-vocabulary mapping is separate and optional. Edges use `source`/`target` + a lowercase verb copied from approved findings.
3. **Epistemic**: every node copies its upstream status or uses `unlabeled`; missing status never defaults to `sourced`. Copy a non-sourced `epistemic_note` when it exists upstream. Per §2 / §3.
4. **Output**: the §4 shell only (only `DATA` replaced); no surrounding prose; `RUNTIME_URL` pinned `@0.3.7`.
5. **Language / RTL**: all fields follow Language Policy; the runtime auto-detects Hebrew → RTL (no manual `dir`).

---

**After KG**: Offer to highlight one supported context-effect relation. If accepted: 2 sentences max; describe only the direction or directions present in the approved graph. A single direction is complete. No theory preamble.

**Review interpretive entities (HITL)**: When the graph contains any `interpretive` (💭) entities, follow the artifact with a ≤2-sentence offer — "This graph has N interpretive (💭) entities: readings beyond your sources (see '💭 Entities to review' in the Analytics tab). Want to confirm, rename, reject, or cite-and-promote any?" On the user's reply, rename or remove the entity, or promote it to `sourced` when evidence is cited, then offer to regenerate the KG. Skip this offer when N = 0.

---

