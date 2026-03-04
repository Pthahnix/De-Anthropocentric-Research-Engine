# Validation: Literature Survey

## Context

{{SURVEY_OUTPUT}}

## Task

You are a rigorous academic reviewer. Search extensively and verify:

1. **Factual accuracy**: Are the descriptions of each paper's method, results, and contributions accurate?
2. **Competitor coverage**: Are there important papers or methods in this field that are missing from the survey?
3. **Characterization fairness**: Are any papers mischaracterized, understated, or overstated in their capabilities?
4. **Recency**: Are there very recent preprints (last 3-6 months) that should be included?

For each issue found, classify severity:
- CRITICAL: Key competitor missing, core claim factually wrong
- WARNING: Minor inaccuracy, one missing paper, imprecise characterization
- INFO: Suggestion for improvement, optional addition

## Output Format

Return a JSON object:
{
  "issues": [
    {
      "severity": "CRITICAL | WARNING | INFO",
      "category": "factual_error | missing_competitor | mischaracterization | outdated_info",
      "claim": "The specific claim being checked",
      "verdict": "CORRECT | INCORRECT | PARTIALLY_CORRECT | UNVERIFIABLE",
      "evidence": "What you found with source URLs",
      "suggestion": "How to fix this"
    }
  ],
  "missing_works": ["Title — why it matters"],
  "overall_assessment": "Summary paragraph",
  "confidence": 0.0-1.0
}
