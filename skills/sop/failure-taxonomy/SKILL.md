---
name: Failure Taxonomy
description: Categorize failure cases and generate targeted fix ideas
type: sop
layer: sop
agent: dare-agents
tools: [failure_taxonomy]
input: failureCases (JSON array), context (string)
output: FailureTaxonomyResult — taxonomy[], variants[]
---

# Failure Taxonomy SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `failure_taxonomy`
- **Called by**: systematic-enumeration tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive failureCases + context from calling tactic
2. Call `failure_taxonomy({ failureCases, context })` via dare-agents
3. Return FailureTaxonomyResult with failure-addressing ideas to calling tactic
