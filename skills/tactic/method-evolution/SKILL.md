---
name: Method Evolution
description: >
  Orchestrates one generation of evolutionary method improvement.
  Mutation → Crossover → Evaluation cycle using 3 method-evolve SOPs.
  Called by method-evolve strategy.
type: tactic
layer: tactic
agent: CC main (orchestrator)
sops:
  - method-mutate
  - method-crossover
  - method-evaluate
input: |
  methodPool: object[] (methods with their protocols and track records)
  eloRankings: object (current Elo scores for all methods)
  evaluationCriteria: string (what makes a method "good")
  context: string (current research domain)
  testProblem: string (problem to run methods against for evaluation)
output: |
  newMethods: object[] (mutated and hybrid method variants)
  updatedElo: object (Elo scores after this generation's evaluations)
  generationLog: string (trace of mutation/crossover/evaluation decisions)
---

# Method Evolution Tactic

Orchestrate one generation of evolutionary improvement across the method pool.

## Layer Rule

- This tactic calls **only** SOPs: method-mutate, method-crossover, method-evaluate.
- It does NOT call dare-agents tools directly.
- Called by: `method-evolve` strategy.

## Procedure

### 1. Parent Selection

Select top-N methods by Elo score (N = min(5, pool size)):
- Top 3 by Elo → candidates for mutation
- Top 4 paired → 2 pairs for crossover

### 2. Mutation Phase

For each of the top 3 methods:
1. Call `method-mutate` SOP with method's protocol + track record + context
2. Collect MutationResult
3. Add mutated variant to candidate pool

### 3. Crossover Phase

For each of the 2 pairs:
1. Call `method-crossover` SOP with both parents + track records + context
2. Collect CrossoverResult
3. Add hybrid to candidate pool

### 4. Evaluation Phase

For each new method (mutated or hybrid) vs its parent:
1. Run both methods on testProblem (execute method protocol, collect output)
2. Call `method-evaluate` SOP with both methods + outputs + evaluationCriteria
3. Update Elo scores based on EvaluateResult.eloUpdateSuggestion

### 5. Output

Return:
- newMethods: all mutated + hybrid variants
- updatedElo: Elo rankings after this generation
- generationLog: markdown trace of all decisions

## Quality Gate

- Mutated methods must differ meaningfully from parents (not cosmetic changes)
- Hybrids must integrate aspects from both parents (not just one parent with a new name)
- Elo updates must be symmetric (winner gains what loser loses)
