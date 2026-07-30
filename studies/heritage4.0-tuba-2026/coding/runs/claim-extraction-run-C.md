# Claim Extraction Report — Run C

## A. Metadata

```
Session: Tuba-Zangariyye Dolmen Field CBSA Assessment
Date analyzed: 2026-03-25
Source file: InSites-Brain/Claude/tests/tz-textonly.md
Stages covered: 0, 1, 2, 3, 4, 5, 6
Extraction agent: Claude Code claim-extractor v1.1
Codebook version: 1.1
```

### Intake Summary

- **Stages present**: 0 through 6 (complete CBSA). Stage 5 was revised after expert feedback. Stage 6 was regenerated.
- **Source documents**: Source A (Berger et al. 2025, survey report), Source B (Alef et al., heritage management case study), Source C (Stepansky 2005, regional synthesis)
- **Expert responses**: Yes — 12 distinct expert interventions recorded across the session, ranging from corrections to rejections to content additions.
- **Non-claim sections**: KG artifact, Dashboard artifact, Session Debrief, Session Report, bot self-analysis — all excluded from extraction.

---

## B. Claim Table

| ID | Stage | Claim text (paraphrase) | Bot marking | Expert response | Content type | Notes |
|----|-------|------------------------|-------------|-----------------|-------------|-------|
| C001 | 0 | Documentation profile assessment: Source A is Tier 4 (preliminary survey), Source B is Tier 3 (case study), Source C is Tier 2 (peer-reviewed synthesis) | unmarked | accepted | extraction | Tiering judgments are analytical even though formatted as a table |
| C002 | 0 | Turville-Petre's 1931 excavation locations remain unidentified | 💭 | accepted | extraction | Marked 💭 in text — appropriate hedge |
| C003 | 0 | Critical gap: absence of community voice is significant — no oral history or community perspective documented despite Bedouin presence since 18th century | unmarked | accepted | synthesis | Combines social data from C with absence observation across all sources |
| C004 | 1 | Site Description: the field is "one of the densest and best-preserved dolmen concentrations on the Korazim Plateau" | unmarked | accepted | extraction | Close to source language in A:p.3; counted because "best-preserved" is an analytical judgment beyond any single description |
| C005 | 1 | Site Description: Cupmarks likely contemporary with dolmen construction as part of funerary ritual; mancala gameboards probably later additions by shepherds/travelers | unmarked | accepted | inference | Two temporal attributions based on reasoning, not direct evidence. Kept as 1 claim: both are temporal-attribution inferences about secondary features. |
| C006 | 1 | Geographic context: the spring-fed basalt spur position frames the field as occupying a resource node within a landscape corridor; the field reframes the Korazim Plateau as a zone where megalithic mortuary investment concentrates at well-watered spur locations | unmarked | accepted | synthesis | 1 context paragraph = 1 claim (inward + outward effect) |
| C007 | 1 | Landscape context: inter-visibility between dolmen clusters suggests a deliberately constructed visual network linking burial sites across the rift; Tuba reframes surrounding fields as participants in a shared mortuary landscape | unmarked | accepted | inference | 1 context paragraph = 1 claim. "Deliberately constructed" is inferential. |
| C008 | 1 | Historical context: the dolmens are structures whose significance has been continuously reinterpreted across cultures — from original burial through biblical narrative to modern research; the site positions the Korazim phenomenon as a case study in deep-time persistence of mortuary monuments | unmarked | accepted | synthesis | 1 context paragraph = 1 claim |
| C009 | 1 | Social context: pastoralist continuity over four millennia frames the dolmen field as an enduring node in a pastoral territory; the Tuba-Zangariyye community's presence carries heritage significance as the living context of the ancient landscape | unmarked | accepted | synthesis | 1 context paragraph = 1 claim |
| C010 | 1 | Political context: the management history frames the dolmen field as a test case for the shift from rescue-archaeology to values-based management in Israel; the case reframes the broader debate about Israeli antiquities legislation | unmarked | rejected | inference | Expert rejected: "this context is not relevant to this assessment" |
| C011 | 1 | Technological context: each dolmen is evidence of organizational capacity within a "modest" semi-nomadic society; the investment required raises the question of what motivated such disproportionate effort in mortuary architecture | unmarked | accepted | synthesis | 1 context paragraph = 1 claim |
| C012 | 1 | Archaeological context: the specific field remains an unexcavated sample within a regionally dated phenomenon; the Tuba field reframes the research agenda by offering a dense concentration that could yield sealed contexts for independent dating | unmarked | accepted | synthesis | 1 context paragraph = 1 claim |
| C013 | 1 | Thematic context: the Tuba field is a potential focal node within a trans-Jordan megalithic tradition; identification of Tuba and Shamir as possible centers reframes surrounding fields as a differentiated landscape | unmarked | reframed | inference | Expert challenged "hierarchically organized network" as bot overreach. Bot acknowledged and rewrote to hedged version. Counting corrected version. |
| C014 | 1 | Intangible heritage context: biblical, Talmudic, New Testament, and Bedouin narrative layers frame the dolmens as generators of cultural meaning beyond their original function; these narratives reinforce the landscape's role as a persistent locus of cultural imagination | ° | accepted | synthesis | Marked ° — appropriate, combines multiple source threads |
| C015 | 1 | Critical gap: the absence of community voice is more significant than it appeared in Stage 0 — no source records any community perspective, and Source B acknowledges "community participation" remains a future challenge | unmarked | accepted | synthesis | Should-be-° — combines observation across all 3 sources. Escalation from C003 with new Source B evidence. |
| C016 | 2 | Scientific value: the field's most consequential value may be what it has not yet yielded — sealed chambers remain intact, and the field's density and typological diversity offer a concentrated sample for future investigation | ° | reframed | inference | Expert reordered this value to 5th position (after Technological) and removed specific methods (aDNA, OSL). Substance kept but framing adjusted. |
| C017 | 2 | Historical value: the dolmens represent tangible evidence of IB-MBII mortuary practice; their persistence as landmarks for ~3,000 years, accumulating new associations, constitutes historical value for the entire trajectory of reinterpretation | unmarked | accepted | synthesis | Combines dating evidence with gap-period engagement evidence |
| C018 | 2 | Landscape value: the hilltop position, prominent capstones, and inter-visibility suggest deliberate placement; whether this was intentionally designed or incidental remains uncertain; the surviving visual relationships constitute landscape value regardless of intent | 💭 | accepted | inference | 💭 marking on the design question — appropriate |
| C019 | 2 | Technological value: each dolmen represents significant engineering (up to ~15 tons, dry-stone); the Tortoise Shell corbelling is a local innovation; the disproportionate investment by "modest" communities evidences social organization not otherwise visible in the material culture | unmarked | accepted | synthesis | Combines construction data from multiple sources with social inference from C |
| C020 | 2 | Social value: pastoralist continuity from IB-MBIIA to modern Bedouin suggests social value rooted in continuity of landscape use; the connection is cultural-geographic rather than demonstrated lineage; the critical gap (no community voice) limits this value | ° | accepted | inference | Marked ° — appropriate. The "cultural-geographic rather than demonstrated lineage" is an honest limitation. |
| C021 | 2 | Intangible heritage value: biblical, Talmudic, NT, and Bedouin narrative associations suggest the structures have generated cultural meaning across at least four traditions; the evidence linking these traditions to this specific field (vs. Korazim generally) is indirect | °💭 | reframed | inference | Expert directed addition of "landscape for imagination" language from Stage 1. Bot had used phrase in Stage 1 but dropped it in Stage 2. |
| C022 | 2 | Value dynamics: the primary relationship between values is reinforcing cohesion rather than tension; scientific + historical are mutually supportive; landscape + technological converge in the same physical features | unmarked | accepted | synthesis | 1 claim for the value dynamics assessment as a whole |
| C023 | 2 | Value dynamics — tension: potential tension exists between scientific value and development pressure; the 2019 shift toward in-situ preservation aligns management practice with the site's dominant value profile | unmarked | accepted | inference | 1 claim for the identified tension. Distinct analytical move from C022. |
| C024 | 3 | Nara Grid — Form and Design: Medium-High integrity; overall plan and clustering legible; individual dolmens vary; some chambers missing covering stones; hilltop dolmens likely lost to sheep pen | unmarked | accepted | synthesis | 1 claim per Nara dimension |
| C025 | 3 | Nara Grid — Materials and Substance: Medium integrity; basalt durable and largely in situ; covering stones missing from some chambers; unknown number destroyed by sheep pen; no quantification of losses | unmarked | accepted | synthesis | 1 claim per Nara dimension |
| C026 | 3 | Nara Grid — Use and Function: Low integrity; original burial use ceased ~4,000 years ago; no active funerary or ritual practice connects to dolmens today; agricultural overlay is a different use | unmarked | reframed | synthesis | Expert reframed: "define 'use' more broadly as human engagement with the structure." Bot had rated Low based on narrow definition. |
| C027 | 3 | Nara Grid — Setting and Location: Medium integrity; broader landscape setting largely intact; immediate setting compromised by sheep pen and refuse dumping; visual relationship to Golan appears unobstructed but not formally assessed | 💭 | accepted | synthesis | 💭 on viewshed assessment — appropriate |
| C028 | 3 | Nara Grid — Traditions and Techniques: Low-Medium; technique not a living tradition; exists only as embodied knowledge in surviving fabric; where intact, fully readable; where collapsed, partially/fully lost | unmarked | accepted | synthesis | 1 claim per Nara dimension |
| C029 | 3 | Nara Grid — Spirit and Feeling: Medium; hilltop retains monumental character; sheep pen and refuse intrude on experience; absence of interpretive infrastructure means "spirit" depends on unmediated encounter | unmarked | accepted | synthesis | 1 claim per Nara dimension |
| C030 | 3 | Nara Grid — Documentary/Archival: Medium; long research pedigree (148 years); GPS-based survey; but no excavation records for this field; per-dolmen appendix unpublished; paradox — absence of documentation of contents IS a form of preservation | 💭 | accepted | synthesis | 💭 on Stepansky sheet accessibility. The "paradox" observation is inferential. |
| C031 | 3 | Integrity condition: the defining feature is unexcavated status; integrity-as-potential rated High — sealed chambers, fills, deposits remain undisturbed; this is the most significant integrity dimension from a scientific perspective | unmarked | accepted | inference | The three-state model application is analytical |
| C032 | 3 | The "principal authenticity dilemma" — tension between integrity-as-potential and development pressure | unmarked | rejected | overreach | Expert rejected: this is a conservation threat, not an authenticity dilemma. Bot acknowledged the conceptual error. |
| C033 | 3 | Documentary integrity asymmetry: documentation record reasonably rich for a survey-only site, but dolmen contents have no documentation because never opened; the 148-year research pedigree adds secondary historical layer — history of investigation is itself heritage narrative | unmarked | accepted | inference | Two linked observations forming one analytical move |
| C034 | 3 | Setting integrity at two scales: regional (inter-visibility intact, formal viewshed not conducted); immediate (sheep pen, refuse, village create localized degradation); development plans represent most significant threat | 💭 | accepted | synthesis | 💭 on viewshed — appropriate |
| C035 | 3 | Multi-period palimpsest reinforces rather than compromises authenticity — megalithic burial, agricultural overlay, gameboards, modern pastoral use are a unified sequence, not competing layers | unmarked | expert-added | inference | Expert directed: "the palimpsest as a whole carry authenticity." Bot adopted this framing. |
| C036 | 4 | Comparator 1 assessment (Golan Heights): Golan fields better documented and provide chronological anchoring for Tuba; but Golan suffered more damage; Tuba's comparative advantage is its unexcavated, concentrated state | unmarked | accepted | synthesis | 1 claim per comparator assessment |
| C037 | 4 | Comparator 2 assessment (Shamir): Shamir and Tuba appear to be peer sites; sources suggest both may be focal points; Tuba's distinguishing features include Tortoise Shell type and richer research pedigree; comparison limited by absent Shamir data | unmarked | accepted | synthesis | 1 claim per comparator assessment |
| C038 | 4 | Comparator 3 assessment (En Adaya): provides nearby excavated data point confirming IB date; its damaged/excavated state contrasts with Tuba's integrity-as-potential; illustrates what is at stake in conservation decision | unmarked | accepted | inference | The "illustrates what is at stake" is an analytical move beyond the comparison data |
| C039 | 4 | Overall comparative positioning: Tuba's distinctive position rests as much on what has not happened to it as on intrinsic features; its most consequential distinction may be integrity-as-potential — among major concentrations, appears one of the best-preserved unexcavated clusters | unmarked | accepted | inference | 1 claim for overall comparative positioning |
| C040 | 4 | Limitation acknowledgment: without excavation data, chronological placement depends entirely on analogical evidence; the IB-MBII attribution is reasonable but unconfirmed for this particular concentration | ° | accepted | synthesis | The ° is implicit in the "assumed...based on regional patterns" language |
| C041 | 5 | Density speaks to sustained collective commitment to mortuary construction; cumulative effort suggests monumental burial was central to how semi-nomadic communities organized themselves and expressed social cohesion | unmarked | expert-added | inference | Expert rejected "important individuals" speculation and directed grounding in collective effort. NEW analytical content. |
| C042 | 5 | The field retains palpable monumental presence; austere unmediated encounter (stone against sky) is itself a dimension of significance; dolmens provoke response across traditions | unmarked | expert-added | inference | Expert directed: "clarify spirit and feeling quality." New elevation of phenomenological significance to core thread. |
| C043 | 5 | Pastoralist continuity framing: relationship between mobile community and monumental landscape has persisted across radically different historical circumstances | unmarked | expert-added | synthesis | Expert directed addition of pastoralist continuity. Extends C009 with new "radically different historical circumstances" framing. |
| C044 | 6 | Reliability constraint: evidence type profile (srv, ana, doc, arc present; str, mat, sci absent) means claims about dating, function, and social organization carry inherent margin of uncertainty | unmarked | accepted | synthesis | Analytical assessment of the evidence base limitations |
| C045 | 6 | Note for professional practice: the shift from 2015 salvage-excavation to 2019 significance-based approach represents meaningful change; framing of unexcavated dolmens as non-renewable archive may support continued in-situ preservation | unmarked | accepted | inference | Analytical judgment about professional implications |
| C046 | 6 | Absence of community consultation is not merely a data gap — it is a methodological limitation that affects the assessment's legitimacy in any planning context aspiring to inclusive practice | unmarked | accepted | inference | Escalation from "gap" to "methodological limitation affecting legitimacy" — new analytical move |

