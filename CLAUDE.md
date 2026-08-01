# InSites — working rules for this repository

InSites is a **specification** that a language model executes stage by stage, with an expert review between stages. Most of this repository is prose, and prose here is either **live documentation** or **evidence for a published paper** — which one a file is decides what you may do to it. There is one exception: `system/atar-runtime/` is real JavaScript, with a build.

A paper rests on this repository: *From Report to Inquiry: Governing Generative AI Insights in Heritage Significance Assessment* (Heritage 4.0, Florence, 2026). Reference [10] of that paper resolves to the tag `v1.0.0`, and a footnote in §1 points at the repository root. So a reader may arrive here to verify a sentence, and the rules below exist to keep that possible.

## State, as of 1 August 2026

**The repository is public and the paper is submitted.** Anything committed is visible immediately. The tag `v1.0.0` exists and is pushed; it is the paper's evidence and does not move. `main` is otherwise free.

## Where things are

| | |
|---|---|
| `system/` | The live specification, one implementation per platform: `claude/`, `gemini/`, `gpt/`. Plus the two cross-platform contracts, `artifact-ux-contract.md` and `atar-runtime/data-contract.md` |
| `system/atar-runtime/` | **The code.** ~180 KB of JavaScript and CSS that renders the knowledge graph and the two dashboards, plus the esbuild driver and the React shell an artifact emits. Source of the `atar-runtime` npm package; `npm install && npm run build` works from it. `dist/` is untracked |
| `docs/` | Written for a reader: `architecture.md` (the anatomy), `epistemic-notation.md` (the marks), `Session-Report-spec.md` (the six intervention tags), `cbsa-archaeology-layer.md` (an optional module), `fig-workflow.html` (the source of the paper's figure) |
| `studies/heritage4.0-tuba-2026/` | The research record the paper cites. `system/` holds the specification **as it ran**; `session/` the transcript; `protocols/` the observation protocol; `coding/` the claim-level dataset and the extraction runs; `sources/README.md` the citations for the three assessed documents |
| `tools/claim-extractor/` | The protocol that produced the coding |
| `sites-data/` | A listing of practice documents. The documents themselves are third-party and are not here |

**Licences differ.** Apache-2.0 for `system/` and `tools/`, **except** `system/atar-runtime/`, which is MIT because that is how the package is published. CC BY 4.0 for `docs/` and `studies/`. See `LICENSING.md`.

## Start of session

**If `TODO.md` is present in the working tree, read it before doing anything else.** Publication is done, so what it now holds is the follow-up list: section C, the internal work that was deliberately deferred rather than rushed before the tag. It records what was found, where, and why it was left — including a full audit of what a reviewer would see. Treat it as the standing backlog, not as a checklist that has expired.

It is not committed, so anyone cloning this repository will not have it. Its absence means you are working from a clone rather than from the author's machine, not that there is nothing to do.

## The three rules that override everything else

### 1. `studies/` is a historical record. Never synchronise it.

`studies/heritage4.0-tuba-2026/` documents a session that happened in March 2026. Its `system/InSites-v2.1_AS-RUN-tuba-2026-03-22.md` is the specification **as it ran** — not an old copy of the current one.

It resembles `system/claude/InSites-claude-current.md`, and that resemblance is a trap. **Do not reconcile them, diff them into alignment, "update" the archived file, or propagate a fix from one to the other.** Overwriting it destroys the evidence the paper cites. The filename says `AS-RUN` and a date for exactly this reason.

The only edits foreseen in `studies/` are the source citations in `sources/README.md`, which are presentation rather than evidence. If evidence itself ever has to change because an error is found in it, the repair is a **new tag plus a line saying what changed** — never an overwrite, because published numbers point at the old state.

### 2. `system/`, `docs/` and every README are the live path.

These change freely as the system develops. Improvements, corrections and expansions belong here. `docs/architecture.md` is load-bearing for a reviewer: the paper names scope constraints and sequencing control and then sets them aside to follow the two mechanisms it is about, so this repository is the only place they are described. The paper does not link to `docs/` — a reader arrives at the root and has to find it.

### 3. No claim about performance, anywhere.

Never add a statement comparing the specification versions, comparing the three platform implementations, or characterising how well the system performs. The paper reports counts and declines the performance framing; the repository must not imply a comparison the paper never made. This is a standing policy, not a stylistic preference.

Two sentences already in the repository carry this and must survive editing: `system/README.md` states that the three implementations are ports rather than competitors and have not been measured against one another; `studies/heritage4.0-tuba-2026/README.md` states that the session ran on the Claude implementation and that nothing in the paper extends to the others.

The percentages inside `studies/heritage4.0-tuba-2026/coding/` describe that dataset and nothing beyond it. Do not promote them into a README, a summary or an abstract as a quality score.

## What must never be committed

- **`local-work/`** — the working draft of the paper and internal notes. Ignored by git. **Read it for reference; never edit it from a session here.** The paper is edited in Word by the author with tracked changes. If the repository contradicts the paper, report it and let the author decide which is wrong.
- **`Papers/`** — drafts of other papers and reviewer correspondence, in the private tree. Ignored, and never to be copied in.
- **The three assessed heritage documents, and everything in `sites-data/`.** Third-party works; rights are not ours. The repository offers the citation, not the document.
- **`_archive/`** — files withdrawn from publication on 31 July, kept on disk under their original paths. `_archive/README.md` gives the reason for each. **Read that reason before restoring anything**; each was withdrawn on a specific ground, not swept up in a tidy.
- **`TODO.md` and `PLAN.md`** — the publication working sheet and the execution plan. Working files, deliberately local.
- **`studies/heritage4.0-tuba-2026/system/PROVENANCE.md`** — the forensic note on which version ran. It is untracked on purpose: it argues from commit hashes in a private repository that no reader can check. Its reader-facing conclusions are in that folder's `README.md`, under "What ran". Do not re-add it.

## Conventions

**"Specification", not "prompt".** The paper argues against the prompt reading and the repository must not reintroduce it. The folder was renamed `prompt/` → `system/` for this reason. Do not reintroduce the word in new prose or paths.

**`[[PLACEHOLDER — …]]`** marks something a human must complete. Grep for `PLACEHOLDER` before any release. Never invent a value to fill one — especially a citation.

**Citations must match the paper's reference list.** When completing a citation in `sources/README.md`, it and the paper's list are done in one pass from the same source, so there is no second version of the truth.

## The tag

Do not move or delete `v1.0.0`, and do not rename the repository or the `InSites-Lab` organisation. Each of the three breaks reference [10], and the paper is already submitted with those strings printed in it.
