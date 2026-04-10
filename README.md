# 🧬 DARE — De-Anthropocentric Research Engine

> **Human-centered AI-assisted research can no longer sustain the next great leaps of our civilization. What we need is not just more tools, but an AI researcher that thinks and acts independently — a new entity to replace the human role in science. This is DARE.**

🚧 *Personal side project. Actively under development.*

DARE is not a tool that helps you do research. It *is* the researcher. You set the direction — DARE searches, reads, discovers gaps, generates ideas, designs experiments, and executes them on GPUs. Autonomously. Iteratively. Without asking for permission.

## 🔬 What It Does

- **Autonomous literature survey** — searches Google Scholar, downloads full papers (not just abstracts), reads them cover-to-cover with a three-pass protocol
- **Gap discovery** — identifies what the field is missing, not what you tell it to find
- **Idea generation** — proposes novel research directions from discovered gaps
- **Self-review loop** — an independent AI process reviews all outputs, scores them, and selectively re-runs weak stages until quality threshold is met
- **Experiment design & execution** — designs experiments and runs them on remote GPU pods, autonomously
- **Deep reference exploration** — traces citation graphs via Semantic Scholar
- **Full-text caching** — every paper and web page converted to markdown, cached locally for offline access
- **Dual pod targets** — supports both RunPod GPU pods and remote SSH servers for experiment execution
- **Git-based context transfer** — research context (CLAUDE.md + MEMORY) pushed to GitHub, cloned on pod, executed by a fresh AI instance

## 🔄 Five-Stage Pipeline

Five-stage iterative pipeline with review-driven quality loop:

```text
You ask a question
    ↓
┌─────────────────────────────────────────────────┐
│  Stage 1: Literature Survey (up to 50+ papers)  │
│  Stage 2: Gap Analysis (30 papers deep)         │  ← Review loop:
│  Stage 3: Idea Generation (3+ novel ideas)      │    AI reviews AI's work
│                                                  │    Score ≥ 8/10 to pass
│        ↻ Review → Selective Redo → Review        │    Up to 7 rounds
└─────────────────────────────────────────────────┘
    ↓
  Stage 4: Experiment Design
    ↓
  Stage 5: GPU Execution (remote pod, fully autonomous)
    ↓
Results returned via git
```

Each stage runs SEARCH → READ → REFLECT → EVALUATE cycles with autonomous gap discovery and dynamic stopping. No human in the loop.

**Key features of the pipeline:**

- 6 parallel searches per iteration (3 google-scholar-scraper + 3 brave_web_search), plus supplementary AlphaXiv arXiv searches when needed
- Two-step enrich pipeline: `paper_searching` → `paper_fetching`
- Web page pipeline: `brave_web_search` → `web_fetching` → `web_content`
- Three-pass reading protocol (High / Medium / Low rating)
- State inheritance between stages and across review rounds (knowledge + papersRead + urlsVisited)
- Dynamic stopping: gaps cleared, no progress for 3 rounds, or target reached
- Zero external validation cost — review loop uses a separate `claude -p` process

## 🧠 How It Actually Works

Most "AI research tools" read abstracts, summarize them, and call it a day. DARE downloads the full paper — methodology, experiments, discussion, appendices — converts it to markdown, and has AI evaluate it with a three-pass reading protocol (skim → comprehend → critique).

The review loop is the key innovation: after Stages 1-3, an independent Claude Code process (`claude -p`) reviews all outputs with web search verification, scores each stage 1-10, and selectively re-runs stages that fall below threshold. Only weak stages are re-run, with reduced iteration limits in hot loop. This continues until score ≥ 8/10 with no critical issues, or 7 rounds max.

Stage 5 deploys the full research context to a remote GPU pod via Git — CLAUDE.md + MEMORY are pushed to GitHub, cloned on the pod, and a fresh AI instance executes the experiment with zero human supervision. Experiment outputs return as structured files via git push/pull.

```text
Git-based Context Transfer (Stage 5):

  Local: MEMORY → git push → GitHub
      ↓
  Pod: git clone → deploy-context.sh → CC reads CLAUDE.md + MEMORY
      ↓
  Pod: experiment outputs → git push → GitHub
      ↓
  Local: git pull → CC digests results
```

