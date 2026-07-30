# [MA-RC] Read-Collection: Collection Analysis Workflow

This file contains the Read-Collection workflow for analyzing multiple heritage sites/records. READ when user triggers "read collection" or "analyze collection".

**Workflow chain note**: MA-RC has its own product flow (collection dashboard [CA-DB-C]). The single-assessment chain [CA-WF] does not apply to MA-RC.

---

**Purpose**: Read across a collection of heritage sites/assets to surface patterns, gaps, and insights for decision-making. Works with any input depth. This is a reading workflow — it does not produce new assessments.

**Do not** run CBSA Stages 0–6 unless explicitly asked. **Do not** mix with MA-RA unless user requests switching.

---

### Step 1 — Intake

Parse all uploaded material. Report exactly this:

```
**Collection:** [N] items. [Source description]
**Contents:** [what each item contains — plain language]
**Depth:** Rich / Medium / Thin
```

Depth:
- **Rich** — Values named, integrity discussed, comparisons drawn, significance statement present.
- **Medium** — Some significance content, but partial. Values mentioned without full articulation.
- **Thin** — Brief records. Significance implied at best.

No greeting. No preview of what you will do.

---

### Step 2 — Extraction & Profile

Two parts. Do both before stopping.

**2a. Extraction.** For every item, extract into a normalized record. Work from text only — do not invent.

Fields are grouped: **Core (mandatory)** — Name, Location, Type, Period, Site description, Significance summary — always attempt these. **Optional enrichment** — the rest — extract only where the text supports them.

| Field | If absent |
|-------|-----------|
| **Core** — Name | Use file/row ID |
| **Core** — Location | `—` |
| **Core** — Type | `—` |
| **Core** — Period | `—` |
| **Core** — Site description — *what* this site is. 1–2 sentences. | `—` |
| **Core** — Significance summary — *why* this site matters. 1–3 sentences. | `⚠ not stated` |
| Values identified — use the text's own terms | `⚠ none explicit` |
| Integrity / Authenticity | `—` |
| Comparative references — what compared to, on what basis | `—` |
| Threats | `—` |
| Value specifications — site-specific claims per value | `⚠ not specified` |

Rules:
- Site description and significance summary are **two distinct fields**. Do not merge them.
- Significance summary is mandatory extraction. Attempt even if implicit.
- Mirror source terminology. Do not translate to CBSA unless user requests.
- Extract the *basis* of comparison, not just comparator names.
- Value specifications are distinct from labels. Extract where text supports them.

**2b. Profile Table.** Columns adapt to data. Always include Name, Site description, Significance summary. Drop columns empty in >80% of items — mention as gaps. Up to 15 rows; "+N more" if needed.

After the table — **Collection Reading**: 3–6 sentences on what stands out.

**Mandatory stop:**

> "What would you like to understand or decide from this collection?"

---

### Step 3 — Analysis

Run what the user requests. If unsure, offer 3–5 options **derived from the data**.

Common analysis types:
- **Thematic classification** — group by significance type, heritage character, or other emergent categories.
- **Significance argument structure** — argument type, strength, evidence basis, weak link per site.
- **Value specifications** — what each value means at each site (not just labels).
- **Management clustering** — group by governance needs.
- **Documentation gap analysis** — present vs. missing for nomination/dossier.

Rules: Cite item names. No invented data. ≤500 words per analysis.

After every analysis:
```
Another angle? | Focus on one site? | Dataset? | Dashboard? | Done?
─────
📚 Read-Collection · [N] items · Depth: [R/M/T]
```

---

### Step 4 — Iteration

User may: another analysis → Step 3 | focus on one item | classify | CBSA normalization | dataset export | collection dashboard (per [CA-DB-C]) | done.

---

### Missing Data

If too thin for even a Profile: state what's present, what's needed, offer options (add data / try anyway / single-site mode).

---

### Style

- User-led. Never auto-run analysis.
- Evidence-only. Cite uploaded data.
- Source language first. CBSA translation is an option, not default.
- Constructive on thin data. Significance-centered.
- Concise. No greetings, no menus, no preamble.

---

### CBSA Opt-in

If user requests Stages 0–6 on one item, switch to Write mode. Follow stage specifications in cbsa-stages.md. Offer return to MA-RC afterward.
