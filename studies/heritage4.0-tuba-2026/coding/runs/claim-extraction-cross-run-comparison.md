# Cross-Run Comparison — Three Independent Claim Extractions

**Purpose**: Reproducibility evidence. Three independent extractions of the same CBSA session transcript, using the same codebook (v1.1), run in parallel without access to each other's results.

**Source**: `InSites-Brain/Claude/tests/tz-textonly.md` (Tuba-Zangariyye Dolmen Field assessment)
**Date**: 2026-03-25
**Extractor**: Claude Code claim-extractor v1.1 (three parallel agents)

---

## 1. Claim Counts

| Stage | Run A | Run B | Run C | Range | CV% |
|-------|-------|-------|-------|-------|-----|
| 0 (Preliminary) | 2 | 2 | 3 | 2–3 | 22% |
| 1 (Description + Contexts) | 12 | 13 | 12 | 12–13 | 4% |
| 2 (Values) | **8** | **8** | **8** | **8** | **0%** |
| 3 (Authenticity/Integrity) | 12 | 10 | 12 | 10–12 | 9% |
| 4 (Comparison) | 4 | 4 | 5 | 4–5 | 12% |
| 5 (Significance Statement) | **2** | **2** | **3** | 2–3 | 22% |
| 6 (Quality Check) | **3** | **3** | **3** | **3** | **0%** |
| **Total** | **43** | **42** | **46** | **42–46** | **5%** |

**Mean**: 43.7 | **Median**: 43 | **SD**: 2.1 | **Coefficient of variation**: 4.8%

### Stage Stability
- **Perfect agreement** (0% variation): Stage 2 (8 claims), Stage 6 (3 claims)
- **Near-perfect** (1 claim difference): Stage 1 (12–13), Stage 4 (4–5), Stage 5 (2–3)
- **Moderate variation**: Stage 0 (2–3), Stage 3 (10–12)

Stage 3 shows the widest spread (10–12). The difference is whether the overall integrity profile summary and the documentary integrity asymmetry are counted as separate claims or folded into Nara Grid dimensions.

---

## 2. Content Type Distribution

| Type | Run A | Run B | Run C | Mean | Range |
|------|-------|-------|-------|------|-------|
| extraction | 2 (4.7%) | 2 (4.8%) | 3 (6.5%) | 2.3 (5.3%) | 2–3 |
| synthesis | 22 (51.2%) | 20 (47.6%) | 22 (47.8%) | 21.3 (48.9%) | 20–22 |
| inference | 18 (41.9%) | 19 (45.2%) | 20 (43.5%) | 19.0 (43.5%) | 18–20 |
| hypothesis | 0 | 0 | 0 | 0 | 0 |
| overreach | **1 (2.3%)** | **1 (2.4%)** | **1 (2.2%)** | **1 (2.3%)** | **1** |

**Stable finding**: Synthesis + inference = 91–93% across all three runs. Pure extraction = 5–7%. Exactly 1 overreach in every run.

---

## 3. Expert Response Profile

| Response | Run A | Run B | Run C | Mean | Range |
|----------|-------|-------|-------|------|-------|
| validated | 0 | 0 | 0 | 0 | 0 |
| accepted | 34 (79.1%) | 36 (85.7%) | 36 (78.3%) | 35.3 (80.9%) | 34–36 |
| reframed | 6 (14.0%) | 2 (4.8%) | 4 (8.7%) | 4.0 (9.2%) | 2–6 |
| challenged | 0 | 0 | 0 | 0 | 0 |
| rejected | 1 (2.3%) | 2 (4.8%) | 2 (4.3%) | 1.7 (3.8%) | 1–2 |
| expert-added | 2 (4.7%) | 2 (4.8%) | 4 (8.7%) | 2.7 (6.1%) | 2–4 |

**Derived metrics (ranges):**
- **Acceptance rate**: 78–86% (mean 81%)
- **Intervention rate**: 14–22% (mean 19%)
- **Substantive error rate (rejected)**: 2.3–4.8% (mean 3.8%)

### Reframing vs. Rejection Variance
The reframing count varies most (2–6). This reflects analyst judgment about whether expert feedback constitutes "reframing" vs. "acceptance with minor adjustment." The rejection count is more stable (1–2); the difference is whether the "authenticity dilemma" correction counts as rejection (B, C) or reframing (A).

---

## 4. Epistemic Notation Analysis

| Metric | Run A | Run B | Run C | Range |
|--------|-------|-------|-------|-------|
| **Marking rate** | 9/43 = 20.9% | 7/42 = 16.7% | 9/46 = 19.6% | 17–21% |
| **Precision** (when bot marks, is it right?) | 9/9 = 100% | 6/7 = 85.7% | 9/9 = 100% | 86–100% |
| **Under-marked** | 5/34 = 14.7% | 12/35 = 34.3% | 4/37 = 10.8% | 11–34% |
| **Over-marked** | **0** | **0** | **0** | **0** |
| **Net accuracy** | 38/43 = 88.4% | 28/42 = 66.7% | 42/46 = 91.3% | 67–91% |

### What's Stable vs. Variable

