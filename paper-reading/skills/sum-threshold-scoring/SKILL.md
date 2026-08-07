---
name: sum-threshold-scoring
description: Sum NOS's item-level stars and bucket into good (≥7)/fair (4-6)/poor (≤3) — a fixed threshold lookup, structurally distinct from worst-case-lookup's take-the-worst-value approach. Use this after star-awarding has produced the per-item stars; this is NOS's terminal step.
execution: subagent
prompt: ./prompt.md
input: 'star_results (list of {item, stars_awarded})'
output: 'total_stars (integer), nos_grade (string: "good" | "fair" | "poor")'
dependencies:
  sops:
  - spawn-agent
---

# Sum Threshold Scoring

Sum-then-bucket, NOS's own aggregation shape — deliberately kept separate from worst-case-lookup since NOS sums rather than takes a worst-case value (structurally different aggregation, not a value-domain variant of the same algorithm).

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
