---
name: Round
description: One full research round — survey + gap-analysis + idea-generation + review
type: strategy
layer: strategy
calls: [lit-survey]
input: researchBrief, previousRoundState (if hot loop), roundNumber
output: RoundResult — survey results, gaps, ideas, review score
---

# Round Strategy

## Layer Rules
- **Layer**: strategy — orchestrates other strategies and tactics
- **Called by**: /dare meta-strategy only
- **Calls**: lit-survey strategy (P0), gap-analysis strategy (P1, stub for now), idea-generation strategy (P2, stub for now)

## Procedure

### Cold Start (Round 0)
1. Call **lit-survey strategy** with full iteration budget (10 iterations)
2. *(P1)* Call gap-analysis strategy — STUB: extract gaps from lit-survey output
3. *(P2)* Call idea-generation strategy — STUB: placeholder
4. *(P1)* Call review — STUB: placeholder, return score 0

### Hot Loop (Round 1+)
1. Read review feedback from previous round
2. Determine which stages need re-running based on review
3. Call only needed strategies with reduced iteration budgets:
   - lit-survey: 3 iterations (hot)
   - gap-analysis: 2 iterations (hot)
   - idea-generation: 2 iterations (hot)
4. Call review again

### State Inheritance
- All state (knowledge, papersRead, urlsVisited) carries forward between rounds
- Each round extends, never replaces, accumulated state

## P0 Scope Note
In P0, only lit-survey is fully implemented. Gap-analysis and idea-generation are stubs that return placeholder outputs. The round strategy skeleton is created now so P1/P2 can fill in the real implementations without restructuring.

## Output
```json
{
  "roundNumber": 0,
  "surveyResult": {...},
  "gaps": [...],
  "ideas": [...],
  "reviewScore": 0,
  "reviewFeedback": "...",
  "state": { "knowledge": "...", "papersRead": [...], "urlsVisited": [...] }
}
```
