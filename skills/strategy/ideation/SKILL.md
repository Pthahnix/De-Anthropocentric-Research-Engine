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

  STEP 5 — STOP CHECK:
  - Enough high-quality ideas? → STOP
  - No new ideas generated? → STOP
  - MAX_ITERATIONS hit? → STOP

END LOOP
```

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
