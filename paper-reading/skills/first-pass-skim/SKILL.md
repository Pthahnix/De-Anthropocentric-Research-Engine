---
name: first-pass-skim
description: Five-minute skim pass over a single academic paper (title, abstract, headings, figures, conclusion only) to classify the paper's type and draft candidate public-audience angles before any deep reading happens. Use this as the entry point whenever the user gives you one specific paper to summarize, explain, or turn into a WeChat/blog article, and you haven't classified the paper yet. Always run this before second-pass-grasp.
execution: subagent
prompt: ./prompt.md
input: paper_ref (string — arXiv ID, URL, or title)
output: paper_type (string), candidate_angles (list of 2-3 strings), skim_notes (string)
dependencies:
  sops:
  - spawn-agent
  - literature-overview
---

# First Pass Skim

Keshav's first pass: title/abstract/headings/figures/conclusion only, no body text. Classifies paper type and drafts candidate angles cheaply, before committing to the expensive second/third passes.

## Execution

Subagent — spawned via subagent-spawning/spawn-agent skill.

## Why Subagent

Skimming and classification benefit from a dedicated context that isn't polluted by later, deeper reading — keeps the "first impression" read honest and separately reviewable from the second pass's deep read.

## Why This Exists (not folded into second-pass-grasp)

Reading the whole paper every time is expensive. This pass exists so paper-type and angle hypotheses are available cheaply before deciding how much of the paper the second pass actually needs to read in depth — first-pass-skim's `paper_type` output determines which bundle fields `extract-structured-bundle` (Task 5) fills in later.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. Used by SOPs that declare execution: subagent. |
| literature-overview | Abstract-level paper scanning. Import from literature-engine. |

<!-- END available-tables (generated) -->
