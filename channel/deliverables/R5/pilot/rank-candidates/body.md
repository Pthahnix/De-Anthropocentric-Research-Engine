# rank-candidates

## Purpose

Rank, classify, screen, or select typed candidates under explicit criteria and hard constraints.

## Input contract

```yaml
required: [candidates, criteria, decision_rule]
optional: [weights, evidence, hard_constraints, object_schema]
constraints: [criterion direction and missing-value policy explicit]
```

## Execution protocol

1. Normalize candidate and criterion schemas; separate hard constraints from preferences.
2. Select `gap-prioritization`, `direction-selection`, `mcda-best-choice`, `full-ranking`, `category-sorting`, `non-compensatory-screening`, `rapid-triage`, or `stakeholder-weighted`.
3. Elicit/validate weights, score with evidence, aggregate or apply veto/threshold rules.
4. Run sensitivity scenarios and return ordered or categorized candidates with rationale.

## Output contract

```yaml
produces: [ranking_or_categories, scores, weights, eliminated_candidates, sensitivity_results, recommendation]
delta_fields: [findings, decisions, uncertainties, recommended_jumps]
```

## Thresholds and quality gates

- Full ranking: select >=2 ranking methods when the source protocol calls for method comparison.
- Weight elicitation: select >=2 weighting methods where required.
- Priority sensitivity: at least 3 perturbation scenarios, each annotated.
- Direction narrowing imports retain at least 80 papers scanned and at least 30 web pages read in full when those modes are invoked.
- Non-compensatory and category modes must expose threshold/veto values; never hide them in prose.

## Failure and counterexamples

Reject rankings with undefined criterion direction, unhandled missing values, or hard constraints treated as compensable scores. Do not collapse pairwise active ranking into scalar ranking.

## Provenance map

20 architecture `old` entries; shared criteria→score→aggregate kernel retained. Portfolio and pairwise operations remain separate nodes, not silently absorbed.

## Context checkpoint / Delta notes

Append candidate set hash, criteria/weights, rule, ranking, sensitivity scenarios, exclusions, and unresolved trade-offs.
