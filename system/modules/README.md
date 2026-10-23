# Specification modules

This folder is the **source** of the InSites specification, held as one module per section. It is for anyone who edits or adapts the specification. To run an assessment you do not need it: use an edition from [`../claude/`](../claude/README.md), [`../chatgpt/`](../chatgpt/README.md) or the other platform folders.

[`manifest.json`](manifest.json) lists the modules in order. Joined in that order they are the single-file Claude edition, word for word.

## What is built from here

| Edition | Built by | Output |
|---|---|---|
| Claude, single file | `node system/build/build.mjs --monolith <path>` | [`../claude/V-11.5/InSites-claude-v11.5.md`](../claude/V-11.5/InSites-claude-v11.5.md) |
| Claude plugin | `node system/build/build.mjs` | [`../claude-plugin/insites/`](../claude-plugin/insites/), with the wrappers in [`../build/claude-plugin/`](../build/claude-plugin/) |
| ChatGPT Desktop plugin | its own npm build, in [`../chatgpt/plugin/`](../chatgpt/plugin/README.md) | a packaged ZIP |

The Gemini edition and the Custom GPT files are maintained as separate ports, not built from here. The modules are kept platform-neutral so that they can be.

## How the modules are grouped

| Numbers | Content |
|---|---|
| 00–05 | Core: role, governance, rules, epistemic notation |
| 10–17 | Stages 0 to 6 and the session report |
| 20–31 | Reference material: vocabularies of values, contexts and change, the integrity model, image analysis, continuity, the Hebrew overlay |
| 40–43 | Knowledge graph and dashboards |
| 50–53 | Reading an assessment, reading a collection, the collection dashboard |

The `divider` modules and `99-end-marker.md` only structure the joined file.

## Editing

1. Edit the module, never a generated output.
2. Run `node system/build/build.mjs --check`. After a module changes it fails on purpose, because the modules no longer equal the single file named as `source` in the manifest.
3. Regenerate the single file with `--monolith` and run `--check` again; it passes, and the plugin is rebuilt in the same run.
4. If the change alters behaviour, raise the plugin version in [`../build/claude-plugin/.claude-plugin/plugin.json`](../build/claude-plugin/.claude-plugin/plugin.json) and in the root `.claude-plugin/marketplace.json`.

The build only joins and copies text; nothing it produces runs as code. Licence: Apache-2.0, as for the rest of `system/`.
