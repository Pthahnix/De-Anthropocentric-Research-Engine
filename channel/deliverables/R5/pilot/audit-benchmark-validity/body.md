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
## Preserved numeric tables (ASCII-normalized from source)

| source | line | source table row |
|---|---:|---|
| benchmark-archaeology | 39 | \| benchmark-audit \| Systematic quality assessment using BetterBench 46-criterion framework \| |
| benchmark-archaeology | 72 | \| benchmark-audit \| 5 \| 30 \| 40 \| |
| benchmark-archaeology | 73 | \| saturation-analysis \| 15 \| 50 \| 60 \| |
| benchmark-archaeology | 74 | \| validity-probing \| 3 \| 40 \| 30 \| |
| benchmark-archaeology | 75 | \| coverage-mapping \| 20 \| 30 \| 50 \| |
| benchmark-archaeology | 76 | \| protocol-forensics \| 5 \| 60 \| 30 \| |
| benchmark-archaeology | 77 | \| **Total** \| **48** \| **210** \| **210** \| |
| benchmark-archaeology | 112 | \| benchmark-audit \| Systematic quality assessment using BetterBench 46-criterion framework — 5 benchmarks, 30 papers, 40 web searches \| |
| benchmark-archaeology | 113 | \| coverage-mapping \| Map evaluation coverage, identify untested capability dimensions — 20 benchmarks, 30 papers, 50 web searches \| |
| benchmark-archaeology | 114 | \| protocol-forensics \| Analyze evaluation protocol differences across papers for same benchmark — 5 benchmarks, 60 papers, 30 web searches \| |
| benchmark-archaeology | 115 | \| saturation-analysis \| Track score trajectories, detect saturation/failure points — 15 benchmarks, 50 papers, 60 web searches \| |
| benchmark-archaeology | 116 | \| validity-probing \| Challenge construct validity — does benchmark measure claimed capability>= — 3 benchmarks, 40 papers, 30 web searches \| |
| benchmark-audit | 28 | \| Benchmarks audited \| 3 \| 5 \| |
| benchmark-audit | 29 | \| Papers read \| 20 \| 30 \| |
| benchmark-audit | 30 | \| Web searches \| 25 \| 40 \| |
| benchmark-audit | 38 | \| Benchmarks audited \| 0 \| 5 \| PENDING \| |
| benchmark-audit | 39 | \| Papers fetched \| 0 \| 30 \| PENDING \| |
| benchmark-audit | 40 | \| Papers read \| 0 \| 20 \| PENDING \| |
| benchmark-audit | 41 | \| Web searches \| 0 \| 40 \| PENDING \| |
| benchmark-audit | 42 | \| Documentation audits complete \| 0 \| 5 \| PENDING \| |
| benchmark-audit | 43 | \| Metric decompositions complete \| 0 \| 5 \| PENDING \| |
| benchmark-audit | 44 | \| Contamination checks complete \| 0 \| 5 \| PENDING \| |
| benchmark-audit | 45 | \| Synthesis reports produced \| 0 \| 5 \| PENDING \| |
| saturation-analysis | 28 | \| Benchmarks analyzed \| 10 \| 15 \| |
| saturation-analysis | 29 | \| Papers read \| 35 \| 50 \| |
| saturation-analysis | 30 | \| Web searches \| 40 \| 60 \| |
| saturation-analysis | 38 | \| Benchmarks analyzed \| 0 \| 15 \| PENDING \| |
| saturation-analysis | 39 | \| Score trajectories built \| 0 \| 15 \| PENDING \| |
| saturation-analysis | 40 | \| Papers fetched \| 0 \| 50 \| PENDING \| |
| saturation-analysis | 41 | \| Papers read \| 0 \| 35 \| PENDING \| |
| saturation-analysis | 42 | \| Web searches \| 0 \| 60 \| PENDING \| |
| saturation-analysis | 43 | \| Saturation detections run \| 0 \| 15 \| PENDING \| |
| saturation-analysis | 44 | \| Leaderboard analyses done \| 0 \| 10 \| PENDING \| |
| saturation-analysis | 45 | \| Failure mode catalogs built \| 0 \| 5 \| PENDING \| |
| validity-probing | 28 | \| Benchmarks probed \| 2 \| 3 \| |
| validity-probing | 29 | \| Papers read \| 30 \| 40 \| |
| validity-probing | 30 | \| Web searches \| 20 \| 30 \| |
| validity-probing | 38 | \| Benchmarks probed \| 0 \| 3 \| PENDING \| |
| validity-probing | 39 | \| Papers fetched \| 0 \| 40 \| PENDING \| |
| validity-probing | 40 | \| Papers read \| 0 \| 30 \| PENDING \| |
| validity-probing | 41 | \| Web searches \| 0 \| 30 \| PENDING \| |
| validity-probing | 42 | \| Construct validity assessments \| 0 \| 3 \| PENDING \| |
| validity-probing | 43 | \| Artifact detection runs \| 0 \| 3 \| PENDING \| |
| validity-probing | 44 | \| Alternative explanation catalogs \| 0 \| 3 \| PENDING \| |
| validity-probing | 45 | \| Convergent validity checks \| 0 \| 3 \| PENDING \| |
| coverage-mapping | 27 | \| Benchmarks mapped \| 15 \| 20 \| |
| coverage-mapping | 28 | \| Papers read \| 20 \| 30 \| |
| coverage-mapping | 29 | \| Web searches \| 35 \| 50 \| |
| coverage-mapping | 37 | \| Benchmarks mapped \| 0 \| 20 \| PENDING \| |
| coverage-mapping | 38 | \| Capability taxonomy nodes \| 0 \| 30 \| PENDING \| |
| coverage-mapping | 39 | \| Papers fetched \| 0 \| 30 \| PENDING \| |
| coverage-mapping | 40 | \| Papers read \| 0 \| 20 \| PENDING \| |
| coverage-mapping | 41 | \| Web searches \| 0 \| 50 \| PENDING \| |
| coverage-mapping | 42 | \| Coverage annotations complete \| 0 \| 20 \| PENDING \| |
| coverage-mapping | 43 | \| White spaces identified \| 0 \| 5 \| PENDING \| |
| coverage-mapping | 44 | \| Redundancy clusters found \| 0 \| 3 \| PENDING \| |
| protocol-forensics | 26 | \| Benchmarks forensically analyzed \| 3 \| 5 \| |
| protocol-forensics | 27 | \| Papers read \| 45 \| 60 \| |
| protocol-forensics | 28 | \| Web searches \| 20 \| 30 \| |
| protocol-forensics | 36 | \| Benchmarks analyzed \| 0 \| 5 \| PENDING \| |
| protocol-forensics | 37 | \| Papers fetched \| 0 \| 60 \| PENDING \| |
| protocol-forensics | 38 | \| Papers read \| 0 \| 45 \| PENDING \| |
| protocol-forensics | 39 | \| Web searches \| 0 \| 30 \| PENDING \| |
| protocol-forensics | 40 | \| Protocol extractions complete \| 0 \| 60 \| PENDING \| |
| protocol-forensics | 41 | \| Difference matrices built \| 0 \| 5 \| PENDING \| |
| protocol-forensics | 42 | \| Variance attributions done \| 0 \| 5 \| PENDING \| |
| protocol-forensics | 43 | \| Impact assessments complete \| 0 \| 5 \| PENDING \| |
| evaluation-protocol-comparison | 36 | \| **Infrastructure** \| Framework, precision (fp16/bf16/fp32), batch size, hardware \| |
| evaluation-protocol-comparison | 93 | \| Papers compared \| 8 \| |
| evaluation-protocol-comparison | 94 | \| Protocol elements extracted per paper \| 10 \| |
| evaluation-protocol-comparison | 95 | \| High-variance elements identified \| 2 \| |
| evaluation-protocol-comparison | 96 | \| Impact estimates produced \| 3 \| |
