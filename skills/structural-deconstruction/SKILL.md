---
name: structural-deconstruction
description: Decompose systems into components and reassemble via SCAMPER, SIT, TRIZ,
  and recombination. Campaign orchestrating 5 strategies for systematic structural
  transformation.
execution: campaign
dependencies:
  sops:
  - constraint-injection
  - context-checkpoint
  - context-init
  - contradiction-matrix-lookup
  - creative-ideation-assumption-surfacing
  - creative-ideation-novelty-scoring
  - creative-ideation-saturation-detection
  - function-model-construction
  - idea-synthesis
  - parameter-identification
  - recombination-generation
  - scamper-divergence
  - separation-principle
  - structural-synthesis
  - surgery-operation
  - trimming-execution
  - triz-principle-application
  tactics:
  - component-decomposition
  - contradiction-identification
  - creative-ideation-combination-mapping
  - evaluation-filtering
  strategies:
  - component-surgery
  - function-trimming
  - recombination-architecture
  - scamper-transformation
  - triz-contradiction-resolution
---

# Structural Deconstruction

Decompose systems into components and reassemble via SCAMPER, SIT, TRIZ, and recombination.

## Strategy Routing

| Strategy | Signal Keywords |
|----------|----------------|
| scamper-transformation | substitute, combine, adapt, modify, eliminate, reverse, rearrange |
| component-surgery | subtract, multiply, divide, unify, redirect, SIT |
| triz-contradiction-resolution | contradiction, trade-off, conflict, opposing requirements, parameter |
| function-trimming | simplify, remove, trim, reduce complexity, minimize components |
| recombination-architecture | reassemble, recombine, novel structure, new arrangement, merge fragments |

## Manifest

### Strategies

| Strategy | Description |
|----------|-------------|
| scamper-transformation | 7 operators (Substitute/Combine/Adapt/Modify/Put/Eliminate/Reverse) for systematic transformation |
| component-surgery | Component-level surgical operations (subtract/multiply/divide/unify/redirect) from SIT |
| triz-contradiction-resolution | Resolve technical/physical contradictions via 40 principles + separation |
| function-trimming | Remove components while preserving function via TRIZ trimming |
| recombination-architecture | Reassemble decomposed fragments into novel structures |

### Tactics

| Tactic | Description |
|--------|-------------|
| combination-mapping | Systematically enumerate parameter dimensions and generate viable combinations (shared) |
| contradiction-identification | Identify technical and physical contradictions in a system |
| component-decomposition | Decompose system into functional components with trimming candidates |

### SOPs

| SOP | Description |
|-----|-------------|
| scamper-divergence | Execute SCAMPER 7 operators |
| surgery-operation | Component surgery (subtract/multiply/divide/unify/redirect) |
| triz-principle-application | Select principles from contradiction matrix, generate solutions |
| separation-principle | Apply time/space/condition/scale separation |
| function-model-construction | Build substance-field functional model |
| trimming-execution | Progressively remove components, verify function preservation |
| recombination-generation | Reassemble decomposed fragments into new structures |
| structural-synthesis | Synthesize all structural transformation outputs |
| contradiction-matrix-lookup | Query 39x39 TRIZ contradiction matrix |

## Budget Table

| Strategy | web-search | web-research | paper-overview | paper-search | paper-research |
|----------|-----------|-------------|---------------|-------------|---------------|
| scamper-transformation | 20 | 5 | 15 | 10 | 3 |
| component-surgery | 20 | 5 | 15 | 10 | 3 |
| triz-contradiction-resolution | 30 | 10 | 25 | 15 | 5 |
| function-trimming | 25 | 8 | 20 | 12 | 5 |
| recombination-architecture | 20 | 5 | 15 | 10 | 3 |

## MCP Tools

| Tool | Server | Purpose |
|------|--------|---------|
| brave_web_search | brave-search | General web search for methods and examples |
| brave_llm_context | brave-search | Deep content extraction from web pages |
| apify/rag-web-browser | apify | Full page scraping for detailed content |
| get_paper_content | alphaxiv | Read academic paper content |
| discover_papers | alphaxiv | Find relevant research papers |
| relevanceSearch | semantic-scholar | Search academic literature |
| paper | semantic-scholar | Get paper details |
| citations | semantic-scholar | Trace citation networks |

## Context Management

