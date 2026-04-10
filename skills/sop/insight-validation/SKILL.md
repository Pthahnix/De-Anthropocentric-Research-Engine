---
name: Insight Validation
description: Gate the complete insight against 6 quality criteria; FAIL halts pipeline, REVISE triggers targeted re-run
type: sop
layer: sop
agent: dare-agents
tools: [insight_validation]
input: fullInsight (string, JSON of complete steps 1-6)
output: ValidationResult — gates[], overallVerdict (PASS|FAIL|REVISE), failedGates[], revisionGuidance?
---

# Insight Validation SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `insight_validation`
- **Called by**: insight tactic only
- **Never calls**: other SOPs (leaf node)
- **Position**: Final step (Step 7 of 7) of INSIGHT pipeline — hard gate

## Procedure
1. Receive `fullInsight` (JSON string aggregating all outputs from Steps 1-6) from insight tactic
2. Call `insight_validation({ fullInsight })` via dare-agents
3. Parse response into ValidationResult
4. Apply verdict routing:
   - **PASS** — return result to insight tactic; pipeline complete
   - **FAIL** — report failure to strategy layer; insight pipeline does not proceed
   - **REVISE** — insight tactic re-runs from the step identified in `revisionGuidance.fromStep`

## The 6 Gates
1. **Root cause specificity** — rootCause is structural, not a restatement of the surface gap
2. **Stakeholder reality** — underservedStakeholder is real and reachable, not hypothetical
3. **Tension genuineness** — primaryTension is a real trade-off, not a false dilemma
4. **HMW actionability** — top rankedQuestions are narrow enough to generate concrete ideas
5. **Abstraction connection** — reframedProblem is meaningfully different from the original gap
6. **Assumption validity** — no unacknowledged critical assumptions remain in the insight chain

## Output Schema
- `gates[]` — per-gate assessment: name, status (PASS|FAIL), rationale
- `overallVerdict` — PASS (all gates pass), FAIL (structural failure, cannot revise), REVISE (targeted fix possible)
- `failedGates[]` — names of gates that did not pass
- `revisionGuidance` — present only when verdict is REVISE; specifies `fromStep` (1-6) and what to fix
