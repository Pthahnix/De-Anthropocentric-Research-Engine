---
name: Forced Bridge
description: Force connections between two unrelated techniques
type: sop
layer: sop
agent: dare-agents
tools: [forced_bridge]
input: techniqueA (string), techniqueB (string), context (string)
output: ForcedBridgeResult — bridges[], variants[]
---

# Forced Bridge SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `forced_bridge`
- **Called by**: cross-domain-collision tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive techniqueA + techniqueB + context from calling tactic
2. Call `forced_bridge({ techniqueA, techniqueB, context })` via dare-agents
3. Return ForcedBridgeResult with bridged ideas to calling tactic
