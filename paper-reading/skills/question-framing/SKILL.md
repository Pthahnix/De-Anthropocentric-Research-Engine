---
name: question-framing
description: Fill a slot-based question-framing schema (PICO, PECO, or SPIDER) from a paper's stated research question. Use this whenever the user wants a paper's research question structured into one of these standard clinical/qualitative-research question frames; this frames what question is being asked, it does not read or evaluate the paper's content otherwise.
execution: subagent
prompt: ./prompt.md
input: 'source_path (string), meta_path (string), slot_definitions (string — one of PICO, PECO, SPIDER)'
reads: 'abstract and method sections'
output: 'framed_question (dict — schema-specific slot names to values)'
dependencies:
  sops:
  - spawn-agent
---

# Question Framing

Slot-filling into PICO/PECO/SPIDER, parameterized on which schema — defines the question being asked, doesn't evaluate paper content.

## Execution

Subagent — spawned via spawn-agent skill.

## Not the same as research-question-appraisal

This SOP fills slots to describe what question is asked. `research-question-appraisal` (FINER) instead judges whether a research question is good — different structure, different SOP, not a parameterization of this one (see graph correction M15).

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
