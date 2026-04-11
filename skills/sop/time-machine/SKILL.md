---
name: Time Machine
description: Project an idea forward or backward in time
type: sop
layer: sop
agent: dare-agents
tools: [time_machine]
input: idea (Idea JSON), direction ('future'|'past'), years (number), context (string)
output: TimeMachineResult — projectedChanges[], variants[], mostFragileAssumption
---

# Time Machine SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `time_machine`
- **Called by**: perspective-forcing tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + direction + years + context from calling tactic
2. Call `time_machine({ idea, direction, years, context })` via dare-agents
3. Return TimeMachineResult with temporal variants to calling tactic
