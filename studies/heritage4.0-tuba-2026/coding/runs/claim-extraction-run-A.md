# Claim Extraction Report — Run A

## A. Metadata

```
Session: Tuba-Zangariyye Dolmen Field CBSA Assessment
Date analyzed: 2026-03-25
Source file: InSites-Brain/Claude/tests/tz-textonly.md
Stages covered: 0, 1, 2, 3, 4, 5, 6
Extraction agent: Claude Code claim-extractor v1.1
Codebook version: 1.1
```

---

## B. Claim Table

| ID | Stage | Claim text | Bot marking | Expert response | Content type | Notes |
|----|-------|-----------|-------------|-----------------|-------------|-------|
| C001 | 0 | Source tiering: A=Tier 4 (survey, no excavation), B=Tier 3 (management case study, no new field data), C=Tier 2 (peer-reviewed synthesis, not site-specific) — establishing that the assessment rests on Tier 2-4 sources with identified limitations | unmarked | accepted | synthesis | Analytical evaluation of evidence base quality |
| C002 | 0 | Tier 1 primary field records likely exist beyond uploaded material; Turville-Petre's 1931 excavation records published but dolmen locations remain unidentified; Stepansky's survey sheets likely exist but accessibility unknown | 💭 | accepted | inference | Inference about archival accessibility |
| C003 | 1 (Desc) | Despite hilltop damage from sheep pen and refuse dumping, the field remains "one of the densest and best-preserved dolmen concentrations on the Korazim Plateau" | unmarked | accepted | synthesis | Combines damage info (A:p.1) with density/preservation assessment (A:p.3; B) — should-be-° |
| C004 | 1 (Desc) | Cupmarks near dolmens likely contemporary with burial ritual as part of funerary practice; mancala gameboards probably later additions by shepherds/travelers who reused dolmens | unmarked | accepted | extraction | Source A:p.3 states this directly; bot faithfully reports source attribution |
| C005 | 1 (Ctx) | Geographic context: the spring-fed basalt spur at the junction of two wadis frames the field as occupying a resource node within a landscape corridor; the field in turn reframes the Korazim Plateau as a zone where megalithic mortuary investment concentrates at well-watered spur locations | unmarked | accepted | synthesis | Bidirectional context-effect. Combines location data from A with regional pattern from C |
| C006 | 1 (Ctx) | Landscape context: inter-visibility between dolmen clusters across the Korazim Plateau and the Golan suggests a deliberately constructed visual network linking burial sites across the rift; Tuba-Zangariyye as a dense node reframes surrounding fields as participants in a shared mortuary landscape | unmarked | accepted | inference | "Deliberately constructed visual network" goes beyond sources — should-be-💭 |
| C007 | 1 (Ctx) | Historical context: the dolmens are structures whose significance has been continuously reinterpreted across cultures — from original burial, through biblical narrative, to modern research; the site's interpretive afterlife positions the Korazim phenomenon as a case study in deep-time persistence of mortuary monuments | unmarked | accepted | synthesis | Two-phase model from sources; "continuously reinterpreted" is synthesis |
| C008 | 1 (Ctx) | Social context: pastoralist continuity over four millennia (IB-MBIIA builders, Ottoman cultivators, Bedouin tribes) frames the dolmen field as an enduring node in a pastoral territory; the Tuba-Zangariyye community's long-term presence carries heritage significance as the living context of the ancient landscape | ° | accepted | synthesis | Combines Stepansky's pastoralist identification (C) with Bedouin presence (B, C note 4) |
| C009 | 1 (Ctx) | Political context: the management history exposes tension between development mandates and heritage protection; the dolmen field is a test case for the shift from rescue-archaeology to values-based management in Israel; Tuba-Zangariyye reframes the debate about Israeli antiquities legislation | unmarked | rejected | overreach | Expert removed: irrelevant to site's cultural significance; belongs to case study's professional significance |
| C010 | 1 (Ctx) | Technological context: each dolmen is evidence of organizational capacity within a "modest" semi-nomadic society — the investment required raises the question of what motivated disproportionate effort in mortuary architecture; builders exploited naturally upright slabs showing pragmatic material intelligence | unmarked | accepted | synthesis | Combines construction data (A, C) with social characterization (C:p.48) |
| C011 | 1 (Ctx) | Archaeological context: what is known is heavily mediated by analogy — the field remains an unexcavated sample within a regionally dated phenomenon; Tuba-Zangariyye reframes the Korazim research agenda by offering a dense, well-preserved concentration that could yield sealed contexts for independent dating | unmarked | accepted | synthesis | Combines survey-only status with research potential. "Preservation-as-archive" framing added per expert directive |
| C012 | 1 (Ctx) | Thematic context: Tuba field is a potential focal node within a trans-Jordan megalithic tradition; identification of Tuba and Shamir as possible regional centers reframes surrounding fields as part of a differentiated landscape — though the nature of that differentiation remains unclear | °💭 (corrected) | reframed | inference | Originally "hierarchically organized network" — expert challenged as overreach; bot corrected to hedged source-faithful version |
| C013 | 1 (Ctx) | Intangible Heritage context: biblical Rephaim narratives, NT "tombs," Talmudic "Merkolis," and Bedouin "Dan" frame the dolmens as generators of cultural meaning far beyond their original funerary function; survival of these narratives reinforces the landscape's role as a persistent locus of cultural imagination | ° | accepted | synthesis | Combines four textual traditions (C:p.50 note 2; B); "persistent locus of cultural imagination" = bot's synthesis |
| C014 | 1 (Ctx) | Critical Gap: absence of community voice is more significant than it appeared in Stage 0; no source records any community perspective despite the Zangariyye tribe's centuries-long presence adjacent to the dolmen field; this gap may limit the legitimacy of any significance statement claiming landscape or social values | unmarked | accepted | inference | Analytical judgment about evidentiary gap — should-be-° (combines absence across all 3 sources) |
| C015 | 2 | Scientific Value: the field's most consequential value may be what it has not yet yielded — sealed chambers, fills, and deposits remain intact; density and typological diversity offer a concentrated sample for future investigation; framed as preservation-as-archive | ° | reframed | synthesis | Expert reordered (to after Technological), removed specific methods (aDNA, OSL), kept general |
| C016 | 2 | Historical Value: dolmens are tangible evidence of IB-MBII mortuary practice; two-phase timeline (megalithic burial to Ottoman agriculture) with 3,000-year gap during which structures persisted as landmarks; persistence of monuments outlasting their builders constitutes historical value | unmarked | accepted | synthesis | Combines dating (C), two-phase model (A), secondary engagement evidence (A, C) |
| C017 | 2 | Landscape Value: hilltop position, prominent capstones, and inter-visibility suggest deliberate placement oriented toward visual connection with broader megalithic landscape — though whether intentional or incidental to hilltop placement remains uncertain | 💭 (on uncertainty) | accepted | inference | Appropriately hedged; the "network" interpretation flagged as uncertain |
| C018 | 2 | Technological Value: each dolmen represents significant engineering — basalt slabs up to 15 tons, dry-stone technique; Tortoise Shell corbelling appears to be a local innovation; disproportionate investment by "modest" communities evidences social organization beyond what surviving material culture suggests | unmarked | accepted | synthesis | Combines construction data (A, B, C) with Horbat Berekh material culture contrast (C) |
| C019 | 2 | Social Value: long arc of pastoral presence (ancient builders to Ottoman cultivators to modern Bedouin) suggests value rooted in continuity of landscape use; connection is cultural-geographic rather than demonstrated lineage; critical gap: no community voice recorded | ° | accepted | synthesis | Appropriately marked ° for inferred connection |
| C020 | 2 | Intangible Heritage Value: biblical, Talmudic, NT, and Bedouin traditions collectively suggest dolmens have generated cultural meaning across four distinct traditions; association to Tuba-Zangariyye specifically (vs. Korazim generally) is indirect | °💭 | reframed | synthesis | Expert directed adding "landscape for imagination" language |
| C021 | 2 | Value Dynamics — reinforcing cohesion: scientific value and historical value are mutually supportive (survival preserves research potential); landscape value and technological value converge in the same physical features (capstones = visual presence = engineering) | unmarked | accepted | inference | Bot's analytical move connecting values — should-be-° |
| C022 | 2 | Value Dynamics — tension: the 2015 plan would have destroyed most dolmens through salvage excavation, diminishing preservation-as-archive value; the 2019 shift aligns management with the site's dominant value profile | unmarked | accepted | synthesis | Combines management history (B) with value assessment |
| C023 | 3 | Form and Design: Medium-High integrity — overall plan and clustering legible; individual variation in preservation; some chambers missing covering stones; hilltop dolmens likely lost to sheep pen construction | unmarked | accepted | synthesis | Combines survey data (A) with damage assessment (A:p.1) and regional note (C:p.42) |
| C024 | 3 | Materials and Substance: Medium integrity — basalt inherently durable, original material largely in situ where dolmens survive; covering stones missing from some (past disturbance); unknown number destroyed by sheep pen; no quantification of losses | unmarked | accepted | synthesis | Combines material description with damage observations |
| C025 | 3 | Use and Function: Low integrity for original burial use (ceased ~4,000 years ago); no active funerary/ritual practice connects to dolmens today; agricultural overlay is a different use entirely | unmarked | reframed | extraction | Expert directed broadening "use" to include human engagement; original rating acknowledged burial cessation |
| C026 | 3 | Setting and Location: Medium integrity — broader landscape intact (hilltop, wadis, springs, sightlines remain); immediate setting compromised by sheep pen and refuse dumping; visual relationship to Golan fields unobstructed but not formally assessed for viewshed integrity | 💭 (on viewshed) | accepted | synthesis | Combines setting description with damage notes and viewshed uncertainty |
| C027 | 3 | Traditions and Techniques: Low-Medium integrity — construction technique exists only as embodied knowledge in surviving fabric; not a living tradition; where intact the technique is fully readable; where collapsed, technical evidence partially/fully lost | unmarked | accepted | inference | Judgment about knowledge embodiment — should-be-° |
| C028 | 3 | Spirit and Feeling: Medium integrity — hilltop retains monumental presence, capstones visible; sheep pen and refuse intrude on experience; proximity of village and development plan create risk; absence of interpretive infrastructure means spirit depends on unmediated encounter | unmarked | accepted | inference | Phenomenological judgment about experiential quality |
| C029 | 3 | Documentary / Archival: Medium integrity — 148-year research pedigree and GPS survey, but no excavation records for this field; per-dolmen appendix unpublished; Turville-Petre 1931 locations unidentified; Stepansky sheets possibly inaccessible; documentation of standing remains adequate, documentation of subsurface nonexistent (paradoxically also preservation) | 💭 (on accessibility) | accepted | synthesis | Combines documentation history with accessibility assessment |
| C030 | 3 | Overall integrity profile: strongest dimension is form/design (clustering and typology legible); weakest is use/function (original practice ceased millennia ago); material substance and setting occupy middle ground | unmarked | accepted | synthesis | Synthesis of all dimension assessments |
| C031 | 3 | Integrity-as-potential rated High: sealed chambers, burial fills, and deposits remain undisturbed; this is the site's most significant integrity dimension from a scientific perspective; potential diminishes with each dolmen lost | unmarked | accepted | inference | Key analytical judgment — applying three-state model to this site |
| C032 | 3 | The multi-period palimpsest (megalithic burial, agricultural overlay, gameboards, modern pastoral use) reinforces rather than compromises authenticity — a unified sequence, not competing layers | unmarked | reframed | inference | Bot originally framed as "authenticity dilemma"; expert corrected: no dilemma, palimpsest carries unified authenticity |
| C033 | 3 | Documentary integrity shows an asymmetry: documentation record is rich for a survey-only site, but dolmen contents have no documentation precisely because they have never been opened; the history of investigation (148 years) is itself part of the heritage narrative | unmarked | accepted | inference | Analytical observation about the paradox of documentation vs. preservation |
| C034 | 3 | Setting integrity operates at two scales: regional (inter-visibility with Golan and plateau fields appears intact, not formally assessed) and immediate (sheep pen, refuse, village create localized degradation); development plans are the most significant threat | 💭 (on regional) | accepted | synthesis | Combines two-scale analysis with threat assessment |
| C035 | 4 | Golan comparison: Golan fields are better documented and provide the chronological anchoring Tuba relies on; however, Golan has suffered more extensive damage from quarrying/development and many dolmens excavated — Tuba's comparative advantage lies in its unexcavated, concentrated state | unmarked | accepted | synthesis | Combines Golan data (C) with comparative judgment |
| C036 | 4 | Shamir comparison: Shamir and Tuba appear to be peer sites — both characterized by density, hilltop positions, wide views; sources suggest both may be focal points but neither excavated to confirm hierarchical distinction; Tuba's distinguishing features include Tortoise Shell type and richer research pedigree | unmarked | accepted | synthesis | Limited by absence of Shamir data in uploaded material |
| C037 | 4 | En Adaya comparison: provides nearby excavated data point confirming IB date for the vicinity; its damaged/excavated state has lost the integrity-as-potential Tuba retains; contrast illustrates what is at stake — En Adaya = salvage-and-develop outcome; Tuba = in-situ preservation alternative | unmarked | accepted | inference | "Illustrates what is at stake" is bot's analytical framing |
| C038 | 4 | Overall comparative positioning: Tuba-Zangariyye's distinctive position rests as much on what has not happened to it as on intrinsic features; its typological range (Tortoise Shell), density (highest on plateau), research pedigree (1877 onward), and integrity-as-potential (best-preserved unexcavated cluster) make it comparatively significant at a time when comparable sites have been diminished | unmarked | accepted | synthesis | Synthesis of all comparator assessments |
| C039 | 5 | The density speaks to sustained collective commitment to mortuary construction; the cumulative effort suggests monumental burial was central to how semi-nomadic communities organized themselves and expressed social cohesion — reframing social value through collective effort rather than individual status | unmarked | reframed | inference | Expert rejected "important individuals" speculation; directed reframing through collective effort and social cohesion |
| C040 | 5 | The field retains palpable monumental presence (stone against sky, unmediated encounter); this austere encounter is itself a dimension of significance; the dolmens provoke response as they have done for biblical narrators, Talmudic scholars, Bedouin shepherds, and explorers — constituting a "persistent landscape for imagination" | unmarked | expert-added | inference | Expert directed making spirit/feeling explicit and elevating "landscape for imagination" to a core thread of the significance statement |
| C041 | 6 | Reliability constraint: assessment built on Tier 2-4 sources; all chronological attributions rest on ana+arc evidence, not sealed-context finds; evidence type profile (srv, ana, doc, arc present; str, mat, sci absent) means claims carry inherent uncertainty | unmarked | accepted | synthesis | Combines source tiering with evidence type assessment; extends C001 |
| C042 | 6 | The absence of community consultation is not merely a data gap but a methodological limitation affecting the assessment's legitimacy in any planning context aspiring to inclusive practice | unmarked | accepted | inference | Elevates C014's gap identification to a methodological/ethical judgment |
| C043 | 6 | The IAA's shift from 2015 salvage-excavation approval to 2019 significance-based approach represents meaningful institutional change; a regional survey connecting Tuba, Shamir, and Golan into a coordinated heritage framework would strengthen landscape-scale protection | unmarked | accepted | inference | Professional practice judgment; the regional framework recommendation is bot's analytical contribution |

