# analyze-constraints-readiness

## Purpose

Assess feasibility and readiness by identifying constraints, resources, dependencies, bottlenecks, and maturation gates.

## Input contract

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

Append dimension scores/evidence, constraint IDs, bottleneck rationale, resources, gates, and unresolved conflicts.
## Preserved threshold ledger (verbatim source lines)

- \x60feasibility-assessment:75\x60 | Dimensions assessed | >= 5 (technical, market, regulatory, resource, organizational) |
- \x60feasibility-assessment:76\x60 | Blockers identified | >= 3 per candidate |
- \x60feasibility-assessment:77\x60 | Estimate precision | from +/-30% to +/-10% through iteration |
- \x60feasibility-assessment:78\x60 | Gates evaluated | >= 3 stage gates |
- \x60maturity-diagnosis:23\x60 | Dimensions scored | >= 5 |
- \x60maturity-diagnosis:24\x60 | Evidence items per dimension | >= 2 |
- \x60maturity-diagnosis:25\x60 | Bottlenecks identified | >= 1 |
- \x60constraint-identification:23\x60 | Constraints identified | >= 3 per candidate |
- \x60constraint-identification:24\x60 | Hard constraints classified | >= 1 |
- \x60constraint-identification:25\x60 | Removal paths designed | >= 1 per removable constraint |
- \x60resource-envelope-estimation:24\x60 | Estimate dimensions | >= 3 (time, cost, personnel) |
- \x60resource-envelope-estimation:25\x60 | Precision range | +/-30% initial, +/-10% refined |
- \x60resource-envelope-estimation:26\x60 | Reference analogies | >= 2 per estimate |
- \x60resource-envelope-estimation:58\x60 3. Identify >= 2 analogous projects and extract their actual resource consumption
- \x60comparative-feasibility-ranking:27\x60 | Candidates compared | >= 2 |
- \x60comparative-feasibility-ranking:28\x60 | Dimensions in radar | >= 5 |
- \x60maturation-pathway-design:27\x60 | Stage gates defined | >= 3 |
- \x60maturation-pathway-design:28\x60 | Milestones per stage | >= 2 |
- \x60multi-dimensional-readiness-scan:39\x60 - Each dimension should have at least 2 evidence items supporting the score
- \x60multi-dimensional-readiness-scan:43\x60 - Complete radar with >= 5 dimensions scored
- \x60constraint-drilling:47\x60 - Classified constraint list with >= 3 constraints identified
- \x60staged-gate-evaluation:35\x60 - Stage 1 should define >= 3 gates (e.g., concept feasibility, technical feasibility, implementation readiness)
- \x60constraint-analysis:82\x60 | Subagent calls | Ём15 per strategy | Pause and report partial |
- \x60constraint-analysis:83\x60 | Wall-clock time | Ём30 min per strategy | Checkpoint and continue |
- \x60constraint-analysis:84\x60 | Context tokens | Ём80k per strategy | Summarize and spawn fresh |
- \x60constraint-analysis:85\x60 | Total campaign | Ём5 strategies | Skip if constraint already resolved |
- \x60constraint-analysis:97\x60 - At least 1 binding constraint identified and characterized
- \x60constraint-analysis:100\x60 - No unresolved conflicts between top-3 constraints
- \x60resource-constraint:67\x60 | Subagent calls | Ём6 | 3 SOPs + synthesis |
- \x60resource-constraint:68\x60 | Iterations | Ём2 | Re-quantify if estimates change |
- \x60resource-constraint:69\x60 | Output size | Ём3000 tokens | Gap table + recommendation |
- \x60assumption-constraint:55\x60    - Top-5 fragile assumptions with validation paths
- \x60assumption-constraint:62\x60 | Subagent calls | Ём5 | 2 SOPs + synthesis |
- \x60assumption-constraint:63\x60 | Iterations | Ём2 | Re-rank if new assumptions surface |
- \x60assumption-constraint:64\x60 | Output size | Ём3000 tokens | Ranked table + validation plan |
- \x60dependency-constraint:64\x60 | Subagent calls | Ём5 | 2 SOPs + synthesis |
- \x60dependency-constraint:65\x60 | Iterations | Ём2 | Re-build if tasks change |
- \x60dependency-constraint:66\x60 | Output size | Ём3000 tokens | Graph summary + critical chain |
- \x60conflict-resolution:70\x60 | Subagent calls | Ём8 | 3 SOPs + injection generation + validation |
- \x60conflict-resolution:71\x60 | Iterations | Ём3 | May need multiple injection attempts |
- \x60conflict-resolution:72\x60 | Output size | Ём3000 tokens | EC + injection + FRT summary |
- \x60constraint-tree-building:42\x60 - **When to escalate**: If >10 UDEs found, prioritize top-5 by severity before tracing
- \x60constraint-breaking:54\x60 - **Success criterion**: At least one injection that resolves the conflict with Ём2 manageable side effects
