---
name: atomic-unit-writing
description: Extract (ACU-style) or freshly author (Nugget-style) a list of atomic content units from a paper, optionally tagged vital/okay for importance. Use this as the first step whenever building a reference set of atomic facts for later recall-checking a summary or abstract against the paper — always precedes atomic-unit-matching.
version: 1.0.0
category: paper-reading
type: sop
execution: subagent
prompt: ./prompt.md
input: 'source_path (string), meta_path (string), unit_source (string: "extracted" | "authored"), importance_tagging_toggle (boolean)'
reads: 'abstract only — both ACU and Nugget define their units over the reference summary'
output: 'atomic_units (list of {text, importance})'
dependencies:
  sops:
  - spawn-agent
---

# Atomic Unit Writing

Produces atomic content units — extracted (ACU) or freshly authored (Nugget), optionally importance-tagged. First step of the atomic-unit 3-chain.

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
