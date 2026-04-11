---
name: Facet Bisociation
description: Find creative connections between facets from different papers/domains (Koestler bisociation)
type: sop
layer: sop
agent: dare-agents
tools: [facet_bisociation]
input: facetA (Facet JSON), facetB (Facet JSON), context (string)
output: BisociationResult — connections[] + hybridIdeas[] + explanation
---

# Facet Bisociation SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `facet_bisociation`
- **Called by**: cross-domain-collision tactic, idea-generation tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive facetA + facetB + context from calling tactic
2. Call `facet_bisociation({ facetA, facetB, context })` via dare-agents
3. Return BisociationResult with hybrid ideas to calling tactic
