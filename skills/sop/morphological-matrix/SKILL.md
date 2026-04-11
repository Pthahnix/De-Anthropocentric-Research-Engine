---
name: Morphological Matrix
description: Decompose problem into dimensions and enumerate novel combinations
type: sop
layer: sop
agent: dare-agents
tools: [morphological_matrix]
input: dimensions (JSON array of { dimension, options[] }), context (string)
output: MorphologicalResult — matrix, combinations[], unexploredRegions[]
---

# Morphological Matrix SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `morphological_matrix`
- **Called by**: structural-deconstruction tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive dimensions + context from calling tactic
2. Call `morphological_matrix({ dimensions, context })` via dare-agents
3. Return MorphologicalResult with matrix and novel combinations to calling tactic
