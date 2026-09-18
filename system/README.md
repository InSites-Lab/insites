# The InSites system

InSites is a **specification** that a language model executes stage by stage, with an expert review between stages. It is authored rather than trained: there is no code, no orchestration framework and no fine-tuning. What is here is what runs.

The specification has four platform editions. **Load the appropriate files, upload a heritage document, and type `start`.** For DeepSeek, follow the [student guide](deepseek/README.md); for Claude, see its [quick start](claude/README.md). The system runs Stage 0, reports what the documentation base lacks, and pauses for your review.

| Platform | Copy this | Form |
|---|---|---|
| **Claude** | [`claude/V-11.5/InSites-claude-v11.5.md`](claude/V-11.5/InSites-claude-v11.5.md) | One file |
| **DeepSeek** | [`deepseek/InSites-deepseek-v11.6.md`](deepseek/InSites-deepseek-v11.6.md) | One file; [student guide](deepseek/README.md) |
| **Google Gemini** | [`gemini/V-11.3/InSites-CAA-GEM-v11.3.md`](gemini/V-11.3/InSites-CAA-GEM-v11.3.md) | One file |
| **ChatGPT** | [`gpt/V-11.3/en/instructions.md`](gpt/V-11.3/en/instructions.md) plus the knowledge files beside it | Instructions + knowledge files |

## Versions

The four implementations are the same architecture and are not at the same generation. Each is what its platform last ran.

| Platform | Version | Last changed | Form |
|---|---|---|---|
| Claude | v11.5 | September 2026 | One file. The Tuba-Zangariyye study ran on this implementation, but on the earlier version archived in [`../studies/heritage4.0-tuba-2026/system/`](../studies/heritage4.0-tuba-2026/system/) — not on the file here |
| DeepSeek | v11.6 | September 2026 | One file; English/Chinese course edition. Epistemic marks remain in assessment/readings, not the KG |
| Gemini | v11.3 | August 2026 | One file |
| ChatGPT | v11.3 | August 2026 | `instructions.md` plus the knowledge files beside it |

**Do not read the differences between platforms as performance.** They are ports of one specification to four instruction formats, they have not been compared, and this repository makes no claim about which runs it better.

## Why multiple platforms

The architecture is a file. It carries no dependency on a particular model, and the four implementations exist to make that concrete rather than to assert it. That matters for the claim the paper makes: what the study observed belongs to the structure of the interaction between an expert and the system, not to the capability of one model.

## The ChatGPT knowledge files

ChatGPT splits what the single-file editions carry together. `instructions.md` holds the workflow; the rest are loaded as knowledge:

`cbsa-stages.md` the stage specifications · `cbsa-appendices.md` the taxonomies and reference material · `kg-spec.md`, `dashboard-spec.md`, `collection-dashboard-spec.md`, `report-tab-spec.md` the rendered outputs · `ma-ra-spec.md`, `ma-rc-spec.md` the read-assessment and read-collection workflows.

**These are runtime inputs**, written to be loaded by the platform rather than read. Where the same mechanism is also explained for a reader, that explanation is in [`../docs/`](../docs/) — the two serve different jobs and neither is a copy of the other.

### Hebrew ChatGPT port

The Hebrew workshop port is developed separately in [`gpt/V-11.3/hebrew/`](gpt/V-11.3/hebrew/). It does not replace or modify the English GPT in `gpt/V-11.3/en/`; the English files remain canonical. Its nine runtime files and local parity/rendering checks are complete. It remains a candidate for Preview review until it passes ChatGPT Preview checks in both a builder and participant account.

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
