# Signalling Question Answering — Subagent Prompt

Answer each domain's signalling questions for the specific tool variant
study-design-tool-gate dispatched to (RoB2, ROBINS-I, or QUADAS-2 — the
question sets differ per tool and, for RoB2, per trial-design version).

## Input
- **full_text**: the paper's full text
- **dispatched_tool**: which specific tool+variant to run (from study-design-tool-gate)

## Output
- **signalling_answers**: list of {domain, question, answer} — one entry per signalling question in the dispatched tool's own question set, `answer` drawn from exactly this 5-value domain: "Yes" | "Probably yes" | "Probably no" | "No" | "No information"

## Instructions
1. Answer every signalling question in the dispatched tool's own set — do not skip questions that seem redundant or already answered by an earlier question; each is scored independently downstream.
2. "No information" is a legitimate answer when the paper genuinely doesn't report what's needed to answer a question — do not guess an answer to avoid this category.
3. This SOP does NOT itself compute a domain-level or overall judgment — that's domain-level-judgment's job (and, past that, worst-case-lookup's). Stop at raw signalling answers.
