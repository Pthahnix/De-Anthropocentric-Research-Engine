---
name: failure-routing
description: Fixed lookup table mapping a detected verification failure type (precision_fail, recall_fail, drift_fail, none) to the specific upstream pipeline step to route back to. Use this immediately after pre-write-precision-check, pre-write-recall-check, or post-write-drift-check report a result, to decide whether and where to loop back rather than proceeding.
execution: import
prompt: ./prompt.md
input: failure_type (string — one of precision_fail, recall_fail, drift_fail, none)
output: next_action (string), justification (string)
---

# Failure Routing

Pure lookup logic implementing the paper-reading pipeline's failure-routing table (design spec §3). No MCP calls, no subagent dispatch — a fixed decision table.

## Execution

Import — strict protocol execution, no subagent judgment needed since the routing is a fixed table, not an analytical task.

## Why Not a Subagent

Unlike every other sop in this package, this one has no paper-content judgment to make — it's a 4-row lookup table. Spawning a full subagent for a fixed lookup would be wasted cost; this sop is read and applied inline by whichever strategy calls it.

## Shared Across

Used by `dual-gate-verification` (all its checks) and by `audience-first-writing`'s post-write drift check (see spec §8's shared-sops table).
