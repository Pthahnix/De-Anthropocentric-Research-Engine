---
name: Worst Method Analysis
description: Design the worst method, extract insights from inverting it
type: sop
layer: sop
agent: dare-agents
tools: [worst_method_analysis]
input: problem (string), context (string)
output: WorstMethodResult — worstMethod, variants[]
---

# Worst Method Analysis SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `worst_method_analysis`
- **Called by**: assumption-destruction tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive problem + context from calling tactic
2. Call `worst_method_analysis({ problem, context })` via dare-agents
3. Return WorstMethodResult with inverted insights to calling tactic
