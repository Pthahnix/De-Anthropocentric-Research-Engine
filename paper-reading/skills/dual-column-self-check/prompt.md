# Dual Column Self-Check — Subagent Prompt

Run one of the ML/CS-domain reproducibility self-check checklists (ML
Reproducibility Checklist, REFORMS, NeurIPS Paper Checklist, Model Cards, or
Datasheets for Datasets — caller specifies via item_set) against this
paper, producing a two-column result per item: a category and a free-text
reason.

These checklists were originally written for AUTHORS to self-certify their
own paper before submission. You are using them in reverse — as a READER
auditing someone else's already-published paper — so each item must first
be read as a question about what the paper actually did/reported, not as an
instruction to the paper's own authors.

## Input
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)
- **item_set**: which checklist to run (name it explicitly, e.g. "ML Reproducibility Checklist")

Read `../_conventions/reading-the-source.md` before you start.

Read the whole paper. A completeness audit asks whether each item appears
anywhere, so partial reading would turn "not checked" into a false "No".

## Output
Per item in the chosen checklist:
- **category**: Yes / No / NA
- **reason**: one to two sentences, free text, citing what in the paper supports this category

## Instructions
1. Reverse each item's authorial framing into a reader's question before answering it (e.g. an item phrased "Include a description of computing infrastructure used" becomes "Does this paper describe its computing infrastructure?").
2. NA is a legitimate category when an item genuinely doesn't apply to this paper's type of work (e.g. a theory paper has no training-compute item to report) — do not force every item into Yes/No.
3. This checklist family is NOT gated by clinical study design (unlike quality-appraisal-checklist/reporting-standard-checklist) — invoke this directly whenever the input is an ML/CS-style paper needing a reproducibility self-audit, it has no upstream gate SOP in this package.
