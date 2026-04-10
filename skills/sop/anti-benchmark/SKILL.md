---
name: Anti-Benchmark
description: Challenge a benchmark's fundamental assumptions
type: sop
layer: sop
agent: dare-agents
tools: [anti_benchmark]
input: benchmark (string), context (string)
output: AntiBenchmarkResult — challengedAssumptions[], variants[], proposedAlternative
---

# Anti-Benchmark SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `anti_benchmark`
- **Called by**: assumption-destruction tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive benchmark + context from calling tactic
2. Call `anti_benchmark({ benchmark, context })` via dare-agents
3. Return AntiBenchmarkResult with benchmark critique to calling tactic
