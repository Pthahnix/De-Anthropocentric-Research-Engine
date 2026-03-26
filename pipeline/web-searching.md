# Web Searching Pipeline (web-searching)

Fixed workflow for searching the web via Brave Search and extracting full page content via dare-web MCP.

## Input

- `queries: string[]` — 1-3 search keywords
- `maxResultsPerQuery: number` — default 3
- `urlsVisited: Set<string>` — URLs already processed (for cross-iteration dedup)

## Output

- `WebMeta[]` — web page metadata. Each object contains:
  - `url`, `normalizedUrl`, `title`, `description`, `snippet`
  - `markdownPath?` — non-empty if full content fetched and cached
  - `fetchFailed?` — true if extraction was attempted but failed

## Execution

### DISCOVER phase

For each query, call in parallel:

```
brave_web_search({ query: query, count: maxResultsPerQuery })
```

Merge all results. Deduplicate by URL. Skip URLs already in `urlsVisited`.

### EXTRACT phase

Select top N URLs by relevance from DISCOVER results (N = total unique URLs, capped at 15).

For each URL (sequential — Apify compute constraint):

```
web_fetching({ url: url, title: braveResult.title })
```

Returns `WebMeta` with `markdownPath` on success, `fetchFailed: true` on failure. Caching is handled internally by `web_fetching` — no manual Write needed.

## Error Handling

| Failure | Action |
|---|---|
| `brave_web_search` failure | Retry 1x, skip on second failure |
| `web_fetching` failure (anti-scrape/timeout) | Skip, mark `fetchFailed = true` (auto-cached) |
| All extractions fail | Degrade: return WebMeta with Brave snippets only (no markdownPath) |

## Notes

- DISCOVER phase uses Brave Search (fast, independent index, <1s per query) via existing brave-search MCP.
- EXTRACT phase uses dare-web's `web_fetching` tool (internally calls Apify rag-web-browser REST API, auto-caches to `CACHE/web/`).
- Sequential EXTRACT processing due to Apify compute constraints. Typical: 16-31s per page.
- Cache path convention: `CACHE/web/{normalizedUrl}.md` (normalized via `normUrl()`).
- To read cached content later: use `web_content({ url })` or `web_content({ normalizedUrl })`.

> **Migration complete** (2026-03-15): Migrated from interim version (direct `rag-web-browser` + manual Write) to dare-web MCP tools (`web_fetching` with auto-cache). DISCOVER phase still uses `brave_web_search` via existing brave-search MCP.
