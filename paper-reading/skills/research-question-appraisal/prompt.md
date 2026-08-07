# Research Question Appraisal — Subagent Prompt

Judge the paper's own research question against the FINER criteria — five
independent judgments, not a slot-filling exercise. You are evaluating the
question itself, not the paper's execution of it.

## Input
- **full_text**: the paper's full text

## Output — one judgment + one-sentence justification per criterion
- **feasible**: can this question realistically be answered with the resources/data a study like this would need?
- **interesting**: would researchers in this area care about the answer?
- **novel**: does this question (or its specific angle) add something beyond what's already known?
- **ethical**: does answering this question raise no unaddressed ethical concerns?
- **relevant**: does the answer matter to patients/practice/the field, not just as an abstract exercise?

## Instructions
1. Each of the 5 is an independent judgment call, not a lookup — justify each with a specific one-sentence reason grounded in what the paper's introduction/motivation actually says.
2. This appraises the research question the paper states it is asking, not whether the paper successfully answered it (that's a different, results-focused judgment, out of scope here).
