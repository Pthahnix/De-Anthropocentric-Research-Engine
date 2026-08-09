---
name: multiagent-debate
description: 'Campaign: Multi-agent structured debate for adversarial validation.
  Core question: Can this artifact survive structured adversarial debate? Methods:
  Irving AI Safety via Debate, Du Society of Mind, Liang MAD, Toulmin Argumentation,
  D3 framework.'
type: campaign
produces: DebateVerdict
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
  - adversarial-escalation
  - courtroom-structured
  - critic-defender-judge
  - multi-perspective-panel
  - society-of-mind
  tactics:
  - evidence-tournament
  - stress-test-dialectical-escalation
  - stress-test-perspective-rotation
  sops:
  - context-checkpoint
  - context-init
  - debate-transcript-analysis
  - stress-test-saturation-detection
  - verdict-synthesis
  - weakness-classification
---

# Multi-Agent Debate Campaign

Core question: **Can this artifact survive structured adversarial debate?**

## Methodology Sources

- Irving et al. (2018) — AI Safety via Debate
- Du et al. (2023) — Society of Mind multi-agent sharing
- Liang et al. (2023) — MAD (Multi-Agent Debate)
- Toulmin (1958) — Argumentation model (claim, ground, warrant, backing, qualifier, rebuttal)
- D3 framework — Deliberate, Debate, Decide

## Strategy Routing

| Artifact Type | Primary Strategy | Fallback Strategy |
|---|---|---|
| hypothesis, claim | critic-defender-judge | adversarial-escalation |
| research-question | multi-perspective-panel | society-of-mind |
| idea, approach | society-of-mind | courtroom-structured |
| experiment-design | courtroom-structured | critic-defender-judge |
| gap | multi-perspective-panel | adversarial-escalation |

## Budget Table

| Parameter | S (Quick) | M (Standard) | L (Deep) |
|---|---|---|---|
| Debate rounds | 4 | 8 | 12 |
| Participating agents | 3 | 5 | 8 |
| Coverage dimensions | 3 | 5 | 7 |
| External evidence searches | 2 | 5 | 10 |

## Tactics

- **dialectical-escalation** — Progressive pressure escalation based on confidence thresholds
- **perspective-rotation** — Sequential perspective evaluation with divergence aggregation
- **evidence-tournament** — Evidence gathering, cross-examination, and quality judgment

## Context Management

Each subagent operates in isolated context. The debate-architect designs structure before execution. Transcripts are passed between rounds via structured markdown. Saturation detection terminates when novelty drops below threshold.

## Output

Produces `DebateVerdict` containing: survival assessment, key vulnerabilities, confidence score, debate transcript summary, and recommended mitigations.

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| adversarial-escalation | Strategy: Progressive pressure escalation — starts with surface-level challenges and escalates to fundamental assumption attacks based on defender confidence decay. |
| courtroom-structured | Strategy: Legal adversarial structure — prosecution presents case, defense responds, evidence is cross-examined, judge delivers verdict. Emphasizes evidence quality and procedural rigor. |
| critic-defender-judge | Strategy: Classic triangular debate — Critic attacks, Defender responds, Judge adjudicates. Based on Irving AI Safety via Debate with Toulmin argumentation structure. |
| multi-perspective-panel | Strategy: Multi-stakeholder review panel — diverse expert perspectives evaluate artifact simultaneously, then synthesize through structured deliberation. |
| society-of-mind | Strategy: Multi-agent collaborative debate based on Du et al. Society of Mind. Agents share perspectives iteratively until convergence or divergence is detected. |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| evidence-tournament | Tactic: Evidence gathering, cross-examination, and quality judgment. External evidence is collected, presented, challenged, and scored for relevance and reliability. |
| stress-test-dialectical-escalation | Tactic: Progressive debate escalation based on confidence thresholds. Each round increases attack sophistication until defender collapses or proves resilient. |
| stress-test-perspective-rotation | Tactic: Sequential perspective evaluation with divergence aggregation. Each agent evaluates from a distinct viewpoint, then disagreements are surfaced and resolved. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| debate-transcript-analysis | Extracts key turning points, patterns, and insights from completed debate transcripts. Produces structured summary for verdict synthesis. |
| stress-test-saturation-detection | Determines whether validation has reached saturation — no new weaknesses or failure modes being discovered. Used by all 5 campaigns as termination signal. |
| verdict-synthesis | Synthesizes findings from a completed campaign into typed verdict reports. Produces DebateVerdict, RedTeamReport, FailureAnticipationReport, CounterfactualMap, or AdversarialStressReport depending on campaign. Also supports cross-campaign StressTestSummary. |
| weakness-classification | Classifies discovered weaknesses into severity tiers (fatal/major/minor/cosmetic) with structured justification and exploitability assessment. |

<!-- END available-tables (generated) -->
