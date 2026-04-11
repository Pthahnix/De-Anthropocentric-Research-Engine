# 🧠 DARE — De-Anthropocentric Research Engine

> **Human-centered AI-assisted research can no longer sustain the next great leaps of our civilization. What we need is not just more tools, but an AI researcher that thinks and acts independently — a new entity to replace the human role in science. This is DARE.**

*🚧 Personal side project. Actively under development.*

DARE is not a tool that helps you do research. It *is* the researcher. You set the direction — DARE searches, reads, discovers gaps, generates ideas, designs experiments, and executes them on GPUs. Autonomously. Iteratively. Without asking for permission.

---

## ⚡ What It Does

- 📚 **Autonomous literature survey** — searches Google Scholar, downloads full papers (not just abstracts), reads them cover-to-cover with a three-pass protocol
- 🔍 **Gap discovery** — identifies what the field is missing, not what you tell it to find
- 💡 **Idea generation** — 31 ideation methods across 5 categories (SCAMPER, component surgery, cross-domain, perspective forcing, structural deconstruction), filtered by MAP-Elites quality-diversity algorithm
- ⚔️ **Adversarial debate** — Proposer-Critic-Judge architecture validates every gap, insight, and idea through structured 4+3 round debates
- 🔬 **INSIGHT pipeline** — 7-step deep analysis (root-cause → stakeholder → tension → HMW → abstraction → assumption → validation)
- 🔄 **Self-review loop** — an independent AI process reviews all outputs, scores them, and selectively re-runs weak stages
- 🧪 **Experiment design & execution** — designs experiments and runs them on remote GPU pods, autonomously
- 🧬 **Method evolution** (planned) — AlphaEvolve-inspired evolutionary improvement of DARE's own methods (mutation + crossover + Elo ranking). Core tools implemented, full loop coming in v3.2+
- 🌐 **Deep reference exploration** — traces citation graphs via Semantic Scholar
- 💾 **Full-text caching** — every paper and web page converted to markdown, cached locally
- 🚀 **Git-based context transfer** — research context pushed to GitHub, cloned on remote GPU pod, executed by a fresh AI instance

---

## 🎯 Design Philosophy

### 🤔 Why "De-Anthropocentric"?

The bottleneck in modern research is not data or compute — it's the human in the loop. Every existing "AI research assistant" still requires a human to decide what to search, what to read, which gaps matter, and which ideas are worth pursuing. DARE removes this bottleneck entirely. The human provides only the initial direction; everything after that is autonomous.

This isn't about replacing researchers — it's about creating a parallel research capacity that operates on timescales and breadths impossible for any individual.

### 🎖️ The Military Metaphor: Four-Layer Command Structure

DARE's architecture follows a military command hierarchy — not because research is war, but because the decomposition pattern is remarkably effective:

```
General (Meta-Strategy)  →  "Take that hill"        →  WHAT to research
Colonel (Strategy)       →  "Flank from the east"   →  WHEN and WHY
Captain (Tactic)         →  "Squad A cover, B move"  →  HOW to combine
Sergeant (SOP)           →  "Fire, reload, advance"  →  HOW to execute
```

Each layer has a single concern and calls only the layer directly below it. A Strategy never touches MCP tools directly; a Tactic never decides research direction. This strict layering means every component is independently testable, replaceable, and composable.

### 🤖 Micro-Agent Paradigm: Every Tool Thinks

Traditional MCP tools are dumb functions — they take input, return output, no reasoning involved. DARE's `dare-agents` tools are fundamentally different. Each of the 49 tools is a **single-responsibility LLM micro-agent** with its own system prompt, personality, and reasoning chain.

When DARE runs "root-cause-drilling", it's not calling a template — it's spawning an AI agent whose entire existence is devoted to drilling from surface symptoms to root causes. When "debate-critic" runs, it genuinely tries to destroy the idea it's reviewing. This is what makes DARE's outputs qualitatively different from prompt-chaining systems.

