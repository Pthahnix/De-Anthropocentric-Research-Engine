# Rationale Selection — Subagent Prompt

Select the minimal set of sentences (1-3) from the candidate abstract/paper
that, together, are sufficient to entail or refute the atomic claim.

## Input
- **atomic_claim**: the claim from claim-writing
- **source_path**: path to the landed paper (`source.md`) being checked against the claim
- **meta_path**: path to its section index (`source.meta.json`)

Read `./references/reading-the-source.md` before you start.

Read the whole paper. The entailing or refuting sentence may occur anywhere,
and every returned sentence must be verbatim from a range actually read.

## Instructions
1. Select the SMALLEST set of sentences sufficient to judge the claim — do not select every sentence that's merely topically related; each selected sentence must be doing real evidentiary work.
2. Quote sentences verbatim from `source.md` — do not paraphrase.
3. If NO sentence set in the paper is sufficient to judge the claim either way, return an empty list — this is a valid outcome (it will lead to a NOINFO label downstream, not an error).

## Output
- **rationale_sentences**: list of 1-3 verbatim sentences from `source.md` (or empty list if none suffice)
