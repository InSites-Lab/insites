# Task for Claude Code · repo `InSites-Lab/insites` · publish the lab landing page

Context: the landing page and its GitHub Pages workflow are already committed and pushed
(commit `96a8101` on `main`, 2026-08-30). Nothing is published yet — two things are
deliberately held back:

- `site/index.html` still contains three `[[PLACEHOLDER ...]]` items.
- `.github/workflows/pages.yml` has its `push` trigger commented out, so a push does not deploy.
- GitHub Pages is **not enabled** on the repo (`gh api repos/InSites-Lab/insites/pages` → 404).

Your job is to release that hold: restore the automatic trigger, push, let the workflow enable
Pages and deploy, then verify the live URL. **Do not redesign or rewrite the page** — the only
content edit allowed is filling the three placeholders with text the user supplies.

The repo is public. Everything you push is immediately visible.

---

## Step 0 — Gate: the placeholders

```bash
grep -n "PLACEHOLDER" site/index.html
```

Three hits are expected before this task runs:

| Line | What is missing |
|------|-----------------|
| 122 | Cultural InSites paper with Chao Zhou and Eugene Ch'ng (University of Nottingham Ningbo China) — full author order, title, venue, status |
| 140 | Doctoral student 1 — name and topic, with consent |
| 141 | Doctoral student 2 — name and topic, with consent |

- **If the user supplied the replacement text** in this conversation, apply it to those three lines
  and nothing else. Keep the surrounding HTML structure (`<li>`, `<p><strong>`) exactly as it is.
- **If the user did not supply it and placeholders remain — STOP and ask.** Do not invent names,
  do not guess an author order, and do not publish a page that names doctoral students without
  the consent the placeholder text asks for.
- If `grep` returns nothing, the placeholders are already filled. Continue.

## Step 1 — Restore the automatic deploy trigger

In `.github/workflows/pages.yml`, replace the whole `on:` block with:

```yaml
on:
  push:
    branches: [main]
    paths: ["site/**", ".github/workflows/pages.yml"]
  workflow_dispatch:
```

That means: delete the three explanatory comment lines and uncomment the three `push` lines.
This restores the file to the form it had when it was prepared. Change nothing else in it.

## Step 2 — Commit and push

```bash
git status --short
```

Confirm that only `site/index.html` and `.github/workflows/pages.yml` are modified.
`.github/copilot-instructions.md` and `.github/instructions/` are untracked on purpose —
**do not add them**, and do not add this task file.

```bash
git add site/index.html .github/workflows/pages.yml
git commit -m "Fill in publications and doctoral students; enable Pages deploy on push"
git push
```

The push touches `site/**`, so it triggers the workflow immediately.

## Step 3 — Watch the run

```bash
gh run watch --repo InSites-Lab/insites
```

`actions/configure-pages@v5` runs with `enablement: true`, so the first run turns Pages on by
itself. No manual Settings change is needed.

**If the run fails on Pages permissions** — the one failure the pipeline cannot resolve alone —
enable Pages explicitly and re-run:

```bash
gh api -X POST repos/InSites-Lab/insites/pages -f build_type=workflow
```

If that returns 409 "already exists", use `-X PUT` instead. Then:

```bash
gh run rerun --repo InSites-Lab/insites <run-id>
```

## Step 4 — Verify the live page

The first deployment takes a minute or two to propagate, so an immediate 404 is not a failure —
wait and retry before concluding anything.

```bash
curl -sI https://insites-lab.github.io/insites/ | head -1
```

Expected: `HTTP/2 200`.

```bash
curl -s https://insites-lab.github.io/insites/ | grep -c "InSites Knowledge Lab"
```

Expected: `1` or more.

Both are Git Bash commands. In Windows PowerShell 5.1 `curl` is an alias for `Invoke-WebRequest`
and behaves differently — use the Bash tool, or `Invoke-WebRequest -Uri ... -Method Head`.

Also confirm no placeholder reached production:

```bash
curl -s https://insites-lab.github.io/insites/ | grep -c "PLACEHOLDER"
```

Expected: `0`. If it is not 0, say so plainly in the report.

## Step 5 — Link it from the organisation page

```bash
gh repo edit InSites-Lab/insites --homepage https://insites-lab.github.io/insites/
```

## Step 6 — Report and clean up

Report: the commit hash, the workflow run URL, the live URL, and the literal output of every
check in Step 4. If any check did not pass, report the output rather than a summary of it.

Then delete this file — it is not part of the repository.

---

## Notes

- Do not change the page's design, wording, or structure beyond the three placeholder lines.
- Do not touch `sites-data/`, `studies/`, `system/`, or `Papers/`. `Papers/` is gitignored on
  purpose (paper drafts, never published) — if anything tries to stage it, stop and report.
- The archived companion repo `InSites-Lab/Insites-CAA2026` points readers here from its README.
  Nothing in this task should touch that repo; it is archived and read-only.
