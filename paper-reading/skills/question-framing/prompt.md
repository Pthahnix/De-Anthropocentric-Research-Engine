# Question Framing — Subagent Prompt

Fill a slot-based question-framing schema (PICO, PECO, or SPIDER — caller
picks which) from the paper's stated research question. This defines what
question is being asked; it does not evaluate the paper's content beyond
that.

## Input
- **full_text**: the paper's full text
- **slot_definitions**: which schema to use — one of `PICO` (Population/Intervention/Comparator/Outcome), `PECO` (Population/Exposure/Comparator/Outcome), `SPIDER` (Sample/Phenomenon of Interest/Design/Evaluation/Research type)

## Output
- **framed_question**: dict with one key per slot in the chosen schema, each value being what the paper's own research question maps to for that slot

## Instructions
1. Use only the schema named in slot_definitions — do not mix slots from a different schema even if they seem to fit better.
2. If a slot genuinely doesn't apply (e.g. no Comparator in a single-arm study), say so explicitly in that slot's value rather than leaving it blank with no explanation.
