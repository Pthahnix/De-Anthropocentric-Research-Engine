---
name: Debate Idea
description: Full multiagent debate for validating a research idea
type: sop
layer: sop
agent: dare-agents
tools: [debate_critic, debate_defender, debate_judge]
input: idea (Idea JSON), context (accumulated knowledge)
output: DebateResult — verdict + full debate transcript
---

# Debate Idea SOP

## Layer Rules
- **Agent**: dare-agents MCP tools `debate_critic`, `debate_defender`, `debate_judge`
- **Called by**: multiagent-debate tactic (P1) only

## Procedure
Same as debate-gap SOP but with:
- `artifactType: 'idea'`
- Phase 1 focus areas: `novelty`, `feasibility`, `evidence`, `impact`
- See debate-gap SOP for full protocol (spec §10, Mode B)
