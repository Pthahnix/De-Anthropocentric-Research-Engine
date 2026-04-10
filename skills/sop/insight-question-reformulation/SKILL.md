---
name: Insight Question Reformulation
description: Reframe tensions as How Might We questions ranked by generative potential
type: sop
layer: sop
agent: dare-agents
tools: [insight_hmw]
input: tensions (string)
output: HmwResult — hmwQuestions[], rankedQuestions[], rankingRationale
---

# Insight Question Reformulation SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `insight_hmw`
- **Called by**: insight tactic only
- **Never calls**: other SOPs (leaf node)
- **Position**: Fourth step of INSIGHT pipeline (Step 4 of 7)

## Procedure
1. Receive `tensions` (JSON string from Step 3 TensionResult) from insight tactic
2. Call `insight_hmw({ tensions })` via dare-agents
3. Parse response into HmwResult
4. Return result to insight tactic for use in Step 5 (abstraction laddering)

## Output Schema
- `hmwQuestions[]` — full set of How Might We questions generated from each tension
- `rankedQuestions[]` — ordered subset selected for highest generative potential
- `rankingRationale` — explanation of why top questions were prioritized over others
