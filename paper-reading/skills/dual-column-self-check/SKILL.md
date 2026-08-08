---
name: dual-column-self-check
description: Run one of the ML/CS reproducibility checklists (ML Reproducibility Checklist, REFORMS, NeurIPS Paper Checklist, Model Cards, Datasheets for Datasets) against a paper as a reader-side audit, producing a category (Yes/No/NA) plus free-text reason per item. Use this whenever the user wants a reproducibility/completeness self-check run on an ML or CS paper — invoke this directly, it has no study-design gate in this package since these checklists are engineering self-audits, not clinical-study tools.
version: 1.0.0
category: paper-reading
type: sop
execution: subagent
prompt: ./prompt.md
input: 'source_path (string), meta_path (string), item_set (string — name of the specific checklist)'
reads: 'full paper — a completeness self-audit asks whether each item appears anywhere'
output: 'checklist_result (list of {item, category, reason})'
dependencies:
  sops:
  - spawn-agent
---

# Dual Column Self-Check

Category (Yes/No/NA) + free-text reason per item, across 5 ML/CS reproducibility checklists. Originally author-facing self-certification tools, reversed here for reader-side auditing — each item's framing must be flipped to a question before being answered.

## Execution

Subagent — spawned via spawn-agent skill.

## No upstream gate (intentional, not a gap)

Unlike `quality-appraisal-checklist`/`reporting-standard-checklist`, this SOP has no in-edge from `study-design-tool-gate` in the graph — its 5 checklists are ML/CS engineering self-audits, not tied to a clinical study design, so no study-design dispatch was ever drawn to it (spec §5's flagged note). Do not add a gate dependency here without revisiting that decision explicitly.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
