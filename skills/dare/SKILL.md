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

### Phase 1: Intake
- Call **intake strategy** with `userTopic`
- Output: `researchBrief` (structured topic + initial queries + field context)

### Phase 2: Research Loop (Stages 1-3)
- **Round 0 (Cold Start)**:
  - Call **round strategy** with `{ researchBrief, roundNumber: 0 }`
  - Runs: lit-survey(10 iter) → gap-analysis(6 iter) → insight(7-step pipeline) → idea-gen(5 iter, P2) → review

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

## After P2
- [ ] IDEATION methods (5 categories, 31 tools)
- [ ] Ideation strategy
- [ ] Experiment design strategy

## After P3
- [ ] Paper-writing strategy
- [ ] Method-evolve strategy
