# CBSA Appendices: Vocabularies, Rules, and Reference Material

This file contains all CBSA reference appendices. The bot should READ relevant sections when referenced by anchor tags in stage specifications.

---

## [GB-1] CBSA General Guidelines

CBSA is a holistic, values-based heritage assessment approach that integrates physical and non-physical aspects across multiple contexts. Central to CBSA is the **Context Effect** — see Critical Operating Rules for the operational definition. This is an interpretive/value-attribution mechanism, not a causal description of real-world change. The stages structure the thinking process, not a rigid formula.

---

## [CA-V] Value Types and Definitions

Use plain language in outputs; avoid acronyms. When relevant, adapt sub-categories.

- **Historical Value**: Connection to past events, periods, people, or functions.
- **Aesthetic Value**: Design, style, artistry, materials, setting.
- **Social Value**: Community connection, use, cultural practices.
- **Technological Value**: Construction methods or technical innovation embodied in fabric or process.
  - *In archaeology*: construction techniques, material sourcing (quarry origin, trade routes), craft specialization evidence
- **Symbolic Value**: Represents identity, belief, collective meaning, emblematic forms.
- **Landscape Value**: Contribution to wider visual / spatial / environmental setting.
  - *In archaeology*: settlement patterns, inter-site relationships, viewshed, route networks
- **Scientific Value**: Potential for research, archaeological or archival study.
  - *Research potential*: unexcavated deposits, intact stratigraphy, sealed contexts
  - *Typological value*: representative or diagnostic of a type, period, or regional tradition
  - *Methodological value*: site demonstrates or advanced a research technique or conservation method
- **Documentary / Archival Value**: Quality of recording, publication history, accessibility of research archive. A well-documented site carries value *through* its documentation — the record itself is a heritage asset, especially when physical remains have been partially removed by excavation.
  - *Preservation-as-archive*: Intact deposits are themselves a primary record — future methods may extract more than today's. This value diminishes upon excavation, even when well-documented.
- **Spiritual Value**: Religious or ritual significance.
- **Environmental Value**: Ecological connection, biodiversity, natural features.
- **Urban Value**: Relationship to urban form, streetscape, spatial coherence.
- **Mystery and Enigma Value**: Elements of uncertain origin/meaning that provoke interpretation and cultural curiosity.
- **Functional Value**: Ongoing or adapted practical use that sustains relevance.
- **Educational Value**: Supports learning, interpretation, heritage awareness.

---

## [CA-C] Context Types

**Mandatory constraint**: Every selected context must be supported by evidence and linked to values.

- **Geographic Context** — Location, climate, topography, accessibility
- **Landscape Context** — Terrain, views, vistas, natural features, visual setting
- **Urban Context** — Street grid, density, neighbourhood character, built fabric
- **Historical Context** — Periods, events, continuity, macro-processes
- **Social Context** — Community, use patterns, identity, gathering practices
- **Political Context** — Governance, regulation, power structures, land tenure
- **Technological Context** — Tools, methods, craft traditions, technical systems
- **Environmental Context** — Ecology, resources, sustainability, climate
- **Intangible Heritage** — Traditions, stories, beliefs, oral histories
- **Thematic Context** — Shared narratives, typologies, regional themes
- **Archaeological Context** — Excavation history, research campaigns, methodological approaches, site formation processes. How the site was investigated shapes what is known and what remains uncertain.

---

## [CA-T] Change Types: Operational Theory

Changes at a site affect different values differently. Understanding which type of change occurred helps explain why certain values strengthen or weaken.

### Change Type Definitions

**Fabric Changes** (material, structure, form) — Primarily affects: historical, aesthetic, scientific values. Loss of original materials reduces material authenticity. *E.g., "Original ashlar masonry replaced with modern concrete" → loss of aesthetic value.*

**Infrastructure Changes** (access, services, technical systems) — Primarily affects: functional value and practical experience. Different accessibility reshapes how the site is used. *E.g., "Access road built to remote site" → social value altered but preserved.*

**Use Changes** (original function → adaptation) — Primarily affects: social, spiritual, functional values. Site may be preserved materially but lose cultural practice. *E.g., "Church converted to museum" → loss of spiritual and social value despite structural integrity.*

**Setting Changes** (surrounding context, visual relationships) — Primarily affects: urban, landscape, symbolic values. Site visually or culturally disconnected from original context. *E.g., "Ancient temple surrounded by modern development" → loss of landscape and symbolic value.*

**Interpretation Changes** (how site is understood, narrated) — Primarily affects: all value types, depending on narrative. Cultural significance shifts even if physical form unchanged. *E.g., "History reframed to centre local narrative instead of colonial one" → changes social and symbolic value.*

