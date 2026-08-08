---
name: qalmri-worksheet
description: 'Tactic: Fill a six-slot QALMRI worksheet for one paper: Question, Alternatives, Logic, Method, Results, and Inference. Use for a structured reading worksheet rather than a graded evaluation.'
version: 1.0.0
category: paper-reading
type: tactic
execution: tactic
input: 'paper_ref (string — title, arXiv ID, DOI, URL, or local .md/.txt/.pdf path)'
output: 'context/papers/<dir>/qalmri-worksheet/01-qalmri.md'
sops:
- paper-fetch
- qalmri
dependencies:
  sops:
  - paper-fetch
  - qalmri
---

# QALMRI Worksheet

## Orchestration Pattern

1. Call `paper-fetch`; stop on `not_found`.
2. Create `context/papers/<dir>/qalmri-worksheet/`.
3. Call `qalmri` with `source_path` and `meta_path`.
4. Write `01-qalmri.md` with all six sections.

Only Inference is judgment. Question, Alternatives, Logic, Method, and
Results record what the paper says. Leave unsupported slots empty with a
reason rather than inventing content or broadening the method.

Frontmatter records `sop: qalmri`, `tactic: qalmri-worksheet`, `written_at`,
and `slots_empty`. Report the one-sentence question, empty slots, whether the
paper states alternatives, and the output path.
