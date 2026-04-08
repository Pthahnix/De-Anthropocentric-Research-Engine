---
name: AlphaXiv Tools
description: Detailed usage guide for the AlphaXiv MCP tools (embedding_similarity_search, full_text_papers_search, agentic_paper_retrieval, get_paper_content, answer_pdf_queries, read_files_from_github_repository).
---

# AlphaXiv MCP Tools Usage Guide

## Overview

6 MCP tools providing AI-powered academic paper search, reading, Q&A, and code exploration. AlphaXiv is an auxiliary source alongside dare-scholar — it covers arXiv papers only (not Google Scholar's full scope).

```
Search (3 tools)  →  Read (1 tool)
                  →  Q&A  (1 tool)
                  →  Code (1 tool)
```

> **Relationship to dare-scholar**: AlphaXiv complements, not replaces, the dare-scholar pipeline. Use dare-scholar (Google Scholar → Semantic Scholar → arXiv/Unpaywall) for broad coverage; use AlphaXiv for arXiv-specific search, instant paper Q&A, and code exploration — capabilities dare-scholar does not have.

---

## Tool 1: embedding_similarity_search

**Purpose**: Search papers by semantic/conceptual similarity using embeddings. Best for finding papers about specific concepts, methods, or research areas.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | yes | Detailed 2-3 sentence search query covering the research area from multiple angles. Include key concepts, methods, applications, and related terms. |

**Returns**: Up to 25 papers ranked by similarity + popularity: title, visit count, likes, date, organizations, authors, abstract preview, arXiv ID.

**When to use**:
- Finding papers about a concept or method when you know what you're looking for conceptually
- "What papers exist about topology-aware mesh generation?"
- Best with descriptive, multi-angle queries (not short keywords)

**Example**:
```json
{
  "query": "Research on transformer architectures using self-attention mechanisms for sequence modeling. Papers covering attention-based neural networks, positional encodings, and their applications to natural language processing tasks."
}
```

---

## Tool 2: full_text_papers_search

**Purpose**: Search the AlphaXiv database by keyword. Best for exact method names, benchmark names, author names, or paper titles.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | yes | Plain keywords separated by spaces. Keep short (3-4 terms). Paper titles and author names work as-is. Do NOT use quotation marks. |

**Returns**: Up to 25 papers with: title, date, abstract preview, arXiv ID, matching text snippets.

**When to use**:
- Searching for a specific paper by title or author
- Looking up a named method, benchmark, or dataset
- "LoRA low-rank adaptation", "Yann LeCun", "GSM8K math reasoning"

**Example**:
```json
{
  "query": "LoRA low-rank adaptation"
}
```

---

## Tool 3: agentic_paper_retrieval

**Purpose**: Multi-turn agentic retrieval that autonomously performs multiple search rounds to find relevant papers. Currently in beta.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | yes | Natural language research question or topic description. |

**Returns**: Papers ordered by relevance with: title, visit count, likes, date, organizations, authors, abstract preview, arXiv ID.

**When to use**:
- Broad research questions where comprehensive coverage matters
- When you want the system to autonomously explore multiple angles
- "What are the latest approaches to reducing hallucination in LLMs?"
- Best for open-ended exploration, NOT for finding a specific known paper

**Example**:
```json
{
  "query": "How do recent papers approach multi-modal alignment between vision and language models?"
}
```

---

## Tool 4: get_paper_content

**Purpose**: Get paper content as text. By default returns a structured AI-generated report optimized for LLM consumption. Optionally returns raw full text.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string (URL) | yes | arXiv or AlphaXiv URL (e.g., `https://arxiv.org/abs/2307.12307`, `https://alphaxiv.org/overview/2307.12307`) |
| `fullText` | boolean | no | If true, return raw extracted text instead of AI report. Default: false. |

**Returns**: Paper content as text — AI-generated structured report (default) or raw full text.

**When to use**:
- Quick understanding of a paper without deep three-pass reading
- Getting an LLM-optimized summary when dare-scholar's paper_reading (Keshav three-pass) would be overkill
- Use `fullText: true` when you need the actual paper text for detailed analysis

**Comparison with dare-scholar**:
| | AlphaXiv `get_paper_content` | dare-scholar `paper_reading` |
|---|---|---|
| Speed | Instant (pre-generated report) | Slow (LLM agent reads in real-time) |
| Depth | Fixed (AI report) | Configurable (High/Medium/Low) |
| Coverage | arXiv papers only | Any paper with accessible PDF |
| Caching | Server-side (AlphaXiv manages) | Local cache (you control) |

**Example**:
```json
{
  "url": "https://arxiv.org/abs/1706.03762"
}
```

---

## Tool 5: answer_pdf_queries

**Purpose**: Answer a question about a paper by analyzing its PDF content. Supports arXiv, AlphaXiv, Semantic Scholar, or any publicly accessible PDF URL.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string (URL) | yes | Paper PDF or abstract page URL. Supports: arxiv.org, alphaxiv.org, semanticscholar.org, or direct PDF URLs. |
| `query` | string | yes | The question to answer about the paper. |

**Returns**: Natural language answer grounded in the paper's actual content.

**When to use**:
- Extracting specific information from a paper without reading the entire thing
- "What datasets were used for training?"
- "What are the main hyperparameters?"
- "How does the attention mechanism work in this paper?"
- Verifying specific claims or numbers from a paper
- **This is a capability dare-scholar does NOT have** — dare-scholar reads papers but cannot do targeted Q&A

**Example**:
```json
{
  "url": "https://arxiv.org/pdf/2307.12307",
  "query": "What datasets were used for training?"
}
```

---

## Tool 6: read_files_from_github_repository

**Purpose**: Read files or directories from a paper's GitHub repository. Reading `/` returns the complete file tree plus all top-level files.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `githubUrl` | string (URL) | yes | GitHub repository URL (e.g., `https://github.com/owner/repo`) |
| `path` | string | yes | File or directory path. Use `/` for repository overview. |

**Returns**: File contents (for files), directory listing with contents (for directories), or file tree + top-level files (for `/`).

**When to use**:
- Inspecting a paper's official implementation
- Verifying that code matches paper claims (Paper-Code Audit)
- Understanding implementation details not described in the paper
- **This is a capability dare-scholar does NOT have**

**Example**:
```json
{
  "githubUrl": "https://github.com/openai/gpt-2",
  "path": "/"
}
```

---

## Usage Patterns in DARE Pipeline

### Pattern 1: Supplementary Search (Literature Survey)

When dare-scholar's Google Scholar search doesn't find enough papers, use AlphaXiv as a secondary source:

```
dare-scholar pipeline (primary)     AlphaXiv (secondary, arXiv-only)
─────────────────────────           ────────────────────────────────
google-scholar-scraper              embedding_similarity_search
    → paper_searching               full_text_papers_search
    → paper_fetching                agentic_paper_retrieval
    → paper_content                     → get_paper_content
    → paper_reading
```

Run both in parallel for maximum recall. Deduplicate by arXiv ID.

### Pattern 2: Quick Paper Q&A (Any Stage)

When you need a specific answer from a paper without reading the full text:

```
paper already fetched via dare-scholar
    → answer_pdf_queries("What optimizer did they use?")
```

Faster than doing `paper_reading` + extracting the answer manually.

### Pattern 3: Paper-Code Verification (Gap Analysis / Audit)

When evaluating a paper's reproducibility:

```
get_paper_content(paper_url)
    → read_files_from_github_repository(repo_url, "/")
    → Compare claims vs. code
```

### Pattern 4: Deep Research (Comprehensive Search)

For maximum coverage, run all three AlphaXiv search tools in parallel:

```
embedding_similarity_search("detailed conceptual query")
full_text_papers_search("exact method name")
agentic_paper_retrieval("broad research question")
    → Merge + deduplicate results
    → get_paper_content for top hits
```

---

## Limitations

- **arXiv only**: AlphaXiv only indexes arXiv papers. For journals, conferences, and other sources, use dare-scholar's Google Scholar pipeline.
- **OAuth required**: First use requires OAuth 2.0 authentication via browser flow.
- **Rate limits**: Not publicly documented. If rate-limited, fall back to dare-scholar.
- **AI reports**: `get_paper_content` returns pre-generated reports — you cannot control depth or focus like dare-scholar's `paper_reading` (Keshav three-pass method).
- **Third-party dependency**: AlphaXiv is an external service. dare-scholar is self-hosted and fully under our control.
