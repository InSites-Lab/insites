<p align="center"><a href="https://insites-lab.github.io/"><img src="site/insites-logo.jpg" alt="InSites" width="220"></a></p>

# *InSites*: a research instrument for the study of cultural significance assessment

A project of the **[InSites Knowledge Lab](https://insites-lab.github.io/)**, Faculty of Architecture and Town Planning, Technion – Israel Institute of Technology.

*InSites* is the AI environment the lab uses in its studies of the information needs of heritage assessment and of methods for assessing heritage places, **cultural significance assessment** in particular. In a session it carries out **context-based significance assessment (CBSA)** on source material the user provides, in seven stages, pausing after every stage for expert review.

> **Status.** Not a product. A research environment, continually revised as the lab's studies require, with no release target. It has not been validated for formal assessments. Use non-confidential material.

## Start here

| To see | Go to |
|---|---|
| How it works | [`docs/architecture.md`](docs/architecture.md), the central document, and the rest of [`docs/`](docs/README.md) |
| The specification itself | [`system/claude/V-11.5/InSites-claude-v11.5.md`](system/claude/V-11.5/InSites-claude-v11.5.md), the current specification as one readable file |
| Cases and studies | [`studies/`](studies/README.md): the test cases, and the research records behind the papers |

## The process

The user uploads documentation of a heritage place. The model works through the stages below, one at a time, and the expert reviews each stage before the next begins.

<p align="center"><img src="docs/insites-workflow.png" alt="The CBSA stages in InSites. Stage 0, Data Review and Gaps. Stages 1 to 5, the CBSA analysis stages: Description and Contexts; Values Analysis; Authenticity and Integrity; Comparative Evaluation; Significance Statement. Stage 6, Quality Check and Summary. Expert review follows every stage. Each claim carries its source and an epistemic mark. Extensions: Knowledge Graph, Alternative Reading, Collection Analysis, Image Analysis. The figure also marks an independent agentic review of claims; among the editions published here only the Claude plugin has one, on request, and a review of every claim is in development." width="620"></p>

**Figure.** The CBSA stages in *InSites*. Hollow circles are the gates on the data (Stage 0) and on quality (Stage 6); filled circles are the analysis stages. The double tick stands for two reviews of a stage: the expert's, and an independent agentic review of its claims. The expert's review follows every stage in every edition. Among the editions published here, only the Claude plugin has an agentic review: an agent checks a stage's marks when the user asks. A layer that reviews every claim is [in development](#in-development).

| Stage | What it produces |
|---|---|
| **0** Data Review and Gaps | A data-quality summary, a category checklist, a documentation profile and a list of gaps |
| **1** Description and Contexts | The site description, a timeline, the contexts, marked and cited, and planning implications |
| **2** Values Analysis | The values, marked and cited, and a table linking attributes, values, significance and implications |
| **3** Authenticity and Integrity | A Nara Grid table and the integrity condition |
| **4** Comparative Evaluation | A comparison set against stated criteria, with a summary |
| **5** Significance Statement | The statement of significance and the open questions |
| **6** Quality Check and Summary | A process summary, a table of quick improvements and planning implications |

The workflow stops after every stage and waits for the expert. The figure and the table use short labels for the stages; their full names are in the specification. What the expert decides at each stage is set out in [`docs/architecture.md`](docs/architecture.md).

## Principles

- **CBSA, formalised for an AI environment.** The stages of the method, its vocabularies and its criteria (the context types, the value types, the Nara Grid, the comparison criteria) are written out as a natural-language specification that a general-purpose language model executes. Each step of an assessment is therefore explicit text, open to reading, questioning and revision.
- **Epistemic notation.** Every claim the system writes carries a mark reporting its distance from the sources: no mark where a source states it, and the passage is cited; 〰️ where it is inferred from two or more pieces of evidence; 💭 where it is an interpretation beyond what the sources state. A synthesis or an interpretive reading cannot then be mistaken for something a document states. The mark supports the expert's judgement and does not establish that a claim is valid. See [`docs/epistemic-notation.md`](docs/epistemic-notation.md).
- **Expert review at every stage.** The workflow pauses after every stage, and the expert adds, corrects, rejects or reframes before it continues.
- **Source grounding.** The system works only on material the user provides, and declares a gap where the material is silent.
- **An audit trail.** Each intervention by the expert is tagged from a fixed vocabulary of six actions, and the tags are gathered into a session report. See [`docs/Session-Report-spec.md`](docs/Session-Report-spec.md).

## Extensions

Around the seven stages the specification offers extensions, each invoked by name. None of them changes a mark a claim received in the stages. They are described in [`docs/extensions.md`](docs/extensions.md).

- **Knowledge Graph** represents an assessment as a network: the places, structures, events, actors, contexts and values it names, and the relations between them.
- **Alternative Reading** reads a completed assessment, whether produced in the session, uploaded or pasted, and offers analytical and interpretive readings of it.
- **Collection Analysis** reads records or assessments together, at any depth of documentation, to surface patterns and gaps. It produces no new assessments.
- **Image Analysis** adds observations from photographs, on values, condition and context, to the evidence for an assessment.

An assessment or a collection can also be rendered as an interactive **dashboard**, a report view of the approved outputs.

## How it is built

Its core is a specification written in natural language, which a general-purpose language model executes as a human-gated agentic workflow. *InSites* has no model of its own and is bound to no particular platform. Around that core are agentic components, which vary by edition:

- **Stage and extension roles.** Each stage and extension is a bounded role with its own brief, output and stopping point, written into the specification.
- **Epistemic auditor.** In the Claude plugin, on request, a separate agent checks a stage's marks against the sources in a clean context. It flags mismatches and never rewrites. It runs in Cowork and Claude Code.

In the published editions, code renders the knowledge graph and the dashboards and packages the editions. The specification carries out the assessment, and the expert decides. How the editions are built from one source: [`docs/plugin-architecture.md`](docs/plugin-architecture.md).

## In development

**Vera: a claim-review layer for *InSites*.** A research instrument that runs the unchanged *InSites* specification inside an agentic workflow: agents audit every claim, the expert decides on each one, and the record of those decisions is used to study and improve the method. It is in development as a private prototype and is not part of the editions published here.

## The research record

| Folder | What it holds | Cite as |
|---|---|---|
| [`studies/cases/`](studies/cases/) | Heritage places on which *InSites* is tested: the Ayelet HaShachar water tower, and Ard al-Yahud in Haifa | |
| [`studies/heritage4.0-tuba-2026/`](studies/heritage4.0-tuba-2026/) | The record behind *From Report to Inquiry: Governing Generative AI Insights in Heritage Significance Assessment* (Heritage 4.0, Florence, 2026): the specification exactly as it ran, the session transcript, the protocols and the claim-level coding | The tagged snapshot [`v1.0.0`](https://github.com/InSites-Lab/insites/tree/v1.0.0) |
| [`studies/digital_heritage-course-study/`](studies/digital_heritage-course-study/) | A course study with students of the Digitising Heritage course at Beijing Normal-Hong Kong Baptist University (BNBU): the study in brief | The manuscript is under review |
| [`studies/Cultural-InSites-Paper/`](studies/Cultural-InSites-Paper/) | The version of the specification those students used, run on DeepSeek-V3 | The tagged snapshot [`cultural-insites-v1.0`](https://github.com/InSites-Lab/insites/tree/cultural-insites-v1.0/studies/Cultural-InSites-Paper) |

A tagged snapshot is a fixed copy of this repository as it stood for that study; the link opens it, and it does not change. [`tools/claim-extractor/`](tools/claim-extractor/) is the protocol that produced the claim-level coding.

The findings reported in the Heritage 4.0 paper belong to **one run of one version** of the Claude implementation, archived with that record, and the specification in `system/` has developed since. **A record and the current specification are not comparable as performance**, and the paper does not compare them. Cite the tagged record for findings and the live specification for architecture; [`studies/README.md`](studies/README.md) says more.

## Running an edition

| Platform | Go to | What you load | First words |
|---|---|---|---|
| **Claude** | [`system/claude/`](system/claude/) | A plugin installed to your account, or a single file in a Project | **begin assessment** (plugin) · **start** (file) |
| **ChatGPT** | [`system/chatgpt/`](system/chatgpt/) | A Custom GPT you build from the files there, or a ChatGPT Desktop plugin (development) | **start** (Custom GPT) · **Begin assessment** (plugin) |
| **Google Gemini** | [`system/gemini/V-11.4/`](system/gemini/V-11.4/InSites-CAA-GEM-v11.4.md) | One file in a Gem's instructions | **start** |
| **DeepSeek** | [`system/deepseek/`](system/deepseek/README.md) | The BNBU Digitising Heritage course edition, with a student guide | as the guide says |

Upload a heritage document first. The system opens with Stage 0, which reports what the documentation lacks, and then waits for you. Example source material: [`sites-data/`](sites-data/), the Ayelet water tower in Hebrew and other examples in English.

## Repository map

| Folder | What is in it |
|---|---|
| [`docs/`](docs/README.md) | Written for a reader: the architecture, the notation, the extensions, the session report, and how the editions are built |
| [`system/`](system/README.md) | The live specification, with one folder for each platform edition |
| [`system/modules/`](system/modules/) | The specification source, one module per section. The Claude editions and the ChatGPT plugin are built from it |
| [`system/build/`](system/build/) | `node system/build/build.mjs` builds the Claude plugin; `--check` confirms that the modules equal the single file |
| [`system/chatgpt/plugin/`](system/chatgpt/plugin/) | Source of the ChatGPT plugin and its MCP server |
| [`system/atar-runtime/`](system/atar-runtime/) | The code that renders the knowledge graph and the dashboards, published on npm |
| [`studies/`](studies/README.md) | The test cases and the research records |
| [`sites-data/`](sites-data/) | Example source documents for practising with *InSites* |
| [`tools/claim-extractor/`](tools/claim-extractor/) | The protocol that produced the coding in the Heritage 4.0 record |
| `site/` | The source of the lab's web page, and the logo at the top of this page |

To adapt *InSites* to your own work, fork the repository; the specification is open under Apache-2.0. Start from [`system/README.md`](system/README.md) and [`system/modules/`](system/modules/).

## Citation

See [`CITATION.cff`](CITATION.cff). For the research record, cite the tagged release `v1.0.0` rather than a branch.

## Licence

Code and specifications: Apache-2.0, except the rendering runtime, which is MIT. Documentation and the research record: CC BY 4.0. See [`LICENSING.md`](LICENSING.md).

The three heritage documents assessed in the Tuba-Zangariyye study are third-party works and are **not** redistributed here. They are cited in [`studies/heritage4.0-tuba-2026/sources/README.md`](studies/heritage4.0-tuba-2026/sources/README.md).

## Who

Assoc. Prof. [Yael Alef](https://architecture.technion.ac.il/members/yael-alef/), head of the InSites Lab (Technion), and Yuval Shafriri, EdTech consultant. [insites-lab.github.io](https://insites-lab.github.io/)
