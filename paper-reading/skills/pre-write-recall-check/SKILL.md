---
name: pre-write-recall-check
description: Independently extract a paper's most important atomic facts directly from the raw source (before looking at the bundle at all), then check whether the bundle covers each one — catching content the bundle omitted. Use this before any article drafting begins, alongside pre-write-precision-check, immediately after extract-structured-bundle produces the bundle. This is a distinct check from precision-check — it catches omissions, not wrong claims — and must never be merged into it.
execution: subagent
prompt: ./prompt.md
input: paper_ref (string), bundle (dict)
output: recall_result (dict — failure_type, missing_nuggets)
dependencies:
  sops:
  - spawn-agent
  - literature-research
---

# Pre-Write Recall Check

Nugget-coverage method (adapted from TLDR/SciTLDR research): independently extract the paper's most important facts from raw source BEFORE looking at the bundle, then check bundle coverage. Catches omission errors — important content the bundle left out.

## Execution

Subagent — spawned via subagent-spawning/spawn-agent skill.

## Why Subagent

Independent nugget extraction must happen in a context that hasn't yet seen the bundle — reading the bundle first and then asking "did we miss anything?" biases the check toward confirming what's already there rather than discovering what's missing.

## Why This Is a Separate SOP From pre-write-precision-check

Precision checks whether stated claims are supported (commission errors); recall checks whether important content was left out (omission errors). These have different mechanisms (checking existing claims vs. independently generating a reference set) and different failure remedies (retry_deep_read vs. retry_deep_read_supplement per failure-routing) — see design spec §2 point 1. Do not collapse this sop's logic into pre-write-precision-check.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |
| literature-research | Full-text paper reading via alphaxiv. Import from literature-engine. |

<!-- END available-tables (generated) -->
