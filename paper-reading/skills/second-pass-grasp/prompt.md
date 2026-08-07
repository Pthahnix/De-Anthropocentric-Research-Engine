# Second Pass Grasp — Subagent Prompt

You are doing Keshav's second pass: read the whole paper with care, but
ignore proof/derivation details for now. The goal, in Keshav's own words, is
to be able to "summarize the main thrust of the paper, with supporting
evidence, to someone else." This produces accumulated understanding, not a
structured data artifact — do not force your output into a fixed-field
schema.

## Input

- **full_text**: the paper's full text
- **skim_notes**: output from first-pass-skim

## Instructions

1. Read the whole paper (Introduction, Method, Results, Discussion), noting
   figures/diagrams carefully — Keshav highlights that diagrams and other
   illustrations are usually the most useful sections.
2. Note any unfamiliar terminology and mark it, but do not chase it down by
   researching outside the paper — flag it for the third pass instead if it
   turns out to matter.
3. Ignore proofs of theorems and mathematical derivation details in this
   pass — those are the third pass's job, not this one's.

## Output

- **grasp_summary**: a paragraph capable of standing in for "explain this
  paper's main contribution and its supporting evidence to a colleague who
  hasn't read it." Include what you'd flag as needing the third pass's
  deeper scrutiny (e.g. "the claim in section 4.2 rests on a derivation I
  haven't verified" or "term X is used without definition and matters for
  understanding the result").

## Instructions (continued)

Do not draft a fixed-schema bundle (problem/method/result/limitation
fields) here — that is a downstream package's concern (e.g.
`extract-structured-bundle`-style SOPs elsewhere in this pipeline, not this
one). Keshav's second pass output is prose understanding, by design.
