---
name: gap-analysis
description: Gap Analysis Campaign — identify, classify, validate, and prioritize
  research gaps via systematic evidence mapping. 5 strategies (gap-identification,
  gap-classification, gap-validation, gap-prioritization, gap-synthesis), 3 tactics,
  12 subagent SOPs.
execution: campaign
dependencies:
  strategies:
  - deep-insight-gap-identification
  - deep-insight-gap-prioritization
  - gap-classification
  - gap-synthesis-strategy
  - gap-validation
  sops:
  - context-checkpoint
  - context-init
---

# Gap Analysis

Identify, classify, validate, and prioritize research gaps via systematic evidence mapping.

## Design Philosophy

This campaign is a strategy book — CC reads, internalizes, and autonomously constructs an approach. The SKILL.md files are textbooks, not scripts. CC decides execution order, depth, and iteration based on research context.

## Strategy Routing

| Signal | Strategy |
|--------|----------|
| Search for gaps, identify what is missing, concept matrix, keyword extraction | → gap-identification |
| Classify gap types, Miles 7-type, Müller-Bloch 6-type | → gap-classification |
| Verify gap authenticity, cross-database verification, temporal sensitivity, false gaps | → gap-validation |
| Rank priority, AHRQ PiCMe, feasibility, importance | → gap-prioritization |
| Generate report, evidence map, research agenda, concept matrix | → gap-synthesis-strategy |

## Available Tactics

- evidence-mapping — systematic evidence map construction
- cross-validation — multi-source gap authenticity verification
- prioritization-scoring — multi-dimensional gap scoring and ranking

## Available SOPs

**Import (5):** web-search, web-research, paper-overview, paper-search, paper-research

**Subagent (12):** gap-keyword-extraction, concept-matrix-construction, egm-construction, gap-typology-classification, ahrq-reason-classification, cross-database-verification, false-gap-filtering, temporal-sensitivity-testing, multi-criteria-scoring, stakeholder-confirmation, evidence-grading, gap-synthesis

**Shared (2):** evidence-synthesis, multi-stakeholder-simulation

## Context Management

context-checkpoint after each strategy completes. Accumulated state persists across strategies within a campaign run.

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| deep-insight-gap-identification | Identify research gaps via PICOS frameworks, concept matrices, evidence gap maps, keyword extraction, citation analysis, and topic modeling. Systematic discovery of what is missing in the literature. |
| deep-insight-gap-prioritization | Score and rank validated gaps on importance, feasibility, novelty, and urgency. Multi-criteria decision analysis with stakeholder confirmation. |
| gap-classification | Classify identified gaps using Miles 7-type taxonomy and AHRQ 4-reason framework. Determines gap type (theoretical, methodological, empirical, etc.) and root cause of gap existence. |
| gap-synthesis-strategy | Compile all gap analysis products into a coherent final report with evidence gap maps, research agenda, and concept matrices. |
| gap-validation | Validate gap authenticity via cross-database verification, temporal sensitivity testing, and false-gap filtering. Ensures gaps are genuine absences, not search artifacts. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |

<!-- END available-tables (generated) -->
