# kg-spec.md — CA-KG Knowledge Graph (GPT · atar-runtime build)

> **atar-runtime build — the canonical GPT KG spec.** Renders through the shared **`atar-runtime`** package (vanilla **D3**, loaded from `cdn.jsdelivr.net/npm`) — the SAME runtime Claude and Gemini use. (The legacy alephplace `vis-network` build is archived.)

## Purpose

Create a CA-KG Knowledge Graph as a thin HTML shell that loads `atar-runtime` and calls `mount(container, DATA, host)`. The runtime owns ALL rendering: D3 force layout, 3-tab sidebar, legend, search/filter, zoom/drag, epistemic display, RTL. Entity colours follow `[CA-EC]`; AI Query uses copy-to-chat placeholder mode on GPT.

## Hard Contract

This specification is a required implementation contract, not guidance.

Required:
- Emit the exact HTML shell below (one `<div id="root">` + the runtime UMD + a `DATA` object + a `mount` call).
- Load the runtime UMD from the pinned jsDelivr URL: `atar-runtime@0.3.4`.
- Pass a single `DATA` object with `type: "kg"` to `window.AtarRuntime.mount(container, DATA, {})`.

Forbidden:
- Any custom rendering engine (no vis-network, D3, Chart.js, React, SVG, inline toolbar/sidebar/filter/search/physics).
- Embedding entity colours, node sizing, or sidebar logic.
- Separate CSS files or `<style>` rendering rules — the runtime injects its own styles and fonts.

If exact execution is blocked because the runtime/CDN/shell cannot be used, state the blocker and stop. If the ONLY blocker is Canvas/`canmore` availability, do not stop — emit the same shell as a `/mnt/data` file (see Fallback). Do not substitute another implementation.

## Trigger

Execute only on explicit Knowledge Graph requests ("kg", "knowledge graph", "create kg"). Respond **only** with the artifact (no surrounding prose).

**Canvas tool**: emit the shell via `canmore.create_textdoc` (`type:"code/html"`) when Canvas/`canmore` is exposed.
**Canvas unavailable fallback**: if `canmore`/Canvas is not exposed (e.g. GPT-5.5 Thinking/Instant, which dropped Canvas) or the call fails, deliver the **identical** shell as `/mnt/data/{asset-name}-knowledge-graph.html`, labelled `HTML shell fallback — Canvas unavailable`. A downloaded file runs the runtime fine (the empty-container caveat applies only to the inline preview). Never a custom UI.
**Download/export copy**: when Canvas is available, offer it only on explicit request, after the Canvas exists; when Canvas is unavailable, the downloadable shell IS the primary output.

## CBSA Data Extraction → DATA

1. Re-read stage outputs (contexts, timeline, values, comparisons).
2. List candidate nodes (target 10–15, maximum 20) in this priority order:
   - **Value-bearing entities** central to Stage 2
   - **Key places/structures** and **major events**
   - **Context anchors** (geographic, social, political)
   - **Social actors** (individuals, groups, communities)
   - **Up to 3 Cultural Value nodes**
3. Capture relationship verbs that show CBSA logic (`located_in`, `expresses_value`, `part_of`, `commemorates`, `influenced_by`, `supports`, etc.).
4. Drop weak/duplicate nodes; avoid orphans (every node connects at least once).
5. Assign each node a `type` from the [CA-EC] tokens (closest match). A new type is allowed only when a node genuinely falls outside all categories — name it clearly (the runtime gives it a fallback colour) and mark the node `interpretive` (💭).
6. Set each node's `epistemic` per the Per-Claim Epistemic Gate (cbsa-stages.md): explicit → `sourced`; connected from 2+ pieces → `inferred` (〰️); contestable / proposed beyond sources → `interpretive` (💭). Non-sourced nodes carry an `epistemic_note` (≤15 words).

## DATA schema (`type: "kg"`)

⚠ Apply Language Policy to all KG fields.

```json
{
  "type": "kg",
  "title": "Asset Name",
  "nodes": [
    {
      "id": "unique_id",
      "name": "Display Name",
      "type": "Entity Type",
      "meaning": "5-12 words describing its heritage role",
      "value_type": "Optional value label from [CA-V]",
      "epistemic": "sourced | inferred | interpretive (default: sourced)",
      "epistemic_note": "Required when epistemic is not sourced: <=15-word rationale"
    }
  ],
  "edges": [
    { "source": "source_id", "target": "target_id", "label": "relationship_verb" }
  ]
}
```

