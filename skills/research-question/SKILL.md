---
name: research-question
description: 'Campaign: Refine hypotheses into precise, framed research questions'
version: 1.0.0
category: hypothesis-formation
type: campaign
input: Hypothesis + domain constraints (from hypothesis-formulation or user-provided)
output: Framed research question + scope + success criteria + sub-questions
strategies:
- framework-guided-formulation
- scope-calibration
- decomposition-formulation
- comparative-formulation
- feasibility-constrained-formulation
tactics:
- framework-selection-and-application
- question-refinement-loop
- sub-question-decomposition
dependencies:
  campaigns:
  - hypothesis-formulation
  strategies:
  - comparative-formulation
  - decomposition-formulation
  - feasibility-constrained-formulation
  - framework-guided-formulation
  - scope-calibration
  sops:
  - context-checkpoint
  - context-init
  - hypothesis-formation-quality-gate-check
  - hypothesis-formation-saturation-detection
  - question-synthesis
---

# Research Question Formulation

Refine hypotheses into precise research questions — answering "how do we refine a hypothesis into a precise research question?"

## HARD-GATE

<HARD-GATE>
Preconditions (all must hold before starting):
1. At least 1 clear hypothesis or research direction has been established
2. The research domain and constraints are known
3. The target audience is clear (academic paper? project report?)

Not satisfied → stop, recommend completing hypothesis-formulation or clarifying the research direction first.
</HARD-GATE>

## Campaign Goal

Transform a "testable hypothesis" into a "precise research question" — the question must have a clear scope, measurable success criteria, and decomposable sub-questions. The output is a research question that can directly guide experiment design or literature review.

## Strategy Selection

| Strategy | When to Use | Core action |
|----------|---------|---------|
| framework-guided-formulation | Research type is clear, with a corresponding standard framework | Select framework → fill in |
| scope-calibration | Question is too broad or too narrow | zoom in/out |
| decomposition-formulation | High question complexity, not answerable by a single experiment | Decompose |
| comparative-formulation | A comparison of A vs B is needed | Construct the comparison |
| feasibility-constrained-formulation | The ideal question exceeds available resources | Pragmatic adjustment |

The CC selects autonomously based on hypothesis characteristics and constraints. A common combination: framework-guided → scope-calibration → decomposition.

## Budget Gate

| Tier | Framework assessment | RQ output | FINER check | Sub-questions |
|------|---------|---------|-----------|--------------|
| S | ≥2 framework comparisons | ≥1 precise RQ | All 5 items pass | Optional |
| M | ≥3 framework comparisons | ≥2 precise RQs | All 5 items pass + success criteria | ≥3 sub-questions |
| L | ≥4 framework comparisons | ≥3 precise RQs | All 5 items pass + criteria + answering sequence | ≥5 sub-questions + dependency graph |

## Research Question Structure (standard output format)

Every RQ must contain:
- **Main question**: a one-sentence precise statement
- **Framework**: the framework used and how each component is filled in
- **Scope**: clear boundaries (what is in scope, what is not)
- **Success criteria**: what counts as "having answered the question"
- **Sub-questions**: independently answerable sub-questions (if any)
- **FINER assessment**: Feasible, Interesting, Novel, Ethical, Relevant

## Context Management

- Call context-init at the start of the campaign
- Call context-checkpoint after each strategy completes (hard constraint)
- All outputs accumulate in a single campaign-scoped context file

## Minimum Yield

Each campaign execution must produce:
1. ≥1 fully framed research question (containing all 6 components)
2. All 5 FINER criteria passed
3. Clear success criteria (measurable)
4. Scope statement (in/out of scope)

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| comparative-formulation | Strategy: Construct comparative research questions — systematic comparison of A vs B |
| decomposition-formulation | Strategy: decompose a complex research question into a hierarchy of independently answerable sub-questions |
| feasibility-constrained-formulation | Strategy: reshape a research question under resource constraints — pragmatic adjustment that preserves core value |
| framework-guided-formulation | Strategy: Select an RQ framework (PICO/SPIDER/SPICE/ECLIPSE) and apply it systematically |
| scope-calibration | Strategy: Adjust research question scope — zoom in/out until the scope is appropriate |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| hypothesis-formation-quality-gate-check | Shared SOP: General quality-gate check (format completeness, logical consistency) |
| hypothesis-formation-saturation-detection | Shared SOP: judge whether the current activity has reached information saturation |
| question-synthesis | SOP: synthesize all intermediate products into a final research-question set |

## Available Campaigns

Optional, no fixed order; the final leaf is always a sop.

| Campaign | When to use |
| --- | --- |
| hypothesis-formulation | Campaign: transform insights and gaps into structured testable hypotheses |

<!-- END available-tables (generated) -->
