---
name: post-write-drift-check
description: Back-summarize the finished article draft and diff it against the already-verified bundle to catch drift (new errors or omissions introduced during drafting/styling) — even when the bundle itself already passed precision and recall checks. Use this immediately after any drafting sop (section-drafting-with-style, or any future content-faithful/hybrid drafting sop) produces an article_draft, before considering the article final. Shared by both quality-assurance and audience-first-writing.
execution: subagent
prompt: ./prompt.md
input: bundle (dict), article_draft (string)
output: drift_result (dict — failure_type, drift_issues)
dependencies:
  sops:
  - spawn-agent
---

# Post-Write Drift Check

Back-summarization diff: read the finished article fresh, compare against the bundle, flag drift. Catches errors introduced by rewriting/styling — style is exactly where new commission/omission errors sneak in, per the design spec's ideation findings (§2 point 3).

## Execution

Subagent — spawned via subagent-spawning/spawn-agent skill.

## Why Subagent

The back-summarization step needs a reading of the article that isn't anchored to having just written it — the same "fresh eyes" principle as the pre-write checks, applied post-draft.

## Shared Across Strategies

Defined here under quality-assurance (this task), but invoked by `audience-first-writing`'s drafting tactics too (spec §7's "Cross-strategy dependency", §8's shared-sops table) — not redefined there, just referenced.

## Scope Boundary

This sop diffs article-vs-bundle only. It does NOT re-query the raw paper — that would duplicate pre-write-precision-check's job. If the bundle itself turns out to be wrong, that should already have been caught before drafting ever started; this check assumes the bundle was correct and only asks whether the draft stayed faithful to it.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
