---
name: Surgery Unify
description: Merge fragmented components into a coherent whole
type: sop
layer: sop
agent: dare-agents
tools: [surgery_unify]
input: idea (Idea JSON), context (string)
output: SurgeryResult — variants[] with mutationType 'unify' + explanation
---

# Surgery Unify SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `surgery_unify`
- **Called by**: component-surgery tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + context from calling tactic
2. Call `surgery_unify({ idea, context })` via dare-agents
3. Return SurgeryResult with unified variants to calling tactic
