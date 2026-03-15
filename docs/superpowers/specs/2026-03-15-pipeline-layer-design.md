# Pipeline Layer Design

> Date: 2026-03-15
> Status: Approved (post-review revision)

## Summary

Add a **pipeline abstraction layer** between MCP tools and skills. Pipelines are fixed, reusable workflows written as markdown. Skills reference pipelines instead of inlining tool call sequences.

## Architecture: Three-Layer Hierarchy

```
┌──────────────────────────────────────────────────────┐
│  SKILL LAYER (complex orchestration, user-invocable) │
│  skill/literature-survey.md                          │
│  skill/gap-analysis.md                               │
│  skill/idea-generation.md                            │
│  ...                                                 │
│  Responsibility: iteration loops, state management,  │
│  gap discovery, stopping conditions                  │
├──────────────────────────────────────────────────────┤
│  PIPELINE LAYER (fixed workflows, skill-referenced)  │
│  pipeline/acd-searching.md  — academic search        │
│  pipeline/web-searching.md  — web search             │
│  Registration: .claude/commands/ (loaded via Skill)  │
│  Responsibility: tool orchestration order, batching,  │
│  error handling                                      │
├──────────────────────────────────────────────────────┤
│  TOOL LAYER (MCP tools, atomic operations)           │
│  neocortica-scholar: paper_searching/fetching/...    │
│  neocortica-web:     web_fetching/content            │
│  brave-search:       brave_web_search                │
│  apify:              google-scholar-scraper           │
├──────────────────────────────────────────────────────┘
```

### Key Principle

- **Skill** = WHEN and WHY (business logic, iteration, decision-making)
- **Pipeline** = HOW (fixed tool sequences, batching rules, error handling)
- **Tool** = WHAT (atomic MCP operations)

### Registration

Pipeline files are placed in `.claude/commands/` alongside skills:

```
.claude/commands/
├── literature-survey.md      # skill (user-invocable)
├── gap-analysis.md           # skill (user-invocable)
├── acd-searching.md          # pipeline (internal, invoked by skills)
├── web-searching.md          # pipeline (internal, invoked by skills)
└── ...
```

Skills invoke pipelines via the Skill tool (e.g., `Skill("acd-searching", args)`), which loads the pipeline content into CC's context. Pipelines are not intended for direct user invocation but are accessible via `/acd-searching` if needed.

## Pipeline 1: acd-searching (Academic Searching)

### Purpose

Search Google Scholar, enrich results via Semantic Scholar/arXiv/Unpaywall, and fetch full paper text.

### Input

- `queries: string[]` — 1-3 search keywords
- `papersRead: Set<string>` — normalizedTitles already processed (for dedup)

### Output

- `PaperMeta[]` — enriched paper metadata, each containing:
  - `title`, `normalizedTitle`, `authors`, `year`
  - `arxivUrl?`, `oaPdfUrl?`, `s2Id?`, `doi?`, `arxivId?`
  - `markdownPath?` — non-empty if full text fetched and cached
  - `abstract?`
  - `citationCount?`
  - `fetchFailed?` — true if fetching was attempted but failed

### Phases

```
SEARCH phase:
  For each query (parallel):
    google-scholar-scraper({ keyword: query, maxItems: 20 })
  Merge all results, deduplicate by normalizedTitle.
  Skip papers already in papersRead.

ENRICH phase:
  For each Scholar result (sequential — SS rate limit):
    paper_searching({ title, link, authors, year, citations, searchMatch })
  Collect all PaperMeta.

FETCH phase:
  Filter: only papers with arxivUrl or oaPdfUrl.
  For each paper (sequential — MinerU limit):
    paper_fetching({ title, normalizedTitle, arxivUrl, arxivId, oaPdfUrl, ... })
  Mark failed papers as fetchFailed, do not block.
```

### Error Handling

| Failure | Action |
|---|---|
| `paper_searching` timeout | Retry 1x, skip on second failure |
| `paper_fetching` failure | Mark `fetchFailed = true`, continue |
| `google-scholar-scraper` failure | Log error, use results from other queries |
| All fetches fail | Return enriched metadata only (no markdownPath) — downstream can still use abstracts |

### Batching Strategy

**Two-phase batch processing** (chosen over sliding window or inline serial):
- ENRICH phase must be sequential (Semantic Scholar rate limits)
- FETCH phase must be sequential (MinerU processing limits)
- Sliding window impractical: CC cannot maintain concurrent state via markdown instructions
- Wall-clock time difference is minimal (enriching is fast ~30-60s total, fetching is the bottleneck ~1-5 min/paper)

## Pipeline 2: web-searching (Web Searching)

### Purpose

Search the web via Brave Search, extract full page content via RAG Web Browser, and cache results.

### Input

- `queries: string[]` — 1-3 search keywords
- `maxResultsPerQuery: number` — default 3
- `urlsVisited: Set<string>` — URLs already processed (for cross-iteration dedup)

### Output

- `WebMeta[]` — web page metadata, each containing:
  - `url`, `title`, `description`, `snippet`
  - `markdownPath?` — non-empty if full content fetched and cached
  - `fetchFailed?` — true if extraction was attempted but failed

### Phases

```
DISCOVER phase:
  For each query (parallel):
    brave_web_search({ query })          ← existing brave-search MCP
  Merge all results, deduplicate by URL.
  Skip URLs already in urlsVisited.

EXTRACT phase:
  Select top N URLs by relevance from DISCOVER results.
  For each URL (sequential — Apify compute constraint):
    web_fetching({ url, title })         ← neocortica-web MCP
    (internally: RAG Web Browser → save to CACHE/web/ → return markdownPath)
```

