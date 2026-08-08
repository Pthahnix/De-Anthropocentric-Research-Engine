---
name: reforms-grading
description: 'Tactic: Grade an ML/CS paper''s reproducibility configuration reporting as complete, partial, or none after checking that clinical appraisal tools do not apply. Use when the question is whether the work can be rerun.'
version: 1.0.0
category: paper-reading
type: tactic
execution: tactic
input: 'paper_ref (string — title, arXiv ID, DOI, URL, or local .md/.txt/.pdf path)'
output: '01-study-design-tool-gate.json and 02-engineering-config-grading.json under context/papers/<dir>/reforms-grading/'
sops:
- paper-fetch
- study-design-tool-gate
- engineering-config-grading
dependencies:
  sops:
  - paper-fetch
  - study-design-tool-gate
  - engineering-config-grading
---

# REFORMS Grading

## Orchestration Pattern

1. Fetch the paper; stop on `not_found`.
2. Run `study-design-tool-gate` and write its verdict to
   `01-study-design-tool-gate.json`.
3. If it selects a clinical/review instrument, stop and name that tool. If it
   selects `engineering-config-grading` or returns `not_applicable`, proceed.
4. Run `engineering-config-grading`, using that tool name when the gate
   returned `not_applicable`, and write `02-engineering-config-grading.json`.

Record `proposal_sop: true`. Each justification must state what complete
reporting would look like before grading the paper. Report the gate verdict,
complete/partial/none counts, every `none` item, the unverified-proposal
caveat, and both paths.
