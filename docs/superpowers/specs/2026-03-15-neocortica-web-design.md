# neocortica-web MCP Server Design

> Date: 2026-03-15
> Status: Draft (post-review revision)

## Summary

Build a lightweight MCP server (`neocortica-web`) that fetches web pages as markdown and caches them locally. Two tools: `web_fetching` (URL → markdown via Apify rag-web-browser REST API → cache) and `web_content` (read cached markdown). Mirrors neocortica-scholar's architecture pattern.

## Architecture

```
CC → brave_web_search        (existing MCP, search/discover)
   → web_fetching            (neocortica-web, URL → markdown + cache)
   → web_content             (neocortica-web, read cache)
   → rag-web-browser         (existing apify MCP, optional flexible search)
```

neocortica-web is a standalone MCP server at `D:\NEOCORTICA-WEB`. It calls the Apify REST API directly (not through apify MCP). All existing MCP servers (brave-search, apify) remain unchanged.

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API access | Direct Apify REST API | Same pattern as neocortica-scholar calling SS/arXiv. No MCP-to-MCP dependency |
| Tools | 2 (web_fetching + web_content) | No web_searching — CC uses brave_web_search directly |
| Cache location | `NEOCORTICA_CACHE/web/` | Shared cache dir with neocortica-scholar |
| Existing MCPs | All retained | brave-search + apify stay for direct CC use |

## Project Structure

```
D:\NEOCORTICA-WEB/
├── src/
│   ├── mcp_server.ts        # MCP server entry (stdio transport)
│   ├── types.ts              # WebMeta interface
│   ├── tools/
│   │   ├── web_fetching.ts   # URL → rag-web-browser → cache
│   │   └── web_content.ts    # Read cached markdown
│   └── utils/
│       ├── apify.ts          # Apify REST API client
│       ├── cache.ts          # CACHE/web/ management
│       └── misc.ts           # normUrl() utility
├── .test/
│   ├── tools/
│   │   ├── web_fetching.test.ts
│   │   └── web_content.test.ts
│   ├── utils/
│   │   ├── apify.test.ts
│   │   ├── cache.test.ts
│   │   └── misc.test.ts
│   └── integration.test.ts
├── package.json
├── tsconfig.json
├── .env
├── .mcp.example.json
├── CLAUDE.md
└── README.md
```

<!-- PLACEHOLDER_TYPES -->

## Data Types

### WebMeta

```typescript
interface WebMeta {
  url: string              // Original URL
  normalizedUrl: string    // Cache key (via normUrl)
  title?: string           // Page title
  description?: string     // Page description/summary
  snippet?: string         // Brief text excerpt from the page (from Brave or extracted)
  markdownPath?: string    // Path to cached markdown file
  fetchFailed?: boolean    // True if fetch was attempted but failed
}
```

## Tool 1: web_fetching

### Purpose

Fetch a single web page as markdown via Apify rag-web-browser, cache the result locally.

### Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Yes | URL to fetch |
| title | string | No | Page title (if known from Brave results) |

### Output

`WebMeta` JSON with `markdownPath` on success, `fetchFailed: true` on failure.

### Execution Flow

```
1. normUrl(url) → normalizedUrl (cache key)
2. Cache check: CACHE/web/{normalizedUrl}.md exists?
   → YES: load meta, return WebMeta with markdownPath (cache hit)
   → NO: continue to step 3
3. Call Apify REST API:
   POST https://api.apify.com/v2/acts/apify~rag-web-browser/runs
   Body: { query: url, maxResults: 1, outputFormats: ["markdown"] }
   Header: Authorization: Bearer {APIFY_TOKEN}
4. Poll for completion:
   GET https://api.apify.com/v2/actor-runs/{runId}
   Poll every 3s, timeout 120s
5. Get result:
   GET https://api.apify.com/v2/datasets/{datasetId}/items
   Extract markdown content from first item
6. Save markdown → CACHE/web/{normalizedUrl}.md
7. Save meta → CACHE/web/{normalizedUrl}.json
8. Return WebMeta with markdownPath
```

