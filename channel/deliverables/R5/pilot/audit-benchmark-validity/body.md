# audit-benchmark-validity

## Purpose

Treat benchmarks as scientific measurement instruments: audit construct validity, contamination, metric pathology, coverage, leaderboard dynamics, and protocol drift.

## Input contract

```yaml
required: [benchmark_spec, task_definition, metric_definition, evaluation_records]
optional: [leaderboard_history, protocol_versions, coverage_target]
constraints: [claims must be linked to benchmark evidence]
```

## Execution protocol

1. Reconstruct benchmark construct, task boundary, metric, data coverage, and protocol versions.
2. Select validity, contamination, saturation, coverage, protocol-forensics, or evaluation-comparison mode.
3. Probe artifacts and shortcut paths; compare protocol/metric variants.
4. Return validity verdict with threats, evidence, and required repairs.

## Output contract

```yaml
produces: [validity_verdict, threat_register, contamination_findings, coverage_map, protocol_drift_report, repair_actions]
delta_fields: [findings, evidence_updates, uncertainties, decisions, open_questions, recommended_jumps]
```

## Thresholds and quality gates

- Every source HARD-GATE remains mandatory; no exit with an untested construct, contamination path, metric pathology, coverage claim, or protocol change.
- Saturation claims require an explicit stopping criterion and evidence that additional search/testing no longer changes the conclusion.
- Evaluation comparisons must state the controlled protocol difference and its expected impact.

## Failure and counterexamples

Reject “valid” when benchmark artifact probes are absent, contamination is unknown but ignored, or leaderboard gains cannot be separated from protocol drift. A high score is not evidence of construct validity by itself.

## Provenance map

7 architecture `old` entries: archaeology, audit, saturation, validity probing, coverage mapping, protocol forensics, evaluation comparison. Provider-specific retrieval compressed.

## Context checkpoint / Delta notes

Append benchmark version, construct claims, probes, contamination evidence, coverage gaps, protocol diffs, verdict, and repair decisions.
## Preserved threshold ledger (verbatim source lines)

- \x60benchmark-audit:49\x60 Cannot exit until 80% of all targets met.
- \x60saturation-analysis:49\x60 Cannot exit until 80% of all targets met.
- \x60saturation-analysis:89\x60   score_compression: float  # top-10 score range
- \x60validity-probing:49\x60 Cannot exit until 80% of all targets met.
- \x60coverage-mapping:48\x60 Cannot exit until 80% of all targets met.
- \x60protocol-forensics:47\x60 Cannot exit until 80% of all targets met.
## Preserved threshold table ledger (ASCII-normalized from source)

| source | line | source threshold row |
|---|---:|---|
| benchmark-audit | 49 | Cannot exit until 80% of all targets met. |
| saturation-analysis | 49 | Cannot exit until 80% of all targets met. |
| saturation-analysis | 89 |   score_compression: float  # top-10 score range |
| validity-probing | 49 | Cannot exit until 80% of all targets met. |
| coverage-mapping | 48 | Cannot exit until 80% of all targets met. |
| protocol-forensics | 47 | Cannot exit until 80% of all targets met. |
