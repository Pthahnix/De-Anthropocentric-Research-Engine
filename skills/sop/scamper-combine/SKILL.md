---
name: SCAMPER Combine
description: Apply the Combine lens — merge two ideas or methods
type: sop
layer: sop
agent: dare-agents
tools: [scamper_combine]
input: idea (Idea JSON), secondIdea (Idea JSON), context (string)
output: ScamperResult — variants[] with mutationType 'combine' + explanation
---

# SCAMPER Combine SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `scamper_combine`
- **Called by**: scamper tactic, idea-augmentation tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + secondIdea + context from calling tactic
2. Call `scamper_combine({ idea, secondIdea, context })` via dare-agents
3. Return ScamperResult with merged variants to calling tactic
