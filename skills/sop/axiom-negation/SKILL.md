---
name: Axiom Negation
description: de Bono PO provocation — negate a fundamental assumption
type: sop
layer: sop
agent: dare-agents
tools: [axiom_negation]
input: assumption (string), context (string)
output: AxiomNegationResult — provocation, consequences[], variants[]
---

# Axiom Negation SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `axiom_negation`
- **Called by**: assumption-destruction tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive assumption + context from calling tactic
2. Call `axiom_negation({ assumption, context })` via dare-agents
3. Return AxiomNegationResult with provocation variants to calling tactic
