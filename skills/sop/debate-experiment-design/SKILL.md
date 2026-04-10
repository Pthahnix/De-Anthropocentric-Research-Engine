---
name: Debate Experiment Design
description: Full multiagent debate for validating an experiment design
type: sop
layer: sop
agent: dare-agents
tools: [debate_critic, debate_defender, debate_judge]
input: experimentDesign (JSON), context (accumulated knowledge)
output: DebateResult — verdict + full debate transcript
---

# Debate Experiment Design SOP

## Layer Rules
- **Agent**: dare-agents MCP tools `debate_critic`, `debate_defender`, `debate_judge`
- **Called by**: multiagent-debate tactic (P1) only
- **Orchestration**: CC sequences the C→D→J calls per the debate protocol (spec §10)

## Procedure — Full Debate Protocol (spec §10, Mode B)

### Phase 1: Structured Rounds (8 dare-agents calls)
1. **C1** (methodology): `debate_critic({ artifact: experimentDesign, artifactType: 'experiment-design', focusArea: 'methodology', context })`
2. **D1** (methodology): `debate_defender({ artifact: experimentDesign, artifactType: 'experiment-design', criticOutput: C1, context })`
3. **C2** (controls): `debate_critic({ artifact: experimentDesign, artifactType: 'experiment-design', focusArea: 'controls', context })`
4. **D2** (controls): `debate_defender({ artifact: experimentDesign, artifactType: 'experiment-design', criticOutput: C2, context })`
5. **C3** (metrics): `debate_critic({ artifact: experimentDesign, artifactType: 'experiment-design', focusArea: 'metrics', context })`
6. **D3** (metrics): `debate_defender({ artifact: experimentDesign, artifactType: 'experiment-design', criticOutput: C3, context })`
7. **C4** (reproducibility): `debate_critic({ artifact: experimentDesign, artifactType: 'experiment-design', focusArea: 'reproducibility', context })`
8. **D4** (reproducibility): `debate_defender({ artifact: experimentDesign, artifactType: 'experiment-design', criticOutput: C4, context })`

### Phase 2: Judge Assessment
9. Concatenate all C1-D4 outputs into `debateHistory`
10. `debate_judge({ artifact: experimentDesign, artifactType: 'experiment-design', criticOutput: allCritiques, defenderOutput: allDefenses, debateHistory })`

### Phase 3: Free Debate (if Judge says CONTINUE, max 3 extra rounds)
11. Additional C→D→J rounds until Judge returns ACCEPT/REJECT/REVISE

### Phase 4: Final Ruling
12. Return final Judge verdict + full debate transcript to calling tactic
