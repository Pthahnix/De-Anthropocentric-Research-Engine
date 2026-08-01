---
name: third-pass-verify
description: Targeted re-read of only the bundle fields flagged as uncertain by second-pass-grasp, using precise PDF queries rather than a full re-read. Use this immediately after second-pass-grasp whenever its uncertain_fields output is non-empty; skip straight to extract-structured-bundle when it's empty.
execution: subagent
prompt: ./prompt.md
input: paper_ref (string), draft_bundle (dict), uncertain_fields (list of strings)
output: verified_bundle (dict)
dependencies:
  sops:
  - spawn-agent
---

# Third Pass Verify

Keshav's third pass, scoped to only the fields second-pass-grasp flagged as uncertain. A no-op (pass-through) when nothing was flagged.

## Execution

Subagent — spawned via subagent-spawning/spawn-agent skill.

## Why Subagent

Even a targeted re-read benefits from a fresh context focused only on the flagged fields, so the verification isn't anchored to the same reasoning that produced the original uncertain draft.

## Calls alphaxiv directly (not via literature-research import)

This sop calls `answer_pdf_queries` directly rather than importing `literature-research`, because it needs field-specific targeted queries rather than a general full-text read — see spec §5's MCP tool mapping table ("direct alphaxiv.answer_pdf_queries calls, targeted by specific claim/field").

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
