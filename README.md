# Neocortica v1.0.1

Vibe researching toolkit — AI-powered academic research automation, from literature discovery to experiment execution.

> [!NOTE]
> This is a work-in-progress personal project, under active development.

## What It Does

- Search and filter academic papers from Google Scholar
- Deep reference exploration via Semantic Scholar citation graphs
- Convert arXiv papers, PDFs, and web pages to AI-readable markdown
- Web search via Brave Search API for non-academic sources
- Full-text caching for offline access and repeated queries
- Review-driven quality loop: independent CC process reviews research outputs, scores each stage, and selectively re-runs stages until quality threshold is met
- GPU experiment execution on remote pods via session sharing (export session → transfer → resume on GPU pod)
- Five-stage research pipeline: survey → gaps → ideas → review loop → design → execution

## How It Works

Most academic AI tools only read abstracts to triage papers. Neocortica downloads the full paper text, converts it to markdown, and lets AI evaluate based on complete methodology, experiments, and discussion.

Multi-MCP architecture: research skills orchestrate external MCP servers for academic search, web search, and GPU execution. Stages 1-3 (survey, gap, idea) run in a review loop — after each pass, a separate Claude Code process (`claude -p`) independently reviews the outputs with web search verification, then selectively triggers re-runs of weak stages. Stage 5 uses session sharing to hand off full research context to remote GPU pods.

## Research Pipeline

Five-stage iterative pipeline with review-driven quality loop: Topic → Literature Survey → Gap Analysis → Idea Generation → Review Loop → Experiment Design → Experiment Execution

Stages 1-3 are wrapped in a review loop: after each full pass, an independent Claude Code process reviews the outputs with web search verification, scores each stage (1-10), and selectively triggers re-runs of stages that need improvement. The loop continues until quality threshold is met (score >= 8/10, no critical issues) or 7 rounds max.

Each stage (1–4) uses SEARCH→READ→REFLECT→EVALUATE cycles with autonomous gap discovery and dynamic stopping conditions. Stage 5 exports the full session (with all accumulated research context) to a remote GPU pod via session sharing, where it resumes and executes the experiment autonomously.

**Key Features**:

- Review-driven loop: independent CC process (`claude -p`) reviews Stage 1-3 outputs with web search verification
- Selective redo: only re-runs stages that need improvement, with reduced iteration limits in hot loop
- 6 parallel searches per iteration (3 google-scholar-scraper + 3 brave_web_search)
- Two-step enrich pipeline: paper_searching → paper_fetching
- Web page pipeline: brave_web_search → web_fetching → web_content
- Three-pass reading protocol (High/Medium/Low rating)
- State inheritance between stages and across review rounds (knowledge + papersRead + urlsVisited)
- Zero external validation cost
- Dynamic stopping: gaps cleared, no progress for 3 rounds, or target reached
- Session sharing for experiment execution: export full research context → transfer to GPU pod → resume
- Checkpoint-based phase control via round-trip session export/import

## Prerequisites

### Required MCP Servers

Neocortica depends on the following external MCP servers. Install them before use:

