# Research record — Tuba-Zangariyye dolmen field, 2026

The evidence base for **From Report to Inquiry: Governing Generative AI Insights in Heritage Significance Assessment**, Heritage 4.0, Florence, 2026.

**This folder is a record of a session that happened**, so it is static by nature rather than by rule. The paper cites the tagged snapshot of it, and that tag cannot move. The system has developed since; see [`../../docs/architecture.md`](../../docs/architecture.md) for what changed and why no version comparison is intended.

## The study in one paragraph

One heritage expert assessed the same site twice: first manually, for European heritage guidance, and then with InSites, from the same three source documents. **The session ran on the Claude implementation.** The other platform implementations in `../../system/` were not used here and nothing reported in the paper extends to them. The system received the descriptive sections she had written for the manual assessment but not its significance sections, so whatever it produced came from re-processing description she had authored. She then reviewed the AI-assisted assessment for moments her manual assessment had not yielded, and the full transcript was coded claim by claim.

## What is here

| Folder | Contents |
|---|---|
| `system/` | The specification exactly as it ran, `InSites-v2.1_AS-RUN-tuba-2026-03-22.md` |
| `session/` | The full turn-by-turn record of the assessment session between the expert and the system, in markdown |
| `protocols/` | The written observation protocol, given to the expert **before** the run |
| `coding/` | The claim-level dataset, the case evidence with quotations, the manual-versus-AI comparison, and the run analysis |
| `coding/runs/` | Three independent runs of the extraction protocol, a finer-grained re-extraction, and the cross-run comparisons |
| `sources/README.md` | Citations for the three assessed documents. The documents themselves are third-party works and are not redistributed here |

**File paths inside the coding files point somewhere else.** `coding/run-analysis.md` and the four extraction runs were written while the work lived in a private development repository, and they name its paths — `InSites-Brain/Claude/…`, `tz-textonly.md`, `evidence/tuba-session-transcript.md`. Those strings do not resolve here and are left as they were written rather than rewritten, because these files are a record. What they refer to is in this folder: the session they analyse is `session/transcript.md`, and the specification they propose changes to is the one in `system/`.

## What ran

The file in `system/` is the specification as it stood when the session took place. It was extracted unchanged from the development repository and verified byte-identical to the version in force that day; it declares itself `InSites-CAA-mono-v2.1`. The session ran on 22 March 2026, after 15:40 local time, on **Claude Opus 4.6**.

Two qualifications belong with that. The archived files record only "Claude Opus" and no point release, because Claude.ai exports carry no model identifier; the version above comes from the assessor's own knowledge of the session rather than from the record, and is reported as such. And the version string was raised from v2.1 to v2.2 later the same evening without any change to content, so the transcript cannot distinguish the two — the stage specifications, the epistemic notation and the integrity model are identical across both, and no claim in the paper turns on the difference.

The development repository is not public, so a reader cannot re-run the reconstruction behind these statements. It is kept in full outside this repository.

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

**One of the readings came from a system already primed for it.** The specification in force carried two clauses that bear directly on the documentary paradox the paper reports: *preservation-as-archive*, which treats intact deposits as a primary record that excavation diminishes, and *strategic non-intervention*, which frames the choice not to excavate as one with costs of its own. Both were in the specification before the session began. The inversion the system produced should therefore not be read as one it reached unprompted.

The three extraction runs **do not measure coding reliability**. They vary in where a claim is cut and in the threshold for under-marking, and they were consolidated by hand against the transcript. The manual assessment was not re-coded claim by claim against the transcript, so the novelty comparison rests on the expert's judgment. One case with one expert supports a proof of concept and not a measurement.
