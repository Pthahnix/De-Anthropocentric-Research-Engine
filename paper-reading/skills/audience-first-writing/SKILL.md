---
name: audience-first-writing
description: Writing strategy that turns a verified paper bundle into a finished public-audience article — selecting an angle, applying a pre-set style constraint during drafting (never a post-hoc rewrite), and checking the result for drift against the bundle. Use this after quality-assurance has passed on the bundle — this is the final strategy of the paper-reading pipeline, producing the WeChat article itself.
execution: strategy
dependencies:
  sops:
  - marketing-led
---

# Audience-First Writing

**Purpose**: Produce the finished article from a verified bundle — angle selection, styled drafting, and post-write drift verification.

**When to use**: Always, after quality-assurance has passed — the third and final strategy in the fixed pipeline sequence (see `paper-reading/ENTRY.md`).

## Available Tactics

- `marketing-led` — the only tactic in v1 (mass-audience WeChat writing). `content-faithful` (professional-audience) and `hybrid-adaptive` (auto-selecting between them) are deferred to v2.

## Execution Guidance

Invoke `marketing-led` directly. There is no tactic-selection decision in v1 since only one tactic exists.

## Output

The finished 公众号 article text — the terminal output of the entire paper-reading pipeline.