---

## C. Summary Statistics

### Total claims by stage

| Stage | Claims | Notes |
|-------|--------|-------|
| 0 | 3 | C001-C003. Mostly procedural; only tiering, archive uncertainty, and community gap qualify. |
| 1 | 12 | C004-C015. 1 site description, 8 contexts (incl. political — rejected), 1 intangible, 1 critical gap escalation, 1 cupmarks/gameboards. |
| 2 | 8 | C016-C023. 6 values + 2 value dynamics. |
| 3 | 12 | C024-C035. 7 Nara dimensions + integrity condition + authenticity dilemma (rejected) + documentary asymmetry + setting scales + palimpsest. |
| 4 | 5 | C036-C040. 3 comparator assessments + 1 overall positioning + 1 limitation. |
| 5 | 3 | C041-C043. Only genuinely new content counted (most of Stage 5 restates Stages 1-4). |
| 6 | 3 | C044-C046. Reliability, professional practice, community gap escalation. |
| **Total** | **46** | |

### Claims by epistemic status

| Status | Count | Rate |
|--------|-------|------|
| unmarked | 33 | 33/46 = 71.7% |
| ° | 4 | 4/46 = 8.7% |
| 💭 | 4 | 4/46 = 8.7% |
| °💭 | 1 | 1/46 = 2.2% |
| should-be-° | 4 | 4/46 = 8.7% |
| should-be-💭 | 0 | 0/46 = 0.0% |

