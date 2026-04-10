---
name: Debate Experiment Design
description: Full multiagent debate for validating an experiment design
type: sop
layer: sop
agent: dare-agents
tools: [debate_critic, debate_defender, debate_judge]
input: experimentDesign (JSON), context
output: DebateResult
---

# Debate Experiment Design SOP

## Layer Rules
- **Agent**: dare-agents MCP tools
- **Called by**: multiagent-debate tactic (P1) only

## Procedure
Same debate protocol as debate-gap SOP but with:
- `artifactType: 'experiment-design'`
- Phase 1 focus areas: `methodology`, `controls`, `metrics`, `reproducibility`
