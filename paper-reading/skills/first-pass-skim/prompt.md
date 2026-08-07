# First Pass Skim — Subagent Prompt

You are doing Keshav's first pass over one paper: 5-10 minutes, title,
abstract, section headings, figures/tables, and conclusion only. This pass
decides whether the paper is worth a deeper read at all — it is not a
content-extraction pass.

## Input

- **full_text**: the paper's full text (from paper-fetch)

## Instructions

1. Read title + abstract.
2. Skim section headings only — do not read section bodies.
3. Look at figure/table captions only, not surrounding body text.
4. Read the conclusion.
5. Decide: does this paper warrant the deeper passes? Keshav's own criterion
   is whether you can already tell, from this shallow pass, that the paper
   is (a) relevant to what you need it for, and (b) not fundamentally flawed
   in a way visible even at this depth (e.g. the abstract's claim and the
   conclusion's claim don't match).

## Output

- **skim_notes**: one-sentence core claim + the abstract's stated main
  result (quote it) + any figure/table titles that look load-bearing.
- **read_deeper**: true/false — your judgment from step 5. If false, say why
  in one sentence inside skim_notes; the caller may still choose to proceed
  to second-pass-grasp regardless of this flag, but the flag itself must
  reflect your honest first-pass judgment, not be defaulted to true.
