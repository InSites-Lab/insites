# The *InSites* system

*InSites* is an AI environment for cultural significance assessment. Its core is a natural-language **specification** that a general-purpose language model executes as a human-gated agentic workflow of seven stages, pausing after every stage for expert review. The specification is what carries out the assessment; it is authored rather than trained, with no orchestration framework and no fine-tuning. The code here renders the knowledge graph and the dashboards, or packages and serves an edition; none of it performs the assessment.

This folder holds the specification itself. How the system works is described in [`../docs/`](../docs/README.md).

## What is in this folder

| Folder or file | What it is |
|---|---|
| [`claude/`](claude/README.md) | The two Claude editions: the single file [`claude/V-11.5/InSites-claude-v11.5.md`](claude/V-11.5/InSites-claude-v11.5.md), and a [plugin](claude/plugin/) installed to your account (**development version: not yet validated for formal assessments; use at your own discretion**) |
| [`chatgpt/`](chatgpt/README.md) | The two ChatGPT editions: a Custom GPT built from [`chatgpt/custom-gpt/en/instructions.md`](chatgpt/custom-gpt/en/instructions.md) and the knowledge files beside it, and a ChatGPT Desktop plugin (development), with its [source](chatgpt/plugin/) and its [packaged archive](chatgpt/downloads/) |
| `gemini/` | The Google Gemini edition, one file: [`gemini/V-11.4/InSites-CAA-GEM-v11.4.md`](gemini/V-11.4/InSites-CAA-GEM-v11.4.md) |
| [`deepseek/`](deepseek/README.md) | The DeepSeek course edition, one file, [`deepseek/InSites-deepseek-V2.md`](deepseek/InSites-deepseek-V2.md), with a student guide |
| [`modules/`](modules/README.md) | The source of the Claude specification, one module per section, in the order [`modules/manifest.json`](modules/manifest.json) gives |
| `build/` | [`build/build.mjs`](build/build.mjs), which assembles editions from the modules, and the wrappers of the Claude plugin in [`build/claude-plugin/`](build/claude-plugin/) |
| [`atar-runtime/`](atar-runtime/) | The code that draws the knowledge graph and the dashboards |
| [`artifact-ux-contract.md`](artifact-ux-contract.md) and [`atar-runtime/data-contract.md`](atar-runtime/data-contract.md) | The two contracts held in common across the platforms |

## Running an edition

**Load the appropriate files, upload a heritage document, and type `start`.** For Claude and ChatGPT, start from their pages, [`claude/`](claude/README.md) and [`chatgpt/`](chatgpt/README.md), which set each platform's two editions side by side; for DeepSeek, follow the [student guide](deepseek/README.md). The system runs Stage 0, reports what the documentation base lacks, and pauses for your review.

On Claude and on ChatGPT, use one edition or the other, never both in one conversation.

Worth knowing before a first run:

- **The output language follows the language you write in**, not the language of the documents you upload.
- **The first reading of each stage is deliberately short.** Say **expand** to go deeper, or **go back** to revisit a stage.
- **Say `save progress` before leaving a long session.** The system writes a resume capsule, from which a new conversation can continue.
- **Stage 4 may propose comparison sites from outside your sources**, when the sources name none. It marks them as its own suggestions and asks for your confirmation before it uses them.
- **The run closes with three short questions to you**, and your answers enter the session report.

## Versions

The implementations are ports of the same architecture. The version number records the specification generation, not performance.

| Platform | Version | Last changed | Form |
|---|---|---|---|
| Claude | v11.5 | October 2026 | One file. The Tuba-Zangariyye study ran on an earlier version archived in [`../studies/heritage4.0-tuba-2026/system/`](../studies/heritage4.0-tuba-2026/system/) — not on the file here |
| DeepSeek | V2 | September 2026 | One file; English/Chinese course edition. Epistemic marks remain in assessment/readings, not the KG |
| Gemini | v11.4 | September 2026 | One file |
| ChatGPT | v11.4 | September 2026 | `instructions.md` plus the knowledge files beside it |

