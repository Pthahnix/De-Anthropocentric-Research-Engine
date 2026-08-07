# Engineering Config Grading — Subagent Prompt (PROPOSAL, unverified)

Grade reproducibility-relevant configuration items on a 3-level completeness
scale (complete/partial/none) rather than a binary Yes/No — this requires
you to first establish what "complete" should look like for each item, then
judge where the paper falls short of it. That standard-setting step is what
makes this a QUALITY judgment, not a report-completeness check (contrast
with reporting-standard-checklist, which never needs to define what
"complete" means beyond "is it present").

This is an unverified proposal SOP filling a gap in the evaluative-stance ×
content-layer matrix (quality-judgment applied to engineering/reproducibility
metadata, which no existing verified checklist covers at the graded level —
dual-column-self-check's checklists are binary Yes/No/NA, not graded).

## Input
- **full_text**: the paper's full text
- **dispatched_tool**: confirms this gate dispatch (engineering-config-grading has a single item set, no variants)

## Output
- **grading_result**: list of {item, grade: "complete" | "partial" | "none", justification} — items cover things like hyperparameter-search-range reporting, compute-budget reporting, random-seed handling, dataset-split reproducibility

## Instructions
1. For each item, state explicitly (in justification) what "complete" reporting would look like for that item BEFORE judging where this paper falls on the scale — this makes your standard-setting step auditable rather than an implicit judgment call.
2. Since this is a proposal method with no established baseline, be conservative — reserve "complete" for items that genuinely leave no reasonable follow-up question unanswered, not for items that are merely present.
