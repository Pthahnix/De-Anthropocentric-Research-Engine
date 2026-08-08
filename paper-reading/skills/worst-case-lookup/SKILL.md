---
name: worst-case-lookup
description: Take the single most severe domain/item judgment as the overall verdict, for RoB2 (3-value), ROBINS-I (5-value), or AMSTAR-2 (pre-filtered by critical-domain status before worst-case). Use this after domain-level-judgment (for RoB2/ROBINS-I) or quality-appraisal-checklist (for AMSTAR-2) has produced per-domain/item judgments — this SOP has two structurally distinct upstream callers and must identify which value domain it received before applying the matching lookup rule. QUADAS-2 never reaches this SOP; it terminates one step earlier at domain-level-judgment.
version: 1.0.0
category: paper-reading
type: sop
execution: subagent
prompt: ./prompt.md
input: 'domain_judgments (list of {domain, judgment}, from RoB2/ROBINS-I) OR checklist_result (from AMSTAR-2) — exactly one of the two'
output: 'overall_judgment (string), which_algorithm (string)'
dependencies:
  sops:
  - spawn-agent
---

# Worst Case Lookup

Overall verdict = most severe domain/item value, on the caller's own scale. Merges what were originally 3 separate SOPs (RoB2-aggregate, ROBINS-I-aggregate, AMSTAR-2-aggregate) per coverage-audit M10's finding that they share one algorithm (worst-case-taking) differing only in value domain and, for AMSTAR-2, an extra pre-filter step — the same parameterization principle already used for unit-classification's label_set parameter, applied consistently here.

## Execution

Subagent — spawned via spawn-agent skill.

## Two Distinct Callers — Do Not Assume Which

Unlike most SOPs in this package, this one is called from two different places in the graph with two different input shapes (`domain_judgments` vs `checklist_result`). The prompt's Step 1 instruction to identify which was received before proceeding is load-bearing — applying RoB2's worst-case rule to AMSTAR-2's input (or vice versa) silently produces a wrong answer, not an error.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