### Error Handling

| Failure | Action |
|---|---|
| `brave_web_search` failure | Retry 1x, skip on second failure |
| `web_fetching` failure (anti-scrape/timeout) | Skip, mark `fetchFailed = true` |
| All extractions fail | Degrade to Brave snippets only (return WebMeta without markdownPath) |

### Design Rationale

Based on [Brave vs RAG Web Browser analysis](.context/2026-03-15-brave-vs-rag-web-browser.md):
- Brave Search = DISCOVER (fast, cheap, independent index, legally safe)
- RAG Web Browser = EXTRACT (full page content, JS rendering, anti-scrape bypass)
- Separating discovery from extraction is more efficient than using RAG for both

## Dependency: neocortica-web MCP Server

The web-searching pipeline depends on a new MCP server: **neocortica-web**.

### Location

`D:\NEOCORTICA-WEB` — separate repository, modeled after neocortica-scholar.

### Tools

| Tool | Input | Internal | Output |
|---|---|---|---|
| `web_fetching` | `{ url, title? }` | Apify RAG Web Browser REST API → CACHE/web/ | `WebMeta { url, normalizedUrl, title, markdownPath, fetchFailed? }` |
| `web_content` | `{ url \| normalizedUrl }` | Read CACHE/web/ | `{ content: string }` or `{ error: string }` |

Note: `brave_web_search` (existing brave-search MCP) handles the DISCOVER phase directly — neocortica-web does NOT wrap Brave Search. These are the only 2 tools in neocortica-web.

### Projected Structure

```
NEOCORTICA-WEB/
├── src/
│   ├── mcp_server.ts
│   ├── tools/
│   │   ├── web_fetching.ts     # RAG Web Browser + caching
│   │   └── web_content.ts      # Read cached markdown
│   └── utils/
│       ├── cache.ts            # CACHE/web/ management
│       ├── apify.ts            # Apify RAG Web Browser client
│       └── misc.ts             # normUrl() utility
├── package.json
├── tsconfig.json
└── README.md
```

### API Keys Required

- `APIFY_TOKEN` — Apify platform (for RAG Web Browser Actor)
- `NEOCORTICA_CACHE` — cache directory path

### MCP Config Impact

After neocortica-web is built AND fully tested, the main repo's `.mcp.json` changes:
- **Keep**: `brave-search` MCP server (still used directly by CC for DISCOVER phase)
- **Keep**: `apify` → `google-scholar-scraper` (still needed by acd-searching pipeline)
- **Remove**: `apify` → `rag-web-browser` tool usage (absorbed into neocortica-web's `web_fetching`)
- **Add**: `neocortica-web` MCP server

**IMPORTANT**: `.mcp.json` migration (step 5) MUST only happen after neocortica-web is fully operational. Removing existing tools before the replacement is ready would break the current workflow.

## Skill Refactoring Impact

### Before (literature-survey.md SEARCH phase, ~30 lines)

```
1. Query Rewriting — 3 queries
2. Parallel Search
   - google-scholar-scraper × 3
   - brave_web_search × 3
3. Enrich & Fetch
   - paper_searching per result (sequential)
   - paper_fetching for OA papers (sequential)
4. Deduplication
```

### After (~10 lines)

```
1. Query Rewriting — 3 queries
2. Execute acd-searching pipeline with queries → PaperMeta[]
3. Execute web-searching pipeline with queries → WebMeta[]
4. Merge & Deduplication
   - PaperMeta[] and WebMeta[] kept as separate collections
   - Downstream READ phase handles them differently:
     * Papers: paper_content / paper_reading (three-pass)
     * Web pages: web_content (summarize / extract key points)
```

### Affected Files

| File | Change | Details |
|---|---|---|
| `skill/literature-survey.md` | SEARCH phase → reference pipelines | Major: inline tool calls replaced |
| `skill/gap-analysis.md` | Same | Major |
| `skill/idea-generation.md` | Same | Major |
| `skill/experiment-design.md` | Same | Major |
| `skill/research.md` | Strategies reference pipelines | Major: web/hybrid strategies rewritten to use web-searching pipeline |
| `skill/neocortica-scholar.md` | Add note about pipeline layer | Minor: clarify that the tool guide is reference material, pipelines are the preferred invocation path |

## Implementation Order

1. **Write pipeline markdown files** (`pipeline/acd-searching.md`, `pipeline/web-searching.md`)
   - acd-searching uses only existing tools — can be built and tested immediately
   - web-searching initially references existing `brave_web_search` + `rag-web-browser` directly, migrates to neocortica-web tools later
2. **Register pipelines** in `.claude/commands/`
3. **Refactor skill files** — replace inline tool sequences with pipeline references
4. **Test acd-searching end-to-end** — validate with a sample search
5. **Build neocortica-web MCP server** (`D:\NEOCORTICA-WEB`) — separate project
6. **Migrate web-searching pipeline** — switch from direct brave/apify calls to neocortica-web tools
7. **Update `.mcp.json`** — add neocortica-web, remove redundant brave-search/rag-web-browser (only after step 6 is verified)
8. **Test web-searching end-to-end** — validate full pipeline

Note: Steps 1-4 can proceed independently of neocortica-web. This allows incremental delivery — the acd-searching pipeline provides value immediately while neocortica-web is being built.

## Future Extensions

Pipeline layer is designed to be extensible. Potential future pipelines:
- `pipeline/paper-reading.md` — rating + three-pass reading protocol
- `pipeline/ref-tracing.md` — citation chain tracing (reference → searching → fetching)

These will be added iteratively based on need.