### Application in the Nara Grid

Use change type prefixes in the integrity assessment to clarify which aspect of the site changed and how it affects value expression. Example: "(fabric) Original materials lost but form remains legible" versus "(use) Structure preserved materially but social practice ceased."

---

## [SM-3] Integrity and Nara Grid: Theory and Application

### Defining Integrity in CBSA

Integrity measures how much of the original form, material, use, setting, or interpretation of a site has survived intact. In CBSA, integrity is not "preserve everything perfectly" — it is about managing selective change while maintaining the values that make the site culturally significant.

A site can have:
- **High material integrity** (original materials present) but **low use integrity** (no longer in use)
- **High form integrity** (original design legible) but **low setting integrity** (surrounded by new development)

The heritage assessment question: "Which integrities matter most for this site's identified values?"

### Nara Grid Assessment

See Stage 3 for Nara Grid table structure, template columns, and assessment rules. Key principle: rate each aspect independently (high / medium / low / lost) — high integrity in one aspect does not require high integrity in others.

---

## [CA-E] Examples and Phrasing Aids

**Comparative Claims:** "Represents the… / Rare for… / Earliest known example of…"

**Implication Sentence Templates:** "Reduces legibility of… / Diminishes landmark presence of… / Obscures original volume of… / Breaks continuity of… / Alters spatial hierarchy of…"

**Integrity Phrasings:** "Later additions partially obscure… / Original profile remains legible despite…"

---

## [CA-CS] Comparative Significance Criteria

Use these criteria in Stage 4 (comparison with other assets) and Stage 5 (significance statement) to support professional judgments.

- **Period**: Represents a significant era or phase in history.
- **Rarity**: Few similar examples exist locally, regionally, or nationally.
- **Documentation**: Well-documented in archives, plans, photographs, or oral histories.
- **Ensemble Connection**: Contributes to a group of related sites or features.
- **Condition**: Degree to which original fabric or setting is preserved.
- **Selectivity/Diversity**: Contributes to diversity of heritage types represented.
- **Research Potential**: Holds potential for further scholarly, scientific, or archaeological study.

> **Archaeological specialist layer** — `[CA-EV]` evidence-type epistemology, three-state integrity, the excavation change-type, and excavation-documentation prompts — is extracted to `cbsa-archaeology-layer.md` (shared across platforms). Load it only in archaeology deployments; it is not part of this general (built-heritage-first) build.

---

## [CA-IMG] Image Analysis Aid (Optional)

**Purpose**: Extract CBSA-relevant observations from user-uploaded images.

**Output Structure**:
1. **Values Identified** — Identify visually apparent [CA-V] values (cite specific image features)
2. **Condition Assessment** — Materials, damage, alterations, visible layers
3. **Context Clues** — Time markers, setting, spatial relationships
4. **Quick Comparisons** — Similar type/period based on visual evidence
5. **Information Gaps** — What additional photograph or document would help

**Rule**: Do not fabricate; if unsure, mark with "⚠ Visual interpretation" and ask the user to confirm.

---

## [CA-EC] Entity Categories

Use these categories when selecting node type in a Knowledge Graph. Each category includes a brief description for clarity.

| Category | Description |
| --- | --- |
| Place | A geographic location, area, or region relevant to the heritage asset |
| Structure / Building | A constructed edifice or architectural ensemble |
| Architectural Element | A specific component of a structure (column, arch, frieze, etc.) |
| Person | An individual historically or culturally linked to the asset |
| Event | A discrete historical occurrence tied to the asset's timeline |
| Story / Narrative | An oral tradition, legend, or documented account |
| Cultural Value | An abstract value category from the CBSA assessment |
| Natural Phenomenon | A geological, ecological, or climatic feature |
| Artwork / Artefact | A movable object, inscription, or decorative element |
| Tradition / Custom | A recurring cultural practice associated with the asset |
| Social Group | A community, guild, congregation, or population segment |
| Historical Period | A defined chronological era relevant to the assessment |
| Religion / Belief | A faith system, cosmology, or spiritual practice |
| Collective Memory | A shared remembrance, commemoration, or cultural narrative |

**Proposed types (epistemic):** When a node genuinely falls outside these categories, you may propose a new type — the runtime gives it a fallback colour automatically (no colour-map change), so mark the node `interpretive` (💭) and name the proposed type in its `epistemic_note`. It then appears in the KG "Entities to review" list.

---

## Summary Table: Appendix Reference Map

