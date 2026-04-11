---
name: Insight
description: Deep insight extraction for a specific gap — runs INSIGHT pipeline until 6-gate validation passes
type: strategy
layer: strategy
calls: [insight]
input: gap (Gap JSON), evidence (string), knowledge (string)
output: ValidatedInsight — insight that passed 6-gate validation
---

# Insight Strategy

## Layer Rules
- **Layer**: strategy — orchestrates tactics
- **Called by**: gap-analysis strategy or /dare meta-strategy
- **Calls**: insight tactic
- **Never calls**: SOPs or tools directly

## When to Use
- A gap's root cause is unclear or ambiguous
- Stakeholder needs for closing the gap are not obvious
- The gap framing needs to be stress-tested before committing to investigation
- gap-analysis strategy requests deep validation of a specific candidate gap

## Procedure

```
STEP 1 — CALL INSIGHT TACTIC:
Call insight tactic with:
  - gap: the Gap JSON (description, candidate root cause if any, domain context)
  - evidence: accumulated evidence string from prior search/read steps
  - knowledge: current knowledge string

STEP 2 — HANDLE VERDICT:
  - PASS (6/6 gates passed):
    Return ValidatedInsight immediately
    revisionsAttempted = current count

  - REVISE (partial gate failure, correctable):
    Apply tactic's suggested revision to gap framing or evidence framing
    Increment revisionsAttempted
    If revisionsAttempted < 3: go to STEP 1 with refined inputs
    If revisionsAttempted >= 3: return FAIL with reason "max_revisions_exceeded"

  - FAIL (fundamental flaw, not correctable):
    Return immediately with FAIL verdict and reason
    No further revision attempts
```

## State Management
- `revisionsAttempted`: counter, starts at 0, increments on each REVISE cycle
- Inputs (`gap`, `evidence`, `knowledge`) may be refined between revision cycles based on tactic feedback
- Does not maintain papersRead or urlsVisited — those are managed by the calling gap-analysis strategy

## Completeness Probe — Insight

<HARD-GATE>
Before accepting an insight as PASS, verify:

**5 Whys depth:**
- [ ] Did the root-cause drilling reach a fundamental cause (not just a symptom)?
- [ ] Are there at least 3 levels of "why" in the chain?
- [ ] Does the root cause suggest a clear direction for solutions?

**Stakeholder coverage:**
- [ ] Were at least 3 different stakeholder perspectives considered?
  (e.g., researchers, practitioners, reviewers, end-users)
- [ ] Did stakeholder mapping reveal any surprising or non-obvious needs?

**Tension mining:**
- [ ] Were genuine opposing forces identified (not just restated problem)?
- [ ] Do the tensions explain WHY this gap persists despite being known?

**HMW quality:**
- [ ] Are the How Might We questions actionable (not too broad, not too narrow)?
- [ ] Do they suggest multiple possible solution directions?

If ANY checkbox fails → trigger one REVISE cycle with targeted instructions.
This probe runs BEFORE the existing verdict check, not after.
</HARD-GATE>

## Output
```json
{
  "insight": {
    "rootCause": "Deep root cause of the gap...",
    "stakeholderNeeds": ["need1", "need2"],
    "coreContradiction": "The fundamental tension or conflict...",
    "impliedSolution": "What closing this gap would require..."
  },
  "verdict": "PASS | FAIL",
  "revisionsAttempted": 1,
  "quality": "high | medium | low"
}
```
