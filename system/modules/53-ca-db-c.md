## [CA-DB-C] Collection Dashboard — MA-RC Integration

> **Scope**: Collection-level visualization (multiple sites from MA-RC analysis). For single-assessment dashboards (one site, one CBSA process), see [CA-DB] above. Both share the UX foundation ([CA-DB-F]) but have different data shapes, tab structures, and visual palettes. Collection: Inter + stone/amber palette.
>
> **Cross-platform reference**: Visual tokens follow `[CA-UX]`, entity colors follow `[CA-EC]`, AI Query follows `[CA-AIQ]`. See `artifact-ux-contract.md` for the cross-platform source of truth.

### 1. Trigger and Offer

- Offer after at least one MA-RC Step 3 analysis: "Would you like a visual dashboard for this collection?"
- Also generate on direct request ("dashboard", "collection dashboard", "visualize").
- Execute only on acceptance — do not auto-generate.
- Respond **only** with the artifact (no surrounding prose).
- **Format**: the **`atar-runtime` shell** (§3) — a thin React artifact that loads the runtime and passes `DATA` (`type: 'collection'`); the runtime renders all tabs + the map. Per [CA-DB-F]. Do not write inline chart/map/tab code.

### 2. Data Projection

Re-read the approved MA-RC Step 2 extraction output and any approved Step 3 analyses, then project them into per-site JSON records. This changes representation only. The dashboard layer does not extract a new finding, classify a field, infer an absence, or compose a new collection insight.

| Step 2 field | Dashboard field(s) | Notes |
|---|---|---|
| Name | `name` | Short display name |
| Location | `location`, `region`, `lat`, `lng`, `coordinateSource` | Copy approved location fields and coordinates; use null when coordinates were not resolved upstream |
| Type | `type`, `mappedTypeCategory` | Preserve the exact source/output term; optional mapping only if already approved or explicitly requested |
| Period | `period`, `mappedPeriodCategory` | Preserve the exact source/output term; optional mapping only if already approved or explicitly requested |
| Site description | `description` | 1–2 sentences |
| Significance summary | `significanceSummary`, `highlight` | Copy the approved significance summary. `highlight` is optional and may only reuse an approved site-level collection insight; do not write one in the dashboard layer |
| Values identified | `values: { [exactValueLabel]: "e"/"i"/"a"/"u" }` | Dynamic open vocabulary from the approved outputs. `e` = explicit; `i` = upstream classified as implied; `a` = upstream explicitly found absent; `u` = not stated/unknown. Never turn silence into `a` |
| Integrity / Authenticity | `integrity`, `integrityNote`, `mappedIntegrityLevel` | Preserve the approved wording; an optional normalized level appears only if already produced/requested |
| Threats | `threats[]` | Exact approved threat labels/IDs; optional mappings remain separate |
| Assessment method | `method`, `mappedMethodType` | Preserve the approved method name; optional mapping only if already produced/requested |
| Comparative references | `comparativeBasis`, `mappedClaimScope` | Preserve the approved comparison and scope wording; optional mapping only if already produced/requested |

Also project from the approved Collection Reading and Step 3 analyses, when present:
- `significancePremises[]` — copy approved premises and their original labels; do not assign premises in the dashboard layer.
- `managementClusters[]` — copy approved grouping labels and membership from a completed analysis.
- `themes[]` — optional. Copy approved theme objects and memberships: `{ id, label, description, sites: [siteId], evidence: { siteId: "text" } }`. Do not generate a minimum theme or group sites while preparing `DATA`.
- `tabs[]` — copy approved MA-RC Step 3 results into a display shape. Schema: `{ id, label, icon, type, data }`. Supported types: table, cards, matrix, prose, custom.
- `collectionSummary` — reuse the approved Collection Reading or Step 3 summary; never synthesize a new narrative, pattern, gap, distinctive, or `highlight` for dashboard completeness.

**Open-value projection (critical):** Build the Values matrix from the mechanical union of the exact value labels in the approved per-site records. An uncatalogued value receives its own row/column; if it occurs for only one site, the display preserves that distinctiveness rather than absorbing it into a nearby category. For all other sites use `u` unless the upstream analysis explicitly established `i` or `a`. A normalized comparison to [CA-V], OUV, or another framework is a separate, explicitly requested view that displays the original term alongside the mapping.

