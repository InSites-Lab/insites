# Architecture

This document describes how [InSites](../README.md) is built and why. It exists so that papers about the system can point here instead of spending pages on mechanics. It is the first of the documents listed in [`README.md`](README.md).

## What the system is

An AI environment for cultural significance assessment, whose core is a natural-language specification that a general-purpose language model executes as a human-gated agentic workflow of seven stages. The published editions have no orchestration code and no framework: the specification is what carries out the assessment. The code around it, the runtime that renders the knowledge graph and the dashboards and the packaging and server of the ChatGPT plugin, performs none of it. The specification is authored rather than trained: it is text, and replacing the model does not replace the design.

**Each stage, and each optional extension, is specified as a mini-agent**: a bounded role with its own brief, its own output, and its own stopping point, written as a section of the specification rather than as a separate program. In a multi-agent system these roles would be separate agents; here the separation is expressed in the specification. The separation is what the design depends on, not the packaging, and that is the reason the architecture travels: the same roles can be run as separate agents, or as callable modules, without changing what the assessment does. Two components already work this way. In the Claude plugin, the `epistemic-auditor` agent checks a stage's marks against the sources in a clean context, on request. Vera, a private prototype, runs the unchanged specification in an agentic workflow in which agents audit every claim and the expert decides on each one.

## Seven stages in three groups

<p align="center"><img src="insites-workflow.png" alt="The CBSA stages in InSites. Stage 0, Data Review and Gaps. Stages 1 to 5, the CBSA analysis stages: Description and Contexts; Values Analysis; Authenticity and Integrity; Comparative Evaluation; Significance Statement. Stage 6, Quality Check and Summary. Expert review follows every stage. Each claim carries its source and an epistemic mark. Extensions: Knowledge Graph, Alternative Reading, Collection Analysis, Image Analysis. The figure also marks an independent agentic review of claims; among the published editions only the Claude plugin has one, on request, and a review of every claim is in development." width="620"></p>

**Figure.** The CBSA stages in *InSites*. Hollow circles are the gates on the data (Stage 0) and on quality (Stage 6); filled circles are the analysis stages. The double tick stands for two reviews of a stage: the expert's, and an independent agentic review of its claims. The expert's review follows every stage in every edition. Among the published editions, only the Claude plugin has an agentic review: the `epistemic-auditor` agent checks a stage's marks when the user asks. Vera, which reviews every claim, is a private prototype in development. The figure uses short labels for the stages; the specification gives their full names.

Governance is not only a layer running inside the analysis. It brackets the analysis at both ends.

**Entry governance — Stage 0, Preliminary Review and Data Gaps.** Produces a data-quality summary, a category checklist, a documentation profile, and a list of gaps. The record it produces is consumed by the later stages. The expert judges whether the documentation base is adequate before any reasoning begins.

**CBSA reasoning — Stages 1 to 5.**

| Stage | Output | What the expert decides at the checkpoint |
|---|---|---|
| 1 Description and Contexts | Site description, timeline, marked and cited contexts, planning implications | Which contexts belong, and supplies any missed |
| 2 Values Analysis | Marked and cited value set; attribute–value–significance–implication table | Weighs the values against one another and against the evidence |
| 3 Authenticity and Integrity | Nara Grid table, integrity condition | Audits the heritage concepts, and confirms what rests on first-hand knowledge |
| 4 Comparison | Comparison set against stated criteria, summary | Sets the comparative frame, and may widen it beyond the sources |
| 5 Significance Statement | Significance statement, open questions | Extends the synthesis and authors the final statement |

**Exit governance — Stage 6, Quality Check and Summary.** Produces a process summary, a quick-improvement table, and planning implications. The expert settles the reliability constraint the finished assessment will carry.

**Extensions** are invoked by name rather than run in sequence: Knowledge Graph, Alternative Reading (reading a completed assessment), Collection Analysis (reading a collection of assessments) and Image Analysis. An assessment or a collection can also be rendered as a dashboard. Each is described in [`extensions.md`](extensions.md).

## Sequencing, and what enforces it

Nothing enforces it. The specification requires one stage per turn in fixed order and works as a state machine written in prose, but sequencing is a behaviour the specification asks for and not a constraint a runtime imposes. This matters for reading the system honestly: a rule written in the specification can be broken, and when it is, the expert is the mechanism that catches it.

The sequence is the user's to direct. By default the workflow stops after every stage; on explicit request it runs the stages without stopping, usually for technical testing rather than assessment, or runs a single stage on its own.

Each of Stages 1 to 6 opens with a brief on the previous stage's findings, closes with one reflection question, and pauses for review. The specification requires a question a specialist could answer in more than one way.

## Epistemic notation

Three tiers, applied by the model to its own output, marking each claim's distance from source evidence.

