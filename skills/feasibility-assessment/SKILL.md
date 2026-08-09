---
name: feasibility-assessment
description: Feasibility Assessment Campaign — evaluate whether selected candidates
  can actually be implemented using TRL, NASSS, Stage-Gate, TRIZ, TOC, and parametric
  estimation methods.
execution: campaign
dependencies:
  strategies:
  - comparative-feasibility-ranking
  - constraint-identification
  - maturation-pathway-design
  - maturity-diagnosis
  - resource-envelope-estimation
  sops:
  - context-checkpoint
  - context-init
  - convergence-paper-research
  - convergence-paper-search
  - convergence-saturation-detection
---

# Feasibility Assessment

Evaluate whether selected research candidates can actually be implemented. This campaign applies Technology Readiness Levels (TRL), NASSS complexity framework, Stage-Gate processes, TRIZ contradiction analysis, Theory of Constraints (TOC), and parametric estimation to determine real-world viability before committing resources.

## Strategy Routing

| Signal | Strategy |
|--------|----------|
| assess readiness level / maturity / TRL | maturity-diagnosis |
| identify blockers / constraints / showstoppers | constraint-identification |
| estimate resources / budget / timeline | resource-envelope-estimation |
| compare feasibility across candidates | comparative-feasibility-ranking |
| design maturation path / roadmap to readiness | maturation-pathway-design |

## Manifest

### Strategies

| Strategy | Description |
|----------|-------------|
| maturity-diagnosis | Assess current readiness using TRL 9-level, NASSS 7-dimension, and Innovation Readiness Level frameworks |
| constraint-identification | Find blockers using TOC, TRIZ contradiction analysis, and Pre-mortem techniques |
| resource-envelope-estimation | Estimate resources using parametric, analogous, and three-point (PERT) estimation |
| comparative-feasibility-ranking | Compare candidates using multi-dimensional radar and weighted feasibility index |
| maturation-pathway-design | Design path to readiness using Stage-Gate, Technology Roadmapping, and milestone planning |

### Tactics

| Tactic | Description |
|--------|-------------|
| multi-dimensional-readiness-scan | Assess each dimension, synthesize radar, identify bottlenecks |
| constraint-drilling | Identify constraints, classify, assess removability, design removal path |
| staged-gate-evaluation | Define gate criteria, evaluate at each gate, render go/kill/recycle decision |

### SOPs

| SOP | Description |
|-----|-------------|
| dimension-assessment | Score a single readiness dimension with evidence and gap analysis |
| radar-synthesis | Synthesize dimension scores into radar chart data and overall readiness |
| bottleneck-identification | Identify bottlenecks from radar data with severity ranking |
| constraint-identification-sop | Identify constraints for a candidate in context |
| constraint-classification | Classify constraints into hard, soft, and assumptions |
| removability-assessment | Assess removability of a constraint with effort estimate |
| removal-path | Design removal steps with timeline and resource needs |
| gate-criteria-definition | Define gate criteria and pass thresholds for a stage |
| gate-judgment | Render GO/KILL/RECYCLE verdict with evidence |
| feasibility-synthesis | Synthesize all assessments into feasibility matrix and recommendation |

## Budget Table

| Metric | Target |
|--------|--------|
| Dimensions assessed | >= 5 (technical, market, regulatory, resource, organizational) |
| Blockers identified | >= 3 per candidate |
| Estimate precision | from +/-30% to +/-10% through iteration |
| Gates evaluated | >= 3 stage gates |

## MCP Tools

- `vault_search` — find prior feasibility assessments and readiness data
- `vault_query_graph` — traverse relationships between candidates and constraints
- `vault_add_edge` — link feasibility findings to candidates
- `semantic-scholar` — retrieve technical maturity evidence from literature

## Context Management

State is maintained in the campaign ledger with keys:
- `candidates[]` — items under feasibility assessment
- `dimension_scores{}` — readiness scores per dimension per candidate
- `constraints{}` — identified constraints per candidate
- `gate_verdicts{}` — stage-gate decisions
- `feasibility_matrix` — final comparative matrix

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| comparative-feasibility-ranking | Compare feasibility across multiple candidates using multi-dimensional radar and weighted feasibility index. |
| constraint-identification | Find blockers and showstoppers using TOC, TRIZ contradiction analysis, and Pre-mortem techniques. |
| maturation-pathway-design | Design path to readiness using Stage-Gate, Technology Roadmapping, and milestone planning methods. |
| maturity-diagnosis | Assess current readiness of candidates using TRL 9-level, NASSS 7-dimension, and Innovation Readiness Level frameworks. |
| resource-envelope-estimation | Estimate resources, budget, and timeline using parametric, analogous, and three-point (PERT) estimation methods. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| convergence-paper-research | Full-text deep reading of methodology papers — complete understanding of algorithms, proofs, and implementation details. |
| convergence-paper-search | Paper AI summary reading — deeper understanding of specific methodology papers without full-text commitment. |
| convergence-saturation-detection | Determines when to stop iterating — coverage threshold met or marginal returns diminishing. Shared across all campaigns. |

<!-- END available-tables (generated) -->