Reclassified as should-be-°: C003 (combines absence across all sources), C015 (escalation combining all sources), C022 (cross-value synthesis), C023 (tension identification from pattern).

### Claims by expert response

| Response | Count | % of 46 |
|----------|-------|---------|
| validated | 0 | 0.0% |
| accepted | 36 | 78.3% |
| reframed | 4 | 8.7% |
| challenged | 0 | 0.0% |
| rejected | 2 | 4.3% |
| expert-added | 4 | 8.7% |
| **Total** | **46** | **100%** |

### Claims by content type

| Type | Count | % of 46 |
|------|-------|---------|
| extraction | 3 | 6.5% |
| synthesis | 22 | 47.8% |
| inference | 20 | 43.5% |
| hypothesis | 0 | 0.0% |
| overreach | 1 | 2.2% |
| **Total** | **46** | **100%** |

---

## D. Boundary Decisions Log

```
Decision: C005 — counted as 1 claim, not 2
Reason: Cupmarks "likely contemporary" and gameboards "probably later" are two temporal
attributions, but they serve the same analytical purpose (secondary features with temporal
placement). Both halves could not be independently validated without the other providing
context. Kept as 1.

Decision: C015 vs. C003 — counted as separate claims
Reason: C003 (Stage 0) identifies the community voice gap. C015 (Stage 1) escalates it
("more significant than it appeared in Stage 0") and adds the Source B quote about
"community participation" as a future challenge. The escalation is a distinct analytical
move — it reframes the gap from a data limitation to a legitimacy concern.

Decision: Stage 0 checklist — NOT counted as claims
Reason: The checklist rows (Location, Function, etc.) are inventory, not analytical
judgments. Only the Documentation Profile tiering (C001) and the gap identifications
(C003) involve analytical assessment.

Decision: Stage 1 Timeline — NOT counted as claims
Reason: Timeline entries are extracted facts with dates and source references. They do
not make analytical judgments. The gap note ("~3,000 years") is descriptive, not analytical.

Decision: Stage 2 Attribute-Value-Significance-Implication Table — NOT counted
Reason: Table rows reformat the value definitions already counted in prose (C016-C021).
The "Implication" column adds application statements but these are planning implications,
not analytical claims.

Decision: Stage 3 Nara Grid table vs. paragraphs — table NOT counted separately
Reason: The table and the dimension paragraphs describe the same content. Counted the
paragraph-level assessments (which include more analytical reasoning) as the claims.

Decision: C022 + C023 — counted as 2 claims, not 1
Reason: "Reinforcing cohesion" (C022) and "tension with development" (C023) are
independently assessable propositions. One could be validated while the other is rejected.

Decision: C032 ("authenticity dilemma") — counted despite rejection
Reason: The expert rejected the claim, but it existed in the bot's output as an analytical
move. Rejected claims are part of the dataset — they reveal where the bot overreaches.

Decision: Stage 5 — aggressive deduplication
Reason: Per codebook, Stage 5 content is assumed to be restatement by default. The
original Stage 5 and revised Stage 5 were both examined. Most content restates
Stages 1-4 claims. Only C041 (collective effort/social cohesion — new framing),
C042 (phenomenological significance as core thread — new register), and C043
(pastoralist continuity as developed significance theme — new framing) were counted
as genuinely new.

Restated content in Stage 5 (NOT counted):
- "densest single dolmen concentration" -> restates C004
- "Tortoise Shell type unique to plateau" -> restates C019
- "inter-visibility with Golan" -> restates C007/C018
- "basalt megaliths up to 15 tons" -> restates C019
- "integrity-as-potential" -> restates C031
- "148-year research pedigree" -> restates C033
- "best-preserved unexcavated cluster" -> restates C039
- "IB-MBII dating on analogy" -> restates C040

Decision: C035 — expert-added, not reframed
Reason: The expert stated "the palimpsest as a whole carry authenticity" — this is new
analytical content (the unity framing) that replaced the bot's rejected "dilemma"
framing. The bot did not produce this interpretation; the expert introduced it.

Decision: Reflection sections — NOT counted
Reason: Per codebook, reflection questions are excluded. The bot's reflections pose
questions to the user — these are prompts, not analytical positions.

Decision: Stage 6 "Strengths" section — NOT counted
Reason: Restatement of prior claims (convergent values, density, Tortoise Shell,
research pedigree, unexcavated status). No new analytical content.

Decision: Stage 6 Quick Boosts and Next Steps — NOT counted
Reason: Practical recommendations, not analytical claims about the site's significance.

Decision: Stage 6 Context-Effect Planning Implications — NOT counted
Reason: Application of prior analysis to planning context. These are implications
derived from claims, not claims themselves. Exception: C046 (community consultation
as methodological limitation) is counted because it makes a new analytical judgment
about the assessment's own legitimacy.
```

