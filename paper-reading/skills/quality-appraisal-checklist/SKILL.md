---
name: quality-appraisal-checklist
description: 'Run CASP (8 study-type variants), JBI (~6 variants), or AMSTAR-2 quality-appraisal checklists — each ending in the tool''s own required integrated judgment, not just item tallies. Also runs a proposal "rhetorical-completeness-check" mode (entry_mode="completeness_check") that instead diffs unit-classification''s rhetorical labels against a target checklist''s expected label set. Use this after study-design-tool-gate has dispatched to CASP/JBI/AMSTAR-2 (mode a), or directly after unit-classification when checking for missing argumentative moves (mode b, proposal/unverified).'
execution: subagent
prompt: ./prompt.md
input: 'entry_mode (string: "checklist" | "completeness_check"), source_path (string) and meta_path (string) and dispatched_tool (string) when entry_mode is "checklist", OR classified_units (list) and target_checklist_labels (list of strings) when entry_mode is "completeness_check"'
reads: 'method and results sections in checklist mode; nothing in completeness_check mode'
output: 'checklist_result (list of {item, judgment}), overall_appraisal (string, mode a only)'
dependencies:
  sops:
  - spawn-agent
---

# Quality Appraisal Checklist

CASP/JBI/AMSTAR-2 item-level appraisal + each tool's own required overall synthesis. Also hosts the proposal rhetorical-completeness-check as a second entry mode (see below) rather than as its own SOP file.

## Execution

Subagent — spawned via spawn-agent skill.

## Reference

`references/item-sets.md` — full item lists per tool/variant, read before drafting; kept out of this SKILL.md body per Progressive Disclosure (CASP alone has 8 variants).

## Why rhetorical-completeness-check Is a Mode Here, Not Its Own File

This plan's header documents a correction found while planning: the pipeline graph (`context/2026-08-07-13-42-sop-pipeline-graph.html`) never defines `rhetorical-completeness-check` as a node in its `nodes` array — it only appears as a method label on the edge `unit-classification → quality-appraisal-checklist`, with the edge's own inline comment ("M13修订") describing it as an entry mode into THIS SOP, not a standalone one. The design spec (§4) listed it as a separate file, but per the spec's own stated rule that the graph is the source of truth over the transcription, this SOP's `entry_mode` parameter is the correct home for it — building a 5th file here would silently inflate the buildable-SOP count past the spec's own stated total of 30.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
