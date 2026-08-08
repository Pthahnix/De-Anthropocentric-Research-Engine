# Unit Segmentation — Subagent Prompt

Split the paper's text into the units that a downstream classification pass
will label one-by-one. This SOP does no labeling itself — only splitting.

## Input
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)
- **segmentation_granularity**: "sentence" or "clause" (clause = further split on commas/semicolons within a sentence, matching CODA-19's own approach: 103,978 sentences → 168,286 clause-level fragments)
- **scope**: "full_text" | "abstract" | "intro_only" — which part of the paper to segment (Swales move analysis, for instance, is scoped to the introduction only)

Read `./references/reading-the-source.md` before you start.

Map `scope` directly onto the index and read exactly that range: abstract,
introduction, or the whole file. Do not segment outside the requested scope.

## Output
- **units**: ordered list of the resulting text spans (sentences or clauses per segmentation_granularity, restricted to scope)
- **unit_offsets**: ordered list of `{line, start, end}`, one per unit. `line` is the 1-indexed line number in `source.md`; `start`/`end` are character offsets within that line. A unit spanning a line break uses its starting line.

## Instructions
1. Respect `scope` strictly — if scope is "intro_only", do not segment the rest of the paper even if it seems useful context; the caller asked for this specific scope for a reason (e.g. Swales's method is defined only over introductions).
2. Clause splitting on commas/semicolons will occasionally produce a fragment that isn't a complete clause grammatically — that's expected and matches the source methodology's own behavior (CODA-19 accepts this trade-off for finer-grained labeling), not a bug to silently "fix" by merging fragments back together.
