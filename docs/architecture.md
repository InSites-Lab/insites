# Architecture

This document describes how InSites is built and why. It exists so that papers about the system can point here instead of spending pages on mechanics.

## What the system is

A specification, written in prose, that a single conversational language model executes. There is no orchestration code, no separate processes, and no framework. The specification is authored rather than trained: it is a file, and replacing the model does not replace the design.

**Each stage, and each optional extension, is specified as a mini-agent**: a bounded role with its own brief, its own output, and its own stopping point, written as a section of one prompt file rather than as a separate program. In a multi-agent system these roles would be separate agents; here the separation is expressed in the specification. The separation is what the design depends on, not the packaging, and that is the reason the architecture travels: the same roles can be run as separate agents, or as callable modules, without changing what the assessment does.

## Seven stages in three groups

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

**Extensions** are invoked by name rather than run in sequence: knowledge graph, analytic dashboard, alternative reading, collection analysis.

## Sequencing, and what enforces it

Nothing enforces it. The specification requires one stage per turn in fixed order and works as a state machine written in prose, but sequencing is a behaviour the specification asks for and not a constraint a runtime imposes. This matters for reading the system honestly: a prompt-level rule can be broken, and when it is, the expert is the mechanism that catches it.

Each of Stages 1 to 6 opens with a brief on the previous stage's findings, closes with one reflection question, and pauses for review. The specification requires a question a specialist could answer in more than one way.

## Epistemic notation

Three tiers, applied by the model to its own output, marking each claim's distance from source evidence.

**No mark** — the claim is explicit in the sources, and is cited to the passage that states it.
**°** — synthesis: the claim connects two or more pieces of evidence.
**💭** — hypothesis: an interpretive reading beyond what the sources state.

Where the sources supply nothing, the system declares the gap and asks for material rather than inferring across it. Notation is the extension of that same principle to the case where the evidence is partial rather than absent.

### The marking gate

The gate is applied before a claim is written, not by auditing the text afterwards.

1. **Evidential**: *Can this claim be stated from a single source?* If yes, no mark. If it requires connecting evidence across sources, °. If *a reasonable expert could read it differently*, 💭.
2. **Evidence against assertion**: *Is the claim itself in the source, or only the evidence supporting it?* Where the source supplies the evidence and the model supplies the evaluative move, the claim is marked.
3. **Ties resolve toward marking**: *better an unnecessary notation than an unmarked claim that appears factual.*

The third rule sets the direction of the system's failures. A well-supported claim flagged as uncertain is the error the design is built against; an interpretive move that goes unmarked, and then reads as established fact, is the error it stays open to. See [`epistemic-notation.md`](epistemic-notation.md).

**Notation is support for expert judgment and never an independent mechanism of reliability.** The mark reports the system's own reading of its distance from the sources, and that reading can be wrong.

## Human-in-the-loop governance

The workflow pauses after each stage, and the pause holds because the expert holds it. The brief and the reflection question position the expert to shape the assessment by adding, correcting, rejecting, and reframing, rather than to approve finished output.

Each intervention is tagged from a fixed vocabulary of six actions — `+add`, `−reject`, `~revise`, `↔replace`, `?question`, `!correct` — and the tags accumulate into a session report that closes the run as an audit trail of who changed what.

## The value taxonomy

Where a stage names a value it draws on fourteen types, listed with the specification and adapted per domain: historical, aesthetic, social, technological, symbolic, landscape, scientific, documentary and archival, spiritual, environmental, urban, mystery and enigma, functional, educational.

Eleven context types frame the analysis: geographic, landscape, urban, historical, social, political, technological, environmental, intangible heritage, thematic, archaeological. Every selected context must be supported by evidence and linked to values.

## Other governance components

The paper on epistemic notation follows the two mechanisms that act on the analysis itself. Three more shape the run and are described in the specifications under [`specs/`](specs/):

**Source grounding** — the system works only on material the user provides, and declares gaps rather than filling them.
**Scope constraints** — material that lies outside a significance assessment is refused rather than assessed.
**Sequencing control** — the stage order, the pauses, and the confirmation rules.

## Version history and the freeze note

`system/claude/InSites-claude-current.md` is the current specification and changes over time.

`studies/heritage4.0-tuba-2026/system/InSites-v2.1_AS-RUN-tuba-2026-03-22.md` is the specification exactly as it ran in the assessment reported in the Heritage 4.0 paper. **Every number in that paper belongs to that file and that session.** Changes since, some of them prompted by what the session exposed: a revision now cannot be followed by advancing until the expert confirms; the prose around a mark must match its epistemic status; synthesis carries 〰️ rather than °; and the marks travel into rendered outputs such as the knowledge graph.

The staged structure, the tiered marks, and the review checkpoints are the same in both. **No performance comparison between versions is intended or supported.**
