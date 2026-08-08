---
name: atomic-unit-matching
description: Judge, per atomic content unit, whether a target text (summary, abstract, or other candidate text) contains it — binary present/absent (ACU) or ternary support/partial_support/not_support (Nugget), per caller's value domain. Use this after atomic-unit-writing has produced the reference units, as the matching step before recall aggregation.
version: 1.0.0
category: paper-reading
type: sop
execution: subagent
prompt: ./prompt.md
input: 'atomic_units (list of {text, importance}), target_text (string), judgment_value_domain (string: "binary" | "ternary")'
output: 'match_results (list of {unit_text, judgment})'
dependencies:
  sops:
  - spawn-agent
---

# Atomic Unit Matching

Per-unit coverage judgment against a target text — binary (ACU) or ternary (Nugget) value domain. Middle step of the atomic-unit 3-chain.

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
