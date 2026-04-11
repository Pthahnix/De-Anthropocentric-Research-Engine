---
name: Method Evaluate
description: >
  Head-to-head comparison of two methods. Evaluates criterion-by-criterion,
  determines winner, suggests Elo update via dare-agents method_evolve_evaluate tool.
type: sop
layer: sop
agent: dare-agents
tool: method_evolve_evaluate
input: |
  methodA: string (first method protocol)
  outputA: string (output produced by method A on test problem)
  methodB: string (second method protocol)
  outputB: string (output produced by method B on test problem)
  criteria: string (evaluation criteria — e.g. novelty, feasibility, diversity)
output: |
  EvaluateResult: { criteria: CriterionScore[], overallWinner: 'A'|'B'|'Tie',
    confidence: 'High'|'Medium'|'Low', eloUpdateSuggestion: { winner, loser } }
---

# Method Evaluate SOP

Single-responsibility: call dare-agents `method_evolve_evaluate` tool and return the evaluation result.

## Layer Rule

- This SOP calls **one** dare-agents tool. It does NOT call other SOPs or tactics.
- Called by: `method-evolution` tactic.

## Procedure

1. Validate input: both methods and both outputs must be non-empty, criteria must list at least 1 criterion
2. Call dare-agents `method_evolve_evaluate` with { methodA, outputA, methodB, outputB, criteria }
3. Validate output: overallWinner must be A/B/Tie, criteria array must be non-empty
4. Return EvaluateResult
