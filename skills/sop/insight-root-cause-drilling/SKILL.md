---
name: Insight Root Cause Drilling
description: Drill from surface gap to structural root cause via 5-why chain analysis
type: sop
layer: sop
agent: dare-agents
tools: [insight_root_cause]
input: gap (string), evidence (string), knowledge (string)
output: RootCauseResult — surfaceGap, whyChain[], rootCause, hiddenAssumptions[], unexploredAngles[]
---

# Insight Root Cause Drilling SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `insight_root_cause`
- **Called by**: insight tactic only
- **Never calls**: other SOPs (leaf node)
- **Position**: First step of INSIGHT pipeline (Step 1 of 7)

## Procedure
1. Receive `gap`, `evidence`, and `knowledge` from insight tactic
2. Call `insight_root_cause({ gap, evidence, knowledge })` via dare-agents
3. Parse response into RootCauseResult
4. Return result to insight tactic for use in Step 2 (stakeholder mapping)

## Output Schema
- `surfaceGap` — restatement of the gap as observed at surface level
- `whyChain[]` — ordered list of why-because steps drilling from surface to root
- `rootCause` — structural or systemic cause underlying the surface gap
- `hiddenAssumptions[]` — assumptions baked into current framing that may be wrong
- `unexploredAngles[]` — alternative directions not yet considered in the gap framing
