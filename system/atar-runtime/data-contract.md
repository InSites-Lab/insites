# atar-runtime — data contract

The bot emits a single `DATA` object with a `type` discriminator. `mount(container, DATA, host)` renders it. Canonical field names = the Claude mono spec; `normalize()` also accepts the GPT abbreviated keys (back-compat), so either shape works.

```
type: 'kg' | 'assessment' | 'collection'
```

If `type` is omitted, it is inferred (`nodes`+`edges`→kg, `sites`→collection, else assessment). Missing fields render empty — never throw.

---

## type: 'kg' (Knowledge Graph) — implemented in 0.1.0

```jsonc
{
  "type": "kg",
  "title": "string",                 // graph title
  "nodes": [
    {
      "id": "string",                 // unique
      "name": "string",               // display label
      "type": "string",               // [CA-EC] canonical English token (e.g. 'Asset', 'Place', 'Cultural Value')
      "meaning": "string",            // 5–12 words, the entity's heritage role
      "value_type": "string",         // optional — a [CA-V] value label
      "epistemic": "sourced | inferred | interpretive",   // default 'sourced'
      "epistemic_note": "string",     // ≤15 words, shown when epistemic != sourced
      "meta": { "key": "value" }      // optional extra fields shown in the Info tab
    }
  ],
  "edges": [
    { "source": "id", "target": "id", "label": "relationship_verb" }
  ]
}
```

- **Edge keys:** canonical `source`/`target`; the runtime also accepts vis-network's `from`/`to`.
- **Entity `type`:** use the 15 canonical English tokens (auto-translated to Hebrew display labels when the graph is Hebrew). Unknown types get a dynamic colour.
- **Sizing (automatic):** Asset → 16, Cultural Value / has `value_type` → 11, others → 9.
- **Epistemic** markers (💭 interpretive / 〰️ inferred) appear in the Info tab + an Analytics "entities to review" list — never on the node glyph.
- **Budget:** target 10–15 nodes (≤20), ≤25 edges, orphan-free.

### KG back-compat aliases
| canonical | also accepted |
|-----------|---------------|
| `edges[].source` / `edges[].target` | `from` / `to` |
| `title` | `name` |

---

## type: 'assessment' (single-site Assessment Dashboard) — implemented in 0.2.0

8 fixed tabs (Overview · Map · Timeline · Contexts&Values · [Themes] · Integrity · Comparative · Significance) + any `tabs[]` dynamic tabs + a live **AI Query** tab (always last). Themes hides when fewer than 2 themes total.

```jsonc
{
  "type": "assessment",
  "asset": { "name": "string", "location": "string", "type": "string", "period": "string",
             "description": "string", "coordinates": { "lat": 0, "lng": 0 }, "coordinateSource": "string" },
  "coordinates": { "lat": 0, "lng": 0 },          // map marker; falls back to asset.coordinates
  "dataQuality": { "sources": ["string"], "gaps": ["string"] },
  "timeline":  [ { "year": "1923", "yearStart": 1923, "label": "string", "changeType": "structure|use|setting|infrastructure" } ],
  "contexts":  [ { "id": "string", "type": "historical|spatial|social|political|economic|technological|environmental|cultural|religious", "label": "string", "timespan": "string", "relatedValues": ["string"] } ],
  "values":    [ { "id": "string", "name": "string", "category": "string", "evidence": "sourced|inferred|uncertain", "summary": "string" } ],
  "attrTable": [ { "attribute": "string", "values": ["string"], "significance": "string", "implication": "string" } ],
  "authenticity": { "summary": "string", "grid": [ { "aspect": "string", "description": "string", "valueExpression": "string", "rating": "high|medium|low|low-medium" } ] },
  "vulnerability": [ { "value": "string", "form": 0, "material": 0, "use": 0, "setting": 0 } ],   // 0–3 each
  "comparative": { "summary": "string", "sites": [ { "name": "string", "period": "string", "architect": "string", "distinction": "string",
                    "criteria": { "rarity": "high|moderate|low|unknown", "documentation": "...", "condition": "..." }, "coordinates": { "lat": 0, "lng": 0 } } ] },
  "significance": "string",                        // or { "statement": "string" }
  "themes": { "valueThemes": [...], "contextThemes": [...], "threatThemes": [...] },
  "processQuality": { "quickBoosts": ["string"], "nextSteps": ["string"] },
  "tabs": [ { "id": "string", "label": "string", "icon": "📄", "type": "table|cards|matrix|prose|custom", "data": {} } ]
}
```

