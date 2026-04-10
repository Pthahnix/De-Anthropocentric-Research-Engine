---
name: Insight Stakeholder Mapping
description: Identify all stakeholders affected by the root cause and surface underserved groups
type: sop
layer: sop
agent: dare-agents
tools: [insight_stakeholder]
input: gap (string), rootCauseOutput (string)
output: StakeholderResult — stakeholders[], underservedStakeholder, conflictingNeeds
---

# Insight Stakeholder Mapping SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `insight_stakeholder`
- **Called by**: insight tactic only
- **Never calls**: other SOPs (leaf node)
- **Position**: Second step of INSIGHT pipeline (Step 2 of 7)

## Procedure
1. Receive `gap` and `rootCauseOutput` (JSON string from Step 1) from insight tactic
2. Call `insight_stakeholder({ gap, rootCauseOutput })` via dare-agents
3. Parse response into StakeholderResult
4. Return result to insight tactic for use in Step 3 (tension mining)

## Output Schema
- `stakeholders[]` — all parties affected by or invested in the gap, with their goals and pain points
- `underservedStakeholder` — the stakeholder group most neglected by current solutions
- `conflictingNeeds` — description of where stakeholder goals are in tension with each other
