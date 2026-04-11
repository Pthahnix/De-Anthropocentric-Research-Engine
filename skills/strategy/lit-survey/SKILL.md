---
name: Literature Survey
description: Iterative literature survey — search, read, discover gaps, until sufficient coverage
type: strategy
layer: strategy
calls: [academic-research, web-research]
input: researchBrief (from intake), knowledge (accumulated), papersRead (list), urlsVisited (list)
output: SurveyResult — knowledge, papersRead, gaps discovered, facets collected
maxIterations: 10 (cold) / 3 (hot)
target: 50 papers
---

# Literature Survey Strategy

## Layer Rules
- **Layer**: strategy — orchestrates tactics
- **Called by**: round strategy or /dare meta-strategy
- **Calls**: academic-research tactic, web-research tactic

## Research Budget — Lit-Survey

Lit-survey carries ~60% of the total paper/web budget. It is the primary discovery engine.

| Metric | Small | Medium | Large |
|--------|-------|--------|-------|
| Papers read | 20 | 40 | 60+ |
| Web pages fetched | 20 | 50 | 120+ |
| Search queries | 15 | 35 | 70+ |
| Iteration rounds | 6 | 8 | 12+ |

Read the `topicSize` from state (set by /dare Phase 0.5) to select the correct column.
These are HARD FLOORS — the strategy may NOT exit until the Budget Gate passes.

## State Ledger

<HARD-GATE>
Print this table BEFORE EVERY iteration of the lit-survey loop. Update counts after each tactic call returns its Yield Report. Skipping the ledger print is a protocol violation.

| Metric | Current | Target | Remaining | Status |
|--------|---------|--------|-----------|--------|
| Papers read | ?? | [from budget] | ?? | ... |
| Web pages fetched | ?? | [from budget] | ?? | ... |
| Queries issued | ?? | [from budget] | ?? | ... |
| Iterations done | ?? | [from budget] | ?? | ... |
| Sub-areas covered | ?? | 3+ | ?? | ... |
| Research communities found | ?? | 2+ | ?? | ... |

When a tactic returns a Yield Report, ADD its counts to the Current column.
</HARD-GATE>

## Procedure — Iterative Loop

```
WHILE (gaps.length > 0 AND iteration < MAX_ITERATIONS):

  STEP 1 — QUERY GENERATION:
  Generate 3 academic queries + 3 web queries based on:
  - Current gaps (from previous reflection)
  - Research brief initial queries (first iteration only)
  - Knowledge accumulated so far

  STEP 2 — SEARCH + READ:
  Call academic-research tactic with 3 academic queries
  Call web-research tactic with 3 web queries (in parallel)

  STEP 3 — REFLECT:
  Use prompts/reflect-gaps.md to discover new gaps from what was just read
  Update knowledge with key findings

  STEP 4 — EVALUATE:
  Use prompts/evaluate-answer.md to judge sufficiency
  Remove gaps that are now answered
```

## Budget Gate

<HARD-GATE>
Before evaluating any stop condition (plateau, saturation, etc.), check:

1. Papers read >= 80% of target? (e.g., Medium → >= 32 papers)
2. Web pages fetched >= 80% of target? (e.g., Medium → >= 40 pages)
3. Queries issued >= 60% of target?

If ANY condition fails → CONTINUE iterating. Do NOT evaluate stop conditions.
The Budget Gate takes absolute priority over convergence signals.

Only when ALL three conditions pass may you proceed to the stop check.
</HARD-GATE>

```
  STEP 5 — STOP CHECK:
  - All gaps cleared? → STOP (success)
  - No progress for 3 iterations? → STOP (plateau)
  - Target paper count reached? → STOP (coverage)
  - MAX_ITERATIONS hit? → STOP (budget)

END LOOP
```

## Completeness Probe — Lit-Survey

<HARD-GATE>
After the Budget Gate passes AND the stop check says "stop," answer honestly:

**Sub-area coverage:**
- [ ] Have I searched at least 3 distinct sub-areas of this topic?
- [ ] For each sub-area, do I have at least 3 papers?
- [ ] Are there obvious sub-areas I haven't explored?

**Citation tracing:**
- [ ] Did I check the references of the top-cited papers I read?
- [ ] Did I find and read at least 2 seminal/foundational papers?
- [ ] Are there highly-cited papers (>100 citations) I missed?

**Research community diversity:**
- [ ] Have I found papers from at least 2 different research communities?
  (e.g., ML community + domain-specific community)
- [ ] Are there conferences/journals I haven't searched?
- [ ] Did I search for both recent (last 2 years) AND foundational (5+ years) work?

**Depth check:**
- [ ] Did I actually READ (not just skim titles of) my top papers?
- [ ] Can I explain the key contribution of each top paper in 2 sentences?
- [ ] Do I have enough detail to identify genuine research gaps?

If ANY checkbox fails → add 1-3 targeted queries and run ONE MORE iteration.
Maximum 2 extra completeness iterations allowed.
</HARD-GATE>

## State Management
- `knowledge`: cumulative string, grows each iteration
- `papersRead`: string[] of paper titles, deduplicate across iterations
- `urlsVisited`: string[] of URLs, deduplicate across iterations
- `gaps`: string[] discovered via reflection, removed when answered

## Output
```json
{
  "knowledge": "Accumulated knowledge string...",
  "papersRead": ["paper1", "paper2", ...],
  "urlsVisited": ["url1", "url2", ...],
  "gaps": ["remaining gap1", ...],
  "facets": [...],
  "iterationsUsed": 7,
  "stopReason": "all_gaps_cleared | plateau | target_reached | max_iterations"
}
```
