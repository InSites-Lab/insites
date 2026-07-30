# [CA-DB] Assessment Dashboard (GPT · atar-runtime build)

> **atar-runtime build — the canonical GPT dashboard spec.** Renders through the shared **`atar-runtime`** package (vanilla JS + D3 / Leaflet, loaded from `cdn.jsdelivr.net/npm`) — the SAME runtime Claude and Gemini use. The bot's only job is **data extraction**; the runtime owns all tabs, the map, charts, cross-referencing, RTL, and AI Query. (The legacy alephplace `dashboard-runtime` build is archived.)

---

## 1. Trigger and Offer

- **Mandatory offer** at end of Stage 6: "Would you like me to generate an interactive Assessment Dashboard that visualizes the complete CBSA process?"
- Execute only on acceptance — do not auto-generate.
- Respond **only** with the artifact — no surrounding prose.
- **Canvas tool**: emit the shell via `canmore.create_textdoc` (`type:"code/html"`) when Canvas/`canmore` is exposed.
- **Canvas unavailable fallback**: if `canmore`/Canvas is not exposed (e.g. GPT-5.5 Thinking/Instant, which dropped Canvas) or the call fails, deliver the **identical** shell as `/mnt/data/{asset-name}-cbsa-dashboard.html`, labelled `HTML shell fallback — Canvas unavailable`. A downloaded file runs the runtime fine (empty-container caveat = inline preview only). Never a custom UI.
- **Download/export copy**: when Canvas is available, offer it only on explicit request, after the Canvas exists; when Canvas is unavailable, the downloadable shell IS the primary output.

## 2. HTML shell (atar-runtime)

The bot outputs a thin shell that loads `atar-runtime` and calls `mount(container, DATA, {})` with `DATA.type = "assessment"`. The runtime injects its own styles/fonts and loads Leaflet itself — do NOT add Leaflet, a CSS file, or any `<style>`/render code.

