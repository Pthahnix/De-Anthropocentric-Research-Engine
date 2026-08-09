---
name: convergence-portfolio-optimization
description: Portfolio Optimization Campaign — select balanced combinations from candidate
  sets optimizing value, diversity, risk, and robustness using Markowitz, Knapsack,
  Pareto, Real Options, MAP-Elites, and minimax regret methods.
execution: campaign
dependencies:
  strategies:
  - diversity-maximization
  - risk-balancing
  - robustness-under-uncertainty
  - temporal-sequencing
  - value-maximization
  sops:
  - context-checkpoint
  - context-init
  - convergence-saturation-detection
  - convergence-sensitivity-analysis
---

# Portfolio Optimization

Select balanced combinations from candidate sets by optimizing across multiple objectives simultaneously. This campaign applies portfolio theory concepts — originally from finance but broadly applicable — to any selection problem where you must choose a subset from many candidates while balancing competing concerns.

## Strategy Routing

| Signal | Strategy |
|--------|----------|
| maximize total value / ROI / impact within budget | value-maximization |
| maximize coverage / diversity / avoid redundancy | diversity-maximization |
| balance risk / hedge / diversify failure modes | risk-balancing |
| sequence / phase / timeline / dependencies | temporal-sequencing |
| robust under uncertainty / scenario-proof | robustness-under-uncertainty |

## Manifest

### Strategies

| Strategy | Description |
|----------|-------------|
| value-maximization | Maximize total value within constraints using Knapsack, LP, Cost-benefit, NPV ranking |
| diversity-maximization | Maximize portfolio diversity using MAP-Elites, Niche coverage, Maximum dispersion |
| risk-balancing | Balance risk-return using Markowitz mean-variance, CVaR, Risk parity, Kelly criterion |
| temporal-sequencing | Optimal ordering using Real Options, Critical path, Dependency graph, Staged investment |
| robustness-under-uncertainty | Perform well across futures using Minimax regret, Robust optimization, Scenario planning |

### Tactics

| Tactic | Description |
|--------|-------------|
| pareto-frontier-construction | Build and visualize the Pareto frontier, then select from non-dominated solutions |
| niche-coverage-analysis | Map candidates to niches, score coverage, identify gaps |
| scenario-stress-testing | Evaluate portfolio performance across multiple future scenarios |

### SOPs

| SOP | Description |
|-----|-------------|
| objective-definition | Define optimization objectives and constraints from context |
| optimization-run | Execute multi-objective optimization to produce Pareto front |
| pareto-visualization | Visualize trade-offs along the Pareto frontier |
| selection-from-frontier | Select final portfolio from Pareto front given preferences |
| niche-definition | Define niches within the solution space |
| niche-mapping | Map candidates to defined niches |
| coverage-scoring | Score coverage completeness and identify gaps |
| scenario-construction | Construct distinct future scenarios from uncertainties |
| portfolio-evaluation-per-scenario | Evaluate a portfolio under a specific scenario |
| portfolio-synthesis | Synthesize evaluations into final robust portfolio recommendation |

## Budget Table

| Dimension | M-tier Target |
|-----------|---------------|
| Candidates considered | 8-20 |
| Objectives optimized | >=2 simultaneously |
| Scenarios tested | >=3 distinct futures |
| Pareto points generated | >=5 non-dominated solutions |

## MCP Tools

- `mcp__wiki-vault__vault_search` — retrieve prior portfolio analyses and candidate data
- `mcp__wiki-vault__vault_query_graph` — traverse relationships between candidates
- `mcp__wiki-vault__vault_add_edge` — record portfolio decisions and rationale

## Context Management

- Pass candidate list and objective weights between strategy and tactics
- Pareto front data flows from optimization-run to visualization and selection
- Scenario definitions are shared across all evaluation SOPs
- Final synthesis aggregates all per-scenario evaluations

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| diversity-maximization | Maximize portfolio diversity and coverage using MAP-Elites, Niche coverage, Maximum dispersion, and Anti-clustering methods. |
| risk-balancing | Balance portfolio risk and return using Markowitz mean-variance, CVaR, Risk parity, and Kelly criterion methods. |
| robustness-under-uncertainty | Select portfolios that perform well across multiple future scenarios using Minimax regret, Robust optimization, Scenario planning, and Info-gap methods. |
| temporal-sequencing | Determine optimal ordering and phasing of portfolio investments using Real Options, Critical path, Dependency graph, and Staged investment methods. |
| value-maximization | Maximize total portfolio value within constraints using Knapsack, Linear programming, Cost-benefit analysis, and NPV ranking methods. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| convergence-saturation-detection | Determines when to stop iterating — coverage threshold met or marginal returns diminishing. Shared across all campaigns. |
| convergence-sensitivity-analysis | Tests conclusion robustness by perturbing parameters and observing rank changes. Shared across scoring, portfolio, and steel-manning campaigns. |

<!-- END available-tables (generated) -->
