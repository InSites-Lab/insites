---
name: dashboard
description: Builds the InSites single-assessment dashboard as a thin artifact shell that loads the pinned atar-runtime and passes a DATA object projected from the approved Stage 0–6 outputs only. Use when the user says "dashboard", "summary dashboard", "create dashboard", "דשבורד" after Stage 6 of an InSites assessment, or accepts the dashboard offer made at the end of Stage 6.
---

# InSites — assessment dashboard (Claude plugin edition)

Run this under the InSites core rules (`insites:assess`). For the collection dashboard, use `insites:read-collection` instead. If a knowledge graph was generated in this session, copy its nodes and edges into `kg`; do not rebuild the graph here.

| Part | Read |
| --- | --- |
| [CA-DB-F] shared rules: projection fidelity, mandatory exclusive shell | `references/dashboard-foundation.md` — before assembling DATA |
| Heavy-turn pre-flight, Resume Capsule | `references/continuity.md` |
| Global Notation Key (for `evidence` fields) | `references/notation.md` |
| [CA-HE] Hebrew Output Overlay | `references/hebrew-overlay.md` — when the output language is Hebrew |

