---
name: Surgery Divide
description: Split into sub-problems for independent solution
type: sop
layer: sop
agent: dare-agents
tools: [surgery_divide]
input: idea (Idea JSON), context (string)
output: SurgeryResult — variants[] with mutationType 'divide' + explanation
---

# Surgery Divide SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `surgery_divide`
- **Called by**: component-surgery tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + context from calling tactic
2. Call `surgery_divide({ idea, context })` via dare-agents
3. Return SurgeryResult with divided variants to calling tactic
