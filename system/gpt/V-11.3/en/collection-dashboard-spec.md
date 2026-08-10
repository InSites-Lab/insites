# [CA-DB-C] Collection Dashboard (GPT · atar-runtime build)

> **atar-runtime build — the canonical GPT collection-dashboard spec.** Renders through the shared **`atar-runtime`** package (vanilla JS + D3 / Leaflet, from `cdn.jsdelivr.net/npm`) — the SAME runtime Claude and Gemini use. The bot only extracts data; the runtime owns all tabs, the map, RTL, and AI Query. (The legacy alephplace `collection-dashboard-runtime` build is archived.)

## 1. Trigger

- After MA-RC Step 3 analysis: "Would you like a visual dashboard for this collection?"
- On direct request: "dashboard", "collection dashboard", "visualize".
- Execute only on acceptance. Respond **only** with the artifact.

## 2. HTML shell (atar-runtime)

Thin shell that loads `atar-runtime` and calls `mount(container, DATA, {})` with `DATA.type = "collection"`. The runtime injects its own styles and loads Leaflet itself — do NOT add Leaflet, a CSS file, or any render code.

```html
<!DOCTYPE html>
<html lang="{LANG}" dir="{DIR}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{COLLECTION_NAME} — Collection Dashboard</title>
</head>
<body>
  <div id="root" style="height:100vh"></div>
  <script src="https://cdn.jsdelivr.net/npm/atar-runtime@0.3.7/dist/atar-runtime.umd.js"></script>
  <script>
    var DATA = {
      type: "collection",
      // ... extracted fields (see §4 Data Schema) ...
    };
    (function () {
      function go() { window.AtarRuntime.mount(document.getElementById("root"), DATA, {}); }
      if (window.AtarRuntime) go(); else window.addEventListener("load", go);
    })();
  </script>
</body>
</html>
```

**GPT delivery:** Follow **GPT-5.6 HTML delivery** in `instructions.md`; fallback filename: `{collection-name}-cbsa-collection-dashboard.html`.

Set `{LANG}`/`{DIR}` by content language. The `<title>` text follows the output language — translate "Collection Dashboard" when the output is not English. Do **not** set tab labels here; the runtime localizes them.

## 3. Data Extraction

Build per-site JSON from MA-RC Step 2 output. Only extracted data — nothing fabricated.

**Mandatory location resolution — before writing `DATA`:** For every site, use supplied coordinates first; otherwise a scoped web lookup is permitted solely to verify a user-supplied address or place anchor. When the exact address cannot be resolved but the locality or region is clear, use its approximate point. Leave `lat`/`lng` as `null` only when no place anchor can be recognized, and record the reason in `collectionSummary.gaps`. Sites at the same stated place receive the same point. **The Map tab must render whenever at least one site has an explicit or inferred point.**

## 4. Data Schema (`type: "collection"`)

```jsonc
{
  "type": "collection",
  "collection": { "name": "", "source": "", "depth": "", "date": "", "itemCount": 0 },
  "sites": [ {
    "id": "", "name": "", "region": "", "lat": null, "lng": null,
    "depth": "rich|medium|thin", "type": "", "typeCategory": "", "period": "", "periodCategory": "",
    "description": "", "significanceSummary": "",
    "highlight": "MANDATORY — one-sentence collection-level insight for this site",
    "values": { "Historical": "e|i|a", "Scientific": "e|i|a" },
    "valueSpecs": { "Historical": "what it means at this site" },
    "integrity": "", "integrityNote": "", "threats": [],
    "comparativeBasis": "", "claimScope": "local|regional|national|international"
  } ],
  "themes": [ { "id": "", "label": "", "description": "", "sites": ["siteId"], "evidence": { "siteId": "supporting text" } } ],
  "collectionSummary": { "narrative": "", "patterns": [], "gaps": [], "distinctives": [] },
  "tabs": []
}
```

`values`: `e` = explicit, `i` = implied, `a` = absent.

## 5. Tabs the runtime renders

Fixed (auto): **Overview · Map · Values · [Themes]**, then your dynamic `tabs[]`, then a live **AI Query** tab (on GPT `host={}` → copy-to-chat). Map markers are depth-coloured (rich/medium/thin) with a depth filter; clicking a site name anywhere zooms its marker.

**Dynamic `tabs[]`** (MA-RC Step-3 analyses) — types: `table` (`{columns, rows}`) · `cards` (`{cards:[{title,subtitle,body,level,badges}]}`) · `matrix` (`{rowLabels,colLabels,cells}` 0–3) · `prose` (`{sections:[{title,body}]}`) · `custom` (`{html}`). Use exact `site.name`/`id` so cross-links resolve.

## 6. Data Quality Rules

- Only extracted data — nothing fabricated.
- `themes[]` MANDATORY (≥1). Minimum: group sites by overlapping value patterns; include `evidence` per site.
- `site.highlight` MANDATORY and non-empty for every site.
- Every site has a valid `id`; `values` use `e`/`i`/`a` consistently.
- Coordinates: apply the mandatory location-resolution rule above. A recognized locality or region cannot stay `null`; an unresolved location requires a specific `collectionSummary.gaps` entry.

## 7. Compliance Check

- [ ] Output is one fenced `html` block containing the thin shell only (one `<div id="root">` + UMD script + valid inline `DATA` + `mount`).
- [ ] Runtime from `cdn.jsdelivr.net/npm/atar-runtime@0.3.7`; `mount(root, DATA, {})`; `DATA.type === "collection"`.
- [ ] Every site whose place anchor is recognized has `lat`/`lng`; the Map tab renders whenever at least one point exists.
- [ ] No Leaflet/CSS/`<style>`/render code in the shell (runtime loads them).
- [ ] `themes[]` non-empty; every site has non-empty `highlight` and a valid `id`; values use `e`/`i`/`a`.
- [ ] `lang`/`dir` match language; GPT delivery follows `instructions.md`; fallback filename is correct.

## 8. Post-Dashboard Follow-up

Do not append this to the artifact response. After the user confirms that Preview opened, or asks what to do next, offer: "Would you like the extracted collection data as a structured JSON file?"
