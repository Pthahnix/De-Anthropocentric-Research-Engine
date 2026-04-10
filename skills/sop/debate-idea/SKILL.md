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
- **Orchestration**: CC sequences the C→D→J calls per the debate protocol (spec §10)

## Procedure — Full Debate Protocol (spec §10, Mode B)

### Phase 1: Structured Rounds (8 dare-agents calls)
1. **C1** (novelty): `debate_critic({ artifact: idea, artifactType: 'idea', focusArea: 'novelty', context })`
2. **D1** (novelty): `debate_defender({ artifact: idea, artifactType: 'idea', criticOutput: C1, context })`
3. **C2** (feasibility): `debate_critic({ artifact: idea, artifactType: 'idea', focusArea: 'feasibility', context })`
4. **D2** (feasibility): `debate_defender({ artifact: idea, artifactType: 'idea', criticOutput: C2, context })`
5. **C3** (evidence): `debate_critic({ artifact: idea, artifactType: 'idea', focusArea: 'evidence', context })`
6. **D3** (evidence): `debate_defender({ artifact: idea, artifactType: 'idea', criticOutput: C3, context })`
7. **C4** (impact): `debate_critic({ artifact: idea, artifactType: 'idea', focusArea: 'impact', context })`
8. **D4** (impact): `debate_defender({ artifact: idea, artifactType: 'idea', criticOutput: C4, context })`

### Phase 2: Judge Assessment
9. Concatenate all C1-D4 outputs into `debateHistory`
10. `debate_judge({ artifact: idea, artifactType: 'idea', criticOutput: allCritiques, defenderOutput: allDefenses, debateHistory })`

### Phase 3: Free Debate (if Judge says CONTINUE, max 3 extra rounds)
11. Additional C→D→J rounds until Judge returns ACCEPT/REJECT/REVISE

### Phase 4: Final Ruling
12. Return final Judge verdict + full debate transcript to calling tactic