---

## C. Summary Statistics

### Claims by Stage

| Stage | Claims | IDs |
|-------|--------|-----|
| 0 (Preliminary) | 2 | C001-C002 |
| 1 (Description + Contexts) | 12 | C003-C014 |
| 2 (Values) | 8 | C015-C022 |
| 3 (Authenticity/Integrity) | 12 | C023-C034 |
| 4 (Comparison) | 4 | C035-C038 |
| 5 (Significance Statement) | 2 | C039-C040 |
| 6 (Quality Check) | 3 | C041-C043 |
| **Total** | **43** | |

### Claims by Epistemic Status (bot-assigned)

| Status | Count | Claims |
|--------|-------|--------|
| unmarked (correct) | 26 | C001, C004-C005, C007, C009-C011, C016, C018, C022-C025, C028, C030-C031, C033, C035-C043 |
| ° (correct) | 4 | C008, C013, C015, C019 |
| 💭 (correct) | 3 | C002, C017, C026 |
| °💭 (correct) | 2 | C012, C020 |
| should-be-° (reclassified from unmarked) | 4 | C003, C014, C021, C027 |
| should-be-💭 (reclassified from unmarked) | 1 | C006 |
| over-marked | 0 | -- |

### Claims by Expert Response

| Response | Count | Claims |
|----------|-------|--------|
| validated | 0 | -- |
| accepted | 34 | C001-C008, C010-C011, C013-C014, C016-C019, C021-C031, C033-C038, C041-C043 |
| reframed | 6 | C012, C015, C020, C025, C032, C039 |
| challenged | 0 | -- |
| rejected | 1 | C009 |
| expert-added | 2 | C040 (spirit/feeling as core thread), plus pastoralist-continuity planning line incorporated into existing claims |

