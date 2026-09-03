# analyze-constraints-readiness

## Purpose

Assess feasibility and readiness by identifying constraints, resources, dependencies, bottlenecks, and maturation gates.

## Input contract (speculative branch C)

```yaml
required: [candidate_or_plan, readiness_dimensions]
optional: [resource_estimates, dependencies, assumptions, target_gates]
constraints: [evidence attached to each scored dimension]
```

## Execution protocol

1. Define candidate, dimensions, hard constraints, and target gates.
2. Select `obstacle-triage`, `readiness-assessment`, `resource-envelope`, `causal-constraint-analysis`, or `maturation-path`.
3. Score dimensions with evidence, identify binding constraints and dependencies.
4. Design removal/mitigation paths, stage gates, and a readiness conclusion.

## Output contract

```yaml
produces: [readiness_profile, constraint_register, bottlenecks, resource_envelope, stage_gates, mitigation_paths]
delta_fields: [findings, decisions, uncertainties, open_questions, recommended_jumps]
```

## Thresholds and quality gates

- Feasibility dimensions >=5; blockers >=3 per candidate where source protocol applies.
- Maturity diagnosis: >=5 dimensions, >=2 evidence items per dimension, >=1 bottleneck.
- Constraint identification: >=3 constraints per candidate; >=1 hard constraint; >=1 removal path per removable constraint.
- Resource envelope: >=3 dimensions (time, cost, personnel) and >=2 analogies per estimate.
- Maturation path: >=3 stage gates and >=2 milestones per stage.
- Binding constraint threshold: sensitivity score >2× median.

## Failure and counterexamples

Do not label a candidate ready with missing evidence, unclassified hard constraints, or an unbounded resource estimate. A conflict with no manageable injection remains blocked.

## Provenance map

26 architecture `old` entries; readiness, feasibility, resource, obstacle, dependency, sensitivity, and maturation families are merged by mode. Missing aliases are listed in log.

## Context checkpoint / Delta notes

Append dimension scores/evidence, constraint IDs, bottleneck rationale, resources, gates, and unresolved conflicts. Contract syntax is provisional Branch C.
