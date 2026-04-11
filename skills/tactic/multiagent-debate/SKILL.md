---
name: Multiagent Debate
description: Orchestrate the full C/D/J debate protocol for rigorous artifact validation
type: tactic
layer: tactic
calls: [debate-gap, debate-idea, debate-experiment-design, debate-experiment-result]
input: artifact (JSON), artifactType (gap|idea|experiment-design|experiment-result), context (string)
output: DebateResult — verdict, confidence, full debate transcript
---

# Multiagent Debate Tactic

## Layer Rules
- **Layer**: tactic — orchestrates SOPs, NEVER calls MCP tools directly
- **Called by**: review tactic, gap-analysis strategy, insight strategy
- **Calls**: exactly one of the 4 debate SOPs selected by `artifactType`
  - `gap` → debate-gap SOP
  - `idea` → debate-idea SOP
  - `experiment-design` → debate-experiment-design SOP
  - `experiment-result` → debate-experiment-result SOP
- **Never calls**: dare-agents tools directly (that is the SOP's responsibility)

## Minimum Debate Depth

<HARD-GATE>
**Minimum 2 rounds of Critic-Defender exchange before the Judge renders a verdict.**

A "round" is one full Critic → Defender cycle. The Judge may only be called after round 2+.

Round 1: Critic attacks → Defender responds
Round 2: Critic attacks on NEW weaknesses (not rehashing round 1) → Defender responds
Round 3+ (optional): Continue if Judge verdict is CONTINUE

Single-round debates produce shallow validation. The second round forces the Critic to find
deeper issues beyond surface-level objections, and the Defender to mount a more rigorous defense.

If the artifact is so strong that the Critic struggles in round 2 → that's signal, not waste.
</HARD-GATE>

## Procedure

### Single-Artifact Mode

1. Receive `artifact` (JSON), `artifactType`, and `context` from calling strategy/tactic
2. Select the debate SOP by `artifactType`:

```
artifactType == "gap"                 → debate-gap SOP
artifactType == "idea"                → debate-idea SOP
artifactType == "experiment-design"   → debate-experiment-design SOP
artifactType == "experiment-result"   → debate-experiment-result SOP
```

3. Dispatch to selected SOP with `{ artifact: JSON.stringify(artifact), context }`
4. Receive raw DebateResult from SOP
5. Return structured DebateResult to caller

### Dual-Artifact Comparison Mode

When called with `artifacts` (array of exactly 2 items) instead of a single `artifact`:

1. Receive `artifacts` (JSON[2]), `artifactType`, and `context`
2. Select SOP by `artifactType` (same mapping as above)
3. Dispatch to selected SOP with `{ artifactA: JSON.stringify(artifacts[0]), artifactB: JSON.stringify(artifacts[1]), context, mode: "comparison" }`
4. SOP runs the full C/D/J protocol framed as a head-to-head comparison
5. Return DebateResult with `comparisonVerdict` field indicating which artifact is superior (or TIED)

## SOP Dispatch Reference

| artifactType | SOP | dare-agents tools used by SOP |
|---|---|---|
| gap | debate-gap | debate_critic, debate_defender, debate_judge |
| idea | debate-idea | debate_critic, debate_defender, debate_judge |
| experiment-design | debate-experiment-design | debate_critic, debate_defender, debate_judge |
| experiment-result | debate-experiment-result | debate_critic, debate_defender, debate_judge |

## Output JSON Structure

```json
{
  "artifactType": "gap | idea | experiment-design | experiment-result",
  "verdict": "ACCEPT | REJECT | REVISE | CONTINUE",
  "confidence": 0.85,
  "debateTranscript": [
    { "role": "critic", "content": "..." },
    { "role": "defender", "content": "..." },
    { "role": "judge", "content": "..." }
  ],
  "judgeReasoning": "...",
  "keyFactors": ["factor1", "factor2", "factor3"],
  "revisionGuidance": "... (present only when verdict is REVISE)",
  "comparisonVerdict": "A_SUPERIOR | B_SUPERIOR | TIED (present only in dual-artifact mode)"
}
```

### Verdict Semantics
- **ACCEPT** — artifact is valid and ready to proceed to next pipeline stage
- **REJECT** — artifact has fundamental flaws; discard and regenerate
- **REVISE** — artifact has correctable issues; `revisionGuidance` specifies what to fix
- **CONTINUE** — for experiment-result only: results are partial, more data needed before verdict

## Yield Report

<HARD-GATE>
### Yield Report: multiagent-debate
| Metric | Count |
|--------|-------|
| Debate rounds completed | ?? |
| Critic objections raised | ?? |
| Defender rebuttals | ?? |
| Judge verdict | ACCEPT / REJECT / REVISE / CONTINUE |
| Artifacts debated | ?? |
</HARD-GATE>