V11.4 removes the requirement to produce a bidirectional context-effect finding. It tests each direction independently and accepts two-way, one-way, and “no supported effect identified” outcomes. Previous working versions are kept locally, not in this repository.

**Do not read the differences between platforms as performance.** They are ports of one specification to different instruction formats, they have not been compared, and this repository makes no claim about which runs it better.

## Why multiple platforms

The architecture is a file. It carries no dependency on a particular model, and the implementations exist to make that concrete rather than to assert it. That matters for the claim the paper makes: what the study observed belongs to the structure of the interaction between an expert and the system, not to the capability of one model.

## How the editions are built

The Claude specification is edited as modules in [`modules/`](modules/), one per section. Joined in the order of the manifest they equal `claude/V-11.5/InSites-claude-v11.5.md` exactly, and `node system/build/build.mjs --check` confirms it.

The build script assembles the editions from the modules: the [Claude plugin](claude/plugin/), where each part becomes a skill read when its task arrives, and the joined single file (`--monolith`). It joins and copies text and nothing it produces runs as code, so the specification is still what runs. The plugin folder is generated: edit the modules and the wrappers in [`build/claude-plugin/`](build/claude-plugin/), then rebuild.

The [ChatGPT plugin source](chatgpt/plugin/) builds its skills from the same modules and includes the stateless MCP server and viewer. Its generated packages are kept out of Git, except the delivery archive in [`chatgpt/downloads/`](chatgpt/downloads/). The Custom GPT and Gemini files are maintained as separate ports.

More: [`../docs/plugin-architecture.md`](../docs/plugin-architecture.md) on how the editions are built from one source, and [`modules/README.md`](modules/README.md) on editing and building the modules.

## The files the specifications name

A specification refers to four files by name. Two are here; two are not, on purpose.

| Named as | Where it is |
|---|---|
| `atar-runtime/data-contract.md` | [`atar-runtime/data-contract.md`](atar-runtime/data-contract.md) — the one `DATA` shape every rendered output is built from, and the aliases that let the ChatGPT and Claude key sets both work. The runtime it describes is here too, in source: [`atar-runtime/`](atar-runtime/) |
| `artifact-ux-contract.md` | [`artifact-ux-contract.md`](artifact-ux-contract.md) — the visual language, the entity-type palette, and the AI-query behaviour, held in common across the platforms |
| `test-mode.md` | **Not here, by design.** A development harness that runs the whole pipeline unattended against a built-in sample. The specification calls it dev-only and instructs the model to ignore it when absent, so its absence is the intended state rather than a missing file |
| `kg-runtime.js` | **Not here.** An earlier renderer, named where the specification lists Hebrew entity labels. It has been replaced by the `atar-runtime` package the contracts above describe, and nothing in this build loads it |

## The rendering runtime

A specification file is prose, but the knowledge graph and the two dashboards are drawn by code, and [`atar-runtime/`](atar-runtime/) is the source of that code. A running artifact does not load this directory: it loads the published `atar-runtime` package from a CDN at a pinned version. The source is here so that a reader can see what the shell hands its data to. Its own [README](atar-runtime/README.md) describes it.

It is MIT rather than Apache-2.0; see [`../LICENSING.md`](../LICENSING.md).

## What is not here

The version that produced the findings reported in the Heritage 4.0 paper is **not** in this folder. It is archived, unchanged, at [`../studies/heritage4.0-tuba-2026/system/`](../studies/heritage4.0-tuba-2026/system/), and it is never synchronised with the files here. This folder develops; that one is a record of a session that happened.

The Cultural-InSites version is likewise not here. It is archived at [`../studies/Cultural-InSites-Paper/`](../studies/Cultural-InSites-Paper/) in the unified single-file form the Custom GPT files were later split out of, and it is never synchronised with them either.
