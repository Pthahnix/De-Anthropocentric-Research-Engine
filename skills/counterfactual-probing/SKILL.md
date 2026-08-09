---
name: counterfactual-probing
description: 'Campaign: Counterfactual reasoning to identify load-bearing factors.
  Core question: If key factors were different, would the conclusion still hold? Methods:
  Pearl SCM Three-Step, Lewis Possible Worlds, Tetlock & Belkin, PNS/PS.'
type: campaign
produces: CounterfactualMap
artifact-types:
- gap
- hypothesis
- research-question
- idea
- approach
- experiment-design
- claim
dependencies:
  strategies:
  - closest-worlds
  - factor-removal
  - necessity-sufficiency
  - structural-counterfactual
  - thought-experiment
  tactics:
  - causal-necessity-testing
  - minimal-change-search
  - systematic-factor-ablation
  sops:
  - context-checkpoint
  - context-init
  - stress-test-saturation-detection
  - verdict-synthesis
---

# Counterfactual Probing Campaign

Core question: **If key factors were different, would the conclusion still hold?**

## Methodology Sources

- Pearl (2000) — Structural Causal Models, Three-Step counterfactual procedure
- Lewis (1973) — Possible Worlds semantics for counterfactuals
- Tetlock & Belkin (1996) — Counterfactual thought experiments in world politics
- Fearon (1991) — Counterfactuals and hypothesis testing in political science
- Williamson (2007) — The Philosophy of Philosophy, thought experiment methodology

## Strategy Routing

| Artifact Type | Primary Strategy | Fallback Strategy |
|---|---|---|
| hypothesis, claim | structural-counterfactual | necessity-sufficiency |
| research-question | thought-experiment | closest-worlds |
| idea, approach | factor-removal | closest-worlds |
| experiment-design | necessity-sufficiency | structural-counterfactual |
| gap | closest-worlds | factor-removal |

## Budget Table

| Parameter | S (Quick) | M (Standard) | L (Deep) |
|---|---|---|---|
| Factors examined | 5 | 10 | 20 |
| Counterfactual scenarios | 3 | 8 | 15 |
| Necessity tests | 3 | 6 | 12 |
| Flip-point search depth | 2 | 4 | 8 |

## Tactics

- **systematic-factor-ablation** — Remove factors one at a time, observe conclusion stability
- **minimal-change-search** — Find smallest change that flips the conclusion
- **causal-necessity-testing** — Evaluate necessity and sufficiency of each causal claim

## Context Management

Each subagent operates in isolated context. Factor enumeration precedes all counterfactual reasoning. Scenarios are constructed with minimal deviation from actuality. Fragility measurements aggregate across all tested factors.

## Output

Produces `CounterfactualMap` containing: load-bearing factors ranked by necessity, fragility index per factor, flip-points identified, robustness assessment, and recommended sensitivity analyses.

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| closest-worlds | Strategy: Lewis Possible Worlds — find the minimal change to reality that would flip the conclusion, measuring how close the nearest world where the conclusion fails. |
| factor-removal | Strategy: Systematic factor removal — remove factors one at a time and observe whether the conclusion remains stable, identifying which factors are load-bearing. |
| necessity-sufficiency | Strategy: Probability of Necessity and Sufficiency (PNS/PS) — systematically evaluate whether each factor is necessary, sufficient, both, or neither for the conclusion. |
| structural-counterfactual | Strategy: Pearl Three-Step counterfactual — Abduction (fit model to evidence), Action (intervene on factor), Prediction (derive counterfactual outcome). |
| thought-experiment | Strategy: Williamson-style precise thought experiments — construct carefully specified counterfactual scenarios to test whether conclusions depend on contingent features. |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| causal-necessity-testing | Tactic: Extract causal claims, evaluate probability of necessity (PN) and sufficiency (PS) for each, classify into necessity-sufficiency quadrants. |
| minimal-change-search | Tactic: Generate candidate changes, detect flip-points where conclusion reverses, measure fragility as distance to nearest flip. |
| systematic-factor-ablation | Tactic: List all factors, remove one at a time, assess conclusion stability, rank factors by load-bearing importance. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| stress-test-saturation-detection | Determines whether validation has reached saturation — no new weaknesses or failure modes being discovered. Used by all 5 campaigns as termination signal. |
| verdict-synthesis | Synthesizes findings from a completed campaign into typed verdict reports. Produces DebateVerdict, RedTeamReport, FailureAnticipationReport, CounterfactualMap, or AdversarialStressReport depending on campaign. Also supports cross-campaign StressTestSummary. |

<!-- END available-tables (generated) -->
