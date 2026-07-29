---
name: web-search
description: Quick web scanning — discover pages, get snippets, find URLs. For orientation
  only, not substantive analysis.
type: sop
layer: sop
tools:
  web-search-provider:
  - web_search
  - news_search
input: query (string)
output: SearchResult[] with title, URL, snippet, date
dependencies:
  sops:
  - web-research
---

# Web Search SOP

## Layer Rules
- **Layer**: sop — wraps MCP tools directly
- **Called by**: Any tactic or strategy requiring quick web orientation
- **Calls**: configured web-search MCP tools (never calls other SOPs)

## Purpose

Fast orientation search. Understand what pages and sources exist on a topic. Suitable for quick fact-checking, getting an overview of a landscape, or finding URLs for deeper research via web-research.

Use this when you need to:
- Find what pages exist on a topic
- Get a rough overview of available information
- Discover URLs for deeper research (via web-research)
- Quick fact-check with snippet-level confidence
- Monitor recent news on a topic

**This skill returns snippets only.** For full-page content analysis, use `web-research`.

## Provider Selection

Use whichever web-search MCP is configured — check availability yourself.
If more than one is active, try them in the order listed below. This order
is just the writing order, not a hard priority — any active provider is
equally valid.

- Brave — see Provider Details § Brave
- Tavily — see Provider Details § Tavily
- Keenable — see Provider Details § Keenable (keyless; no API key required)

Set the result count to ~10 per call (provider-specific parameter named in
each Provider Details subsection).

## HARD-GATE

<HARD-GATE>
**Web search returns snippets only (1-3 sentences per result).**

Snippets are NOT authoritative content. They are orientation signals.

**PROHIBITED:**
- Drawing substantive conclusions from snippets alone
- Treating snippet content as verified facts
- Completing a research task using only search results
- Presenting snippet summaries as thorough analysis

**REQUIRED:**
- Label all results as "snippets for orientation"
- For any analysis requiring full content, escalate to `web-research`
- Make clear to the user that snippets provide direction, not answers
</HARD-GATE>

## Workflow

### Step 1: Formulate Query

- Use specific, targeted keywords
- Consider time filters if the provider supports them
- Consider result count: 5-20 results (default ~10)
- For news: use news-specific search if available
- For location-based: use local search if available

### Step 2: Execute Search

Call the configured provider's search tool with ~10 results per call.
See Provider Details for exact tool name and parameters.

### Step 3: Return Structured Results

For each result, present:
- **Title** — page title
- **URL** — full URL (for reference or escalation to web-research)
- **Snippet** — 1-3 sentence description (orientation only, not authoritative)
- **Date** — when available (especially for news)

## Provider Details

### Brave

**Available tools:**

| Tool | Purpose | Returns |
|------|---------|---------|
| `brave_web_search` | General web search | URL, title, description snippet |
| `brave_news_search` | Recent news articles | URL, title, snippet, date |
| `brave_video_search` | Video content discovery | URL, title, description, duration |
| `brave_image_search` | Image search | URL, title, image properties |
| `brave_local_search` | Local businesses/places | Name, address, rating, hours |
| `brave_summarizer` | AI-generated summary (Pro only) | Summarized text with references |

**Key parameters:**

- `brave_web_search`:
  - `query` (required): search terms, max 400 chars
  - `count`: 1-20 results (default 10)
  - `offset`: pagination, 0-9 (default 0)
  - `freshness`: `pd` (24h), `pw` (7d), `pm` (31d), `py` (365d), or `YYYY-MM-DDtoYYYY-MM-DD`
  - `safesearch`: off / moderate / strict (default moderate)
  - `search_lang`: language code (default en)
  - `country`: 2-letter country code (default US)
  - `result_filter`: array of types to include (web, news, videos, etc.)

- `brave_news_search`: same core parameters, better for time-sensitive queries
- `brave_video_search`: returns `duration` and `thumbnail_url`
- `brave_image_search`: `count` 1-200 (default 50)
- `brave_local_search`: for "near me" queries, returns business details
- `brave_summarizer`: requires Pro plan, must first run `brave_web_search` with `summary=true`

**Examples:**

Quick fact check:
```
brave_web_search(query="Claude 3.5 Sonnet release date", count=5)
```

News monitoring:
```
brave_news_search(query="transformer architecture breakthroughs", freshness="pm", count=10)
```

Landscape scan:
```
brave_web_search(query="MCP server frameworks comparison 2025", count=15)
```

### Tavily

**Available tools:**

| Tool | Purpose | Returns |
|------|---------|---------|
| `tavily_search` | LLM-optimized web search | URL, title, content snippet, score |

**Key parameters:**

- `tavily_search`:
  - `query` (required): search terms
  - `max_results`: number of results (default 10)
  - `search_depth`: `basic` or `advanced` (default basic)
  - `include_domains`: restrict to specific domains
  - `exclude_domains`: exclude specific domains

**Examples:**

Quick fact check:
```
tavily_search(query="Claude 3.5 Sonnet release date", max_results=5)
```

Landscape scan:
```
tavily_search(query="MCP server frameworks comparison 2025", max_results=10)
```

### Keenable

Keyless by default — the `keenable` MCP server needs no API key.

**Available tools:**

| Tool | Purpose | Returns |
|------|---------|---------|
| `search_web_pages` | Web search over the Keenable index | title, URL, description snippet |
| `fetch_page_content` | Fetch a URL as clean markdown | title, URL, full page content |

**Key parameters:**

- `search_web_pages`:
  - `query` (required): search terms
- `fetch_page_content`:
  - `url` (required): page to fetch as markdown

**Examples:**

Quick fact check:
```
search_web_pages(query="Claude 3.5 Sonnet release date")
```

Landscape scan then deep read:
```
search_web_pages(query="MCP server frameworks comparison 2025")
fetch_page_content(url="https://...")
```

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| web-research | Deep web research — fetches full page content for analysis. Snippets alone are PROHIBITED for conclusions. |

<!-- END available-tables (generated) -->