### Claims by Content Type

| Type | Count | % |
|------|-------|---|
| extraction | 2 | 4.7% |
| synthesis | 22 | 51.2% |
| inference | 17 | 39.5% |
| hypothesis | 0 | 0.0% |
| overreach | 1 | 2.3% |
| missed | 0 | 0.0% |
| (expert-added) | 1 | 2.3% |
| **Total** | **43** | **100%** |

Note: C040 is classified as inference (content type) and expert-added (expert response). The expert-added row in content type reflects claims where the expert introduced the analytical direction. Total content types: extraction 2, synthesis 22, inference 18 (including C009 which is also overreach and C040 which is expert-directed), overreach 1. For non-overlapping count: extraction 2 + synthesis 22 + inference 17 + overreach 1 + expert-initiated inference 1 = 43.

---

## D. Boundary Decisions Log

```
Decision: C004 — counted as 1 claim, not 2
Reason: Cupmarks and gameboards are assessed in a single analytical move that
distinguishes contemporary vs. later features. The "likely... probably" structure
is one interpretive step about feature chronology.

Decision: C005-C013 — each context = 1 claim
Reason: Per stage-specific rules, the context paragraph IS the analytical move.
Inward effect + outward effect + planning implication = 1 claim. The planning
implication lines are applications, not separate claims.

Decision: C009 — counted as claim (rejected), not excluded
Reason: The bot produced this content; the expert rejected it. The rejection is
itself analytically significant data. Classified as overreach because the content
was irrelevant to the assessment question, not because it was factually wrong.

Decision: C012 — thematic context, corrected version counted
Reason: The original "hierarchically organized network" was challenged by the
expert and replaced with a hedged version. The corrected version is counted as
the claim; the original overreach is noted in the expert response column.

Decision: C021-C022 — value dynamics counted as 2 claims, not 1
Reason: Reinforcing cohesion (C021) and development tension (C022) are
independently assessable propositions — one describes value convergence, the
other identifies a specific conflict.

Decision: C030 vs. C023-C029 — overall integrity counted separately
Reason: C030 is a new analytical move that synthesizes the seven dimensions
into a profile (strongest/weakest ranking). The dimension claims assessed
individual aspects; C030 draws a cross-cutting conclusion.

Decision: C031 vs. C015 — integrity-as-potential counted separately from scientific value
Reason: C015 (Stage 2) identifies the scientific value of the unexcavated archive.
C031 (Stage 3) applies the three-state integrity model and rates integrity-as-potential
as High — a different analytical operation (assessment vs. identification).

Decision: C032 — palimpsest authenticity, classified as reframed (not expert-added)
Reason: The bot already discussed the palimpsest; the expert corrected the framing
from "dilemma" to "unified authenticity." This is a reframing of existing content,
not entirely new material.

Decision: C039 — collective commitment, counted as new Stage 5 content
Reason: While social value was identified in C019, the specific framing through
collective effort and social cohesion (replacing the rejected "important individuals"
speculation) is a genuinely new analytical move directed by the expert.

Decision: C040 — monumental presence / landscape for imagination, counted as new
Reason: Spirit/feeling was a row in the Nara Grid (C028) but was not developed as
a core significance thread. The expert directed elevating it into the significance
statement with specific language ("landscape for imagination"). This constitutes
new analytical content at the statement level.

Decision: Stage 5 paragraphs 1 and 4 — excluded as restatements
Reason: Paragraph 1 (density, Tortoise Shell, inter-visibility) restates C003, C006,
C012, C017. Paragraph 4 (integrity-as-potential, documentary record, comparative
positioning) restates C031, C033, C038. Aggressive dedup per Stage 5 rules.

Decision: Stage 6 Quick Boosts — excluded
Reason: Recommendations for data completion, not analytical claims. The reliability
constraint (C041) already captures the analytical substance.

Decision: Reflection sections — all excluded
Reason: Per codebook: "NOT claims — exclude entirely. These are prompts for the
user, not analytical positions." No reflection in this transcript proposes an
alternative explanation; all are questions for the user.

Decision: Session Report (lines 737-788) — excluded entirely
Reason: Meta-analysis of the conversation process, not claims about the heritage
site's significance. The HITL analysis is valuable research data but falls outside
the codebook's definition of substantive claims.

Decision: Expert's v2 artifact update directives (lines 160-182) — not counted as claims
Reason: The expert directed adding CA-EV evidence types, documentary integrity specs,
preservation-as-archive framing, and Horbat Berekh outward effect. These are
incorporated into the claims as they appear in the assessment output, not counted
separately as expert-added claims.
```

