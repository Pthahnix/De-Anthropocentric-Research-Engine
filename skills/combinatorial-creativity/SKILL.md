---
name: combinatorial-creativity
description: Combinatorial Creativity Campaign — produce emergent concepts via concept
  blending, multi-level bisociation, and function combination (Fauconnier-Turner)
execution: campaign
dependencies:
  sops:
  - abstraction-ladder
  - blend-completion
  - blend-composition
  - blend-elaboration
  - combinatorial-synthesis
  - context-checkpoint
  - context-init
  - creative-ideation-novelty-scoring
  - creative-ideation-saturation-detection
  - domain-scanning
  - emergent-property-identification
  - function-redistribution
  - generic-space-extraction
  - idea-synthesis
  - input-space-construction
  - parameter-identification
  - vital-relation-mapping
  tactics:
  - blend-construction
  - creative-ideation-combination-mapping
  - emergence-detection
  - evaluation-filtering
  strategies:
  - concept-blending
  - design-space-exploration
  - emergent-property-hunting
  - function-combination
  - multi-level-bisociation
---

# Combinatorial Creativity

Produce emergent concepts via concept blending, multi-level bisociation, and function combination (Fauconnier-Turner).

## Strategy Routing

| Strategy | Signal Keywords |
|----------|----------------|
| concept-blending | blend, Fauconnier, Turner, 4-space, input space, generic space, blended space |
| multi-level-bisociation | bisociation, abstraction levels, multi-level, collision, Koestler |
| design-space-exploration | parametric, constraint satisfaction, combinatorial search, design space |
| function-combination | TRIZ, function, recombination, redistribution, function model |
| emergent-property-hunting | emergence, non-additive, synergy, novel property, combination effect |

## Manifest

### Strategies

| Strategy | Description |
|----------|-------------|
| concept-blending | Fauconnier-Turner 4-space model: Generic + Input1 + Input2 → Blended Space |
| multi-level-bisociation | Simultaneous concept collision at multiple abstraction levels |
| design-space-exploration | Parametric variation + constraint satisfaction combinatorial search |
| function-combination | TRIZ function analysis: function-level recombination and redistribution |
| emergent-property-hunting | Seek properties that emerge from combination (non-additive) |

### Tactics

| Tactic | Description |
|--------|-------------|
| combination-mapping | Systematically enumerate parameter dimensions and generate viable combinations (shared) |
| blend-construction | Construct complete 4-space blends with emergent structure |
| emergence-detection | Detect and validate emergent properties from combinations |

### SOPs

| SOP | Description |
|-----|-------------|
| input-space-construction | Build input spaces for two source concepts |
| generic-space-extraction | Extract shared abstract structure from two input spaces |
| blend-composition | Compose new connections in blended space |
| blend-completion | Complete blend with background knowledge |
| blend-elaboration | Run blend as mental simulation |
| vital-relation-mapping | Map 15 vital relations between concepts |
| abstraction-ladder | Perform bisociation at multiple abstraction levels |
| function-redistribution | Redistribute functions across different components |
| emergent-property-identification | Identify non-additive properties from combinations |
| combinatorial-synthesis | Synthesize all combinatorial creativity outputs |

## Budget Table

| Strategy | web-search | web-research | paper-overview | paper-search | paper-research |
|----------|-----------|-------------|---------------|-------------|---------------|
| concept-blending | 25 | 10 | 30 | 20 | 10 |
| multi-level-bisociation | 25 | 10 | 25 | 15 | 8 |
| design-space-exploration | 20 | 8 | 20 | 12 | 5 |
| function-combination | 20 | 8 | 20 | 12 | 5 |
| emergent-property-hunting | 25 | 10 | 25 | 15 | 8 |

## MCP Tools

| Tool | Server | Purpose |
|------|--------|---------|
| brave_web_search | brave-search | General web search for combinatorial concepts |
| brave_llm_context | brave-search | Deep content extraction from web pages |
| apify/rag-web-browser | apify | Full page scraping for detailed content |
| get_paper_content | alphaxiv | Read academic paper content |
| discover_papers | alphaxiv | Find research papers on blending/combination |
| relevanceSearch | semantic-scholar | Search academic literature |
| paper | semantic-scholar | Get paper details |
| citations | semantic-scholar | Trace citation networks |

