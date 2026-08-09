---
name: insight
description: Insight Campaign — deep root-cause analysis of why research gaps persist.
  5 strategies (root-cause-drilling, stakeholder-mapping, tension-mining, question-reformulation,
  assumption-audit), 4 tactics, 13 subagent SOPs.
execution: campaign
dependencies:
  strategies:
  - assumption-audit
  - question-reformulation
  - root-cause-drilling
  - stakeholder-mapping
  - tension-mining
  sops:
  - context-checkpoint
  - context-init
---

# Insight

Understand WHY gaps persist — root causes, stakeholders, tensions, and hidden assumptions.

## Design Philosophy

This campaign is a strategy book — CC reads, internalizes, and autonomously constructs an approach. The SKILL.md files are textbooks, not scripts. CC decides execution order, depth, and iteration based on research context.

## Strategy Routing

| Signal | Strategy |
|--------|----------|
| why it exists, root cause, 5 Whys, fishbone diagram, causal tree | → root-cause-drilling |
| who is affected, stakeholders, JTBD, CSH 12 questions | → stakeholder-mapping |
| opposing forces, tensions, polarities, evaporating cloud | → tension-mining |
| how to frame the problem, HMW, abstraction ladder, Socratic | → question-reformulation |
| hidden assumptions, fragility, premise audit, red team | → assumption-audit |

## Available Tactics

- causal-tree-building — logical causal tree construction
- dialectical-synthesis — thesis-antithesis-synthesis cycle
- boundary-unfolding — expose hidden system boundaries
- assumption-stress-test — systematic assumption stress testing

## Available SOPs

**Import (5):** web-search, web-research, paper-overview, paper-search, paper-research

**Subagent (13):** five-whys-drilling, ishikawa-decomposition, current-reality-tree, csh-12-question, jtbd-mapping, salience-classification, evaporating-cloud, polarity-mapping, abstraction-laddering, hmw-formulation, socratic-probing, abp-vulnerability-classification, clr-validation

**Shared (2):** evidence-synthesis, assumption-surfacing

## Context Management

context-checkpoint after each strategy completes. Accumulated state persists across strategies within a campaign run.

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| assumption-audit | Surface all assumptions, classify by vulnerability (load-bearing × likely-false), validate causal logic. Focus on dangerous assumptions — high load-bearing + non-explicit. |
| question-reformulation | Reframe research questions using abstraction laddering, HMW formulation, and Socratic probing. Find the most productive level and framing for investigation. |
| root-cause-drilling | Drill from surface symptoms to root causes via 5 Whys, Ishikawa decomposition, and Current Reality Trees. Validates each causal link with literature evidence. |
| stakeholder-mapping | Map all affected parties using CSH 12-question framework, identify jobs-to-be-done, classify by salience. Reveals whose perspective is systematically excluded. |
| tension-mining | Identify opposing forces that keep gaps open. Uses evaporating cloud to expose hidden assumptions behind conflicts and polarity mapping for unresolvable tensions. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |

<!-- END available-tables (generated) -->
