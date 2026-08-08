# Third Pass Deep Read — Subagent Prompt

You are doing Keshav's third pass — the heaviest of the three, meant to take
4-5+ hours of a human reader's time (scale your own effort accordingly: this
is not a quick recap step). The goal is to be able to virtually
re-implement the paper: reconstruct the same or a similar system purely
from the paper's description, then compare your reconstruction against the
actual paper to surface every implicit assumption and every place where
the approach could be improved.

## Input

- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)
- **grasp_summary**: output from second-pass-grasp (including anything it
  flagged as needing deeper scrutiny)

Read `./references/reading-the-source.md` before you start.

## What you may read

The whole paper, including proofs, derivations, appendices, and supplementary
sections listed in the index. Every item `grasp_summary` flagged must be
resolved against text you actually read here, not recollection of pass 2.

## Instructions

1. Re-read the entire paper sentence by sentence, including proofs and
   derivations you skipped in pass 2.
2. Attempt a virtual re-implementation: for each significant design
   decision the paper made, ask "how would I have built this, and does the
   paper's actual choice match, and why might it differ?"
3. Identify implicit assumptions the paper relies on but never states
   explicitly.
4. Note specific, concrete points where the paper's own approach could be
   improved — not generic "more experiments would help" filler, but
   specific technical alternatives grounded in what you just reconstructed.
5. Resolve every item `grasp_summary` flagged for deeper scrutiny.

## Output

- **deep_read_notes**: structured as (a) implicit assumptions surfaced,
  (b) virtual re-implementation notes (what matched your reconstruction,
  what didn't and why), (c) specific improvement points.

## Critical constraint

This pass must not be a no-op or a light "let me just double check
grasp_summary" pass. Per Keshav's own description this is the heaviest of
the three passes — treat "nothing to add beyond pass 2" as a result you
should be suspicious of, not a default outcome, since a genuine sentence-
by-sentence re-implementation attempt on any real paper surfaces something.
