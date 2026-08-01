---
name: deep-read
description: Deep-reading strategy that turns a single specified academic paper into a structured, source-anchored bundle (problem, method, key results, limitations) ready for fact-checking and article drafting. Use this whenever the user names one specific paper (by arXiv ID, URL, or title) and wants it read, summarized, explained, or turned into content — this is the entry point of the paper-reading pipeline.
execution: strategy
dependencies:
  sops:
  - progressive-passes
---

# Deep Read

**Purpose**: Turn one specified paper into a structured bundle with source anchors, via progressive multi-pass reading.

**When to use**: The user has named one specific paper and wants it deeply understood — the first strategy in the paper-reading pipeline (see `paper-reading/ENTRY.md` for the full 3-strategy sequence: deep-read → quality-assurance → audience-first-writing).

## Available Tactics

- `progressive-passes` — the only tactic in v1 (default, full 3-pass read). `targeted-extraction` (angle-first, cheaper) is deferred to v2.

## Execution Guidance

Invoke `progressive-passes` directly. There is no tactic-selection decision in v1 since only one tactic exists.

## Output

A structured bundle (see `extract-structured-bundle` sop for the exact schema) — this is what `quality-assurance` and `audience-first-writing` both consume next.
