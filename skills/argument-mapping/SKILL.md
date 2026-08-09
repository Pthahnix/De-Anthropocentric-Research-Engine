---
name: argument-mapping
description: Campaign for mapping argument structures — extract claims, link evidence,
  assess strength, synthesize positions. Produces argument graphs in the wiki vault.
execution: campaign
dependencies:
  strategies:
  - argument-synthesis
  - claim-extraction
  - evidence-linking-arg
  tactics:
  - knowledge-compilation
  sops:
  - context-checkpoint
  - context-init
---

# Argument Mapping

Map argument structures for research domains. Extracts claims from sources, links supporting and opposing evidence, assesses argument strength, and synthesizes coherent positions from complex debates.

## Manifest

| Level | Count | Skills |
|-------|-------|--------|
| Strategy | 3 | claim-extraction, evidence-linking-arg, argument-synthesis |
| Tactic | 2 | claim-decomposition, strength-assessment |
| SOP | 6 | claim-page-creation, rebuttal-documentation, evidence-attachment, strength-scoring, argument-visualization, synthesis-report |

## Budget Table

| Metric | Small | Medium | Large |
|--------|-------|--------|-------|
| Claims extracted | 10 | 25 | 50 |
| Evidence links created | 15 | 40 | 80 |
| Rebuttals documented | 3 | 10 | 20 |
| Strength scores assigned | 10 | 25 | 50 |
| Synthesis reports | 1 | 3 | 5 |

## Strategy Sequence (Reference, Not Prescription)

1. **claim-extraction** — identify and extract claims from source material
2. **evidence-linking-arg** — link evidence to claims (supporting, contradicting, qualifying)
3. **argument-synthesis** — synthesize positions from the argument graph

## MCP Tools Used

- `vault_search` — find existing claims and evidence
- `vault_add_edge` — create argument edges (supported_by, contradicts, derived_from)
- `vault_query_graph` — trace argument chains
- `vault_graph_stats` — assess argument coverage
- `vault_lint` — validate structural integrity

## Context-Management

<HARD-GATE>
- Call `context-init` at campaign start
- Call `context-checkpoint` after each strategy completes
- Call `knowledge-compilation` after each strategy
</HARD-GATE>

## Guiding Principles

- **Claims are atomic.** Each claim page states exactly one proposition. Compound claims must be decomposed.
- **Evidence is typed.** Every evidence link specifies its relationship: supports, contradicts, qualifies, or is irrelevant.
- **Strength is earned.** A claim's strength comes from the weight and diversity of its evidence, not from authority or repetition.
- **Steel-man first.** Before documenting rebuttals, ensure the strongest version of each claim is represented.
- **Synthesis is not averaging.** The synthesis report identifies which claims survive scrutiny, not a compromise between all positions.

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| argument-synthesis | Strategy for synthesizing argument positions — aggregate evidence, resolve contradictions, produce synthesis reports identifying which claims survive scrutiny. |
| claim-extraction | Strategy for extracting claims from source material — identify propositions, decompose compound claims, classify claim types, create claim pages in the vault. |
| evidence-linking-arg | Strategy for linking evidence to claims — find supporting/contradicting evidence, create typed edges, assess evidence quality, identify gaps in evidential coverage. |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| knowledge-compilation | Tactic for compiling research findings into vault pages — orchestrates page creation, updates, edge linking, and index maintenance. Minimum yield ≥3 page operations per invocation. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |

<!-- END available-tables (generated) -->
