# Session notes

A one-page notes tool for the expert who runs an *InSites* assessment. It sits beside the conversation, outside it: the assistant that runs the assessment does not read the page or write to it, and nothing written in it enters the session.

The expert uses it to keep, step by step, what they want to remember and is not part of the session itself: an insight, a problem, a correction they made, a surprise, a question.

It is an early version, written for the lab's own sessions.

## What is in the page

- One field for each step of a session, in order: Stages 0 to 6, the knowledge graph, the reading of the assessment, the dashboard, and general notes.
- Several sessions in one page: a selector at the top and a **New session** button. Each session keeps its own notes, and the page's address changes with the session, so a link opens the session it names.
- **Download notes** and **Copy** give the notes of the open session as Markdown.

There is no way to rename or delete a session from the page.

## Where the notes are kept

This depends on how the page is opened.

- **Published as a Claude artifact** with the capabilities below: in the artifact's own store, and in the browser of each device as a second copy. Everyone the page is shared with at Contributor level or above reads and writes every session in it. People at Viewer level see no notes.
- **Opened as a file, or served from any web server:** in that browser only, and for one session only. **New session** needs the artifact's store and stays disabled.

Notes are never written to this repository. The page holds no notes of its own; the file here is code only.

## Publishing it as an artifact

Publish `session-notes.html` from a Claude Code session, and declare these capabilities:

```json
{
  "db": { "rules": [{ "path": "", "read": "interact", "write": "interact" }] },
  "downloads": {}
}
```

The store belongs to the published artifact: it survives a new version of the page and is erased when the artifact is deleted. A copy published from another account starts with an empty store.

The first session is named in one line near the top of the script (`FIRST`). Its notes are kept in the `notes` collection; each later session keeps its notes under `sessions/<id>/notes`, with one document in `sessions` holding its name and date.

## What it depends on

The store and the file download use the `db` and `downloads` capabilities of Claude artifacts, as they were in November 2026. Where they are absent the page falls back to the browser's own storage, and shows the notes as text to copy when a file cannot be saved. Fonts load from Google Fonts, with system fonts as the fallback.

## Licence

Apache-2.0, like the rest of `tools/`. See [`LICENSING.md`](../../LICENSING.md).
