# Research record — Tuba-Zangariyye dolmen field, 2026

The evidence base for **From Report to Inquiry: Governing Generative AI Insights in Heritage Significance Assessment**, Heritage 4.0, Florence, 2026.

**This folder is a record of a session that happened**, so it is static by nature rather than by rule. The paper cites the tagged snapshot of it, and that tag cannot move. The system has developed since; see [`../../docs/architecture.md`](../../docs/architecture.md) for what changed and why no version comparison is intended.

## The study in one paragraph

One heritage expert assessed the same site twice: first manually, for European heritage guidance, and then with InSites, from the same three source documents. **The session ran on the Claude implementation.** The other platform implementations in `../../system/` were not used here and nothing reported in the paper extends to them. The system received the descriptive sections she had written for the manual assessment but not its significance sections, so whatever it produced came from re-processing description she had authored. She then reviewed the AI-assisted assessment for moments her manual assessment had not yielded, and the full transcript was coded claim by claim.

## What is here

| Folder | Contents |
|---|---|
| `system/` | The specification exactly as it ran, `InSites-v2.1_AS-RUN-tuba-2026-03-22.md`, with its provenance note |
| `session/` | The full transcript of the assessment session |
| `protocols/` | The written observation protocol, given to the expert **before** the run |
| `coding/` | The claim-level dataset, the case evidence with quotations, the manual-versus-AI comparison, and the run analysis |
| `coding/runs/` | Three independent runs of the extraction protocol, a finer-grained re-extraction, and the cross-run comparisons |
| `sources/README.md` | Citations for the three assessed documents. The documents themselves are third-party works and are not redistributed here |

## Where each claim in the paper is checked

| The paper says | Check it in |
|---|---|
| 45 substantive claims; 18 marked, 14 ° and 4 💭; 24 presented as explicit | `coding/claim-level-count.md` |
| Three special cases: an unmarked claim that should have carried 💭, a claim rejected as outside scope, a conceptual misapplication | `coding/claim-level-count.md` |
| Five moments the manual assessment had not produced | `coding/manual-vs-bot-comparison.md`, with the expert's wording in `coding/case-evidence.md` |
| Every quotation from the expert or the system | `coding/case-evidence.md`, and in context in `session/transcript.md` |
| Thirteen interventions across the stages, one stage passing without intervention | `session/transcript.md`, tallied in `coding/run-analysis.md` |
| The traceability chain for each of the eight decisive moments | `coding/case-evidence.md` |
| Six categories fixed before the run, including failures and surprises | `protocols/observation-protocol.docx` |
| The marking rules that governed this run | `system/InSites-v2.1_AS-RUN-tuba-2026-03-22.md` |
| That the three extraction runs vary in granularity but not in the direction of the patterns | `coding/runs/claim-extraction-cross-run-comparison.md` |

## What this record cannot settle

**The coding files report percentages; the paper does not, and that is deliberate.** `claim-level-count.md` and the extraction runs carry figures such as 94 per cent classification accuracy and 83 per cent of unmarked claims accepted. Those describe this dataset and nothing beyond it. One run, one site and one expert cannot establish an accuracy rate, so the paper reports counts and declines the performance framing that a percentage invites. **Read the percentages as a description of what happened here, not as a measure of the system.**

The three extraction runs **do not measure coding reliability**. They vary in where a claim is cut and in the threshold for under-marking, and they were consolidated by hand against the transcript. The manual assessment was not re-coded claim by claim against the transcript, so the novelty comparison rests on the expert's judgment. One case with one expert supports a proof of concept and not a measurement.
