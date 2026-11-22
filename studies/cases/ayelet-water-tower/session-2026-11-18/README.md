# Demonstration session, 18 November 2026: the Ayelet HaShachar water tower

This folder records one demonstration session of *InSites* on the water tower of Kibbutz Ayelet HaShachar, with a heritage expert reviewing every stage. It is a demonstration, not an evaluation of the system.

## What is here

| | |
|---|---|
| [`assessment-report.pdf`](assessment-report.pdf) | The full report the system exported at the end of the session: Stages 0–6, the explanation of the context-effect relationships, the semiotic reading, the Session Report with the map of the expert's interventions, and the expert's own notes |
| [`transcript.md`](transcript.md) | The whole session, turn by turn, with the expert's replies |
| [`html/`](html/) | The three interactive pages as they were published in the session, to open online: the [knowledge graph](https://insites-lab.github.io/demos/ayelet-water-tower-2026-11-18/kg.html), the [dashboard](https://insites-lab.github.io/demos/ayelet-water-tower-2026-11-18/dashboard.html) and the [semiotic reading](https://insites-lab.github.io/demos/ayelet-water-tower-2026-11-18/semiotic-reading.html). The same files are kept in this folder; the graph and the dashboard load the `atar-runtime` package, version 0.3.8, from a public CDN |

## The run

- **Date:** 18 November 2026; the expert's working time was about 18:30–21:30 Israel time, and the transcript keeps the exact time of every turn. Turns 46–51, the Session Report and the final export, were added in the same conversation on 19 November.
- **Specification:** the *InSites* plugin, edition 0.1.6, at the tag [`plugin-0.1.6`](https://github.com/InSites-Lab/insites/tree/plugin-0.1.6/system/claude/plugin).
- **Model:** Opus 5.5, in the claude.ai chat.
- **Expert:** Yael Alef.
- **Language:** English.

## The stages

The intervention column follows the map in the Session Report. Turn numbers refer to the transcript.

| Stage | Produced | Expert's interventions | Turns |
|---|---|---|---|
| 0 Preliminary review | A first reading of the sources and what they lack | Added facts: the assessment chapters were left out on purpose, the designer, the listing and restoration, the oven | 0–2 |
| 1 Contexts | Five contexts and a timeline | Questioned one claim; added the 2018 photograph, the news report, restoration details and two dates | 3–10 |
| 2 Values | Six values and a table of attributes, values and implications | Raised an economic value; rejected one interpretation of the decoration; approved a narrower wording | 11–20 |
| 3 Authenticity and integrity | The integrity of the fabric after the 2018 restoration | Accepted without change | 21–22 |
| 4 Comparison | Comparison with other concrete water towers of the 1920s | Accepted; a fuller comparison was deferred | 23–24 |
| 5 Significance | The statement of significance | Revised which value leads the statement | 25–28 |
| Knowledge graph | The graph, and an explanation of the context-effect relationships | Revised the spring node | 29–33 |
| 6 Summary | The assessment summary | Accepted without change | 34–35 |
| Reading | The semiotic reading, with photographs | Chose the reading and asked for the photographs | 36–43 |
| Dashboard | The dashboard | Asked for it, with map points | 44–45 |
| Session Report | The debrief, the expert's notes and the Word export | Gave feedback and notes for the record | 46–51 |

In turn 27 the water value moved to the top of the list of values. The transcript shows each stage as it unfolded; the final wording of every stage is in the report and in the dashboard.

## Sources

Two files were uploaded at the start:

| File | What it is | SHA-256 |
|---|---|---|
| [`ayelet-water-tower-documentation-without-assessment.pdf`](../ayelet-water-tower-documentation-without-assessment.pdf) | The 2014 documentation file of the tower without its three assessment chapters (Hebrew, 48 pages), in this case folder | `F72C8AD983556E3283B36E8E78B0C2CD97D85FE52B64EC64F449D5E2FC4DECC2` |
| `amit-cohen-alef-2017-kfar-giladi-ayelet-hashachar.pdf` | A published article, cited here and not distributed in this repository: Amit-Cohen, I., & Alef, Y. (2017). Cultural built heritage in Kfar Giladi and Ayelet Hashachar: Shaping and preserving the identity of the two kibbutzim. *Horizons in Geography*, 91–92, 317–333 [in Hebrew]. https://www.jstor.org/stable/26598026 | `B0379123B0654BBFF0C77E4D49EC6A7ED9C006EAEB5A6276564B4BC6969F41B8` |

What else entered the session:

1. Soskin's 1923 photograph of the tower, uploaded with the first message (turn 0). Hidden in the shared copy of the conversation.
2. The expert's opening instruction, given in answer to the assistant's question: the assessment focuses on the tower (turn 1).
3. The expert's additions to the data: ICA as designer, the listing and restoration, the bakery oven, the 2018 restoration details, and the dates of the bakery and the signalling (turns 2, 6, 8, 10).
4. A photograph of the tower after the 2018 restoration, uploaded by the expert (turn 6). Hidden in the shared copy.
5. A news report on the 2018 reopening: Eli Ashkenazi, Walla, 17 March 2018 (in Hebrew), https://www.walla.co.il/news/israel/3142732. The expert gave the address and the assistant read it (turns 6 and 7).
6. The assistant's own knowledge outside the sources, marked as such in its answer: the founding of ICA by Baron Maurice de Hirsch (turn 19).
7. Coordinates for the dashboard map, from a web search the assistant made at the expert's request (turn 45).
8. A search of earlier conversations, which the assistant ran at the start (turn 1). Its query and result are not in the shared copy, so what it returned is unknown.
9. A condensed version of the two files with six images, which the assistant produced at the expert's request with a skill outside the *InSites* plugin (turn 3).

## Image credits

For the images in the report and in the semiotic reading:

| Image | Credit |
|---|---|
| The newly finished tower, 1923 | Soskin, 1923. Lavon Institute, sos-80-1501 |
| ICA Bureau Technique drawing of the tower, 22 June 1922 | Central Zionist Archives, J15/4046/9 |
| The tower under construction, 1923 | Lavon Institute, P2072 |
| The tower behind two hikers, 1938 | PikiWiki Israel, 5755 |
| The plaque on the north face, and the tower in 2012 | Photographs by Y. Alef, 2012 |
| The restored tower at its reopening, 2018 | Photograph by Geff Ashner, 2018. In the report it is Figure 2, captioned "Photograph supplied by the assessor"; the report is kept as it was produced |

## How the transcript was collected

The transcript was built by a script from the shared copy of the conversation after the session; nothing was typed or pasted by hand. Paths in the assistant's working folder are shown as `<session-workspace>`.
