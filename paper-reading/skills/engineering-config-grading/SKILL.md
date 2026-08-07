---
name: engineering-config-grading
description: (Proposal, unverified) Grade reproducibility-relevant engineering configuration items (hyperparameter search range, compute budget, seed handling, dataset splits) on a complete/partial/none scale, requiring the grader to first define what "complete" means per item before judging against it. Use this after study-design-tool-gate has dispatched an ML/CS engineering paper here; this is a graded QUALITY judgment, distinct from dual-column-self-check's binary Yes/No/NA self-audit checklists.
execution: subagent
prompt: ./prompt.md
input: 'full_text (string), dispatched_tool (string)'
output: 'grading_result (list of {item, grade, justification})'
dependencies:
  sops:
  - spawn-agent
---

# Engineering Config Grading (Proposal)

Graded (not binary) reproducibility-config quality judgment. Fills the quality-judgment × engineering-metadata gap in the evaluative-stance × content-layer matrix (spec §2, matrix-generation phase). Per coverage-audit M14: an earlier draft folded this into dual-column-self-check via a value-domain toggle alone, which dropped the actual judgment-defining action (establishing what "complete" means) that distinguishes this from a binary checklist.

## Execution

Subagent — spawned via spawn-agent skill.

## Proposal Status — Read Before Modifying

No primary-source precedent (unlike NOS, which it's structurally modeled after but applies to a different content layer). Keep "(Proposal, unverified)" in the description until real usage validates the method.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
