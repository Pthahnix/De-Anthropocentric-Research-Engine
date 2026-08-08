---
name: claim-writing
description: Blind-rewrite a citing sentence (citance) from another paper into a single atomic, independently-verifiable claim (SciFact's annotation protocol) — never looking at the cited paper's content while rewriting. Use this when you have a specific citing sentence and want it decomposed into checkable atomic claims, as the first step before rationale-selection and claim-label-prediction.
version: 1.0.0
category: paper-reading
type: sop
execution: subagent
prompt: ./prompt.md
input: 'citance (string — a sentence citing the paper under study, supplied by the caller)'
output: 'atomic_claim (string, or list of strings if the citance was compound)'
dependencies:
  sops:
  - spawn-agent
---

# Claim Writing

Blind rewrite of a citance into an atomic verifiable claim — first step of the SciFact 3-chain.

## Execution

Subagent — spawned via spawn-agent skill.

## Input Requirement This Package Cannot Auto-Supply

SciFact's own method requires a citance — a sentence FROM ANOTHER PAPER that cites the paper under study. `paper-fetch` only ever retrieves the text of the single paper being read; it has no mechanism to discover or supply a citance about that paper. Callers using this SOP must supply `citance` themselves (e.g. from a specific citation-verification task they already have in hand) — this SOP cannot be exercised end-to-end starting only from a `paper_ref`, unlike every other SOP in this package. Do not "fix" this by having paper-fetch search for citing sentences; that would break paper-fetch's decoupled, single-purpose design (spec §9).

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
