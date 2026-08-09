---
name: constraint-analysis
description: What limits us — identify bottlenecks, quantify constraints, analyze
  dependencies, resolve conflicts before experiment execution
version: 1.0.0
category: experiment-execution
type: campaign
strategies:
- bottleneck-identification
- resource-constraint
- assumption-constraint
- dependency-constraint
- conflict-resolution
tactics:
- constraint-tree-building
- sensitivity-ranking
- constraint-breaking
dependencies:
  strategies:
  - assumption-constraint
  - conflict-resolution
  - dependency-constraint
  - experiment-execution-bottleneck-identification
  - resource-constraint
  tactics:
  - constraint-breaking
  - constraint-tree-building
  - sensitivity-ranking
  sops:
  - constraint-synthesis
  - context-checkpoint
  - context-init
  - experiment-execution-paper-overview
  - experiment-execution-paper-research
  - experiment-execution-paper-search
  - experiment-execution-quality-gate-check
  - experiment-execution-saturation-detection
  - experiment-execution-web-research
  - experiment-execution-web-search
---

# Campaign 2: Constraint Analysis

## HARD-GATE

Before entering this campaign, the following must be true:

| Gate | Condition |
|------|-----------|
| Research direction exists | North star or research question is crystallized |
| Scope is bounded | Problem space has defined boundaries |
| Resources are enumerable | Can list available compute, data, time, people, budget |
| Stakeholders identified | Know who cares about the outcome |

If any gate fails, return to Campaign 1 (research-direction) or pre-campaign intake.

## Campaign Goal

Produce a comprehensive constraint profile that identifies:
1. The system bottleneck (TOC focusing)
2. Resource gaps (demand vs supply)
3. Fragile assumptions (vulnerability ranked)
4. Dependency chains (critical path)
5. Conflicts between constraints (with resolution injections)

## Strategy Selection

| Situation | Strategy | When to Use |
|-----------|----------|-------------|
| Unknown bottleneck | bottleneck-identification | System performance is limited but cause unclear |
| Resource uncertainty | resource-constraint | Need to verify feasibility of resource plan |
| Assumption risk | assumption-constraint | Key assumptions untested or fragile |
| Sequencing unclear | dependency-constraint | Task ordering and prerequisites unknown |
| Conflicting demands | conflict-resolution | Two or more constraints oppose each other |

Default execution order: bottleneck-identification → resource-constraint → assumption-constraint → dependency-constraint → conflict-resolution

## Budget Gate

| Resource | Budget | Escalation |
|----------|--------|------------|
| Subagent calls | ≤15 per strategy | Pause and report partial |
| Wall-clock time | ≤30 min per strategy | Checkpoint and continue |
| Context tokens | ≤80k per strategy | Summarize and spawn fresh |
| Total campaign | ≤5 strategies | Skip if constraint already resolved |

## Context Management

- Each strategy produces a structured artifact (table/tree/graph)
- Artifacts are passed forward as compressed summaries
- Full details stored in vault pages for later retrieval
- Campaign synthesis merges all strategy outputs

## Minimum Yield

Campaign is complete when:
- At least 1 binding constraint identified and characterized
- Resource feasibility assessed (go/no-go)
- Critical dependency chain mapped
- No unresolved conflicts between top-3 constraints
- Constraint synthesis report produced

## Context Recording

研究过程经 context-management 落盘，与最终报告分属不同文件：

1. **进入本 campaign 时**：import context-init，topic-slug 传 `constraint-analysis`，
   建立本 campaign 的**过程 context 文件**。init 幂等——同 Phase 重入返回原文件。
2. **每个 strategy 完成后**：import context-checkpoint（硬约束，不可跳过），把该
   strategy 的过程与中间产出 append 进上一步的过程文件。
3. 最终报告**不**写进这个过程文件——由本 campaign 的 synthesis SOP（constraint-synthesis）
   另起 `constraint-analysis-report` 文件落盘（见该 SOP）。

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| assumption-constraint | Which assumptions are most fragile? — Vulnerability ranking + impact assessment of experiment assumptions |
| conflict-resolution | How do constraints conflict with each other? — Evaporating Cloud + assumption challenging + injection to resolve constraint conflicts |
| dependency-constraint | What must be completed first? — Dependency chain analysis + prerequisite graph construction |
| experiment-execution-bottleneck-identification | Where is the system bottleneck? — TOC 5 Focusing Steps + Current Reality Tree to find the binding constraint |
| resource-constraint | Are resources sufficient? — Quantify compute, data, time, human, and financial resource constraints |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| constraint-breaking | Orchestrate the full constraint-breaking cycle: extract conflict, challenge assumptions, project resolution |
| constraint-tree-building | Build Current Reality Tree from UDEs through causal chains to core conflicts |
| sensitivity-ranking | Rank constraints by sensitivity — which ones most impact the outcome if they shift |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| constraint-synthesis | Synthesize constraint analysis into actionable report with priorities |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| experiment-execution-paper-overview | Import SOP: paper landscape scan (from literature-engine skill) |
| experiment-execution-paper-research | Import SOP: paper full-text reading (from literature-engine skill) |
| experiment-execution-paper-search | Import SOP: paper AI summary reading (from literature-engine skill) |
| experiment-execution-quality-gate-check | Shared SOP: verify quality gate criteria are met before proceeding |
| experiment-execution-saturation-detection | Shared SOP: detect information saturation — know when to stop searching/analyzing |
| experiment-execution-web-research | Import SOP: deep full-page content analysis (from web-browsing skill) |
| experiment-execution-web-search | Import SOP: quick web scan discovery (from web-browsing skill) |

<!-- END available-tables (generated) -->
