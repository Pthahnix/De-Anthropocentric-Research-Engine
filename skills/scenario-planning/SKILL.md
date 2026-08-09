---
name: scenario-planning
description: What might the future look like — construct multiple future scenarios,
  assess research approach robustness under different assumptions
version: 1.0.0
category: experiment-execution
type: campaign
strategies:
- morphological-scenario
- narrative-scenario
- stress-scenario
- competitive-scenario
- temporal-scenario
dependencies:
  strategies:
  - competitive-scenario
  - morphological-scenario
  - narrative-scenario
  - stress-scenario
  - temporal-scenario
  sops:
  - context-checkpoint
  - context-init
  - experiment-execution-paper-overview
  - experiment-execution-paper-research
  - experiment-execution-paper-search
  - experiment-execution-quality-gate-check
  - experiment-execution-saturation-detection
  - experiment-execution-web-research
  - experiment-execution-web-search
  - scenario-synthesis
---

# Campaign: Scenario Planning

## HARD-GATE

Before launching this campaign, verify:

1. **Research direction defined** — A clear research approach or hypothesis exists to stress-test
2. **Uncertainty acknowledged** — The team recognizes key unknowns that could invalidate the approach
3. **Time horizon specified** — Short (6mo), medium (2yr), or long (5yr+) planning window declared
4. **Stakeholder buy-in** — Decision-makers agree that scenario analysis will inform strategy

If any gate fails, STOP and resolve before proceeding.

## Campaign Goal

Construct a portfolio of plausible future scenarios spanning the uncertainty space, then assess how robust our research approach is under each scenario. The output is a robustness index plus contingency triggers that tell us when to pivot.

## Strategy Selection

| Strategy | Question | When to Use |
|----------|----------|-------------|
| morphological-scenario | What are all possible combinations? | Systematic enumeration of all factor combinations needed |
| narrative-scenario | What is the story of each future? | Rich qualitative understanding of scenario dynamics needed |
| stress-scenario | What is the worst case? | Risk assessment and failure preparedness needed |
| competitive-scenario | What will competitors do? | Competitive landscape awareness needed |
| temporal-scenario | How does it evolve over time? | Technology evolution and timing decisions needed |

## Budget Gate

| Component | Token Budget | Subagent Calls |
|-----------|-------------|----------------|
| Driver identification | 8K | 1 |
| Parameter enumeration | 10K | 1 |
| Consistency filtering | 15K | 2 |
| Narrative construction | 12K per scenario | 1 per scenario |
| Impact assessment | 10K per scenario | 1 per scenario |
| Robustness scoring | 8K | 1 |
| Synthesis | 12K | 1 |
| **Total (5 scenarios)** | **~130K** | **~15** |

## Context Management

- Each SOP runs as a subagent with isolated context
- Strategy-level orchestrator maintains scenario registry
- Pass scenario IDs (not full content) between steps
- Final synthesis receives summaries, not raw outputs

## Minimum Yield

A successful campaign produces at minimum:
- 3+ internally consistent scenarios spanning the uncertainty space
- Robustness score for the research approach (0-100)
- At least 1 identified pivot trigger with threshold condition
- Contingency action for each scenario where robustness < 50

## Context Recording

研究过程经 context-management 落盘，与最终报告分属不同文件：

1. **进入本 campaign 时**：import context-init，topic-slug 传 `scenario-planning`，
   建立本 campaign 的**过程 context 文件**。init 幂等——同 Phase 重入返回原文件。
2. **每个 strategy 完成后**：import context-checkpoint（硬约束，不可跳过），把该
   strategy 的过程与中间产出 append 进上一步的过程文件。
3. 最终报告**不**写进这个过程文件——由本 campaign 的 synthesis SOP（scenario-synthesis）
   另起 `scenario-planning-report` 文件落盘（见该 SOP）。

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| competitive-scenario | What will competitors do? — Competitive method progress prediction and time window analysis |
| morphological-scenario | What are all possible combinations? — Zwicky Box construction with CCA consistency filtering for systematic scenario enumeration |
| narrative-scenario | What is the story of each future? — Shell method narrative construction for rich qualitative scenario understanding |
| stress-scenario | What is the worst case? — Extreme condition construction and failure mode enumeration for risk preparedness |
| temporal-scenario | How does it evolve over time? — Short/medium/long-term timeline projection with technology maturity curves |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| experiment-execution-paper-overview | Import SOP: paper landscape scan (from literature-engine skill) |
| experiment-execution-paper-research | Import SOP: paper full-text reading (from literature-engine skill) |
| experiment-execution-paper-search | Import SOP: paper AI summary reading (from literature-engine skill) |
| experiment-execution-quality-gate-check | Shared SOP: verify quality gate criteria are met before proceeding |
| experiment-execution-saturation-detection | Shared SOP: detect information saturation — know when to stop searching/analyzing |
| experiment-execution-web-research | Import SOP: deep full-page content analysis (from web-browsing skill) |
| experiment-execution-web-search | Import SOP: quick web scan discovery (from web-browsing skill) |
| scenario-synthesis | Comprehensive scenario analysis report synthesizing all scenario work |

<!-- END available-tables (generated) -->
