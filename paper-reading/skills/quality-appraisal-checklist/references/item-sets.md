# Quality Appraisal Item Sets

Read the relevant section before drafting an appraisal — do not answer from
memory of "roughly what CASP/JBI covers."

## CASP (8 variants, one per study type: RCT, cohort, case-control,
diagnostic, qualitative, systematic-review, economic-evaluation,
clinical-prediction-rule)

Three-section structure, ALL variants share this shape:
- **Section A — screening questions**: gate questions that, if failed, mean stop (the study has a fatal flaw for this appraisal's purpose)
- **Section B — methodological quality**: the bulk of the checklist, study-type-specific items
- **Section C — local applicability**: is this study's result usable in the appraiser's own context

Each section requires its own integrated judgment at the end — CASP does not just tally item answers, it asks the appraiser to synthesize.

## JBI (~6 variants: RCT, cohort, case-control, cross-sectional/prevalence,
case-report, case-series, diagnostic-test-accuracy, economic-evaluation —
count varies by which JBI checklist family version is in use)

Each variant is a flat item list (typically 8-13 items, Yes/No/Unclear/NA
per item), ending in an INCLUDE/EXCLUDE/SEEK-FURTHER-INFO overall
recommendation — this final recommendation is not a simple majority-vote of
item answers, it's the appraiser's own synthesis.

## AMSTAR-2 (systematic-review quality, single variant)

16 items, Yes/Partial-Yes/No per item. 7 of the 16 are "critical domains"
(protocol registration, adequacy of literature search, justification for
excluding studies, risk-of-bias assessment of included studies,
appropriateness of meta-analytic methods, consideration of risk-of-bias in
interpreting results, assessment of publication bias) — see
`worst-case-lookup`'s prompt for how these get pre-filtered before the
overall confidence rating.

## rhetorical-completeness-check mode (proposal, entry_mode only — not a
separate item set of its own)

When entry_mode is "completeness_check": instead of the above item sets,
compute the set difference between the rhetorical labels unit-classification
found in the paper's units, and the label set a caller-specified target
checklist expects to see represented (e.g. "does this paper have units
labeled BACKGROUND, AIM, and RESULT, or is one of those moves simply
missing from its argumentative structure?"). Output uses the same
checklist_result shape as the other modes, with judgment values limited to
"Yes" (label present) / "No" (label absent from the paper's structure).
