---
name: paper-fetch
description: Retrieve one specified academic paper (by title, arXiv ID, DOI, or URL) and land it on disk as source.md plus a source.meta.json carrying a line-number section index. Checks context/papers/ for an existing copy first and returns its path without refetching if found; otherwise tries alphaxiv, then Semantic Scholar for channel routing, then bioRxiv/medRxiv, in that fixed order, stopping at the first success. Use this as the mandatory first step whenever any other paper-reading SOP in this package needs the actual text of a paper — it is the sole entry point of the pipeline and every downstream SOP reads the files it lands. If it returns not_found, halt immediately; do not fabricate content or guess at the paper's likely contents.
version: 1.0.0
category: paper-reading
type: sop
execution: subagent
prompt: ./prompt.md
input: 'paper_ref (string — title, arXiv ID, DOI, or URL)'
output: 'status (string: "found" | "not_found"), cache_hit (boolean), source_path (string | null), meta_path (string | null), identifier (string | null), source_channel (string | null), source_url (string | null)'
dependencies:
  sops:
  - spawn-agent
---

# Paper Fetch

The pipeline's sole entry point: retrieves a paper and lands it on disk, via a cache check followed by a fixed four-channel fallback (alphaxiv → Semantic Scholar routing → bioRxiv/medRxiv → not_found). Decoupled from `literature-engine`'s `literature-research`/`literature-search`/`literature-overview` — this SOP holds its own MCP tool calls rather than delegating.

## Landed layout

```
context/papers/<timestamp>-<title-slug>/
  source.md            the paper, as fetched
  source.meta.json     metadata + line-number section index
```

All landed filenames are lowercase. `<title-slug>` is lowercased, non-alphanumerics collapsed to hyphens, Windows-illegal characters (`: * ? " < > |`) stripped, truncated to 60 chars against path-length limits.

## Execution

Subagent — spawned via spawn-agent skill.

## Why Subagent

Multi-step channel fallback with domain-inference judgment calls (is a Semantic-Scholar miss a bio signal or a "just not indexed anywhere" signal?) benefits from a dedicated context that can hold the whole decision tree without the noise of whatever task will consume its output next.

## Why it lands files instead of returning text

A paper runs 60-80k tokens. Returning it as `full_text` means every downstream SOP pays that cost again, and the orchestrating tactic carries it in its own window on top. Landing it once and returning a path means: re-reading the same paper across tactics costs one cache check rather than one fetch; SOPs that need only part of the paper read only that part; the orchestrator holds paths, not text.

## Why a section index, not pre-cut slices

`source.meta.json` records where each section *is* (line ranges) rather than shipping pre-cut slices. Slicing is a per-consumer concern — `unit-segmentation` already declares `scope: full_text | abstract | intro_only`, `research-question-appraisal` wants intro + abstract, `engineering-config-grading` wants method + experiments + appendix. Pre-cutting would mean this SOP has to know every downstream SOP's definition of "the part I need", and would need editing every time one is added. An index is neutral: consumers do their own offset reads against `source.md`.

This also makes `first-pass-skim`'s defining constraint (skim headings and captions, never section bodies) hold by construction rather than by self-restraint — it is handed line ranges for the shallow parts only.

## Cache lookup is by identifier, not directory name

Directories are named `<timestamp>-<title-slug>`, but `paper_ref` may arrive as an arXiv ID, a DOI, a URL, or a title, and matching an arXiv ID against a title-derived directory name fails. So the lookup scans `context/papers/*/source.meta.json` and matches on `identifier` or `title_slug` — both are recorded precisely so either form of `paper_ref` resolves.

Matching tolerates case and punctuation differences in titles but is deliberately not fuzzy: a missed cache hit costs one redundant fetch, while a false hit silently reads the wrong paper for the rest of the pipeline.

## Why Not Built on literature-engine

`literature-overview`/`literature-search`/`literature-research` already have an alphaxiv-primary/SS-supplementary pattern, but none has a bioRxiv/medRxiv branch or an explicit "can't retrieve → halt" contract, and this package is deliberately decoupled from that pipeline's scope (see `context/2026-08-07-15-15-paper-fetch-sop-design.md` and spec §9). Do not refactor this SOP to import those skills later without revisiting that decision explicitly.

## Full design reference

`context/2026-08-07-15-15-paper-fetch-sop-design.md` — the channel decision-flow rationale (why alphaxiv's coverage list is the domain signal, why an SS miss still routes to bio rather than dead-ending). The landing / index / cache design is in `context/2026-08-07-23-01-sop-io-contract-simulation.md` §4, option C.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