**Rules**:
- Edges: canonical `source`/`target`; the runtime also accepts vis-network's `from`/`to`.
- `type`: English [CA-EC] token (the runtime maps colour + Hebrew display label automatically). Do NOT set `color` per node.
- Sizing automatic: Asset 16 · Cultural Value / has `value_type` 11 · others 9.
- Budget: 10–15 nodes (≤20), ≤25 edges, ≤3 Cultural Value, orphan-free.
- Epistemic markers (💭/〰️) appear in the Info tab + the Analytics "entities to review" list — never on the node glyph.

## HTML shell (atar-runtime)

Generate exactly this; replace only `{LANG}`, `{DIR}`, `{TITLE}`, and the `DATA` content:

```html
<!DOCTYPE html>
<html lang="{LANG}" dir="{DIR}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{TITLE} — Knowledge Graph</title>
</head>
<body>
  <div id="root" style="height:100vh"></div>
  <script src="https://cdn.jsdelivr.net/npm/atar-runtime@0.3.4/dist/atar-runtime.umd.js"></script>
  <script>
    var DATA = {
      type: "kg",
      title: "{TITLE}",
      nodes: [
        /* bot fills extracted nodes here */
      ],
      edges: [
        /* bot fills extracted edges here: { source, target, label } */
      ]
    };
    (function () {
      function go() { window.AtarRuntime.mount(document.getElementById("root"), DATA, {}); }
      if (window.AtarRuntime) go(); else window.addEventListener("load", go);
    })();
  </script>
</body>
</html>
```

Only `DATA` belongs inline. The runtime injects its own styles and fonts. `host` is `{}` on GPT (no `window.claude.complete`) → the AI Query tab shows starter prompts + copy-to-chat.

### Fallback delivery
- Canvas exposed → `canmore.create_textdoc(type: "code/html")`
- Canvas not exposed → `/mnt/data/{asset-name}-knowledge-graph.html`

Same shell either way; only the delivery medium differs.

## Entity types [CA-EC]

Use these English tokens for `type` (the runtime maps colours + Hebrew labels; unknown types get a dynamic fallback colour). Do NOT embed hex colours:

Asset · Place · Structure / Building · Architectural Element · Person · Event · Story / Narrative · Cultural Value · Natural Phenomenon · Artwork / Artefact · Tradition / Custom · Social Group · Historical Period · Religion / Belief · Collective Memory.

## Runtime-provided UX (do NOT implement)

D3 force graph (curved arcs + arrowheads), pan/zoom/drag, click-to-select with non-neighbour dimming, 3-tab sidebar (**Info** · **Analytics** incl. a "💭 entities to review" list · **AI Query** placeholder), legend (present types only), search + type filters, RTL auto-detected from content. Full field shapes: `atar-runtime` data-contract (`type:'kg'`).

## After KG

Offer to highlight one context-effect edge pair. If accepted: 2 sentences max — Context→Asset, Asset→Context. No theory preamble.

**Review interpretive entities (HITL)**: when the graph has any `interpretive` (💭) entities, follow it with a ≤2-sentence offer — "This graph has N interpretive (💭) entities (see '💭 Entities to review' in the Analytics tab). Want to confirm, rename, reject, or cite-and-promote any?" On reply, rename/remove or promote to `sourced` when evidence is cited, then offer to regenerate. Skip when N = 0.

## Compliance Check

- [ ] Output is the thin shell only: one `<div id="root">` + the UMD script + `DATA` + the `mount` call.
- [ ] Runtime loaded from `cdn.jsdelivr.net/npm/atar-runtime@0.3.4`; `mount(root, DATA, {})` called.
- [ ] `DATA.type === "kg"`; every node has `id`, `name`, `type` (English [CA-EC] token), `meaning`; edges use `source`/`target` + lowercase verb.
- [ ] No vis-network / D3 / React / SVG / inline UI / per-node colour / sizing / CSS.
- [ ] Counts: 10–15 nodes (≤20), ≤25 edges, ≤3 Cultural Value; no orphans.
- [ ] Every node has `epistemic` (default `sourced`); non-sourced nodes carry an `epistemic_note` (≤15 words).
- [ ] `lang`/`dir` match the user's language; Canvas if exposed, else `/mnt/data` shell.
- [ ] Output: artifact only; no surrounding explanation.

If any item fails, revise before returning output.
