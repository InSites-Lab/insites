## [CA-DB] Assessment Dashboard — CBSA Integration

> **Scope**: This dashboard spec is for **single-assessment** visualization (one site, one CBSA process). For collection-level dashboards (multiple sites), see [CA-DB-C] below. Both share the same UX foundation ([CA-DB-F]) but have different data shapes, tab structures, and visual palettes. Single-assessment: DM Sans + blue accent (#2563eb). Collection: Inter + stone/amber.

Generate an interactive Assessment Dashboard after Stage 6, when the user explicitly requests it ("dashboard", "summary dashboard", "create dashboard").

⚠ Apply Language Policy to all dashboard text.

### 1. Trigger and Offer

- **Mandatory offer**: At the end of Stage 6, always present: "Would you like me to generate an interactive Assessment Dashboard that visualizes the complete CBSA process?"
- **Execute only on acceptance** — do not auto-generate.
- Respond **only** with the artifact (no surrounding prose).
- **Format**: the **`atar-runtime` shell** (§4) — a thin React artifact that loads the runtime and passes `DATA` (`type: 'assessment'`); the runtime renders all tabs + the map. Per [CA-DB-F]. Do not write inline chart/map/tab code.

### 2. Data Projection

Re-read all approved stage outputs from the conversation and project them into `DATA`. This step changes format only; it does not add analysis, normalize terminology, or derive new findings.

| Section | Source | Approved data to project |
| --- | --- | --- |
| Asset Identity | Stage 0 | Name, location, type, period, brief description (~20 words) |
| Data Quality | Stage 0 | Sources uploaded, identified gaps (list) |
| Timeline | Stage 1 | Approved dated events with year and label; include change type only when Stage 1 already classified it |
| Contexts | Stage 1 | Each context: exact type/label and description; include **related value IDs/names** and **timespan** only when already stated upstream |
| Values | Stage 2 | Each value: exact site-specific name/meaning, evidence strength, 1-line approved summary; optional taxonomy mapping only if Stage 2/user supplied it |
| Attribute Table | Stage 2.1 | Each row: attribute name, exact associated value names/IDs, site-specific significance, **implication for significance** |
| Authenticity | Stage 3 | Nara Grid as **structured objects**: aspect, attribute description, value expression, integrity rating (high/medium/low-medium/low). Plus summary sentence. |
| Comparative | Stage 4 | Each comparator: name, period, architect (if known), distinction narrative, criteria ratings (rarity, documentation, condition). Plus overall summary. |
| Significance | Stage 5 | Full statement text |
| Vulnerability | Approved Stage 2–3/MA-RA output only | Display a value × Nara-aspect matrix only if that matrix or equivalent impact judgments were already produced and approved; otherwise leave empty |
| Process Quality | Stage 6 | Quick boosts (list), next steps (list), strengths count, gaps count |
| Knowledge Graph | [CA-KG] | If KG was generated: full nodes and edges JSON. If not: null. |
| Location Coordinates | Approved upstream location step | Lat/lng and provenance for the asset and each comparator, or null when not resolved upstream |
| Thematic Clusters | Approved stage/MA-RA output only | Copy existing named clusters and their member IDs; do not create clusters in the dashboard layer |

**Rule**: Only include data and relationships that actually appeared in an approved conversation output. Do not fabricate, infer, cluster, normalize, or reinterpret while creating the dashboard. If a stage or analytical field was skipped, leave it empty or show "Not completed" with a visual indicator.

### 3. Data Schema (strict)

```json
{
  "asset": { "name": "", "location": "", "type": "", "period": "", "description": "", "coordinates": { "lat": null, "lng": null }, "coordinateSource": "explicit|inferred|unknown" },
  "dataQuality": { "sources": ["filename.pdf"], "gaps": ["missing X"] },
  "timeline": [
    { "year": "1923–1924", "yearStart": 1923, "label": "...", "changeType": null }
  ],
  "contexts": [
    { "id": "ctx_1", "type": "Exact approved context type", "label": "...", "relatedValues": ["v_1"], "timespan": "1915–1960s" }
  ],
  "values": [
    { "id": "v_1", "name": "Exact site-specific value name", "mappedCategory": null, "evidence": "sourced", "summary": "..." }
  ],
  "attributeTable": [
    { "attribute": "...", "values": ["v_1"], "significance": "...", "implication": "..." }
  ],
  "authenticity": {
    "grid": [
      { "aspect": "Form & Design", "description": "...", "valueExpression": "Exact approved value meaning", "rating": "medium" }
    ],
    "summary": "..."
  },
  "comparative": {
    "summary": "...",
    "comparators": [
      { "name": "...", "period": "...", "architect": "...", "distinction": "...", "criteria": { "rarity": "high", "documentation": "moderate", "condition": "unknown" }, "coordinates": { "lat": null, "lng": null } }
    ]
  },
  "significance": { "statement": "..." },
  "vulnerability": [
    { "value": "v_1", "form": 3, "material": 3, "use": 2, "setting": 2 }
  ],
  "processQuality": { "strengths": 3, "gaps": 6, "quickBoosts": ["..."], "nextSteps": ["..."] },
  "stagesCompleted": [0,1,2,3,4,5,6],
  "kg": null,
  "themes": {
    "valueThemes": [{ "id": "", "label": "", "description": "", "valueIds": [], "color": "" }],
    "contextThemes": [{ "id": "", "label": "", "description": "", "contextIds": [], "color": "" }],
    "threatThemes": [{ "id": "", "label": "", "description": "", "vulnerabilities": [], "color": "" }]
  },
  "tabs": [
    { "id": "evidence", "label": "Evidence Weight", "icon": "⚖️", "type": "cards", "data": { "cards": [] } }
  ]
}
```

**Schema rules**:
- `authenticity.grid` must be **structured objects** — never flatten the Nara Grid to strings.
- `comparative.comparators` must be **per-site objects** with criteria — never a flat name list.
- `timeline[].changeType` is optional. Copy it only when Stage 1 already classified the event; otherwise use null and a neutral display token. The dashboard must not classify the event.
- `values[].name` is the exact approved value name, including unique or uncatalogued values. `mappedCategory` is optional and may contain [CA-V] or another vocabulary only when that mapping already exists upstream or was explicitly requested.
- `contexts[].relatedValues` contains exact value IDs/names only when the upstream output explicitly linked them. The dashboard must not generate those links.
- `vulnerability` displays approved upstream impact judgments only. The dashboard must not derive them by cross-reading stages. When upstream data exists, levels remain: 3 = high, 2 = medium, 1 = low.
- **Location data is upstream, not dashboard inference**: project coordinates and their provenance only when they were already supplied or resolved and approved in the conversation/stage output. If a map is requested but coordinates are missing, resolve the location as a separate upstream evidence step before generating the dashboard; do not perform the lookup or silently choose an approximate point while assembling `DATA`.
- `asset.coordinates`: Copy the approved coordinates and `coordinateSource` (`explicit`, `inferred`, or `unknown`); otherwise use null/`unknown` and record the gap.
- `comparative.comparators[].coordinates`: Apply the same projection rule per comparator without claiming greater precision than the approved evidence.
- `themes`: Copy only themes already identified in approved stage or MA-RA outputs, preserving their labels, descriptions, and member IDs. Otherwise leave all theme arrays empty.
- `tabs`: Optional dynamic tabs for MA-RA reading results. If MA-RA readings (Evidence Weight, Stakeholder Lens, Context-Effect Audit, etc.) were performed during the session, include each as a tab entry. Supported types: `table` (columns + rows), `cards` (title/body/level/badges), `matrix` (rowLabels + colLabels + cells 0-3), `prose` (sections with title + body), `custom` (raw HTML). Dynamic tabs render after Significance.
- In all text fields and `tabs[]` data, use exact entity names (asset name, comparator names) to enable cross-tab navigation.

### 4. Artifact — `atar-runtime` shell

Emit exactly the React shell below as the artifact, replacing **only** `DATA` with the projected, already-approved assessment findings (`type: 'assessment'`). The shell loads the shared **`atar-runtime`** package and calls `mount(container, DATA, host)`. The runtime renders every tab and visual from `DATA`; assembling `DATA` is a faithful format conversion, not a new extraction or analysis step (§2/§3). **Do not write any React / recharts / d3 / Leaflet / tab / map code.**

```jsx
import { useEffect, useRef, useState } from 'react';

const RUNTIME_URL = 'https://cdn.jsdelivr.net/npm/atar-runtime@0.3.8/dist/atar-runtime.umd.js';

// ↓↓↓ Replace DATA with the projected approved assessment findings. Schema: §3 + atar-runtime/data-contract.md (type:'assessment'). ↓↓↓
const DATA = {
  type: 'assessment',
  asset: { name: '', location: '', type: '', period: '', description: '', coordinates: { lat: null, lng: null }, coordinateSource: 'unknown' },
  dataQuality: { sources: [], gaps: [] },
  timeline: [], contexts: [], values: [], attributeTable: [],
  authenticity: { grid: [], summary: '' },
  comparative: { summary: '', comparators: [] },
  significance: { statement: '' },
  vulnerability: [], processQuality: { strengths: 0, gaps: 0, quickBoosts: [], nextSteps: [] },
  themes: { valueThemes: [], contextThemes: [], threatThemes: [] },
  tabs: []   // dynamic tabs: Report (always), Debrief/Session (conditional), MA-RA readings — see §5
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
          <p style={{ color: '#b45309', fontWeight: 700 }}>Dashboard runtime unavailable.</p>
          <p><b>{DATA.asset.name}</b> — {DATA.values.length} values, {DATA.contexts.length} contexts.</p>
        </div>
      )}
    </div>
  );
}
```

The `load-error` branch is the only render code left in-prompt (never-blank fallback). Full field shapes + GPT/Claude key aliases: `atar-runtime/data-contract.md` (`type:'assessment'`).

### 5. Tabs the runtime renders (what DATA powers each)

Fixed tabs, rendered automatically from `DATA` in this order: **Overview** (mechanical KPIs from approved fields + `asset.description` + `dataQuality` + `processQuality`) · **Map** (approved `asset.coordinates` + comparator coordinates; the runtime draws Leaflet+OSM with a zero-network SVG vector fallback) · **Timeline** (`timeline[]`, colour-coded only when approved `changeType` exists; neutral otherwise) · **Contexts & Values** (`contexts[]` + `values[]` + `attributeTable[]`, with cross-highlight only for approved links) · **[Themes]** (shown only when approved `themes.{value,context,threat}Themes` exist) · **Integrity** (`authenticity.grid` cards + approved `vulnerability` matrix when present) · **Comparative** (`comparative.comparators[]`) · **Significance** (`significance`). Then approved dynamic `tabs[]`, then a live **AI Query** tab (runtime-owned: `window.claude.complete` + copy-to-chat fallback).

**Report / Debrief / Session Analysis → dynamic `tabs[]` of type `prose`** (the runtime renders `{ sections:[{title, body}] }`, `**bold**` supported), emitted in this order after Significance:
- **Report** (always): `{ id:'report', label:'Report', icon:'📄', type:'prose', data:{ sections:[ {title:'📋 Assessment Overview', body}, {title:'💎 Key Values', body}, {title:'🏛️ Integrity Snapshot', body}, {title:'✨ Significance Statement', body}, {title:'📐 Process & Methodology', body}, …up to 2 approved sections from {Context Effects, Priority Insights, Comparative Position}, then optional {Session Analytics}, {User Reflections} ] } }`. Compile and lightly compress approved outputs only; introduce no new claim, category, theme, or relationship. Target 800–1200 words; end with a section: "📥 Ask in chat to export this as a formatted Word/PDF document."
- **Debrief** (only if the post-Stage-6 Debrief was completed): `{ id:'debrief', label:'Debrief', icon:'💬', type:'prose', data:{ sections:[ {title:question, body:userResponse} ×3 ] } }`.
- **Session Analysis** (only if opted in per [CA-IP]): `{ id:'session', label:'Session Analysis', icon:'📊', type:'prose', data:{ sections:[ Interaction Map, Self-Reflection, Session Signature ] } }`.

Other MA-RA reading results also go in `tabs[]` (types `table`/`cards`/`matrix`/`prose`/`custom`). Use exact entity names (asset, comparators) in tab data so the runtime's cross-tab links resolve.

### 6. Final Checklist
1. **Output**: the §4 shell only (only `DATA` replaced); no surrounding prose; `RUNTIME_URL` pinned `@0.3.8`.
2. **Data**: matches §3 — structured `authenticity.grid` and per-comparator objects; unique value names are preserved. `changeType`, `relatedValues`, `vulnerability`, and `themes` appear only when already approved upstream. Only real conversation data; omit skipped analysis.
3. **Tabs**: Themes only when an upstream analysis produced them; Report always present as a faithful compilation; Debrief/Session only when they occurred.
4. **Coordinates**: project approved coordinates and provenance only; unresolved coordinates remain null with a specific gap until an upstream location step resolves them.
5. **Language/RTL**: fields follow Language Policy; the runtime auto-detects Hebrew → RTL.

**Export Offer (mandatory)**: after generating the dashboard, offer — "Would you like me to export this assessment as a formatted Word document?"

---

