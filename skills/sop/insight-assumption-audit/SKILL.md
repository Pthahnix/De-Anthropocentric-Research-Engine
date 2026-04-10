---
name: Insight Assumption Audit
description: Surface and classify assumptions embedded in the accumulated insight, separating critical from safe
type: sop
layer: sop
agent: dare-agents
tools: [insight_assumption]
input: insightSoFar (string, JSON of steps 1-5 outputs)
output: AssumptionResult — assumptions[], criticalAssumptions[], safeAssumptions[], recommendation
---

# Insight Assumption Audit SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `insight_assumption`
- **Called by**: insight tactic only
- **Never calls**: other SOPs (leaf node)
- **Position**: Sixth step of INSIGHT pipeline (Step 6 of 7)

## Procedure
1. Receive `insightSoFar` (JSON string aggregating outputs from Steps 1-5) from insight tactic
2. Call `insight_assumption({ insightSoFar })` via dare-agents
3. Parse response into AssumptionResult
4. Return result to insight tactic for use in Step 7 (validation)

## Output Schema
- `assumptions[]` — full inventory of assumptions embedded in the insight chain so far
- `criticalAssumptions[]` — assumptions whose failure would invalidate the core insight
- `safeAssumptions[]` — assumptions well-supported by evidence or widely accepted in the field
- `recommendation` — guidance on which critical assumptions must be tested before acting on insight
