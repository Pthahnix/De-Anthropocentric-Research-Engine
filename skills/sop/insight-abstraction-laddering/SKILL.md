---
name: Insight Abstraction Laddering
description: Move up and down abstraction levels to find the most actionable problem framing
type: sop
layer: sop
agent: dare-agents
tools: [insight_abstraction]
input: hmwQuestions (string)
output: AbstractionResult — ladder[], insightFromLadder, reframedProblem
---

# Insight Abstraction Laddering SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `insight_abstraction`
- **Called by**: insight tactic only
- **Never calls**: other SOPs (leaf node)
- **Position**: Fifth step of INSIGHT pipeline (Step 5 of 7)

## Procedure
1. Receive `hmwQuestions` (JSON string from Step 4 HmwResult) from insight tactic
2. Call `insight_abstraction({ hmwQuestions })` via dare-agents
3. Parse response into AbstractionResult
4. Return result to insight tactic for use in Step 6 (assumption audit)

## Output Schema
- `ladder[]` — sequence of problem framings from most concrete to most abstract (or vice versa)
- `insightFromLadder` — the non-obvious observation revealed by traversing abstraction levels
- `reframedProblem` — the problem statement at the level of abstraction best suited for idea generation
