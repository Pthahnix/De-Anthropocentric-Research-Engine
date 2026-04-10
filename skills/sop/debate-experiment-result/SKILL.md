---
name: Debate Experiment Result
description: Full multiagent debate for validating experiment results
type: sop
layer: sop
agent: dare-agents
tools: [debate_critic, debate_defender, debate_judge]
input: experimentResult (JSON), context
output: DebateResult
---

# Debate Experiment Result SOP

## Layer Rules
- **Agent**: dare-agents MCP tools
- **Called by**: multiagent-debate tactic (P1) only

## Procedure
Same debate protocol as debate-gap SOP but with:
- `artifactType: 'experiment-result'`
- Phase 1 focus areas: `validity`, `significance`, `reproducibility`, `interpretation`
