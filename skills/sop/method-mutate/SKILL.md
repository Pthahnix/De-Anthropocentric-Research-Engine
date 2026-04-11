---
name: Method Mutate
description: >
  Apply evolutionary mutation to a research method. Identifies weakest aspect
  and produces an improved variant via dare-agents method_evolve_mutate tool.
type: sop
layer: sop
agent: dare-agents
tool: method_evolve_mutate
input: |
  method: string (full method protocol in markdown)
  trackRecord: string (usage history and performance data)
  context: string (current research domain)
output: |
  MutationResult: { originalMethod, coreStrength, knownWeakness, aspectMutated,
    originalValue, mutatedValue, predictedEffect, mutatedMethod: { name, fullProtocol } }
---

# Method Mutate SOP

Single-responsibility: call dare-agents `method_evolve_mutate` tool and return the mutation result.

## Layer Rule

- This SOP calls **one** dare-agents tool. It does NOT call other SOPs or tactics.
- Called by: `method-evolution` tactic.

## Procedure

1. Validate input: method must be non-empty markdown, trackRecord must contain at least 1 usage entry
2. Call dare-agents `method_evolve_mutate` with { method, trackRecord, context }
3. Validate output: mutatedMethod.name must differ from originalMethod, fullProtocol must be non-empty
4. Return MutationResult