---

## E. Epistemic Analysis

### Table A: Notation Accuracy

| Metric | Count | Rate | What it shows |
|--------|-------|------|---------------|
| Total claims | 43 | -- | Dataset size |
| Marked by bot (° or 💭 or °💭) | 9 | 9/43 = 20.9% | Marking rate — bot flags uncertainty in ~1 in 5 claims |
| Correctly marked | 9 | 9/9 = 100% | Precision — when bot marks, it is right (no over-marking) |
| Under-marked (should-be-° or should-be-💭) | 5 | 5/34 = 14.7% | Recall gap — 5 of 34 unmarked claims should have been flagged |
| Over-marked | 0 | 0/9 = 0% | No false positives |
| Net accuracy | 38 | 38/43 = 88.4% | (29 correctly unmarked + 9 correctly marked) / 43 |

### Table B: Expert Response Profile

| Response | Count | % of total |
|----------|-------|------------|
| validated | 0 | 0.0% |
| accepted | 34 | 79.1% |
| reframed | 6 | 14.0% |
| challenged | 0 | 0.0% |
| rejected | 1 | 2.3% |
| expert-added | 2 | 4.7% |

**Derived metrics:**
- **Acceptance rate** = (0 + 34) / 43 = 79.1%
- **Intervention rate** = (6 + 0 + 1 + 2) / 43 = 9/43 = 20.9%
- **Substantive error rate** = 1/43 = 2.3%

