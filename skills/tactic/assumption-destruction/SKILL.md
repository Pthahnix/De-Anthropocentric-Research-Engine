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

## Minimum SOP Usage

<HARD-GATE>
**You MUST call at least 2 of the SOPs listed in your calls section.**
More SOPs = more diverse ideas = better MAP-Elites coverage.

Available SOPs: axiom-negation, reverse-engineering, worst-method-analysis, anti-benchmark

Each SOP challenges assumptions from a different direction:
- axiom-negation: "What if this fundamental assumption is wrong?"
- reverse-engineering: "How would we make this problem WORSE?"
- worst-method-analysis: "What's the worst possible approach, and what does inverting it teach us?"
- anti-benchmark: "What's wrong with how we measure success?"

Calling only 1 is a protocol violation.
</HARD-GATE>

## Procedure
1. Extract assumptions from accumulated insight chain
2. For top 3 most questionable assumptions: **axiom-negation SOP** (de Bono PO)
3. **reverse-engineering SOP** on the main problem ("what would make it worse?")
4. **worst-method-analysis SOP** on the problem ("what's the worst approach?")
5. If benchmarks exist: **anti-benchmark SOP** ("why is this benchmark wrong?")
6. Aggregate and invert: worst ideas often contain the seed of best ideas

## Yield Report

<HARD-GATE>
### Yield Report: assumption-destruction
| Metric | Count |
|--------|-------|
| SOPs called | ?? |
| SOP names | [list] |
| Assumptions challenged | ?? |
| Ideas generated per SOP | ?? |
| Total ideas generated | ?? |
</HARD-GATE>
