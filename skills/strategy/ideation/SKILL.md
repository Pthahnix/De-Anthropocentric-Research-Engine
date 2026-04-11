---
name: Ideation
description: Full idea lifecycle — generate diverse ideas, augment, filter, validate
type: strategy
layer: strategy
calls: [idea-generation, idea-augmentation, review, multiagent-debate, quality-diversity-filtering]
input: gaps (Gap[]), facets (Facet[]), knowledge (string), context (string)
output: Idea[] — ranked, filtered, validated ideas
maxIterations: 5 (cold) / 2 (hot)
target: 3-5 high-quality diverse ideas
---

# Ideation Strategy

## Layer Rules
- **Layer**: strategy — orchestrates tactics
- **Called by**: round strategy, /dare meta-strategy
- **Calls**: idea-generation tactic, idea-augmentation tactic, review tactic, quality-diversity-filtering SOP

## Research Budget — Ideation

Ideation carries ~15% of the paper budget, focused on CROSS-DOMAIN discovery.
The in-domain knowledge base was built by lit-survey; ideation's job is to bring OUTSIDE perspectives.

| Metric | Small | Medium | Large |
|--------|-------|--------|-------|
| Cross-domain papers read | 5 | 15 | 25+ |
| Cross-domain web pages | 5 | 15 | 30+ |
| Unrelated domains searched | 3 | 4 | 6+ |
| Creative methods used | 3 | 5 | 5 |
| Ideas generated (pre-filter) | 10 | 20 | 30+ |
| Iteration rounds | 3 | 5 | 7+ |

Read the `topicSize` from state to select the correct column.
These are HARD FLOORS.

## STEP 0: Cross-Domain Discovery (MANDATORY)

<HARD-GATE>
Before ANY ideation method runs, you MUST complete the Cross-Domain Discovery phase.
This is the foundation for facet-bisociation, analogical-transfer, and forced-bridge SOPs.
Skipping this step is a protocol violation.

### Procedure:

1. **Identify underlying mechanisms** from validated gaps:
   - For each gap, extract the abstract mechanism it involves
   - Examples: "evolutionary optimization", "adversarial validation", "hierarchical decomposition",
     "information bottleneck", "multi-scale representation"
   - Aim for 3-5 distinct mechanisms

2. **Search at least 3 UNRELATED domains** for each mechanism:
   - Domains MUST be genuinely unrelated to the research topic
   - Good domains: biology, physics, economics, game theory, military strategy,
     music theory, architecture, ecology, linguistics, materials science,
     social network analysis, epidemiology, supply chain, sports analytics
   - BAD: searching the same ML/AI domain with slightly different keywords

3. **Use academic-research + web-research tactics** with cross-domain queries:
   - Query pattern: "[mechanism] in [unrelated domain]"
   - Examples: "evolutionary optimization in protein folding",
     "adversarial validation in economics game theory",
     "hierarchical decomposition in military strategy"

4. **Minimum yield:** 15 cross-domain papers/pages fetched and read
   - At least 5 must be actual academic papers (not just blog posts)
   - Papers must come from at least 3 different domains

5. **Extract facets** from cross-domain papers:
   - Use the facet-extraction SOP on each promising cross-domain paper
   - These facets become INPUT to the cross-domain-collision tactic in Phase 1
   - Store extracted facets in state for downstream use

### Cross-Domain Discovery State Ledger:

| Metric | Current | Target | Remaining |
|--------|---------|--------|-----------|
| Mechanisms identified | ?? | 3-5 | ?? |
| Domains searched | ?? | 3+ | ?? |
| Cross-domain papers read | ?? | [from budget] | ?? |
| Cross-domain web pages | ?? | [from budget] | ?? |
| Facets extracted | ?? | 5+ | ?? |

Do NOT proceed to Phase 1 until this ledger shows all targets met.
</HARD-GATE>

## State Ledger — Ideation

