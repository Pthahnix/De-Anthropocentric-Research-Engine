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
## Preserved numeric tables (ASCII-normalized from source)

| source | line | source table row |
|---|---:|---|
| experiment-design | 83 | \| Micro \| < 10 \| 3 \| 20 \| Fractional factorial or single ablation \| |
| experiment-design | 84 | \| Small \| 10-100 \| 5 \| 50 \| Full factorial on key factors \| |
| experiment-design | 85 | \| Medium \| 100-1000 \| 8 \| 200 \| Multi-strategy composition \| |
| experiment-design | 86 | \| Large \| > 1000 \| Unlimited \| Unlimited \| Full design space exploration \| |
| ablation-design | 47 | \| Systematic (leave-one-out) \| 3-8 \| N + 2 \| Standard component analysis \| |
| ablation-design | 48 | \| Replacement \| 3-8 \| 2N + 2 \| Need to distinguish "removal" vs "simplification" \| |
| ablation-design | 49 | \| Combinatorial (selected) \| 4-6 \| ~2N \| Suspected interactions between components \| |
| ablation-design | 50 | \| Combinatorial (full) \| 3-4 \| 2^N \| Small systems, need complete picture \| |
| ablation-design | 51 | \| Conditional \| 3-6 \| N * conditions \| Context-dependent contributions \| |
| comparison-design | 54 | \| Minimal \| 1 SOTA + 1 simple \| 1 \| 3 \| 6 \| |
| comparison-design | 55 | \| Standard \| 2-3 baselines \| 2-3 \| 5 \| 30-45 \| |
| comparison-design | 56 | \| Comprehensive \| 4+ baselines \| 3-5 \| 5-10 \| 100+ \| |
| comparison-design | 57 | \| Publication-ready \| All relevant \| 5+ \| 10+ \| 200+ \| |
| scaling-design | 53 | \| Data scaling \| 4-6 \| 3 \| 12-18 \| Low (same model, subset data) \| |
| scaling-design | 54 | \| Model scaling \| 4-8 \| 2-3 \| 8-24 \| High (different model sizes) \| |
| scaling-design | 55 | \| Compute-optimal \| 6-10 per iso-FLOP \| 1-2 \| 12-20 \| Very high \| |
| scaling-design | 56 | \| Inference scaling \| 5-10 \| 5 \| 25-50 \| Low (inference only) \| |
| robustness-design | 54 | \| Single perturbation \| 1 \| 3-5 \| 3-5 \| Quick sanity check \| |
| robustness-design | 55 | \| Multi-perturbation \| 3-5 \| 3 each \| 9-15 \| Standard robustness eval \| |
| robustness-design | 56 | \| Adversarial sweep \| 1 attack \| 5-10 epsilon \| 5-10 \| Adversarial robustness curve \| |
| robustness-design | 57 | \| Comprehensive \| 5+ types \| 3-5 each \| 50+ \| Publication-ready robustness \| |
| robustness-design | 58 | \| Cross-domain \| N domains \| 1 \| N \| Transfer evaluation \| |
| statistical-method-selection | 30 | \| Normal data, 2 groups, paired \| Paired t-test \| |
| statistical-method-selection | 31 | \| Normal data, 2 groups, unpaired \| Welch's t-test \| |
| statistical-method-selection | 32 | \| Normal data, 3+ groups \| ANOVA + post-hoc (Tukey HSD) \| |
| statistical-method-selection | 33 | \| Non-normal, 2 groups \| Wilcoxon signed-rank / Mann-Whitney U \| |
| statistical-method-selection | 34 | \| Non-normal, 3+ groups \| Kruskal-Wallis + Dunn's test \| |
| statistical-method-selection | 36 | \| Want probability of superiority \| Bayesian comparison (Benavoli 2017) \| |
| budget-constrained-design | 34 | \| < 10 \| One-factor-at-a-time or Plackett-Burman screening \| |
| budget-constrained-design | 35 | \| 10-30 \| Fractional factorial (Resolution III-IV) \| |
| budget-constrained-design | 36 | \| 30-60 \| Fractional factorial (Resolution V) or Taguchi \| |
| budget-constrained-design | 37 | \| 60-120 \| Full factorial on top factors + screening on rest \| |
| budget-constrained-design | 38 | \| 120+ \| Full factorial or RSM with replication \| |
