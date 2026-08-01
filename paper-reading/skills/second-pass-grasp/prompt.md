# Second Pass Grasp — Subagent Prompt

You are doing Keshav's second pass: read the paper's Introduction, Method,
and Results sections in full, ignoring proof/derivation details for now.
Your goal is to draft the paper's structured bundle — this is the main
content-extraction pass.

## Input

- **paper_ref**: arXiv ID, URL, or title
- **paper_type**: `empirical | survey | theoretical` (from first-pass-skim)
- **skim_notes**: one-paragraph summary from first-pass-skim

## Tools

Use the `literature-research` sop (import from literature-engine) to fetch
full text (`answer_pdf_queries` or `get_paper_content(fullText=true)`).
This pass reads the actual paper text, not abstracts or AI summaries.

## Bundle Schema (v1 generic — same fields regardless of paper_type)

- **problem**: `{text: str, source_anchor: str}` — what problem/question the paper addresses
- **method**: `{text: str, source_anchor: str}` — what approach/method it uses
- **key_result**: list of `{text: str, source_anchor: str, hedge_level: str}` — the paper's main findings. `hedge_level` is one of `stated_fact` (paper asserts this directly), `suggests` (paper hedges: "suggests", "indicates", "may"), `preliminary` (paper explicitly flags this as tentative/needs more work).
- **limitation**: `{text: str, source_anchor: str}` — what the paper itself acknowledges as a limitation, gap, or open question

`source_anchor` must be precise enough that a human could find the exact
sentence/paragraph in the paper — e.g. "Section 3.2, paragraph 2" or "the
sentence beginning 'We observe that...' in the Results section". Do not use
vague anchors like "somewhere in the results".

## Output

Produce:

### Draft Bundle
The 4 fields above, filled in as completely as the Introduction/Method/
Results sections support.

### Uncertain Fields
A list of field names (e.g. `["limitation", "key_result[1]"]`) where you
were not confident you found the paper's own best statement — these get a
targeted re-read in the next pass. If nothing is uncertain, return an empty
list — do not manufacture uncertainty to seem thorough.

## Instructions

1. Read Introduction fully — this usually contains problem + a preview of
   method + key results.
2. Read Method fully, but skip mathematical derivation details unless the
   paper_type is `theoretical` (in which case method IS the derivation).
3. Read Results fully, extracting every result the paper itself frames as a
   key finding (not every numerical result in every table).
4. For each field, write the source_anchor as you extract — don't try to
   reconstruct anchors afterward from memory.
5. Every key_result MUST get a hedge_level. Read the paper's own verb choice
   ("we show", "we find" → stated_fact; "this suggests", "may indicate" →
   suggests; "preliminary results", "we hypothesize" → preliminary) — do
   not upgrade the paper's own hedging to sound more confident.
