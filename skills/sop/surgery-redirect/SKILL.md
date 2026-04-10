---
name: Surgery Redirect
description: Repurpose a component to serve a different function
type: sop
layer: sop
agent: dare-agents
tools: [surgery_redirect]
input: idea (Idea JSON), context (string)
output: SurgeryResult — variants[] with mutationType 'redirect' + explanation
---

# Surgery Redirect SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `surgery_redirect`
- **Called by**: component-surgery tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + context from calling tactic
2. Call `surgery_redirect({ idea, context })` via dare-agents
3. Return SurgeryResult with redirected variants to calling tactic