---

## E. Cross-Stage Deduplication Log

| Stage 5/6 content | Restates | Action |
|-------------------|----------|--------|
| "densest single dolmen concentration on Korazim Plateau" | C004 (Stage 1) | Excluded |
| "Tortoise Shell type, corbelled variant unique to this plateau" | C019 (Stage 2) | Excluded |
| "inter-visibility with dolmen fields on Golan Heights" | C007 (Stage 1) | Excluded |
| "basalt megaliths weighing up to ~15 tons" | C019 (Stage 2) | Excluded |
| "integrity-as-potential is finite and non-renewable" | C031 (Stage 3) | Excluded |
| "148 years from Kitchener to 2019 survey" | C033 (Stage 3) | Excluded |
| "one of the best-preserved unexcavated clusters" | C039 (Stage 4) | Excluded |
| "chronological attributions depend on analogical evidence" | C040 (Stage 4) | Excluded |
| "four millennia of engagement" | C008 (Stage 1) | Excluded |
| "landscape for imagination" | C014/C021 (Stages 1/2) | Excluded (substance); but see C042 for NEW move of elevating to significance-statement register |
| Stage 6 "convergent set of values" | C022 (Stage 2) | Excluded |
| Stage 6 "multi-period palimpsest strengthens authenticity" | C035 (Stage 3) | Excluded |

