---
name: second-pass-grasp
description: Keshav's second pass — a careful full read (ignoring proof/derivation detail) producing prose-level understanding sufficient to explain the paper's main contribution and evidence to a colleague. Use this after first-pass-skim, as the main content-grasping pass of the Keshav three-pass method; do not force its output into a structured data schema.
execution: subagent
prompt: ./prompt.md
input: 'source_path (string), meta_path (string), skim_notes (string)'
reads: 'full paper body; skips proofs and derivations by instruction, not by omission'
output: 'grasp_summary (string)'
dependencies:
  sops:
  - spawn-agent
---

# Second Pass Grasp

Keshav's second pass: full read, proofs/derivations deferred, output is accumulated prose understanding (not a structured artifact — this is the one method in this package's whole method set that deliberately does not produce a persisted structured object).

## Execution

Subagent — spawned via spawn-agent skill.

## Why Subagent

Full-text reading toward a genuine "could explain this to a colleague" understanding benefits from an uninterrupted context, distinct from the shallow first pass and the exhaustive third pass.

## Do not port v1's bundle schema here

An earlier version of this package (`staged/wechat-article-v1/skills/second-pass-grasp/`) produced a `draft_bundle` + `uncertain_fields` structure for its own WeChat-article pipeline. That was correct for v1's purpose but is NOT Keshav's original second pass — this v2 SOP's output is prose, per the graph's explicit correction (`context/2026-08-07-13-42-sop-pipeline-graph.html`, node `second-pass-grasp`, "S2修订"). Do not reintroduce the bundle schema here.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
