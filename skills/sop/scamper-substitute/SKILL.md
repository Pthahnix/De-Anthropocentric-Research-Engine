---
name: SCAMPER Substitute
description: Apply the Substitute lens — replace components with alternatives
type: sop
layer: sop
agent: dare-agents
tools: [scamper_substitute]
input: idea (Idea JSON), context (research context string)
output: ScamperResult — variants[] with mutationType 'substitute' + explanation
---

# SCAMPER Substitute SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `scamper_substitute`
- **Called by**: scamper tactic, structural-deconstruction tactic, idea-augmentation tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea (JSON) + context from calling tactic
2. Call `scamper_substitute({ idea, context })` via dare-agents
3. Return ScamperResult with variants to calling tactic
