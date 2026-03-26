# DARE — De-Anthropocentric Research Engine v1.0.0

> **Human-centered AI-assisted research can no longer sustain the next leap of our civilization. It's time to decenter the human. It's time to DARE.**
>
> 以人类为中心的 AI 辅助科研模式，已不足以支撑文明创造更大的辉煌。是时候去人类中心主义了。是时候 DARE 了。

DARE is not a tool that helps you do research. It *is* the researcher. You set the direction — DARE searches, reads, discovers gaps, generates ideas, designs experiments, and executes them on GPUs. Autonomously. Iteratively. Without asking for permission.

This is not "AI-assisted research." This is research, de-anthropocentrized.

## What It Does

- **Autonomous literature survey** — searches Google Scholar, downloads full papers (not just abstracts), reads them cover-to-cover with a three-pass protocol
- **Gap discovery** — identifies what the field is missing, not what you tell it to find
- **Idea generation** — proposes novel research directions from discovered gaps
- **Self-review loop** — an independent AI process reviews all outputs, scores them, and selectively re-runs weak stages until quality threshold is met
- **Experiment design & execution** — designs experiments and runs them on remote GPU pods, autonomously
- **Deep reference exploration** — traces citation graphs via Semantic Scholar
- **Full-text caching** — every paper and web page converted to markdown, cached locally for offline access

## Five-Stage Pipeline

```
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

## Quick Start

```bash
git clone https://github.com/Pthahnix/De-Anthropocentric-Research-Engine.git
cd De-Anthropocentric-Research-Engine
npm install
```

Install external MCP servers:

```bash
npm install -g @apify/actors-mcp-server @brave/brave-search-mcp-server @runpod/mcp-server
```

Copy `.mcp.example.json` to `.mcp.json` and fill in your API keys. Claude Code will auto-discover all tools.

## Architecture

Three-layer architecture: **Skills** (when/why) orchestrate **Pipelines** (how) which call **Tools** (what).

```
┌──────────────────────────────────────────────────┐
│  SKILL LAYER — orchestration & decision-making   │
│  Iteration loops, gap discovery, stopping logic  │
├──────────────────────────────────────────────────┤
│  PIPELINE LAYER — fixed workflows                │
│  Tool sequencing, batching, error handling        │
├──────────────────────────────────────────────────┤
│  TOOL LAYER — atomic MCP operations              │
│  dare-scholar, dare-web, apify, brave, runpod    │
└──────────────────────────────────────────────────┘
```

### MCP Servers

| Server | Purpose |
|---|---|
| **dare-scholar** | Academic paper pipeline — search, fetch, read, reference tracing |
| **dare-web** | Web page fetching and caching |
| **dare-session** | Git-based context transfer to remote GPU pods |
| **apify** | Google Scholar search + web page scraping |
| **brave-search** | Web search API |
| **runpod** | GPU pod lifecycle management |

### Monorepo Structure

```
dare/
├── packages/
│   ├── scholar/     # dare-scholar MCP server
│   ├── web/         # dare-web MCP server
│   └── session/     # Pod provisioning scripts
├── skill/           # Research workflow SOPs
├── pipeline/        # Fixed tool-orchestration workflows
├── prompt/          # LLM prompt templates
└── .mcp.json        # MCP server configuration (gitignored)
```

## Configuration

### dare-scholar

| Variable | Description |
|---|---|
| `MINERU_TOKEN` | [MinerU](https://mineru.net/) API token for PDF → markdown |
| `EMAIL` | Email for Unpaywall API |
| `DARE_CACHE` | Cache directory (**absolute path**) |
| `OPENAI_API_KEY` | OpenAI-compatible API key for AI paper reading |
| `OPENAI_BASE_URL` | API base URL (e.g., `https://openrouter.ai/api/v1`) |
| `OPENAI_MODEL` | Model for paper reading agent |

### dare-web

| Variable | Description |
|---|---|
| `DARE_CACHE` | Cache directory, shared with dare-scholar (**absolute path**) |
| `APIFY_TOKEN` | [Apify](https://console.apify.com/account#/integrations) API token |

### dare-session

| Variable | Description |
|---|---|
| `RUNPOD_API_KEY` | RunPod API key (for GPU pod targets) |
| `REMOTE_HOST` | SSH hostname/IP (for remote server targets) |
| `REMOTE_USER` | SSH username (for remote server targets) |
| `HF_TOKEN` | Hugging Face token (for model downloads on pod) |

## How It Actually Works

Most "AI research tools" read abstracts, summarize them, and call it a day. DARE downloads the full paper — methodology, experiments, discussion, appendices — converts it to markdown, and has AI evaluate it with a three-pass reading protocol (skim → comprehend → critique).

The review loop is the key innovation: after Stages 1-3, an independent Claude Code process reviews all outputs with web search verification, scores each stage 1-10, and selectively re-runs stages that fall below threshold. This continues until score ≥ 8/10 with no critical issues, or 7 rounds max.

Stage 5 deploys the full research context to a remote GPU pod via Git — CLAUDE.md + MEMORY are pushed to GitHub, cloned on the pod, and a fresh AI instance executes the experiment with zero human supervision.

## Roadmap

- [ ] End-to-end GPU experiment execution test
- [ ] **Adversarial Debate** — Proposer-Critic-Judge architecture for idea validation
- [ ] **Evolutionary Generation** — MAP-Elites quality-diversity algorithm for idea evolution

The end goal: a four-dimensional research engine combining Deep Research + Adversarial Debate + Evolutionary Generation + Distributed Execution. No other open-source system attempts this.

## License

[Apache-2.0](LICENSE)
