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
## Preserved threshold ledger (verbatim source lines)

- \x60hypothesis-formulation:45\x60 1. At least 1 clear research gap or insight has been identified
- \x60hypothesis-formulation:72\x60 | S | Ён2 structured hypotheses | Ён2 relevant theories | 1 falsification scenario per hypothesis | Optional |
- \x60hypothesis-formulation:73\x60 | M | Ён3 structured hypotheses | Ён3 theories + Ён5 mechanisms | Ён1 scenario + boundary conditions per hypothesis | Ён2 competing hypotheses |
- \x60hypothesis-formulation:74\x60 | L | Ён5 structured hypotheses | Ён5 theories + Ён8 mechanisms | Complete falsifiability audit | Ён3 competing hypotheses + discriminating predictions |
- \x60hypothesis-formulation:95\x60 1. Ён2 complete structured hypotheses (including all 6 components)
- \x60deductive-hypothesis-generation:60\x60 | S | Ён2 named theories | Ён3 causal mechanisms | Ён2 structured hypotheses | 1 falsification scenario per hypothesis |
- \x60deductive-hypothesis-generation:61\x60 | M | Ён3 named theories | Ён5 causal mechanisms | Ён3 structured hypotheses | Ён1 scenario + boundary conditions per hypothesis |
- \x60deductive-hypothesis-generation:62\x60 | L | Ён5 named theories | Ён8 causal mechanisms | Ён5 structured hypotheses | full falsifiability audit + competing-theory comparison |
- \x60inductive-hypothesis-generation:59\x60 | S | Ён3 independent observation patterns | Ён2 regularities | Ён2 structured hypotheses | Each hypothesis specifies its sample source |
- \x60inductive-hypothesis-generation:60\x60 | M | Ён5 independent observation patterns | Ён3 regularities | Ён3 structured hypotheses | Generalization boundary + falsification scenario |
- \x60inductive-hypothesis-generation:61\x60 | L | Ён8 independent observation patterns | Ён5 regularities | Ён4 structured hypotheses | Complete generalization boundary + comparison of competing regularities |
- \x60abductive-hypothesis-generation:56\x60 | S | 1 precisely described anomaly | Ён2 candidate explanations | 1 best-explanation hypothesis | Ён1 competing hypothesis retained |
- \x60abductive-hypothesis-generation:57\x60 | M | 1ЈC2 anomalies | Ён3 candidate explanations | Ён2 structured hypotheses | complete plausibility ranking |
- \x60abductive-hypothesis-generation:58\x60 | L | Ён2 related anomalies | Ён5 candidate explanations | Ён3 structured hypotheses | complete ranking + discriminating prediction design |
- \x60hypothesis-operationalization:59\x60 | M | Above + justification of operationalization validity | Variable measurement includes reliability/validity considerations | Complete boundary conditions | Ён2 falsification scenarios |
- \x60theory-mechanism-extraction:45\x60 - Coverage: 1 theory, Ён1 mechanism, Ён1 hypothesis candidate
- \x60theory-mechanism-extraction:50\x60 - Coverage: Ён2 theories, Ён3 mechanisms, Ён1 hypothesis candidate per mechanism
- \x60theory-mechanism-extraction:53\x60 **Deep (L tier, Ён3 theories)**
- \x60theory-mechanism-extraction:55\x60 - Coverage: Ён3 theories, Ён5 mechanisms, cross-theory variable mapping, Ён5 hypothesis candidates
- \x60theory-mechanism-extraction:60\x60 - Ён2 theories identified and described (including core claim and scope of applicability)
- \x60theory-mechanism-extraction:61\x60 - Ён3 mechanisms extracted from the theories (each with a causal-chain description)
- \x60theory-mechanism-extraction:62\x60 - Each mechanism corresponds to at least 1 hypothesis candidate, including:
- \x60anomaly-driven-abduction:41\x60 - Sequential execution: anomaly-characterization Ёњ explanation-generation (Ён3 explanations) Ёњ plausibility-ranking
- \x60anomaly-driven-abduction:45\x60 - anomaly-characterization executes independently for each anomaly; explanation-generation generates Ён3 explanations (explanations may be shared across anomalies); plausibility-ranking ranks all explanations uniformly
- \x60anomaly-driven-abduction:55\x60 - Ён3 candidate explanations, each explanation:
- \x60competing-hypothesis-construction:55\x60 | S | Ён2 genuinely competing hypotheses | Ён1 discriminating prediction | simplified version (2ЁС2) | 1 falsification scenario per hypothesis |
- \x60competing-hypothesis-construction:56\x60 | M | Ён3 competing hypotheses | Ён2 discriminating predictions | full matrix (hypotheses ЁС predictions) | full falsification per hypothesis |
- \x60competing-hypothesis-construction:57\x60 | L | Ён4 competing hypotheses | Ён3 discriminating predictions | full matrix + experiment design suggestions | full falsifiability audit |
- \x60competing-hypothesis-matrix:34\x60 | competing-hypothesis-generation | Based on the primary hypothesis, generate Ён3 alternative hypotheses competing with it (different mechanisms, same or similar phenomenon prediction range) | Required in all modes, execute first |
- \x60competing-hypothesis-matrix:41\x60 - Sequentially execute all 3 SOPs; generate Ён3 competing hypotheses; design Ён2 discriminating predictions; build comparison matrix
- \x60competing-hypothesis-matrix:49\x60 - All 3 SOPs execute; competing-hypothesis-generation additional requirement: at least 1 competing hypothesis comes from a completely different theoretical framework; discriminating-prediction-design additional requirement: each discriminating prediction annotates the required experiment scale and difficulty; hypothesis-comparison-matrix additional output: recommended experiment priority (most discriminating predictions ranked first)
- \x60competing-hypothesis-matrix:54\x60 - Ён3 competing hypotheses (explaining the same phenomenon as the primary hypothesis but with different mechanisms)
- \x60competing-hypothesis-matrix:55\x60 - Ён2 discriminating predictions (each prediction produces different expected outcomes for at least 2 hypotheses)
