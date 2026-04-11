---
name: Insight
description: Orchestrate the 7-step INSIGHT pipeline for deep gap analysis
type: tactic
layer: tactic
calls: [insight-root-cause-drilling, insight-stakeholder-mapping, insight-tension-mining,
  insight-question-reformulation, insight-abstraction-laddering, insight-assumption-audit,
  insight-validation]
input: gap (Gap JSON), evidence (string), knowledge (string)
output: ValidatedInsight — complete insight chain that passed 6-gate validation
---

# Insight Tactic

## Layer Rules
- **Layer**: tactic — orchestrates SOPs, NEVER calls MCP tools directly
- **Called by**: insight strategy, gap-analysis strategy
- **Calls**: insight-root-cause-drilling SOP → insight-stakeholder-mapping SOP → insight-tension-mining SOP → insight-question-reformulation SOP → insight-abstraction-laddering SOP → insight-assumption-audit SOP → insight-validation SOP
- **Max attempts**: 2 (initial run + 1 revision pass if REVISE)

## Step Completeness Gate

<HARD-GATE>
**All 7 steps MUST be executed sequentially. No step skipping.**

The 7 steps are:
1. root-cause-drilling (insight_root_cause)
2. stakeholder-mapping (insight_stakeholder)
3. tension-mining (insight_tension)
4. question-reformulation (insight_hmw)
5. abstraction-laddering (insight_abstraction)
6. assumption-audit (insight_assumption)
7. validation (insight_validation)

Each step's output is input to the next. Skipping a step produces garbage downstream.

If a step fails or produces low-quality output:
- Retry the specific step with refined input (up to 2 retries per step)
- Do NOT skip to the next step
- If a step fails 3 times, document the failure and proceed with best-effort output
</HARD-GATE>

## Procedure

### Step 1: Root Cause Drilling
1. Call **insight-root-cause-drilling SOP** with `{ gap, evidence, knowledge }`
2. Receive `RootCauseResult` — surfaceGap, whyChain[], rootCause, hiddenAssumptions[], unexploredAngles[]

### Step 2: Stakeholder Mapping
3. Call **insight-stakeholder-mapping SOP** with `{ gap, rootCauseOutput: JSON.stringify(step1) }`
4. Receive `StakeholderResult` — stakeholders[], underservedStakeholder, conflictingNeeds

### Step 3: Tension Mining
5. Call **insight-tension-mining SOP** with `{ gap, stakeholderOutput: JSON.stringify(step2) }`
6. Receive `TensionResult` — tensions[], primaryTension, tensionInsight

### Step 4: Question Reformulation
7. Call **insight-question-reformulation SOP** with `{ tensions: JSON.stringify(step3) }`
8. Receive `HmwResult` — hmwQuestions[], rankedQuestions[], rankingRationale

### Step 5: Abstraction Laddering
9. Call **insight-abstraction-laddering SOP** with `{ hmwQuestions: JSON.stringify(step4) }`
10. Receive `AbstractionResult` — ladder[], insightFromLadder, reframedProblem

### Step 6: Assumption Audit
11. Call **insight-assumption-audit SOP** with `{ insightSoFar: JSON.stringify({ step1, step2, step3, step4, step5 }) }`
12. Receive `AssumptionResult` — assumptions[], criticalAssumptions[], safeAssumptions[], recommendation

### Step 7: Validation Gate
13. Call **insight-validation SOP** with `{ fullInsight: JSON.stringify({ step1, step2, step3, step4, step5, step6 }) }`
14. Receive `ValidationResult` — gates[], overallVerdict (PASS|FAIL|REVISE), failedGates[], revisionGuidance?

## Validation Gate Logic

```
IF overallVerdict == PASS:
  → Return complete ValidatedInsight to caller

IF overallVerdict == REVISE AND attempt < 2:
  → Read revisionGuidance.fromStep (1-6)
  → Re-run pipeline from that step forward, carrying prior outputs for unchanged steps
  → Increment attempt counter
  → Go to Step 7 again

IF overallVerdict == REVISE AND attempt >= 2:
  → Report partial insight to caller with status: REVISE_EXHAUSTED
  → Include best available output and failedGates[] for caller to decide

IF overallVerdict == FAIL:
  → Report failure to caller with failedGates[] and reasoning
  → Do NOT return an insight — structural failure cannot be revised
```

### Revision Re-entry Points
- `fromStep: 1` — re-run all 7 steps
- `fromStep: 2` — re-run Steps 2-7, carry Step 1 output
- `fromStep: 3` — re-run Steps 3-7, carry Steps 1-2 outputs
- `fromStep: 4` — re-run Steps 4-7, carry Steps 1-3 outputs
- `fromStep: 5` — re-run Steps 5-7, carry Steps 1-4 outputs
- `fromStep: 6` — re-run Steps 6-7, carry Steps 1-5 outputs

## Output JSON Structure

```json
{
  "status": "PASS | REVISE_EXHAUSTED | FAIL",
  "gap": "<original gap input>",
  "insightChain": {
    "rootCause": {
      "surfaceGap": "...",
      "whyChain": ["why1", "why2", "why3", "why4", "why5"],
      "rootCause": "...",
      "hiddenAssumptions": ["..."],
      "unexploredAngles": ["..."]
    },
    "stakeholders": {
      "stakeholders": [{ "name": "...", "goals": "...", "painPoints": "..." }],
      "underservedStakeholder": "...",
      "conflictingNeeds": "..."
    },
    "tensions": {
      "tensions": ["..."],
      "primaryTension": "...",
      "tensionInsight": "..."
    },
    "hmwQuestions": {
      "hmwQuestions": ["..."],
      "rankedQuestions": ["..."],
      "rankingRationale": "..."
    },
    "abstraction": {
      "ladder": ["..."],
      "insightFromLadder": "...",
      "reframedProblem": "..."
    },
    "assumptions": {
      "assumptions": ["..."],
      "criticalAssumptions": ["..."],
      "safeAssumptions": ["..."],
      "recommendation": "..."
    }
  },
  "validation": {
    "gates": [{ "name": "...", "status": "PASS|FAIL", "rationale": "..." }],
    "overallVerdict": "PASS",
    "failedGates": []
  },
  "attempts": 1
}
```

## Yield Report

<HARD-GATE>
### Yield Report: insight
| Metric | Count |
|--------|-------|
| Steps completed | ?? / 7 |
| Steps skipped | ?? (should be 0) |
| Steps retried | ?? |
| Validation verdict | PASS / REVISE / FAIL |
| Root causes identified | ?? |
| Stakeholders mapped | ?? |
| Tensions found | ?? |
| HMW questions generated | ?? |
</HARD-GATE>
