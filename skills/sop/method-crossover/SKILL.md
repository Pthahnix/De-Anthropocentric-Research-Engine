---
name: Method Crossover
description: >
  Combine two research methods into a coherent hybrid. Preserves strengths
  of both parents via dare-agents method_evolve_crossover tool.
type: sop
layer: sop
agent: dare-agents
tool: method_evolve_crossover
input: |
  methodA: string (first parent method protocol)
  methodB: string (second parent method protocol)
  trackRecords: string (performance data for both methods)
  context: string (current research domain)
output: |
  CrossoverResult: { parentA: { name, strength, weakness }, parentB: { name, strength, weakness },
    fromA, fromB, integrationPoint, hybrid: { name, fullProtocol, expectedImprovement } }
---

# Method Crossover SOP

Single-responsibility: call dare-agents `method_evolve_crossover` tool and return the hybrid result.

## Layer Rule

- This SOP calls **one** dare-agents tool. It does NOT call other SOPs or tactics.
- Called by: `method-evolution` tactic.

## Procedure

1. Validate input: both methods must be non-empty, methods must be different
2. Call dare-agents `method_evolve_crossover` with { methodA, methodB, trackRecords, context }
3. Validate output: hybrid.name must be unique (not identical to either parent), fullProtocol must be non-empty
4. Return CrossoverResult