---

## F. Epistemic Analysis

### Table A. Notation Accuracy

| Metric | Count | Rate | What it shows |
|--------|-------|------|---------------|
| Total claims | 46 | — | Dataset size |
| Marked by bot (° or 💭 or °💭) | 9 | 9/46 = 19.6% | Marking rate — bot flags uncertainty in ~1 in 5 claims |
| Correctly marked | 9 | 9/9 = 100% | Precision — when bot marks, it is always correct |
| Under-marked (should-be-°) | 4 | 4/37 = 10.8% | Recall gap — 4 uncertain claims missed among 37 unmarked |
| Over-marked | 0 | 0/9 = 0% | No false positives |
| Net accuracy | 42 | 42/46 = 91.3% | (33 correct unmarked + 9 correct marked) / 46 |

Calculation: 37 unmarked claims. Of these, 4 should have been marked ° (C003, C015, C022, C023). So 33 are correctly unmarked. All 9 marked claims are correctly marked. Net = 33 + 9 = 42 correct out of 46.

### Table B. Expert Response Profile

| Response | Count | % of 46 |
|----------|-------|---------|
| validated | 0 | 0.0% |
| accepted | 36 | 78.3% |
| reframed | 4 | 8.7% |
| challenged | 0 | 0.0% |
| rejected | 2 | 4.3% |
| expert-added | 4 | 8.7% |
| **Total** | **46** | **100%** |

