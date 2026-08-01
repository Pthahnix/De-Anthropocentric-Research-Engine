---
name: pre-write-precision-check
description: Independently fact-check every claim in a paper's bundle against the raw source text (Factored Verification method), flagging any claim the source doesn't actually support at a correctness score below 0.8. Use this before any article drafting begins, immediately after extract-structured-bundle produces the bundle — never skip this even if the bundle looks obviously correct, since research shows even top models hallucinate subtly when summarizing papers.
execution: subagent
prompt: ./prompt.md
input: paper_ref (string), bundle (dict)
output: precision_result (dict — failure_type, flagged_claims)
dependencies:
  sops:
  - spawn-agent
  - literature-research
---

# Pre-Write Precision Check

Factored Verification (Elicit, arXiv:2310.10627): decompose the bundle into claims, independently re-query the raw paper for each, score correctness. Catches commission errors — claims the source doesn't actually support.

## Execution

Subagent — spawned via subagent-spawning/spawn-agent skill.

## Why Subagent

Independent fact-checking requires a context that is NOT anchored to the drafting process that produced the bundle — a fresh subagent with no memory of how the bundle was written is what makes "independent" re-querying actually independent (spec §6, §2 point 2).

## Critical Constraint (repeated from prompt.md — load-bearing)

This sop MUST query the raw paper fresh for every claim. It must never treat the bundle's own `source_anchor` field as sufficient evidence — see the newsroom-fact-checker analogy in the design spec (§2 point 2): the checker re-reads the source independently, not the writer's notes about the source.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |
| literature-research | Full-text paper reading via alphaxiv. Import from literature-engine. |

<!-- END available-tables (generated) -->