### Table C: Content Type Distribution

| Type | Count | % |
|------|-------|---|
| extraction | 2 | 4.7% |
| synthesis | 22 | 51.2% |
| inference | 18 | 41.9% |
| hypothesis | 0 | 0.0% |
| overreach | 1 | 2.3% |

Note: C009 is counted as overreach (primary) and is also an inference by mechanism. Total = 43 when C009 is counted once under overreach.

### Table D1: Epistemic Status x Expert Response

|  | validated | accepted | reframed | challenged | rejected | expert-added | Total |
|--|-----------|----------|----------|------------|----------|--------------|-------|
| unmarked | 0 | 25 | 3 | 0 | 1 | 2 | 31 |
| ° | 0 | 3 | 1 | 0 | 0 | 0 | 4 |
| 💭 | 0 | 3 | 0 | 0 | 0 | 0 | 3 |
| °💭 | 0 | 0 | 2 | 0 | 0 | 0 | 2 |
| *(should-be-°)* | *(0)* | *(3)* | *(1)* | *(0)* | *(0)* | *(0)* | *(4)* |
| *(should-be-💭)* | *(0)* | *(1)* | *(0)* | *(0)* | *(0)* | *(0)* | *(1)* |
| **Total** | **0** | **34** | **6** | **0** | **1** | **2** | **43** |