**Derived metrics:**
- **Acceptance rate** = (validated + accepted) / total = 36/46 = **78.3%**
- **Intervention rate** = (reframed + challenged + rejected + expert-added) / total = 10/46 = **21.7%**
- **Substantive error rate** = rejected / total = 2/46 = **4.3%**

### Table C. Content Type Distribution

| Type | Count | % of 46 |
|------|-------|---------|
| extraction | 3 | 6.5% |
| synthesis | 22 | 47.8% |
| inference | 20 | 43.5% |
| hypothesis | 0 | 0.0% |
| overreach | 1 | 2.2% |
| **Total** | **46** | **100%** |

### Table D. Cross-Tabulations

#### D1. Epistemic status x Expert response

|  | validated | accepted | reframed | challenged | rejected | expert-added | Total |
|--|-----------|----------|----------|------------|----------|--------------|-------|
| unmarked | 0 | 27 | 2 | 0 | 2 | 2 | 33 |
| ° | 0 | 3 | 1 | 0 | 0 | 0 | 4 |
| 💭 | 0 | 4 | 0 | 0 | 0 | 0 | 4 |
| °💭 | 0 | 0 | 1 | 0 | 0 | 0 | 1 |
| should-be-° | 0 | 2 | 0 | 0 | 0 | 2 | 4 |
| **Total** | **0** | **36** | **4** | **0** | **2** | **4** | **46** |

