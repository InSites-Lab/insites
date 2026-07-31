# Which bot version ran the Tuba-Zangariyye session?

Forensic reconstruction, 26.7.2026. Written for the Heritage 4.0 camera-ready, where §3 must
state what was actually run.

## Answer

| | |
|---|---|
| **Bot prompt** | `InSites-CAA-mono-v2.1` (or the content-identical v2.2 as bumped at 22.3 18:58). **Not v2.0.** |
| **Restored here** | `InSites-v2.1_AS-RUN-tuba-2026-03-22.md`, extracted from commit `9870a9b`, verified byte-identical (blob `2e30b4d`). Original repository filename at that commit: `InSites-Brain/Claude/InSites-CAA-mono-v2.1.md` |
| **Model** | "Claude Opus". **Exact model ID not recoverable.** See below. |
| **Session date** | 22.3.2026, after 15:40 local time |

## Why a file named `InSites-for-tuba.md` was rejected and archived

A file with that name was examined as a candidate and ruled out; it has since been moved out of
this folder. Recorded here so the question is not reopened from the filename alone.

Despite the filename, that file is mono **v3** (it declares `version: InSites-CAA-mono-v3.md`
and matches the canonical v3 blob from commit `4edf5b0`, 25.3.2026) plus eight added lines that
instruct a live **Gemini** API connection for the knowledge graph's AI Query tab. The session
ran on Claude, three days before v3 existed.

Three behavioural rules in v3 are absent from v2.1, and each one is a fix derived from this very
session, so v3 cannot be the prompt that produced it:

- **Hard Stop after Stage 5.** v3: "After delivering the significance statement (including any
  revision), STOP. Do not proceed to Stage 6 until the user explicitly confirms." The paper
  reports that the system did advance without confirmation and the expert stopped it.
- **Three-state integrity model made opt-in.** v3 requires the bot to offer it first ("Would you
  like me to apply this?") and to skip it where no archaeological dimension exists. The
  transcript (`evidence/tuba-session-transcript.md`, Stage 3.2) shows the model applied inline
  with no offer, returning "Not applicable" for two of the three states. This is the direct
  behavioural proof, independent of any date evidence.
- **Experiential / Spirit & Feeling woven into Stage 5.** v3 mandates it; v2.1 does not. The
  expert had to require it during the session.

It is therefore the post-Tuba version. Do not cite it as the system under study, and do not
restore it into this folder on the strength of its filename.

## How the prompt version was pinned

The decisive fingerprint is the **three-state archaeological integrity model**.

`Tuba-Run-Analysis-2303.md` §B3 reports that the run applied the full three-state model
(integrity-at-exposure / integrity-post-excavation / **integrity-as-potential**), with "Not
applicable" returned for two of the three states, and records Yael's reaction: "maybe too much,
don't make a PhD out of it." That model therefore had to be present in the prompt at run time.

Checked directly against each candidate blob in git:

| Commit | Time | Prompt file | Integrity model | `Integrity-as-potential` |
|---|---|---|---|---|
| `333c8bb` | 21.3 20:18 | mono-v2.0 | two-state | absent |
| `9870a9b` | 22.3 15:40 | mono-v2.1 | **three-state** | **present** |
| `62186ef` | 22.3 19:18 | mono-v2.2 | three-state | present |
| `f88e88d` | 22.3 20:52 | mono-v2.2 | three-state | present |

`Integrity-as-potential` was introduced by `9870a9b` at 22.3 15:40 and never removed in this
window. The session cannot have run on v2.0.

The same commit also introduced two other clauses that matter to the paper's insight set:

- **Preservation-as-archive** (a Documentary/Archival Value sub-category): "Intact deposits are
  themselves a primary record, future methods may extract more than today's. This value
  diminishes upon excavation, even when well-documented."
- **Strategic non-intervention** (Nara Grid application): choosing not to excavate preserves the
  research archive at the cost of current knowledge.

These are the prompt-side counterparts of what the paper reports as Insight 5, the documentary
paradox in which leaving the site unexcavated is itself a form of preservation. **Note the
direction of causation before citing this**: the clauses were in the prompt when the run
happened, so the insight was produced by a system already primed for that move. Whether that
strengthens or weakens the claim is a judgement for §5, but it should not be stated as if the
system reached the inversion unprompted.

## Correction to the transcript header

`evidence/tuba-session-transcript.md` line 4 reads:

```
Date: 2026-03-21/22 | Assessor: Yael Alef | Platform: Claude Opus | Bot: InSites-CAA v2
```

`Tuba-Run-Analysis-2303.md` line 2 reads `Date: 2026-03-23`.

Both headers are human annotations added during extraction, not machine metadata. The git
evidence narrows the assessment portion of the session to **after 15:40 on 22.3**. The "21/22"
range and the "23.3" analysis date are both consistent with this if the 21.3 portion was setup
or if the analysis was written the following day, but the run itself post-dates the v2.1 bump.

## What could NOT be determined

**The exact Claude model.** Two independent evidence files record "Claude Opus" / "Claude
(Opus)", and nothing contradicts that. But:

- The original Claude.ai HTML export is not in the repository. A search of the full git history
  across all branches returns only the extracted markdown transcript, never the source HTML.
- Claude.ai conversation exports do not record a model ID in any case, so recovering the exact
  point release from the export would not have been possible even if it had survived.

**Nothing in the repository recovers the point release.** "Claude Opus" is what the archived
files support, and a more precise identifier taken from them would be reconstruction presented
as record.

**Added 31.7.2026 — the assessor supplies the version directly.** Y. Alef states from her own
knowledge of the session that it ran on **Claude Opus 4.6**, and the paper reports that. This is
testimony rather than an artefact recovered from the record, and the distinction is the reason
this paragraph exists rather than a silent edit above: a reader who checks the archived files
will find "Claude Opus" and no version, and should know why. The difference matters — 4.6, 4.7,
4.8 and Opus 5 are not interchangeable for a run of this kind — which is why the paper carries
the point release rather than the generic name.

**v2.1 versus v2.2.** Commit `203d262` (22.3 18:58) bumped the version string v2.1 to v2.2 and
changed nothing else, so v2.2 at that point is content-identical to v2.1. Commit `62186ef`
(22.3 19:18) then trimmed 126 lines, but what it removed is internal routing material (trigger
tables, mini-agent dispatch descriptions) that does not surface in stage output, so the
transcript cannot discriminate between the two. This ambiguity is immaterial to every claim the
paper makes: the CBSA stage content, the epistemic notation, and the three-state integrity model
are identical across both.

## Reproducing this check

```powershell
$r = '<repo root>'
git -C $r log --all --date=iso --pretty='%h %ad %s' --since=2026-03-20 --until=2026-03-27 -- 'InSites-Brain/Claude/'
git -C $r show 9870a9b:'InSites-Brain/Claude/InSites-CAA-mono-v2.1.md' | Select-String 'Three-State Principle'
```

Extraction used `git archive` + `tar` so the working index was never touched; identity was
confirmed with `git hash-object` against the original blob SHA.
