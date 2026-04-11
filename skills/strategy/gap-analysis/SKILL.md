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

## Research Budget — Gap-Analysis

Gap-analysis carries ~25% of the total paper/web budget. It performs targeted investigation of identified gaps.

| Metric | Small | Medium | Large |
|--------|-------|--------|-------|
| Papers read | 10 | 15 | 25+ |
| Web pages fetched | 10 | 20 | 40+ |
| Search queries | 10 | 20 | 40+ |
| Iteration rounds | 4 | 6 | 8+ |
| Gaps investigated (min) | 3 | 5 | 8+ |

Read the `topicSize` from state to select the correct column.
These are HARD FLOORS.

## State Ledger

<HARD-GATE>
Print this table BEFORE EVERY iteration of the gap-analysis loop. Update counts after each tactic call returns its Yield Report.

| Metric | Current | Target | Remaining | Status |
|--------|---------|--------|-----------|--------|
| Papers read | ?? | [from budget] | ?? | ... |
| Web pages fetched | ?? | [from budget] | ?? | ... |
| Queries issued | ?? | [from budget] | ?? | ... |
| Iterations done | ?? | [from budget] | ?? | ... |
| Gaps identified | ?? | [from budget] | ?? | ... |
| Gaps with evidence | ?? | [from budget] | ?? | ... |

When a tactic returns a Yield Report, ADD its counts to the Current column.
</HARD-GATE>

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
```

## Budget Gate

<HARD-GATE>
Before evaluating any stop condition, check:

1. Papers read >= 80% of target?
2. Web pages fetched >= 80% of target?
3. Gaps investigated >= minimum from budget table?

If ANY condition fails → CONTINUE iterating. Do NOT evaluate stop conditions.
</HARD-GATE>

```
  STEP 5 — STOP CHECK:
  - All candidate gaps processed? → STOP (success)
  - No new gaps validated for 2 consecutive iterations? → STOP (plateau)
  - MAX_ITERATIONS hit? → STOP (budget)

END LOOP
```

## Completeness Probe — Gap-Analysis

<HARD-GATE>
After the Budget Gate passes AND the stop check says "stop," answer honestly:

**Evidence balance:**
- [ ] For each gap, do I have BOTH supporting AND contradicting evidence?
- [ ] Have I searched for papers that explicitly address (or fail to address) each gap?
- [ ] Is there a gap I identified early but never investigated deeply?

**Dimension completeness:**
- [ ] Have I considered gaps across multiple dimensions?
  (methodology gaps, data gaps, evaluation gaps, theoretical gaps)
- [ ] Are there gaps that are "obvious" to practitioners but missing from the literature?
- [ ] Did I check if any gap has been partially addressed in very recent work (last 6 months)?

**Cross-domain hint (optional but encouraged):**
- [ ] Are there analogous problems in other fields that might reframe this gap?
- [ ] Could a technique from another domain directly address one of these gaps?

If ANY checkbox in the first two sections fails → add 1-3 targeted queries and run ONE MORE iteration.
Maximum 2 extra completeness iterations. Cross-domain leads are a bonus, not a requirement here.
</HARD-GATE>

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
