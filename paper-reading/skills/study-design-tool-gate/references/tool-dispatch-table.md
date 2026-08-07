# Study Design → Tool Dispatch Table

Full dispatch table for `study-design-tool-gate`. Read this file before
making a dispatch decision — do not guess the mapping from memory.

| study_design | dispatched_tool | Notes |
|---|---|---|
| RCT (parallel-group) | `signalling-question-answering` / RoB2 (parallel RCT version) | RoB2 has separate versions for parallel, cluster, and crossover trials — pick the matching one, they have different domain sets |
| RCT (cluster) | `signalling-question-answering` / RoB2 (cluster version) | |
| RCT (crossover) | `signalling-question-answering` / RoB2 (crossover version) | |
| Non-randomized intervention study (cohort-like, with an intervention) | `signalling-question-answering` / ROBINS-I | |
| Diagnostic accuracy study | `signalling-question-answering` / QUADAS-2 | Terminates at domain-level-judgment — no worst-case-lookup step for this one |
| Cohort study | `quality-appraisal-checklist` / CASP-Cohort, or `star-awarding` / NOS-Cohort | CASP and NOS both have cohort-study variants; if caller doesn't specify a preference, prefer NOS if the goal is a single summary score, CASP if the goal is item-level narrative appraisal |
| Case-control study | `quality-appraisal-checklist` / CASP-Case-Control, or `star-awarding` / NOS-Case-Control | Same CASP-vs-NOS choice as cohort |
| Qualitative research | `quality-appraisal-checklist` / CASP-Qualitative | |
| Systematic review | `quality-appraisal-checklist` / AMSTAR-2, or `reporting-standard-checklist` / PRISMA | AMSTAR-2 judges the review's own methodological quality; PRISMA checks whether the review report is complete — these are different questions, both valid for the same paper |
| Diagnostic test accuracy review | `quality-appraisal-checklist` / JBI (diagnostic-test-accuracy variant) | |
| Prevalence study | `quality-appraisal-checklist` / JBI (prevalence variant) | |
| Case report / case series | `quality-appraisal-checklist` / JBI (case-report or case-series variant) | Two distinct JBI variants — case report is n=1, case series is n>1 |
| Economic evaluation | `quality-appraisal-checklist` / JBI (economic-evaluation variant) | |
| RCT report completeness (as opposed to bias risk) | `reporting-standard-checklist` / CONSORT | |
| Observational-study report completeness | `reporting-standard-checklist` / STROBE | |
| Animal research report completeness | `reporting-standard-checklist` / ARRIVE | |
| Clinical trial protocol completeness | `reporting-standard-checklist` / SPIRIT | |
| Prediction-model study report completeness | `reporting-standard-checklist` / TRIPOD | |
| ML/CS engineering paper — reproducibility config grading | `engineering-config-grading` / (no variant — single item set) | Proposal SOP; note this is NOT gated the same way as dual-column-self-check, which has no gate at all — engineering-config-grading DOES route through this gate because it's evaluative (quality judgment), matching the gate's own evaluative-tool purpose, whereas dual-column-self-check is a report-completeness self-audit that was never drawn as gate-dispatched in the graph |
| Anything not matching any row above | `not_applicable` / `none` | This is a legitimate, complete output — say so explicitly rather than forcing a poor-fit dispatch. E.g. most CS/ML papers with no human/animal study component genuinely have `not_applicable` here for the bias-risk tools, even though other SOPs in this package (unit-classification, multi-stage-cascade-extraction, etc.) may still apply to the same paper. |
