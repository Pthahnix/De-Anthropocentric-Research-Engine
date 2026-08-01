---
name: section-drafting-with-style
description: Draft the full WeChat article from the verified bundle, chosen angle, and hook, applying a pre-set style guide and paragraph/figure-placement structural rules from the start — never as a post-hoc rewrite pass. Use this after hook-crafting has produced the opening hook, as the main drafting step of the marketing-led tactic.
execution: subagent
prompt: ./prompt.md
input: bundle (dict), chosen_angle (string), hook_text (string)
output: article_draft (string)
dependencies:
  sops:
  - spawn-agent
---

# Section Drafting With Style

Drafts the full article, section by section from bundle fields, with style and structural rules (paragraph length, figure placement) applied as pre-generation constraints. Absorbs the design spec's `visual-rhythm` checks as drafting rules rather than a separate sop (ponytail trim — see plan Global Constraints).

## Execution

Subagent — spawned via subagent-spawning/spawn-agent skill.

## Why Style Is Pre-Generation, Not Post-Hoc

Per design spec §2 point 3 and Paper2Blog's research finding: style/tone cannot be reliably checked-and-fixed after drafting by a script — it has to be a constraint the drafting prompt is written against from the start. This sop's prompt.md bakes the style guide directly into the drafting instructions rather than deferring it to a later rewrite step.

## Every Claim Must Trace to the Bundle

This is what makes `post-write-drift-check` (Task 9) meaningful — if the draft could introduce claims not present in the bundle, drift-checking would have nothing precise to diff against.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
