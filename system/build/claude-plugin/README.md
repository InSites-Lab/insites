# InSites — Claude plugin edition

The InSites specification packaged as a Claude plugin: each part of the specification is a skill that loads when its task arrives, instead of one file loaded in full on every turn. The text of the specification is the same as in the single-file edition; only its packaging differs.

**This folder is generated.** It is assembled by [`system/build/build.mjs`](../../build/build.mjs) from the modules in [`system/modules/`](../../modules/) and the plugin wrappers in [`system/build/claude-plugin/`](../../build/claude-plugin/). Edit those, then rebuild; edits made here are overwritten.

> **Development version.** This plugin edition has been run on one assessment. It is not yet validated for formal assessments; use it at your own discretion.

## Install

In claude.ai or the Claude desktop app, open **Customize → Plugins → Add → Add marketplace** and enter `InSites-Lab/insites`, then add **insites**. The plugin is saved to your account and becomes available in chat, Cowork and Claude Code.

Use the plugin **or** the single-file edition in a Project's instructions, not both: two copies of the core rules in one conversation can disagree as soon as one of them is updated.

## Updates

A new version is published from the `main` branch with a new version number; a change without a new number does not reach installed copies.

- **Installed in claude.ai or the desktop app:** the update reaches your account by itself once it syncs from the repository. To take it at once, open **Customize → Plugins**, and on the `InSites-Lab/insites` marketplace choose **Check for updates**; **Sync automatically** keeps it current. One update serves chat, Cowork and Claude Code.
- **Installed in Claude Code with `/plugin`:** that is a separate copy, and it does not update by itself. Run `/plugin marketplace update insites-lab`, then `/reload-plugins`; or turn on auto-update for the marketplace under `/plugin` → Marketplaces.

The version you are running is in `.claude-plugin/plugin.json`.

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

Upload the site documentation and say **begin assessment** (Hebrew: **התחל הערכה**). If the assessment does not start, choose **assess** from the `/` menu (in Claude Code, `/insites:assess`): the same skill, started explicitly.

An assessment always starts from `assess`. The `knowledge-graph` and `dashboard` skills, also in the `/` menu, draw on an assessment's approved stages; ask for them by their words (`kg`, `dashboard`) once you have them. `read-assessment` and `read-collection` start from a completed assessment that you upload or paste.

After each stage, correct, expand, go back, or say **continue**. In Hebrew, say so at the start; the Hebrew overlay applies to every heading and label.

No mark means stated in the sources; 〰️ marks inference; 💭 marks interpretation open to challenge. The marks support your judgment; your approval does not by itself make a claim a fact.

---

**גרסת פיתוח:** הורצה על הערכה אחת. טרם אומתה להערכות פורמליות; השימוש לפי שיקול דעתכם.

תוסף זה הוא אותו מפרט InSites, ארוז כסקילים שנטענים לפי הצורך. התקינו דרך Customize → Plugins → Add marketplace עם `InSites-Lab/insites`. אל תשלבו אותו עם קובץ ההנחיות המלא בהוראות של פרויקט. העלו את חומרי האתר וכתבו **התחל הערכה**; אם ההערכה לא מתחילה, בחרו **assess** מתפריט ה־`/`. גרסה חדשה מגיעה לחשבון כשהיא מסתנכרנת מהמאגר; כדי לקבל אותה מיד: Customize → Plugins → Check for updates.
