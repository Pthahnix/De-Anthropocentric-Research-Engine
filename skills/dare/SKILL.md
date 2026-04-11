---
name: /dare
description: DARE research engine entry point — orchestrates the full research pipeline
type: meta-strategy
layer: meta-strategy
calls: [intake, lit-survey, gap-analysis, insight, round]
---

# /dare — De-Anthropocentric Research Engine

## Overview
Entry point for the full DARE research pipeline. Transforms a user's research topic
into validated research artifacts (survey, gaps, ideas, experiment designs, results).

## Layer Rules
- **Layer**: meta-strategy — top of the hierarchy
- **Called by**: user (via `/dare` command)
- **Calls**: strategies only (intake, lit-survey, gap-analysis, insight, round)
- **NEVER**: calls tactics, SOPs, or MCP tools directly

## Pipeline

### Phase 0: Brainstorming (superpowers integration)
- MUST invoke `superpowers:brainstorming` for structured requirement clarification
- Truncate after clarify questions — DARE's research loop replaces brainstorming's design/spec flow
- Output: `userTopic` (refined research topic)

### Phase 0.5: Topic-Size Classification

<HARD-GATE>
Before entering the research loop, classify the research topic into one of three size tiers.
This classification determines budget targets for ALL downstream strategies.

| Tier | Description | Example |
|------|-------------|---------|
| **Small (S)** | Narrow sub-problem, specific technique, single benchmark | "Improving GNN message-passing efficiency on heterogeneous graphs" |
| **Medium (M)** | Standard research topic spanning multiple sub-areas | "Graph neural networks for drug discovery" |
| **Large (L)** | Broad survey, cross-disciplinary, or emerging field | "Foundation models for scientific discovery" |

**Classification heuristic:**
- S: topic can be described in one sentence with a single technical focus
- M: topic spans 2-4 distinct sub-areas or methodologies
- L: topic spans 5+ sub-areas, multiple disciplines, or is a survey/position paper

Store the tier in state: `topicSize: "S" | "M" | "L"`

This tier is passed to every strategy and determines their budget targets.
</HARD-GATE>

### Phase 1: Intake
- Call **intake strategy** with `userTopic`
- Output: `researchBrief` (structured topic + initial queries + field context)

### Phase 2: Research Loop (Stages 1-3)

#### Research Budget Overview (by topic size)

The following aggregate targets guide the entire research loop. Individual strategy budgets sum to these totals.

| Metric | Small | Medium | Large |
|--------|-------|--------|-------|
| Papers read (total) | 30 | 60 | 100+ |
| Web pages fetched (total) | 30 | 80 | 200+ |
| Search queries (total) | 20 | 50 | 100+ |
| Iteration rounds (total) | 6 | 10 | 15+ |
| Cross-domain papers (ideation) | 5 | 15 | 30+ |

- **Round 0 (Cold Start)**:
  - Call **round strategy** with `{ researchBrief, roundNumber: 0 }`
  - Runs: lit-survey(10 iter) → gap-analysis(6 iter) → insight(7-step pipeline) → ideation(5 iter) → review

- **Hot Loop (Round 1-6)**:
  - Read review feedback
  - Brief user on strategy for this round
  - Call **round strategy** with `{ researchBrief, previousRoundState, roundNumber }`
  - Stop when: score >= 8/10 AND no CRITICAL issues, OR 7 rounds max

### Phase 3: Experiment Design (P2+)
- STUB in P0. Will call experiment-design strategy.

### Phase 4: Experiment Execution (P2+)
- STUB in P0. Will call experiment-execution strategy with session-teleport.

## State Object
```json
{
  "userTopic": "...",
  "researchBrief": {...},
  "knowledge": "...",
  "papersRead": [],
  "urlsVisited": [],
  "gaps": [],
  "ideas": [],
  "reviewHistory": [],
  "currentRound": 0
}
```

## P0 Implemented
- [x] Intake strategy (Phase 1)
- [x] Literature Survey strategy (Phase 2, stage 1)
- [x] Round strategy skeleton (Phase 2)
- [x] Self-review-quick SOP (lightweight validation)
- [x] All 7 dare-agents tools (facet, digest, rate, self-review, C/D/J debate)

## P1 Implemented
- [x] INSIGHT 7-step pipeline (root-cause → stakeholder → tension → hmw → abstraction → assumption → validation)
- [x] Full multiagent debate (4 structured C→D rounds + Judge + 3 free rounds)
- [x] Quality-diversity filtering (MAP-Elites niche selection)
- [x] Gap-analysis strategy (6 iterations, calls insight tactic)
- [x] Insight strategy (orchestrates INSIGHT pipeline + debate validation)
- [x] INSIGHT SOPs (7 step SOPs + QD filtering SOP)
- [x] Debate SOPs (debate-idea, debate-gap, debate-insight, debate-experiment)
- [x] Tactics (insight, multiagent-debate, review)

## P2 Implemented
- [x] IDEATION methods (5 categories, 31 dare-agents tools)
- [x] IDEATION SOPs (31 SKILL.md files across 5 categories)
- [x] IDEATION tactics (9: 2 operational + 5 categorical + 2 compound)
- [x] Ideation strategy (iterative: generate → augment → filter → validate)
- [x] Idea-generation tactic (5-category divergence + cross-pollination + convergence)
- [x] Idea-augmentation tactic (reviewer2 + SCAMPER + surgery improvements)

## After P2
- [ ] Experiment design strategy

## P3 Implemented
- [x] Paper-writing strategy (future v3.1+ — interface defined)
- [x] Method-evolve strategy (future v3.2+ — tools implemented)
- [x] Method-evolve dare-agents tools (3: mutate, crossover, evaluate)
- [x] Method-evolve SOPs (3: method-mutate, method-crossover, method-evaluate)
- [x] Method-evolution tactic (orchestrates mutation + crossover + evaluation cycle)
