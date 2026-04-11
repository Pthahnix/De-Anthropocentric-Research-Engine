---
name: Surgery Multiply
description: Duplicate a component into multiple variants
type: sop
layer: sop
agent: dare-agents
tools: [surgery_multiply]
input: idea (Idea JSON), context (string)
output: SurgeryResult — variants[] with mutationType 'multiply' + explanation
---

# Surgery Multiply SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `surgery_multiply`
- **Called by**: component-surgery tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + context from calling tactic
2. Call `surgery_multiply({ idea, context })` via dare-agents
3. Return SurgeryResult with multiplied variants to calling tactic
