# DARE Project Memory

## Project Identity
- **Name**: DARE — De-Anthropocentric Research Engine (formerly Neocortica, migrated from Prometheus)
- **Full Name**: De-Anthropocentric Research Engine
- **Tagline**: "Human-centered AI-assisted research can no longer sustain the next leap of our civilization. It's time to decenter the human. It's time to DARE."
- **Chinese Tagline**: "以人类为中心的 AI 辅助科研模式，已不足以支撑文明创造更大的辉煌。是时候去人类中心主义了。是时候 DARE 了。"
- **Purpose**: De-anthropocentric research engine — AI leads the research, human leads the direction
- **Architecture**: Monorepo — npm workspaces with `packages/scholar`, `packages/web`, `packages/session`. Root holds orchestration (skills, pipelines, prompts).
- **Version History**: v0.8.0 (multi-MCP) → v0.9.0 (pipeline layer + scholar) → v1.0.0 (web integration, full pipeline, rebrand to DARE)
- **Unique Positioning**: Only open-source system combining Deep Research + Adversarial Debate + Evolutionary Generation + Distributed Execution
- **GitHub**: https://github.com/Pthahnix/De-Anthropocentric-Research-Engine

## Core Components

### 1. Monorepo Structure
```
dare/
├── packages/
│   ├── scholar/     # @dare/scholar — academic paper MCP (5 tools, 153 tests)
│   ├── web/         # @dare/web — web page MCP (2 tools)
│   └── session/     # @dare/session — pod provisioning scripts (no TS)
├── skill/           # Research workflow SOPs
├── pipeline/        # Fixed tool-orchestration workflows
├── prompt/          # LLM prompt templates (root-level, NOT paper-reading which is in packages/scholar)
├── memory/          # .gitkeep, for context transfer
└── output/          # Gitignored, research outputs
```

### 2. Three-Layer Architecture
```
Skill (WHEN/WHY) → Pipeline (HOW) → Tool (WHAT)
```
- **Pipelines** (`pipeline/*.md`): Fixed tool-orchestration workflows, registered in `.claude/commands/`
  - `acd-searching.md`: SEARCH (google-scholar-scraper parallel) → ENRICH (paper_searching sequential) → FETCH (paper_fetching sequential)
  - `web-searching.md`: DISCOVER (brave_web_search parallel) → EXTRACT (web_fetching sequential via dare-web MCP)
- **Skills** reference pipelines instead of inlining tool call sequences
- `pipeline/*.md` is source of truth, `.claude/commands/` contains copies for CC registration
- State inheritance includes `urlsVisited` (web pages) alongside `papersRead` (papers) and `knowledge`

### 3. MCP Servers
- **dare-scholar** (`packages/scholar`): `paper_searching`, `paper_fetching`, `paper_content`, `paper_reference`, `paper_reading`
- **dare-web** (`packages/web`): `web_fetching`, `web_content`
- **dare-session** (`packages/session`): Virtual credential store in `.mcp.json` + pod provisioning shell scripts
- **apify** (`@apify/actors-mcp-server`): `google-scholar-scraper`, `rag-web-browser`
- **brave-search** (`@brave/brave-search-mcp-server`): `brave_web_search`
- **runpod** (`@runpod/mcp-server`): pod lifecycle

### 4. Research Skills (`skill/*.md`)
Five-stage research pipeline with iterative loop engines + review-driven outer loop:

**Outer Loop (research-loop.md)** — wraps Stages 1-3:
- Cold start (Round 0): survey(10) → gap(6) → idea(5) → review
- Hot loop (Round 1-6): selective redo based on review feedback → review → check
- Stop: score >= 8/10 AND no CRITICAL issues, or 7 rounds max
- Review via independent `claude -p` process with web search verification
- State injection via preamble for hot loop iterations

**Inner Stages:**
1. **Literature Survey** (10 cold / 3 hot iterations, 50+ papers target)
2. **Gap Analysis** (6 cold / 2 hot iterations, 30 papers)
3. **Idea Generation** (5 cold / 2 hot iterations, 3 ideas)
4. **Experiment Design** (4 iterations, complete plan)
5. **Experiment Execution** (7 phases, dual pod lifecycle)

## Key Design Patterns

### Iterative Loop Engine (Literature Survey)
```
WHILE (gaps.length > 0 AND iteration < MAX_ITERATIONS):
  SEARCH: 3 queries → acd-searching pipeline (PaperMeta[]) + web-searching pipeline (WebMeta[])
  READ: Top 8-12 papers (three-pass) + web pages (summarize key points)
  REFLECT: Discover new gaps via reflect-gaps.md
  EVALUATE: Judge sufficiency via evaluate-answer.md
  STOP CHECK: gaps cleared? no progress? target reached?
END LOOP
```

### State Inheritance
- `knowledge` + `papersRead` + `urlsVisited` passed between stages
- Enables cumulative learning across pipeline

### Three-Pass Paper Reading
- **High**: Pass 1 → Pass 2 → Pass 3 (full deep read)
- **Medium**: Pass 1 → Pass 2 (skip details)
- **Low**: Pass 1 only (skim)

### dare-session — Git-based Context Transfer
Git-based context transfer with dual pod targets (RunPod + Remote SSH).
- **Approach**: CLAUDE.md + MEMORY are durable context; push to GitHub, git clone on pod
- **Skills**: `skill/session-teleport.md` (Phase 0-4, dual pod), `skill/session-return.md` (pod-type-aware cleanup), `skill/experiment-output.md`
- **Scripts**: `packages/session/scripts/` — 5 atomic shell scripts (install-node, create-cc-user, install-cc, setup-env, deploy-context)
- **Dual pod**: RunPod (ephemeral, auto-create/delete) vs Remote (persistent, user-managed)
- **Credentials**: `.mcp.json` `dare-session` entry holds ANTHROPIC_BASE_URL, ANTHROPIC_AUTH_TOKEN, ANTHROPIC_MODEL, GITHUB_PAT, HF_TOKEN
- **Context flow**: Local MEMORY → memory/ → git push → pod git clone → CC reads CLAUDE.md + MEMORY
- **CC project hash**: non-alphanum → `-` (e.g., `D:\DARE` → `D--DARE`, `/workspace/repo` → `-workspace-repo`)