**No mark** — the claim is explicit in the sources, and is cited to the passage that states it.
**〰️** — synthesis: the claim connects two or more pieces of evidence.
**💭** — hypothesis: an interpretive reading beyond what the sources state.

Where the sources supply nothing, the system declares the gap and asks for material rather than inferring across it. Notation is the extension of that same principle to the case where the evidence is partial rather than absent.

### The marking gate

The gate is applied before a claim is written, not by auditing the text afterwards.

1. **Evidential**: *Can this claim be stated from a single source?* If yes, no mark. If it requires connecting evidence across sources, 〰️. If *a reasonable expert could read it differently*, 💭.
2. **Evidence against assertion**: *Is the claim itself in the source, or only the evidence supporting it?* Where the source supplies the evidence and the model supplies the evaluative move, the claim is marked.
3. **Ties resolve toward marking**: *better an unnecessary notation than an unmarked claim that appears factual.*

The third rule sets the direction of the system's failures. A well-supported claim flagged as uncertain is the error the design is built against; an interpretive move that goes unmarked, and then reads as established fact, is the error it stays open to. See [`epistemic-notation.md`](epistemic-notation.md).

**Notation is support for expert judgment and never an independent mechanism of reliability.** The mark reports the system's own reading of its distance from the sources, and that reading can be wrong.

## Human-in-the-loop governance

The workflow pauses after each stage, and the pause holds because the expert holds it. The brief and the reflection question position the expert to shape the assessment by adding, correcting, rejecting, and reframing, rather than to approve finished output.

Each intervention is tagged from a fixed vocabulary of six actions — `+add`, `−reject`, `~revise`, `↔replace`, `?question`, `!correct` — and the tags accumulate into a session report that closes the run as an audit trail of who changed what.

## The vocabularies of values and contexts, and what lies beyond them

The specification carries two reference vocabularies. Where a stage names a value it can draw on fourteen types, listed with the specification and adapted per domain: historical, aesthetic, social, technological, symbolic, landscape, scientific, documentary and archival, spiritual, environmental, urban, mystery and enigma, functional, educational. Eleven context types frame the analysis: geographic, landscape, urban, historical, social, political, technological, environmental, intangible heritage, thematic, archaeological.

**Both are open vocabularies, not closed taxonomies.** They are where the analysis starts, not where it must stop. The specification asks the model to go further in two directions, and this is where the epistemic notation does its work.

- **Beyond the vocabulary.** A value or a context that emerges from the particular description of the place is kept in its own terms, even where no listed type fits it. It is never replaced by the nearest category or by a generic label. A value that maps to nothing on the list remains a valid value, and may itself be a finding.
- **Beyond the explicit text.** The model is asked to infer values and contexts by connecting evidence that the sources do not connect, and to read between the lines for what the author of a source may not have noticed.

The mark is what makes this latitude acceptable. A value or a context drawn from several pieces of evidence carries 〰️, an interpretive reading carries 💭, and the expert accepts, revises or rejects it at the checkpoint. The limits are stated as firmly as the latitude: every selected context must be supported by evidence and linked to values, and what the specification forbids is an unmarked claim presented as fact.

## Other governance components

The paper follows the two mechanisms that act on the analysis itself. Three more shape the run. They are not separate documents: each is written into the specification files themselves, in [`../system/`](../system/), as rules the model executes.

**Source grounding** — the system works only on material the user provides, and declares gaps rather than filling them.
**Scope constraints** — material that lies outside a significance assessment is refused rather than assessed.
**Sequencing control** — the stage order, the pauses, and the confirmation rules.

## Version history and the freeze note

`system/claude/V-11.5/InSites-claude-v11.5.md` is the current specification and changes over time. It is edited as modules in [`system/modules/`](../system/modules/README.md) and built into that single file and the Claude plugin; the ChatGPT Desktop plugin is built from the same modules, while the Gemini and Custom GPT editions are maintained as ports. Previous working versions are kept locally, not in this repository.

`studies/heritage4.0-tuba-2026/system/InSites-v2.1_AS-RUN-tuba-2026-03-22.md` is the specification exactly as it ran in the assessment reported in the Heritage 4.0 paper. **Every number in that paper belongs to that file and that session.** Changes since, some of them prompted by what the session exposed: a revision now cannot be followed by advancing until the expert confirms; the prose around a mark must match its epistemic status; synthesis carries 〰️ rather than °; and the marks travel into rendered outputs such as the knowledge graph.

The staged structure, the tiered marks, and the review checkpoints are the same in both. **No performance comparison between versions is intended or supported.**

A third, unrelated lineage is archived at [`studies/Cultural-InSites-Paper/`](../studies/Cultural-InSites-Paper/): the version of the specification a class of students used, run on DeepSeek-V3. It is static, not a prior version of what is described above, and **no performance comparison to it is intended or supported either.**
