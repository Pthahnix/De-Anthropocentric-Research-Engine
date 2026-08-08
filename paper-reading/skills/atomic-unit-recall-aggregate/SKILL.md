---
name: atomic-unit-recall-aggregate
description: Aggregate per-unit ACU/Nugget match judgments into a final recall score — normalized length-penalized recall for ACU, or V_strict/A_strict (+ run-level ranking, with an explicit per-topic-unreliability caveat) for Nugget. Use this as the final step of the atomic-unit chain, after atomic-unit-matching; this SOP's existence closes a gap the original pipeline design was missing — without it, per-unit match judgments were never actually summed into the score the source methodologies report.
version: 1.0.0
category: paper-reading
type: sop
execution: subagent
prompt: ./prompt.md
input: 'match_results (list of {unit_text, judgment}), atomic_units (list of {text, importance})'
output: 'recall_score (float) OR {v_strict, a_strict, run_rank} depending on which method''s judgments were received'
dependencies:
  sops:
  - spawn-agent
---

# Atomic Unit Recall Aggregate

Final aggregation step of the atomic-unit chain — normalized recall (ACU) or V_strict/A_strict + run-level ranking (Nugget). Added specifically to fix coverage-audit finding S5: the original graph's atomic-unit chain was a dead end at matching, with no node computing the actual reported score.

## Execution

Subagent — spawned via spawn-agent skill.

## Nugget's Reliability Caveat Is Load-Bearing

Nugget-style per-topic scores are documented as unreliable (Kendall τ=0.297–0.539) — only run-level aggregation across multiple candidates is trustworthy (τ=0.887). This SOP must carry that caveat forward in its output whenever it runs Nugget-style aggregation on a single candidate; do not silence it for a cleaner-looking report.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