#### D2. Content type x Bot marking

|  | unmarked | ° | 💭 | °💭 | should-be-° | Total |
|--|----------|---|---|-----|-------------|-------|
| extraction | 2 | 0 | 1 | 0 | 0 | 3 |
| synthesis | 17 | 2 | 0 | 0 | 3 | 22 |
| inference | 13 | 2 | 3 | 1 | 1 | 20 |
| hypothesis | 0 | 0 | 0 | 0 | 0 | 0 |
| overreach | 1 | 0 | 0 | 0 | 0 | 1 |
| **Total** | **33** | **4** | **4** | **1** | **4** | **46** |

#### D3. Stage x Marking accuracy

| Stage | Claims | Correctly classified | Under-marked | Accuracy % |
|-------|--------|---------------------|--------------|------------|
| 0 | 3 | 2 | 1 | 66.7% |
| 1 | 12 | 11 | 1 | 91.7% |
| 2 | 8 | 6 | 2 | 75.0% |
| 3 | 12 | 12 | 0 | 100% |
| 4 | 5 | 5 | 0 | 100% |
| 5 | 3 | 3 | 0 | 100% |
| 6 | 3 | 3 | 0 | 100% |
| **Total** | **46** | **42** | **4** | **91.3%** |

### Table E. Enabler Analysis — Key Questions

**1. Does notation work as an epistemic enabler?**

Of 9 marked claims, 2 were reframed (C016 scientific value reordered, C021 intangible value adjusted). Of 33 unmarked claims, 2 were rejected (C010 political context, C032 authenticity dilemma) and 2 were reframed. Expert intervention rate on marked claims: 2/9 = 22.2%. Expert intervention rate on unmarked claims: 4/33 = 12.1%. Marked claims received MORE intervention — but the interventions on marked claims were reframings (adjustments), not rejections. Both rejections fell on unmarked claims. Notation does not yet function as a reliable signal for the expert: the bot's most problematic claims (C010, C032) were unmarked, meaning the notation system failed precisely where it was most needed.