## type: 'collection' (multi-site Collection Dashboard) — implemented in 0.2.0

4 fixed tabs (Overview · Map · Values · [Themes]) + `tabs[]` dynamic + live **AI Query** (last). Map markers are depth-coloured (rich/medium/thin) with a depth filter; clicking a site name anywhere zooms its marker.

```jsonc
{
  "type": "collection",
  "collection": { "name": "string", "source": "string", "depth": "string", "date": "string", "itemCount": 0 },
  "sites": [ {
    "id": "string", "name": "string", "region": "string", "lat": 0, "lng": 0,
    "depth": "rich|medium|thin", "type": "string", "typeCategory": "string", "period": "string", "periodCategory": "string",
    "description": "string", "significanceSummary": "string", "highlight": "string",
    "values": { "Historical": "e|i|a", "Scientific": "e|i|a" },   // e=explicit, i=implied, a=absent
    "valueSpecs": { "Historical": "string" }, "integrity": "string", "integrityNote": "string",
    "threats": ["string"], "comparativeBasis": "string", "claimScope": "local|regional|national|international"
  } ],
  "themes": [ { "id": "string", "label": "string", "description": "string", "sites": ["siteId"], "evidence": { "siteId": "string" } } ],
  "collectionSummary": { "narrative": "string", "patterns": ["string"], "gaps": ["string"], "distinctives": ["string"] },
  "tabs": [ { "id": "string", "label": "string", "icon": "📄", "type": "table|cards|matrix|prose|custom", "data": {} } ]
}
```

### Assessment / Collection back-compat aliases (GPT abbreviated ↔ Claude full)
`normalize()` accepts BOTH key sets, so either shape works:

| canonical (Claude) | also accepted (GPT) |
|--------------------|---------------------|
| `timeline[].yearStart` / `.changeType` | `ys` / `ct` |
| `contexts[].relatedValues` / `.timespan` | `rv` / `ts` |
| `values[].category` / `.evidence` | `cat` / `ev` |
| `attrTable[]` `.attribute/.values/.significance/.implication` | `attr/vals/sig/impl` · `attributeTable` |
| `authenticity.grid` / `.summary` | `nara` / `naraSummary` |
| `authenticity.grid[].description` / `.valueExpression` | `desc` / `ve` |
| `comparative.sites` / `…[].criteria` / `.architect` / `.distinction` | `comparators` / `crit` / `arch` / `dist` |
| `vulnerability` | `vuln` |
| `processQuality.quickBoosts` / `.nextSteps` | `pq.boosts` / `pq.next` |
| `significance` (string) | `significance.statement` (object) |

- **Map:** Leaflet loads from cdnjs (no iframe), OSM tiles; on Leaflet/tile failure a zero-network SVG vector map renders instead. Sites/comparators with `lat`/`lng` = `null` are skipped; if none have coordinates the Map tab shows a placeholder.
- **Dynamic tabs (`tabs[]`):** `type` = `table` (`{columns, rows}`) · `cards` (`{cards:[{title,subtitle,body,level,badges}]}`) · `matrix` (`{rowLabels,colLabels,cells}`) · `prose` (`{sections:[{title,body}]}`, `**bold**` supported) · `custom` (`{html}`). Cells matching an asset/site name auto-link to its tab/marker. Dynamic tabs render after the fixed tabs, before AI Query, in array order.
- **Assessment Report / Debrief / Session-Analysis convention** (single-assessment only): these are NOT fixed tabs — emit them as dynamic `tabs[]` of `type:'prose'`, in this order, with these ids/icons so the mono and runtime agree:
  - `{ id:'report', label:'Report', icon:'📄', type:'prose', data:{ sections:[…] } }` — **always**; sections: Assessment Overview · Key Values · Integrity Snapshot · Significance Statement · Process & Methodology · (≤2 of: Context Effects / Priority Insights / Comparative Position) · optional Session Analytics / User Reflections · a final "📥 Ask in chat to export…" note.
  - `{ id:'debrief', label:'Debrief', icon:'💬', type:'prose' }` — only if the post-Stage-6 Debrief was completed (3 question/response sections).
  - `{ id:'session', label:'Session Analysis', icon:'📊', type:'prose' }` — only if opted in (Interaction Map · Self-Reflection · Session Signature).

---

## host

```
host = { complete?: (prompt: string) => Promise<string> }
```

On Claude the shell passes `window.claude.complete` → the AI-Query tab runs live. With no `complete`, it falls back to copy-to-chat. The runtime never calls `AbortController` (DataCloneError); timeouts use `Promise.race`.
