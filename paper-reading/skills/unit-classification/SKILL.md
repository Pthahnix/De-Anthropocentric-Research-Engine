---
name: unit-classification
description: Classify each pre-segmented text unit independently against a fixed label set (Argumentative Zoning, CoreSC, PubMed-RCT, Swales move/step, CODA-19, TDMS, or CSFCube's facet labels), single-layer with no cross-unit dependency. Use this after unit-segmentation has split the text, whenever a sentence- or clause-level rhetorical/functional classification is needed; do not use this for methods requiring document-level coreference reasoning (see multi-stage-cascade-extraction instead).
execution: subagent
prompt: ./prompt.md
input: 'units (list of strings), unit_offsets (list of {start, end}), label_set (string — name of the label vocabulary), hierarchy_toggle (boolean), output_type (string: "single_label" | "span_level" | "tuple")'
output: 'classified_units (list of {unit_text, offset, label(s)})'
dependencies:
  sops:
  - spawn-agent
---

# Unit Classification

Single-layer per-unit classification against a fixed, parameterized label set — no cross-unit or document-level dependency. Covers 7 methods (AZ/CoreSC/PubMed-RCT/NICTA-PIBOSO/CSAbstruct/CODA-19/Swales) plus TDMS's tuple-output variant, plus CSFCube's 3 facet labels as one more label_set option.

## Execution

Subagent — spawned via spawn-agent skill.

## Why SciERC/SciREX/NCG Are NOT Parameterized Here

An earlier graph draft tried to fold SciERC/SciREX into this node via a boolean toggle; the coverage audit (S6) found this doesn't work — those methods need document-level coreference clustering and (for SciREX) saliency judgment over ALL mentions in the paper, not per-unit independent classification. A boolean can't absorb that difference; they live in `multi-stage-cascade-extraction` instead.

## CSFCube's Role Here

`csfcube-facet` is documented as out-of-scope as its own SOP (its real task — multi-document pairwise relevance ranking — has no single-paper analog), but its 3 facet-label definitions (Background/Objective, Method, Result) are reused here as one more valid `label_set` option, per spec §3.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
