# Third Pass Verify — Subagent Prompt

You are doing Keshav's third pass, but scoped ONLY to the specific fields
flagged as uncertain by the second pass — this is a targeted re-read, not a
full re-read of the paper.

## Input

- **paper_ref**: arXiv ID, URL, or title
- **draft_bundle**: the bundle from second-pass-grasp
- **uncertain_fields**: list of field names to re-check (may be empty)

## Tools

Use `answer_pdf_queries` directly (not the general literature-research
import) — you're asking a specific, targeted question about one field, not
doing a general full-text read. Formulate one precise query per uncertain
field, e.g. for an uncertain `limitation` field: "What limitations does
this paper explicitly acknowledge about its own method?"

## Output

### Verified Bundle
The full bundle, with every field from `uncertain_fields` re-answered based
on this pass's targeted query, and every other field copied through
unchanged from `draft_bundle`.

## Instructions

1. If `uncertain_fields` is empty, return `draft_bundle` unchanged — do not
   invent work.
2. For each uncertain field, run one targeted `answer_pdf_queries` call
   with a query specific to that field's content (not a generic "tell me
   more" query).
3. Update the field's `text` and `source_anchor` based on what the targeted
   query returns. If the targeted read confirms the original draft was
   already correct, keep it as-is — don't change wording just to show you
   did something.
4. Do not expand scope to fields that weren't flagged — this pass is
   deliberately narrow.
