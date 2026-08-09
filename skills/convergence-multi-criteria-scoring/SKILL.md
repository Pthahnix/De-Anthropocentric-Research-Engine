---
name: convergence-multi-criteria-scoring
description: Multi-Criteria Scoring Campaign — evaluate and rank candidates against
  multiple weighted criteria using AHP, BWM, TOPSIS, VIKOR, ELECTRE, PROMETHEE, MAUT
  methods.
execution: campaign
dependencies:
  strategies:
  - best-option-selection
  - category-sorting
  - full-ranking
  - non-compensatory-screening
  - weight-elicitation
  campaigns:
  - pairwise-ranking
  sops:
  - context-checkpoint
  - context-init
  - convergence-paper-overview
  - convergence-paper-research
  - convergence-paper-search
  - convergence-saturation-detection
  - convergence-sensitivity-analysis
  - convergence-web-research
  - convergence-web-search
---

# Multi-Criteria Scoring

Evaluate and rank candidate alternatives using multi-criteria weighted assessment. Supports mainstream MCDA methods including AHP, BWM, TOPSIS, VIKOR, ELECTRE, PROMETHEE, and MAUT, covering the full workflow from criteria definition, weighting, scoring, to sensitivity analysis.

## Strategy Routing

| Signal | Strategy |
|--------|----------|
| "What criteria? How to score?" / select best option / rank by criteria | best-option-selection |
| "Full ranking" / full ranking / league table / priority list | full-ranking |
| "Categorize" / categorize / A/B/C grading / compliance sorting | category-sorting |
| "Eliminate non-qualifying" / go/no-go / safety screening / veto | non-compensatory-screening |
| "Determine weights" / weight negotiation / criteria importance | weight-elicitation |

## Manifest

### Strategies

| Strategy | Purpose | Budget |
|----------|---------|--------|
| best-option-selection | Select best option from candidates | M |
| full-ranking | Produce complete priority ranking | M |
| category-sorting | Classify candidates into predefined categories | M |
| non-compensatory-screening | Eliminate non-qualifying candidates | S |
| weight-elicitation | Determine criteria weights | S |

### Tactics

| Tactic | Purpose |
|--------|---------|
| scoring-matrix-construction | Define criteria → assign weights → score → aggregate → sensitivity check |
| screening-then-scoring | Non-compensatory elimination first → then fine-grained scoring of survivors |
| multi-method-triangulation | Multi-method comparison → identify method-sensitive options |

### Subagent SOPs

| SOP | Purpose |
|-----|---------|
| criterion-definition | Extract evaluation criteria from research goals and candidates |
| weight-elicitation-sop | Compute criteria weights using specified method |
| alternative-scoring | Score candidates against each criterion |
| normalization | Normalize the score matrix |
| dominance-check | Identify dominated and non-dominated alternatives |
| threshold-setting | Set minimum thresholds for each criterion |
| conjunctive-filter | Eliminate candidates failing thresholds |
| rank-comparison | Compare consistency of multiple ranking results |
| method-sensitivity-report | Analyze impact of method choice on rankings |
| scoring-synthesis | Synthesize scores, rankings, and sensitivity into final recommendation |

## Budget Table

| Metric | Target |
|--------|--------|
| Criteria count | 5-8 |
| Candidate count | 8-15 |
| Weight method comparison | >=2 methods |
| Sensitivity analysis | >=3 parameter perturbations |

## MCP Tools

| Tool | Usage |
|------|-------|
| vault_search | Retrieve existing evaluation criteria and historical scores |
| vault_query_graph | Query relationships and dependencies between alternatives |
| vault_add_edge | Record evaluation result relationships |

## Context Management

- Each SOP executes as a subagent with independent context
- Strategy layer maintains State Ledger to track progress
- Score matrix is passed between SOPs as structured data
- Sensitivity analysis results are aggregated into final synthesis

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| best-option-selection | Select the single best candidate from a set using WSM, TOPSIS, AHP, MAUT, or VIKOR methods. |
| category-sorting | Classify candidates into predefined categories using ELECTRE-Tri, FlowSort, AHPSort, or DRSA methods. |
| full-ranking | Produce a complete ordering of all candidates using PROMETHEE I/II, ELECTRE III, or MAVT methods. |
| non-compensatory-screening | Eliminate non-qualifying candidates using conjunctive rules, dominance filtering, lexicographic ordering, or veto thresholds. |
| weight-elicitation | Determine criteria weights using AHP, Swing, BWM, MACBETH, or Simos methods. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| convergence-paper-overview | Paper landscape scan at abstract level — discover MCDA, voting theory, Delphi, and optimization methodology papers. |
| convergence-paper-research | Full-text deep reading of methodology papers — complete understanding of algorithms, proofs, and implementation details. |
| convergence-paper-search | Paper AI summary reading — deeper understanding of specific methodology papers without full-text commitment. |
| convergence-saturation-detection | Determines when to stop iterating — coverage threshold met or marginal returns diminishing. Shared across all campaigns. |
| convergence-sensitivity-analysis | Tests conclusion robustness by perturbing parameters and observing rank changes. Shared across scoring, portfolio, and steel-manning campaigns. |
| convergence-web-research | Deep web research with full-page extraction — detailed methodology guides, tutorials, implementation references. |
| convergence-web-search | Quick web scan to discover relevant pages — methodology references, case studies, best practices for convergence methods. |

## Available Campaigns

Optional, no fixed order; the final leaf is always a sop.

| Campaign | When to use |
| --- | --- |
| pairwise-ranking | Pairwise Ranking Campaign — produce global rankings through pairwise comparisons and voting aggregation using Bradley-Terry, Elo, TrueSkill, Condorcet, Borda, Schulze methods. |

<!-- END available-tables (generated) -->
