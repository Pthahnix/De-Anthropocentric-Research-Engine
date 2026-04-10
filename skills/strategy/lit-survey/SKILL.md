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
  
  STEP 5 — STOP CHECK:
  - All gaps cleared? → STOP (success)
  - No progress for 3 iterations? → STOP (plateau)
  - Target paper count reached? → STOP (coverage)
  - MAX_ITERATIONS hit? → STOP (budget)

END LOOP
```

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
