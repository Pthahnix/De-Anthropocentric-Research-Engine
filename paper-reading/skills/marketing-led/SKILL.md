---
name: marketing-led
description: Mass-audience 公众号 writing path — selects an angle, crafts a hook, drafts the article with a pre-set style constraint, and revises via a 3-sweep editing pass. Use this as the default (and, in v1, only) audience-first-writing tactic whenever the target is a public WeChat account audience rather than a professional/academic readership.
execution: tactic
dependencies:
  sops:
  - angle-selection
  - hook-crafting
  - section-drafting-with-style
  - seven-sweeps-revision
  - post-write-drift-check
  - failure-routing
---

# Marketing-Led

Mass-audience drafting path: angle → hook → styled draft → revision → drift check.

## Available SOPs

- `angle-selection` (subagent, shared with content-faithful in v2) — pick the framing angle
- `hook-crafting` (subagent) — write the opening hook
- `section-drafting-with-style` (subagent) — draft the full article
- `seven-sweeps-revision` (subagent) — 3-sweep revision pass (v1 scope, see plan Global Constraints)
- `post-write-drift-check` (subagent, shared with quality-assurance) — verify the draft against the bundle
- `failure-routing` (import, shared) — route any drift failure

## Execution Guidance

1. Run `angle-selection` first.
2. Run `hook-crafting` using the chosen angle.
3. Run `section-drafting-with-style`, which drafts the full article (hook included, refined in context) — style is a pre-generation constraint fed into this sop's own drafting prompt, never a separate post-hoc style-rewrite step.
4. Run `seven-sweeps-revision` on the draft.
5. Run `post-write-drift-check` against the bundle. If `drift_fail`, call `failure-routing` and redraft only the affected section (return to step 3/4 for that section, not step 1).

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| angle-selection | Pick the article's framing angle. |
| hook-crafting | Write the article's opening hook. |
| section-drafting-with-style | Draft the full article with a pre-set style constraint. |
| seven-sweeps-revision | Run a multi-pass editorial revision. |
| post-write-drift-check | Verify the draft against the bundle. |
| failure-routing | Route a detected drift failure. |

<!-- END available-tables (generated) -->
