---
name: dimensional-analysis
description: Campaign for mapping design spaces — discover dimensions/axes, enumerate
  combinations, identify gaps and novel opportunities. Produces dimensional maps in
  the wiki vault.
execution: campaign
dependencies:
  strategies:
  - dimension-discovery
  - knowledge-structuring-combination-mapping
  - knowledge-structuring-gap-prioritization
  tactics:
  - axis-extraction
  - knowledge-compilation
  - matrix-generation
  sops:
  - context-checkpoint
  - context-init
---

# Dimensional Analysis

Map the design space of a research area by discovering its fundamental dimensions (axes of variation), enumerating meaningful combinations, and identifying unexplored regions that represent novel opportunities.

## Manifest

| Level | Count | Skills |
|-------|-------|--------|
| Strategy | 3 | dimension-discovery, combination-mapping, gap-prioritization |
| Tactic | 2 | axis-extraction, matrix-generation |
| SOP | 6 | dimension-page-creation, axis-validation, combination-enumeration, novelty-scoring, question-generation, matrix-export |

## Budget Table

| Metric | Small | Medium | Large |
|--------|-------|--------|-------|
| Dimensions identified | 3 | 6 | 10 |
| Axes per dimension | 3 | 5 | 8 |
| Combinations explored | 10 | 30 | 60 |
| Novel gaps identified | 3 | 8 | 15 |
| Questions generated | 5 | 12 | 25 |

## Strategy Sequence (Reference, Not Prescription)

1. **dimension-discovery** — identify fundamental axes of variation in the design space
2. **combination-mapping** — enumerate interesting combinations, mark existing work
3. **gap-prioritization** — rank unexplored combinations by novelty and feasibility

## MCP Tools Used

- `vault_search` — find existing coverage of dimension values
- `vault_add_edge` — connect dimensions to concepts
- `vault_query_graph` — explore existing dimension neighborhoods
- `vault_graph_stats` — assess coverage completeness

## Context-Management

<HARD-GATE>
- Call `context-init` at campaign start
- Call `context-checkpoint` after each strategy completes
- Call `knowledge-compilation` after each strategy
</HARD-GATE>

## Guiding Principles

- **Dimensions are independent.** If two axes always co-vary, they're likely one dimension.
- **Completeness over depth.** Map the full space first, then drill into promising regions.
- **Empty cells are opportunities.** An unexplored combination in a well-populated matrix is a research opportunity.
- **Feasibility constrains.** Not all combinations are realizable. Mark impossible combinations explicitly.
- **Cross-domain dimensions.** The most interesting dimensions often come from outside the domain.

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| dimension-discovery | Strategy for identifying fundamental dimensions of variation in a design space. |
| knowledge-structuring-combination-mapping | Strategy for enumerating meaningful combinations across dimensions and marking existing work. |
| knowledge-structuring-gap-prioritization | Strategy for ranking unexplored combinations by novelty, feasibility, and potential impact. |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| axis-extraction | Tactic for systematically extracting axes of variation from literature — identify how practitioners compare approaches. |
| knowledge-compilation | Tactic for compiling research findings into vault pages — orchestrates page creation, updates, edge linking, and index maintenance. Minimum yield ≥3 page operations per invocation. |
| matrix-generation | Tactic for generating and populating combination matrices — cross dimensions to enumerate the design space. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |

<!-- END available-tables (generated) -->
