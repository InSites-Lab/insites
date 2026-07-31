# Epistemic notation — reference definition

## What it is for

In AI-assisted heritage assessment, any output that goes beyond what the sources explicitly state is indistinguishable from hallucination: a fabricated claim presented as fact. The notation turns that liability into a resource, by making inference visible as inference — a marked hypothesis submitted for the expert to examine rather than a sentence to be trusted or discarded whole.

It does three things:

1. **It licenses inference.** The system is permitted to reach past the explicit text, because whatever it produces there will carry a mark.
2. **It activates governance.** The expert gets a visual signal for where domain judgment is needed.
3. **It leaves an audit trail.** Every claim's epistemic status is legible in the output itself.

## The three tiers

| Notation | Name | Definition | Example |
|:--------:|------|-----------|---------|
| (none) | Explicit | Directly stated in the source material. No inference required. | "Built in 1923" `[A:2]` |
| 〰️ | Inferred | Synthesised from two or more pieces of evidence. Not stated as such in any single source, but supported by convergent data. Cites the evidence passages. | 〰️"pastoralist populations using the same landscape over four millennia" — connecting main text `[A:46–48]`, a footnote `[A:50 fn.4]`, and management context `[B:12]` |
| 💭 | Interpretive hypothesis | Neither explicit nor confidently inferred. A reading between the lines — pattern recognition, subtext, or a connection the expert should examine. | 💭"a persistent landscape for imagination" — raising scattered textual references into a single heritage value |

**A note on the middle glyph.** The synthesis tier is written **〰️** in the current specification. The version archived in [`../studies/heritage4.0-tuba-2026/system/`](../studies/heritage4.0-tuba-2026/system/) wrote it **°**, and every mark in the research record and in the paper's Table 2 is therefore a `°`. The tier is the same; only the character changed. This page uses `〰️` when describing the system as it now stands and `°` when quoting the study.

## Where the notation acts: meaning → criteria → significance

The marks operate inside a structured progression, not uniformly across it.

| Stage | Role | What the notation does here |
|-------|------|------|
| **1 — Contexts** | Describe the frameworks, identify context-effects | 〰️ on contexts that emerge from the site's particular description; 💭 on reading between the lines |
| **2 — Values** | Articulate what the site *means* within each context | 〰️ on values inferred across contexts; 💭 on values present as subtext rather than documented |
| **3 — Authenticity and integrity** | What survives, what is lost | Marks on condition claims resting on indirect evidence |
| **4 — Comparative** | How this asset stands against others | 〰️ on comparative readings built from cross-source synthesis |
| **5 — Significance** | Weigh meanings through criteria into significance | Where a core claim rests on 〰️ or 💭, the sentence states its basis and its limits — the mark alone is not enough |

Stage 2 extracts *meanings*, not significance. Significance appears only once Stages 3 and 4 have applied evaluative criteria, and Stage 5 synthesises the chain.

## Prose–notation coherence

A mark constrains the sentence around it. Where a claim carries 〰️ or 💭, the prose must use suggestive language — "may have", "suggests", "possibly". A mark on a term with certainty in the sentence is a contradiction, and the reader will believe the sentence.

**Wrong** — "The site functioned as a 〰️hierarchically organised network"
**Right** — "The site may have functioned as a 〰️hierarchically organised network"

The notation reports the epistemic status; the prose has to match it.

## Relation to evidence types

Notation and evidence type are two different questions about the same claim, and both matter to the expert:

- **Notation** marks *how the claim was derived* — explicit, inferred, hypothesised.
- **Evidence type** marks *what kind of evidence supports it* — stratigraphic, analogical, documentary, and so on.

A claim can be explicit in a source and still rest on weak evidence, such as an analogical parallel stated outright. It can equally be inferred, and rest on strong evidence, such as two stratigraphic reports read together. Combined, the two are written `[ana〰️: B:7]` — analogical evidence, inferred across sources. The evidence-type codes are defined in [`cbsa-archaeology-layer.md`](cbsa-archaeology-layer.md), which is loaded only in archaeological deployments.

## What it looked like in practice

Three instances from the Tuba-Zangariyye session, reported in the Heritage 4.0 paper and traceable in [`../studies/heritage4.0-tuba-2026/`](../studies/heritage4.0-tuba-2026/). These carry `°`, the glyph that run used.

**Social continuity (°).** Three scattered references — main text, a footnote, and management context — connected into "pastoralist populations using the same landscape over four millennia". The expert logged it as a pattern she had not identified.

**Intangible heritage (°).** A single footnote listing references across several traditions, raised into a unified heritage value. The expert called it an insight not written before.

**A classification failure (unmarked; should have carried 💭).** "Hierarchically organised network" introduced structural language absent from every source, and carried no mark. The expert caught it and required it rewritten closer to the source.

The third is the important one. It shows what the notation cannot do on its own: the system's reading of its own distance from the sources is approximate, and where that reading fails it fails silently, in the direction of appearing more grounded than it is. **The notation supports expert judgment; it is never an independent mechanism of reliability.**

## How it is activated

The notation works at two levels, and needs both.

**Globally**, the notation key defines the three tiers and applies across all stages.

**Per stage**, Stages 1 and 2 name which analytical moves produce which mark: in Stage 1, contexts emerging from the site's particular description (〰️), reading between the lines (💭), and surprising convergences (〰️); in Stage 2, values inferred across contexts (〰️) and values found as subtext (💭).

Without the per-stage half, the key exists but nothing connects "go beyond the explicit" to "mark it". The per-stage instructions are what close that gap.

---

The marking gate that decides which mark a claim receives, and the three rules that govern it, are in [`architecture.md`](architecture.md).
