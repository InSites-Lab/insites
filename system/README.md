# The InSites system

InSites is an AI environment for cultural significance assessment. Its core is a natural-language **specification** that a general-purpose language model executes as a human-gated agentic workflow of seven stages, pausing after every stage for expert review. The specification is what carries out the assessment; it is authored rather than trained, with no orchestration framework and no fine-tuning. The code here renders the knowledge graph and the dashboards, or packages and serves an edition; none of it performs the assessment.

The specification has an edition for each platform below. **Load the appropriate files, upload a heritage document, and type `start`.** For Claude and ChatGPT, start from their pages, [`claude/`](claude/README.md) and [`gpt/`](gpt/README.md), which set each platform's two editions side by side; for DeepSeek, follow the [student guide](deepseek/README.md). The system runs Stage 0, reports what the documentation base lacks, and pauses for your review.

**Claude has two editions of the same specification**: the single file, and a plugin installed to your account. Use one or the other, never both in one conversation; [`claude/README.md`](claude/README.md) sets them side by side.

| Platform | Copy this | Form |
|---|---|---|
| **Claude** | [`claude/`](claude/README.md): a plugin installed to your account (**development version: not yet validated for formal assessments; use at your own discretion**), or the single file [`claude/V-11.5/InSites-claude-v11.5.md`](claude/V-11.5/InSites-claude-v11.5.md) | Plugin, or one file |
| **ChatGPT** | [`gpt/`](gpt/README.md): a Custom GPT from [`gpt/V-11.4/en/instructions.md`](gpt/V-11.4/en/instructions.md) and the knowledge files beside it, or the ChatGPT Desktop plugin (development) | Instructions + knowledge files, or a plugin |
| **DeepSeek** | [`deepseek/InSites-deepseek-V2.md`](deepseek/InSites-deepseek-V2.md) | One file; [student guide](deepseek/README.md) |
| **Google Gemini** | [`gemini/V-11.4/InSites-CAA-GEM-v11.4.md`](gemini/V-11.4/InSites-CAA-GEM-v11.4.md) | One file |

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

## Modules and editions

The Claude specification is also held as modules in [`modules/`](modules/), one per section, in the order [`modules/manifest.json`](modules/manifest.json) gives. Joined in that order they equal `claude/V-11.5/InSites-claude-v11.5.md` exactly, and [`build/build.mjs`](build/build.mjs) checks that (`node system/build/build.mjs --check`).

The build script assembles editions from the modules: the [Claude plugin](claude-plugin/insites/), where each part becomes a skill read when its task arrives, and the joined single file (`--monolith`). It joins and copies text and nothing it produces runs as code, so the specification is still what runs. The plugin folder is generated: edit the modules and the wrappers in [`build/claude-plugin/`](build/claude-plugin/), then rebuild.

The [ChatGPT plugin source](chatgpt-plugin/) builds skills from the modules and includes the stateless MCP server and viewer. Its generated packages are kept out of Git, except the delivery archive in [`../downloads/`](../downloads/). How the editions are built from one source: [`../docs/plugin-architecture.md`](../docs/plugin-architecture.md); how to edit and build the modules: [`modules/README.md`](modules/README.md).

## Why multiple platforms

The architecture is a file. It carries no dependency on a particular model, and the implementations exist to make that concrete rather than to assert it. That matters for the claim the paper makes: what the study observed belongs to the structure of the interaction between an expert and the system, not to the capability of one model.

## The ChatGPT knowledge files

The Custom GPT splits what the single-file editions carry together: `instructions.md` holds the workflow and the rest are loaded as knowledge. What each file holds, and the Hebrew workshop port, are described in [`gpt/README.md`](gpt/README.md).

## The files the specifications name

A specification refers to four files by name. Two are here; two are not, on purpose.

| Named as | Where it is |
|---|---|
| `atar-runtime/data-contract.md` | [`atar-runtime/data-contract.md`](atar-runtime/data-contract.md) — the one `DATA` shape every rendered output is built from, and the aliases that let the ChatGPT and Claude key sets both work. The runtime it describes is here too, in source: [`atar-runtime/`](atar-runtime/) |
| `artifact-ux-contract.md` | [`artifact-ux-contract.md`](artifact-ux-contract.md) — the visual language, the entity-type palette, and the AI-query behaviour, held in common across the platforms |
| `test-mode.md` | **Not here, by design.** A development harness that runs the whole pipeline unattended against a built-in sample. The specification calls it dev-only and instructs the model to ignore it when absent, so its absence is the intended state rather than a missing file |
| `kg-runtime.js` | **Not here.** An earlier renderer, named where the specification lists Hebrew entity labels. It has been replaced by the `atar-runtime` package the contracts above describe, and nothing in this build loads it |

## The rendering runtime

A specification file is prose, but the knowledge graph and the two dashboards are drawn by actual code, and [`atar-runtime/`](atar-runtime/) is that code: roughly 180 KB of JavaScript and CSS — three renderers, a Leaflet map with a zero-network vector fallback, right-to-left detection, and the AI-query panel — plus the esbuild driver that produces the bundle and the React shell a Claude artifact emits.

A running artifact does not load this directory. It loads the published `atar-runtime` package from a CDN at a pinned version, which is the only external-script path an artifact sandbox permits. What is here is the source that package is built from, so a reader can see what the shell is handing its data to rather than take the rendering on trust.

It is MIT rather than Apache-2.0; see [`../LICENSING.md`](../LICENSING.md).

## What is not here

The version that produced the findings reported in the Heritage 4.0 paper is **not** in this folder. It is archived, unchanged, at [`../studies/heritage4.0-tuba-2026/system/`](../studies/heritage4.0-tuba-2026/system/), and it is never synchronised with the files here. This folder develops; that one is a record of a session that happened.

The Cultural-InSites version is likewise not here. It is archived at [`../studies/Cultural-InSites-Paper/`](../studies/Cultural-InSites-Paper/) in the unified single-file form the `gpt/` files were later split out of, and it is never synchronised with them either.