| MCP Server | Package / Source | Purpose | API Key Required |
|---|---|---|---|
| **neocortica-scholar** | [Neocortica-Scholar](https://github.com/Pthahnix/Neocortica-Scholar) | Academic paper pipeline (search, fetch, read, references) | MinerU token, OpenAI-compatible API key |
| **neocortica-web** | [Neocortica-Web](https://github.com/Pthahnix/Neocortica-Web) | Web page fetching and caching (fetch, read) | Apify API token |
| **apify** | `@apify/actors-mcp-server` (`npm install -g @apify/actors-mcp-server`) | Google Scholar search + web page scraping | [Apify API token](https://console.apify.com/account#/integrations) |
| **brave-search** | `@brave/brave-search-mcp-server` (`npm install -g @brave/brave-search-mcp-server`) | Web search API | [Brave Search API key](https://brave.com/search/api/) |
| **runpod** | `@runpod/mcp-server` (`npm install -g @runpod/mcp-server`) | GPU pod lifecycle (create/start/stop/delete) | [RunPod API key](https://www.runpod.io/console/user/settings) |
| **railway** | `@railway/mcp-server` (`npm install -g @railway/mcp-server`) | Deployment platform | [Railway API token](https://railway.app/account/tokens) |

### neocortica-scholar Setup

Clone and install the academic paper MCP server:

```bash
git clone https://github.com/Pthahnix/Neocortica-Scholar.git
cd Neocortica-Scholar
npm install
```

Required environment variables for neocortica-scholar (set in `.mcp.json`):

| Variable | Description | How to Get |
|---|---|---|
| `MINERU_TOKEN` | MinerU API token for PDF → markdown conversion | [MinerU](https://mineru.net/) |
| `EMAIL` | Email for Unpaywall API (polite pool) | Your email |
| `NEOCORTICA_CACHE` | Cache directory path | e.g., `.cache` |
| `OPENAI_API_KEY` | OpenAI-compatible API key (for AI paper reading) | [OpenRouter](https://openrouter.ai/) or any OpenAI-compatible provider |
| `OPENAI_BASE_URL` | API base URL | e.g., `https://openrouter.ai/api/v1` |
| `OPENAI_MODEL` | Model name for paper reading agent | e.g., `openai/gpt-oss-120b` |

### neocortica-web Setup

Clone and install the web page MCP server:

```bash
git clone https://github.com/Pthahnix/Neocortica-Web.git
cd Neocortica-Web
npm install
```

Required environment variables for neocortica-web (set in `.mcp.json`):

| Variable | Description | How to Get |
|---|---|---|
| `NEOCORTICA_CACHE` | Cache directory path (shared with neocortica-scholar) | e.g., `.cache` |
| `APIFY_TOKEN` | Apify API token (for rag-web-browser) | [Apify](https://console.apify.com/account#/integrations) |

## Quick Start

1. Install prerequisites above
2. Copy `.mcp.example.json` to `.mcp.json` and fill in your API keys and paths
3. Set up `.env`:

```bash
DIR_CACHE=.cache/
API_KEY_RUNPOD=your-runpod-key          # optional, for experiment execution
```

4. Claude Code will auto-discover all tools from the configured MCP servers.

## Tools

### neocortica-scholar (Academic Paper Pipeline)

| Tool | Description |
| ---- | ----------- |
| `paper_searching` | Enrich Google Scholar results into PaperMeta (arXiv, Semantic Scholar, Unpaywall) |
| `paper_fetching` | Fetch full paper as markdown (cache-first, multi-source fallback) |
| `paper_content` | Read cached paper markdown (local only, no network) |
| `paper_reference` | Get paper references via Semantic Scholar API |
| `paper_reading` | AI three-pass reading (Keshav method) via LLM agent |

### neocortica-web (Web Page Pipeline)

| Tool | Description |
| ---- | ----------- |
| `web_fetching` | Fetch web page as markdown via Apify rag-web-browser (cache-first) |
| `web_content` | Read cached web page markdown (local only, no network) |

### apify (Google Scholar + Web Scraping)

| Tool | Description |
| ---- | ----------- |
| `google-scholar-scraper` | Search Google Scholar for papers |
| `rag-web-browser` | Fetch web page as markdown |

### brave-search

| Tool | Description |
| ---- | ----------- |
| `brave_web_search` | Web search via Brave Search API |

### runpod

| Tool | Description |
| ---- | ----------- |
| `create-pod` / `start-pod` / `stop-pod` / `delete-pod` | GPU pod lifecycle management |

## Architecture

```
MCP Client (Claude Code — local)
    │
    ├── neocortica-scholar MCP ─── academic paper pipeline
    │       ├── paper_searching    → enrich Scholar results (arXiv, SS, Unpaywall)
    │       ├── paper_fetching     → fetch full text as markdown
    │       ├── paper_content      → read cached markdown
    │       ├── paper_reference    → Semantic Scholar references
    │       └── paper_reading      → AI three-pass reading
    │
    ├── neocortica-web MCP ─── web page pipeline
    │       ├── web_fetching       → fetch web page as markdown (cache-first)
    │       └── web_content        → read cached web page markdown
    │
    ├── @apify/actors-mcp-server ─── Google Scholar + web scraping
    │       ├── google-scholar-scraper → search Google Scholar
    │       └── rag-web-browser        → fetch web pages as markdown
    │
    ├── @brave/brave-search-mcp-server ─── web search
    │
    ├── @runpod/mcp-server ─── GPU pod lifecycle
    │
    └── Session Sharing ─── distributed experiment execution
            ├── Export session (full Stages 1-4 context)
            ├── Transfer to RunPod GPU pod
            ├── Resume on remote CC (with all research knowledge)
            └── Export results back on completion
```

## Roadmap

### Review-Driven Research Loop — COMPLETED (v1.0.1)

Independent Claude Code process reviews Stage 1-3 outputs (survey, gap analysis, idea generation) with web search verification, scores each stage 1-10, and selectively re-runs stages that need improvement. Loops until quality threshold (score >= 8/10, no critical issues) or 7 rounds max.

### Session Sharing — Distributed Experiment Execution

**Strategic pivot** (2026-03-16): replacing the custom HTTP relay protocol with session sharing for Stage 5 experiment execution.

The key insight: Claude Code's native work unit is the **session**. Instead of building a custom protocol that spawns a fresh CC process and loses all context, we export the full session — including all knowledge accumulated across Stages 1-4 — and resume it on a remote GPU pod. The remote CC "remembers everything" and executes the experiment with full research context.

Inspired by [cc-go-on](https://github.com/Johnixr/cc-go-on) (session export/encrypt/share/resume for AI coding assistants).

**Flow**:
```
Local CC (Stages 1-4 complete)
    → Export session (tar.gz + encrypt)
    → Transfer to RunPod GPU pod
    → Remote CC imports + resumes with full context
    → Executes experiment autonomously
    → Exports results session back
    → Local CC imports results
```

This approach reduces code complexity by 90%+, preserves full research context, and aligns with CC's native architecture rather than fighting it.

## License

[Apache-2.0 License](LICENSE)
