---
name: SCAMPER Adapt
description: Apply the Adapt lens — borrow techniques from another domain
type: sop
layer: sop
agent: dare-agents
tools: [scamper_adapt]
input: idea (Idea JSON), context (string)
output: ScamperResult — variants[] with mutationType 'adapt' + explanation
---

# SCAMPER Adapt SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `scamper_adapt`
- **Called by**: scamper tactic, structural-deconstruction tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + context from calling tactic
2. Call `scamper_adapt({ idea, context })` via dare-agents
3. Return ScamperResult with adapted variants to calling tactic
