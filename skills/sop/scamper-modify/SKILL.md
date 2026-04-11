---
name: SCAMPER Modify
description: Apply the Modify lens — magnify or minify an aspect
type: sop
layer: sop
agent: dare-agents
tools: [scamper_modify]
input: idea (Idea JSON), context (string)
output: ScamperResult — variants[] with mutationType 'modify' + explanation
---

# SCAMPER Modify SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `scamper_modify`
- **Called by**: scamper tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + context from calling tactic
2. Call `scamper_modify({ idea, context })` via dare-agents
3. Return ScamperResult with modified variants to calling tactic
