# design-experiment

## Purpose

Translate a falsifiable hypothesis into a statistically defensible experiment. Factorial, ablation, comparison, scaling, and robustness are modes.

## When to use / not applicable

Use after a hypothesis has an operational construct and discriminating prediction. Not applicable when the hypothesis or measurable outcome is absent.

## Input contract

```yaml
required: [falsifiable_hypothesis, outcome, factors, constraints]
optional: [baseline, candidate_models, budget, robustness_axes]
constraints: [pre-registered analysis plan]
```

## Execution protocol

1. Operationalize outcome and factors; identify levels, controls, and comparison baseline.
2. Choose `factorial`, `ablation`, `comparison`, `scaling`, or `robustness` mode.
3. Select statistical method before observing outcomes; specify sample, power, and stopping rule.
4. Write reproducibility, resource, and failure checks; return a runnable design matrix.

## Output contract

```yaml
produces: [design_matrix, analysis_plan, sample_plan, preregistered_thresholds, reproducibility_checklist]
delta_fields: [findings, decisions, uncertainties, open_questions]
```

## Thresholds and quality gates

- `experiment-design` HARD-GATE and Budget Gate remain mandatory; no exit before declared minimum yield.
- Factor levels, comparison baseline, statistical test, significance threshold, sample-size rationale, and stopping rule must all be explicit.
- Significance threshold must be pre-registered, not chosen post-hoc.
- Budget-constrained design must report at least one feasible design under the stated resource envelope.

## Failure and counterexamples

Reject post-hoc factor selection, outcome leakage, missing control, unpowered comparison, or a design whose claimed inference exceeds its measured outcome.

## Provenance map

`experiment-design`, `factor-level-design`, `ablation-design`, `comparison-design`, `scaling-design`, `robustness-design`, `statistical-method-selection`, `reproducibility-protocol`, `budget-constrained-design`; mode-specific steps retained, agent dispatch removed.

## Context checkpoint / Delta notes

Record hypothesis ID, design mode, factors/levels, analysis plan, budget, preregistration status, and unresolved threats.
