---
name: rationale-selection
description: Select the minimal set of 1-3 verbatim sentences from a candidate paper/abstract sufficient to entail or refute an atomic claim (SciFact's rationale-selection step). Use this after claim-writing has produced an atomic claim, as the evidence-gathering step before claim-label-prediction; an empty rationale set is a valid outcome, not an error.
version: 1.0.0
category: paper-reading
type: sop
execution: subagent
prompt: ./prompt.md
input: 'atomic_claim (string), source_path (string), meta_path (string)'
reads: 'full paper — the entailing sentences may be anywhere'
output: 'rationale_sentences (list of strings, 0-3 items)'
dependencies:
  sops:
  - spawn-agent
---

# Rationale Selection

Selects minimal evidentiary sentence set for a claim — middle step of the SciFact 3-chain, added to close coverage-audit finding S7 (the original graph jumped straight from claim-writing to a three-way label judgment with no evidence-selection step, even though the tag table's own stated output anchor explicitly requires rationale sentences alongside the label).

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
