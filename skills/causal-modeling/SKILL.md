---
name: causal-modeling
description: Campaign for building causal models — identify variables, map mechanisms,
  collect evidence, analyze interventions, validate models. Produces causal graphs
  in the wiki vault.
execution: campaign
dependencies:
  strategies:
  - evidence-collection
  - intervention-analysis
  - knowledge-structuring-variable-identification
  - mechanism-mapping
  - model-validation
  tactics:
  - counterfactual-reasoning
  - evidence-weighing
  - feedback-loop-detection
  - knowledge-compilation
  sops:
  - context-checkpoint
  - context-init
---

# Causal Modeling

Build causal models for research domains. Identifies variables, maps causal mechanisms, collects supporting evidence, analyzes potential interventions, and validates the resulting causal graph.

## Manifest

| Level | Count | Skills |
|-------|-------|--------|
| Strategy | 5 | variable-identification, mechanism-mapping, evidence-collection, intervention-analysis, model-validation |
| Tactic | 3 | counterfactual-reasoning, evidence-weighing, feedback-loop-detection |
| SOP | 10 | variable-page-creation, mechanism-edge-creation, evidence-linking, contradiction-flagging, confidence-scoring, intervention-page-creation, loop-documentation, model-gap-detection, causal-chain-query, validation-report |

## Budget Table

| Metric | Small | Medium | Large |
|--------|-------|--------|-------|
| Variables identified | 8 | 20 | 40 |
| Causal edges created | 15 | 40 | 80 |
| Evidence pages linked | 10 | 30 | 60 |
| Interventions analyzed | 2 | 5 | 10 |
| Feedback loops documented | 1 | 3 | 6 |

## Strategy Sequence (Reference, Not Prescription)

1. **variable-identification** — identify key variables in the causal system
2. **mechanism-mapping** — map causal mechanisms between variables
3. **evidence-collection** — gather evidence supporting/refuting causal claims
4. **intervention-analysis** — analyze what happens when variables are manipulated
5. **model-validation** — validate the causal model for consistency and completeness

## MCP Tools Used

- `vault_search` — find existing variables and mechanisms
- `vault_add_edge` — create causal edges (derived_from, supported_by, contradicts)
- `vault_query_graph` — trace causal chains
- `vault_graph_stats` — assess model coverage
- `vault_lint` — validate structural integrity

## Context-Management

<HARD-GATE>
- Call `context-init` at campaign start
- Call `context-checkpoint` after each strategy completes
- Call `knowledge-compilation` after each strategy
</HARD-GATE>

## Guiding Principles

- **Correlation is not causation.** Every causal edge must have mechanistic justification, not just statistical association.
- **Confounders are everywhere.** Actively search for confounding variables that could explain observed relationships.
- **Interventions reveal truth.** The strongest evidence for causation comes from intervention studies.
- **Feedback loops are the norm.** Most real systems have circular causation. Document loops explicitly.
- **Confidence is calibrated.** Strong mechanism + strong evidence = high confidence. Weak either = low confidence.

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| evidence-collection | Gather evidence for causal claims |
| intervention-analysis | Analyze interventions and manipulations on the causal system |
| knowledge-structuring-variable-identification | Identify key variables in the causal system |
| mechanism-mapping | Map causal mechanisms between variables |
| model-validation | Validate causal model consistency |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| counterfactual-reasoning | Tactic for reasoning about what would happen if variables were different — supports causal identification and intervention analysis. |
| evidence-weighing | Tactic for assessing the strength and relevance of evidence for causal claims — distinguishes correlation from causation. |
| feedback-loop-detection | Tactic for identifying circular causation — detect feedback loops, classify as reinforcing or balancing, document loop structure. |
| knowledge-compilation | Tactic for compiling research findings into vault pages — orchestrates page creation, updates, edge linking, and index maintenance. Minimum yield ≥3 page operations per invocation. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |

<!-- END available-tables (generated) -->
