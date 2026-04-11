---
name: Ablation Brainstorm
description: Decompose SOTA into components and brainstorm ablation-inspired ideas
type: sop
layer: sop
agent: dare-agents
tools: [ablation_brainstorm]
input: sotaComponents (JSON array), context (string)
output: AblationBrainstormResult — sotaDecomposition[], variants[]
---

# Ablation Brainstorm SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `ablation_brainstorm`
- **Called by**: systematic-enumeration tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive sotaComponents + context from calling tactic
2. Call `ablation_brainstorm({ sotaComponents, context })` via dare-agents
3. Return AblationBrainstormResult with ablation-inspired variants to calling tactic
