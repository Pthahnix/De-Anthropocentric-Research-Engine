---
name: dual-gate-verification
description: Strict verification path — runs an exhaustive precision check and an exhaustive recall check against the bundle before drafting, then a drift check after drafting, routing any failure back to the appropriate upstream step. This is the default (and, in v1, only) quality-assurance tactic; use it for every run unless a future spot-check or human-in-loop tactic is explicitly requested.
execution: tactic
dependencies:
  sops:
  - pre-write-precision-check
  - pre-write-recall-check
  - post-write-drift-check
  - failure-routing
---

# Dual Gate Verification

Exhaustive precision + recall check before writing, exhaustive drift check after writing, with typed failure routing.

## Available SOPs

- `pre-write-precision-check` (subagent) — checks every bundle claim against the source
- `pre-write-recall-check` (subagent) — checks the bundle covers every important source nugget
- `post-write-drift-check` (subagent, shared with audience-first-writing) — checks the drafted article against the bundle
- `failure-routing` (import, shared) — decides where to route any detected failure

## Execution Guidance

1. Run `pre-write-precision-check` and `pre-write-recall-check` — both independently re-query the raw paper, never just re-check the bundle against itself (spec §6's "Critical design constraint").
2. If either reports a failure, call `failure-routing` with the appropriate `failure_type` and follow its `next_action` — do not proceed to drafting on a failed gate.
3. Only once both gates report `none`, proceed to `audience-first-writing`.
4. After drafting completes, `post-write-drift-check` runs (invoked from within audience-first-writing, per spec §7's cross-strategy dependency) — if it reports `drift_fail`, call `failure-routing` again and redraft the affected section.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| pre-write-precision-check | Check every bundle claim against the raw source text. |
| pre-write-recall-check | Check the bundle covers every important source nugget. |
| post-write-drift-check | Check the drafted article against the bundle for drift. |
| failure-routing | Decide where to route a detected failure. |

<!-- END available-tables (generated) -->
