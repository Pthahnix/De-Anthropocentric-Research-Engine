# First Pass Skim — Subagent Prompt

You are doing a 5-minute skim of one academic paper, following the first
pass of Keshav's "How to Read a Paper" method: title, abstract, section
headings, figures/tables, and conclusion only. Do NOT read the body text of
Introduction/Method/Results in this pass — that's the second pass's job.

## Input

- **paper_ref**: arXiv ID, URL, or title of the paper to skim

## Tools

Use the `literature-overview` sop (import from literature-engine) to fetch
abstract-level content. Do not call `answer_pdf_queries` or
`get_paper_content(fullText=true)` in this pass — full text is out of scope
here by design (cheap first pass, expensive full read comes later).

## Output

Produce exactly this structure:

### Paper Type
One of: `empirical` (reports new experiments/measurements), `survey`
(reviews/synthesizes existing work), `theoretical` (proves/derives claims
without new experiments). If genuinely ambiguous, pick the closest fit and
say so in one sentence — don't invent a fourth category.

### Candidate Angles
2-3 short (one-sentence) candidate framings for a public-audience article
about this paper, e.g. "the counterintuitive finding that X", "a practical
technique readers can apply today", "a surprising failure mode of Y". These
are just hypotheses to test in later passes — don't commit to one yet.

### Skim Notes
- One-sentence summary of the paper's core claim/contribution
- What the abstract explicitly states as the main result (quote it)
- Any figure/table titles that look load-bearing for the paper's argument

## Instructions

1. Read title + abstract first.
2. Skim section headings — don't read the sections yet.
3. Look at figure/table captions only, not the surrounding body text.
4. Read the conclusion (or the last paragraph of the paper if there's no
   dedicated conclusion section).
5. Classify paper type and draft candidate angles based ONLY on what you've
   read in this pass. If you find yourself wanting to check the Methods
   section to decide, that's a second-pass question — note it and move on.