**Location data is upstream:** copy only supplied or previously resolved and approved coordinates. If the user wants a map and coordinates are missing, perform location resolution as a separate conversational evidence step before generating the dashboard. Do not look up or infer coordinates while assembling `DATA`.

**Runtime compatibility:** `atar-runtime` and `data-contract.md` must accept dynamic value labels, `u` (not stated/unknown), optional `highlight`, and optional `themes`. If the installed runtime still requires eight fixed value categories, only `e/i/a`, a generated highlight, or a mandatory theme, update that runtime/contract; never remap or invent findings to satisfy the older schema.

### 3. Artifact — `atar-runtime` shell

Emit exactly the React shell below, replacing **only** `DATA` with the projected, already-approved collection findings (`type: 'collection'`). The shell loads `atar-runtime` and calls `mount`. The runtime renders every tab and visual from `DATA`; assembling `DATA` is a faithful format conversion, not a new extraction or analysis step (§2). **Do not write any React / charts / map / tab code.**

```jsx
import { useEffect, useRef, useState } from 'react';

const RUNTIME_URL = 'https://cdn.jsdelivr.net/npm/atar-runtime@0.3.8/dist/atar-runtime.umd.js';

// ↓↓↓ Replace DATA with the projected approved collection findings. Schema: §2 + atar-runtime/data-contract.md (type:'collection'). ↓↓↓
const DATA = {
  type: 'collection',
  collection: { name: '', source: '', depth: '', date: '', itemCount: 0 },
  sites: [],     // per-site objects per §2; values use exact dynamic labels with e/i/a/u; highlight is optional
  themes: [],    // optional; approved upstream themes only
  collectionSummary: { narrative: '', patterns: [], gaps: [], distinctives: [] },
  tabs: []       // dynamic MA-RC Step-3 analyses (Arguments/Gaps/Cross-Tabs/Clusters) — see §4
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
    <div style={{ height: '82vh', minHeight: 560 }}>
      <div ref={ref} style={{ height: '100%' }} />
      {status === 'load-error' && (
        <div style={{ padding: 16, font: '14px system-ui' }}>
          <p style={{ color: '#b45309', fontWeight: 700 }}>Collection runtime unavailable — {DATA.sites.length} sites.</p>
          <ul>{DATA.sites.map((s, i) => <li key={i}>{s.name}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
```

The `load-error` branch is the only render code left in-prompt. Full field shapes + aliases: `atar-runtime/data-contract.md` (`type:'collection'`).

### 4. Tabs the runtime renders (what DATA powers each)

Fixed tabs from `DATA`: **Overview** (mechanical KPIs and distributions of already-approved fields + the approved `collectionSummary`) · **Map** (approved site coordinates only; Leaflet+OSM with a zero-network vector fallback) · **Values** (sites × exact, dynamically discovered value labels; `e`/`i`/`a`/`u` status) · **[Themes]** (shown only when approved `themes[]` are present). Then approved dynamic `tabs[]`, then a live **AI Query** tab (runtime-owned). All site names across tabs are clickable — use exact `site.name`/`site.id` so links resolve.

Dynamic `tabs[]` (MA-RC Step-3 analysis results) — types `table` (Arguments), `matrix` (Gaps traffic-light), `custom` (Cross-Tabs), `cards` (Management Clusters), `prose`.

### 5. Final Checklist
1. **Output**: the §3 shell only (only `DATA` replaced); no surrounding prose; `RUNTIME_URL` pinned `@0.3.8`.
2. **Data**: per §2 + the open-vocabulary projection contract (`type:'collection'`). Every exact and uncatalogued value is preserved. `themes[]` and `highlight` remain empty/omitted unless approved upstream. Values use `e`/`i`/`a`/`u`, and missing mention is `u`, not `a`.
3. **Language/RTL**: fields follow Language Policy; the runtime auto-detects Hebrew → RTL.
4. **Location**: project approved coordinates and provenance only. Missing coordinates remain an explicit gap until resolved upstream.

**Dataset Export (offer)**: after generating, offer the projected collection data as structured JSON (collection metadata + per-site objects + original/open-vocabulary labels + any optional mappings stored separately).

