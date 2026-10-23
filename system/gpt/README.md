# InSites for ChatGPT

On ChatGPT, InSites comes in two editions. Use one **or** the other in a conversation, never both.

| | Custom GPT | ChatGPT Desktop plugin |
|---|---|---|
| **What you load** | [`V-11.4/en/instructions.md`](V-11.4/en/instructions.md) in a GPT's instructions, and the eight knowledge files beside it as its knowledge | The ZIP in [`../../downloads/`](../../downloads/), imported once with Plugin Creator in a personal ChatGPT Desktop account |
| **Status** | The current edition | Early development version, not yet for formal assessments; use non-confidential trial material. The ZIP is packaged at a given point and does not follow every change to the specification here |
| **Start** | Upload a document, say **start** | In a new Work conversation, select `@InSites`, upload a document, write **Begin assessment.** |
| **New versions** | Re-upload the files by hand | Import a new ZIP |

## The Custom GPT

1. In ChatGPT, create a GPT and open its configuration.
2. Paste [`V-11.4/en/instructions.md`](V-11.4/en/instructions.md) into its instructions.
3. Upload the eight other files in [`V-11.4/en/`](V-11.4/en/) as its knowledge.
4. In a conversation with the GPT, upload a heritage document and say **start**. The GPT runs Stage 0, reports what the documentation lacks, and pauses for your review.

ChatGPT splits what the single-file editions carry together, because of the size limit of the instructions field. `instructions.md` holds the workflow; the rest are loaded as knowledge:

`cbsa-stages.md` the stage specifications · `cbsa-appendices.md` the taxonomies and reference material · `kg-spec.md`, `dashboard-spec.md`, `collection-dashboard-spec.md`, `report-tab-spec.md` the rendered outputs · `ma-ra-spec.md`, `ma-rc-spec.md` the read-assessment and read-collection workflows.

**These are runtime inputs**, written to be loaded by the platform rather than read. Where the same mechanism is also explained for a reader, that explanation is in [`../../docs/`](../../docs/); the two serve different jobs and neither is a copy of the other.

A Hebrew workshop port is developed separately in [`V-11.4/hebrew/`](V-11.4/hebrew/). It does not replace or modify the English files, which remain canonical, and it remains a candidate until it passes ChatGPT Preview checks in both a builder and a participant account.

## The ChatGPT Desktop plugin

Follow the four steps in [`downloads/README.md`](../../downloads/README.md); the same instructions are inside the ZIP. The plugin carries eight skills and a connection to the InSites MCP server, which serves the viewer for the knowledge graph and the dashboards. That server is unauthenticated: do not send private assessment material.

## For maintainers

The plugin's source is [`../chatgpt-plugin/`](../chatgpt-plugin/). It builds the eight skills from the same [modules](../modules/) as the Claude editions and includes the stateless MCP server and its viewer; its README gives the build and packaging steps. The Custom GPT files are maintained as a separate port.
