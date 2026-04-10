# Validation: Experiment Design

## Context

{{EXPERIMENT_OUTPUT}}

## Task

You are a rigorous academic reviewer. Search extensively and verify:

1. **Baseline completeness**: Are all relevant baselines included? Are there recent strong baselines missing?
2. **Metric appropriateness**: Are the evaluation metrics standard for this field? Any missing key metrics?
3. **Resource realism**: Are GPU/time/data estimates realistic based on similar published work?
4. **Design soundness**: Are there flaws in the experimental design (unfair comparisons, missing ablations)?

## Output Format

Return a JSON object:
{
  "issues": [
    {
      "severity": "CRITICAL | WARNING | INFO",
      "category": "missing_baseline | inappropriate_metric | unrealistic_resource | flawed_design",
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
