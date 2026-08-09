---
name: ontology-building
description: Campaign for building domain ontologies — systematic concept extraction,
  relation typing, taxonomy construction, and iterative refinement. Produces a structured
  concept hierarchy in the wiki vault.
execution: campaign
dependencies:
  strategies:
  - concept-extraction
  - domain-scoping
  - ontology-refinement
  - relation-typing
  - taxonomy-validation
  tactics:
  - concept-decomposition
  - hierarchy-construction
  - knowledge-compilation
  - knowledge-structuring-consistency-checking
  sops:
  - context-checkpoint
  - context-init
---

# Ontology Building

Build a structured ontology for a research domain. Extracts concepts from sources, types their relationships, constructs taxonomies, validates consistency, and iteratively refines until the ontology is coherent and complete.

## Manifest

| Level | Count | Skills |
|-------|-------|--------|
| Strategy | 5 | domain-scoping, concept-extraction, relation-typing, taxonomy-validation, ontology-refinement |
| Tactic | 3 | concept-decomposition, hierarchy-construction, consistency-checking |
| SOP | 10 | seed-concept-search, source-gathering, concept-page-creation, alias-resolution, edge-batch-creation, hierarchy-visualization, gap-detection, merge-candidates, confidence-update, ontology-export |

## Budget Table

| Metric | Small | Medium | Large |
|--------|-------|--------|-------|
| Source pages ingested | 10 | 25 | 50 |
| Concept pages created | 15 | 40 | 80 |
| Edges created | 30 | 100 | 200 |
| Taxonomy depth (levels) | 2 | 3 | 4 |
| Validation passes | 1 | 2 | 3 |

## Strategy Sequence (Reference, Not Prescription)

1. **domain-scoping** — define boundaries, identify seed concepts, classify topic size
2. **concept-extraction** — mine sources for concepts, create pages, resolve aliases
3. **relation-typing** — identify and type relationships between concepts
4. **taxonomy-validation** — check hierarchy consistency, detect gaps and conflicts
5. **ontology-refinement** — merge near-duplicates, fill gaps, update confidence scores

CC may reorder, skip, or repeat strategies based on the domain's needs.

## MCP Tools Used

- `vault_search` — find existing concepts, detect duplicates
- `vault_add_edge` — create typed relationships
- `vault_query_graph` — explore concept neighborhoods
- `vault_graph_stats` — assess ontology coverage and connectivity
- `vault_lint` — validate structural integrity
- `vault_index` — maintain search index

## Context-Management

<HARD-GATE>
- Call `context-init` at campaign start
- Call `context-checkpoint` after each strategy completes
- Call `knowledge-compilation` (wiki-vault tactic) after each strategy
</HARD-GATE>

## Guiding Principles

- **Breadth before depth.** Map the concept landscape broadly before drilling into any sub-area.
- **Edges over pages.** A concept without relationships is useless. Prioritize connecting over creating.
- **Aliases are enemies.** The same concept with different names fragments the ontology. Resolve aggressively.
- **Confidence is honest.** Mark uncertain classifications explicitly. Low confidence is better than false certainty.
- **The ontology is never finished.** Each research session may reveal new concepts or invalidate old ones.

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| concept-extraction | Strategy for mining concepts from sources — systematic extraction, page creation, alias resolution. |
| domain-scoping | Strategy for defining ontology boundaries — identify seed concepts, classify topic size, establish scope constraints. |
| ontology-refinement | Strategy for iterative ontology improvement — merge duplicates, fill gaps, update confidence, prune dead branches. |
| relation-typing | Strategy for identifying and typing relationships between concepts — create edges with appropriate types and weights. |
| taxonomy-validation | Strategy for validating ontology consistency — check hierarchy, detect cycles, verify completeness. |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| concept-decomposition | Tactic for breaking compound concepts into atomic parts — split over-broad concepts, identify sub-components, create child pages. |
| hierarchy-construction | Tactic for building is-a and part-of hierarchies — establish parent-child relationships, verify transitivity, detect cycles. |
| knowledge-compilation | Tactic for compiling research findings into vault pages — orchestrates page creation, updates, edge linking, and index maintenance. Minimum yield ≥3 page operations per invocation. |
| knowledge-structuring-consistency-checking | Tactic for verifying ontology consistency — detect contradictions, cycles, orphans, and type violations. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |

<!-- END available-tables (generated) -->