| Appendix | Purpose | When Used |
| --- | --- | --- |
| [GB-1] | CBSA general principles & context effect theory | All stages; reference for epistemology |
| [CA-V] | Value types & definitions | Stage 2 (values identification) |
| [CA-C] | Context types & taxonomy | Stage 1 (contexts) |
| [CA-T] | Change types operational theory | Stages 2-3 (value-change-implication links) |
| [SM-3] | Integrity theory & Nara Grid guidance | Stage 3 (authenticity/integrity) |
| [CA-E] | Phrasing aids & example language | All stages (optional style reference) |
| [CA-CS] | Comparative significance criteria | Stage 4 (comparative evaluation) |
| [CA-IMG] | Image analysis protocol | When user uploads images (optional) |
| [CA-EC] | Entity categories for KG | Stage 5 / KG generation |
| [CA-KG] | Knowledge Graph specification & template | Stage 5 when KG explicitly requested |
| [CA-DB] | Assessment Dashboard specification | Post Stage 6 when dashboard requested |
| [MA-RC] | Read-Collection workflow | When user requests collection analysis |
| [MA-RA] | Read-Assessment workflow | When user requests single assessment analysis |
| [CA-HE] | Hebrew terminology map | When user interacts in Hebrew |

---

## [CA-HE] Hebrew Output Overlay

### Rendering Directive
When the user's language is Hebrew, render ALL structural elements using the maps below. Prose remains natural Hebrew. Do not mix English structural labels into Hebrew output.
- HTML artifacts: add `dir="rtl" lang="he"` to the root element. Add `body { direction: rtl; text-align: right; }` to CSS.
- **Sub-section numbering**: Use simple numbers (1, 2, 3) not decimals (1.0, 2.0, 3.0) in Hebrew output.
- Do not translate methodology concepts: CBSA, Context Effect (אפקט-הקשר), Human-in-the-Loop, CSR, DQR.

### Stage Title Map
| English | עברית |
|---|---|
| Stage 0: Preliminary Review | שלב 0: בדיקת מידע מקדימה |
| Stage 1: Contexts | שלב 1: תיאור והקשרים |
| Stage 2: Values | שלב 2: ערכים |
| Stage 3: Authenticity & Integrity | שלב 3: אותנטיות ושלמות |
| Stage 4: Comparative Analysis | שלב 4: ניתוח השוואתי |
| Stage 5: Cultural Significance Statement | שלב 5: הצהרת משמעות תרבותית |
| Stage 6: Quality Check & Summary | שלב 6: בקרת איכות וסיכום |

### Table Header Maps
**Stage 0 checklist**: קטגוריה / סטטוס / הערה
**Stage 0 documentation profile**: מקור / דרגה / סוג / מגבלות
**Stage 1 timeline**: תיארוך / שינוי בשימוש / שינוי במבנה / הערות
**Stage 2 values**: מאפיין / ערך/ים משויכים / משמעות באתר / 🔑 השלכה
**Stage 3 Nara Grid**: היבט / תיאור / ביטוי ערכים / שלמות
**Stage 6 quick boosts**: בעיה / שיפור שיעשה הבדל
**Collection reading**: שם / מיקום / סוג / תקופה / תיאור / תקציר משמעות / ערכים / שלמות·אותנטיות / השוואות / איומים

### Common Labels
**Integrity ratings**: גבוהה / בינונית / נמוכה / אבודה
**Evidence notation**: no mark = מפורש במקור, 〰️ = מוסק מ-2+ ראיות, 💭 = פרשנות (הסקה רחוקה יותר — הפרוז חייב להשתמש בשפה מסוייגת: "ייתכן", "מרמז", "אפשר ש-")
**Citation format**: [קובץ:עמוד] (not [file:page])
**Stage closing**: "להמשיך לשלב N?" (not "Continue to Stage N?")
**Reflection labels**: "לחשיבה" / "לפני שממשיכים"

### Entity Types for KG
Use these Hebrew names in KG JSON data (aligned with kg-runtime.js TYPE_PAIRS):
מקום, מבנה, אלמנט אדריכלי, דמות, אירוע, סיפור/נרטיב, ערך תרבותי, תופעה טבעית, יצירת אמנות/ממצא, מסורת/מנהג, קבוצה חברתית, תקופה היסטורית, דת/אמונה, זיכרון קולקטיבי, נכס מורשת

### Value Type Labels
היסטורי, אסתטי, חברתי, טכנולוגי, סמלי, נופי, מדעי, רוחני, סביבתי, אורבני, תיעודי, חינוכי
אניגמה-מסתורין
