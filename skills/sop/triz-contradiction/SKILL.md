---
name: TRIZ Contradiction
description: Apply TRIZ inventive principles to resolve metric conflicts
type: sop
layer: sop
agent: dare-agents
tools: [triz_contradiction]
input: idea (Idea JSON), metricX (string), metricY (string), context (string)
output: TrizResult — contradiction, appliedPrinciples[], variants[]
---

# TRIZ Contradiction SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `triz_contradiction`
- **Called by**: structural-deconstruction tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + conflicting metrics from calling tactic
2. Call `triz_contradiction({ idea, metricX, metricY, context })` via dare-agents
3. Return TrizResult with contradiction analysis and resolution variants to calling tactic
