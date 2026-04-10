---
name: Review
description: Lightweight review with escalation — self-review-quick + optional QD filtering + debate escalation
type: tactic
layer: tactic
calls: [self-review-quick, quality-diversity-filtering, multiagent-debate]
input: artifacts (JSON[]), artifactType (string), context (string)
output: ReviewResult — per-artifact verdicts, filtered set if applicable
---

# Review Tactic

## Layer Rules
- **Layer**: tactic — orchestrates SOPs and other tactics, NEVER calls MCP tools directly
- **Called by**: round strategy, gap-analysis strategy, any strategy needing artifact validation
- **Calls**:
  - **self-review-quick SOP** (Phase 1, always) — fast single-call C/D/J
  - **quality-diversity-filtering SOP** (Phase 2, conditional) — MAP-Elites filtering when ideas > 3
  - **multiagent-debate tactic** (Phase 3, conditional) — full debate for low-confidence REVISE verdicts

## Procedure

### Phase 1: Quick Self-Review (all artifacts)

1. For each artifact in `artifacts`:
   - Call **self-review-quick SOP** with `{ artifact: JSON.stringify(artifact), artifactType, context }`
   - Receive `SelfReviewResult` — verdict (ACCEPT|REJECT|REVISE), confidence (0.0-1.0), reasoning
2. Partition results into three buckets:
   - `accepted[]` — verdict == ACCEPT
   - `rejected[]` — verdict == REJECT
   - `toRevise[]` — verdict == REVISE (carry confidence score)

### Phase 2: QD Filtering (conditional)

**Trigger**: `artifactType == "idea"` AND `accepted.length > 3`

3. Call **quality-diversity-filtering SOP** with `{ ideas: JSON.stringify(accepted), gaps: JSON.stringify(context.gaps) }`
4. Receive `QdFilterResult` — filteredIdeas[], removedCount, nicheMap, reasoning
5. Replace `accepted[]` with `filteredIdeas[]`
6. Move removed ideas to `rejected[]` with reason: "QD_FILTERED"

**Skip if**: artifactType is not "idea", or accepted count is 3 or fewer

### Phase 3: Debate Escalation (conditional)

**Trigger**: any artifact in `toRevise[]` with `confidence < 0.5`

7. For each low-confidence REVISE artifact (confidence < 0.5):
   - Call **multiagent-debate tactic** with `{ artifact, artifactType, context }`
   - Receive full `DebateResult` — verdict (ACCEPT|REJECT|REVISE|CONTINUE), confidence, debateTranscript
   - Re-route based on debate verdict:
     - ACCEPT → move to `accepted[]`
     - REJECT → move to `rejected[]`
     - REVISE → keep in `revised[]` with debate's revisionGuidance appended
     - CONTINUE → keep in `revised[]` with note that more data is needed

**High-confidence REVISE** (confidence >= 0.5): keep in `revised[]` without debate escalation — caller decides.

**Skip if**: no REVISE artifacts have confidence < 0.5

### Phase 4: Aggregate Results

8. Compile final ReviewResult from all four buckets
9. Return to caller

## Output JSON Structure

```json
{
  "artifactType": "gap | idea | experiment-design | experiment-result",
  "reviews": [
    {
      "artifact": { "...": "..." },
      "verdict": "ACCEPT | REJECT | REVISE",
      "confidence": 0.78,
      "reasoning": "...",
      "debateEscalated": false,
      "debateTranscript": null
    }
  ],
  "accepted": [{ "...": "..." }],
  "rejected": [
    { "artifact": { "...": "..." }, "reason": "SELF_REVIEW | QD_FILTERED | DEBATE_REJECTED" }
  ],
  "revised": [
    {
      "artifact": { "...": "..." },
      "revisionGuidance": "...",
      "source": "SELF_REVIEW | DEBATE"
    }
  ],
  "qdFilterApplied": false,
  "debateEscalationCount": 0
}
```

### Escalation Thresholds Summary
| Condition | Action |
|---|---|
| artifactType == idea AND accepted > 3 | QD filtering on accepted set |
| REVISE verdict AND confidence < 0.5 | Full debate escalation |
| REVISE verdict AND confidence >= 0.5 | Keep in revised[], no escalation |
| REJECT verdict (any confidence) | No escalation — reject stands |
