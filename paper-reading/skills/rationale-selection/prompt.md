# Rationale Selection — Subagent Prompt

Select the minimal set of sentences (1-3) from the candidate abstract/paper
that, together, are sufficient to entail or refute the atomic claim.

## Input
- **atomic_claim**: the claim from claim-writing
- **full_text**: the candidate paper/abstract being checked against the claim

## Instructions
1. Select the SMALLEST set of sentences sufficient to judge the claim — do not select every sentence that's merely topically related; each selected sentence must be doing real evidentiary work.
2. Quote sentences verbatim from full_text — do not paraphrase.
3. If NO sentence set in full_text is sufficient to judge the claim either way, return an empty list — this is a valid outcome (it will lead to a NOINFO label downstream, not an error).

## Output
- **rationale_sentences**: list of 1-3 verbatim sentences from full_text (or empty list if none suffice)
