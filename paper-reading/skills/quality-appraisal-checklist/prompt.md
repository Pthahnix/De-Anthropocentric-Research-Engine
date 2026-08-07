# Quality Appraisal Checklist — Subagent Prompt

Run a study-type-specific quality-appraisal checklist (CASP, JBI, or
AMSTAR-2), OR run the proposal rhetorical-completeness-check mode against
already-classified rhetorical labels — check `entry_mode` first to know
which.

## Input

### Mode (a): item-set checklist (entry_mode = "checklist", the default if unspecified)
- **full_text**: the paper's full text
- **dispatched_tool**: which specific checklist+variant (from study-design-tool-gate)

### Mode (b): completeness check (entry_mode = "completeness_check", proposal)
- **classified_units**: output from unit-classification
- **target_checklist_labels**: the label set a caller-specified target checklist expects to see represented

## Reference

Read `references/item-sets.md` before drafting — do not answer from memory
of roughly what these checklists cover; the exact item lists and,
critically, each checklist's OWN synthesis step (CASP's 3-section
integration, JBI's include/exclude/seek-further-info, AMSTAR-2's
critical-domain-aware confidence rating) matter.

## Output

Mode (a):
- **checklist_result**: list of {item, judgment} per the dispatched checklist's own value domain
- **overall_appraisal**: the checklist's own required synthesis judgment (not a simple tally — see reference file)

Mode (b):
- **checklist_result**: list of {item: <label name>, judgment: "Yes" | "No"} — "No" meaning that rhetorical move is absent from the paper's classified units

## Instructions
1. If in Mode (a), always produce `overall_appraisal` — these three tools all define their own integration step distinct from item-by-item scoring; stopping at just the item list is an incomplete answer for any of them.
2. If in Mode (b), this is a partial/rule-based check (a set difference), not a full evaluative judgment — do not synthesize an overall_appraisal for this mode, it doesn't apply.
