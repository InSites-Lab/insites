# InSites for Claude · v11.5

On Claude, InSites comes in two editions of the same specification. Use one **or** the other in a conversation, never both: two copies of the core rules can disagree as soon as one of them is updated.

| | Single file | Plugin |
|---|---|---|
| **What you load** | [`V-11.5/InSites-claude-v11.5.md`](V-11.5/InSites-claude-v11.5.md), in a Project's instructions or at the start of a session | [`../claude-plugin/insites/`](../claude-plugin/insites/), installed once to your account from the marketplace `InSites-Lab/insites` |
| **Status** | The established edition | Development version: not yet validated for formal assessments; use at your own discretion |
| **Start** | Upload, say **start** | Upload, say **begin assessment** (**התחל הערכה**), or choose **assess** from the `/` menu |
| **New versions** | Replace the file by hand | Through the plugin's update; see [its README](../claude-plugin/insites/README.md) |

Both are built from the same [modules](../modules/), and the text of the specification is the same in both; only the packaging differs. How the plugin is put together: [`docs/plugin-architecture.md`](../../docs/plugin-architecture.md).

## The single file

Load the [current specification](V-11.5/InSites-claude-v11.5.md) into your Claude session. Use a separate session for each heritage site.

1. Ask Claude to follow the specification, choose your working language, and wait for source material.
2. Upload site documents, photographs or drawings with source/page identifiers, then say **start**. Check the Stage 0 inventory and missing information.
3. Review each stage before saying **continue**. Use **expand**, **go back to Stage 2**, or give a correction; revisions also require your approval.
4. Request a **knowledge graph**, **dashboard**, or **read assessment** when needed. Reading an existing assessment is also supported.
5. Save the conversation and approved outputs before ending the session.

## The plugin

1. **Install** once: in Claude, **Customize → Plugins → Add → Add marketplace**, enter `InSites-Lab/insites`, then add **insites**. A marketplace is a repository that offers plugins; this one is this repository.
2. **Start**: upload the site documentation and say **begin assessment** (Hebrew: **התחל הערכה**). If it does not start, choose **assess** from the `/` menu.
3. **Update**: new versions arrive through the plugin's **Check for updates**.

Its [README](../claude-plugin/insites/README.md) lists the seven skills and the epistemic-auditor agent, and gives the update steps in full.

## In both

No mark means stated in sources; 〰️ marks inference; 💭 marks interpretation open to challenge. Check citations and question unsupported conclusions. The assistant supports your judgment; your approval does not by itself establish a claim as fact.

לעבודה בעברית, בקשו בתחילת השיחה לעבוד בעברית. לאחר כל שלב אפשר לבקש הרחבה, לתקן או לאשר המשך. שמרו את המקורות ואת התוצרים שאישרתם.

## For maintainers

Both editions are generated; do not edit them directly. The source is [`../modules/`](../modules/), and the build is [`../build/build.mjs`](../build/build.mjs). The plugin's wrappers live in [`../build/claude-plugin/`](../build/claude-plugin/), and [`.claude-plugin/marketplace.json`](../../.claude-plugin/marketplace.json) at the repository root is what makes `InSites-Lab/insites` a marketplace. See [`docs/plugin-architecture.md`](../../docs/plugin-architecture.md).
