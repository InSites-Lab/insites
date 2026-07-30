# The InSites system

InSites is a **specification** that a language model executes stage by stage, with an expert review between stages. It is authored rather than trained: there is no code, no orchestration framework and no fine-tuning. What is here is what runs.

The same specification exists for three platforms. **Copy the file into the platform's instructions field, upload a heritage document, and type `start`.** The system runs Stage 0, reports what the documentation base lacks, and pauses for your review.

| Platform | Copy this | Form |
|---|---|---|
| **Claude** | [`claude/InSites-claude-current.md`](claude/InSites-claude-current.md) | One file |
| **Google Gemini** | [`gemini/InSites-CAA-GEM-v9.3.md`](gemini/InSites-CAA-GEM-v9.3.md) | One file |
| **ChatGPT** | [`gpt/instructions.md`](gpt/instructions.md) plus the knowledge files beside it | Instructions + knowledge files |

## Versions

The three implementations are the same architecture and are not at the same generation. Each is what its platform last ran.

| Platform | State | Notes |
|---|---|---|
| Claude | current | The implementation used in the Tuba-Zangariyye study, in the version recorded there |
| Gemini | v9.3 | `[[PLACEHOLDER — date, and whether it lags the Claude implementation]]` |
| ChatGPT | multi-file | `[[PLACEHOLDER — date; the knowledge files are runtime inputs, listed below]]` |

**Do not read the differences between platforms as performance.** They are ports of one specification to three instruction formats, they have not been compared, and this repository makes no claim about which runs it better.

## Why three, and what that shows

The architecture is a file. It carries no dependency on a particular model, and the three implementations exist to make that concrete rather than to assert it. That matters for the claim the paper makes: what the study observed belongs to the structure of the interaction between an expert and the system, not to the capability of one model.

## The ChatGPT knowledge files

ChatGPT splits what the other two carry in one file. `instructions.md` holds the workflow; the rest are loaded as knowledge:

`cbsa-stages.md` the stage specifications · `cbsa-appendices.md` the taxonomies and reference material · `kg-spec.md`, `dashboard-spec.md`, `collection-dashboard-spec.md`, `report-tab-spec.md` the rendered outputs · `ma-ra-spec.md`, `ma-rc-spec.md` the read-assessment and read-collection workflows.

**These are runtime inputs.** Where their content overlaps `../docs/specs/`, the `docs/` version is the description written for a reader and these are the files the platform loads. Neither is a copy of the other's job.

## What is not here

The version that produced the findings reported in the Heritage 4.0 paper is **not** in this folder. It is archived, unchanged, at [`../studies/heritage4.0-tuba-2026/system/`](../studies/heritage4.0-tuba-2026/system/), and it is never synchronised with the files here. This folder develops; that one is a record of a session that happened.
