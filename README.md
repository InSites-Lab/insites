# InSites — AI-assisted heritage significance assessment

InSites is an experimental assistant that carries out **context-based significance assessment (CBSA)** of heritage places. It runs as a specification a language model executes stage by stage, with an expert review between stages, and it works only on source material the user provides.

Two mechanisms distinguish it. **Epistemic notation**: every claim the system writes carries a mark reporting its distance from the sources, so a synthesis or an interpretive reading cannot be mistaken for something a document states. **Human-in-the-loop governance**: the workflow pauses after every stage and the expert adds, corrects, rejects, or reframes before it continues.

The architecture is a prompt file. It is bound to no particular model, and it needs no agent framework to run.

## Start here

| If you want to | Go to |
|---|---|
| Run an assessment | [`system/`](system/) — pick your platform, copy the file into its instructions field, upload a heritage document, type `start` |
| Understand how it works | [`docs/architecture.md`](docs/architecture.md) |
| Understand the marks | [`docs/epistemic-notation.md`](docs/epistemic-notation.md) |
| Check a claim in the Heritage 4.0 paper | [`studies/heritage4.0-tuba-2026/`](studies/heritage4.0-tuba-2026/) |

## What is here

**`system/`** — the current specification, for Claude, Gemini and ChatGPT. Three ports of one architecture, which is what "bound to no particular model" means in practice. **This part is live and changes as the system develops.**

**`docs/`** — architecture, the notation, and the output specifications. Also live.

**`studies/heritage4.0-tuba-2026/`** — the research record behind *From Report to Inquiry: Governing Generative AI Insights in Heritage Significance Assessment* (Heritage 4.0, Florence, 2026). It holds the specification exactly as it ran, the session transcript, the protocols, and the claim-level coding. **This is a record of a session that happened**, so it is static by nature rather than by rule; what the paper cites is the tagged snapshot `tuba-study`, and a tag cannot move.

**`tools/claim-extractor/`** — the protocol that produced the claim-level coding.

## The one thing to know before citing

The findings reported in the paper belong to **one run of one version** of the Claude implementation, archived in `studies/heritage4.0-tuba-2026/system/`. The specification in `system/` has developed since, partly because of what that session exposed: a rule now forbids advancing after a revision until the expert confirms, the prose around a mark must match its epistemic status, and synthesis carries a different mark. **The two are not comparable as performance**, and the paper does not compare them. Cite the tagged record for findings and the live specification for architecture.

## Citation

See [`CITATION.cff`](CITATION.cff). For the research record, cite the tagged release `tuba-study` rather than a branch.

## Licence

Code and prompt specifications: Apache-2.0. Documentation and the research record: CC BY 4.0. See [`LICENSING.md`](LICENSING.md).

The three heritage documents assessed in the Tuba-Zangariyye study are third-party works and are **not** redistributed here. They are cited in [`studies/heritage4.0-tuba-2026/sources/README.md`](studies/heritage4.0-tuba-2026/sources/README.md).
