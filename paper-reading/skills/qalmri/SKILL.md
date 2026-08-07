---
name: qalmri
description: Produce a six-slot QALMRI worksheet (Question, Alternatives, Logic, Method, Results, Inference) as free-text notes on one paper — a structured note-taking format, not a scored evaluation. Use this whenever the user wants a QALMRI-style reading worksheet for a specific paper.
execution: subagent
prompt: ./prompt.md
input: 'full_text (string)'
output: 'qalmri_worksheet (dict — six string fields: question, alternatives, logic, method, results, inference)'
dependencies:
  sops:
  - spawn-agent
---

# QALMRI

Six-slot free-text worksheet (Question/Alternatives/Logic/Method/Results/Inference), no judgment algorithm beyond the Inference slot itself.

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
