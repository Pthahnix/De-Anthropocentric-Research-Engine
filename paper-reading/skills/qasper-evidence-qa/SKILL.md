---
name: qasper-evidence-qa
description: Answer a specific question about a paper, grounding the answer in exact quoted evidence spans from the text (QASPER-style question-driven QA with span-level evidence, no schema categorization). Use this whenever the user asks a specific factual question about a paper and wants the answer traceable to exact text spans.
execution: subagent
prompt: ./prompt.md
input: 'full_text (string), question (string)'
output: 'answer (string), evidence_spans (list of strings)'
dependencies:
  sops:
  - spawn-agent
---

# QASPER Evidence QA

Question-driven QA with evidence-span grounding — free text, no normalized schema, since schema-driven categorization methods don't apply to open-ended paper questions.

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