**Perfectly stable across all 3 runs:**
- Over-marking = 0 (the bot never falsely flags a claim as uncertain)
- The asymmetry is always one-directional: under-marking only
- Both rejected claims are always unmarked
- Marking rate is consistently low (~17–21%)

**Variable (analyst judgment):**
- Under-marking count: 4–12 (high variance). This is the most significant disagreement between runs.
- Net accuracy: 67–91% (driven entirely by under-marking variance)

### Why Under-Marking Varies
The disagreement is about what "should have been marked." Run B applied the strictest standard — any claim combining 2+ sources should carry °, even if the combination is straightforward. Runs A and C applied a looser standard — routine synthesis (combining a location from Source A with a date from Source C) doesn't need ° unless the combination produces a novel interpretation. This is a genuine methodological question the codebook doesn't fully resolve.

**Conservative estimate** (Run B): 12 under-marked, 67% accuracy
**Liberal estimate** (Runs A/C): 4–5 under-marked, 88–91% accuracy

---

## 5. Enabler Analysis — Convergent Findings

These findings are stable across all three runs:

### Finding 1: The Bot is an Analytical Engine, Not a Summarizer
Synthesis + inference = 91–93% of all claims. Only 5–7% are pure extractions. The CBSA bot generates interpretive content that requires expert oversight. (Stable: all 3 runs agree within 2 percentage points.)

### Finding 2: Notation Precision is High, But Deployed Sparingly
When the bot marks a claim, it is correct 86–100% of the time. But it marks only 17–21% of claims. The bot never over-marks (0/0/0 across runs). The error is always under-marking — presenting uncertain content as established. (Stable: 0 over-marks in all 3 runs.)

### Finding 3: Both Rejected Claims Were Unmarked Conceptual Errors
In every run, the rejected claim(s) were unmarked. The bot's most problematic outputs — the political context overreach and/or the "authenticity dilemma" misapplication — carried no epistemic flag. Notation failed precisely where it was most needed. (Stable: 100% of rejections were unmarked across all 3 runs.)

### Finding 4: Expert Governance Catches What Notation Misses — But Selectively
The expert caught conceptual errors (overreach, misapplied frameworks) but did not systematically catch under-marked claims. Governance operates at the "is this relevant/correct?" level, not at the "is this properly flagged?" level. (All 3 runs agree: governance catch rate for subtle under-marking is low.)

### Finding 5: Marking Accuracy Improves Across the Session
All 3 runs show improvement from early stages to later stages, though the pattern differs:
- Run A: 80% → 92% → 100% (monotonic improvement)
- Run B: 71% → 50% → 80% (mid-session dip in Stages 3–4)
- Run C: 83% → 100% (improvement from Stage 3 onward)

The early-stage interventions (tone directive, thematic context correction, political context rejection) appear to calibrate the bot's epistemic posture — but the effect is not perfectly consistent.

### Finding 6: Stage 5 is Predominantly Restatement
All 3 runs found only 2–3 genuinely new claims in Stage 5 (the significance statement). The rest restated prior stages. All new Stage 5 content was expert-directed (collective cohesion, monumental presence, pastoralist continuity). This confirms Stage 5's role as synthesis, not new analysis.

---

## 6. Summary Table — Robust Findings for the Paper

| Finding | Value | Confidence |
|---------|-------|------------|
| Total claims (analytical-move level) | 42–46 (mean 43.7, CV 4.8%) | High — stable across runs |
| Synthesis + inference share | 91–93% | High — all runs agree |
| Extraction share | 5–7% | High |
| Overreach count | 1 in all runs | Stable |
| Marking precision | 86–100% | High (lower bound = Run B's 1 partial mark) |
| Over-marking | 0 in all runs | Perfectly stable |
| Under-marking | 4–12 claims | **Variable** — depends on analyst threshold |
| Acceptance rate | 78–86% | Moderate — depends on reframing classification |
| Rejected claims | 1–2 | Low variance |
| Rejections unmarked | 100% in all runs | Perfectly stable |
| Session improvement | Present in all runs | Moderate — pattern varies |

---

## 7. Methodological Notes

### What This Exercise Shows
Three independent applications of the same codebook to the same transcript produced claim counts within a 4-claim range (42–46, CV=4.8%). The stage-aware extraction rules successfully constrain granularity — compared to the v1.0 codebook which produced 106 claims from the same transcript.

### Where Runs Disagree
1. **Under-marking threshold**: How aggressively to reclassify routine synthesis as "should-be-°." This is the largest source of variance and affects net accuracy significantly (67% vs 91%).
2. **Reframing vs. rejection**: Whether the expert's "authenticity dilemma" correction is a reframing (substance kept, framing adjusted) or a rejection (concept fundamentally wrong).
3. **Stage 0 and 5 boundaries**: Whether to count 2 or 3 claims in the marginal stages (preliminary review, significance statement).

### Recommendation for the Paper
Report the convergent findings (overreach count, content type distribution, marking precision, 0 over-marks, rejections-always-unmarked) and acknowledge the under-marking variance as an unresolved methodological question. The paper's central argument — that notation enables inference while governance catches notation failures — is supported by all three runs regardless of the under-marking threshold chosen.

---

*Generated by claim-extractor v1.1 cross-run comparison. Three parallel extraction agents, same codebook, same transcript, independent runs.*