## Context Management

- Each strategy tracks its own budget via State Ledger
- Strategies MUST NOT exceed allocated budget
- Campaign monitors cumulative spend across all strategies
- If a strategy exhausts budget before meeting yield, escalate to campaign level for reallocation
- Prefer paper-overview over paper-research for initial exploration (lower cost)
- Emergent properties are the primary campaign-level quality metric

## Available Tactics

| Tactic | Role |
|--------|------|
| combination-mapping | Systematically enumerate parameter dimensions and generate viable combinations (shared) |
| blend-construction | Construct complete 4-space blends with emergent structure |
| emergence-detection | Detect and validate emergent properties from combinations |

## Available SOPs

| SOP | Role |
|-----|------|
| input-space-construction | Build input spaces for two source concepts |
| generic-space-extraction | Extract shared abstract structure from two input spaces |
| blend-composition | Compose new connections in blended space |
| blend-completion | Complete blend with background knowledge |
| blend-elaboration | Run blend as mental simulation |
| vital-relation-mapping | Map 15 vital relations between concepts |
| abstraction-ladder | Perform bisociation at multiple abstraction levels |
| function-redistribution | Redistribute functions across different components |
| emergent-property-identification | Identify non-additive properties from combinations |
| combinatorial-synthesis | Synthesize all combinatorial creativity outputs |

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| concept-blending | Fauconnier-Turner 4-space model: Generic + Input1 + Input2 → Blended Space |
| design-space-exploration | Parametric variation + constraint satisfaction combinatorial search |
| emergent-property-hunting | Seek properties that emerge from combination (non-additive) |
| function-combination | TRIZ function analysis: function-level recombination and redistribution |
| multi-level-bisociation | Simultaneous concept collision at multiple abstraction levels |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| blend-construction | Construct complete 4-space blends with emergent structure. Orchestrates input-space-construction → generic-space-extraction → blend-composition. |
| creative-ideation-combination-mapping | Systematically enumerate parameter dimensions and generate viable combinations. Orchestrates parameter extraction → value enumeration → compatibility assessment → synthesis. |
| emergence-detection | Detect and validate emergent properties from combinations. Orchestrates emergent-property-identification → blend-elaboration. |
| evaluation-filtering | Multi-dimensional evaluation and tiered filtering of generated ideas. Orchestrates novelty assessment → feasibility check → ranking → selection. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| abstraction-ladder | Perform bisociation at multiple abstraction levels |
| blend-completion | Complete blend with background knowledge |
| blend-composition | Compose new connections in blended space |
| blend-elaboration | Run blend as mental simulation |
| combinatorial-synthesis | Synthesize all combinatorial creativity outputs |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| creative-ideation-novelty-scoring | Score ideas on novelty dimensions — structural distance from known solutions, conceptual surprise, domain-crossing depth. Produces ranked novelty assessment. |
| creative-ideation-saturation-detection | Determine when additional ideation yields diminishing returns. Analyzes latest idea batch against existing corpus to judge continue/near-saturation/saturated. |
| domain-scanning | Scan distant domains for transferable principles. Uses web-search and paper-overview to identify analogous solutions in unrelated fields. |
| emergent-property-identification | Identify non-additive properties from combinations |
| function-redistribution | Redistribute functions across different components |
| generic-space-extraction | Extract shared abstract structure from two input spaces |
| idea-synthesis | Synthesize diverse ideas into coherent solution concepts. Combines fragments from multiple ideation passes into structured, actionable ideas with clear mechanism descriptions. |
| input-space-construction | Build input spaces for two source concepts |
| parameter-identification | Identify the key parameters/dimensions of a problem space. Produces a structured parameter list with value ranges for morphological analysis. |
| vital-relation-mapping | Map 15 vital relations between concepts |

<!-- END available-tables (generated) -->
