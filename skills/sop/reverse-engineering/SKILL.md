---
name: Reverse Engineering
description: Reverse brainstorm — how to make the problem WORSE, then invert
type: sop
layer: sop
agent: dare-agents
tools: [reverse_engineering]
input: problem (string), context (string)
output: ReverseEngineeringResult — worstIdeas[], variants[]
---

# Reverse Engineering SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `reverse_engineering`
- **Called by**: assumption-destruction tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive problem + context from calling tactic
2. Call `reverse_engineering({ problem, context })` via dare-agents
3. Return ReverseEngineeringResult with inverted ideas to calling tactic