## 🚀 Quick Start

1. Clone and install (all workspace packages are installed automatically):

```bash
git clone https://github.com/Pthahnix/De-Anthropocentric-Research-Engine.git
cd De-Anthropocentric-Research-Engine
npm install
```

1. Install external MCP servers:

```bash
npm install -g @apify/actors-mcp-server @brave/brave-search-mcp-server @runpod/mcp-server
```

1. Copy `.mcp.example.json` to `.mcp.json` and fill in your API keys and paths.

1. Claude Code will auto-discover all tools from the configured MCP servers.

## 🏗️ Architecture

Three-layer architecture: **Skills** (when/why) orchestrate **Pipelines** (how) which call **Tools** (what).

```text
┌──────────────────────────────────────────────────┐
│  SKILL LAYER — orchestration & decision-making   │
│  Iteration loops, gap discovery, stopping logic  │
├──────────────────────────────────────────────────┤
│  PIPELINE LAYER — fixed workflows                │
│  Tool sequencing, batching, error handling        │
├──────────────────────────────────────────────────┤
│  TOOL LAYER — atomic MCP operations              │
│  dare-scholar, dare-web, alphaxiv, apify, brave  │
└──────────────────────────────────────────────────┘
```

```text
MCP Client (Claude Code — local)
    │
    │  ┌─ Monorepo Packages ──────────────────────────────┐
    │  │                                                   │
    ├──┤  packages/scholar ─── academic paper pipeline     │
    │  │    ├── paper_searching  → enrich Scholar results  │
    │  │    ├── paper_fetching   → fetch full text         │
    │  │    ├── paper_content    → read cached markdown    │
    │  │    ├── paper_reference  → Semantic Scholar refs   │
    │  │    └── paper_reading    → AI three-pass reading   │
    │  │                                                   │
    ├──┤  packages/web ─── web page pipeline               │
    │  │    ├── web_fetching     → fetch page as markdown  │
    │  │    └── web_content      → read cached markdown    │
    │  │                                                   │
    ├──┤  packages/session ─── context transfer scripts    │
    │  │    └── scripts/         → pod provisioning        │
    │  └───────────────────────────────────────────────────┘
    │
    ├── @apify/actors-mcp-server ─── Google Scholar + web scraping
    │
    ├── @brave/brave-search-mcp-server ─── web search
    │
    ├── @runpod/mcp-server ─── GPU pod lifecycle
    │
    ├── AlphaXiv MCP (SSE) ─── paper search, Q&A, code exploration (arXiv)
    │
    └── Git-based Context Transfer ─── distributed experiment execution
```

### 🔌 MCP Servers

| Server | Source | Purpose |
| --- | --- | --- |
| **dare-scholar** | `packages/scholar` (workspace) | Academic paper pipeline — search, fetch, read, reference tracing |
| **dare-web** | `packages/web` (workspace) | Web page fetching and caching |
| **dare-session** | `packages/session` (workspace) | Git-based context transfer to remote GPU pods |
| **apify** | `@apify/actors-mcp-server` (npm) | Google Scholar search + web page scraping |
| **brave-search** | `@brave/brave-search-mcp-server` (npm) | Web search API |
| **runpod** | `@runpod/mcp-server` (npm) | GPU pod lifecycle management |
| **alphaxiv** | AlphaXiv MCP (SSE) | Paper search, Q&A, code exploration (arXiv, auxiliary to dare-scholar) |

### 🔧 Tools

#### dare-scholar (Academic Paper Pipeline)

| Tool | Description |
| --- | --- |
| `paper_searching` | Enrich Google Scholar results into PaperMeta (arXiv, Semantic Scholar, Unpaywall) |
| `paper_fetching` | Fetch full paper as markdown (cache-first, multi-source fallback) |
| `paper_content` | Read cached paper markdown (local only, no network) |
| `paper_reference` | Get paper references via Semantic Scholar API |
| `paper_reading` | AI three-pass reading (Keshav method) via LLM agent |

