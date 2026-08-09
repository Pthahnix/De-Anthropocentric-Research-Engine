---
name: biomimicry
description: Biomimicry Campaign — discover transferable solutions from biological
  systems via Design Spiral, BioTRIZ, functional analogy, ecosystem patterns, and
  evolution strategies.
execution: campaign
dependencies:
  tactics:
  - analogy-extraction
  - biological-function-mapping
  - evaluation-filtering
  - life-principles-application
  strategies:
  - biologize-and-discover
  - biotriz-resolution
  - ecosystem-pattern
  - evolution-strategy
  - functional-analogy
  sops:
  - context-checkpoint
  - context-init
  - creative-ideation-novelty-scoring
  - creative-ideation-saturation-detection
  - domain-scanning
  - idea-synthesis
---

# Biomimicry

Discover transferable solutions from biological systems via Design Spiral, BioTRIZ, functional analogy, ecosystem patterns, and evolution strategies.

## Strategy Routing

| Strategy | Signal Keywords |
|----------|----------------|
| biologize-and-discover | biologize, design spiral, nature solves, organism, biomimicry design |
| biotriz-resolution | contradiction, bio-principle, biological TRIZ, trade-off, bio conflict |
| functional-analogy | function, biological function, organism mapping, how nature does X |
| ecosystem-pattern | ecosystem, symbiosis, emergence, resilience, cycles, network |
| evolution-strategy | evolution, selection, mutation, adaptation, radiation, speciation |

## Manifest

### Strategies

| Strategy | Description |
|----------|-------------|
| biologize-and-discover | Biomimicry Design Spiral: Define→Biologize→Discover→Abstract→Emulate |
| biotriz-resolution | BioTRIZ: biological 40 principles + bio contradiction matrix |
| functional-analogy | Map technical functions to biological functions, find organisms |
| ecosystem-pattern | Extract ecosystem-level organization patterns (symbiosis, emergence, resilience) |
| evolution-strategy | Use evolution mechanisms (selection, mutation, radiation) as design operators |

### Tactics

| Tactic | Description |
|--------|-------------|
| analogy-extraction | Extract transferable structural principles from source domains (shared) |
| biological-function-mapping | Map technical functions to biological systems via biologize→discover→model |
| life-principles-application | Apply life's principles as design constraints via ecosystem→evolution→abstraction |

### SOPs

| SOP | Description |
|-----|-------------|
| problem-biologization | Restate technical problem as biological question |
| organism-discovery | Find organisms solving similar problems |
| biological-strategy-extraction | Extract strategy principles from organisms |
| biotriz-principle-selection | Select applicable BioTRIZ principles |
| functional-model-biology | Build biological system functional model |
| abstraction-to-design | Abstract biological principle to design principle |
| emulation-generation | Generate technical solutions emulating biological strategies |
| ecosystem-pattern-extraction | Extract ecosystem-level organization patterns |
| evolution-mechanism-transfer | Map evolution mechanisms to design operations |
| biomimicry-synthesis | Synthesize all biomimicry outputs |

## Budget Table

| Strategy | web-search | web-research | paper-overview | paper-search | paper-research |
|----------|-----------|-------------|---------------|-------------|---------------|
| biologize-and-discover | 30 | 10 | 30 | 20 | 8 |
| biotriz-resolution | 25 | 8 | 25 | 15 | 5 |
| functional-analogy | 30 | 10 | 30 | 20 | 10 |
| ecosystem-pattern | 25 | 10 | 25 | 15 | 5 |
| evolution-strategy | 20 | 8 | 20 | 12 | 5 |

## MCP Tools

| Tool | Server | Purpose |
|------|--------|---------|
| brave_web_search | brave-search | General web search for biological solutions |
| brave_llm_context | brave-search | Deep content extraction from biology sources |
| apify/rag-web-browser | apify | Full page scraping for detailed biological content |
| get_paper_content | alphaxiv | Read academic paper content |
| discover_papers | alphaxiv | Find relevant biomimicry research papers |
| relevanceSearch | semantic-scholar | Search biomimicry literature |
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
| analogy-extraction | Extract transferable structural principles (shared, from cross-domain-discovery) |
| biological-function-mapping | Map technical functions to biological systems |
| life-principles-application | Apply life's principles as design constraints |

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| biologize-and-discover | Biomimicry Design Spiral: Define→Biologize→Discover→Abstract→Emulate. Translate technical challenges into biological questions and find nature's solutions. |
| biotriz-resolution | BioTRIZ: biological 40 principles + bio contradiction matrix. Resolve technical contradictions using biological inventive principles. |
| ecosystem-pattern | Extract ecosystem-level organization patterns (symbiosis, emergence, resilience) as design templates for complex systems. |
| evolution-strategy | Use evolution mechanisms (selection, mutation, radiation) as design operators for generating and refining solution populations. |
| functional-analogy | Map technical functions to biological functions, find organisms solving equivalent problems. Deep functional matching across domains. |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| analogy-extraction | Extract transferable structural principles from source domains. Orchestrates source identification → abstraction → structural mapping → transfer validation. |
| biological-function-mapping | Map technical functions to biological systems. Orchestrates problem-biologization → organism-discovery → functional-model-biology. |
| evaluation-filtering | Multi-dimensional evaluation and tiered filtering of generated ideas. Orchestrates novelty assessment → feasibility check → ranking → selection. |
| life-principles-application | Apply life's principles as design constraints. Orchestrates ecosystem-pattern-extraction → evolution-mechanism-transfer → abstraction-to-design. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| creative-ideation-novelty-scoring | Score ideas on novelty dimensions — structural distance from known solutions, conceptual surprise, domain-crossing depth. Produces ranked novelty assessment. |
| creative-ideation-saturation-detection | Determine when additional ideation yields diminishing returns. Analyzes latest idea batch against existing corpus to judge continue/near-saturation/saturated. |
| domain-scanning | Scan distant domains for transferable principles. Uses web-search and paper-overview to identify analogous solutions in unrelated fields. |
| idea-synthesis | Synthesize diverse ideas into coherent solution concepts. Combines fragments from multiple ideation passes into structured, actionable ideas with clear mechanism descriptions. |

<!-- END available-tables (generated) -->