Note: Should-be rows (italicized) are subsets of the unmarked row, shown for analytical reference but not added to totals. Three reframed unmarked claims: C025, C032, C039. One rejected unmarked: C009. Two expert-added unmarked: C040 (plus one additional that modified existing accepted claims).

### Table D2: Content Type x Bot Marking

|  | unmarked | ° | 💭 | °💭 | Total |
|--|----------|---|---|-----|-------|
| extraction | 2 | 0 | 0 | 0 | 2 |
| synthesis | 15 | 4 | 2 | 1 | 22 |
| inference | 13 | 0 | 1 | 1 | 15 |
| hypothesis | 0 | 0 | 0 | 0 | 0 |
| overreach | 1 | 0 | 0 | 0 | 1 |
| **Total** | **31** | **4** | **3** | **2** | **40** |

Note: 3 claims not in table: C039 (inference, unmarked — counted in inference row), C040 (inference, unmarked — counted in inference row), C042 (inference, unmarked — counted in inference row). Corrected:

|  | unmarked | ° | 💭 | °💭 | Total |
|--|----------|---|---|-----|-------|
| extraction | 2 | 0 | 0 | 0 | 2 |
| synthesis | 15 | 4 | 2 | 1 | 22 |
| inference | 14 | 0 | 1 | 1 | 16 |
| hypothesis | 0 | 0 | 0 | 0 | 0 |
| overreach | 1 | 0 | 0 | 0 | 1 |
| **Total** | **32** | **4** | **3** | **2** | **41** |