- Each strategy tracks its own budget via State Ledger
- Strategies MUST NOT exceed allocated budget
- Campaign monitors cumulative spend across all strategies
- If a strategy exhausts budget before meeting yield, escalate to campaign level for reallocation
- Prefer paper-overview over paper-research for initial exploration (lower cost)

## Available Tactics

| Tactic | Role |
|--------|------|
| combination-mapping | Enumerate parameter combinations (shared, from combinatorial-creativity) |
| contradiction-identification | Identify contradictions with resolution paths |
| component-decomposition | Decompose into components with trimming candidates |

## Available SOPs

| SOP | Role |
|-----|------|
| scamper-divergence | SCAMPER 7-operator divergence |
| surgery-operation | SIT component surgery |
| triz-principle-application | TRIZ principle selection and application |
| separation-principle | Physical contradiction separation |
| function-model-construction | Substance-field modeling |
| trimming-execution | Progressive component removal |
| recombination-generation | Fragment reassembly |
| structural-synthesis | Final output synthesis |
| contradiction-matrix-lookup | 39x39 matrix query |

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| component-surgery | Component-level surgical operations (subtract/multiply/divide/unify/redirect) from Systematic Inventive Thinking (SIT). |
| function-trimming | Remove components while preserving function via TRIZ trimming methodology. Simplify systems by redistributing functions. |
| recombination-architecture | Reassemble decomposed fragments into novel structures through systematic recombination of components. |
| scamper-transformation | 7 operators (Substitute/Combine/Adapt/Modify/Put/Eliminate/Reverse) for systematic transformation of existing solutions. |
| triz-contradiction-resolution | Resolve technical and physical contradictions via TRIZ 40 inventive principles and separation methods. |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| component-decomposition | Decompose system into functional components, identify dependencies, and surface trimming candidates. |
| contradiction-identification | Identify technical and physical contradictions in a system through functional modeling and matrix analysis. |
| creative-ideation-combination-mapping | Systematically enumerate parameter dimensions and generate viable combinations. Orchestrates parameter extraction → value enumeration → compatibility assessment → synthesis. |
| evaluation-filtering | Multi-dimensional evaluation and tiered filtering of generated ideas. Orchestrates novelty assessment → feasibility check → ranking → selection. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| constraint-injection | Inject artificial constraints to force creative divergence. Generates and applies constraints (resource, time, material, audience, scale) to existing ideas to produce variants. |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| contradiction-matrix-lookup | Query the 39x39 TRIZ contradiction matrix to find recommended inventive principles for a given technical contradiction. |
| creative-ideation-assumption-surfacing | Enumerate implicit assumptions in a problem statement or existing solution. Produces categorized assumption inventory (physical, social, temporal, economic, technical). |
| creative-ideation-novelty-scoring | Score ideas on novelty dimensions — structural distance from known solutions, conceptual surprise, domain-crossing depth. Produces ranked novelty assessment. |
| creative-ideation-saturation-detection | Determine when additional ideation yields diminishing returns. Analyzes latest idea batch against existing corpus to judge continue/near-saturation/saturated. |
| function-model-construction | Build substance-field functional model of a system, annotating useful, harmful, insufficient, and excessive interactions. |
| idea-synthesis | Synthesize diverse ideas into coherent solution concepts. Combines fragments from multiple ideation passes into structured, actionable ideas with clear mechanism descriptions. |
| parameter-identification | Identify the key parameters/dimensions of a problem space. Produces a structured parameter list with value ranges for morphological analysis. |
| recombination-generation | Reassemble decomposed system fragments into novel structural arrangements that create emergent value. |
| scamper-divergence | Execute SCAMPER 7 operators on a target solution. Subagent self-selects best 2-3 operators for deepest exploration. |
| separation-principle | Apply time/space/condition/scale separation to resolve physical contradictions where the same parameter must satisfy opposing requirements. |
| structural-synthesis | Synthesize all structural transformation outputs into a coherent, ranked idea report with lineage tracking. |
| surgery-operation | Execute component surgery operations (subtract/multiply/divide/unify/redirect) from Systematic Inventive Thinking. |
| trimming-execution | Progressively remove components from a system while verifying function preservation through redistribution. |
| triz-principle-application | Select inventive principles from the contradiction matrix and generate concrete solutions for identified contradictions. |

<!-- END available-tables (generated) -->
