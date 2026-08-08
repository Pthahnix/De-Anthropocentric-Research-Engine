---
name: multi-stage-cascade-extraction
description: Run a multi-stage extraction cascade (mention detection, document-level coreference clustering, optional saliency judgment, N-ary relation/triple extraction) directly over a paper's full text — covers SciERC, SciREX, and NLP Contribution Graph. Use this whenever cross-sentence or document-level entity/relation extraction is needed (e.g. SciREX-style Task-Dataset-Metric-Score tuples); do NOT use unit-classification for this, since these methods reason over the whole document's mentions, not independently-classified sentence units.
version: 1.0.0
category: paper-reading
type: sop
execution: subagent
prompt: ./prompt.md
input: 'source_path (string), meta_path (string), stage_count (integer), per_stage_label_set (dict), saliency_layer_toggle (boolean)'
reads: 'full paper — coreference resolution needs every mention, wherever it occurs'
output: 'extraction_graph (dict — mentions, clusters, optional saliency_labels, relations)'
dependencies:
  sops:
  - spawn-agent
---

# Multi-Stage Cascade Extraction

Mention detection → coreference clustering → [saliency] → relation extraction, all stages consuming the full prior stage's output. Covers SciERC/SciREX/NLP-Contribution-Graph — three methods with different stage counts but the same "consume-the-full-prior-layer" structure (graph correction S6: merged under the unifying rule "same action-sequence length → mergeable via parameterization").

## Execution

Subagent — spawned via spawn-agent skill.

## Why Direct From paper-fetch, Not Through unit-segmentation

This cascade discovers its own mention spans over the whole document rather than consuming pre-segmented sentence/clause units — sentence-level segmentation is the wrong granularity for a method whose relations are 99% cross-sentence (SciREX's own reported figure). This is a deliberate graph choice, not an oversight — see spec §5's flagged note before "fixing" this dependency.

## Errors Compound Stage-Over-Stage

NLP Contribution Graph's own reported consistency figures fall from stage to stage (67.92% → 41.82% → 22.31%) — this is the shared risk profile of this whole method family, not specific to one method. Producing every stage's intermediate output (not just the final relations) is what makes this compounding visible and debuggable.

<!-- BEGIN available-tables (generated) -->

## Available SOPs

| SOP | When to use |
| --- | --- |
| spawn-agent | Spawn a customized CC subagent with full MCP tool access. |

<!-- END available-tables (generated) -->