```html
<!DOCTYPE html>
<html lang="{LANG}" dir="{DIR}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{ASSET_NAME} — CBSA Dashboard</title>
</head>
<body>
  <div id="root" style="height:100vh"></div>
  <script src="https://cdn.jsdelivr.net/npm/atar-runtime@0.3.4/dist/atar-runtime.umd.js"></script>
  <script>
    var DATA = {
      type: "assessment"
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

**Rules**:
- Set `{LANG}`/`{DIR}` to `he`/`rtl` or `en`/`ltr` by content language; the runtime also auto-detects Hebrew → RTL.
- `DATA` must be valid inline JS — no `fetch()`.
- Add no inline CSS/JS beyond the `DATA` assignment + the `mount` call.

### Fallback delivery
- Canvas exposed → `canmore.create_textdoc(type:"code/html")`
- Canvas not exposed → `/mnt/data/{asset-name}-cbsa-dashboard.html`

Same shell either way; only the delivery medium differs.

## 3. Data Extraction

Re-read all stage outputs and extract:

| Section | Source | Data to extract |
| --- | --- | --- |
| Asset Identity | Stage 0 | Name, location, type, period, brief description (~20 words), coordinates |
| Data Quality | Stage 0 | Sources uploaded, identified gaps |
| Timeline | Stage 1 | 5–10 dated events with year, label, changeType (use/structure/setting/infrastructure) |
| Contexts | Stage 1 | Each: type, label, relatedValues, timespan |
| Values | Stage 2 | Each: name, category ([CA-V]), evidence (sourced/inferred/uncertain), summary |
| Attribute Table | Stage 2.1 | Each: attribute, values, significance, implication |
| Authenticity | Stage 3 | Nara Grid as structured objects (aspect, description, valueExpression, rating) + summary |
| Comparative | Stage 4 | Each comparator: name, period, architect, distinction, criteria + summary |
| Significance | Stage 5 | Full statement text |
| Vulnerability | Stages 2+3 | Each value × Nara aspect → impact 3/2/1 |
| Process Quality | Stage 6 | quickBoosts, nextSteps, strengths, gaps |
| Location | Stage 0 + context | Lat/lng for asset + comparators (explicit / inferred / null) |
| Themes | Stages 1–3 | Group values/contexts/threats by narrative thread (≥2 members) |

## 4. Data Schema (`type: "assessment"`)

The runtime's `normalize()` accepts BOTH these canonical keys and the GPT abbreviated keys — this schema works as-is.

```jsonc
{
  "type": "assessment",
  "asset": { "name": "", "location": "", "type": "", "period": "", "description": "",
             "coordinates": { "lat": null, "lng": null }, "coordinateSource": "explicit|inferred|unknown" },
  "dataQuality": { "sources": ["filename.pdf"], "gaps": ["missing X"] },
  "timeline": [ { "year": "1923–1924", "yearStart": 1923, "label": "...", "changeType": "structure" } ],
  "contexts": [ { "id": "ctx_hist", "type": "historical", "label": "...", "relatedValues": ["Historical"], "timespan": "1915–1960s" } ],
  "values": [ { "id": "v_hist", "name": "...", "category": "Historical", "evidence": "sourced", "summary": "..." } ],
  "attrTable": [ { "attribute": "...", "values": ["Social"], "significance": "...", "implication": "..." } ],
  "authenticity": { "grid": [ { "aspect": "Form & Design", "description": "...", "valueExpression": "Historical", "rating": "high|medium|low|low-medium" } ], "summary": "..." },
  "comparative": { "summary": "...", "sites": [ { "name": "...", "period": "...", "architect": "...", "distinction": "...", "criteria": { "rarity": "high", "documentation": "moderate", "condition": "unknown" }, "coordinates": { "lat": null, "lng": null } } ] },
  "significance": "full statement text",
  "vulnerability": [ { "value": "Historical", "form": 3, "material": 3, "use": 2, "setting": 2 } ],
  "processQuality": { "quickBoosts": ["..."], "nextSteps": ["..."] },
  "themes": { "valueThemes": [], "contextThemes": [], "threatThemes": [] },
  "tabs": []
}
```

Key aliases (either works): `attrTable`↔`attributeTable` · `comparative.sites`↔`comparators` · `significance` string ↔ `{statement}`.

## 5. Tabs the runtime renders

Fixed (auto, in order): **Overview · Map · Timeline · Contexts & Values · [Themes] · Integrity · Comparative · Significance**, then your dynamic `tabs[]`, then a live **AI Query** tab (on GPT `host={}` → copy-to-chat). Themes hides when fewer than 2 themes total.

**Dynamic `tabs[]`** — types: `table` (`{columns, rows}`) · `cards` (`{cards:[{title,subtitle,body,level,badges}]}`) · `matrix` (`{rowLabels,colLabels,cells}` 0–3) · `prose` (`{sections:[{title,body}]}`, `**bold**` supported) · `custom` (`{html}`). Cells matching an asset/comparator name auto-link.

**Report / Debrief / Session-Analysis → `prose` tabs** (emit in this order after Significance, with these ids/icons):
- `{ id:"report", label:"Report", icon:"📄", type:"prose", data:{ sections:[…] } }` — **always**; target 800–1200 words; end with a "📥 Ask in chat to export…" section.
- `{ id:"debrief", label:"Debrief", icon:"💬", type:"prose" }` — only if the post-Stage-6 Debrief was completed (3 Q/A sections).
- `{ id:"session", label:"Session Analysis", icon:"📊", type:"prose" }` — only if opted in (Interaction Map · Self-Reflection · Session Signature).

## 6. Data Quality Rules

1. Only data that appeared in the conversation — never fabricate; skipped stage → `null` + record in `dataQuality.gaps`.
2. `authenticity.grid` = structured objects (never flatten to strings).
3. `comparative.sites` = per-site objects with criteria (never a flat name list).
4. `timeline[].changeType` mandatory; `contexts[].relatedValues` links each context to value categories.
5. Coordinates: explicit / inferred / `null` + `coordinateSource`.
6. `vulnerability`: 3 = severe, 2 = moderate, 1 = minor.
7. `themes`: ≥2 members each; populate only if ≥3 values OR ≥3 contexts.
8. In `tabs[]` use exact asset/comparator names so cross-links resolve.

## 7. Post-Dashboard Offers

> "Would you like me to: 1. **Export** as a formatted Word document? 2. **Read-Assessment** — analyze from different angles? You can do both, one, or neither. After that → Session Debrief."

Use **Code Interpreter** for DOCX export. After Debrief + [CA-IP] Session Report, offer to append them as `prose` tabs (ids `debrief`/`session`) and regenerate.

## 8. Compliance Check

- [ ] Output is the thin shell only (one `<div id="root">` + UMD script + `DATA` + `mount`).
- [ ] Runtime from `cdn.jsdelivr.net/npm/atar-runtime@0.3.4`; `mount(root, DATA, {})`; `DATA.type === "assessment"`.
- [ ] No Leaflet/CSS/`<style>`/render code in the shell (runtime loads them).
- [ ] Structured `authenticity.grid`, per-site `comparative.sites`, `timeline[].changeType`, `contexts[].relatedValues`, `vulnerability`.
- [ ] Themes only when ≥2 total; Report prose tab always present; Debrief/Session only when they occurred.
- [ ] Only real conversation data; `lang`/`dir` match language; Canvas if exposed else `/mnt/data` shell.

**Export Offer (mandatory)**: after generating, offer — "Would you like me to export this assessment as a formatted Word document?"
