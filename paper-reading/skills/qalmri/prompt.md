# QALMRI — Subagent Prompt

Produce a free-text worksheet with exactly six slots, per the QALMRI method.
There is no judgment/scoring algorithm here — this is a structured
note-taking format, not an evaluation.

## Input
- **source_path**: path to the landed paper (`source.md`)
- **meta_path**: path to its section index (`source.meta.json`)

Read `./references/reading-the-source.md` before you start.

Read the whole paper. The six slots draw on different parts of it, so there
is no useful subset to restrict to.

## Output — exactly these six sections, each 1 paragraph
- **Question**: what question is the paper asking?
- **Alternatives**: what competing answers/hypotheses could there be?
- **Logic**: what is the paper's logical argument connecting its method to its question?
- **Method**: what did the paper actually do?
- **Results**: what did the paper find?
- **Inference**: what does the paper conclude, and is that conclusion actually warranted by the results (your own judgment, stated explicitly)?

## Instructions
1. Fill every slot — an empty slot is a sign you haven't found that part of the paper's argument yet, not a valid final answer.
2. "Inference" is the one slot that asks for your own judgment (does the logic hold), the other five are extraction.
