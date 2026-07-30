מעולה! קראתי את כל הפוסט. הנה קובץ CLAUDE.md מוכן לשימוש מבוסס על השיטה של Karpathy, מותאם ל-Claude Code ב-VS Code. פשוט צור את מבנה התיקיות והקובץ הזה:

מבנה תיקיות ליצור:
my-knowledge-base/
├── raw/
│   └── assets/
├── wiki/
├── outputs/
└── CLAUDE.md

תוכן הקובץ CLAUDE.md:
markdown# Knowledge Base Schema

## Identity
This is a personal knowledge base about [YOUR TOPIC HERE].
Maintained by an LLM agent. The human curates sources and asks questions. The LLM does everything else.

## Architecture
- raw/ contains immutable source documents. NEVER modify files in raw/.
- wiki/ contains the compiled wiki. The LLM owns this directory entirely.
- outputs/ contains generated reports, analyses, and query answers.

## Wiki Conventions
- Every topic gets its own .md file in wiki/
- Every wiki file starts with YAML frontmatter:
  ---
  title: [Topic Name]
  created: [Date]
  last_updated: [Date]
  source_count: [Number of raw sources that informed this page]
  status: [draft | reviewed | needs_update]
  ---
- After frontmatter, a one-paragraph summary
- Use [[topic-name]] for internal links between wiki pages
- Every factual claim cites its source: [Source: filename.md]
- When new info contradicts existing content, flag explicitly:
  > CONTRADICTION: [old claim] vs [new claim] from [source]

## Index and Log
- wiki/index.md lists every page with a one-line description, by category
- wiki/log.md is append-only chronological record
- Log entry format:
  ## [YYYY-MM-DD] action | Description
  (Actions: ingest, query, lint, update)

## Ingest Workflow
When processing a new source:
1. Read the full source document
2. Discuss key takeaways with user
3. Create or update a summary page in wiki/
4. Update wiki/index.md
5. Update ALL relevant entity and concept pages across the wiki
6. Add backlinks from existing pages to new content
7. Flag any contradictions with existing wiki content
8. Append entry to wiki/log.md
9. A single source should touch 10-15 wiki pages

## Query Workflow
When answering a question:
1. Read wiki/index.md first to find relevant pages
2. Read all relevant wiki pages
3. Synthesize answer with [Source: page-name] citations
4. If answer reveals new insights, offer to file it back into wiki/
5. Save valuable answers to outputs/

## Lint Workflow (Monthly)
Check for:
- Contradictions between pages
- Stale claims superseded by newer sources
- Orphan pages with no inbound links
- Concepts mentioned but never explained
- Missing cross-references
- Claims without source attribution
Output: wiki/lint-report-[date].md with severity levels (🔴 errors, 🟡 warnings, 🔵 info)

## Focus Areas
- [Area 1]
- [Area 2]
- [Area 3]

הפרומפטים לשימוש יומיומי (שמור אותם בצד):
INGEST (מקור בודד):

Read the schema in CLAUDE.md. Process [FILENAME] from raw/. Read it fully, discuss key takeaways with me, then: create summary page, update index, update all relevant pages, add backlinks, flag contradictions, log the ingest.

INGEST (באצ׳):

Read CLAUDE.md. Process all unprocessed files in raw/ sequentially. For each: create summary, update index, update relevant pages, log the ingest. Proceed automatically.

QUERY:

Read wiki/index.md. Answer: [QUESTION]. Cite wiki pages. If this answer is worth preserving, offer to file it as a new wiki page.

LINT:

Run a full health check on wiki/ per the lint workflow in CLAUDE.md. Output to wiki/lint-report-[date].md with 🔴/🟡/🔵 severity. Suggest 3 articles to fill gaps.

EXPLORE:

Read wiki/index.md and identify the 5 most interesting unexplored connections between existing topics. For each, explain what insight it might reveal and what source would help confirm it.

BRIEF:

Based on everything in wiki/, write a 500-word executive briefing on [TOPIC]. Cite sources. Structure it as: current state, key tensions, open questions, recommended next steps.
מה לעשות עכשיו:

צור את מבנה התיקיות על המחשב שלך
העתק את קובץ ה-CLAUDE.md לתיקיית השורש, ושנה את [YOUR TOPIC HERE] ואת ה-Focus Areas לנושא שלך
זרוק מקורות (מאמרים, הערות, PDFs) לתוך raw/
פתח את הפרויקט ב-VS Code עם Claude Code
הדבק את פרומפט ה-INGEST והתחל עם מקור אחד בכל פעם

רוצה שאתאים את הקובץ לנושא מסוים שלך?