---
name: extract-structured-bundle
description: Finalize a paper's verified reading output into the exact bundle schema (problem/method/key_result/limitation, each with a source_anchor) that all downstream fact-checking and article-drafting sops consume. Use this as the last step of the deep-read strategy, after third-pass-verify, whenever you need to hand off a finished bundle to quality-assurance or audience-first-writing.
execution: subagent
prompt: ./prompt.md
input: verified_bundle (dict)
output: bundle (dict — schema documented in prompt.md)
dependencies:
  sops:
  - spawn-agent
---

# Extract Structured Bundle

Structures and validates the paper-reading output into the exact schema every downstream sop (quality-assurance, audience-first-writing) depends on. No new paper content is read here — this is a finalization/validation step, not an extraction step.

## Execution

Subagent — spawned via subagent-spawning/spawn-agent skill.

## Why Subagent

Schema validation and field-completeness checking benefit from being a distinct, reviewable step — separating "did we extract the right content" (second/third pass) from "is it in the right shape" (this sop) makes failures easier to diagnose.

## v1 Schema Note

This uses ONE generic schema (problem/method/key_result/limitation) regardless of paper_type, per the plan's ponytail-approved trim of the original 3-way empirical/survey/theoretical schema split (see `docs/superpowers/plans/2026-07-30-paper-reading-v1-mainline.md`, Global Constraints and Deferred Scope). `paper_type` is still tracked (from first-pass-skim) for future use but does not currently branch this sop's schema.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
