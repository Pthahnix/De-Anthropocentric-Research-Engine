---
name: Structural Deconstruction
description: Orchestrates SCAMPER + Surgery + TRIZ + Morphological for complete structural analysis
type: tactic
layer: tactic
calls: [scamper, component-surgery, triz-contradiction, morphological-matrix]
input: idea (Idea JSON), context (string)
output: Idea[] variants from structural deconstruction methods
---

# Structural Deconstruction Tactic (Category 1)

## Procedure
1. Run **scamper tactic** on the idea → collect SCAMPER variants
2. Run **component-surgery tactic** on the idea → collect surgery variants
3. If conflicting metrics detected, run **triz-contradiction SOP** → collect TRIZ variants
4. If idea has multiple dimensions, run **morphological-matrix SOP** → collect matrix combinations
5. Aggregate all variants, deduplicate by similarity
6. Return Idea[] variants sorted by novelty estimate
