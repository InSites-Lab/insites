# Studies

Records of research done with [*InSites*](../README.md), an AI environment for context-based significance assessment (CBSA) of heritage places, in which a language model carries out the assessment stage by stage and an expert reviews every stage. Each folder is a dated record, not live documentation.

| Folder | What it is | State | Cite as |
|---|---|---|---|
| [`cases/`](cases/) | Heritage places on which *InSites* is tested | Grows as cases are added | |
| [`heritage4.0-tuba-2026/`](heritage4.0-tuba-2026/) | Evidence base for the Heritage 4.0 paper, Florence 2026 | Static | The tagged snapshot [`v1.0.0`](https://github.com/InSites-Lab/insites/tree/v1.0.0) |
| [`digital_heritage-course-study/`](digital_heritage-course-study/) | Course study with non-heritage students: the study in brief | The manuscript is under review | |
| [`Cultural-InSites-Paper/`](Cultural-InSites-Paper/) | The archived specification used in that study | Static | The tagged snapshot [`cultural-insites-v1.0`](https://github.com/InSites-Lab/insites/tree/cultural-insites-v1.0/studies/Cultural-InSites-Paper) |

The current system is in [`../system/`](../system/README.md) and [`../docs/`](../docs/README.md).

## A record and the current specification

The findings reported in the Heritage 4.0 paper belong to **one run of one version** of the Claude implementation, archived in `heritage4.0-tuba-2026/system/`. The specification in `../system/` has developed since, partly because of what that session exposed: a rule now forbids advancing after a revision until the expert confirms, the prose around a mark must match its epistemic status, and synthesis carries a different mark. **The two are not comparable as performance**, and the paper does not compare them. Cite the tagged record for findings and the live specification for architecture.

The Cultural-InSites specification is likewise a record: the version a class of students used. It is not a prior version of the current specification, and no performance comparison to it is intended or supported either.
