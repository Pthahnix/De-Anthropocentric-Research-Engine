---
name: domain-level-judgment
description: Fold raw signalling-question answers into domain-level judgments for RoB2, ROBINS-I, or QUADAS-2, per each tool's own lookup rules — the first of two aggregation levels these tools define. QUADAS-2 is dual-axis (risk-of-bias AND applicability-concern per domain, D1-D3) and terminates here with no further rollup; RoB2/ROBINS-I continue on to worst-case-lookup for an overall verdict. Use this after signalling-question-answering has produced the raw answers.
execution: subagent
prompt: ./prompt.md
input: 'signalling_answers (list of {domain, question, answer}), dispatched_tool (string)'
output: 'domain_judgments (list of {domain, judgment} or, for QUADAS-2, {domain, risk_of_bias_judgment, applicability_concern_judgment})'
dependencies:
  sops:
  - spawn-agent
---

# Domain Level Judgment

Signalling answers → domain-level judgments via each tool's own lookup rules. QUADAS-2's dual-axis output (risk-of-bias + applicability-concern per domain) terminates here — no further rollup exists for it. RoB2/ROBINS-I continue to worst-case-lookup.

## Execution

Subagent — spawned via spawn-agent skill.

## Why This SOP Exists (coverage-audit S4)

The original graph connected signalling-question-answering directly to an overall-judgment node, with no place for the first-level domain rollup RoB2/ROBINS-I/QUADAS-2 all define algorithmically before any overall verdict — and no place at all for QUADAS-2's terminal dual-axis output, since QUADAS-2 never reaches a "worst case across domains" step the way RoB2/ROBINS-I do.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
