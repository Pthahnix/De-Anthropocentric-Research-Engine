---
name: quality-assurance
description: Verification strategy that independently re-checks a paper bundle's precision (no unsupported claims) and recall (nothing important omitted) against the original source, before any article drafting begins, then re-checks the finished draft for drift. Use this after deep-read produces a bundle and before audience-first-writing drafts an article — this is the mandatory middle strategy of the paper-reading pipeline.
execution: strategy
dependencies:
  sops:
  - dual-gate-verification
---

# Quality Assurance

**Purpose**: Catch commission errors (wrong claims) and omission errors (missing content) in the bundle before writing, and drift errors (rewrite diverged from bundle) after writing — via independent re-querying of the source, never by checking the bundle against itself.

**When to use**: Always, between deep-read and audience-first-writing — the second strategy in the fixed pipeline sequence (see `paper-reading/ENTRY.md`).

## Available Tactics

- `dual-gate-verification` — the only tactic in v1 (exhaustive strict path). `lightweight-spot-check` (sampled) and `human-in-loop` (high-stakes) are deferred to v2.

## Execution Guidance

Invoke `dual-gate-verification` directly. There is no tactic-selection decision in v1 since only one tactic exists.

## Failure Routing

See `failure-routing` sop — this strategy never proceeds past a detected precision or recall failure; it always routes back to `deep-read` first.
