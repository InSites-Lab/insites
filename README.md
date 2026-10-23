<p align="center"><a href="https://insites-lab.github.io/"><img src="site/insites-logo.jpg" alt="InSites" width="220"></a></p>

# InSites — AI-assisted heritage significance assessment

A project of the **[InSites Knowledge Lab](https://insites-lab.github.io/)**, Faculty of Architecture and Town Planning, Technion – Israel Institute of Technology.

InSites is an AI environment for **cultural significance assessment** of heritage places. Its core is a natural-language specification that a general-purpose language model executes as a human-gated agentic workflow of seven stages, carrying out **context-based significance assessment (CBSA)** and pausing after every stage for expert review. It works only on source material the user provides.

The specification is what carries out the assessment. The code around it renders the knowledge graph and the dashboards, or packages and serves an edition; none of it performs the assessment. InSites has no model of its own and is bound to no particular platform.

> **Status.** Experimental. The plugin editions are development versions, not yet validated for formal assessments. Use non-confidential material.

## How it works

Two mechanisms distinguish it. **Epistemic notation**: every claim the system writes carries a mark reporting its distance from the sources, so a synthesis or an interpretive reading cannot be mistaken for something a document states. **Human-in-the-loop design**: the workflow pauses after every stage, and the expert adds, corrects, rejects or reframes before it continues.

Beyond the seven stages, InSites reads completed assessments and collections of assessments, and renders an assessment as a knowledge graph or a dashboard.

To read further:

- [`docs/architecture.md`](docs/architecture.md): how it is built and why
- [`docs/epistemic-notation.md`](docs/epistemic-notation.md): the marks
- [`docs/plugin-architecture.md`](docs/plugin-architecture.md): how the editions are built from one source

## Try it

| Platform | Go to | What you load | First words |
|---|---|---|---|
| **Claude** | [`system/claude/`](system/claude/) | A plugin installed to your account, or a single file in a Project | **begin assessment** (plugin) · **start** (file) |
| **ChatGPT** | [`system/chatgpt/`](system/chatgpt/) | A Custom GPT you build from the files there, or a ChatGPT Desktop plugin (development) | **start** (Custom GPT) · **Begin assessment** (plugin) |
| **Google Gemini** | [`system/gemini/V-11.4/`](system/gemini/V-11.4/InSites-CAA-GEM-v11.4.md) | One file in a Gem's instructions | **start** |
| **DeepSeek** | [`system/deepseek/`](system/deepseek/README.md) | The BNBU Digitising Heritage course edition, with a student guide | as the guide says |

Upload a heritage document first. The system opens with Stage 0, which reports what the documentation lacks, and then waits for you. Example source material: [`sites-data/`](sites-data/), the Ayelet water tower in Hebrew and other examples in English.

## In development

**Vera: agentic verification for InSites.** A research instrument that runs the unchanged InSites specification inside an agentic workflow: agents audit every claim, the expert decides on each one, and the record of those decisions is used to study and improve the method. In development as a private prototype.

## The research record

**[`studies/heritage4.0-tuba-2026/`](studies/heritage4.0-tuba-2026/)** is the record behind *From Report to Inquiry: Governing Generative AI Insights in Heritage Significance Assessment* (Heritage 4.0, Florence, 2026): the specification exactly as it ran, the session transcript, the protocols and the claim-level coding. It is a record of a session that happened, so it is static; the paper cites the tagged snapshot `v1.0.0`. [`tools/claim-extractor/`](tools/claim-extractor/) is the protocol that produced the coding.

**[`studies/Cultural-InSites-Paper/`](studies/Cultural-InSites-Paper/)** is the version of the specification students used in the Digitising Heritage course at Beijing Normal-Hong Kong Baptist University (BNBU), run on DeepSeek-V3. Static; cite the tagged snapshot `cultural-insites-v1.0`.

The findings reported in the paper belong to **one run of one version** of the Claude implementation, archived in `studies/heritage4.0-tuba-2026/system/`. The specification in `system/` has developed since, partly because of what that session exposed: a rule now forbids advancing after a revision until the expert confirms, the prose around a mark must match its epistemic status, and synthesis carries a different mark. **The two are not comparable as performance**, and the paper does not compare them. Cite the tagged record for findings and the live specification for architecture.

## For maintainers

- [`system/modules/`](system/modules/): the specification source, one module per section. The Claude editions and the ChatGPT plugin are built from it.
- [`system/build/`](system/build/): `node system/build/build.mjs` builds the Claude plugin; `--check` confirms that the modules equal the single file.
- [`system/chatgpt/plugin/`](system/chatgpt/plugin/): source of the ChatGPT plugin and its MCP server.
- [`system/atar-runtime/`](system/atar-runtime/): the code that renders the knowledge graph and the dashboards, published on npm.

## Citation

See [`CITATION.cff`](CITATION.cff). For the research record, cite the tagged release `v1.0.0` rather than a branch.

## Licence

Code and specifications: Apache-2.0, except the rendering runtime, which is MIT. Documentation and the research record: CC BY 4.0. See [`LICENSING.md`](LICENSING.md).

The three heritage documents assessed in the Tuba-Zangariyye study are third-party works and are **not** redistributed here. They are cited in [`studies/heritage4.0-tuba-2026/sources/README.md`](studies/heritage4.0-tuba-2026/sources/README.md).

## Who

InSites Lab: Yael Alef (Technion) and Yuval Shafriri. [insites-lab.github.io](https://insites-lab.github.io/)
