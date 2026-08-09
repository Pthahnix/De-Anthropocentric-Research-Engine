---
name: experiment-design
description: Transform validated hypotheses into rigorous, executable experiment designs
version: 1.0.0
category: experiment-execution
type: campaign
strategies:
- factor-level-design
- ablation-design
- comparison-design
- scaling-design
- robustness-design
tactics:
- statistical-method-selection
- reproducibility-protocol
- budget-constrained-design
dependencies:
  strategies:
  - ablation-design
  - comparison-design
  - experiment-execution-factor-level-design
  - robustness-design
  - scaling-design
  tactics:
  - budget-constrained-design
  - reproducibility-protocol
  - statistical-method-selection
  sops:
  - context-checkpoint
  - context-init
  - design-synthesis
  - experiment-execution-paper-overview
  - experiment-execution-paper-research
  - experiment-execution-paper-search
  - experiment-execution-quality-gate-check
  - experiment-execution-saturation-detection
  - experiment-execution-web-research
  - experiment-execution-web-search
---

# Campaign: Experiment Design

**Positioning**: What experiment to run — transform a validated hypothesis into a rigorous experiment design that maximizes information yield per compute dollar.

## HARD-GATE

Before entering this campaign, the following must be satisfied:

| Gate | Requirement |
|------|-------------|
| Hypothesis | A falsifiable hypothesis with clearly stated IV/DV exists |
| Scope | Research question is bounded (not open-ended exploration) |
| Resources | Preliminary compute/time budget is stated |
| Prior Work | Relevant baselines and datasets have been identified |

If any gate fails, route back to hypothesis-generation or research-question refinement.

## Campaign Goal

Produce a complete experiment design document that specifies:
1. What factors to vary and at what levels
2. What to measure and how to determine significance
3. What baselines to compare against
4. How to ensure reproducibility
5. An executable configuration ready for implementation

## Strategy Selection

| Signal in Hypothesis | Strategy | When to Use |
|---------------------|----------|-------------|
| "Factor X affects Y" | factor-level-design | Testing effects of specific variables |
| "Component C contributes to performance" | ablation-design | Understanding component contributions |
| "Method M outperforms baseline B" | comparison-design | Claiming superiority over existing work |
| "Performance scales with resource R" | scaling-design | Understanding scaling behavior |
| "Method works under condition C" | robustness-design | Testing failure boundaries |

Multiple strategies may be composed for complex hypotheses.

## Budget Gate

| Tier | GPU-hours | Max Factors | Max Runs | Strategy Constraint |
|------|-----------|-------------|----------|-------------------|
| Micro | < 10 | 3 | 20 | Fractional factorial or single ablation |
| Small | 10-100 | 5 | 50 | Full factorial on key factors |
| Medium | 100-1000 | 8 | 200 | Multi-strategy composition |
| Large | > 1000 | Unlimited | Unlimited | Full design space exploration |

## Context Management

- Each SOP runs as a subagent to preserve main-thread context
- Strategy orchestrators pass structured JSON between SOPs
- Final design-synthesis SOP compiles all outputs into a single document
- Intermediate artifacts are stored as structured data, not prose

## Minimum Yield

Every campaign invocation must produce at minimum:
- A design matrix (even if single-factor)
- Metric specification with significance threshold
- Seed protocol
- Estimated total compute cost

## Context Recording

研究过程经 context-management 落盘，与最终报告分属不同文件：

1. **进入本 campaign 时**：import context-init，topic-slug 传 `experiment-design`，
   建立本 campaign 的**过程 context 文件**。init 幂等——同 Phase 重入返回原文件。
2. **每个 strategy 完成后**：import context-checkpoint（硬约束，不可跳过），把该
   strategy 的过程与中间产出 append 进上一步的过程文件。
3. 最终报告**不**写进这个过程文件——由本 campaign 的 synthesis SOP（design-synthesis）
   另起 `experiment-design-report` 文件落盘（见该 SOP）。

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| ablation-design | Design ablation studies to isolate component contributions in ML systems |
| comparison-design | Design fair comparison experiments against baselines and competing methods |
| experiment-execution-factor-level-design | Design factorial experiments to test how specific factors affect outcomes |
| robustness-design | Design experiments to identify failure boundaries and robustness limits |
| scaling-design | Design scaling experiments to characterize performance-resource relationships |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| budget-constrained-design | Optimize experiment design under compute and time budget constraints |
| reproducibility-protocol | Ensure experiment reproducibility through systematic environment and seed control |
| statistical-method-selection | Select appropriate statistical methods for experiment analysis |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| design-synthesis | SOP: synthesize complete experiment design report |
| experiment-execution-paper-overview | Import SOP: paper landscape scan (from literature-engine skill) |
| experiment-execution-paper-research | Import SOP: paper full-text reading (from literature-engine skill) |
| experiment-execution-paper-search | Import SOP: paper AI summary reading (from literature-engine skill) |
| experiment-execution-quality-gate-check | Shared SOP: verify quality gate criteria are met before proceeding |
| experiment-execution-saturation-detection | Shared SOP: detect information saturation — know when to stop searching/analyzing |
| experiment-execution-web-research | Import SOP: deep full-page content analysis (from web-browsing skill) |
| experiment-execution-web-search | Import SOP: quick web scan discovery (from web-browsing skill) |

<!-- END available-tables (generated) -->
