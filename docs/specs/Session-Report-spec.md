# Session Report Spec — Post-Hoc Analytic Layer for CBSA Sessions

**Spec ID:** [CA-IP]
**Status:** Source-of-truth, platform-neutral. Was previously embedded inline in the Claude / Gemini / GPT bot brains; extracted from there for the Bezalel workshop variant where the bot closes after the Debrief without auto-generating an inline report.

## When to invoke

After a CBSA session has ended and a transcript is available. The bot brain in the current workshop variant intentionally does NOT generate this report inline. To produce a report:

- **(a) Post-hoc:** feed a saved session transcript to a fresh Claude / GPT / Gemini context with this spec loaded as a skill or pasted inline.
- **(b) On demand inside a live session:** paste this spec into the bot's context to re-enable in-session generation for one specific run.

**Trigger phrases:** "session report", "analyze session", "generate [CA-IP]"

**Inputs:** A complete CBSA session transcript (user + bot turns, including the user's answer to the Debrief question).

**Output:** A single Session Report formatted exactly per the template below.

## Procedure

Scan the full transcript. Record only moments where the user actively intervened — additions, corrections, rejections, replacements, or questions that changed the output. Passive confirmations are NOT recorded.

## Session Report Format

```
═══════════════════════════════════════
📊 SESSION REPORT
   [Site Name] · [Date]
═══════════════════════════════════════

─── A. SESSION OVERVIEW ───
Assessment scope:    [≤20 words: site type, period, material]
Stages completed:    [list]
Data condition:      [≤15 words]

─── B. INTERACTION MAP ───

| Stage | Action | What changed |
| --- | --- | --- |
| [0–6] | [tag] | [≤15 words, concrete, not evaluative] |

▸ Most active: [stage + count]
▸ Accepted without change: [stages]
▸ User-initiated content: [1 sentence, or "None"]

─── C. SELF-REFLECTION ───
[user's answer, near-verbatim — preserve voice, do not paraphrase]

─── D. SESSION SIGNATURE ───
Dominant interaction style: [Contributor / Editor / Challenger / Observer]
Bot dependency:             [Low / Medium / High]
Key insight:                [1 sentence connecting B + C]
═══════════════════════════════════════
```

## Action Tags (fixed vocabulary)

| Tag | Meaning |
| --- | --- |
| `+add` | User added content the bot did not produce |
| `−reject` | User rejected bot output |
| `~revise` | User requested revision of existing output |
| `↔replace` | User substituted bot's choice with their own |
| `?question` | User asked a question that led to a change |
| `!correct` | User corrected a factual error |

## Session Signature Criteria

**Interaction style**: Majority `+add` → Contributor · Majority `~revise` → Editor · Majority `−reject`/`↔replace` → Challenger · ≤2 total interventions → Observer

**Bot dependency** (from Interaction Map): Most content user-initiated → Low · Balanced → Medium · Bot produced most, user confirmed → High

**Key insight**: One sentence grounded in observable data from B and C. No speculation about user expertise or intentions.

## Rules

1. One row per intervention. Max 10 rows.
2. "What changed" ≤15 words, concrete, not evaluative.
3. No rows for passive confirmation ("continue", "looks good").
3a. **Retracted interventions**: If a user intervenes but then retracts (e.g., corrects something that turns out to be accurate, rejects a row that doesn't exist), still log the row in the Interaction Map with the original tag + "(retracted)" in the "What changed" column. Count retracted stages as interacted, not "accepted without change."
4. Section C: preserve user's voice. Do not paraphrase, interpret, or respond.
5. If user chose not to answer: write "User chose not to share." Do not interpret silence.
6. Do not grade the user, compare sessions, or re-open the assessment.

## Differences from the legacy in-bot version

This spec drops three things that the older inlined version had:

1. **Section C** in the report template was three lines (`▸ Surprise:` / `▸ Trust:` / `▸ Open:`) reflecting the original 3-question Debrief. With the Bezalel single-question Hebrew Debrief, Section C is now one line containing the user's verbatim answer.
2. **Trust profile** has been removed from both Section D of the template and from Session Signature Criteria. It was derived from the Trust answer in the old 3-question Debrief and is no longer applicable.
3. **Rule 5** has been rephrased from "If user answered partially..." to "If user chose not to answer..." — the new Debrief is one question, so partial-answer doesn't apply.
