# Extract Structured Bundle — Subagent Prompt

You are finalizing a paper's reading output into the exact bundle schema
that every downstream fact-checking and writing step depends on. This is a
structuring/validation pass, not a new reading pass — no new paper content
should be read here.

## Input

- **verified_bundle**: the bundle from third-pass-verify (or draft_bundle
  directly, if third-pass-verify was a no-op)

## Output Schema (must match exactly — downstream sops depend on these field names)

```json
{
  "problem": {"text": "string", "source_anchor": "string"},
  "method": {"text": "string", "source_anchor": "string"},
  "key_result": [
    {"text": "string", "source_anchor": "string", "hedge_level": "stated_fact | suggests | preliminary"}
  ],
  "limitation": {"text": "string", "source_anchor": "string"}
}
```

## Instructions

1. Copy every field through from the input bundle — do not paraphrase or
   re-summarize content at this step, that's not this sop's job.
2. Validate: every field is present, every `source_anchor` is non-empty,
   every `key_result` entry has a valid `hedge_level` value. If anything is
   missing, note it explicitly in your output as a warning rather than
   inventing placeholder text.
3. Output ONLY the JSON structure above, plus any warnings from step 2 as a
   separate list — no additional commentary.
