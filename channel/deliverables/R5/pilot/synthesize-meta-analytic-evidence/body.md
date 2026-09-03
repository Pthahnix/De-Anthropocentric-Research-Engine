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
## Preserved threshold table ledger (ASCII-normalized from source)

| source | line | source threshold row |
|---|---:|---|
| meta-analysis | 29 | \| Multi-method comparison \| network-comparison \| Comparing N>=3 methods with indirect evidence \| |
| pairwise-synthesis | 38 | Budget gate: cannot exit until 80% of floor met. |
| network-comparison | 25 | Design a network meta-analysis (NMA) protocol comparing N>=3 methods simultaneously, leveraging both direct and indirect evidence. |
| network-comparison | 41 | Budget gate: cannot exit until 80% of floor met. |
| cumulative-tracking | 40 | Budget gate: cannot exit until 80% of floor met. |
| heterogeneity-investigation | 28 | When a meta-analysis reveals substantial heterogeneity (I2 > 50%, significant Q-test, large tau2), this strategy designs the investigation protocol: subgroup analyses, meta-regression, moderator identification, and outlier diagnostics. Produces the investigation plan, not the computation. |
| heterogeneity-investigation | 40 | Budget gate: cannot exit until 80% of floor met. |
| bias-detection | 41 | Budget gate: cannot exit until 80% of floor met. |
| effect-size-extraction | 80 | - At least 5 studies processed |
| effect-size-extraction | 81 | - At least 5 effect sizes extracted or calculation planned |
| quality-assessment-protocol | 59 | - At least 5 studies assessed |
| evidence-synthesis-planning | 51 | - **Investigation**: pre-specified subgroups, meta-regression (if k >= 10) |
| evidence-synthesis-planning | 52 | - **Thresholds**: I2 interpretation (0-40% low, 30-60% moderate, 50-90% substantial, 75-100% considerable) |
| evidence-synthesis-planning | 86 | - At least 3 sensitivity analyses designed |
## Preserved numeric tables (ASCII-normalized from source)

