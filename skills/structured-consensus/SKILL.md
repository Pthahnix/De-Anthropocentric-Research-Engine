---
name: structured-consensus
description: Structured Consensus Campaign — converge multiple perspectives into shared
  agreement through iterative structured dialogue using Delphi variants, NGT, RAND/UCLA,
  Consensus Conference methods.
execution: campaign
dependencies:
  strategies:
  - appropriateness-bounding
  - argument-crystallization
  - convergence-distillation
  - disagreement-cartography
  - futures-calibration
  campaigns:
  - convergence-multi-criteria-scoring
  sops:
  - context-checkpoint
  - context-init
  - convergence-multi-stakeholder-simulation
  - convergence-saturation-detection
---

# Structured Consensus

Converge multiple independent perspectives into shared agreement through iterative structured dialogue. This campaign orchestrates Delphi variants, Nominal Group Technique, RAND/UCLA Appropriateness Method, and Consensus Conference protocols to systematically reduce disagreement while preserving legitimate dissent.

## Strategy Routing

| Signal | Strategy |
|--------|----------|
| Iterative convergence to single answer / establish guidelines / determine threshold | convergence-distillation |
| Map disagreement structure / wicked problems / value conflicts | disagreement-cartography |
| Aggregate probability judgments / technology timeline / market forecast | futures-calibration |
| Establish acceptability standards / medical guidelines / regulatory standards | appropriateness-bounding |
| Distill strongest arguments / policy deliberation / interdisciplinary dispute | argument-crystallization |

## Manifest

### Strategies

| Strategy | Method Family | Purpose |
|----------|--------------|---------|
| convergence-distillation | Classic Delphi, Modified Delphi, NGT | Iterative convergence to single answer |
| disagreement-cartography | Policy Delphi, Argument Delphi, SAST | Map disagreement structure |
| futures-calibration | Real-Time Delphi, Prediction Markets | Aggregate probability judgments |
| appropriateness-bounding | RAND/UCLA Appropriateness, Consensus Conference | Establish acceptability standards |
| argument-crystallization | Argument Delphi, Dialectical Delphi | Distill strongest arguments |

### Tactics

| Tactic | Purpose | SOPs |
|--------|---------|------|
| iterative-convergence-round | Collect → feedback → revise → check → decide | judgment-collection, feedback-distribution, consensus-measurement, round-decision |
| disagreement-mapping | Collect → cluster → extract arguments → visualize | judgment-collection, cluster-analysis, argument-extraction, disagreement-visualization |
| threshold-calibration | Adjust thresholds → observe consensus changes | threshold-sweep, consensus-classification, consensus-measurement |

### SOPs

| SOP | Input | Output |
|-----|-------|--------|
| judgment-collection | question, perspectives[] | judgments[] |
| feedback-distribution | judgments[], round_n | feedback_report |
| consensus-measurement | judgments[] | consensus_score, method_used |
| round-decision | consensus_score, round_n, stability | continue/stop |
| cluster-analysis | judgments[] | clusters[], cluster_characterization[] |
| argument-extraction | cluster, judgments[] | arguments[] |
| disagreement-visualization | clusters[], arguments[] | disagreement_map |
| threshold-sweep | judgments[], threshold_range | threshold_curve |
| consensus-classification | judgments[], threshold | consensus_items[], dissensus_items[] |
| consensus-synthesis | rounds_history, final_judgments | consensus_report |

## Budget Table (M Tier)

| Parameter | Constraint |
|-----------|-----------|
| Perspectives/experts | >=4 independent perspectives |
| Iteration rounds | 2-4 rounds (until consensus threshold or stability) |
| Consensus threshold | >=70% agreement or IQR <= 1 |
| Dissent documentation | All non-consensus items must document reasons |

## MCP Tools

- `mcp__semantic-scholar__relevanceSearch` — find methodological references
- `mcp__wiki-vault__vault_search` — retrieve prior consensus results from vault

## Context Management

- Each round's judgments are stored in state and passed forward
- Feedback reports summarize prior round without exposing individual identities
- Final synthesis aggregates all rounds into a single consensus report
- Non-consensus items are explicitly documented with dissent rationale

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| appropriateness-bounding | Establish acceptability standards through RAND/UCLA Appropriateness Method or Consensus Conference protocols. |
| argument-crystallization | Distill the strongest arguments from each perspective through Argument Delphi or Dialectical Delphi methods. |
| convergence-distillation | Iterative convergence to a single answer through Classic Delphi, Modified Delphi, or Nominal Group Technique rounds. |
| disagreement-cartography | Map the structure of disagreement across perspectives using Policy Delphi, Argument Delphi, or SAST methods. |
| futures-calibration | Aggregate probability judgments across perspectives using Real-Time Delphi or prediction market mechanisms. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| convergence-multi-stakeholder-simulation | Simulates diverse stakeholder perspectives and their strongest objections/support arguments. Shared across steel-manning and consensus campaigns. |
| convergence-saturation-detection | Determines when to stop iterating — coverage threshold met or marginal returns diminishing. Shared across all campaigns. |

## Available Campaigns

Optional, no fixed order; the final leaf is always a sop.

| Campaign | When to use |
| --- | --- |
| convergence-multi-criteria-scoring | Multi-Criteria Scoring Campaign — evaluate and rank candidates against multiple weighted criteria using AHP, BWM, TOPSIS, VIKOR, ELECTRE, PROMETHEE, MAUT methods. |

<!-- END available-tables (generated) -->
