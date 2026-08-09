# Artifact UX Contract — Cross-Platform Visual Convergence

Tag: `[CA-UX]`

This document is the **source of truth** for visual language, AI Query behavior, and entity type palette across all InSites artifacts (KG, Single Dashboard, Collection Dashboard) on all platforms (Claude, Gemini, GPT).

---

## §1 — Shared Visual Tokens

All artifacts share this base visual language regardless of platform or artifact type.

### Light Palette

```
Background:     #f8fafc
Sidebar:        #f1f5f9
Cards:          #ffffff
Borders:        #e2e8f0
Text primary:   #1e293b
Text dim:       #64748b
Text muted:     #94a3b8
Accent:         #3b82f6  (tabs, interactive elements, stat values)
```

### Tab Bar

```
Tab bar bg:     #ffffff
Active tab:     border-bottom 2px solid #3b82f6, color #3b82f6, bg blue-50/30
Inactive tab:   color #64748b, hover bg slate-50
Tab font:       0.85rem, font-weight 700, uppercase tracking-wider
```

### Legend Strip

```
Background:     slate-800/85, backdrop-blur
Text:           #e2e8f0 (slate-200)
Dot size:       8px circle
Font:           0.72rem, font-weight 500
Position:       bottom of graph canvas
```

### Font Stack

```
Primary:        "Noto Sans", "Noto Sans Hebrew", "Noto Sans Arabic", system-ui, sans-serif
Monospace:      JetBrains Mono, monospace (where needed)
Google Fonts:   Noto Sans:wght@400;600;700;800 + Noto Sans Hebrew:wght@400;600;700;800
Smoothing:      -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale
```

### RTL Auto-Detection

Detect RTL from node names and meanings using Unicode ranges:
- Hebrew: `\u0591–\u07FF`
- Arabic presentation: `\uFB1D–\uFDFD`, `\uFE70–\uFEFC`

When RTL detected:
- Set `lang="he"` (or `"ar"`), `dir="rtl"` on document
- Flip sidebar position (left ↔ right)
- Flip graph canvas position
- Use Hebrew UI strings for labels, placeholders, tab names
- Font stack: Noto Sans Hebrew first, then Noto Sans

### Bilingual UI Strings

All artifacts must support English and Hebrew UI strings (en/he objects). The runtime auto-selects based on RTL detection. Required string keys per artifact type are defined in that artifact's skill file.

---

## §2 — Generic AI Query Contract `[CA-AIQ]`

All artifacts that include an AI Query tab follow this contract. Three platform modes use the **same UI shell** with different host capabilities.

### Platform Modes

| Platform | Mode | Host capability |
|----------|------|-----------------|
| Claude | `live` | Pass `window.claude.complete` through `host.complete` when available; otherwise use copy-to-chat |
| Gemini | `copy` | Pass `host = {}`; no direct model API call from Canvas |
| GPT | `copy` | Pass `host = {}`; no direct model API call from Preview |

### Host Call Shape

**Claude:**
```js
const live = typeof window !== "undefined"
  && window.claude
  && typeof window.claude.complete === "function";
const host = live
  ? { complete: window.claude.complete.bind(window.claude) }
  : {};
window.AtarRuntime.mount(root, DATA, host);
```

**Gemini and GPT:**
```js
window.AtarRuntime.mount(root, DATA, {});
```

No API key, direct model endpoint, or pinned model name belongs in an artifact. In copy mode display:
- Title: "Deep Graph Query" / "Deep Dashboard Query"
- Description: "Use the conversation to ask questions about this [artifact]. The chatbot can analyze relationships, trace connections, identify patterns, and interpret the heritage significance map."
- Starter prompt cards (clickable, user copies to chat)

### Shared UI Elements (All Modes)

