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

## Budget Distribution by Topic Size

The round strategy distributes the total research budget across its child strategies.
Each child strategy reads these targets from state.

### Cold Start (Round 0)

| Strategy | Small | Medium | Large |
|----------|-------|--------|-------|
| lit-survey papers | 20 | 40 | 60+ |
| lit-survey web pages | 20 | 50 | 120+ |
| gap-analysis papers | 10 | 15 | 25+ |
| gap-analysis web pages | 10 | 20 | 40+ |
| ideation cross-domain papers | 5 | 15 | 25+ |
| Total papers | 35 | 70 | 110+ |
| Total web pages | 35 | 85 | 185+ |

### Hot Loop (Round 1+) — 40% of Cold Start targets

| Strategy | Small | Medium | Large |
|----------|-------|--------|-------|
| lit-survey papers | 8 | 16 | 24+ |
| gap-analysis papers | 4 | 6 | 10+ |
| ideation cross-domain papers | 2 | 6 | 10+ |

## Procedure

## Round State Ledger

<HARD-GATE>
Print this CUMULATIVE ledger at the START and END of every round.
This ledger tracks progress ACROSS all strategies within the round.

| Metric | Round Start | Round End | Round Delta | Cumulative (all rounds) | Overall Target |
|--------|-------------|-----------|-------------|------------------------|----------------|
| Papers read | ?? | ?? | ?? | ?? | [from budget] |
| Web pages fetched | ?? | ?? | ?? | ?? | [from budget] |
| Gaps identified | ?? | ?? | ?? | ?? | ... |
| Ideas generated | ?? | ?? | ?? | ?? | ... |
| Ideas surviving QD | ?? | ?? | ?? | ?? | 3+ |

This is the top-level progress tracker. If a round ends with little delta
(< 10% improvement on any metric), escalate: the next round should target
the weakest metric specifically.
</HARD-GATE>

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
