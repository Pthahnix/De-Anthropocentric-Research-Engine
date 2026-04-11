---
name: SCAMPER Put Other Use
description: Apply the Put to Other Use lens — solve a different problem
type: sop
layer: sop
agent: dare-agents
tools: [scamper_put_other_use]
input: idea (Idea JSON), context (string)
output: ScamperResult — variants[] with mutationType 'put_other_use' + explanation
---

# SCAMPER Put Other Use SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `scamper_put_other_use`
- **Called by**: scamper tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + context from calling tactic
2. Call `scamper_put_other_use({ idea, context })` via dare-agents
3. Return ScamperResult with repurposed variants to calling tactic
