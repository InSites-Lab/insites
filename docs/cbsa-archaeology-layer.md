# CBSA — Archaeology Specialist Layer (optional, on-demand)

**What this is.** The dedicated archaeological-epistemology layer extracted from the InSites-CAA bot core — **shared, platform-agnostic content** that Claude (mono + split), GPT, and Gemini all omit from their general builds and reuse from this single file. The base bot is **general** (all heritage types, especially built heritage) and can still assess an archaeological asset at a general level — it simply does not carry this specialist layer by default. This file holds the archaeologist-specific additions: evidence-type epistemology, three-state integrity, excavation-as-change-type, and the excavation-documentation prompts.

**When to use.** Only for **archaeology-oriented deployments** (excavation reports, survey data, stratified sites). For built-heritage / personal-object / general scenarios it is **not needed** — keep it out of the project entirely (an unused on-demand file still counts toward the Project's file budget / RAG threshold).

**How to deploy (archaeology deployments only — same file on every platform).**
1. Upload this file as knowledge **only** in an archaeology-oriented deployment.
2. Add a trigger so the bot loads/uses it when relevant:
   - **Claude:** add a row to `cbsa-core.md`'s `<FILE_LOADING_ROUTER>`: `| Stage 0 detects an excavation report / archaeological survey, or "archaeological assessment" | cbsa-archaeology-layer.md |`
   - **GPT:** add it as a knowledge file + a workflow-table row that loads it on an archaeology trigger.
   - **Gemini:** RAG retrieval of a separate file is less reliable — for a Gemini archaeology Gem, prefer pasting these blocks back inline rather than relying on retrieval.
3. The blocks below restore the exact behaviour that was in the core before extraction (`[CA-EV]`, the `[SM-3]` three-state model, the `[CA-T]` methodological change type).

> **Base bot is unchanged in behaviour for non-archaeological assets.** Removing this layer does not weaken general assessment — the general values, the `Archaeological Context` lens (`[CA-C]`), the finds/material-culture checklist row, and the `Research Potential` comparison criterion all remain in the core.

---

## [CA-T addendum] Methodological Changes (change type)

Add to `[CA-T] Change Types` when archaeological:

**Methodological Changes** (archaeological excavation, professional intervention)
 - Primarily affects: scientific, historical, documentary values
 - Implication: Material is intentionally removed through professional practice — the excavation record compensates for physical loss when documentation is thorough
 - Example: "Upper Byzantine stratum excavated and removed to expose earlier Roman phase" → material integrity reduced, but if well-documented, documentary/archival value preserved
 - **Key distinction**: Methodological removal is professional practice, not damage. Distinguish from uncontrolled loss (erosion, looting, construction).
 - **Strategic non-intervention**: Choosing *not* to excavate preserves the site's research archive for future methods at the cost of current knowledge. Assess what is gained (intact deposits) and what is deferred (unanswered questions).

---

## [SM-3 addendum] Archaeological Integrity: Three-State Principle

Add to `[SM-3] Integrity and Nara Grid` when the site has archaeological layers or excavation history. Offer the three-state integrity model:

> "I can also assess integrity across three temporal states: at-exposure, post-excavation, and as-potential. Would you like me to apply this?"

If the user accepts, apply the model below. If no archaeological dimension exists, skip entirely.

The three states:

1. **Integrity-at-exposure** — the condition of remains when first uncovered: stratigraphy intact, spatial relationships visible, sealed contexts undisturbed.
2. **Integrity-post-excavation** — what survives after the excavation: layers removed to reach earlier phases, sections cut, diagnostic finds extracted, some strata sacrificed.
3. **Integrity-as-potential** — for unexcavated sites: undisturbed deposits hold future-value that diminishes upon excavation, even when well-documented. Rate alongside material condition when the site (or portions) remains unexcavated.

**Why this matters**: Excavation is simultaneously documentation and destruction. A layer that was professionally excavated and meticulously recorded (plans, sections, photographs, finds catalog) retains **documentary integrity** even after its material integrity is lost. This connects directly to Documentary/Archival Value [CA-V].

**Application in the Nara Grid**: For archaeological sites, the "Attribute Description" column should note both states where relevant:
- "(at-exposure) Intact mosaic floor with geometric pattern, sealed by collapse layer"
- "(post-excavation) Mosaic conserved in situ; collapse layer removed and documented"

**Assessment question**: When the excavation removed material, was the documentation thorough enough that the knowledge survives the loss of fabric? Rate documentation quality alongside material condition.

---

## [CA-EV] Evidence Types: Archaeological Epistemology

In archaeological and heritage assessment, the **type of evidence** supporting a claim affects how it should be weighted and interpreted. This classification complements the certainty notation (〰️ / 💭) — a claim can be explicit in source but based on weak evidence type, or inferred but from strong evidence.

### Evidence Type Classification

| Code | Evidence Type | Description | Typical Strength |
|------|--------------|-------------|------------------|
| **str** | Stratigraphic | In-situ archaeological layers, sealed contexts, locus relationships | High |
| **mat** | Material-diagnostic | Pottery, coins, inscriptions — typologically dated | High (when in context) |
| **sci** | Scientific dating | C14, TL, OSL, dendrochronology, archaeomagnetism | High |
| **arc** | Architectural-structural | Building phases readable from standing fabric | Medium-High |
| **doc** | Documentary | Historical texts, maps, archives, traveler accounts | Medium (source-dependent) |
| **srv** | Survey / remote sensing | Surface finds, geophysical survey, aerial photography | Medium-Low |
| **ana** | Analogical | Parallels from other sites, regional typological patterns | Low-Medium |
| **eth** | Oral / ethnographic | Local traditions, community memory, living practice | Variable |

### Usage in CBSA Stages

**Stage 0**: Note which evidence types are present in the uploaded material. This sets expectations for the entire assessment.

**Stage 1 (Timeline)**: When recording dated events, note the evidence type when it strengthens or qualifies the dating:
> "4th century CE synagogue [str (stratigraphic)+mat (material-diagnostic): sealed coin hoard, A:23]"
> "Possibly Hellenistic origin [ana (analogical)〰️: regional parallels, B:7]"

**Stage 2 (Values)**: Evidence type affects how confidently a value can be asserted. A value supported by stratigraphic evidence carries different weight than one based on analogy alone.

**Stage 3 (Integrity)**: Evidence type is critical for assessing what is known about condition — direct observation vs. inference from records.

### Integration with Existing Notation

Evidence types **combine** with certainty notation — they don't replace it:
- `[str: A:23]` — stratigraphic evidence, explicit in source
- `[ana〰️: B:7]` — analogical evidence, inferred
- `[doc 💭: C:12]` — documentary evidence, uncertain interpretation

**Rule**: Evidence type tagging is **optional but encouraged** for archaeological sites. The bot should use it when the evidence type meaningfully affects interpretation. Do not force-tag every claim — use it where it matters.

**Display rule**: Spell out each evidence type code on its first use in each stage — e.g., `[str (stratigraphic)+mat (material-diagnostic): A:23]`. After first use in that stage, abbreviate: `[str+mat: A:45]`. This keeps the output self-documenting without a separate legend block.

---

## [Stage 0 addendum] Archaeological sites note

Add to the Stage 0 Data Quality Scan checklist notes:

> **Archaeological sites note**: If the uploaded material is an excavation report or archaeological survey, note the document type and the dating methods used (see [CA-EV] for evidence type classification). This helps calibrate certainty throughout subsequent stages.

---

## [Stage 3.2 addendum] Archaeological excavation documentation

Add to Stage 3.2 Integrity Condition Description:

> **Archaeological sites**: If the site has been excavated, assess documentation quality of removed layers. Ask:
> - Were removed strata professionally recorded (plans, sections, photos, locus sheets)?
> - Does the excavation archive exist and is it accessible?
> - Does the documentation compensate for material that is no longer physically present?
>
> This feeds into the Documentary/Archival Value assessment and may affect the overall integrity rating.
