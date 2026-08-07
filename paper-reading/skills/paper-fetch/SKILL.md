---
name: paper-fetch
description: Retrieve the full text of one specified academic paper (by title, arXiv ID, DOI, or URL) by trying alphaxiv, then Semantic Scholar for channel routing, then bioRxiv/medRxiv, in that fixed order, stopping at the first success. Use this as the mandatory first step whenever any other paper-reading SOP in this package needs the actual text of a paper — it is the sole entry point of the pipeline and every downstream SOP depends on its output. If it returns not_found, halt immediately; do not fabricate content or guess at the paper's likely contents.
execution: subagent
prompt: ./prompt.md
input: 'paper_ref (string — title, arXiv ID, DOI, or URL)'
output: 'status (string: "found" | "not_found"), full_text (string | null), source_channel (string | null), source_url (string | null), identifier (string | null)'
dependencies:
  sops:
  - spawn-agent
---

# Paper Fetch

The pipeline's sole entry point: retrieves a paper's full text via a fixed four-channel fallback (alphaxiv → Semantic Scholar routing → bioRxiv/medRxiv → not_found), decoupled from `literature-engine`'s `literature-research`/`literature-search`/`literature-overview` — this SOP holds its own MCP tool calls rather than delegating.

## Execution

Subagent — spawned via spawn-agent skill.

## Why Subagent

Multi-step channel fallback with domain-inference judgment calls (is a Semantic-Scholar miss a bio signal or a "just not indexed anywhere" signal?) benefits from a dedicated context that can hold the whole decision tree without the noise of whatever task will consume its output next.

## Why Not Built on literature-engine

`literature-overview`/`literature-search`/`literature-research` already have an alphaxiv-primary/SS-supplementary pattern, but none has a bioRxiv/medRxiv branch or an explicit "can't retrieve → halt" contract, and this package is deliberately decoupled from that pipeline's scope (see `context/2026-08-07-15-15-paper-fetch-sop-design.md` and spec §9). Do not refactor this SOP to import those skills later without revisiting that decision explicitly.

## Full design reference

`context/2026-08-07-15-15-paper-fetch-sop-design.md` — the complete decision-flow rationale (why alphaxiv's coverage list is the domain signal, why an SS miss still routes to bio rather than dead-ending) lives there; `prompt.md` here is that design already transcribed into subagent instructions.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
