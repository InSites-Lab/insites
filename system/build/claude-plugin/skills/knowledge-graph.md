---
name: knowledge-graph
description: Builds the InSites knowledge graph of a heritage assessment as a thin artifact shell that loads the pinned atar-runtime and passes a DATA object projected from approved findings only. Use when the user says "kg", "knowledge graph", "create kg", "גרף ידע", after Stage 5 of an InSites assessment or within a read-assessment session.
---

# InSites — knowledge graph (Claude plugin edition)

Run this under the InSites core rules (`insites:assess`). If that skill has not been loaded in this conversation — for example, a graph of a pasted assessment — read `references/notation.md` first, because the graph copies epistemic status and never decides it.

Parts named below that are held in this skill's references:

| Part | Read |
| --- | --- |
| [CA-EC] Entity Categories | `references/entity-categories.md` — before choosing node types |
| [CA-DB-F] mandatory exclusive-shell rule, projection fidelity | `references/dashboard-foundation.md` — before emitting the artifact |
| Heavy-turn pre-flight, Resume Capsule | `references/continuity.md` |
| [CA-HE] Hebrew Output Overlay | `references/hebrew-overlay.md` — when the output language is Hebrew |

