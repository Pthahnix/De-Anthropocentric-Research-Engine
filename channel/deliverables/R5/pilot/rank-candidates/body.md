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
## Preserved threshold ledger (verbatim source lines)

- \x60multi-criteria-ranking:51\x60 **Sensitivity check**: perturb weights by ЁР20%; if the ranking is unchanged the conclusion is robust; if the ranking flips it must be flagged as "weight-sensitive".
- \x60multi-criteria-ranking:57\x60 | S | 5ЈC8 | Ён3 dimensions | Optional | Ranking table + attack suggestions for top 2 gaps |
- \x60multi-criteria-ranking:58\x60 | M | 9ЈC15 | Ён4 dimensions | Required | Ranking table + attack suggestions for top 3 gaps |
- \x60multi-criteria-ranking:59\x60 | L | 16ЈC20 | Ён5 dimensions | Required (multi-weight scenarios) | Ranking table + attack suggestions for top 5 gaps + weight-sensitivity report |
- \x60evidence-based-prioritization:55\x60 | S | 3ЈC8 | all 6 dimensions | Ён2 supporting references per gap | ranking table + evidence-void report |
- \x60evidence-based-prioritization:56\x60 | M | 9ЈC15 | all 6 dimensions | Ён3 supporting references per gap | ranking table + evidence-void report + attack suggestions for top 3 gaps |
- \x60evidence-based-prioritization:57\x60 | L | 16ЈC20 | all 6 dimensions | Ён5 supporting references per gap | ranking table + detailed evidence map + attack suggestions for top 5 gaps |
- \x60stakeholder-weighted-ranking:62\x60 | S | 5ЈC10 | 2ЈC3 classes | Simple average | Per-perspective rankings + consensus top-3 |
- \x60stakeholder-weighted-ranking:63\x60 | M | 11ЈC20 | 3ЈC5 classes | Borda count | Per-perspective rankings + consensus top-5 + divergence analysis |
- \x60rapid-triage:62\x60 | S | 50ЈC80 | Ём60% | top-15 | Candidate set + elimination-rationale summary |
- \x60rapid-triage:63\x60 | M | 81ЈC150 | Ём50% | top-20 | Candidate set + elimination-rationale summary |
- \x60rapid-triage:64\x60 | L | 150+ | Ём40% | top-30 | Candidate set + elimination-rationale summary + category statistics |
- \x60priority-sensitivity-testing:28\x60 This tactic first establishes baseline weights (AHP or equal weights), then systematically perturbs the weights (ЁР20%), observes the ranking changes, and finally gives a stability verdict.
- \x60priority-sensitivity-testing:35\x60 | weight-perturbation | Apply ЁР20% perturbations to each dimension weight and recompute the ranking | Second step, systematic perturbation |
- \x60priority-sensitivity-testing:42\x60 2. weight-perturbation: apply +20% and -20% perturbations to each dimension in turn (the remaining dimensions are adjusted proportionally to keep the sum at 1), producing a ranking for each perturbation scenario
- \x60priority-sensitivity-testing:47\x60 - Perturb only the highest-weight dimension (ЁР20%), producing 2 perturbation scenarios
- \x60priority-sensitivity-testing:52\x60 - weight-perturbation expands the perturbation range to ЁР30% and adds extreme scenarios (one dimension's weight set to 0)
- \x60priority-sensitivity-testing:58\x60 - Ranking results for at least 3 perturbation scenarios (each scenario annotated with its perturbation content)
- \x60best-option-selection:21\x60 | Base SOP | Target | ЁР10% Range |
- \x60full-ranking:22\x60 | Base SOP | Target | ЁР10% Range |
- \x60full-ranking:64\x60 2. Select >=2 ranking methods (recommended: PROMETHEE II + MAVT)
- \x60category-sorting:22\x60 | Base SOP | Target | ЁР10% Range |
- \x60non-compensatory-screening:27\x60 | Base SOP | Target | ЁР10% Range |
- \x60weight-elicitation:23\x60 | Base SOP | Target | ЁР10% Range |
- \x60weight-elicitation:26\x60 | weight-elicitation-sop | Ён2 methods | 2-3 |
- \x60weight-elicitation:60\x60 2. Select >=2 weighting methods (recommended: AHP + BWM or Swing + Simos)
- \x60direction-narrowing:36\x60 - `broad-paper-search`: at least 80 papers scanned
- \x60direction-narrowing:37\x60 - `deep-web-search`: at least 30 web pages read in full
- \x60direction-narrowing:51\x60 | deep-web-search | Full-page web reading for non-academic perspectives ЁЊ blogs, tech reports, product pages, industry analysis. Spawns a subagent to read pages in isolated context. Hard constraint: at least 30 web pages read in full. |
- \x60direction-narrowing:52\x60 | north-star-crystallization-broad-paper-search | Paper landscape scan within selected field(s). Strict import of literature-engine/literature-overview skill. Hard constraint: at least 80 papers scanned. |
## Preserved threshold table ledger (ASCII-normalized from source)

| source | line | source threshold row |
|---|---:|---|
| multi-criteria-ranking | 51 | **Sensitivity check**: perturb weights by ±20%; if the ranking is unchanged the conclusion is robust; if the ranking flips it must be flagged as "weight-sensitive". |
| multi-criteria-ranking | 57 | \| S \| 5–8 \| ≥3 dimensions \| Optional \| Ranking table + attack suggestions for top 2 gaps \| |
| multi-criteria-ranking | 58 | \| M \| 9–15 \| ≥4 dimensions \| Required \| Ranking table + attack suggestions for top 3 gaps \| |
| multi-criteria-ranking | 59 | \| L \| 16–20 \| ≥5 dimensions \| Required (multi-weight scenarios) \| Ranking table + attack suggestions for top 5 gaps + weight-sensitivity report \| |
| evidence-based-prioritization | 55 | \| S \| 3–8 \| all 6 dimensions \| ≥2 supporting references per gap \| ranking table + evidence-void report \| |
| evidence-based-prioritization | 56 | \| M \| 9–15 \| all 6 dimensions \| ≥3 supporting references per gap \| ranking table + evidence-void report + attack suggestions for top 3 gaps \| |
| evidence-based-prioritization | 57 | \| L \| 16–20 \| all 6 dimensions \| ≥5 supporting references per gap \| ranking table + detailed evidence map + attack suggestions for top 5 gaps \| |
| stakeholder-weighted-ranking | 62 | \| S \| 5–10 \| 2–3 classes \| Simple average \| Per-perspective rankings + consensus top-3 \| |
| stakeholder-weighted-ranking | 63 | \| M \| 11–20 \| 3–5 classes \| Borda count \| Per-perspective rankings + consensus top-5 + divergence analysis \| |
| rapid-triage | 62 | \| S \| 50–80 \| ≤60% \| top-15 \| Candidate set + elimination-rationale summary \| |
| rapid-triage | 63 | \| M \| 81–150 \| ≤50% \| top-20 \| Candidate set + elimination-rationale summary \| |
| rapid-triage | 64 | \| L \| 150+ \| ≤40% \| top-30 \| Candidate set + elimination-rationale summary + category statistics \| |
| priority-sensitivity-testing | 28 | This tactic first establishes baseline weights (AHP or equal weights), then systematically perturbs the weights (±20%), observes the ranking changes, and finally gives a stability verdict. |
| priority-sensitivity-testing | 35 | \| weight-perturbation \| Apply ±20% perturbations to each dimension weight and recompute the ranking \| Second step, systematic perturbation \| |
| priority-sensitivity-testing | 42 | 2. weight-perturbation: apply +20% and -20% perturbations to each dimension in turn (the remaining dimensions are adjusted proportionally to keep the sum at 1), producing a ranking for each perturbation scenario |
| priority-sensitivity-testing | 47 | - Perturb only the highest-weight dimension (±20%), producing 2 perturbation scenarios |
| priority-sensitivity-testing | 52 | - weight-perturbation expands the perturbation range to ±30% and adds extreme scenarios (one dimension's weight set to 0) |
| priority-sensitivity-testing | 58 | - Ranking results for at least 3 perturbation scenarios (each scenario annotated with its perturbation content) |
| best-option-selection | 21 | \| Base SOP \| Target \| ±10% Range \| |
| full-ranking | 22 | \| Base SOP \| Target \| ±10% Range \| |
| full-ranking | 64 | 2. Select >=2 ranking methods (recommended: PROMETHEE II + MAVT) |
| category-sorting | 22 | \| Base SOP \| Target \| ±10% Range \| |
| non-compensatory-screening | 27 | \| Base SOP \| Target \| ±10% Range \| |
| weight-elicitation | 23 | \| Base SOP \| Target \| ±10% Range \| |
| weight-elicitation | 26 | \| weight-elicitation-sop \| ≥2 methods \| 2-3 \| |
| weight-elicitation | 60 | 2. Select >=2 weighting methods (recommended: AHP + BWM or Swing + Simos) |
| direction-narrowing | 36 | - `broad-paper-search`: at least 80 papers scanned |
| direction-narrowing | 37 | - `deep-web-search`: at least 30 web pages read in full |
| direction-narrowing | 51 | \| deep-web-search \| Full-page web reading for non-academic perspectives — blogs, tech reports, product pages, industry analysis. Spawns a subagent to read pages in isolated context. Hard constraint: at least 30 web pages read in full. \| |
| direction-narrowing | 52 | \| north-star-crystallization-broad-paper-search \| Paper landscape scan within selected field(s). Strict import of literature-engine/literature-overview skill. Hard constraint: at least 80 papers scanned. \| |
