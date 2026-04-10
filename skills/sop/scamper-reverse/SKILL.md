---
name: SCAMPER Reverse
description: Apply the Reverse lens — invert assumptions or order
type: sop
layer: sop
agent: dare-agents
tools: [scamper_reverse]
input: idea (Idea JSON), context (string)
output: ScamperResult — variants[] with mutationType 'reverse' + explanation
---

# SCAMPER Reverse SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `scamper_reverse`
- **Called by**: scamper tactic, structural-deconstruction tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + context from calling tactic
2. Call `scamper_reverse({ idea, context })` via dare-agents
3. Return ScamperResult with inverted variants to calling tactic
