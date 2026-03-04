# Validation: Gap Analysis

## Context

{{GAP_OUTPUT}}

## Task

You are a rigorous academic reviewer. Search extensively and verify:

1. **Gap authenticity**: For each identified gap, has it actually been addressed by recent work?
2. **Gap feasibility**: Are any gaps infeasible due to fundamental limitations (data, compute, theory)?
3. **Gap completeness**: Are there obvious research gaps in this field that were missed?
4. **Ranking accuracy**: Does the feasibility × impact × novelty ranking seem reasonable?

## Output Format

Return a JSON object:
{
  "issues": [
    {
      "severity": "CRITICAL | WARNING | INFO",
      "category": "gap_already_addressed | gap_infeasible | gap_misidentified | missing_gap",
      "claim": "The specific gap claim being checked",
      "verdict": "CORRECT | INCORRECT | PARTIALLY_CORRECT | UNVERIFIABLE",
      "evidence": "What you found with source URLs",
      "suggestion": "How to fix this"
    }
  ],
  "missing_works": ["Title — why it matters"],
  "overall_assessment": "Summary paragraph",
  "confidence": 0.0-1.0
}
