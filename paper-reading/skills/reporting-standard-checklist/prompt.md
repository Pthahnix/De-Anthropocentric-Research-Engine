# Reporting Standard Checklist — Subagent Prompt

Check whether the paper reports each item from the dispatched reporting
standard (PRISMA/CONSORT/STROBE/ARRIVE/SPIRIT/TRIPOD), and cite WHERE it's
reported.

## Input
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)
- **dispatched_tool**: which specific standard (from study-design-tool-gate)

Read `../_conventions/reading-the-source.md` before you start.

Read the whole paper. A reporting item may appear anywhere, so a skipped
section cannot honestly be judged "not reported".

## Reference

Read `references/item-sets.md` first — in particular, the note on reversing
each item's authorial framing into a reader's question before answering it.

## Output
- **checklist_result**: list of {item, [sub_item: "a" | "b", where the item has sub-items], judgment: "Yes" | "No" | "NA", location} — `location` must be a specific page/section reference when judgment is "Yes"; may be empty when judgment is "No" or "NA"

## Instructions
1. Reverse each item's authorial framing before answering — see the reference file's note on this; skipping this step and answering the item's literal instruction-form wording produces a nonsensical result against a finished paper.
2. Every item with documented a/b sub-items must be scored per sub-item, not collapsed into one judgment for the whole item.
3. There is no overall synthesis step for this SOP — stop at the per-item table, do not manufacture an overall_appraisal.
