---
name: star-awarding
description: Award NOS's (Newcastle-Ottawa Scale) stars item-by-item across Selection (up to 4), Comparability (up to 2), and Outcome/Exposure (up to 3) — a binary award-or-not action per item, distinct from a 5-value signalling judgment. Use this after study-design-tool-gate has dispatched to NOS, as the first step before sum-threshold-scoring.
execution: subagent
prompt: ./prompt.md
input: 'source_path (string), meta_path (string)'
reads: 'method and results sections'
output: 'star_results (list of {item, stars_awarded})'
dependencies:
  sops:
  - spawn-agent
---

# Star Awarding

NOS's item-by-item star awarding — binary per item, not a signalling-question judgment. Added per coverage-audit M8: the original graph had NOS's stars appearing already-summed at an aggregation node, with no node actually doing the item-level awarding those sums depend on.

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
