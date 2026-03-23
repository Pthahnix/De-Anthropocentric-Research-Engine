# Neocortica Project Memory

## Project Identity
- **Name**: Neocortica (migrated from Prometheus)
- **Purpose**: AI-powered academic research automation toolkit with four-dimensional architecture
- **Architecture**: Monorepo (v2.0.0) — npm workspaces with `packages/scholar`, `packages/web`, `packages/session`. Root holds orchestration (skills, pipelines, prompts).
- **Version History**: v0.8.0 (multi-MCP) → v0.9.0 (pipeline layer + scholar) → v1.0.0 (web integration, full pipeline) → v1.0.1 (research review loop) → v1.1.0 (Git-based context transfer) → v2.0.0 (monorepo + dual pod + HF_TOKEN)
- **Unique Positioning**: Only open-source system combining Deep Research + Adversarial Debate + Evolutionary Generation + Distributed Execution

## Core Components

### 1. Monorepo Structure (v2.0.0)
```
neocortica/
├── packages/
│   ├── scholar/     # @neocortica/scholar — academic paper MCP (5 tools, 153 tests)
│   ├── web/         # @neocortica/web — web page MCP (2 tools)
│   └── session/     # @neocortica/session — pod provisioning scripts (no TS)
├── skill/           # Research workflow SOPs
├── pipeline/        # Fixed tool-orchestration workflows
├── prompt/          # LLM prompt templates (root-level, NOT paper-reading which is in packages/scholar)
├── memory/          # .gitkeep, for context transfer
└── output/          # Gitignored, research outputs
```

### 2. Three-Layer Architecture (v0.9.0 — Pipeline Layer)
```
Skill (WHEN/WHY) → Pipeline (HOW) → Tool (WHAT)
```
- **Pipelines** (`pipeline/*.md`): Fixed tool-orchestration workflows, registered in `.claude/commands/`
  - `acd-searching.md`: SEARCH (google-scholar-scraper parallel) → ENRICH (paper_searching sequential) → FETCH (paper_fetching sequential)
  - `web-searching.md`: DISCOVER (brave_web_search parallel) → EXTRACT (web_fetching sequential via neocortica-web MCP)
- **Skills** reference pipelines instead of inlining tool call sequences
- `pipeline/*.md` is source of truth, `.claude/commands/` contains copies for CC registration
- State inheritance includes `urlsVisited` (web pages) alongside `papersRead` (papers) and `knowledge`

### 3. MCP Servers (v2.0.0 — monorepo packages)
- **neocortica-scholar** (`packages/scholar`): `paper_searching`, `paper_fetching`, `paper_content`, `paper_reference`, `paper_reading`
- **neocortica-web** (`packages/web`): `web_fetching`, `web_content`
- **neocortica-session** (`packages/session`): Virtual credential store in `.mcp.json` + pod provisioning shell scripts
- **apify** (`@apify/actors-mcp-server`): `google-scholar-scraper`, `rag-web-browser`
- **brave-search** (`@brave/brave-search-mcp-server`): `brave_web_search`
- **runpod** (`@runpod/mcp-server`): pod lifecycle
- **railway** (`@railway/mcp-server`): deployment

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

### neocortica-session — v3 Monorepo + Dual Pod (2026-03-22)
Git-based context transfer with dual pod targets (RunPod + Remote SSH).
- **Approach**: CLAUDE.md + MEMORY are durable context; push to GitHub, git clone on pod
- **Skills**: `skill/session-teleport.md` (Phase 0-4, dual pod), `skill/session-return.md` (pod-type-aware cleanup), `skill/experiment-output.md`
- **Scripts**: `packages/session/scripts/` — 5 atomic shell scripts (install-node, create-cc-user, install-cc, setup-env, deploy-context)
- **Dual pod**: RunPod (ephemeral, auto-create/delete) vs Remote (persistent, user-managed)
- **Credentials**: `.mcp.json` `neocortica-session` virtual entry holds ANTHROPIC_BASE_URL, ANTHROPIC_AUTH_TOKEN, ANTHROPIC_MODEL, GITHUB_PAT, HF_TOKEN
- **Context flow**: Local MEMORY → memory/ → git push → pod git clone → CC reads CLAUDE.md + MEMORY
- **CC project hash**: non-alphanum → `-` (e.g., `D:\NEOCORTICA` → `D--NEOCORTICA`, `/workspace/repo` → `-workspace-repo`)

## Development Methodology (User Preference — MANDATORY)
- **Incremental development with carpet-bombing tests**
- Each single-file component → unit test immediately, must PASS before next
- Multiple components → feature test, must PASS before next
- Multiple features → module test, must PASS before next
- **Simulation tests required**: generate realistic fake data mimicking real scenarios, not just trivial checks
- **Gate rule**: ALL prior tests must pass before writing new code — no exceptions
- Test files: `.test/` directory mirroring `src/` for scholar and web packages

## Active Sub-Projects
- **Monorepo v2.0.0**: Consolidation of scholar + web + session into packages/ — **COMPLETED** (2026-03-22, branch `feat/monorepo-v2`)
- **neocortica-scholar** (`D:\NEOCORTICA-SCHOLAR`): Original standalone repo — **PRESERVED** for independent development
- **neocortica-web** (`D:\NEOCORTICA-WEB`): Original standalone repo — **PRESERVED** for independent development
- **neocortica-session** (`D:\NEOCORTICA-SESSION`): Original standalone repo — **PRESERVED** for independent development

