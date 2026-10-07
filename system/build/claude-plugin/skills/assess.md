---
name: assess
description: Runs the InSites context-based significance assessment (CBSA) of a heritage place, Stage 0 to Stage 6, with an expert review and a hard stop after every stage, epistemic marks on every claim, and a closing session report. Use when the user uploads heritage documentation and says "start", "let's begin", "begin assessment", "התחל", "בוא נתחיל", "התחל הערכה"; when they say "continue", "go back to Stage N", "expand", "save progress", "resume capsule", "שמור התקדמות", "נמשיך מחר"; when they paste a 🧷 InSites Resume Capsule; or when they ask "what is InSites?" or "what is CBSA?". This skill also holds the core rules that every other InSites skill runs under.
---

# InSites — CBSA assessment (Claude plugin edition)

This skill carries the InSites specification. Everything below the line "PART 1: System & Governance" is the **always-on core**: it governs every turn of the session, including turns in which another InSites skill is active.

## How this edition is laid out

The single-file edition holds every section in one document. Here the core is below, and the rest is split so that each part is read when it is needed. The text of each part is unchanged.

**Before writing a stage, read its file.** One stage per turn; never read ahead into the next stage's file.

| Part named in the core | Read |
| --- | --- |
| Stage 0 … Stage 6 | `references/stage-0.md` … `references/stage-6.md` |
| [CA-IP] Session Report, debrief | `references/session-report.md` |
| [GB-1], [CA-V], [CA-C], [CA-T], [SM-3], [CA-E], [CA-CS] | `references/vocabularies.md` — read at Stage 1 and use through Stage 5 |
| [CA-HE] Hebrew Output Overlay | `references/hebrew-overlay.md` — read before the first Hebrew output |
| [CA-IMG] Image Analysis Aid | `references/image-analysis.md` |
| Resume Capsule, Heavy-turn pre-flight | `references/continuity.md` |

**Parts that live in other skills of this plugin.** When their trigger arrives, load that skill and follow it. The core rules here keep applying.

| Part named in the core | Skill |
| --- | --- |
| [CA-KG] Knowledge Graph (`kg`, `גרף ידע`) | `insites:knowledge-graph` |
| [CA-DB] Assessment Dashboard (`dashboard`, `דשבורד`) | `insites:dashboard` |
| [MA-RA] Read-Assessment (`read assessment`, `קריאת הערכה`) | `insites:read-assessment` |
| [MA-RC] Read-Collection and [CA-DB-C] Collection Dashboard (`read collection`, `קריאת אוסף`) | `insites:read-collection` |
| Standalone Specification Command (`spec`, `מפרט`) | `insites:stage-spec` |

**Epistemic audit, on request.** When the user asks to audit a stage ("audit", "בדוק סימון", "בדיקה אפיסטמית") and the `epistemic-auditor` agent is available (Cowork, Claude Code), send it the stage output and the source files, then present its findings to the user without changing the output yourself. In chat, where agents do not run, apply the Per-Claim Epistemic Gate again to the stage output and say plainly that this is a self-check, not an independent one.

**Test Mode** needs the separate `test-mode.md`; without it, ignore Test-Mode triggers, as the core says.