## Development Methodology (User Preference — MANDATORY)
- **Incremental development with carpet-bombing tests**
- Each single-file component → unit test immediately, must PASS before next
- Multiple components → feature test, must PASS before next
- Multiple features → module test, must PASS before next
- **Simulation tests required**: generate realistic fake data mimicking real scenarios, not just trivial checks
- **Gate rule**: ALL prior tests must pass before writing new code — no exceptions
- Test files: `.test/` directory mirroring `src/` for scholar and web packages

## Repo Hygiene
- `.mcp.json` holds all credentials: MCP server tokens + `dare-session` entry for pod provisioning (gitignored)
- `.env` is local notes file only, NOT read by any skill or script
- `docs/` gitignored, removed from remote tracking (local-only specs/plans)
- `CLAUDE.md` gitignored (local-only)
- `DARE_CACHE` must be absolute path in `.mcp.json` (e.g., `D:/DARE/.cache`) to prevent cache splitting when `npx --prefix` changes CWD

## File Conventions
- Output filenames: lowercase, non-alphanum → `_`, no trailing `_`
- Cache: managed by dare-scholar and dare-web via `DARE_CACHE` env var, subdirs `markdown/`, `paper/`, `web/`
- Prompts: `prompt/<name>.md` (root) + `packages/scholar/prompt/paper-reading.md` (scholar-internal)
- Skills: `skill/<name>.md` - research SOPs (mirrored in `.claude/commands/` for CC, both gitignored-safe)
- Pipelines: `pipeline/<name>.md` - fixed tool workflows (source of truth; copies in `.claude/commands/`)
- Output: `output/` - research loop outputs. Gitignored, regenerated per session

## External Dependencies
- **MCP Servers**: `@apify/actors-mcp-server`, `@brave/brave-search-mcp-server`, `@runpod/mcp-server`, dare-scholar (packages/scholar), dare-web (packages/web)
- **APIs** (via dare-scholar): MinerU (PDF OCR), arXiv2md, Semantic Scholar, Unpaywall
- **APIs** (via apify/brave): Google Scholar (Apify actor), Brave Search, rag-web-browser (Apify actor)
- **APIs** (via dare-web): Apify rag-web-browser REST API (web page → markdown)
- **Environment**: Node.js ESM, `tsx` for TS execution, npm workspaces

## Important Notes
- Project name is now **DARE** (De-Anthropocentric Research Engine) everywhere in active code
- Formerly known as Neocortica (renamed 2026-03-26)
- Experiment execution costs real money - RunPod cleanup is mandatory, Remote cleanup is user's responsibility
- **Complete vision**: Four-dimensional architecture
  1. **Deep Research**: 10-round iterative literature survey with dynamic stopping
  2. **Adversarial Debate**: Proposer-Critic-Judge architecture for idea validation
  3. **Evolutionary Generation**: MAP-Elites quality-diversity algorithm for idea evolution
  4. **Distributed Execution**: Git-based context transfer, dual pod (RunPod + Remote) — **COMPLETED**

## Next Milestone
- End-to-end test: run full Stage 5 with real GPU pod (session-teleport → experiment → session-return)
- Then: Adversarial Debate or Evolutionary Generation

## Competitive Analysis (updated 2026-03-26)

### Honest Current Status
- **Tier 3**: Functional software with runnable pipeline, but NO validated scientific output yet
- 1/4 planned dimensions implemented (Deep Research pipeline), Distributed Execution completed
- Debate, Evolution — design docs only, no code

### Key Competitors (realistic threat assessment)
| Competitor | Stars | Threat Level | Reason |
|---|---|---|---|
| gpt-researcher | ~25.7k | Low | Web research only, not scientific discovery |
| deep-research | ~18.3k | Low | Minimal implementation, report generator |
| AI-Scientist (Sakana) | ~12.3k | Medium | Different direction (paper automation vs research assistance) |
| paper-qa (FutureHouse) | ~8.3k | Medium | Science RAG, not full pipeline. Well-funded (Eric Schmidt) |
| AI-Researcher (HKUDS) | ~4.8k | Medium | Claims Co-Scientist alternative, NeurIPS 2025 |
| Google AI Co-Scientist | n/a | High (long-term) | Closed-source. Existential threat if opened |

### Window of Opportunity
- **Estimated: 6-12 months** before a serious open-source competitor or Google opening Co-Scientist
- No one else is building debate + evolution for research agents in the open
- "De-anthropocentric" positioning is unique — no competitor frames research this way

## Developer Profile & Velocity
- **Solo amateur developer**, built entire project from zero idea to current state in **~2 weeks**
- Execution speed is exceptional — design+implementation cycle is highly efficient
- **Do NOT tell user to stop designing or rush to implementation** — their design-first approach is what enables the speed

## User Profile
- [user_profile.md](user_profile.md) — DL background (NLP/LLM, GNN, multimodal, Agent/MCP), entering AI+Bio, 3x5090 + cloud GPU

## Naming History
- **Prometheus** → **Neocortica** → **DARE** (De-Anthropocentric Research Engine)
- Renamed to DARE on 2026-03-26 for discoverability + philosophical positioning
- GitHub: `Pthahnix/De-Anthropocentric-Research-Engine`
