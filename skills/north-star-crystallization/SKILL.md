---
name: north-star-crystallization
description: Goal-Driven Requirement Refinement Engine for Research. Crystallize a
  user's fuzzy research intent into a North Star statement and structured ResearchBrief
  through adaptive dialogue and on-demand investigation.
execution: campaign
dependencies:
  strategies:
  - cold-start
  - hot-start
  - warm-start
  sops:
  - context-checkpoint
  - context-init
---

# North Star Crystallization

## Strategy Routing

| Signal | Route to |
|--------|----------|
| No direction at all ("I want to publish but don't know what") | cold-start |
| Has a general direction but not specific ("I'm interested in LLM reasoning") | warm-start |
| Has a specific topic/problem ("I want to improve CoT faithfulness") | hot-start |

## Manifest

### Strategies (3)

| Strategy | Purpose |
|----------|---------|
| cold-start | Full crystallization from zero — actor profiling through synthesis |
| warm-start | Simplified flow for users with a general direction |
| hot-start | Rapid crystallization for users with a specific topic |

### Tactics (6)

| Tactic | Purpose |
|--------|---------|
| actor-profiling | Understand user's background, expertise, resources |
| landscape-reconnaissance | Broad survey of potential research areas |
| direction-narrowing | Focus from broad area to specific problem |
| obstacle-analysis | Identify and assess obstacles to research goals |
| goal-decomposition | Break down research goals into sub-goals |
| north-star-synthesis | Converge into North Star + ResearchBrief |

### SOPs (23)

Dialogue + investigation operations. See individual SOP directories for details.

## Context Management

- Output: North Star Statement + ResearchBrief
- Downstream: knowledge-acquisition campaigns consume the ResearchBrief

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| cold-start | Full crystallization strategy for users who have no research direction at all. Covers actor profiling, landscape reconnaissance, direction narrowing, obstacle analysis, goal decomposition, and north-star synthesis. Use when the user's first message reveals zero specificity about what they want to research. |
| hot-start | Minimal crystallization strategy for users who already have a specific research topic or problem (e.g., "I want to improve CoT faithfulness in LLMs") and need structuring into a formal North Star. Heavily simplifies or skips exploration tactics, focusing on obstacle analysis, goal decomposition, and synthesis. Use when the user's first message reveals a specific, actionable research direction. |
| warm-start | Simplified crystallization strategy for users who have a general research direction (e.g., "I'm interested in LLM reasoning") but lack specificity. Simplifies actor profiling and landscape reconnaissance, then proceeds through direction narrowing, obstacle analysis, goal decomposition, and north-star synthesis. Use when the user's first message reveals a general area but not a specific problem. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |

<!-- END available-tables (generated) -->
