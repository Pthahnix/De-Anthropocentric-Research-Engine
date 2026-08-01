---
name: progressive-passes
description: Full 3-pass progressive deep-reading of a paper — skim, grasp, targeted verify — producing a structured bundle ready for fact-checking and article drafting. This is the default reading tactic for the paper-reading package; use it whenever no angle is already decided and you're starting from a bare paper reference.
execution: tactic
dependencies:
  sops:
  - first-pass-skim
  - second-pass-grasp
  - third-pass-verify
  - extract-structured-bundle
---

# Progressive Passes

Keshav's 3-pass method, adapted into 3 sequential sops plus a finalization step:

1. **first-pass-skim** — 5-minute skim, classify paper type, draft candidate angles
2. **second-pass-grasp** — deep-read core sections, draft the bundle
3. **third-pass-verify** — targeted re-read for any bundle field still uncertain after pass 2
4. **extract-structured-bundle** — finalize into the typed schema

## Available SOPs

- `first-pass-skim` (subagent) — pass 1
- `second-pass-grasp` (subagent) — pass 2
- `third-pass-verify` (subagent) — pass 3, only for fields flagged uncertain
- `extract-structured-bundle` (subagent) — finalization

## Execution Guidance

- Run all 4 sops in sequence — this tactic has no branching of its own (v1 has only this one deep-read tactic; `targeted-extraction` is deferred, see plan Deferred Scope).
- `third-pass-verify` may be a no-op if `second-pass-grasp` didn't flag anything uncertain — that's expected and not an error.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| first-pass-skim | Five-minute skim pass to classify paper type and draft candidate angles. |
| second-pass-grasp | Deep-read core sections to draft the bundle. |
| third-pass-verify | Targeted re-read for uncertain bundle fields. |
| extract-structured-bundle | Finalize bundle into the typed schema. |

<!-- END available-tables (generated) -->