#### dare-web (Web Page Pipeline)

| Tool | Description |
| --- | --- |
| `web_fetching` | Fetch web page as markdown via Apify rag-web-browser (cache-first) |
| `web_content` | Read cached web page markdown (local only, no network) |

#### External Tools

| Tool | Server | Description |
| --- | --- | --- |
| `google-scholar-scraper` | apify | Search Google Scholar for papers |
| `rag-web-browser` | apify | Fetch web page as markdown |
| `brave_web_search` | brave-search | Web search via Brave Search API |
| `create-pod` / `start-pod` / `stop-pod` / `delete-pod` | runpod | GPU pod lifecycle management |

#### alphaxiv (Paper Search, Q&A, Code Exploration — arXiv only)

| Tool | Description |
| --- | --- |
| `embedding_similarity_search` | Semantic paper search via embeddings |
| `full_text_papers_search` | Keyword paper search (exact names, authors) |
| `agentic_paper_retrieval` | Multi-turn autonomous retrieval (beta) |
| `get_paper_content` | AI-generated paper report or raw full text |
| `answer_pdf_queries` | Ask questions about any paper PDF |
| `read_files_from_github_repository` | Read files from a paper's GitHub repo |

> AlphaXiv is auxiliary to dare-scholar: dare-scholar covers all academic sources via Google Scholar; AlphaXiv covers arXiv only but adds paper Q&A and code exploration capabilities that dare-scholar lacks.

### 📦 Monorepo Structure

```text
dare/
├── packages/
│   ├── scholar/          # dare-scholar MCP server (5 tools, 153 tests)
│   ├── web/              # dare-web MCP server (2 tools)
│   └── session/          # Git-based context transfer (pod provisioning scripts)
├── skills/               # Research workflow SOPs (directory-per-skill)
├── pipeline/             # Fixed tool-orchestration workflows
├── prompts/               # LLM prompt templates
├── package.json          # Root workspace config
└── .mcp.json             # MCP server configuration (gitignored)
```

## ⚙️ Configuration

### dare-scholar

| Variable | Description |
| --- | --- |
| `MINERU_TOKEN` | [MinerU](https://mineru.net/) API token for PDF → markdown conversion |
| `EMAIL` | Email for Unpaywall API (polite pool) |
| `DARE_CACHE` | Cache directory (**must be an absolute path**) |
| `OPENAI_API_KEY` | OpenAI-compatible API key for AI paper reading |
| `OPENAI_BASE_URL` | API base URL (e.g., `https://openrouter.ai/api/v1`) |
| `OPENAI_MODEL` | Model name for paper reading agent |

### dare-web

| Variable | Description |
| --- | --- |
| `DARE_CACHE` | Cache directory, shared with dare-scholar (**must be an absolute path**) |
| `APIFY_TOKEN` | [Apify](https://console.apify.com/account#/integrations) API token for rag-web-browser |

### dare-session

| Variable | Description |
| --- | --- |
| `RUNPOD_API_KEY` | RunPod API key (for GPU pod targets) |
| `REMOTE_HOST` | SSH hostname/IP (for remote server targets) |
| `REMOTE_USER` | SSH username (for remote server targets) |
| `HF_TOKEN` | Hugging Face token (passed to pod for model downloads) |

## 🗺️ Roadmap

### Completed

- ✅ **Review-Driven Research Loop** — Independent `claude -p` process reviews Stage 1-3 outputs with web search verification, selective redo of weak stages
- ✅ **Git-based Context Transfer** — Replaced session export/import with Git-based context transfer for distributed experiment execution
- ✅ **Monorepo Consolidation** — All MCP servers consolidated into npm workspaces monorepo with dual pod target support
- ✅ **End-to-End Pipeline Validation** — Full research pipeline validated on real topic (survey → gap analysis → idea generation → review → experiment design)

The end goal: a four-dimensional research engine combining **Deep Research + Adversarial Debate + Evolutionary Generation + Distributed Execution**. No other open-source system attempts this.

## 📄 License

[Apache-2.0](LICENSE)
