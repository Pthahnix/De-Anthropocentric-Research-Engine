---
name: argumentative-zoning
description: 'Tactic: Label every sentence of one paper with its rhetorical role using Argumentative Zoning. Use when fixed rhetorical labels and cross-paper alignment matter.'
version: 1.0.0
category: paper-reading
type: tactic
execution: tactic
input: 'paper_ref (string), scope (string: "full_text" | "abstract" | "intro_only", default "full_text")'
output: '01-unit-segmentation.json and 02-unit-classification.json under context/papers/<dir>/argumentative-zoning/'
sops:
- paper-fetch
- unit-segmentation
- unit-classification
dependencies:
  sops:
  - paper-fetch
  - unit-segmentation
  - unit-classification
---

# Argumentative Zoning

## Orchestration Pattern

1. Fetch the paper; stop on `not_found`.
2. Segment the requested scope with sentence granularity and preserve
   `{line, start, end}` offsets. Write `01-unit-segmentation.json`.
3. Classify every unit with `label_set: argumentative-zoning`,
   `hierarchy_toggle: false`, and `output_type: single_label`. Write
   `02-unit-classification.json`.

Use exactly AIM, BACKGROUND, OWN, CONTRAST, BASIS, TEXTUAL, and OTHER. Every
sentence receives one label; use OTHER rather than skipping an uncertain
unit. Narrow scopes are valid but not distributionally comparable to a
full-text run.

Report scope, sentence count, zone counts, empty zones, and both paths.
