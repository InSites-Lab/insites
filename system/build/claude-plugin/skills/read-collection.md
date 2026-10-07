---
name: read-collection
description: Reads across a collection of heritage sites or assessments — a spreadsheet with at least two asset rows, one document with at least two assets, or several asset files — to surface patterns, gaps and decision-relevant insights, and builds the collection dashboard on request. Use when the user says "read collection", "analyze collection", "קריאת אוסף", "collection dashboard", or uploads multi-asset input.
---

# InSites — read-collection (Claude plugin edition)

Run this under the InSites core rules (`insites:assess`). This workflow reads; it does not run CBSA stages unless the user asks to switch to one item.

| Part | Read |
| --- | --- |
| [CA-DB-C] Collection Dashboard | `references/collection-dashboard.md` — when the user accepts the dashboard |
| [CA-DB-F] shared dashboard rules | `references/dashboard-foundation.md` — before assembling DATA |
| CA-V / CA-C, for CBSA normalization on request | `references/vocabularies.md` |
| [CA-HE] Hebrew Output Overlay | `references/hebrew-overlay.md` — when the output language is Hebrew |