Built on [`pi-ai`](https://github.com/badlogic/pi-mono) — a lightweight framework for building LLM-powered tools as MCP servers.

### ⚔️ Adversarial Validation: Ideas Must Survive Attack

Every significant output in DARE goes through adversarial debate before being accepted. The Proposer-Critic-Judge architecture isn't decoration — it's the core quality mechanism:

1. A **Proposer** presents the gap/insight/idea
2. A **Critic** attacks it from every angle (4 rounds of critique)
3. A **Defender** responds to each attack (3 rounds of defense)
4. A **Judge** evaluates the exchange and scores the result

Ideas that survive this gauntlet are genuinely robust. Ideas that don't are discarded or refined. No hand-waving, no "sounds good to me."

### 🎲 Quality × Diversity: Not Just Good Ideas, Different Ideas

Most AI systems optimize for a single quality metric — they'll give you 10 variations of the same good idea. DARE uses **MAP-Elites**, a quality-diversity algorithm that maintains a population of ideas spanning multiple dimensions of variation. The result: you get the *best* idea in each *niche*, not 10 copies of the same insight.

---

## 🔄 Research Pipeline

```text
You ask a question
    ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 0: Brainstorming (structured requirement clarification) │
│  Phase 1: Intake (research brief)                            │
│  Phase 2: Research Loop (Stages 1-3, up to 7 rounds)         │
│    ├── Literature Survey (up to 50+ papers)                  │
│    ├── Gap Analysis (30 papers deep)                         │
│    ├── Insight (7-step pipeline)                             │
│    ├── Ideation (31 methods × 5 categories)                  │
│    └── Review → Selective Redo → Review (score ≥ 8/10)       │
│  Phase 3: Experiment Design                                  │
│  Phase 4: GPU Execution (remote pod, fully autonomous)       │
└─────────────────────────────────────────────────────────────┘
    ↓
Results returned via git
```

Each stage runs SEARCH → READ → REFLECT → EVALUATE cycles with autonomous gap discovery and dynamic stopping. No human in the loop.

---

## 🏗️ Architecture (v3.0)

Four-layer skill hierarchy where each layer calls only the layer below:

```text
┌──────────────────────────────────────────────────────────────┐
│  META-STRATEGY (/dare)                                       │
│  Entry point — orchestrates the full research pipeline        │
├──────────────────────────────────────────────────────────────┤
│  STRATEGY (8)                                                 │
│  intake, lit-survey, gap-analysis, insight, ideation,         │
│  round, paper-writing, method-evolve                          │
├──────────────────────────────────────────────────────────────┤
│  TACTIC (15)                                                  │
│  academic-research, web-research, insight, multiagent-debate, │
│  review, idea-generation, idea-augmentation, scamper,         │
│  component-surgery, cross-domain-collision, and more          │
├──────────────────────────────────────────────────────────────┤
│  SOP (60)                                                     │
│  Single-responsibility wrappers around dare-agents tools      │
├──────────────────────────────────────────────────────────────┤
│  TOOL LAYER (MCP servers — atomic operations)                 │
│  dare-agents, dare-scholar, dare-web, apify, brave, runpod   │
└──────────────────────────────────────────────────────────────┘
```

- **Meta-Strategy** = WHAT to research (entry point, pipeline orchestration)
- **Strategy** = WHEN and WHY (iteration loops, state management, stopping conditions)
- **Tactic** = HOW to combine (orchestrates multiple SOPs into coherent workflows)
- **SOP** = HOW to execute (single dare-agents tool wrapper with protocol)
- **Tool** = WHAT to do (atomic MCP operations)

### 🧩 dare-agents — LLM-Powered Micro-Agent Tools

The core engine of v3. 49 tools built with [`pi-ai`](https://github.com/badlogic/pi-mono), each a single-responsibility LLM micro-agent with its own system prompt.

| Category | Tools | Count |
|----------|-------|-------|
| Insight | root-cause-drilling, stakeholder-mapping, tension-mining, question-reformulation, abstraction-laddering, assumption-audit, validation | 7 |
| Debate | debate-critic, debate-defender, debate-judge | 3 |
| SCAMPER | substitute, combine, adapt, modify, put-other-use, eliminate, reverse | 7 |
| Component Surgery | subtract, multiply, divide, unify, redirect | 5 |
| Cross-Domain & Others | analogical-transfer, forced-bridge, triz-contradiction, morphological-matrix, axiom-negation, constraint-injection, random-paper-entry, reverse-engineering, worst-method-analysis, method-problem-matrix, time-machine, anti-benchmark, ablation-brainstorm, benchmark-sweep, failure-taxonomy | 15 |
| Utility | facet-extraction, facet-bisociation, digest-extraction, paper-rating, quality-diversity-filtering, self-review, reviewer2-hat, theorist-hat, practitioner-hat | 9 |
| Method-Evolve | mutate, crossover, evaluate | 3 |

### 📁 Monorepo Structure

```text
dare/
├── packages/
│   ├── agents/           # dare-agents MCP — 49 LLM micro-agent tools (72 tests)
│   ├── scholar/          # dare-scholar MCP — academic paper pipeline (5 tools)
│   ├── web/              # dare-web MCP — web page fetching & caching (2 tools)
│   └── session/          # dare-session — pod provisioning scripts
├── skills/
│   ├── dare/             # /dare meta-strategy (entry point)
│   ├── strategy/         # 8 strategies (lit-survey, gap-analysis, insight, ...)
│   ├── tactic/           # 15 tactics (debate, scamper, surgery, ...)
│   └── sop/              # 60 SOPs (one per dare-agents tool)
├── package.json          # Root workspace config
└── .mcp.json             # MCP server configuration (gitignored)
```

### 🔌 MCP Servers

| Server | Source | Tools | Purpose |
| --- | --- | --- | --- |
| **dare-agents** | `packages/agents` | 49 | LLM micro-agent tools (ideation, debate, insight, method-evolve) |
| **dare-scholar** | `packages/scholar` | 5 | Academic paper pipeline — search, enrich, fetch, read, reference |
| **dare-web** | `packages/web` | 2 | Web page fetching and markdown caching |
| **dare-session** | `packages/session` | — | Git-based context transfer to remote GPU pods |
| **apify** | `@apify/actors-mcp-server` | 2 | Google Scholar search + web page scraping |
| **brave-search** | `@brave/brave-search-mcp-server` | 1 | Web search API |
| **runpod** | `@runpod/mcp-server` | 4 | GPU pod lifecycle management |
| **alphaxiv** | AlphaXiv MCP (SSE) | 6 | Paper search, Q&A, code exploration (arXiv) |

---

## 🚀 Quick Start

1. Clone and install:

```bash
git clone https://github.com/Pthahnix/De-Anthropocentric-Research-Engine.git
cd De-Anthropocentric-Research-Engine
npm install
```

2. Install external MCP servers:

```bash
npm install -g @apify/actors-mcp-server @brave/brave-search-mcp-server @runpod/mcp-server
```

3. Copy `.mcp.example.json` to `.mcp.json` and fill in your API keys and paths.

4. Claude Code will auto-discover all tools from the configured MCP servers.

---

## ⚙️ Configuration

### dare-agents

| Variable | Description |
| --- | --- |
| `PI_API_KEY` | API key for LLM completions (OpenAI-compatible) |
| `PI_BASE_URL` | API base URL (e.g., `https://openrouter.ai/api/v1`) |
| `PI_MODEL` | Model name for micro-agent tools |

### dare-scholar

| Variable | Description |
| --- | --- |
| `MINERU_TOKEN` | [MinerU](https://mineru.net/) API token for PDF → markdown conversion |
| `EMAIL` | Email for Unpaywall API (polite pool) |
| `DARE_CACHE` | Cache directory (**must be an absolute path**) |
| `OPENAI_API_KEY` | OpenAI-compatible API key for AI paper reading |
| `OPENAI_BASE_URL` | API base URL |
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

---

## 📊 Implementation Status

| Phase | Component | Status |
|-------|-----------|--------|
| P0 | Core pipeline (intake, lit-survey, round, scholar SOPs, web SOPs) | ✅ Done |
| P1 | INSIGHT 7-step pipeline, multiagent debate, quality-diversity filtering | ✅ Done |
| P2 | 31 ideation tools (SCAMPER, surgery, cross-domain, perspective, structural) | ✅ Done |
| P3 | Paper-writing strategy (interface), method-evolve tools (mutate/crossover/evaluate) | ✅ Done |
| — | Experiment design strategy | 🔜 Planned |
| — | Paper-writing implementation (v3.1+) | 🔜 Planned |
| — | Method-evolve full loop (v3.2+) | 🔜 Planned |

🎯 The end goal: a four-dimensional research engine combining **Deep Research + Adversarial Debate + Evolutionary Generation + Distributed Execution**. No other open-source system attempts this.

---

## 🗺️ Roadmap

- **🧬 Method-evolve full loop (v3.2+)** — AlphaEvolve-inspired evolutionary improvement of DARE's own research methods. The core tools (mutate, crossover, evaluate) are implemented; the full autonomous loop — where DARE continuously evolves its methodology, running Elo-style tournaments between method variants — is next.
- **📝 Paper-writing implementation (v3.1+)** — automated academic paper composition from research outputs. Strategy interface defined, implementation pending.
- **🧪 Experiment design strategy** — structured experiment planning from validated ideas to executable GPU workloads.

---

## 📄 License

[Apache-2.0](LICENSE)

---

*Built by [Pthahnix](https://github.com/Pthahnix)*
