# synthesize-meta-analytic-evidence

## Purpose

Design or execute quantitative evidence synthesis while preserving study-level quality, heterogeneity, bias, and sensitivity logic.

## When to use / not applicable

Use when multiple studies or comparable effect estimates must be combined. Not applicable when evidence is a single case or no comparable outcome can be defined.

## Input contract

```yaml
required: [study_records, outcome_definition, effect_measure]
optional: [comparison_network, subgroup_plan, prior_quality_assessments]
constraints: [study-level provenance required]
```

## Execution protocol

1. Define outcome, effect measure, inclusion boundary, and study-level quality fields.
2. Extract or calculate effect sizes and record condition, sample, uncertainty, and provenance.
3. Select one mode: pairwise, network, cumulative, heterogeneity, or bias.
4. Run sensitivity checks and synthesize estimates with uncertainty and exclusions.

## Mode branches

- `pairwise`: combine direct comparisons.
- `network`: compare N>=3 methods using direct and indirect evidence.
- `cumulative`: update the estimate as studies arrive; retain order and stopping state.
- `heterogeneity`: investigate between-study variation; preserve I2 interpretation bands.
- `bias`: test publication, selection, and small-study bias; do not treat absence of evidence as absence of bias.

## Output contract

```yaml
produces: [effect_estimate, uncertainty, heterogeneity_report, bias_report, sensitivity_results]
delta_fields: [findings, evidence_updates, uncertainties, decisions, open_questions]
```

## Thresholds and quality gates

- Budget gate: source pairwise/network/cumulative/heterogeneity/bias SOPs cannot exit until 80% of the declared floor is met.
- `effect-size-extraction`: at least 5 studies processed and at least 5 effect sizes extracted or calculation planned.
- `quality-assessment-protocol`: at least 5 studies assessed.
- If k >= 10, pre-specified subgroup/meta-regression investigation is required where applicable.
- I2 interpretation bands are retained: 0-40% low, 30-60% moderate, 50-90% substantial, 75-100% considerable; overlaps are source wording and must not be silently normalized.

## Failure and counterexamples

Reject synthesis when study identity, outcome definition, or effect measure is missing. Flag disconnected network, incomparable conditions, unplanned subgrouping, and bias tests with insufficient studies.

## Provenance map

`meta-analysis`, `pairwise-synthesis`, `network-comparison`, `cumulative-tracking`, `heterogeneity-investigation`, `bias-detection`, `effect-size-extraction`, `quality-assessment-protocol`, `evidence-synthesis-planning`; all source gates kept, repeated provider details compressed.

## Context checkpoint / Delta notes

Append study set, extraction table, estimate, uncertainty, heterogeneity/bias decisions, and unresolved comparability questions.
## Preserved threshold ledger (verbatim source lines)

- \x60meta-analysis:29\x60 | Multi-method comparison | network-comparison | Comparing N>=3 methods with indirect evidence |
- \x60pairwise-synthesis:38\x60 Budget gate: cannot exit until 80% of floor met.
- \x60network-comparison:25\x60 Design a network meta-analysis (NMA) protocol comparing N>=3 methods simultaneously, leveraging both direct and indirect evidence.
- \x60network-comparison:41\x60 Budget gate: cannot exit until 80% of floor met.
- \x60cumulative-tracking:40\x60 Budget gate: cannot exit until 80% of floor met.
- \x60heterogeneity-investigation:28\x60 When a meta-analysis reveals substantial heterogeneity (I2 > 50%, significant Q-test, large tau2), this strategy designs the investigation protocol: subgroup analyses, meta-regression, moderator identification, and outlier diagnostics. Produces the investigation plan, not the computation.
- \x60heterogeneity-investigation:40\x60 Budget gate: cannot exit until 80% of floor met.
- \x60bias-detection:41\x60 Budget gate: cannot exit until 80% of floor met.
- \x60effect-size-extraction:80\x60 - At least 5 studies processed
- \x60effect-size-extraction:81\x60 - At least 5 effect sizes extracted or calculation planned
- \x60quality-assessment-protocol:59\x60 - At least 5 studies assessed
- \x60evidence-synthesis-planning:51\x60 - **Investigation**: pre-specified subgroups, meta-regression (if k >= 10)
- \x60evidence-synthesis-planning:52\x60 - **Thresholds**: I2 interpretation (0-40% low, 30-60% moderate, 50-90% substantial, 75-100% considerable)
- \x60evidence-synthesis-planning:86\x60 - At least 3 sensitivity analyses designed
