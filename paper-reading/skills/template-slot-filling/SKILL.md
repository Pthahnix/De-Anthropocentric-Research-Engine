---
name: template-slot-filling
description: Fill a paper's reported values into an already-given comparison-template attribute schema (e.g. Task/Dataset/Metric/Value) — the executable half of ORKG's comparison-template method. Use this when a template's attribute schema is already fixed and you need one paper's row filled in; this does NOT build new templates (that half is a human-curator task, out of scope).
execution: subagent
prompt: ./prompt.md
input: 'source_path (string), meta_path (string), template_attribute_schema (list of strings)'
reads: 'sections relevant to the requested attributes; the whole paper if the schema is broad'
output: 'filled_template (dict — attribute name to value or null+reason)'
dependencies:
  sops:
  - spawn-agent
---

# Template Slot Filling

Fills a paper's values into a pre-given attribute template (ORKG comparison-template's executable half). Building the template itself is excluded — documented as a human-curator task, not an LLM-executable SOP.

## Execution

Subagent — spawned via spawn-agent skill.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
