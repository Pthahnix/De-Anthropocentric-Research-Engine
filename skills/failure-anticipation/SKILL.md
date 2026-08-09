---
name: failure-anticipation
description: 'Campaign: Forward-looking failure analysis combining pre-mortem rapid
  screening with systematic FMEA deep-dive. Core question: If this artifact fails,
  how will it fail? Methods: Klein Pre-Mortem 2007, AIAG-VDA FMEA 2019, IEC 60812.'
type: campaign
produces: FailureAnticipationReport
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
  - design-fmea
  - mitigation-design
  - process-fmea
  - prospective-hindsight
  - risk-prioritization
  tactics:
  - failure-chain-tracing
  - mitigation-validation
  - premortem-to-fmea-pipeline
  sops:
  - context-checkpoint
  - context-init
  - mitigation-proposal
  - stress-test-saturation-detection
  - verdict-synthesis
---

# Failure Anticipation Campaign

Core question: **If this artifact fails, how will it fail?**

## Methodology Sources

- Klein (2007) — Pre-Mortem technique: assume failure, retrospect causes
- AIAG-VDA FMEA Handbook (2019) — 7-step FMEA with Action Priority
- IEC 60812 — Failure modes and effects analysis standard

## Strategy Routing

| Artifact Type | Primary Strategy | Fallback Strategy |
|---|---|---|
| hypothesis, claim | prospective-hindsight | design-fmea |
| research-question | design-fmea | process-fmea |
| idea, approach | design-fmea | prospective-hindsight |
| experiment-design | process-fmea | design-fmea |
| gap | risk-prioritization | prospective-hindsight |

## Budget Table

| Parameter | S (Quick) | M (Standard) | L (Deep) |
|---|---|---|---|
| Failure modes | 8 | 20 | 40 |
| Failure chain depth | 2 | 4 | 6 |
| Mitigation measures | 3 | 8 | 15 |
| Re-scoring rounds | 1 | 2 | 3 |

## Tactics

- **premortem-to-fmea-pipeline** — Pre-mortem screens, high-risk items trigger full FMEA
- **failure-chain-tracing** — Trace upstream causes and downstream effects
- **mitigation-validation** — Mini-FMEA on proposed mitigations to verify no new risks

## Context Management

Each subagent operates in isolated context. Pre-mortem facilitation runs first to generate rapid failure scenarios. High-severity items are passed to FMEA subagents for structured analysis. Severity/Occurrence/Detection scores flow through action-priority-matrix for classification. Mitigations are validated via re-scoring loop.

## Output

Produces `FailureAnticipationReport` containing: failure mode catalog, cause-effect chains, S/O/D scores, action priority classification (H/M/L), mitigation measures, and post-mitigation re-scores.

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| design-fmea | Strategy: Research design-level FMEA — function analysis, failure mode identification, severity/occurrence/detection scoring per AIAG-VDA 2019. |
| mitigation-design | Strategy: Design prevention, detection, and response measures for high-priority failure modes. Produces actionable countermeasures validated via re-scoring. |
| process-fmea | Strategy: Research execution process FMEA — analyzes how the research process itself can fail during execution, distinct from design-level failures. |
| prospective-hindsight | Strategy: Klein pre-mortem — assume the artifact has failed, then retrospect plausible causes. Generates rapid failure scenario catalog. |
| risk-prioritization | Strategy: Action Priority matrix — classifies failure modes into H/M/L priority using severity-weighted scoring per AIAG-VDA 2019 Action Priority tables. |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| failure-chain-tracing | Tactic: Trace upstream causes and downstream effects of each failure mode. Builds multi-level cause-mode-effect chains for systemic understanding. |
| mitigation-validation | Tactic: Run mini-FMEA on proposed mitigations to verify they do not introduce new failure modes. Prevents mitigation-induced risks. |
| premortem-to-fmea-pipeline | Tactic: Pre-mortem rapid screening feeds high-risk items into full FMEA analysis. Bridges fast intuitive generation with systematic structured analysis. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| mitigation-proposal | Proposes concrete mitigation strategies for identified weaknesses. Generates prevention, detection, and response measures with feasibility assessment. |
| stress-test-saturation-detection | Determines whether validation has reached saturation — no new weaknesses or failure modes being discovered. Used by all 5 campaigns as termination signal. |
| verdict-synthesis | Synthesizes findings from a completed campaign into typed verdict reports. Produces DebateVerdict, RedTeamReport, FailureAnticipationReport, CounterfactualMap, or AdversarialStressReport depending on campaign. Also supports cross-campaign StressTestSummary. |

<!-- END available-tables (generated) -->
