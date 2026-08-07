---
name: claim-label-prediction
description: Judge a three-way SUPPORTS/REFUTES/NOINFO label for an atomic claim, based only on its selected rationale sentences (SciFact's final classification step). Use this after rationale-selection has produced the evidence sentences — this is the terminal step of the SciFact chain, producing the complete (claim, abstract, label, rationale) tuple.
execution: subagent
prompt: ./prompt.md
input: 'atomic_claim (string), rationale_sentences (list of strings)'
output: 'label (string: "SUPPORTS" | "REFUTES" | "NOINFO")'
dependencies:
  sops:
  - spawn-agent
---

# Claim Label Prediction

Three-way SUPPORTS/REFUTES/NOINFO label, grounded only in the selected rationale sentences — terminal step of the SciFact 3-chain.

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