## Repo Hygiene
- `.mcp.json` holds all credentials: MCP server tokens + `neocortica-session` virtual entry for pod provisioning (gitignored)
- `.env` is local notes file only, NOT read by any skill or script
- `docs/` gitignored, removed from remote tracking (local-only specs/plans)
- `CLAUDE.md` gitignored (local-only)
- Original standalone repos preserved at `D:\NEOCORTICA-SCHOLAR`, `D:\NEOCORTICA-WEB`, `D:\NEOCORTICA-SESSION` — used for isolated development before updating monorepo
- `NEOCORTICA_CACHE` must be absolute path in `.mcp.json` (e.g., `D:/NEOCORTICA/.cache`) to prevent cache splitting when `npx --prefix` changes CWD

## File Conventions
- Output filenames: lowercase, non-alphanum → `_`, no trailing `_`
- Cache: managed by neocortica-scholar and neocortica-web via `NEOCORTICA_CACHE` env var, subdirs `markdown/`, `paper/`, `web/`
- Prompts: `prompt/<name>.md` (root) + `packages/scholar/prompt/paper-reading.md` (scholar-internal)
- Skills: `skill/<name>.md` - research SOPs (mirrored in `.claude/commands/` for CC, both gitignored-safe)
- Pipelines: `pipeline/<name>.md` - fixed tool workflows (source of truth; copies in `.claude/commands/`)
- Output: `output/` - research loop outputs. Gitignored, regenerated per session

## External Dependencies
- **MCP Servers**: `@apify/actors-mcp-server`, `@brave/brave-search-mcp-server`, `@runpod/mcp-server`, `@railway/mcp-server`, neocortica-scholar (packages/scholar), neocortica-web (packages/web)
- **APIs** (via neocortica-scholar): MinerU (PDF OCR), arXiv2md, Semantic Scholar, Unpaywall
- **APIs** (via apify/brave): Google Scholar (Apify actor), Brave Search, rag-web-browser (Apify actor)
- **APIs** (via neocortica-web): Apify rag-web-browser REST API (web page → markdown)
- **Environment**: Node.js ESM, `tsx` for TS execution, npm workspaces

## Important Notes
- Original standalone repos preserved for independent dev/refactoring before updating monorepo
- Project name is now **Neocortica** everywhere in active code
- Experiment execution costs real money - RunPod cleanup is mandatory, Remote cleanup is user's responsibility
- **Complete vision** (v1.0.0+): Four-dimensional architecture
  1. **Deep Research**: 10-round iterative literature survey with dynamic stopping
  2. **Adversarial Debate**: Proposer-Critic-Judge architecture for idea validation
  3. **Evolutionary Generation**: MAP-Elites quality-diversity algorithm for idea evolution
  4. **Distributed Execution**: Git-based context transfer, dual pod (RunPod + Remote) — **COMPLETED** (v2.0.0)

## Next Milestone
- MCP server live test: verify scholar and web servers start correctly with monorepo relative paths
- End-to-end test: run full research-loop on a real topic to validate review mechanism
- End-to-end test: run full Stage 5 with real GPU pod (session-teleport → experiment → session-return)
- Then: Adversarial Debate or Evolutionary Generation

## Competitive Analysis (updated 2026-03-05)

### Documents
- `.context/neocortica-analysis/2026-03-04-competitive-analysis.md` — v1, 60+ products, uses Neocortica's own 4-dim framework (biased)
- `.context/neocortica-analysis/2026-03-05-competitive-analysis-v2.md` — v2, objective reassessment with neutral industry criteria

### Honest Current Status
- **Tier 3**: Functional software with runnable pipeline, but NO validated scientific output yet
- 1/4 planned dimensions implemented (Deep Research pipeline), Distributed Execution completed (v2.0.0)
- Debate, Evolution — design docs only, no code

### Key Competitors (realistic threat assessment)
| Competitor | Threat Level | Reason |
|---|---|---|
| Google AI Co-Scientist | Low (short-term) | Closed-source, limited partners only. Has debate+evolution+distributed natively. Existential threat if opened |
| Sakana AI Scientist v2 | Medium | Open-source, but different direction (idea→paper automation, not iterative research assistance) |
| OpenAI Deep Research | Low | Synthesis only, not discovery. Different track |
| AlphaEvolve/FunSearch | Low | Code/algorithm domain only, not research ideas |
| New entrants | Biggest unknown | No significant open-source competitor has appeared since Sakana v2 |

### Window of Opportunity
- **Estimated: 6-12 months** before a serious open-source competitor or Google opening Co-Scientist
- Open-source scientific agent space is moving slower than expected
- No one else is building debate + evolution for research agents in the open

## Developer Profile & Velocity
- **Solo amateur developer**, built entire project from zero idea to current state in **~2 weeks**
- Execution speed is exceptional — design+implementation cycle is highly efficient
- **Do NOT tell user to stop designing or rush to implementation** — their design-first approach is what enables the speed

## User Profile
- [user_profile.md](user_profile.md) — DL background (NLP/LLM, GNN, multimodal, Agent/MCP), entering AI+Bio, 3x5090 + cloud GPU

## Research Context Documents
- `docs/superpowers/specs/2026-03-22-neocortica-2.0-design.md` - v2.0.0 monorepo + dual pod design spec
- `docs/superpowers/plans/2026-03-22-neocortica-2.0.md` - v2.0.0 implementation plan (11 tasks, all completed)
- `docs/superpowers/specs/2026-03-16-session-sharing-design.md` - Session sharing design spec (v1.1.0)
- `docs/superpowers/plans/2026-03-16-session-sharing.md` - Session sharing implementation plan (12 tasks, all completed)
