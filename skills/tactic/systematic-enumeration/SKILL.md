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

## Minimum SOP Usage

<HARD-GATE>
**You MUST call at least 2 of the SOPs listed in your calls section.**
More SOPs = more systematic coverage = fewer blind spots.

Available SOPs: benchmark-sweep, method-problem-matrix, ablation-brainstorm, failure-taxonomy

Each SOP systematically enumerates from a different dimension:
- benchmark-sweep: "What do different benchmarks tell us?"
- method-problem-matrix: "Which method × problem combinations are unexplored?"
- ablation-brainstorm: "What happens if we remove/replace components?"
- failure-taxonomy: "What are the common failure modes and how do we fix them?"

Calling only 1 leaves systematic blind spots.
</HARD-GATE>

## Procedure
1. **benchmark-sweep SOP** with all known benchmarks → cross-benchmark ideas
2. **method-problem-matrix SOP** with methods × problems → unexplored combinations
3. **ablation-brainstorm SOP** with SOTA components → what-if variants
4. **failure-taxonomy SOP** with known failure cases → failure-addressing ideas
5. Aggregate all enumerated ideas, remove duplicates

## Yield Report

<HARD-GATE>
### Yield Report: systematic-enumeration
| Metric | Count |
|--------|-------|
| SOPs called | ?? |
| SOP names | [list] |
| Combinations/entries enumerated | ?? |
| Ideas generated per SOP | ?? |
| Total ideas generated | ?? |
</HARD-GATE>