### Error Handling

| Failure | Action |
|---------|--------|
| Apify run fails (anti-scrape, timeout) | Return WebMeta with `fetchFailed: true`, save meta JSON (no .md) |
| Empty markdown returned | Return WebMeta with `fetchFailed: true`, save meta JSON (no .md) |
| Network timeout on poll | Return WebMeta with `fetchFailed: true`, save meta JSON (no .md) |
| Cache hit (markdownPath exists) | Return immediately, no network call |
| Cache hit (fetchFailed meta exists) | Return cached WebMeta with `fetchFailed: true`, no retry |

## Tool 2: web_content

### Purpose

Read cached web page markdown. Purely local, no network requests.

### Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Either one | Original URL (converted via normUrl) |
| normalizedUrl | string | Either one | Normalized URL directly |

### Output

Returns a structured object:

```typescript
{ content: string } | { error: "Page not found in cache." }
```

On success, `content` is the full markdown string. On cache miss, returns the error object.

## Utilities

### apify.ts — Apify REST API Client

```typescript
interface ActorRunResult {
  id: string           // Run ID
  status: string       // READY, RUNNING, SUCCEEDED, FAILED, etc.
  defaultDatasetId: string
}

// Start an actor run
async function runActor(
  actorId: string,
  input: Record<string, any>,
  token: string,
  onProgress?: ProgressCallback
): Promise<ActorRunResult>

// Poll until run completes
async function waitForRun(
  runId: string,
  token: string,
  onProgress?: ProgressCallback,
  pollInterval?: number,  // default 3000ms
  timeout?: number        // default 120000ms
): Promise<ActorRunResult>

// Get dataset items from completed run
async function getDatasetItems(
  datasetId: string,
  token: string
): Promise<any[]>
```

### cache.ts — Cache Management

```typescript
// Save markdown to CACHE/web/{normalizedUrl}.md
function saveMarkdown(normalizedUrl: string, markdown: string): string

// Save meta to CACHE/web/{normalizedUrl}.json
function saveMeta(meta: WebMeta): string

// Load meta from CACHE/web/{normalizedUrl}.json
function loadMeta(normalizedUrl: string): WebMeta | null

// Check if markdown is cached, return path or null
function loadMarkdownPath(normalizedUrl: string): string | null

// Ensure CACHE/web/ directory exists
function ensureDirs(): void
```

