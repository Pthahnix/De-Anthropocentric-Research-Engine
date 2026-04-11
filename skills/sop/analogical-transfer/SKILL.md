---
name: Analogical Transfer
description: Transfer a principle from a source domain to a target problem (Synectics)
type: sop
layer: sop
agent: dare-agents
tools: [analogical_transfer]
input: sourceDomain (string), targetProblem (string), context (string)
output: AnalogicalTransferResult — sourcePrinciple, abstractedPrinciple, variants[]
---

# Analogical Transfer SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `analogical_transfer`
- **Called by**: cross-domain-collision tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive sourceDomain + targetProblem + context from calling tactic
2. Call `analogical_transfer({ sourceDomain, targetProblem, context })` via dare-agents
3. Return AnalogicalTransferResult with transferred variants to calling tactic
