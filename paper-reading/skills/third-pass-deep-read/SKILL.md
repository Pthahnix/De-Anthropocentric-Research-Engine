---
name: third-pass-deep-read
description: Keshav's third pass — the heaviest of the three, a full sentence-by-sentence re-read including proofs/derivations, attempting a virtual re-implementation of the paper to surface implicit assumptions and concrete improvement points. Use this after second-pass-grasp, as the terminal step of the Keshav three-pass method, whenever genuine mastery of a paper (not just a summary) is needed. This is not a skippable recap — treat "nothing new to add" as suspicious, not a default outcome.
version: 1.0.0
category: paper-reading
type: sop
execution: subagent
prompt: ./prompt.md
input: 'source_path (string), meta_path (string), grasp_summary (string)'
reads: 'full paper body including proofs and derivations'
output: 'deep_read_notes (string)'
dependencies:
  sops:
  - spawn-agent
---

# Third Pass Deep Read

Keshav's third pass: sentence-by-sentence re-read with proofs/derivations included, attempting virtual re-implementation. The heaviest pass of the three — terminal step of the Keshav cascade.

## Execution

Subagent — spawned via spawn-agent skill.

## Why renamed from `third-pass-verify` (v1's name)

v1's version of this SOP (`staged/wechat-article-v1/skills/third-pass-verify/`) treated this as a "targeted re-check of uncertain_fields, no-op if none flagged" step — which, per the coverage audit's S2 finding, effectively deleted Keshav's real third pass (a 4-5+ hour re-implementation attempt) and replaced it with a cheap verification step serving v1's own pipeline. This v2 SOP restores the actual third pass; the rename to `third-pass-deep-read` marks that this is not the same behavior as the old `third-pass-verify`, even though both sit in the same cascade position.

## Why Subagent

A genuine re-implementation attempt needs a context that can hold the full paper and reason through design alternatives without being anchored to how pass 2 already framed the contribution.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
