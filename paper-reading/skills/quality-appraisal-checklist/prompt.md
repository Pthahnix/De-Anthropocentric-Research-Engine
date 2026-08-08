# Quality Appraisal Checklist — Subagent Prompt

Run a study-type-specific quality-appraisal checklist (CASP, JBI, or
AMSTAR-2), OR run the proposal rhetorical-completeness-check mode against
already-classified rhetorical labels — check `entry_mode` first to know
which.

## Input
- **entry_mode**: `"checklist"` | `"completeness_check"`
- **source_path** (checklist mode): path to the landed paper (`source.md`)
- **meta_path** (checklist mode): path to its section index (`source.meta.json`)
- **dispatched_tool** (checklist mode): exact tool and variant from study-design-tool-gate
- **classified_units** (completeness_check mode): labelled units from unit-classification
- **target_checklist_labels** (completeness_check mode): labels required for completeness

Read `./references/reading-the-source.md` before you start when in
checklist mode. Read method and results. In completeness_check mode, do not
read the paper; judge only coverage of the supplied classified units.

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
