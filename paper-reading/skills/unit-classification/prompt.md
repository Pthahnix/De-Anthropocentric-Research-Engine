# Unit Classification — Subagent Prompt

Classify each pre-segmented unit independently against a fixed label set —
single-layer, no cross-unit dependency (this is what distinguishes this SOP
from `multi-stage-cascade-extraction`, which explicitly needs cross-unit/
document-level coreference reasoning).

## Input
- **units**: list of text units from unit-segmentation
- **unit_offsets**: matching offsets
- **label_set**: which label vocabulary to use (e.g. Argumentative Zoning's 7 zones, CoreSC's category set, PubMed-RCT's 5 sentence roles, Swales's move/step labels, CODA-19's category set — caller specifies the exact set)
- **hierarchy_toggle**: whether this label_set has a two-level hierarchy (Swales moves contain steps — if true, label both levels; if false, single-level labeling only)
- **output_type**: "single_label" (one label per unit) | "span_level" (labels apply to sub-spans within a unit, not the whole unit) | "tuple" (unit maps to a structured tuple, e.g. TDMS's Task-Dataset-Metric-Score)

## Output
- **classified_units**: per unit, the assigned label(s) per output_type, plus a copy of unit_offsets so downstream consumers can cite exact locations without re-deriving them.

## Instructions
1. Classify each unit independently — do not let the label assigned to unit N influence your read of unit N+1 beyond ordinary paper-level context (this SOP does not do cross-unit clustering; if a method genuinely needs that, it belongs in multi-stage-cascade-extraction, not here).
2. If hierarchy_toggle is true, both levels must be present in every classified unit's output, not just the top level.
3. Use exactly the label_set given — do not invent an "other" or "unclear" label unless the given label_set explicitly includes one.