Cache directory: `NEOCORTICA_CACHE/web/` (shared with neocortica-scholar's `NEOCORTICA_CACHE/markdown/` and `NEOCORTICA_CACHE/paper/`).

### misc.ts — URL Normalization

```typescript
// Normalize URL for use as cache key
function normUrl(url: string): string
```

Rules:
1. Strip protocol (`https://`, `http://`)
2. Strip query parameters and fragment (`?...`, `#...`)
3. Strip trailing `/`
4. Lowercase
5. Replace non-alphanumeric characters with `_`
6. Collapse multiple `_` into one
7. Strip leading/trailing `_`

Examples:
- `https://github.com/foo/bar` → `github_com_foo_bar`
- `https://arxiv.org/html/2503.12434v1` → `arxiv_org_html_2503_12434v1`
- `https://example.com/path?q=test#section` → `example_com_path`

<!-- PLACEHOLDER_ENV -->

## Environment Variables

| Variable | Purpose | Required | Default |
|----------|---------|----------|---------|
| `APIFY_TOKEN` | Apify API authentication | Yes | — |
| `NEOCORTICA_CACHE` | Shared cache directory | No | `.cache` |

## MCP Server Registration

### mcp_server.ts Pattern

Same as neocortica-scholar: stdio transport, Zod schema validation, try/catch error handling. Import `dotenv/config` at the top of `mcp_server.ts` to load `.env` variables before any other imports.

```typescript
server.tool("web_fetching", "Fetch web page as markdown and cache locally", {
  url: z.string().describe("URL to fetch"),
  title: z.string().optional().describe("Page title if known")
}, async (args) => { ... });

server.tool("web_content", "Read cached web page markdown (local only)", {
  url: z.string().optional().describe("Original URL"),
  normalizedUrl: z.string().optional().describe("Normalized URL for cache lookup")
}, async (args) => { ... });
```

### .mcp.json Addition (in NEOCORTICA main repo)

```json
"neocortica-web": {
  "command": "npx",
  "args": ["--prefix", "D:\\NEOCORTICA-WEB", "tsx", "D:\\NEOCORTICA-WEB\\src\\mcp_server.ts"],
  "env": {
    "APIFY_TOKEN": "...",
    "NEOCORTICA_CACHE": ".cache"
  }
}
```

All existing servers (brave-search, apify, neocortica-scholar, runpod, railway) remain unchanged.

## Pipeline Migration

### web-searching.md Changes

Current (interim):
```
EXTRACT phase:
  For each URL (sequential):
    rag-web-browser({ query: url, maxResults: 1, outputFormats: ["markdown"] })
  Save markdown to CACHE/web/ using Write tool.
```

After migration:
```
EXTRACT phase:
  For each URL (sequential — Apify compute limit):
    web_fetching({ url, title })
  Returns WebMeta[] with markdownPath for cached pages.
```

Key changes:
- `rag-web-browser` + manual Write → `web_fetching` (auto-cache)
- Remove interim version note
- Update migration note to reflect completion

### Skill Files

No skill file changes needed — skills reference `pipeline/web-searching.md`, which is the only file that changes.

### New Skill Guide

Create `skill/neocortica-web.md` — tool usage guide mirroring `skill/neocortica-scholar.md`.

## Testing Strategy

### Unit Tests

| File | Tests |
|------|-------|
| `misc.test.ts` | normUrl: various URL formats, query params, fragments, unicode, edge cases |
| `cache.test.ts` | save/load markdown + meta, cache-hit detection, missing file handling. Prefix: `zztest_` |
| `apify.test.ts` | Mock fetch: runActor poll logic, timeout, error responses, realistic Apify API payloads |
| `web_fetching.test.ts` | Mock apify.ts: cache-first logic, success/failure paths, fetchFailed marking |
| `web_content.test.ts` | Read cached content, missing cache returns null |

### Integration Test

`integration.test.ts` — Real Apify API call on a simple page (e.g., a static GitHub README), verify full fetch → cache → content flow.

### Test Conventions

- Framework: Node.js built-in `test` module (same as neocortica-scholar)
- Test files in `.test/` mirroring `src/` structure (note: neocortica-scholar uses `.test/` not colocated `*.test.ts` — follow same convention here)
- `zztest_` prefix for test artifacts, cleanup in `afterEach`
- Simulation tests with realistic fake Apify API responses
- Gate rule: all tests must pass before next component

## Dependencies

```json
{
  "type": "module",
  "dependencies": {
    "@modelcontextprotocol/sdk": "latest",
    "dotenv": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "tsx": "latest",
    "typescript": "latest"
  }
}
```

Notably lighter than neocortica-scholar — no XML parser, no ZIP extraction, no agent framework needed.

## Implementation Order

1. Scaffold project (`package.json`, `tsconfig.json`, `types.ts`)
2. `utils/misc.ts` + tests (normUrl)
3. `utils/cache.ts` + tests (save/load/ensureDirs)
4. `utils/apify.ts` + tests (Apify REST API client)
5. `tools/web_fetching.ts` + tests (cache-first → Apify → save)
6. `tools/web_content.ts` + tests (read cache)
7. `mcp_server.ts` (register tools, stdio transport)
8. Integration test (real Apify call)
9. Update NEOCORTICA main repo:
   - `.mcp.json` / `.mcp.example.json` — add neocortica-web
   - `pipeline/web-searching.md` — migrate from interim to neocortica-web tools
   - `.claude/commands/web-searching.md` — sync
   - `skill/neocortica-web.md` — tool usage guide
   - `CLAUDE.md` — add neocortica-web to MCP servers table


