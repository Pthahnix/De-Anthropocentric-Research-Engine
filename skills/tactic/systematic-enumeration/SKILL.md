---
name: Systematic Enumeration
description: Orchestrates 4 Cat.5 SOPs for exhaustive idea generation
type: tactic
layer: tactic
calls: [benchmark-sweep, method-problem-matrix, ablation-brainstorm, failure-taxonomy]
input: benchmarks[], methods[], problems[], sotaComponents[], failureCases[]
output: Idea[] from systematic enumeration
---

# Systematic Enumeration Tactic (Category 5)

## Procedure
1. **benchmark-sweep SOP** with all known benchmarks → cross-benchmark ideas
2. **method-problem-matrix SOP** with methods × problems → unexplored combinations
3. **ablation-brainstorm SOP** with SOTA components → what-if variants
4. **failure-taxonomy SOP** with known failure cases → failure-addressing ideas
5. Aggregate all enumerated ideas, remove duplicates
