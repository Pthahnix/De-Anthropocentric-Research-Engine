---
name: SCAMPER Eliminate
description: Apply the Eliminate lens — remove while keeping the core
type: sop
layer: sop
agent: dare-agents
tools: [scamper_eliminate]
input: idea (Idea JSON), context (string)
output: ScamperResult — variants[] with mutationType 'eliminate' + explanation
---

# SCAMPER Eliminate SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `scamper_eliminate`
- **Called by**: scamper tactic, structural-deconstruction tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + context from calling tactic
2. Call `scamper_eliminate({ idea, context })` via dare-agents
3. Return ScamperResult with simplified variants to calling tactic
