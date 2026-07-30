---
name: claim-extractor
description: Extract and classify substantive claims from CBSA assessment sessions (Stages 0–6). Produces a structured, reproducible claim-level dataset with epistemic analysis and cross-tabulations. Trigger on "extract claims", "claim analysis", "count claims", "claim extraction".
user-invocable: true
---

# Claim Extraction Agent — CBSA Session Analysis

**Purpose**: Systematic extraction and epistemic classification of substantive claims from AI-assisted heritage assessment session output (CBSA Stages 0–6). Produces a reproducible dataset with quantitative epistemic analysis for research.

**Method**: Directed qualitative content analysis with stage-aware extraction rules. Each claim is identified at the analytical-move level, classified, and traced to its source basis.

**Default transcript**: `InSites-Brain/Claude/tests/tz-textonly.md`
**Scope**: CBSA assessment sessions (Stages 0–6). Dedicated to this structure for extraction accuracy.

---

## Codebook: What Counts as a Claim

### Definition
A **substantive claim** is a discrete statement that does ONE of:
- Attributes significance to the site or an aspect of it
- Interprets evidence (moves beyond describing to analyzing)
- Identifies a heritage value or context
- Draws a connection between two or more pieces of evidence
- Makes an analytical judgment (comparison, evaluation, framing)

### Unit of Analysis
The unit is the **analytical move** — a discrete argumentative step the bot takes. Supporting evidence, qualifiers, and elaboration within the same move do not create separate claims. When in doubt, keep as one claim.

### Exclusions (NOT claims)
- Procedural text: stage introductions, "shall I continue?", status lines
- Direct source quotation without interpretation (pure extraction)
- Formatting, structure, headers, labels
- Restatements of the same claim in a later stage (count only the FIRST occurrence)
- Source citations themselves (the bracket references)
- Pure geographic/physical description (location, dimensions, materials)
- Timeline entries (extracted facts, not analytical moves)
- Table rows that reformat content already counted in prose
- Reflection questions (💡 sections) — see Stage-Specific Rules

### Stage-Specific Extraction Rules

| Stage | What to count | What NOT to count |
|-------|--------------|-------------------|
| **Stage 0** (Preliminary) | Analytical judgments about documentation quality, gap identifications that frame later stages | Checklists, source labels, formatting, gap lists (inventory, not claims) |
| **Stage 1** (Description + Contexts) | **Site Description (1.1)**: Count ONLY sentences that make analytical judgments beyond any single source (e.g., "densest and best-preserved" = claim; "basalt hill at 260m" = not a claim). **Contexts**: 1 claim per context paragraph — the context paragraph IS the analytical move. The inward effect + outward effect + planning implication = 1 analytical move per context. Do NOT split into sub-claims. | Pure geographic/physical description, timeline entries (extracted facts), planning implication lines (applications, not claims) |
| **Stage 2** (Values) | 1 claim per value definition. Value dynamics (reinforcement/tension between values) = 1 claim per relationship identified. | Attribute table rows (reformat value definitions already counted) |
| **Stage 3** (Authenticity/Integrity) | 1 claim per Nara Grid dimension assessment (the rating + justification = 1 claim). Integrity condition description = 1 claim per distinct finding. | Nara Grid table rows (same content as dimension paragraphs). |
| **Stage 4** (Comparison) | 1 claim per comparator assessment (the "so what" conclusion). 1 claim for the overall comparative positioning. | Comparison table rows (data, not claims). Descriptive summaries of comparator sites. |
| **Stage 5** (Significance Statement) | Count ONLY new analytical content not present in earlier stages. Most Stage 5 content is synthesis of prior claims — mark as "restates C-xxx" and exclude. | Restatements of earlier claims (aggressive dedup here). |
| **Stage 6** (Quality Check) | Reliability assessments, identified limitations, next-step recommendations that frame analytical gaps. | Process summaries, "strengths" lists that restate prior content. |
| **Reflection (💡)** | NOT claims — exclude entirely. These are prompts for the user, not analytical positions. Exception: only if the bot explicitly proposes an alternative explanation (not just asks about one). | Questions, hypothetical framings. |
| **Expert directives** | Expert-directed changes MODIFY existing claims (update expert response to "reframed" or "expert-added"). Count as a NEW claim ONLY if expert introduces entirely new content absent from all bot output. | Expert corrections that adjust existing claims. |

### Granularity Decision Tree

