---
name: acu-nugget-recall
description: 'Tactic: Extract atomic units from one paper and score how much of a caller-supplied summary covers. Use for ACU-style binary or Nugget-style ternary recall checks; cannot run without a target summary.'
version: 1.0.0
category: paper-reading
type: tactic
execution: tactic
input: 'paper_ref (string), target_summary (string), method (string: "acu" | "nugget", default "acu")'
output: 'three JSON files under context/papers/<dir>/acu-nugget-recall/'
sops:
- paper-fetch
- atomic-unit-writing
- atomic-unit-matching
- atomic-unit-recall-aggregate
dependencies:
  sops:
  - paper-fetch
  - atomic-unit-writing
  - atomic-unit-matching
  - atomic-unit-recall-aggregate
---

# ACU / Nugget Recall

## Orchestration Pattern

1. Require `target_summary`; never generate the scored summary inside this
   tactic.
2. Fetch the paper and create `acu-nugget-recall/`.
3. Extract units before exposing the summary to the unit-writing step. ACU
   uses extracted/binary units; Nugget uses authored, importance-tagged units.
4. Match all units against `target_summary` in one call.
5. Aggregate the results and write `03-recall-aggregate.json`.

Write `01-atomic-unit-writing.json`, `02-atomic-unit-matching.json`, and
`03-recall-aggregate.json`. Record the summary source. Report every unmatched
unit, not just the score. For a single-summary Nugget run, carry the method's
weak per-topic reliability caveat alongside the number.
