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
## Preserved threshold table ledger (ASCII-normalized from source)

| source | line | source threshold row |
|---|---:|---|
| method-inventory | 41 | Cannot exit until methods_discovered >= 40 (80% of target). |
| performance-extraction | 44 | Cannot exit until data_points >= 120 (80% of target). |
| condition-standardization | 44 | Cannot exit until data_points_standardized >= 48 (80% of target). |
| discrepancy-analysis | 43 | Cannot exit until score_pairs_compared >= 36 (80% of target). |
| progress-quantification | 46 | Cannot exit until historical_data_points >= 80 (80% of target). |
## Preserved numeric tables (ASCII-normalized from source)

| source | line | source table row |
|---|---:|---|
| baseline-establishment | 70 | \| method-inventory \| 50 \| 0 \| 60 \| |
| baseline-establishment | 71 | \| performance-extraction \| 30 \| 150 \| 40 \| |
| baseline-establishment | 72 | \| condition-standardization \| 20 \| 60 \| 30 \| |
| baseline-establishment | 73 | \| discrepancy-analysis \| 15 \| 45 \| 30 \| |
| baseline-establishment | 74 | \| progress-quantification \| 30 \| 100 \| 40 \| |
| baseline-establishment | 75 | \| **TOTAL** \| **145** \| **355** \| **200** \| |
| baseline-establishment | 105 | \| condition-standardization \| Standardize evaluation condition differences across papers — 20 methods, 60 data points, 30 web searches budget \| |
| baseline-establishment | 106 | \| discrepancy-analysis \| Identify discrepancies between reported and reproducible scores — 15 methods, 45 data points, 30 web searches budget \| |
| baseline-establishment | 107 | \| method-inventory \| Comprehensively identify all relevant methods for a task — 50 methods, 60 web searches budget \| |
| baseline-establishment | 108 | \| performance-extraction \| Systematically extract performance data and conditions from papers — 30 methods, 150 data points, 40 web searches budget \| |
| baseline-establishment | 109 | \| progress-quantification \| Track performance progress over time, quantify remaining headroom — 30 methods, 100 data points, 40 web searches budget \| |
| method-inventory | 23 | \| Methods discovered \| 30 \| 50 \| |
| method-inventory | 24 | \| Web searches \| 40 \| 60 \| |
| method-inventory | 25 | \| Papers consulted \| 20 \| 40 \| |
| method-inventory | 33 | \| Methods discovered \| 0 \| 50 \| BLOCKED \| |
| method-inventory | 34 | \| Web searches used \| 0 \| 60 \| — \| |
| method-inventory | 35 | \| Papers consulted \| 0 \| 40 \| — \| |
| method-inventory | 36 | \| Leaderboard sources \| 0 \| 5 \| — \| |
| method-inventory | 37 | \| Citation chains traced \| 0 \| 10 \| — \| |
| performance-extraction | 24 | \| Methods covered \| 20 \| 30 \| |
| performance-extraction | 25 | \| Data points extracted \| 100 \| 150 \| |
| performance-extraction | 26 | \| Web searches \| 25 \| 40 \| |
| performance-extraction | 27 | \| Papers read \| 15 \| 30 \| |
| performance-extraction | 35 | \| Methods covered \| 0 \| 30 \| BLOCKED \| |
| performance-extraction | 36 | \| Data points extracted \| 0 \| 150 \| BLOCKED \| |
| performance-extraction | 37 | \| Web searches used \| 0 \| 40 \| — \| |
| performance-extraction | 38 | \| Papers read \| 0 \| 30 \| — \| |
| performance-extraction | 39 | \| Datasets covered \| 0 \| 5 \| — \| |
| performance-extraction | 40 | \| Metrics tracked \| 0 \| 3 \| — \| |
| condition-standardization | 25 | \| Methods analyzed \| 15 \| 20 \| |
| condition-standardization | 26 | \| Data points standardized \| 40 \| 60 \| |
| condition-standardization | 27 | \| Web searches \| 20 \| 30 \| |
| condition-standardization | 28 | \| Condition dimensions cataloged \| 5 \| 10 \| |
| condition-standardization | 36 | \| Methods analyzed \| 0 \| 20 \| BLOCKED \| |
| condition-standardization | 37 | \| Data points standardized \| 0 \| 60 \| BLOCKED \| |
| condition-standardization | 38 | \| Condition dimensions \| 0 \| 10 \| — \| |
| condition-standardization | 39 | \| Normalization rules defined \| 0 \| 5 \| — \| |
| condition-standardization | 40 | \| Fair comparison sets \| 0 \| 3 \| — \| |
| discrepancy-analysis | 24 | \| Methods analyzed \| 10 \| 15 \| |
| discrepancy-analysis | 25 | \| Data points compared \| 30 \| 45 \| |
| discrepancy-analysis | 26 | \| Web searches \| 20 \| 30 \| |
| discrepancy-analysis | 27 | \| Reproduction studies consulted \| 5 \| 10 \| |
| discrepancy-analysis | 35 | \| Methods analyzed \| 0 \| 15 \| BLOCKED \| |
| discrepancy-analysis | 36 | \| Score pairs compared \| 0 \| 45 \| BLOCKED \| |
| discrepancy-analysis | 37 | \| Discrepancies flagged \| 0 \| — \| — \| |
| discrepancy-analysis | 38 | \| Reproduction studies found \| 0 \| 10 \| — \| |
| discrepancy-analysis | 39 | \| Reliability ratings assigned \| 0 \| 15 \| — \| |
| progress-quantification | 26 | \| Methods tracked \| 20 \| 30 \| |
| progress-quantification | 27 | \| Historical data points \| 70 \| 100 \| |
| progress-quantification | 28 | \| Web searches \| 25 \| 40 \| |
| progress-quantification | 29 | \| Time span covered (years) \| 3 \| 5+ \| |
| progress-quantification | 37 | \| Methods tracked \| 0 \| 30 \| BLOCKED \| |
| progress-quantification | 38 | \| Historical data points \| 0 \| 100 \| BLOCKED \| |
| progress-quantification | 39 | \| Web searches used \| 0 \| 40 \| — \| |
| progress-quantification | 40 | \| Progress curves built \| 0 \| 3 \| — \| |
| progress-quantification | 41 | \| Headroom estimates \| 0 \| 3 \| — \| |
| progress-quantification | 42 | \| Inflection points identified \| 0 \| 2 \| — \| |
| leaderboard-harvesting | 62 | \| Leaderboard sources checked \| 3 \| |
| leaderboard-harvesting | 63 | \| Methods with scores \| 15 \| |
| leaderboard-harvesting | 64 | \| Cross-validated score pairs \| 10 \| |
| leaderboard-harvesting | 65 | \| Deduplication conflicts resolved \| 5 \| |
| condition-normalization | 64 | \| Condition dimensions cataloged \| 5 \| |
| condition-normalization | 65 | \| Methods with full condition vectors \| 10 \| |
| condition-normalization | 66 | \| Normalization rules defined \| 3 \| |
| condition-normalization | 67 | \| Fair comparison sets produced \| 2 \| |
| progress-curve-construction | 66 | \| Progress curves constructed \| 2 \| |
| progress-curve-construction | 67 | \| Years of history covered \| 3 \| |
| progress-curve-construction | 68 | \| Inflection points identified \| 1 \| |
| progress-curve-construction | 69 | \| Headroom estimates produced \| 2 \| |