| source | line | source table row |
|---|---:|---|
| meta-analysis | 29 | \| Multi-method comparison \| network-comparison \| Comparing N>=3 methods with indirect evidence \| |
| meta-analysis | 62 | \| risk-of-bias-assessment \| Assess methodological bias (RoB2/PROBAST/QUADAS-2) \| |
| meta-analysis | 73 | \| pairwise-synthesis \| 30 \| 30 \| 40 \| |
| meta-analysis | 74 | \| network-comparison \| 50 \| 80 \| 60 \| |
| meta-analysis | 75 | \| cumulative-tracking \| 40 \| 40 \| 30 \| |
| meta-analysis | 76 | \| heterogeneity-investigation \| 30 \| 30 \| 50 \| |
| meta-analysis | 77 | \| bias-detection \| 40 \| 40 \| 40 \| |
| meta-analysis | 103 | \| bias-detection \| Assess systematic biases in the evidence body — publication bias, reporting bias, and selective outcome reporting. Budget: 40 studies, 40 effect sizes, 40 web searches. \| |
| meta-analysis | 104 | \| cumulative-tracking \| Track evidence accumulation over time — cumulative meta-analysis protocol design. Budget: 40 studies, 40 effect sizes, 30 web searches. \| |
| meta-analysis | 105 | \| heterogeneity-investigation \| Explain why different studies reach different conclusions — heterogeneity investigation protocol. Budget: 30 studies, 30 effect sizes, 50 web searches. \| |
| meta-analysis | 106 | \| network-comparison \| Compare N methods simultaneously including indirect evidence — network meta-analysis protocol design. Budget: 50 studies, 80 effect sizes, 60 web searches. \| |
| meta-analysis | 107 | \| pairwise-synthesis \| Compare two methods across multiple studies — paired meta-analysis protocol design. Budget: 30 studies, 30 effect sizes, 40 web searches. \| |
| pairwise-synthesis | 33 | \| Studies identified \| 20 \| 30 \| |
| pairwise-synthesis | 34 | \| Effect sizes extracted \| 20 \| 30 \| |
| pairwise-synthesis | 35 | \| Web searches \| 25 \| 40 \| |
| pairwise-synthesis | 36 | \| Quality assessments \| 15 \| 30 \| |
| pairwise-synthesis | 46 | \| Studies found \| 0 \| 20 \| 30 \| BLOCKED \| |
| pairwise-synthesis | 47 | \| Effect sizes planned \| 0 \| 20 \| 30 \| BLOCKED \| |
| pairwise-synthesis | 48 | \| Web searches done \| 0 \| 25 \| 40 \| BLOCKED \| |
| pairwise-synthesis | 49 | \| Quality assessed \| 0 \| 15 \| 30 \| BLOCKED \| |
| pairwise-synthesis | 125 | \| risk-of-bias-assessment \| Assess methodological bias using RoB2, PROBAST, or QUADAS-2 validated tools \| |
| network-comparison | 35 | \| Studies identified \| 35 \| 50 \| |
| network-comparison | 36 | \| Effect sizes extracted \| 55 \| 80 \| |
| network-comparison | 37 | \| Web searches \| 40 \| 60 \| |
| network-comparison | 38 | \| Network nodes (methods) \| 3 \| N \| |
| network-comparison | 39 | \| Quality assessments \| 25 \| 50 \| |
| network-comparison | 49 | \| Studies found \| 0 \| 35 \| 50 \| BLOCKED \| |
| network-comparison | 50 | \| Effect sizes planned \| 0 \| 55 \| 80 \| BLOCKED \| |
| network-comparison | 51 | \| Web searches done \| 0 \| 40 \| 60 \| BLOCKED \| |
| network-comparison | 52 | \| Network nodes \| 0 \| 3 \| N \| BLOCKED \| |
| network-comparison | 53 | \| Quality assessed \| 0 \| 25 \| 50 \| BLOCKED \| |
| network-comparison | 142 | \| risk-of-bias-assessment \| Assess methodological bias using RoB2, PROBAST, or QUADAS-2 validated tools \| |
| cumulative-tracking | 34 | \| Studies identified \| 28 \| 40 \| |
| cumulative-tracking | 35 | \| Effect sizes extracted \| 28 \| 40 \| |
| cumulative-tracking | 36 | \| Web searches \| 20 \| 30 \| |
| cumulative-tracking | 37 | \| Temporal coverage (years) \| 5 \| 10+ \| |
| cumulative-tracking | 38 | \| Quality assessments \| 20 \| 40 \| |
| cumulative-tracking | 48 | \| Studies found \| 0 \| 28 \| 40 \| BLOCKED \| |
| cumulative-tracking | 49 | \| Effect sizes planned \| 0 \| 28 \| 40 \| BLOCKED \| |
| cumulative-tracking | 50 | \| Web searches done \| 0 \| 20 \| 30 \| BLOCKED \| |
| cumulative-tracking | 51 | \| Year range covered \| 0 \| 5 \| 10+ \| BLOCKED \| |
| cumulative-tracking | 52 | \| Quality assessed \| 0 \| 20 \| 40 \| BLOCKED \| |
| cumulative-tracking | 138 | \| risk-of-bias-assessment \| Assess methodological bias using RoB2, PROBAST, or QUADAS-2 validated tools \| |
| heterogeneity-investigation | 34 | \| Studies identified \| 20 \| 30 \| |
| heterogeneity-investigation | 35 | \| Effect sizes extracted \| 20 \| 30 \| |
| heterogeneity-investigation | 36 | \| Web searches \| 35 \| 50 \| |
| heterogeneity-investigation | 37 | \| Moderator candidates \| 5 \| 10+ \| |
| heterogeneity-investigation | 38 | \| Quality assessments \| 15 \| 30 \| |
| heterogeneity-investigation | 48 | \| Studies found \| 0 \| 20 \| 30 \| BLOCKED \| |
| heterogeneity-investigation | 49 | \| Effect sizes planned \| 0 \| 20 \| 30 \| BLOCKED \| |
| heterogeneity-investigation | 50 | \| Web searches done \| 0 \| 35 \| 50 \| BLOCKED \| |
| heterogeneity-investigation | 51 | \| Moderators identified \| 0 \| 5 \| 10+ \| BLOCKED \| |
| heterogeneity-investigation | 52 | \| Quality assessed \| 0 \| 15 \| 30 \| BLOCKED \| |
| heterogeneity-investigation | 136 | \| risk-of-bias-assessment \| Assess methodological bias using RoB2, PROBAST, or QUADAS-2 validated tools \| |
| bias-detection | 35 | \| Studies identified \| 28 \| 40 \| |
| bias-detection | 36 | \| Effect sizes extracted \| 28 \| 40 \| |
| bias-detection | 37 | \| Web searches \| 28 \| 40 \| |
| bias-detection | 38 | \| Bias domains assessed \| 5 \| 8 \| |
| bias-detection | 39 | \| Quality assessments \| 20 \| 40 \| |
| bias-detection | 49 | \| Studies found \| 0 \| 28 \| 40 \| BLOCKED \| |
| bias-detection | 50 | \| Effect sizes planned \| 0 \| 28 \| 40 \| BLOCKED \| |
| bias-detection | 51 | \| Web searches done \| 0 \| 28 \| 40 \| BLOCKED \| |
| bias-detection | 52 | \| Bias domains assessed \| 0 \| 5 \| 8 \| BLOCKED \| |
| bias-detection | 53 | \| Quality assessed \| 0 \| 20 \| 40 \| BLOCKED \| |
| bias-detection | 62 | \| quality-assessment-protocol \| Full RoB2 assessment per study \| |
| bias-detection | 148 | \| risk-of-bias-assessment \| Assess methodological bias using RoB2, PROBAST, or QUADAS-2 validated tools \| |
| effect-size-extraction | 109 | \| risk-of-bias-assessment \| Assess methodological bias using RoB2, PROBAST, or QUADAS-2 validated tools \| |
| quality-assessment-protocol | 24 | \| RCT \| RoB 2.0 \| Randomization, deviations, missing data, measurement, selection \| |
| quality-assessment-protocol | 26 | \| Diagnostic accuracy \| QUADAS-2 \| Patient selection, index test, reference standard, flow/timing \| |
| quality-assessment-protocol | 95 | \| risk-of-bias-assessment \| Assess methodological bias using RoB2, PROBAST, or QUADAS-2 validated tools \| |
