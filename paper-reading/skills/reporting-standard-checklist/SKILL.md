---
name: reporting-standard-checklist
description: Check whether a paper reports each item from PRISMA, CONSORT, STROBE, ARRIVE, SPIRIT, or TRIPOD (per whichever study-design-tool-gate dispatched to), citing where each item is or isn't addressed — including a/b sub-item hierarchy where the standard defines one. Use this after study-design-tool-gate has dispatched to one of these 6 reporting standards; this checks report completeness (did they say where), not methodological quality (was the study done well) — there is no overall synthesis step, judgment per item is the terminal output.
execution: subagent
prompt: ./prompt.md
input: 'full_text (string), dispatched_tool (string)'
output: 'checklist_result (list of {item, sub_item, judgment, location})'
dependencies:
  sops:
  - spawn-agent
---

# Reporting Standard Checklist

Per-item report-completeness check (with location citation) across PRISMA/CONSORT/STROBE/ARRIVE/SPIRIT/TRIPOD. No integration step — unlike quality-appraisal-checklist, judgment per item IS the terminal output.

## Execution

Subagent — spawned via spawn-agent skill.

## Reference

`references/item-sets.md` — the authorial-to-reader reversal note that applies to all 6 standards is there, read before drafting (Progressive Disclosure — kept out of this SKILL.md body).

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
