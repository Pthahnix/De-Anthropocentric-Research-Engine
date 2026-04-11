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