<HARD-GATE>
Print this table BEFORE EVERY iteration of the ideation loop. Update after each tactic Yield Report.

| Metric | Current | Target | Remaining | Status |
|--------|---------|--------|-----------|--------|
| Cross-domain papers read | ?? | [from budget] | ?? | ... |
| Cross-domain web pages | ?? | [from budget] | ?? | ... |
| Domains searched | ?? | [from budget] | ?? | ... |
| Creative methods used | ?? | [from budget] | ?? | ... |
| Ideas generated (pre-filter) | ?? | [from budget] | ?? | ... |
| Ideas surviving QD filter | ?? | 3+ | ?? | ... |
| Iterations done | ?? | [from budget] | ?? | ... |
</HARD-GATE>

## Procedure — Iterative Loop

```
WHILE (quality_ideas < TARGET AND iteration < MAX_ITERATIONS):

  STEP 1 — GENERATE:
  Call idea-generation tactic with { gaps, facets, knowledge, context }
  Collect diverse idea set from multiple creative methods

  STEP 2 — AUGMENT:
  Call idea-augmentation tactic on top ideas from Step 1
  Improve ideas based on reviewer2 feedback + SCAMPER mutations

  STEP 3 — FILTER:
  Call quality-diversity-filtering SOP on all ideas
  Keep MAP-Elites archive: best idea per niche

  STEP 4 — VALIDATE:
  Call review tactic on filtered ideas (self-review-quick + optional debate escalation)
  Accepted ideas enter final set
  Revised ideas go back to augmentation in next iteration

  STEP 5 — BUDGET GATE:
  [See Budget Gate — Ideation below]

  STEP 6 — STOP CHECK:
  - Enough high-quality ideas? → STOP
  - No new ideas generated? → STOP
  - MAX_ITERATIONS hit? → STOP

END LOOP
```

## Budget Gate — Ideation

<HARD-GATE>
Before evaluating any stop condition, check:

1. Cross-domain papers read >= 80% of target?
2. Creative methods used >= minimum from budget table?
3. Unrelated domains searched >= minimum?
4. Ideas generated >= 80% of target?

If ANY condition fails → CONTINUE iterating.
</HARD-GATE>

## Completeness Probe — Ideation

<HARD-GATE>
After Budget Gate passes and stop check says "stop," answer honestly:

**5 creative categories:**
- [ ] Did I use tactics from at least 3 of the 5 ideation categories?
  (structural-deconstruction, cross-domain-collision, assumption-destruction,
   perspective-forcing, systematic-enumeration)
- [ ] For each category used, did the tactic call at least 2 SOPs?

**Cross-domain collision:**
- [ ] Did I actually run the cross-domain-collision tactic with the facets from STEP 0?
- [ ] Were the collision inputs from genuinely unrelated domains (not just adjacent sub-fields)?

**Perspective forcing:**
- [ ] Did I consider at least 3 perspectives (practitioner, theorist, reviewer)?
- [ ] Is there a perspective I haven't tried that might yield surprising ideas?

**Idea diversity:**
- [ ] Do my ideas come from at least 3 different creative methods?
- [ ] Are my ideas genuinely diverse (not variations of the same core concept)?
- [ ] Did the QD filter confirm good niche coverage?

If ANY checkbox fails → add 1-3 targeted creative method calls and run ONE MORE iteration.
Maximum 2 extra completeness iterations.
</HARD-GATE>

## State Management
- `ideaArchive`: MAP-Elites grid, grows across iterations
- Niche dimensions: gap addressed × method category × novelty level

## Output
```json
{
  "ideas": [
    { "idea": {...}, "quality": {...}, "niche": "...", "debateVerdict": "ACCEPT" }
  ],
  "iterationsUsed": 3,
  "methodsUsed": ["scamper_substitute", "facet_bisociation", "reviewer2_hat"],
  "stopReason": "target_reached"
}
```
