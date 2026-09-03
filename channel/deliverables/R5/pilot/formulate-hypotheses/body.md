# formulate-hypotheses

## Purpose

Generate and refine testable hypotheses from a gap, theory, induction, anomaly, or competing explanations.

## When to use / not applicable

Use when a research gap or insight can be stated. Select `deductive`, `inductive`, `abductive`, or `competing-hypotheses`; operationalization may follow any generation mode.

## Input contract

```yaml
required: [research_gap_or_observation]
optional: [theory, anomaly, candidate_explanations, variables, prior_evidence]
constraints: [at least one observable consequence]
```

## Execution protocol

1. State the gap/observation and relevant theory or anomaly.
2. Generate candidate hypotheses without premature filtering.
3. Operationalize variables and relationships; state scope and boundary conditions.
4. Check falsifiability and, for competing mode, create discriminating predictions and a comparison matrix.

## Mode branches

- `deductive`: derive predictions from an existing theoretical framework.
- `inductive`: generalize a pattern where theory is weak or absent.
- `abductive`: explain a precisely described anomaly and retain competing explanations.
- `competing-hypotheses`: require mutually discriminating predictions.

## Output contract

```yaml
produces: [hypothesis_set, operational_definitions, predictions, falsification_conditions, comparison_matrix]
delta_fields: [hypothesis_updates, findings, uncertainties, decisions, open_questions]
```

## Thresholds and quality gates

- Base hard gate: at least 1 clear research gap or insight.
- Abductive S tier: >=2 candidate explanations, 1 best explanation, >=1 competing hypothesis.
- Competing mode: at least 2 hypotheses and >=2 discriminating predictions.
- Each mechanism must correspond to at least 1 hypothesis candidate.

## Failure and counterexamples

Reject unfalsifiable wording, variables without operational definitions, and “competing” hypotheses with no observable divergence. Deductive mode is not applicable when no usable theory exists; abductive mode is not applicable without a clear anomaly.

## Provenance map

`hypothesis-formulation`, `deductive-hypothesis-generation`, `inductive-hypothesis-generation`, `abductive-hypothesis-generation`, `hypothesis-operationalization`, `theory-mechanism-extraction`, `anomaly-driven-abduction`, `competing-hypothesis-construction`, `competing-hypothesis-matrix`; source thresholds retained.

## Context checkpoint / Delta notes

Append candidate list, selected hypotheses, operational definitions, predictions, falsification tests, and unresolved theory conflicts.