**2. Does governance catch what notation misses?**

Of 4 under-marked claims (should-be-°: C003, C015, C022, C023), the expert intervened on 0 of them. All 4 were accepted without challenge. Governance did NOT catch what notation missed — but the under-marked claims were all synthesis-type (combining sources), not overreach. The notation gap was real but low-risk: these claims combined evidence reasonably, they just should have flagged the multi-source basis.

**3. What is the error asymmetry?**

Under-marking: 4 claims. Over-marking: 0 claims. The bot is systematically overconfident — it under-marks rather than over-marks. The directional bias is entirely toward presenting synthesized/inferred content without epistemic flags. This is consistent with the expert's general tone correction ("use a more suggestive tone when evidence is not clear").

**4. Which content types are most dangerous?**

- Overreach: 1/1 rejected = 100% intervention rate (C032)
- Inference: 2/20 reframed + 1/20 rejected = 15% intervention rate (3/20)
- Synthesis: 2/22 reframed = 9.1% intervention rate
- Extraction: 0/3 = 0% intervention rate

Overreach is the most dangerous type (100% caught), but with n=1 the rate is not generalizable. Among substantial categories, inference (15%) is more problematic than synthesis (9.1%), consistent with inference requiring more interpretive judgment.

**5. Does the bot improve across stages?**

Stages 0-2 accuracy: 19/23 = 82.6%. Stages 3-6 accuracy: 23/23 = 100%. Yes — there is clear improvement. The bot achieved perfect marking accuracy from Stage 3 onward. This may reflect calibration to the expert's interventions (the tone correction and thematic context reframing both occurred between Stages 1 and 2), or it may reflect that later stages have more structured templates (Nara Grid, comparison table) that constrain the bot's tendency to produce unmarked synthesis.

### Table F. Key Findings

1. **The bot produces mostly synthesis and inference, not extraction.** Of 46 claims, only 3 (6.5%) are direct extractions from a single source; 22 (47.8%) synthesize multiple sources and 20 (43.5%) draw inferences beyond the evidence. This confirms that the CBSA bot functions primarily as an analytical engine, not a summarizer — it generates interpretive content that requires expert oversight. (42/46 = 91.3% are synthesis or inference.)

2. **Epistemic notation is precise but under-deployed.** When the bot marks a claim with ° or 💭, it is always correct (9/9 precision = 100%). But it marks only 19.6% of claims, leaving 4 synthesis-based claims that should have been flagged (4/37 unmarked = 10.8% recall gap). The system's weakness is not false positives but false negatives — overconfident presentation of multi-source reasoning.

3. **Both rejected claims were unmarked overconfident assertions.** The two claims the expert rejected (C010: political context, C032: authenticity dilemma) were both unmarked and involved the bot extending beyond the evidence or misapplying a concept. Neither carried any epistemic flag that might have prompted the expert to scrutinize them. (2/2 rejections = 100% unmarked; 0/9 marked claims rejected.)

4. **Expert interventions were directionally consistent: toward epistemological honesty.** Of 10 interventions (4 reframings, 2 rejections, 4 additions), the majority pushed toward hedging confident claims, removing speculation, or adding experiential/phenomenological content the bot had underweighted. The bot's self-analysis identified the same pattern: "stay closer to the evidence, stay closer to the experience, don't resolve what the sources leave open." (10/46 = 21.7% intervention rate.)

5. **Marking accuracy improves across the session.** Stages 0-2 show 82.6% accuracy (3 under-marked out of 23), while Stages 3-6 achieve 100% (0 under-marked out of 23). This improvement coincides with the expert's strongest interventions occurring in Stages 1-2, suggesting the bot calibrates to expert feedback within the session — though the effect may also reflect the more structured output templates of later stages.
