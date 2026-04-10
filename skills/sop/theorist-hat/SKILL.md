---
name: Theorist Hat
description: Formal theorist evaluates theoretical foundations and provable properties
type: sop
layer: sop
agent: dare-agents
tools: [theorist_hat]
input: idea (Idea JSON), context (string)
output: TheoristResult — theoreticalFramework, formalProperties[], formalizedVariants[]
---

# Theorist Hat SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `theorist_hat`
- **Called by**: perspective-forcing tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + context from calling tactic
2. Call `theorist_hat({ idea, context })` via dare-agents
3. Return TheoristResult with formal assessment to calling tactic
