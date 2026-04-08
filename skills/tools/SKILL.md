---
name: DARE Tool Reference
description: >
  Quick reference for all DARE MCP tools, pipelines, and data types.
  Covers dare-scholar (paper pipeline), dare-web (web pipeline), alphaxiv (paper search/Q&A/code),
  apify, brave-search, and runpod tools. Use when you need to look up tool names, parameters,
  or usage patterns.
---

# DARE — Tool Reference

Research toolkit using external MCP servers for academic search, web retrieval, paper Q&A, code exploration, and GPU pod management.

## MCP Servers & Tools

### dare-scholar (Academic Paper Pipeline)

See `skills/tools/references/dare-scholar.md` for detailed usage guide.

| Tool | Purpose |
|------|---------|
| `paper_searching` | Enrich Google Scholar results into PaperMeta (arXiv, SS, Unpaywall) |
| `paper_fetching` | Fetch full paper as markdown (cache-first, multi-source fallback) |
| `paper_content` | Read cached paper markdown (local only, no network) |
| `paper_reference` | Get paper references via Semantic Scholar API |
| `paper_reading` | AI three-pass reading (Keshav method) via LLM agent |

### dare-web (Web Page Pipeline)

See `skills/tools/references/dare-web.md` for detailed usage guide.

| Tool | Purpose |
|------|---------|
| `web_fetching` | Fetch web page as markdown via Apify rag-web-browser (cache-first) |
| `web_content` | Read cached web page markdown (local only, no network) |

### alphaxiv (Paper Search, Q&A, Code Exploration)

See `skills/tools/references/alphaxiv.md` for detailed usage guide.

| Tool | Purpose | Unique capability |
|------|---------|-------------------|
| `embedding_similarity_search` | Semantic paper search (arXiv) | Embedding-based conceptual matching |
| `full_text_papers_search` | Keyword paper search (arXiv) | Full-text snippet matching |
| `agentic_paper_retrieval` | Multi-turn autonomous retrieval (arXiv, beta) | Agentic multi-round search |
| `get_paper_content` | AI-generated paper report or raw full text | Instant pre-generated LLM-optimized reports |
| `answer_pdf_queries` | Ask questions about any paper PDF | **Targeted paper Q&A (dare-scholar cannot do this)** |
| `read_files_from_github_repository` | Read files from a paper's GitHub repo | **Code exploration (dare-scholar cannot do this)** |

> **alphaxiv is auxiliary to dare-scholar**: dare-scholar covers all academic sources via Google Scholar; alphaxiv covers arXiv only but adds paper Q&A and code exploration capabilities that dare-scholar lacks.

### apify (Google Scholar + Web Scraping)

| Tool | Purpose |
|------|---------|
| `marco.gullo/google-scholar-scraper` | Search Google Scholar, returns raw results |
| `apify/rag-web-browser` | Fetch web page as markdown |

### brave-search (Web Search)

| Tool | Purpose |
|------|---------|
| `brave_web_search` | Web search via Brave Search API |

### runpod (GPU Pod Lifecycle)

| Tool | Purpose |
|------|---------|
| `create-pod` | Create GPU pod |
| `start-pod` / `stop-pod` / `delete-pod` | Pod lifecycle management |
| `list-pods` / `get-pod` | Pod status queries |

## Academic Search Pipeline

### Primary: dare-scholar (full coverage)

```
google-scholar-scraper → paper_searching → paper_fetching → paper_content
                                                           → paper_reference
                                                           → paper_reading
```

1. **Search**: `google-scholar-scraper` × N queries (parallel)
2. **Enrich**: `paper_searching` per result (sequential, avoid rate limits)
3. **Fetch**: `paper_fetching` for those with arxivUrl/oaPdfUrl (sequential)
4. **Read**: `paper_content` for cached text, or `paper_reading` for AI analysis

### Auxiliary: alphaxiv (arXiv-only, adds Q&A + code)

```
embedding_similarity_search ─┐
full_text_papers_search      ├→ get_paper_content → answer_pdf_queries
agentic_paper_retrieval     ─┘                    → read_files_from_github_repository
```

1. **Search**: Run 1-3 AlphaXiv search tools in parallel for arXiv coverage
2. **Read**: `get_paper_content` for instant AI report (or `fullText: true` for raw text)
3. **Q&A**: `answer_pdf_queries` for targeted questions (unique to AlphaXiv)
4. **Code**: `read_files_from_github_repository` for implementation inspection (unique to AlphaXiv)

> **When to use AlphaXiv vs dare-scholar**: Use dare-scholar as primary (broad coverage). Add AlphaXiv when you need paper Q&A, code exploration, or supplementary arXiv-specific search. Deduplicate by arXiv ID when running both.

## Reference Exploration Pipeline

```
paper_reference → paper_searching → paper_fetching
```

1. **References**: `paper_reference` returns PaperMeta[] (SS basic info only)
2. **Enrich**: `paper_searching` per reference (fills arxivUrl/oaPdfUrl/abstract)
3. **Fetch**: `paper_fetching` for enriched references with OA sources

## Data Types

```typescript
PaperMeta {
  title, normalizedTitle,        // required
  arxivId?, doi?, s2Id?,         // identifiers
  abstract?, arxivUrl?, oaPdfUrl?, pdfPath?,  // metadata
  year?, authors?, citationCount?, sourceUrl?,
  markdownPath?                  // path to cached full-text markdown
}

ScholarItem {
  title?, link?, authors?, year?,
  citations?, searchMatch?, documentLink?
}
```

## Cache

Managed by dare-scholar via `DARE_CACHE` env var:
- `markdown/` — paper full-text (.md)
- `paper/` — paper metadata (.json)

Filenames normalized: lowercase, non-alphanumeric → `_`, no trailing `_`.

## Tool Usage in Iterative Loop Engine

All research skills use the same search pattern per iteration:

- **Parallel searches**: `google-scholar-scraper` × 3 + `brave_web_search` × 3 = 6 searches (primary)
- **Supplementary arXiv searches**: AlphaXiv `embedding_similarity_search` / `agentic_paper_retrieval` when primary results are insufficient
- **Sequential enrichment**: Scholar results → `paper_searching` → `paper_fetching`
- **Paper Q&A**: `answer_pdf_queries` for targeted extraction without full read
- **Code inspection**: `read_files_from_github_repository` for reproducibility checks
- **Iterative refinement**: SEARCH→READ→REFLECT→EVALUATE cycle
- **Autonomous gap discovery**: System identifies missing information and searches again
- **Dynamic stopping**: Continues until knowledge is sufficient, not fixed iteration count
