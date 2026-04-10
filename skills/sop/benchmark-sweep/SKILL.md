---
name: Benchmark Sweep
description: Systematic benchmark analysis to find cross-benchmark improvements
type: sop
layer: sop
agent: dare-agents
tools: [benchmark_sweep]
input: benchmarks (JSON array), context (string)
output: BenchmarkSweepResult — benchmarkAnalysis[], crossBenchmarkIdeas[]
---

# Benchmark Sweep SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `benchmark_sweep`
- **Called by**: systematic-enumeration tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive benchmarks + context from calling tactic
2. Call `benchmark_sweep({ benchmarks, context })` via dare-agents
3. Return BenchmarkSweepResult with cross-benchmark ideas to calling tactic
