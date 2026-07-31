# Session Report Spec — Post-Hoc Analytic Layer for CBSA Sessions

**Spec ID:** [CA-IP]
**Status:** Source of truth, platform-neutral. Held here as a separate document because some deployments close the session after the debrief without producing a report inline, and some produce it as part of the closing sequence.

This is the layer that turns a session into an audit trail: it records who changed what, using the fixed vocabulary of six action tags below, which is the vocabulary [`architecture.md`](architecture.md) and the Heritage 4.0 paper both refer to.

## When it runs

After a CBSA session has ended and a transcript exists. Two routes:

- **Post-hoc** — give a saved transcript to a fresh Claude, GPT or Gemini context with this specification loaded.
- **In a live session** — where the deployment does not generate the report itself, loading this specification re-enables it for that run.

**Triggers:** "session report", "analyze session", "generate [CA-IP]"

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
4. **Retracted interventions.** If a user intervenes and then retracts — corrects something that turns out to be accurate, rejects a row that does not exist — still log the row with its original tag and "(retracted)" in the "What changed" column. A retracted stage counts as interacted, not as accepted without change.
5. Section C preserves the user's voice. Do not paraphrase, interpret, or respond.
6. If the user chose not to answer, write "User chose not to share." Do not interpret silence.
7. Do not grade the user, compare sessions, or re-open the assessment.
