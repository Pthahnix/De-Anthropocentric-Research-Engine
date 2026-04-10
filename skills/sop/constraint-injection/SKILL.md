---
name: Constraint Injection
description: Inject a random constraint and explore creative workarounds
type: sop
layer: sop
agent: dare-agents
tools: [constraint_injection]
input: idea (Idea JSON), constraint (string), context (string)
output: ConstraintInjectionResult — brokenParts[], workarounds[], variants[]
---

# Constraint Injection SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `constraint_injection`
- **Called by**: perspective-forcing tactic, idea-augmentation tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive idea + constraint + context from calling tactic
2. Call `constraint_injection({ idea, constraint, context })` via dare-agents
3. Return ConstraintInjectionResult with constraint-inspired variants to calling tactic
