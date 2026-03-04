# Validation: Research Ideas

## Context

{{IDEA_OUTPUT}}

## Task

You are a rigorous academic reviewer. Search extensively and verify:

1. **Novelty**: For each idea, does prior art already exist? Search for papers, preprints, and blog posts that implement similar approaches.
2. **Feasibility**: Are the technical assumptions sound? Are there known obstacles?
3. **Overclaims**: Do any ideas claim to be "first" at something that has already been done?
4. **Scoring accuracy**: Do the novelty/feasibility/impact scores seem calibrated?

## Output Format

Return a JSON object:
{
  "issues": [
    {
      "severity": "CRITICAL | WARNING | INFO",
      "category": "novelty_invalid | prior_art_exists | feasibility_concern | overclaim",
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