```
Is this a single context/value/dimension paragraph? → 1 claim (the paragraph)
Does it contain two independently assessable propositions? → Consider splitting
  But: do both halves serve the SAME analytical purpose? → Keep as 1
  Only split when: one half could be validated while the other is rejected
```

### Boundary Cases

- **Hedged claim**: Still a claim. "The site MAY have served as a regional center" = 1 claim (the hedge affects classification, not extraction).
- **Question posed**: NOT a claim unless the question itself implies an analytical position. "Could corbelling be a prototype?" = NOT a claim (it's a question from source). "This raises the question of whether..." = 1 claim IF the bot is using the question as an analytical move.
- **Repetition across stages**: Count at first occurrence only. If Stage 5 restates a Stage 1 insight, note it as "repeated from C-xx" but don't double-count.

---

## Classification Scheme

### Epistemic Status (bot-assigned)
| Code | Meaning | How to identify |
|------|---------|----------------|
| **unmarked** | Presented as explicit in sources | No ° or 💭 marker; prose is assertive |
| **°** | Inferred from 2+ evidence pieces | ° marker present, or context paragraph marked ° |
| **💭** | Interpretive hypothesis | 💭 marker present |
| **should-be-°** | Bot left unmarked but claim combines sources | Post-hoc reclassification by analyst |
| **should-be-💭** | Bot left unmarked but claim is speculative | Post-hoc reclassification by analyst |

### Expert Response
| Code | Meaning |
|------|---------|
| **validated** | Expert explicitly confirmed or praised |
| **accepted** | Expert did not challenge (implicit acceptance) |
| **reframed** | Expert adjusted the framing but kept the substance |
| **challenged** | Expert questioned the basis or accuracy |
| **rejected** | Expert removed or contradicted the claim |
| **expert-added** | Expert directed the bot to add this claim |

### Content Type
| Code | Meaning |
|------|---------|
| **extraction** | Directly traceable to a single source passage |
| **synthesis** | Combines information from 2+ sources |
| **inference** | Draws a conclusion not explicit in any source |
| **hypothesis** | Speculative interpretation beyond evidence |
| **overreach** | Introduces language/concepts absent from all sources |
| **missed** | Content present in sources but not surfaced |

---

## Workflow

When invoked, follow these steps:

### Step 1: Intake
Read the session transcript. Identify:
- Which assessment stages are present (0–6)
- What source documents were used
- Whether expert responses are included in the transcript

Report intake summary before proceeding.

### Step 2: Stage-by-Stage Extraction
For EACH stage present:
1. Read the bot's output for that stage
2. Identify each substantive claim using the codebook and **stage-specific rules** above
3. Apply the granularity decision tree to determine claim boundaries
4. Assign a sequential ID (C001, C002, ...)
5. Record the claim text (verbatim or close paraphrase)
6. Note the stage number

**Stop after each stage** and report: "Stage N: extracted X claims. Proceeding to Stage N+1."

### Step 3: Classification
For each extracted claim, classify:
- **Epistemic status**: What marker did the bot assign? Is it correct?
- **Expert response**: How did the expert respond? (if expert responses available)
- **Content type**: extraction / synthesis / inference / hypothesis / overreach / missed

### Step 4: Cross-Stage Deduplication
Scan for claims repeated across stages. Mark later occurrences as "repeated from C-xxx" and exclude from count. Stage 5 is the primary deduplication target — most of its content restates earlier stages.

### Step 5: Output

Generate a structured report with:

#### A. Metadata
```
Session: [identifier]
Date analyzed: [date]
Source file: [path]
Stages covered: [list]
Extraction agent: Claude Code claim-extractor v1.1
Codebook version: 1.1
```

#### B. Claim Table (markdown)
| ID | Stage | Claim text | Bot marking | Expert response | Content type | Notes |
|----|-------|-----------|-------------|-----------------|-------------|-------|

#### C. Summary Statistics
- Total claims by stage
- Claims by epistemic status (unmarked / ° / 💭 / reclassified)
- Claims by expert response
- Claims by content type

#### D. Boundary Decisions Log
Document every non-obvious granularity or classification decision:
```
Decision: C012 — counted as 1 claim, not 2
Reason: "unexcavated and therefore an intact archive" — the "therefore" makes this a single inference chain, not two independent assertions.
```

### Step 6: Epistemic Analysis

Compute and present the following. All rates as fractions AND percentages.

#### A. Notation Accuracy Table
| Metric | Count | Rate | What it shows |
|--------|-------|------|---------------|
| Total claims | n | — | Dataset size |
| Marked by bot (° or 💭) | n | n/total | Marking rate — how often bot flags uncertainty |
| Correctly marked | n | n/marked | Precision — when bot marks, is it right? |
| Under-marked (should-be-° or should-be-💭) | n | n/(unmarked total) | Recall gap — uncertain claims that got missed |
| Over-marked | n | n/marked | False positive rate |
| Net accuracy | n | (correct unmarked + correct marked)/total | Overall epistemic classification |

#### B. Expert Response Profile
| Response | Count | % of total |
|----------|-------|------------|
| validated | | |
| accepted | | |
| reframed | | |
| challenged | | |
| rejected | | |
| expert-added | | |

Derived metrics:
- **Acceptance rate** = (validated + accepted) / total
- **Intervention rate** = (reframed + challenged + rejected + expert-added) / total
- **Substantive error rate** = rejected / total

#### C. Content Type Distribution
| Type | Count | % |
|------|-------|---|
| extraction | | |
| synthesis | | |
| inference | | |
| hypothesis | | |
| overreach | | |

#### D. Cross-Tabulations

**D1. Epistemic status × Expert response** (KEY TABLE — does marking predict expert reaction?):

|  | validated | accepted | reframed | challenged | rejected | expert-added | Total |
|--|-----------|----------|----------|------------|----------|--------------|-------|
| unmarked | | | | | | | |
| ° | | | | | | | |
| 💭 | | | | | | | |
| should-be-° | | | | | | | |
| should-be-💭 | | | | | | | |
| **Total** | | | | | | | |

**D2. Content type × Bot marking** (does synthesis/inference get flagged?):

|  | unmarked | ° | 💭 | Total |
|--|----------|---|---|-------|
| extraction | | | | |
| synthesis | | | | |
| inference | | | | |
| hypothesis | | | | |
| overreach | | | | |

**D3. Stage × Marking accuracy** (does accuracy degrade over the session?):

| Stage | Claims | Correctly marked | Under-marked | Accuracy % |
|-------|--------|-----------------|--------------|------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| 6 | | | | |

#### E. Enabler Analysis — Key Questions

Answer each with specific numbers from the tables:

1. **Does notation work as an epistemic enabler?**
   Compare expert rejection/challenge rate for marked (° or 💭) vs. unmarked claims.
   If marked claims get challenged MORE → notation correctly flags risky content.
   If no difference → notation is decorative, not functional.

2. **Does governance catch what notation misses?**
   Count under-marked claims (should-be-°/💭) where the expert intervened anyway.
   High catch rate → governance compensates for notation gaps.

3. **What is the error asymmetry?**
   Under-marking count vs. over-marking count.
   Directional bias tells us whether the bot is overconfident or overcautious.

4. **Which content types are most dangerous?**
   Rank content types by (rejected + challenged) / count.
   Shows where the bot's reasoning breaks down.

5. **Does the bot improve across stages?**
   Compare marking accuracy Stage 1-2 vs. Stage 4-5.
   Improvement → bot calibrates to expert feedback within session.

#### F. Key Findings (3-5 bullets)
Write 3-5 findings in plain language, each citing specific numbers.
These must be suitable for direct citation in the Heritage 4.0 paper.
Format: "[Finding]. ([numerator]/[denominator], [percentage]%)"

Save the full report to `InSites-Brain/Heritage4.0/evidence/claim-extraction-[date].md`.

---

## Reproducibility Protocol

When running a **comparison extraction** (re-extracting claims from a previously analyzed session):

1. Do NOT read the previous extraction first — extract blind
2. After completing extraction, read the previous extraction
3. Produce a comparison table:

| Previous ID | New ID | Match? | Divergence reason |
|------------|--------|--------|-------------------|
| C001 | C001 | Yes | — |
| C002 | C002+C003 | Split | Granularity: previous counted compound as 1, this extraction split at "and" |
| C009 | — | Missing | Not extracted: borderline between claim and source quotation |

4. Report: total previous / total new / exact matches / splits / merges / additions / omissions

This comparison is the reproducibility evidence for the research method.

---

## Version
- Codebook v1.1 — 2026-03-25
- v1.1: CBSA-dedicated stage-aware extraction rules; analytical-move granularity (prevents inflation); Step 6 epistemic analysis with cross-tabulations and enabler analysis
- v1.0: Initial codebook based on extraction documented in `Heritage4.0/evidence/Claim-Level-Count-2303.md` (45 claims). Produced 106 claims on re-extraction due to assertion-level granularity — led to v1.1 calibration.
