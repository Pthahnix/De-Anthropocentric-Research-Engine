---
name: angle-selection
description: Pick which candidate angle to write the article around, cross-checked against the verified bundle so the chosen angle is actually substantiated by the paper (not just appealing at the skim stage). Use this as the first step of drafting, after quality-assurance has passed, whenever you have candidate_angles from first-pass-skim and a verified bundle.
execution: subagent
prompt: ./prompt.md
input: bundle (dict), candidate_angles (list of strings)
output: chosen_angle (string), rationale (string)
dependencies:
  sops:
  - spawn-agent
---

# Angle Selection

Selects the article's framing angle from first-pass-skim's candidates, cross-checked against the now-verified bundle. Runs after quality-assurance, not before — an angle chosen before verification risks confirmation bias (the design spec's ideation pass flagged pure angle-first ordering as riskier than random hallucination, since it turns verification into confirming the writer's own pre-committed framing).

## Execution

Subagent — spawned via subagent-spawning/spawn-agent skill.

## Why Subagent

Angle selection requires judgment about audience fit and substantiation-checking against the bundle — not a fixed lookup like failure-routing.

## v1 Scope Note

This sop's selection criterion is the marketing-led one only (content-pillar/audience-pain-point fit). A `content-faithful` variant (criterion: best represents the paper's core contribution) is deferred to v2 along with the `content-faithful` tactic — see plan Deferred Scope.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
