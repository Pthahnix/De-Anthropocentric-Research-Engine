---
name: Idea Generation
description: Large-scale idea production using all category tactics + bisociation + insight
type: tactic
layer: tactic
calls: [structural-deconstruction, cross-domain-collision, assumption-destruction,
  perspective-forcing, systematic-enumeration, facet-bisociation]
input: gaps[], facets[], knowledge, context
output: Idea[] — diverse set from multiple creative methods
---

# Idea Generation Tactic

## Minimum Method Diversity

<HARD-GATE>
**You MUST use at least 3 different creative methods from at least 3 different categories.**
Single-method runs are protocol violations. The 5 categories are:

1. structural-deconstruction (scamper, component-surgery, triz, morphological)
2. cross-domain-collision (facet-bisociation, analogical-transfer, random-paper-entry, forced-bridge)
3. assumption-destruction (axiom-negation, reverse-engineering, worst-method, anti-benchmark)
4. perspective-forcing (reviewer2-hat, practitioner-hat, theorist-hat, constraint-injection, time-machine)
5. systematic-enumeration (benchmark-sweep, method-problem-matrix, ablation-brainstorm, failure-taxonomy)

**Enforcement:** Before proceeding to Phase 2 (cross-pollination), verify that at least 3 of the 5
category tactics were called. If fewer than 3 → call the missing categories NOW before proceeding.

More categories = more diverse ideas = better MAP-Elites coverage.
Ideally, use ALL 5 categories for Medium and Large topics.
</HARD-GATE>

## Procedure
1. **Phase 1 — Divergence**: Run all 5 category tactics in parallel (AI selects 2-3 most promising)
   - structural-deconstruction tactic
   - cross-domain-collision tactic
   - assumption-destruction tactic
   - perspective-forcing tactic
   - systematic-enumeration tactic

2. **Phase 2 — Cross-pollination**: Take top ideas from Phase 1 and run:
   - facet-bisociation between ideas from different categories
   - scamper-combine on complementary ideas

3. **Phase 3 — Convergence**: Collect all ideas, deduplicate, return full set
   (QD filtering happens at the review tactic level, not here)

## Yield Report

<HARD-GATE>
### Yield Report: idea-generation
| Metric | Count |
|--------|-------|
| Creative methods used | ?? |
| Categories covered (out of 5) | ?? |
| Ideas generated (pre-filter) | ?? |
| Ideas after cross-pollination | ?? |
| Ideas after convergence | ?? |
| Category tactics called | [list names] |
</HARD-GATE>
