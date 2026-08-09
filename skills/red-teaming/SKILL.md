---
name: red-teaming
description: 'Campaign: Systematic adversarial attack from military/intelligence/AI-safety
  traditions. Core question: Can systematic adversarial attacks find fatal flaws?
  Methods: UFMCS Red Team Handbook v9.0, CIA SAT, Anthropic Red Teaming, NIST AI RMF,
  Inie et al. 12-strategy taxonomy.'
type: campaign
produces: RedTeamReport
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
  - adversarial-persona
  - alternative-analysis
  - groupthink-mitigation
  - stress-test-assumption-challenge
  - systematic-probing
  tactics:
  - adversarial-roleplay
  - assumption-cascade
  - structured-attack-campaign
  sops:
  - context-checkpoint
  - context-init
  - mitigation-proposal
  - stress-test-saturation-detection
  - verdict-synthesis
  - weakness-classification
---

# Red Teaming Campaign

Core question: **Can systematic adversarial attacks find fatal flaws in this artifact?**

## Methodology Sources

- UFMCS Red Team Handbook v9.0 — Military structured analytic techniques
- CIA Structured Analytic Techniques (SAT) — Key Assumptions Check, Devil's Advocacy
- Anthropic Red Teaming (2022) — AI-safety systematic probing methodology
- NIST AI Risk Management Framework — Threat surface enumeration
- Inie et al. (2024) — 12-strategy taxonomy of adversarial attacks

## Strategy Routing

| Artifact Type | Primary Strategy | Fallback Strategy |
|---|---|---|
| hypothesis, claim | assumption-challenge | adversarial-persona |
| research-question | alternative-analysis | groupthink-mitigation |
| idea, approach | systematic-probing | assumption-challenge |
| experiment-design | systematic-probing | alternative-analysis |
| gap | adversarial-persona | groupthink-mitigation |

## Budget Table

| Parameter | S (Quick) | M (Standard) | L (Deep) |
|---|---|---|---|
| Attack vectors | 5 | 12 | 20 |
| Probing rounds | 3 | 6 | 10 |
| Personas | 2 | 4 | 6 |
| Assumption checks | 5 | 10 | 20 |

## Tactics

- **structured-attack-campaign** — Threat surface enumeration, vector generation, systematic probing, aggregation
- **assumption-cascade** — Surface assumptions, dependency sort, root attack, cascade trace
- **adversarial-roleplay** — Construct hostile persona, attack from persona perspective, record paths

## Context Management

Each subagent operates in isolated adversarial context. Persona contamination is prevented by spawning separate agents per attack role. Findings are aggregated only after all probing rounds complete. Attack vectors are deduplicated before scoring.

## Output

Produces `RedTeamReport` containing: threat surface map, attack results by vector, assumption cascade analysis, resilience score (0.0-1.0), critical vulnerabilities, and recommended hardening actions.

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| adversarial-persona | Strategy: Role-play attacks from hostile personas — competing lab researcher, hostile reviewer, funding skeptic, domain outsider — each with distinct attack motivations and blind spots. |
| alternative-analysis | Strategy: What-If Analysis, Alternative Futures, and Four Ways of Seeing — generate competing explanations and scenarios to challenge the dominant narrative. |
| groupthink-mitigation | Strategy: 10th Man Rule and Liberating Structures — institutionalized dissent to prevent premature consensus and expose suppressed objections. |
| stress-test-assumption-challenge | Strategy: Military-grade assumption testing — Key Assumptions Check, Devil's Advocacy, Team A/B analysis to expose hidden dependencies and unexamined beliefs. |
| systematic-probing | Strategy: AI-safety systematic probing — enumerate all threat surfaces, generate attack vectors per surface, execute probes, and aggregate findings across the full attack space. |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| adversarial-roleplay | Tactic: Construct detailed hostile persona, attack artifact from that persona's perspective, record successful attack paths for aggregation. |
| assumption-cascade | Tactic: Surface assumptions, sort by dependency, attack root assumptions first, then trace cascade failures through the dependency graph. |
| structured-attack-campaign | Tactic: Full attack lifecycle — threat surface enumeration, attack vector generation, systematic probing, and finding aggregation across all surfaces. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| mitigation-proposal | Proposes concrete mitigation strategies for identified weaknesses. Generates prevention, detection, and response measures with feasibility assessment. |
| stress-test-saturation-detection | Determines whether validation has reached saturation — no new weaknesses or failure modes being discovered. Used by all 5 campaigns as termination signal. |
| verdict-synthesis | Synthesizes findings from a completed campaign into typed verdict reports. Produces DebateVerdict, RedTeamReport, FailureAnticipationReport, CounterfactualMap, or AdversarialStressReport depending on campaign. Also supports cross-campaign StressTestSummary. |
| weakness-classification | Classifies discovered weaknesses into severity tiers (fatal/major/minor/cosmetic) with structured justification and exploitability assessment. |

<!-- END available-tables (generated) -->
