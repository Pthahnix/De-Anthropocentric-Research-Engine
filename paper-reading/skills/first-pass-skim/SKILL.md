---
name: first-pass-skim
description: Keshav's first pass over one paper — a 5-10 minute skim of title, abstract, headings, figures, and conclusion only, producing skim notes and a read-deeper judgment. Use this as the first step whenever a paper is being read via the Keshav three-pass method; always precedes second-pass-grasp and never reads section bodies itself.
version: 1.0.0
category: paper-reading
type: sop
execution: subagent
prompt: ./prompt.md
input: 'source_path (string), meta_path (string)'
reads: 'title, abstract, all headings, figure captions, conclusion — never section bodies'
output: 'skim_notes (string), read_deeper (boolean)'
dependencies:
  sops:
  - spawn-agent
---

# First Pass Skim

Keshav's first pass: title/abstract/headings/figures/conclusion only, no body text — cheaply decides whether a paper is worth the deeper passes.

## Execution

Subagent — spawned via spawn-agent skill.

## Why Subagent

A dedicated context keeps the "first impression" honest and separately reviewable from the deeper passes that follow — it should not already know what pass 2 will later discover.

## Scope boundary (do not blur into second-pass-grasp)

This pass never reads section bodies. If asked to justify a claim by reading Methods/Results, that request belongs to second-pass-grasp, not here.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
