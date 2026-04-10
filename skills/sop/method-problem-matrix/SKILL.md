---
name: Method-Problem Matrix
description: Enumerate method x problem combinations to find unexplored cells
type: sop
layer: sop
agent: dare-agents
tools: [method_problem_matrix]
input: methods (JSON array), problems (JSON array), context (string)
output: MethodProblemMatrixResult — matrix[], unexploredOpportunities[]
---

# Method-Problem Matrix SOP

## Layer Rules
- **Agent**: dare-agents MCP tool `method_problem_matrix`
- **Called by**: systematic-enumeration tactic
- **Never calls**: other SOPs (leaf node)

## Procedure
1. Receive methods + problems + context from calling tactic
2. Call `method_problem_matrix({ methods, problems, context })` via dare-agents
3. Return MethodProblemMatrixResult with unexplored opportunities to calling tactic
