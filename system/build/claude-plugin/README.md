# InSites — Claude plugin edition

The InSites specification packaged as a Claude plugin: each part of the specification is a skill that loads when its task arrives, instead of one file loaded in full on every turn. The text of the specification is the same as in the single-file edition; only its packaging differs.

**This folder is generated.** It is assembled by [`system/build/build.mjs`](../../build/build.mjs) from the modules in [`system/modules/`](../../modules/) and the plugin wrappers in [`system/build/claude-plugin/`](../../build/claude-plugin/). Edit those, then rebuild; edits made here are overwritten.

> **Early development version.** This plugin edition has been run on one assessment and has not been tested beyond it. It is not intended for use in real assessments yet. To run an assessment, use the single-file specification, [`InSites-claude-v11.5.md`](../../claude/V-11.5/InSites-claude-v11.5.md).

## Install

In claude.ai or the Claude desktop app, open **Customize → Plugins → Add → Add marketplace** and enter `InSites-Lab/insites`, then add **insites**. The plugin is saved to your account and becomes available in chat, Cowork and Claude Code.

Use the plugin **or** the single-file edition in a Project's instructions, not both: two copies of the core rules in one conversation can disagree as soon as one of them is updated.

## What it contains

| Skill | Starts on | Does |
| --- | --- | --- |
| `assess` | upload + `begin assessment` / `התחל הערכה` | Stages 0–6 with a stop for your review after each, the epistemic marks, the session report. Holds the core rules all the others run under |
| `knowledge-graph` | `kg` / `גרף ידע` | The knowledge graph, drawn by the pinned `atar-runtime` |
| `dashboard` | `dashboard` / `דשבורד` | The single-assessment dashboard |
| `read-assessment` | `read assessment` / `קריאת הערכה` | Readings of a completed assessment |
| `read-collection` | `read collection` / `קריאת אוסף` | Reading across several sites, and the collection dashboard |
| `stage-spec` | `spec` / `מפרט` | A standalone specification derived from one stage |
| `claim-extractor` | `extract claims` | The research coding protocol from [`tools/claim-extractor/`](../../../tools/claim-extractor/) |

| Agent | Where it runs | Does |
| --- | --- | --- |
| `epistemic-auditor` | Cowork, Claude Code | On request (`audit`, `בדוק סימון`), checks a stage output's marks against the sources with fresh context and lists mismatches. It flags; you decide. In chat, where agents do not run, the `assess` skill re-applies the gate itself and says that it is a self-check |

## Use

Upload the site documentation and say **begin assessment**. After each stage, correct, expand, go back, or say **continue**. In Hebrew, say so at the start; the Hebrew overlay applies to every heading and label.

No mark means stated in the sources; 〰️ marks inference; 💭 marks interpretation open to challenge. The marks support your judgment; your approval does not by itself make a claim a fact.

---

**גרסת פיתוח ראשונית:** הורצה על הערכה אחת ולא נבדקה מעבר לזה. אינה מיועדת עדיין להערכות אמיתיות; להערכה, השתמשו בקובץ המפרט היחיד.

תוסף זה הוא אותו מפרט InSites, ארוז כסקילים שנטענים לפי הצורך. התקינו דרך Customize → Plugins → Add marketplace עם `InSites-Lab/insites`. אל תשלבו אותו עם קובץ ההנחיות המלא בהוראות של פרויקט. העלו את חומרי האתר וכתבו **התחל הערכה**.
