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

## Minimum SOP Usage

<HARD-GATE>
**You MUST call at least 2 of the SOPs listed in your calls section.**
More SOPs = more diverse ideas = better MAP-Elites coverage.

Available SOPs: scamper, component-surgery, triz-contradiction, morphological-matrix

Calling only 1 SOP and moving on is a protocol violation. Each SOP attacks the problem
from a fundamentally different angle — skipping SOPs means missing entire idea families.
</HARD-GATE>

## Procedure
1. Run **scamper tactic** on the idea → collect SCAMPER variants
2. Run **component-surgery tactic** on the idea → collect surgery variants
3. If conflicting metrics detected, run **triz-contradiction SOP** → collect TRIZ variants
4. If idea has multiple dimensions, run **morphological-matrix SOP** → collect matrix combinations
5. Aggregate all variants, deduplicate by similarity
6. Return Idea[] variants sorted by novelty estimate

## Yield Report

<HARD-GATE>
### Yield Report: structural-deconstruction
| Metric | Count |
|--------|-------|
| SOPs called | ?? |
| SOP names | [list] |
| Ideas generated per SOP | ?? |
| Total ideas generated | ?? |
</HARD-GATE>
