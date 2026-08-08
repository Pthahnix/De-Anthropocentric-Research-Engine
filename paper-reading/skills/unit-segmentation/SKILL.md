---
name: unit-segmentation
description: Split a paper's text into sentence- or clause-level units (with character offsets) for downstream classification, at a caller-specified granularity and scope (full text, abstract-only, or intro-only). Use this as the mandatory first step whenever any sentence/clause-level classification method (Argumentative Zoning, CoreSC, PubMed-RCT, CSAbstruct, Swales move analysis, CODA-19) needs its input pre-segmented — always precedes unit-classification.
version: 1.0.0
category: paper-reading
type: sop
execution: subagent
prompt: ./prompt.md
input: 'source_path (string), meta_path (string), segmentation_granularity (string: "sentence" | "clause"), scope (string: "full_text" | "abstract" | "intro_only")'
output: 'units (list of strings), unit_offsets (list of {line: int, start: int, end: int} — line is 1-indexed into source.md, start/end are character offsets within that line)'
reads: 'exactly the range named by scope'
dependencies:
  sops:
  - spawn-agent
---

# Unit Segmentation

Splits text into labeling units (sentence or clause granularity, scoped to full text/abstract/intro) — pure segmentation, no labeling.

## Execution

Subagent — spawned via spawn-agent skill.

## Why This Exists As Its Own Step

7 different classification methods (AZ, CoreSC, PubMed-RCT, NICTA-PIBOSO, CSAbstruct, CODA-19, Swales) all need pre-segmented units but disagree on granularity and scope — factoring segmentation out once, parameterized, avoids duplicating this logic inside `unit-classification` seven times over (graph correction L17/L18: the original graph was missing this step entirely, silently assuming pre-segmented input existed).

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
