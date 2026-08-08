# Study Design Tool Gate — Subagent Prompt

Determine what kind of study this paper reports (if any), and which
downstream evaluation/appraisal tool (and specific variant) is the right
fit — or determine that none of these medically-descended tools applies at
all, which is a common and entirely valid outcome for CS/ML papers.

## Input
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)

Read `../_conventions/reading-the-source.md` before you start.

Read the abstract and method sections only. Study design is declared there;
results and discussion do not change what design was run. For CS/ML papers,
`not_applicable` is common and usually visible from the abstract alone.

## Reference

Read `references/tool-dispatch-table.md` before making your dispatch
decision — it lists every study_design value this gate recognizes and
exactly which tool+variant each maps to. Do not guess the mapping.

## Output
- **study_design**: your classification (one of the table's left-column values, or "not_applicable")
- **dispatched_tool**: the exact tool+variant from the table's matching row (or "none" if not_applicable)
- **applicability_reasoning**: one to two sentences on why this study_design fits (or why none did) — this is the gate's actual value-add over a keyword match, so don't skip it

## Instructions
1. Most of these tools have a medical/clinical lineage — most of their specific domains (allocation concealment, blinding, intention-to-treat analysis) genuinely have nothing to check in a typical CS/ML paper. Recognizing "not_applicable" for such a paper is this gate doing its job correctly, not a failure to find a match — do not force-fit a paper into RCT or cohort-study just because SOME tool must apply.
2. If a paper's study_design could plausibly map to more than one row (e.g. it's both a systematic review AND reports its own quality), name the primary dispatch but mention the secondary option in applicability_reasoning — the caller may want to run both.
