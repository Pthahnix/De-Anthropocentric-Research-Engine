# establish-empirical-baseline

## Purpose

Establish a fair empirical baseline by inventorying methods, extracting comparable performance, normalizing conditions/compute, checking discrepancies, and estimating progress/headroom.

## Input contract

```yaml
required: [method_records, benchmark_or_task, performance_measure]
optional: [historical_series, compute_metadata, condition_schema]
constraints: [comparability fields and source provenance required]
```

## Execution protocol

1. Inventory methods and define the comparison condition schema.
2. Extract performance data and normalize units, data, compute, and evaluation protocol.
3. Analyze discrepancies, progress trajectory, leaderboard state, and headroom.
4. Synthesize baseline with uncertainty and known incomparable records.

## Output contract

```yaml
produces: [method_inventory, normalized_baseline, discrepancy_report, progress_curve, headroom_estimate]
delta_fields: [findings, evidence_updates, uncertainties, decisions, open_questions]
```

## Thresholds and quality gates

- `method-inventory`: methods_discovered >= 40 (80% of target).
- `performance-extraction`: data_points >= 120 (80% of target).
- `condition-standardization`: data_points_standardized >= 48 (80% of target).
- `discrepancy-analysis`: score_pairs_compared >= 36 (80% of target).
- `progress-quantification`: historical_data_points >= 80 (80% of target).
- Normalization must expose condition, compute, metric, and unit transformations.

## Failure and counterexamples

Do not call a baseline fair when conditions are missing, metrics are incomparable, or leaderboard values are copied without protocol verification. Mark headroom unknown when the historical series is below its floor.

## Provenance map

9 architecture `old` entries: baseline, inventory, extraction, standardization, discrepancy, progress, leaderboard, normalization, curve construction. Repeated reporting prose compressed.

## Context checkpoint / Delta notes

Append method IDs, normalized records, excluded records with reasons, discrepancy pairs, progress model, and headroom uncertainty.
## Preserved threshold ledger (verbatim source lines)

- \x60method-inventory:41\x60 Cannot exit until methods_discovered >= 40 (80% of target).
- \x60performance-extraction:44\x60 Cannot exit until data_points >= 120 (80% of target).
- \x60condition-standardization:44\x60 Cannot exit until data_points_standardized >= 48 (80% of target).
- \x60discrepancy-analysis:43\x60 Cannot exit until score_pairs_compared >= 36 (80% of target).
- \x60progress-quantification:46\x60 Cannot exit until historical_data_points >= 80 (80% of target).
