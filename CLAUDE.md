# DARE — De-Anthropocentric Research Engine

De-anthropocentric research engine — academic paper search, web search, retrieval, deep reference exploration, and experiment execution.

## Architecture (v3.0 — Four-Layer Skill Hierarchy + dare-agents)

Monorepo with npm workspaces. Packages are independent (no cross-imports); root holds orchestration (skills only — no pipeline or prompts directories).

### Core Structure

| Component | Purpose | Key Files |
|-----------|---------|-----------|
| Skills | Four-layer hierarchy: meta-strategy → strategy → tactic → SOP | `skills/{dare,strategy,tactic,sop}/*/SKILL.md` |
| dare-agents | MCP server with LLM-powered micro-agent tools | `packages/agents/` |
| dare-scholar | Academic paper MCP (search, fetch, read, references) | `packages/scholar/` |
| dare-web | Web page MCP (fetch, cache) | `packages/web/` |
| dare-session | Credential store + pod provisioning scripts | `packages/session/` |

### Four-Layer Skill Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│  META-STRATEGY (/dare)                                  │
│  Entry point — orchestrates the full research pipeline   │
│  Calls: strategies only                                  │
├─────────────────────────────────────────────────────────┤
│  STRATEGY (8)                                            │
│  intake, lit-survey, gap-analysis, insight, ideation,    │
│  round, paper-writing (v3.1+), method-evolve (v3.2+)    │
│  Calls: tactics + SOPs                                   │
├─────────────────────────────────────────────────────────┤
│  TACTIC (15)                                             │
│  academic-research, web-research, insight,               │
│  multiagent-debate, review, idea-generation,             │
│  idea-augmentation, scamper, component-surgery,          │
│  cross-domain-collision, perspective-forcing,            │
│  structural-deconstruction, systematic-enumeration,      │
│  assumption-destruction, method-evolution                │
│  Calls: SOPs + dare-agents tools                         │
├─────────────────────────────────────────────────────────┤
│  SOP (60)                                                │
│  Single-responsibility wrappers around dare-agents tools │
│  Calls: one dare-agents tool each                        │
├─────────────────────────────────────────────────────────┤
│  TOOL LAYER (MCP tools — atomic operations)              │
│  dare-agents, dare-scholar, dare-web, apify,             │
│  brave-search, runpod, alphaxiv                          │
└─────────────────────────────────────────────────────────┘
```

- **Meta-Strategy** = WHAT to research (entry point, pipeline orchestration)
- **Strategy** = WHEN and WHY (iteration loops, state management, stopping conditions)
- **Tactic** = HOW to combine (orchestrates multiple SOPs into a coherent workflow)
- **SOP** = HOW to execute (single dare-agents tool wrapper with protocol)
- **Tool** = WHAT to do (atomic MCP operations)

**Layer rules**: Each layer calls only the layer directly below it. /dare never calls SOPs or tools directly.

### Enforcement Mechanisms (v3.0.1 — Research Depth & Breadth)

All 8 strategies and 15 tactics embed enforcement mechanisms to prevent shallow research:

| Mechanism | Layer | Purpose |
|-----------|-------|---------|
| **Research Budget** | Strategy | S/M/L topic-tier quantitative floors (e.g., lit-survey M: 40 papers, 50 web pages) |
| **State Ledger** | Strategy | Progress table printed before every iteration, wrapped in `<HARD-GATE>` |
| **Budget Gate** | Strategy | Cannot exit iteration loop until 80% of budget met |
| **Adversarial Completeness Probe** | Strategy | Qualitative self-check (coverage, depth, diversity) after budget gate; max 2 extra iterations |
| **Yield Report** | Tactic | Per-execution output metrics feeding the calling strategy's State Ledger |
| **Minimum Yield / HARD-GATE** | Tactic | Per-tactic hard floors (e.g., academic-research: 8 fetch/5 read; idea-generation: >=3 methods) |
| **Cross-Domain Discovery (STEP 0)** | Ideation | Mandatory 3+ unrelated domains, 15+ cross-domain papers before ideation begins |

Topic size is classified in `/dare` meta-strategy (Small/Medium/Large) and propagated to all strategies for budget tier selection.

### MCP Servers

| Server | Package / Location | Purpose |
|--------|-------------------|---------|
| `dare-agents` | `packages/agents` | LLM-powered micro-agent tools (34 tools: ideation, debate, insight, method-evolve) |
| `dare-scholar` | `packages/scholar` | Academic paper pipeline (search, fetch, read, references) |
| `dare-web` | `packages/web` | Web page fetching and caching (fetch, read) |
| `dare-session` | `packages/session` | Credential store + pod provisioning scripts |
| `apify` | `@apify/actors-mcp-server` | Google Scholar search + web page scraping |
| `brave-search` | `@brave/brave-search-mcp-server` | Web search API |
| `runpod` | `@runpod/mcp-server` | GPU pod lifecycle (create/start/stop/delete) |
| `alphaxiv` | AlphaXiv MCP (SSE) | Paper search, Q&A, code exploration (arXiv, auxiliary to dare-scholar) |

### dare-agents Tools

Built with `@mariozechner/pi-ai` (`complete()` API). Each tool: system prompt (`src/prompts/*.md`) + typed function (`src/tools/*.ts`).

| Category | Tools | Count |
|----------|-------|-------|
| Insight | root-cause-drilling, stakeholder-mapping, tension-mining, question-reformulation, abstraction-laddering, assumption-audit, validation | 7 |
| Debate | debate-critic, debate-defender, debate-judge | 3 |
| Ideation — SCAMPER | scamper-substitute, -combine, -adapt, -modify, -put-other-use, -eliminate, -reverse | 7 |
| Ideation — Surgery | surgery-subtract, -multiply, -divide, -unify, -redirect | 5 |
| Ideation — Other | analogical-transfer, forced-bridge, triz-contradiction, morphological-matrix, axiom-negation, constraint-injection, random-paper-entry, reverse-engineering, worst-method-analysis, method-problem-matrix, time-machine, anti-benchmark, ablation-brainstorm, benchmark-sweep, failure-taxonomy | 15 |
| Utility | facet-extraction, facet-bisociation, digest-extraction, paper-rating, quality-diversity-filtering, self-review, reviewer2-hat, theorist-hat, practitioner-hat | 9 |
| Method-Evolve | method-evolve-mutate, method-evolve-crossover, method-evolve-evaluate | 3 |

### dare-scholar Tools

| Tool | Description |
| ---- | ----------- |
| `paper_searching` | Enrich Google Scholar results into PaperMeta (arXiv, SS, Unpaywall) |
| `paper_fetching` | Fetch full paper as markdown (cache-first, multi-source fallback) |
| `paper_content` | Read cached paper markdown (local only, no network) |
| `paper_reference` | Get paper references via Semantic Scholar API |
| `paper_reading` | AI three-pass reading (Keshav method) via LLM agent |

### dare-web Tools

| Tool | Description |
| ---- | ----------- |
| `web_fetching` | Fetch web page as markdown via Apify rag-web-browser (cache-first) |
| `web_content` | Read cached web page markdown (local only, no network) |

### alphaxiv Tools (auxiliary to dare-scholar, arXiv only)

| Tool | Description |
| ---- | ----------- |
| `embedding_similarity_search` | Semantic paper search via embeddings |
| `full_text_papers_search` | Keyword paper search (exact names, authors) |
| `agentic_paper_retrieval` | Multi-turn autonomous retrieval (beta) |
| `get_paper_content` | AI-generated paper report or raw full text |
| `answer_pdf_queries` | Ask questions about any paper PDF |
| `read_files_from_github_repository` | Read files from a paper's GitHub repo |

### dare-session (Git-based Context Transfer)

Deploys CC research context to remote pods (RunPod GPU or any remote SSH host) via Git. CLAUDE.md + MEMORY are the durable context.

Credentials for pod provisioning (ANTHROPIC_BASE_URL, ANTHROPIC_AUTH_TOKEN, ANTHROPIC_MODEL, GITHUB_PAT, HF_TOKEN) are stored in `.mcp.json` under the `dare-session` server entry.

```
Local: MEMORY → memory/ → git push → GitHub
Pod:   git clone → deploy-context.sh → CC reads CLAUDE.md + MEMORY
Pod:   experiment outputs → git push → GitHub
Local: git pull → CC digests results → updates own MEMORY
```

## Research Pipeline

**Entry point**: `/dare` meta-strategy — orchestrates the full research pipeline.

| Phase | Strategy | Status |
|-------|----------|--------|
| 0. Brainstorming | `superpowers:brainstorming` (truncated) | P0 |
| 1. Intake | `skills/strategy/intake/` | P0 |
| 2. Literature Survey | `skills/strategy/lit-survey/` | P0 |
| 3. Gap Analysis | `skills/strategy/gap-analysis/` | P1 |
| 4. Insight | `skills/strategy/insight/` | P1 |
| 5. Ideation | `skills/strategy/ideation/` | P2 |
| 6. Round (review loop) | `skills/strategy/round/` | P0 |
| 7. Experiment Design | — | Future |
| 8. Paper Writing | `skills/strategy/paper-writing/` | P3 (interface only, v3.1+) |
| 9. Method Evolve | `skills/strategy/method-evolve/` | P3 (tools implemented, v3.2+) |

## Development Methodology: Incremental + Carpet-Bombing Tests

**MANDATORY** — all projects under DARE follow this development methodology:

1. **Single-file component** → immediately write unit tests, run and pass before moving on
2. **Multiple components form a feature** → immediately write feature-level integration tests
3. **Multiple features form a module** → immediately write module-level tests
4. **ALL prior tests must pass** before developing the next component — no exceptions
5. **Simulation tests required** — not just trivial "does it exist" checks. Generate realistic fake data that mimics real-world scenarios (fake API responses, edge cases, malformed inputs, realistic paper metadata, etc.) and verify the code works under realistic conditions
6. **Test files**: `packages/agents` uses `.test/` directory mirroring `src/`. `packages/scholar` and `packages/web` use `.test/` directory mirroring `src/`.
7. **Gate rule**: if any test fails, STOP. Fix the failure before writing new code

```
Component A → unit test A → PASS ✓
Component B → unit test B → PASS ✓
  → Feature test (A+B) → PASS ✓
Component C → unit test C → PASS ✓
  → Feature test (A+B+C) → PASS ✓
    → Module test (all) → PASS ✓
      → Continue to next module
```

## Key Conventions

- Repository structure: monorepo with `packages/agents`, `packages/scholar`, `packages/web`, `packages/session` + root orchestration (`skills/`)
- Skills: `skills/{dare,strategy,tactic,sop}/<name>/SKILL.md` — four-layer hierarchy
- Output filenames: lowercase, non-alphanum → `_`, no trailing `_`
- Cache: managed by dare-scholar and dare-web via `DARE_CACHE` env var, subdirs `markdown/`, `paper/`, `web/`
- Output: `output/` — research loop outputs. Gitignored, regenerated per research session
- dare-agents prompts: `packages/agents/src/prompts/*.md` — system prompts for each tool

## Dev Commands

```bash
npm install               # Install all workspace dependencies (root + packages)
npm test                  # Run scholar + web + agents tests
npm test -w packages/scholar  # Run scholar tests only
npm test -w packages/web      # Run web tests only
npm test -w packages/agents   # Run agents tests only (72 tests)
```

## Environment

- Node.js (ESM, `tsx` for TS execution), npm workspaces
- dare-agents uses `@mariozechner/pi-ai` for LLM completions, `@modelcontextprotocol/sdk` for MCP server
- `.mcp.json` `dare-session` entry holds credentials for pod provisioning (ANTHROPIC_BASE_URL, ANTHROPIC_AUTH_TOKEN, ANTHROPIC_MODEL, GITHUB_PAT, HF_TOKEN). `.env` is a local notes file, not read by any skill or script.
