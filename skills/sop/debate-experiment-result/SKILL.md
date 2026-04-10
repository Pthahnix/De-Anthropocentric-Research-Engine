---
name: Debate Experiment Result
description: Full multiagent debate for validating experiment results
type: sop
layer: sop
agent: dare-agents
tools: [debate_critic, debate_defender, debate_judge]
input: experimentResult (JSON), context (accumulated knowledge)
output: DebateResult — verdict + full debate transcript
---

# Debate Experiment Result SOP

## Layer Rules
- **Agent**: dare-agents MCP tools `debate_critic`, `debate_defender`, `debate_judge`
- **Called by**: multiagent-debate tactic (P1) only
- **Orchestration**: CC sequences the C→D→J calls per the debate protocol (spec §10)

## Procedure — Full Debate Protocol (spec §10, Mode B)

### Phase 1: Structured Rounds (8 dare-agents calls)
1. **C1** (validity): `debate_critic({ artifact: experimentResult, artifactType: 'experiment-result', focusArea: 'validity', context })`
2. **D1** (validity): `debate_defender({ artifact: experimentResult, artifactType: 'experiment-result', criticOutput: C1, context })`
3. **C2** (significance): `debate_critic({ artifact: experimentResult, artifactType: 'experiment-result', focusArea: 'significance', context })`
4. **D2** (significance): `debate_defender({ artifact: experimentResult, artifactType: 'experiment-result', criticOutput: C2, context })`
5. **C3** (reproducibility): `debate_critic({ artifact: experimentResult, artifactType: 'experiment-result', focusArea: 'reproducibility', context })`
6. **D3** (reproducibility): `debate_defender({ artifact: experimentResult, artifactType: 'experiment-result', criticOutput: C3, context })`
7. **C4** (interpretation): `debate_critic({ artifact: experimentResult, artifactType: 'experiment-result', focusArea: 'interpretation', context })`
8. **D4** (interpretation): `debate_defender({ artifact: experimentResult, artifactType: 'experiment-result', criticOutput: C4, context })`

### Phase 2: Judge Assessment
9. Concatenate all C1-D4 outputs into `debateHistory`
10. `debate_judge({ artifact: experimentResult, artifactType: 'experiment-result', criticOutput: allCritiques, defenderOutput: allDefenses, debateHistory })`

### Phase 3: Free Debate (if Judge says CONTINUE, max 3 extra rounds)
11. Additional C→D→J rounds until Judge returns ACCEPT/REJECT/REVISE

### Phase 4: Final Ruling
12. Return final Judge verdict + full debate transcript to calling tactic
