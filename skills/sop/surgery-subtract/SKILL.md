---
name: Surgery Subtract
description: Remove a component and analyze what remains
type: sop
layer: sop
agent: dare-agents
tools: [surgery_subtract]
input: idea (Idea JSON), context (string)
output: SurgeryResult — variants[] with mutationType 'subtract' + explanation
---

# Surgery Subtract SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `surgery_subtract`
- **Called by**: component-surgery tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + context from calling tactic
2. Call `surgery_subtract({ idea, context })` via dare-agents
3. Return SurgeryResult with subtracted variants to calling tactic
