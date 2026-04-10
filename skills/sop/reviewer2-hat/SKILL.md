---
name: Reviewer 2 Hat
description: Apply hostile reviewer perspective to find fatal flaws in an idea
type: sop
layer: sop
agent: dare-agents
tools: [reviewer2_hat]
input: idea (Idea JSON), context (string)
output: Reviewer2Result — critiques[], fatalFlaw, improvedVariants[]
---

# Reviewer 2 Hat SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `reviewer2_hat`
- **Called by**: perspective-forcing tactic, idea-augmentation tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + context from calling tactic
2. Call `reviewer2_hat({ idea, context })` via dare-agents
3. Return Reviewer2Result to calling tactic
