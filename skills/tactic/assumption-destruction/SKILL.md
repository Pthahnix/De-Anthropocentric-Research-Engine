---
name: Assumption Destruction
description: Orchestrates 4 Cat.3 SOPs for challenging assumptions
type: tactic
layer: tactic
calls: [axiom-negation, reverse-engineering, worst-method-analysis, anti-benchmark]
input: assumptions[], problem, benchmarks[]
output: Idea[] from assumption negation
---

# Assumption Destruction Tactic (Category 3)

## Procedure
1. Extract assumptions from accumulated insight chain
2. For top 3 most questionable assumptions: **axiom-negation SOP** (de Bono PO)
3. **reverse-engineering SOP** on the main problem ("what would make it worse?")
4. **worst-method-analysis SOP** on the problem ("what's the worst approach?")
5. If benchmarks exist: **anti-benchmark SOP** ("why is this benchmark wrong?")
6. Aggregate and invert: worst ideas often contain the seed of best ideas