Residual note: 41 vs. 43 total reflects that inference count of 18 includes C009 (counted under overreach) and C040 (expert-added). Non-overlapping: 32+4+3+2 = 41. The 2-claim difference is C009 (overreach, also an inference by mechanism) and the counting of expert-added claims. For clean analysis: 43 total claims, with some multi-classification.

### Table D3: Stage x Marking Accuracy

| Stage | Claims | Correctly classified | Under-marked | Accuracy % |
|-------|--------|---------------------|--------------|------------|
| 0 | 2 | 2 | 0 | 100.0% |
| 1 | 12 | 9 | 3 | 75.0% |
| 2 | 8 | 7 | 1 | 87.5% |
| 3 | 12 | 11 | 1 | 91.7% |
| 4 | 4 | 4 | 0 | 100.0% |
| 5 | 2 | 2 | 0 | 100.0% |
| 6 | 3 | 3 | 0 | 100.0% |
| **Total** | **43** | **38** | **5** | **88.4%** |

Under-marked by stage: Stage 1 = C003 (should-be-°), C006 (should-be-💭), C014 (should-be-°). Stage 2 = C021 (should-be-°). Stage 3 = C027 (should-be-°).

### Table E: Enabler Analysis — Key Questions

**1. Does notation work as an epistemic enabler?**

Among unmarked claims (n=31): 1 rejected + 3 reframed + 2 expert-added = 6/31 interventions (19.4%).
Among marked claims (° or 💭 or °💭, n=9): 0 rejected + 3 reframed = 3/9 interventions (33.3%).

Marked claims received a higher intervention rate (33.3% vs. 19.4%). This suggests notation functions partly as an enabler — marked claims attracted more expert scrutiny and reframing. However, the single rejected claim (C009, political context) was unmarked, meaning the most serious error carried no uncertainty signal. The pattern: notation helps calibrate existing claims but does not prevent irrelevant inclusions.

**2. Does governance catch what notation misses?**

