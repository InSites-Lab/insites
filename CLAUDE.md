# InSites — working rules for this repository

InSites is a **specification** that a language model executes stage by stage, with an expert review between stages. There is no code to build and no test suite to run. Almost everything here is prose, and prose in this repository is either **live documentation** or **evidence for a published paper**. Which one a file is decides what you may do to it.

A paper rests on this repository: *From Report to Inquiry: Governing Generative AI Insights in Heritage Significance Assessment* (Heritage 4.0, Florence, 2026). Reference [14] of that paper resolves to the tag `tuba-study`, and a footnote in §1 points at the repository root. So a reader may arrive here to verify a sentence, and the rules below exist to keep that possible.

## Start of session

**If `TODO.md` is present in the working tree, read it before doing anything else.** It is the publication working sheet — what is done, what is still blocking, and the exact sequence for going public and tagging. It is not committed and is not part of the published repository, so it will be absent for anyone who clones this; its absence means the publication work is finished.

## The three rules that override everything else

### 1. `studies/` is a historical record. Never synchronise it.

`studies/heritage4.0-tuba-2026/` documents a session that happened in March 2026. Its `system/InSites-v2.1_AS-RUN-tuba-2026-03-22.md` is the specification **as it ran** — not an old copy of the current one.

It resembles `system/claude/InSites-claude-current.md`, and that resemblance is a trap. **Do not reconcile them, diff them into alignment, "update" the archived file, or propagate a fix from one to the other.** Overwriting it destroys the evidence the paper cites. The filename says `AS-RUN` and a date for exactly this reason.

The only edits foreseen in `studies/` are the source citations in `sources/README.md`, which are presentation rather than evidence. If evidence itself ever has to change because an error is found in it, the repair is a **new tag plus a line saying what changed** — never an overwrite, because published numbers point at the old state.

### 2. `system/`, `docs/` and every README are the live path.

These change freely as the system develops. Improvements, corrections and expansions belong here. `docs/architecture.md` is load-bearing for a reviewer: the paper names source grounding, scope constraints and sequencing control without describing them, and points here instead.

### 3. No claim about performance, anywhere.

Never add a statement comparing the specification versions, comparing the three platform implementations, or characterising how well the system performs. The paper reports counts and declines the performance framing; the repository must not imply a comparison the paper never made. This is a standing policy, not a stylistic preference.

Two sentences already in the repository carry this and must survive editing: `system/README.md` states that the three implementations are ports rather than competitors and have not been measured against one another; `studies/heritage4.0-tuba-2026/README.md` states that the session ran on the Claude implementation and that nothing in the paper extends to the others.

The percentages inside `studies/coding/` describe that dataset and nothing beyond it. Do not promote them into a README, a summary or an abstract as a quality score.

## What must never be committed

- **`local-work/`** — the working draft of the paper and internal notes. Ignored by git. **Read it for reference; never edit it from a session here.** The paper is edited in Word by the author with tracked changes. If the repository contradicts the paper, report it and let the author decide which is wrong.
- **`Papers/`** — drafts of other papers and reviewer correspondence, in the private tree. Ignored, and never to be copied in.
- **The three assessed heritage documents, and everything in `sites-data/`.** Third-party works; rights are not ours. The repository offers the citation, not the document.

## Conventions

**"Specification", not "prompt".** The paper argues against the prompt reading and the repository must not reintroduce it. The folder was renamed `prompt/` → `system/` for this reason. Do not reintroduce the word in new prose or paths.

**`[[PLACEHOLDER — …]]`** marks something a human must complete. Grep for `PLACEHOLDER` before any release. Never invent a value to fill one — especially a citation.

**Citations must match the paper's reference list.** When completing a citation in `sources/README.md`, it and the paper's list are done in one pass from the same source, so there is no second version of the truth.

## The tag

`tuba-study` is the paper's evidence and is immutable. Do not move or delete it; do not rename the repository or the `InSites-Lab` organisation — either breaks the reference. After submission, `main` is free.
