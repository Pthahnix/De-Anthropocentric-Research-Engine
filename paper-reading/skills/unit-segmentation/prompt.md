# Unit Segmentation — Subagent Prompt

Split the paper's text into the units that a downstream classification pass
will label one-by-one. This SOP does no labeling itself — only splitting.

## Input
- **full_text**: the paper's full text
- **segmentation_granularity**: "sentence" or "clause" (clause = further split on commas/semicolons within a sentence, matching CODA-19's own approach: 103,978 sentences → 168,286 clause-level fragments)
- **scope**: "full_text" | "abstract" | "intro_only" — which part of full_text to segment (Swales move analysis, for instance, is scoped to the introduction only)

## Output
- **units**: ordered list of the resulting text spans (sentences or clauses per segmentation_granularity, restricted to scope)
- **unit_offsets**: ordered list of {start, end} character offsets into full_text, one per unit, so a downstream SOP can cite exact locations rather than re-searching for the text

## Instructions
1. Respect `scope` strictly — if scope is "intro_only", do not segment the rest of the paper even if it seems useful context; the caller asked for this specific scope for a reason (e.g. Swales's method is defined only over introductions).
2. Clause splitting on commas/semicolons will occasionally produce a fragment that isn't a complete clause grammatically — that's expected and matches the source methodology's own behavior (CODA-19 accepts this trade-off for finer-grained labeling), not a bug to silently "fix" by merging fragments back together.