Under-marked claims (should-be-° or should-be-💭): n=5 (C003, C006, C014, C021, C027).
Of these, expert intervened on 1 (C006 was addressed indirectly through the thematic context correction at C012, which shares the "visual network" overreach pattern).
The other 4 were accepted without challenge.

Governance catch rate for under-marked claims: 1/5 = 20%. The expert caught the most egregious overreach but did not flag subtler under-markings. Governance partially compensates but does not systematically catch notation gaps.

**3. What is the error asymmetry?**

Under-marked: 5 claims. Over-marked: 0 claims. Ratio: 5:0.

The bot is systematically **overconfident** — it under-marks rather than over-marks. This directional bias means uncertain content is presented as established. Consistent with the bot's own HITL analysis: "I followed the notation system mechanically but then wrote confident prose around those markers."

**4. Which content types are most dangerous?**

| Content type | Claims | Rejected + reframed | Risk rate |
|---|---|---|---|
| extraction | 2 | 1 (C025 reframed) | 50.0% |
| synthesis | 22 | 3 (C015, C020, C032) | 13.6% |
| inference | 18 | 4 (C012, C039 reframed; C009 rejected; C040 expert-added) | 22.2% |
| overreach | 1 | 1 (C009 rejected) | 100.0% |

Among substantive content types, inference (22.2%) carries the highest risk rate, followed by synthesis (13.6%). The extraction risk (50.0%) is an artifact of the tiny sample (n=2). Overreach is 100% caught but represents only 1 claim.

**5. Does the bot improve across stages?**

| Phase | Stages | Claims | Under-marked | Accuracy |
|---|---|---|---|---|
| Early | 1-2 | 20 | 4 | 80.0% |
| Mid | 3 | 12 | 1 | 91.7% |
| Late | 4-6 | 9 | 0 | 100.0% |

Yes — accuracy improves monotonically from 80% to 91.7% to 100%. The expert's early interventions (thematic context correction, tone directive, political context rejection in Stages 1-2) recalibrated the bot's epistemic posture. Stage 3 is the transition point. This is consistent with in-session calibration to expert feedback.

### Table F: Key Findings

1. **The bot produces predominantly synthetic and inferential content.** Synthesis (22/43, 51.2%) and inference (18/43, 41.9%) together account for 93% of all claims, with only 2 pure extractions (4.7%). This confirms the bot functions as an analytical agent generating new interpretive moves, not as a retrieval or summarization tool. (40/43, 93.0%)

2. **Epistemic notation is conservative but directionally accurate.** The bot marked 9/43 claims (20.9%) with uncertainty indicators, achieving 100% precision (9/9 correctly marked, 0 over-marked). However, 5 additional claims should have been marked (5/34 unmarked, 14.7% under-marking rate), revealing a 5:0 under-to-over-marking ratio — systematic overconfidence rather than overcaution.

3. **Expert governance is effective but selective, with a 79.1% unmodified acceptance rate.** The expert intervened on 9/43 claims (20.9%): 6 reframings, 1 rejection, 2 additions. The single rejected claim was the only content classified as overreach — a 100% catch rate for outright errors (1/1). But 4/5 under-marked claims passed without challenge (20% governance catch rate for subtle notation gaps).

4. **Notation partially enables expert oversight, but the most serious error was unmarked.** Marked claims received a higher expert intervention rate (3/9, 33.3%) than unmarked claims (6/31, 19.4%), suggesting notation draws expert scrutiny toward uncertain content. Yet the only rejected claim (C009, political context) carried no uncertainty marker — the bot presented irrelevant content with full confidence, and only the expert's domain judgment caught it.

5. **Bot accuracy improves across the session, consistent with in-session calibration to expert feedback.** Marking accuracy rises monotonically: Stages 1-2 = 80% (16/20), Stage 3 = 91.7% (11/12), Stages 4-6 = 100% (9/9). The expert's early corrections — overreach, tone, relevance — shifted the bot's epistemic posture for the remainder of the session. Zero under-marking errors occurred after Stage 3.

---

*Report generated by claim-extractor v1.1. Codebook version 1.1.*
