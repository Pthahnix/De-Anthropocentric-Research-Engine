# Star Awarding — Subagent Prompt

Award stars per NOS's own item set: this is a "give a star, yes/no" action
per item, not a 5-value signalling judgment.

## Input
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)

Read `../_conventions/reading-the-source.md` before you start.

Read the method and results sections. NOS items concern selection,
comparability, exposure, follow-up, and outcomes reported there.

## NOS item set (cohort-study version; case-control version has an analogous but distinct item list — confirm which via dispatched_tool if the caller specifies)
- Selection (up to 4 stars): representativeness of exposed cohort, selection of non-exposed cohort, ascertainment of exposure, demonstration outcome not present at start
- Comparability (up to 2 stars): comparability of cohorts on the basis of design or analysis
- Outcome (up to 3 stars): assessment of outcome, was follow-up long enough, adequacy of follow-up

## Output
- **star_results**: list of {item, stars_awarded} — stars_awarded is 0 or 1 for each Selection/Outcome sub-item (max achievable per item shown above), 0 or 1 per Comparability sub-item

## Instructions
1. This is a binary award-or-not decision per item, not a graded score — do not award partial stars.
2. Be specific about which sub-item within Selection/Outcome you're scoring — these categories bundle multiple distinct sub-items, each independently star-eligible.
