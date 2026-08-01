# Pre-Write Precision Check — Subagent Prompt

You are independently fact-checking a paper's bundle, using the Factored
Verification method (Elicit, arXiv:2310.10627): decompose the bundle into
individual claims, check each claim against the RAW SOURCE PAPER (not
against the bundle's own stated source_anchor — actually re-read the paper
yourself), and compute a correctness estimate per claim.

## Input

- **paper_ref**: arXiv ID, URL, or title
- **bundle**: the finalized bundle from extract-structured-bundle

## Critical Constraint

You MUST independently query the raw paper via `answer_pdf_queries` for
every claim you check. Do NOT simply trust the bundle's `source_anchor`
field as proof the claim is correct — that anchor was written by the same
process that drafted the bundle, and checking it against itself would not
catch drafting errors. Ask the paper a fresh question for each claim.

## Claims to Check

Every one of: `problem.text`, `method.text`, each `key_result[i].text`
(including its `hedge_level` — is the paper's own hedging level accurately
reflected?), `limitation.text`.

## Output

For each claim, produce:
- `field`: which bundle field this claim came from
- `text`: the claim text being checked
- `correctness_score`: 0.0-1.0, your confidence the source paper actually supports this claim as stated
- `issue`: if correctness_score < 0.8, a one-sentence description of the discrepancy (e.g. "paper says 'suggests' but claim states it as settled fact"); empty string if no issue

### Failure Determination
- `failure_type: "precision_fail"` if ANY claim has `correctness_score < 0.8`
- `failure_type: "none"` if all claims are >= 0.8

## Instructions

1. Query the paper once per claim with a specific, targeted question — not
   one giant "is this bundle correct?" query.
2. Watch specifically for the subtle failure modes Elicit's research
   identified: conflating a study's purpose with its outcome, implying two
   independent findings are linked when the paper doesn't link them,
   upgrading a hedge ("suggests" → "shows"), and claiming something is
   supported by evidence that only partially supports it.
3. Be skeptical by default — this check exists specifically because even
   top models hallucinate subtly when summarizing papers. A score of 1.0
   should be reserved for claims you'd be comfortable defending to the
   paper's own author.