- **Message list**: scrollable, max height 60% of sidebar
  - User messages: right-aligned compact bubble, accent background (#3b82f6), white text
  - Assistant messages: left-aligned full-width card, `border-left: 4px solid #3b82f6`, light background
- **Input**: text field + Send button, Enter key submits
- **Starter prompts**: 5 clickable suggestion cards (populate input on click)
- **Retry**: exponential backoff, up to 5 attempts
- **Markdown parsing**: bold (`**text**`), lists (`- item`), inline code
- **Error state**: "Communication error with analysis service. Please try again."

### System Prompt Template

Same structure for all artifacts — only the role and data shape change:

```
You are a heritage expert analyzing a [Knowledge Graph / Assessment Dashboard / Collection Dashboard].
Be concise (max 150 words). Format using markdown lists and bold text.
Base your answer ONLY on this data JSON:
{dataJSON}
```

### Per-Artifact Starter Prompts

**KG:**
1. "What are the main value clusters in this graph?"
2. "Which node connects the most entities?"
3. "Trace the path from [asset] to [value]"
4. "What contexts frame the significance of this site?"
5. "What's missing from this knowledge graph?"

**Single Dashboard:**
1. "Summarize the significance of this asset"
2. "What are the main gaps in this assessment?"
3. "How do values connect to contexts?"
4. "What does the integrity assessment reveal?"
5. "How does this asset compare to its comparators?"

**Collection Dashboard:**
1. "What value patterns are shared across sites?"
2. "How does the geographic distribution look?"
3. "Compare the assessment methodologies used"
4. "Where are the biggest data gaps?"
5. "What management clusters emerge?"

---

## §3 — Entity Type Palette `[CA-EC]`

Canonical 15 types. All platforms must use these exact colors.

| Type | Hex | Usage |
|------|-----|-------|
| Place | `#10b981` | Geographic locations |
| Structure / Building | `#f59e0b` | Built structures |
| Architectural Element | `#d97706` | Components of structures |
| Person | `#ec4899` | Named individuals |
| Event | `#ef4444` | Historical events |
| Story / Narrative | `#8b5cf6` | Folk tales, oral history |
| Cultural Value | `#6366f1` | Identified heritage values |
| Natural Phenomenon | `#0ea5e9` | Rivers, geology, climate |
| Artwork / Artefact | `#f43f5e` | Physical objects, carvings |
| Tradition / Custom | `#14b8a6` | Living practices |
| Social Group | `#3b82f6` | Communities, guilds |
| Historical Period | `#64748b` | Date ranges, eras |
| Religion / Belief | `#a855f7` | Faith systems |
| Collective Memory | `#84cc16` | Shared cultural memory |
| Asset | `#E53935` | The primary heritage asset |

### Optional Context Extensions

These types are rendered if present but not required in the canonical set:
- `historical_context`, `social_context`, `political_context`, `technological_context`, `environmental_context`

Context types receive colors from a dynamic fallback palette if not explicitly mapped.

### Hebrew Type Mapping

The runtime maps Hebrew type names to canonical English for color resolution. Required mappings:

| Canonical | Hebrew |
|-----------|--------|
| Natural Phenomenon | תופעה טבעית |
| Structure / Building | מבנה, מבנה / אתר |
| Architectural Element | אלמנט אדריכלי |
| Person | דמות, אדם |
| Event | אירוע |
| Story / Narrative | סיפור / נרטיב, סיפור, נרטיב |
| Social Group | קבוצה חברתית |
| Cultural Value | ערך תרבותי, ערך |
| Place | מקום |
| Artwork / Artefact | יצירת אמנות / ממצא, יצירת אמנות, ממצא |
| Tradition / Custom | מסורת / מנהג, מסורת, מנהג |
| Historical Period | תקופה היסטורית |
| Religion / Belief | דת / אמונה |
| Collective Memory | זיכרון קולקטיבי |
| Asset | נכס מורשת, נכס |

Unknown types receive a dynamic color from a fallback palette (6-color cycle).

---

## §4 — Node Sizing Tiers

| Tier | Applies to | Radius |
|------|-----------|--------|
| Primary (Asset) | Nodes with type `Asset` | 14–16px |
| Value | Nodes with type `Cultural Value` or `value_type` set | 11px |
| Standard | All other entity types | 8–10px |

Asset nodes may have a star (★) overlay to distinguish the primary heritage asset.

---

## §5 — Platform Rendering Architecture

| Artifact | Claude (React artifact) | Gemini (HTML shell) | GPT (HTML shell) |
|----------|----------------------|--------|-----|
| KG | `atar-runtime` via React shell; **live** AI Query (`window.claude.complete`) | `atar-runtime` shell; AI Query copy-to-chat | `atar-runtime` shell; AI Query copy-to-chat |
| Single Dashboard | `atar-runtime` (`type:'assessment'`); **live** AI Query | `atar-runtime` (`type:'assessment'`); copy-to-chat | `atar-runtime` (`type:'assessment'`); copy-to-chat |
| Collection Dashboard | `atar-runtime` (`type:'collection'`); **live** AI Query | `atar-runtime` (`type:'collection'`); copy-to-chat | `atar-runtime` (`type:'collection'`); copy-to-chat |

**All three platforms now render via the shared `atar-runtime`** (vanilla D3 + Leaflet, published to npm, loaded from `cdn.jsdelivr.net/npm/atar-runtime@<ver>`). The bot emits a thin shell + a `DATA` object (`type: kg | assessment | collection`) and calls `mount(root, DATA, host)`; the runtime owns all rendering (force graph, map, tabs, RTL, legend, search). Claude wraps the shell in a native React artifact and passes `host.complete = window.claude.complete` → **live** AI Query; Gemini and GPT emit a vanilla HTML shell with `host = {}` → AI Query = copy-to-chat. See `[CA-AIQ]` §2 above.

**Convergence note:** ChatGPT was the last to converge, in June 2026; the earlier vis-network build it used is no longer part of any implementation. In GPT v11, the identical shell is delivered primarily as a supported HTML Code/Preview block; a `/mnt/data` copy is created only on explicit request or reported Preview failure, never as a custom UI. All three platforms target the **same visual result** using the tokens in §1 and the colours in §3.

### Architecture Constraints

| Platform | Constraint | Consequence |
|----------|-----------|-------------|
| GPT | GPT-5.6 uses supported HTML Code/Preview blocks; Preview availability and external-network access can vary by account or workspace | All visual products = external `atar-runtime` shell from `cdn.jsdelivr.net/npm`; identical `/mnt/data` file only on request or reported Preview failure |
| GPT | No native API calls from the shell | AI Query = placeholder / copy-to-chat |
| Claude | Native artifact support | React shell loads `atar-runtime`; live API via `window.claude.complete` |
| Gemini | Must manually activate canvas mode | Without activation, outputs code as text instead of rendering |
| Gemini | No native API calls from the shell | AI Query = copy-to-chat (same shell as Claude, `host={}`) |

---

## §6 — Gemini Deployment

Same skill files work for both Claude and Gemini. When deploying to Gemini:

1. **Activate canvas mode** before generating artifacts (otherwise Gemini outputs code as text)
2. Pass `host = {}`; do not add a model API key or direct model endpoint
3. Everything else — visual language, sidebar, tabs, interactions, entity types — is identical

---

## §6.1 — Report Tab `[CA-RPT]`

Full specification in [`gpt/report-tab-spec.md`](gpt/report-tab-spec.md). Summary:

- **Position**: after Significance and before optional Debrief/Session tabs; AI Query remains last
- **Content**: structured on-screen assessment report pulling from all dashboard data, with an 800–1,200-word target
- **Export**: no print/export buttons inside ChatGPT Preview; the user requests DOCX export in chat through Code Interpreter
- **Cross-platform**: the report data structure is shared; delivery follows each host's artifact contract
- **Collection variant**: specified, and not part of this build

---

## §7 — Compliance Check

Before returning any artifact, verify:

- [ ] Visual tokens match `[CA-UX]` §1 (light palette, font stack, accent color)
- [ ] Entity type colors match `[CA-EC]` §3
- [ ] Node sizing follows §4 tiers
- [ ] AI Query follows `[CA-AIQ]` §2 for the target platform
- [ ] RTL auto-detection implemented (if bilingual)
- [ ] Hebrew type mapping included (if bilingual)
- [ ] Starter prompts match the artifact type
- [ ] System prompt includes data JSON
- [ ] No dark mode palette used (light theme everywhere)

---

## Change Log

| Date | Change |
|------|--------|
| 2026-03-27 | v1 — Initial contract. Consolidates KG, Dashboard, Collection visual language across Claude, Gemini, GPT. |
| 2026-03-27 | v1.1 — Full propagation: [CA-UX]/[CA-AIQ]/[CA-EC] refs added to mono v5, Gemini, GPT, split core. AI Query tab added to [CA-DB] + [CA-DB-C] across all platforms. MA-RC updated to v2 everywhere. GPT kg-spec renamed, collection-dashboard-spec created. Test artifacts for Gemini. |
| 2026-03-27 | v1.2 — Added [CA-RPT] Report tab spec (§6.1). New files: report-tab-spec.md (single), collection-report-spec.md (collection, not active). GPT dashboard test files created. |
| 2026-08-05 | v1.3 — Removed obsolete direct Anthropic/Gemini API calls. Claude now uses the supported host bridge when available; Gemini and GPT use copy-to-chat mode. |
