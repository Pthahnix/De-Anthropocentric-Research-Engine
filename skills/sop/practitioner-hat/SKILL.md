---
name: Practitioner Hat
description: Industry engineer evaluates practicality and buildability
type: sop
layer: sop
agent: dare-agents
tools: [practitioner_hat]
input: idea (Idea JSON), context (string)
output: PractitionerResult — assessment, practicalVariants[], buildability
---

# Practitioner Hat SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `practitioner_hat`
- **Called by**: perspective-forcing tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + context from calling tactic
2. Call `practitioner_hat({ idea, context })` via dare-agents
3. Return PractitionerResult with engineering assessment to calling tactic
