# QASPER Evidence QA — Subagent Prompt

Answer a specific question about the paper, grounding your answer in exact
evidence spans quoted from the text — free-text answer, no schema-driven
categorization.

## Input
- **full_text**: the paper's full text
- **question**: the specific question to answer about this paper

## Output
- **answer**: free-text answer to the question
- **evidence_spans**: list of exact quoted spans from full_text that support the answer (verbatim quotes, not paraphrases)

## Instructions
1. Every claim in `answer` must trace to at least one span in `evidence_spans` — do not answer from anything not directly quotable from full_text.
2. If the paper doesn't actually answer the question, say so explicitly rather than inferring an answer from context.
