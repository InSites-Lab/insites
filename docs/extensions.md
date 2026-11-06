# Extensions

[`architecture.md`](architecture.md) describes the seven stages of an InSites assessment. Around them the specification offers four extensions, tools that support the assessment, present it and analyse it for the different needs of heritage practice: a knowledge graph, an analytic dashboard, a reading of a single completed assessment, and a reading of a collection. An optional image-analysis aid (module `28-ca-img.md`) sits alongside them. This document describes each of the four, so that papers about the system can point here.

## What the extensions share

- **They are invoked by name or on offer.** The user calls an extension after an assessment or alongside it; none of them runs in the stage sequence, and none writes a new stage output.
- **They never change a mark.** Each claim keeps the mark it received upstream (none, 〰️ inferred, 💭 interpretive); a claim that was never assessed stays unlabelled. See [`epistemic-notation.md`](epistemic-notation.md).
- **They draw only on the assessment and its sources.** What an extension adds is the model's reading of the approved assessment, and it stays open to the user's review.
- **Each is a mini-agent written into the specification**, with its own brief, output and stopping point. The module, and the plugin skill built from it, are named below.

The extensions do two kinds of work. The **graph and the dashboards** represent an assessment: the model builds them from the approved outputs, and once built they are instruments of analysis, with structural analytics, filters and a query tab. The **readings** analyse an assessment or a collection in prose, under the same core rules, so that what they add carries its own marks.
- **Rendering is code, reasoning is not.** The graph and the dashboards are emitted as a thin shell that loads [`atar-runtime`](../system/atar-runtime/) and passes it a data object ([`data-contract.md`](../system/atar-runtime/data-contract.md)); the runtime draws the layout, the tabs, the map and the epistemic display. Visual language and query behaviour are fixed in [`artifact-ux-contract.md`](../system/artifact-ux-contract.md).

## Knowledge graph

Module `41-ca-kg.md`; skill `knowledge-graph`.

**Purpose.** The graph represents an assessment as a network of meanings. The model extracts it from the approved stages: it chooses and names the places, structures, events, actors, contexts and values as entities, and the relations between them as edges, introducing nothing the assessment does not contain. What the prose of the stages spreads across several outputs becomes one structure that can be read: which contexts frame the significance of the place, which entities carry which values, and, where an approved stage states it, a context-effect relation as a labelled edge; the current schema has no dedicated relation type for it.

**Use in practice.** The graph is meant to be examined and questioned. An analytics tab summarises its structure; a query tab puts questions to the model and instructs it to answer from the graph's data, such as which values cluster together, which entity connects the most others, how a path runs from the asset to a value, or what the graph is missing. The query is answered inside the artifact where the host allows it, otherwise through the conversation. Because the value-bearing entities and the contexts they depend on are explicit, the graph is designed to support decisions that follow from an assessment: planning, and which entities beyond the asset itself, such as a spring, a path or a setting, belong within the scope of conservation.

**Rules.**
- A target of 10 to 15 entities (at most 20) and at most 25 edges. Every approved value is kept, including site-specific values outside the controlled vocabulary; if that exceeds 20, the user chooses an expanded graph or a focused view.
- No edge is inferred at the graph layer, including to connect an isolated entity.
- Epistemic status appears in the information panel and in a list of entities to review, and never on the node itself.
- After the graph, the specification offers to describe one context-effect relation the graph supports. When the graph contains interpretive entities, it invites the user to confirm, rename or reject each of them, or to cite a source and promote it to sourced, and regenerates the graph on request. The decision stays with the user.

## Analytic dashboard

Modules `42-ca-db-f.md` (shared rules) and `43-ca-db.md`; skill `dashboard`.

**Purpose.** An interactive digital report of a single assessment: the approved outputs of every stage, from the documentation review to the statement of significance, gathered into one view that can be navigated by part.

**Contents.** Tabs that follow the InSites stages, with a map; a report tab that sets out the assessment as a structured document; and a query tab, last, that instructs the model to answer from the dashboard's data. A knowledge graph produced in the same session is carried into the dashboard rather than rebuilt.

**Rules.** The dashboard is offered at the end of Stage 6 and produced only when the user accepts. Its data is a projection of the approved stage outputs: nothing is added, normalised or reinterpreted, and a matrix or cluster appears only if an approved stage already produced it.

## Reading an assessment

Module `51-ma-ra.md`; skill `read-assessment`.

**Purpose.** Reads a completed assessment, whether produced in the session, uploaded or pasted, and offers ways of examining it. It writes no new stages. It is also referred to as Alternative Reading.

**Profile.** It first reports how fully the assessment covers the elements of CBSA (description, timeline, contexts, values, authenticity and integrity, comparison, statement), the character of the assessment as a profile rather than a grade, and the sources it draws on.

**Readings.** The user then chooses from an open menu:
- **Analytical readings** test the assessment against its evidence: source fidelity (whether the assessment used its sources at the depth they offer), a context-effect audit (which direction of each context relationship the evidence supports, and its planning implication), evidence weight, gaps and strengths, a timeline, and the knowledge graph.
- **Interpretive readings** apply a lens, a perspective or a question, such as how different decision-makers would read the assessment.
- **Generative readings** retell the significance from other cultural or temporal perspectives, read the place as a system of signs, or translate the assessment for public interpretation and community engagement.
- **The user's own reading**, on any angle the user proposes.

**Why it is there.** Values-based practice asks that significance be considered from more than one perspective. The readings let an expert examine an assessment from perspectives it may not itself contain. A lens leaves the evidence as it is and changes what is noticed in it. The voices it produces are the model's rendering of other perspectives and are to be read as such: a community's own voice enters an assessment through the sources it supplies and through holding the review checkpoint itself.

## Reading a collection

Modules `52-ma-rc.md` and `53-ca-db-c.md`; skill `read-collection`.

**Purpose.** Reads across a collection (a spreadsheet, a document or several files describing at least two sites or assessments, at any depth of documentation) to surface patterns, gaps and insights for decisions. It produces no new assessments.

**Steps.** Intake, with the depth of documentation (rich, medium or thin); extraction of a normalised record per item; a profile of the collection; then analyses the user chooses, such as thematic classification, the structure of significance arguments, value specifications, management clusters and documentation gaps. Where the collection is tabular and the host can run code, counts are computed rather than estimated, and are reported as occurrence counts, never as scores or rankings. A collection dashboard (overview, a map with markers by depth of documentation, values, themes and a query tab) is offered after at least one analysis.
