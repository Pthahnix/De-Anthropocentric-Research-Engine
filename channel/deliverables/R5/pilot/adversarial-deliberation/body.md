# adversarial-deliberation

## Purpose

Construct, attack, and adjudicate competing claims with explicit reasons, evidence, uncertainty, and confidence calibration.

## When to use / not applicable

Use when a claim needs a truth-seeking challenge or competing interpretations require adjudication. Not applicable for simple brainstorming with no claim or verdict criteria.

## Input contract (speculative branch C)

```yaml
required: [claim_or_artifact, attack_criteria]
optional: [evidence, assumptions, competing_positions, confidence_scale]
constraints: [critique must target explicit claim dimensions]
```

## Execution protocol

1. State claim, scope, assumptions, and verdict criteria.
2. Generate strongest defense and strongest critique; expose threat surface and counterexamples.
3. Cross-examine disagreements; separate evidence conflict from reasoning conflict.
4. Adjudicate with uncertainty and update confidence; retain minority/resurrection arguments when evidence warrants.

## Mode branches

- `critic-defender-judge`: role topology as a reasoning mode; agent spawning stays runtime.
- `structured-red-team`: threat-surface → attack vector → probe → finding aggregation.
- `dialectical-escalation`: escalate only when unresolved contradiction survives the prior round.
- `steelman`: reconstruct the strongest version before critique.

## Output contract

```yaml
produces: [defense, critique, attack_findings, adjudicated_verdict, confidence_update, unresolved_disagreements]
delta_fields: [findings, evidence_updates, uncertainties, decisions, open_questions, recommended_jumps]
```

## Thresholds and quality gates

- Every verdict cites the attacked claim dimension and supporting evidence.
- Critique and defense must be independently stated before adjudication.
- Escalation requires a named unresolved contradiction; no escalation by mere disagreement.
- Confidence updates must state prior confidence, evidence change, and resulting confidence.

## Failure and counterexamples

Reject verdicts based on role vote alone, unsupported steelman claims, or critique that attacks a different object. If evidence channels share a common source, mark independence uncertainty.

## Provenance map

12 architecture `old` entries: multiagent debate, critic/defender/judge, courtroom, escalation, steelman, resurrection, winner stress-test, protocol, assumption excavation, perspective attack. Runtime agent topology removed; reasoning operations retained.

## Context checkpoint / Delta notes

Append claim hash, attack/defense records, evidence links, contradiction IDs, verdict, confidence update, and unresolved disagreements. Contract syntax is provisional Branch C.
