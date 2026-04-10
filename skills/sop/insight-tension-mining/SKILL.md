---
name: Insight Tension Mining
description: Extract productive tensions between stakeholder needs that define the design space
type: sop
layer: sop
agent: dare-agents
tools: [insight_tension]
input: gap (string), stakeholderOutput (string)
output: TensionResult — tensions[], primaryTension, tensionInsight
---

# Insight Tension Mining SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `insight_tension`
- **Called by**: insight tactic only
- **Never calls**: other SOPs (leaf node)
- **Position**: Third step of INSIGHT pipeline (Step 3 of 7)

## Procedure
1. Receive `gap` and `stakeholderOutput` (JSON string from Step 2) from insight tactic
2. Call `insight_tension({ gap, stakeholderOutput })` via dare-agents
3. Parse response into TensionResult
4. Return result to insight tactic for use in Step 4 (question reformulation)

## Output Schema
- `tensions[]` — list of opposing forces or trade-offs revealed by stakeholder analysis
- `primaryTension` — the single most generative tension that best defines the design challenge
- `tensionInsight` — why this tension is productive: what novel solutions it implies
