---
name: second-pass-grasp
description: Full-text deep-read of a paper's Introduction, Method, and Results sections to draft the structured bundle (problem, method, key results with hedge levels, limitations), each field carrying a precise source anchor. Use this after first-pass-skim has classified the paper and drafted candidate angles — this is the main content-extraction pass of the reading pipeline.
execution: subagent
prompt: ./prompt.md
input: paper_ref (string), paper_type (string), skim_notes (string)
output: draft_bundle (dict), uncertain_fields (list of strings)
dependencies:
  sops:
  - spawn-agent
  - literature-research
---

# Second Pass Grasp

Keshav's second pass: full read of Introduction/Method/Results, drafting the structured bundle with precise source anchors and per-claim hedge levels.

## Execution

Subagent — spawned via subagent-spawning/spawn-agent skill.

## Why Subagent

Full-text extraction across multiple sections into a consistent schema benefits from a dedicated context — avoids extraction drift between fields that a shared/shorter context could introduce.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |
| literature-research | Full-text paper reading via alphaxiv. Import from literature-engine. |

<!-- END available-tables (generated) -->
