# Evidence Types Spec — Archaeological Epistemology [CA-EV]

**Status:** Reference / dormant. Extracted from the 3 bot brains (Gemini, Claude, GPT) on 2026-04-27 because the Bezalel workshop assesses diverse cultural objects (texts, opera, fashion magazines, etc.), not archaeological sites. The 8 codes (str/mat/sci/arc/doc/srv/ana/eth) add token overhead without analytical payoff for non-archaeological cases. The general epistemic notation (〰️ / 💭) is parallel and stays in the bots — it covers all cases.

**When to re-import:** Archaeology-focused workshops or sessions where evidence type meaningfully affects interpretation. Re-add as a Part 3 appendix in the bot prompts and re-link from Stage 0's archaeological note.

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
