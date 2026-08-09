---
name: deep-insight-sensitivity-analysis
description: Sensitivity Analysis Campaign — identify which assumptions are most critical
  by measuring their impact on conclusions. 5 strategies (parameter-screening, variance-decomposition,
  assumption-criticality, uncertainty-propagation, decision-sensitivity), 3 tactics,
  11 subagent SOPs.
execution: campaign
dependencies:
  strategies:
  - assumption-criticality
  - decision-sensitivity
  - parameter-screening
  - uncertainty-propagation
  - variance-decomposition
  sops:
  - context-checkpoint
  - context-init
---

# Sensitivity Analysis

Identify which assumptions are most critical — rank by impact on conclusions.

## Design Philosophy

This campaign is a strategy book — CC reads, internalizes, and autonomously constructs an approach.

## Strategy Routing

| Signal | Strategy |
|--------|----------|
| quick screening, Morris method, OAT, preliminary elimination | → parameter-screening |
| variance decomposition, Sobol indices, contribution, interaction effects | → variance-decomposition |
| assumption criticality, perturbation, negation, re-derivation | → assumption-criticality |
| uncertainty propagation, Monte Carlo, distributions, Bayesian | → uncertainty-propagation |
| decision sensitivity, EVPI, influence diagrams, tornado diagrams | → decision-sensitivity |

## Available Tactics

- screening-then-decomposition — Morris quick screen then Sobol precise decomposition
- assumption-perturbation — one-at-a-time assumption negation and re-derivation
- uncertainty-cascade — Monte Carlo propagation through model

## Available SOPs

**Import (5):** web-search, web-research, paper-overview, paper-search, paper-research

**Subagent (11):** morris-screening, sobol-decomposition, interaction-detection, assumption-extraction, negation-definition, re-derivation, conclusion-sensitivity-measurement, distribution-assignment, monte-carlo-sampling, critical-path-identification, sensitivity-synthesis

**Shared (1):** assumption-surfacing

## Context Management

context-checkpoint after each strategy completes.

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| assumption-criticality | Measure how much conclusions change when each assumption is negated. Ranks assumptions by their impact on the final result. |
| decision-sensitivity | Identify which uncertainties would actually change the research direction decision. Compute EVPI to prioritize uncertainty reduction. |
| parameter-screening | Quick Morris method screening to identify which parameters have large effects and which can be safely ignored. |
| uncertainty-propagation | Propagate input uncertainties through the model via Monte Carlo sampling. Identifies which input uncertainties contribute most to output uncertainty. |
| variance-decomposition | Sobol variance decomposition — compute first-order and total-order sensitivity indices to quantify each parameter's contribution to output variance. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |

<!-- END available-tables (generated) -->
