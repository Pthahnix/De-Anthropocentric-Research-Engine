---
name: Gap Analysis
description: Discover and validate research gaps using INSIGHT pipeline + debate validation
type: strategy
layer: strategy
calls: [insight, multiagent-debate, review, academic-research, web-research]
input: surveyResult (from lit-survey), knowledge, papersRead, urlsVisited
output: ValidatedGaps — gaps that passed both INSIGHT validation and debate
maxIterations: 6 (cold) / 2 (hot)
target: 30 papers read, validated gaps
---

# Gap Analysis Strategy

## Layer Rules
- **Layer**: strategy — orchestrates tactics
- **Called by**: round strategy or /dare meta-strategy
- **Calls**: insight tactic, review tactic, academic-research tactic, web-research tactic
- **Never calls**: SOPs or tools directly

## Procedure — Iterative Loop

```
WHILE (unvalidated_gaps AND iteration < MAX_ITERATIONS):

  STEP 1 — IDENTIFY GAPS:
  From surveyResult.knowledge + surveyResult.gaps, enumerate candidate gaps:
  - What problems remain unsolved?
  - What methods are missing or underexplored?
  - What assumptions are unquestioned?
  - What benchmarks or datasets are absent?

  STEP 2 — INVESTIGATE (parallel):
  Call academic-research tactic: 3 queries targeting each candidate gap's prior work
  Call web-research tactic: 3 queries targeting each candidate gap's practical context
  Merge new papersRead and urlsVisited into state

  STEP 3 — DEEPEN with INSIGHT pipeline:
  For each candidate gap with unclear root cause or non-obvious stakeholder need:
    Call insight tactic with:
      - gap: the candidate gap JSON
      - evidence: accumulated evidence string from Steps 1-2
      - knowledge: current knowledge string
    Collect InsightResult (PASS / REVISE / FAIL verdict)
    - PASS: promote gap to validated_gaps[]
    - REVISE: refine gap framing, re-queue for next iteration
    - FAIL: move to rejected_gaps[] with reason

  STEP 4 — VALIDATE via review tactic:
  Call review tactic on the set of PASS gaps from this iteration
  Review may escalate to multiagent-debate for controversial or high-stakes gaps
  Gaps that survive review → confirmed in validatedGaps[]
  Gaps that fail review → rejected with reason

  STEP 5 — STOP CHECK:
  - All candidate gaps processed? → STOP (success)
  - No new gaps validated for 2 consecutive iterations? → STOP (plateau)
  - MAX_ITERATIONS hit? → STOP (budget)

END LOOP
```

## State Management
- `knowledge`: inherited from lit-survey surveyResult; extended with gap-analysis findings each iteration
- `papersRead`: inherited from lit-survey; deduplicated, extended with new papers read in Steps 2-3
- `urlsVisited`: inherited from lit-survey; deduplicated, extended with new URLs visited in Steps 2-3
- `validatedGaps`: string[] of gaps that passed INSIGHT + review; grows each iteration
- `rejectedGaps`: string[] with rejection reasons; for transparency

## Output
```json
{
  "validatedGaps": [
    {
      "id": "gap_001",
      "description": "Gap description...",
      "rootCause": "Why this gap exists...",
      "stakeholders": ["who cares and why"],
      "evidence": "Supporting evidence from papers/web...",
      "insightVerdict": "PASS",
      "reviewVerdict": "approved"
    }
  ],
  "rejectedGaps": [
    {
      "id": "gap_002",
      "description": "Gap description...",
      "rejectionReason": "Already addressed by X et al. (2024)..."
    }
  ],
  "papersRead": ["paper1", "paper2", "..."],
  "urlsVisited": ["url1", "url2", "..."],
  "knowledge": "Extended knowledge string...",
  "iterationsUsed": 4,
  "stopReason": "all_gaps_processed | plateau | max_iterations"
}
```
