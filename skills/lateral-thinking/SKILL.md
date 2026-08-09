---
name: lateral-thinking
description: Lateral Thinking Campaign — escape logical thinking tracks via PO/movement,
  random entry, concept fan, challenge, and six hats (de Bono)
execution: campaign
dependencies:
  sops:
  - alternatives-generation
  - challenge-questioning
  - concept-fan-expansion
  - constraint-injection
  - context-checkpoint
  - context-init
  - creative-ideation-assumption-surfacing
  - creative-ideation-novelty-scoring
  - creative-ideation-saturation-detection
  - escape-technique
  - fractionation
  - green-hat-session
  - idea-synthesis
  - lateral-synthesis
  - movement-operation
  - po-provocation
  - random-word-stimulus
  - stepping-stone
  strategies:
  - challenge-operation
  - concept-fan
  - provocation-and-movement
  - random-entry
  - six-hats-ideation
  tactics:
  - concept-hierarchy
  - creative-ideation-provocation-generation
  - evaluation-filtering
  - movement-extraction
---

# Lateral Thinking

Escape logical thinking tracks via PO/movement, random entry, concept fan, challenge, and six hats (de Bono).

## Strategy Routing

| Strategy | Signal Keywords |
|----------|----------------|
| provocation-and-movement | PO, provocation, movement, escape pattern, lateral jump |
| random-entry | random word, random input, unrelated stimulus, entry point |
| concept-fan | purpose, concept levels, directions, fan out, broaden |
| challenge-operation | why, challenge, question practice, non-threatening |
| six-hats-ideation | green hat, creative hat, six hats, parallel thinking |

## Manifest

### Strategies

| Strategy | Description |
|----------|-------------|
| provocation-and-movement | PO + Movement: generate provocations then extract useful directions (4 movement types) |
| random-entry | Random word/concept as thinking entry point (de Bono Random Entry) |
| concept-fan | Expand from purpose to concepts to directions to ideas (de Bono Concept Fan) |
| challenge-operation | Non-threatening 'Why?' questioning of current practices (de Bono Challenge) |
| six-hats-ideation | Green Hat focused creative thinking within Six Hats framework |

### Tactics

| Tactic | Description |
|--------|-------------|
| provocation-generation | Generate PO provocations using 5 techniques (shared) |
| movement-extraction | Extract constructive directions from provocations via 4 movement types |
| concept-hierarchy | Build concept levels from purpose through concepts to ideas |

### SOPs

| SOP | Description |
|-----|-------------|
| movement-operation | Extract constructive directions from PO provocations (4 movement types) |
| concept-fan-expansion | Expand concept fan from purpose through concepts to ideas |
| challenge-questioning | Non-threatening 'Why?' questioning of current practices |
| escape-technique | Identify dominant thinking pattern and escape it |
| stepping-stone | Use impractical ideas as stepping stones to practical ones |
| green-hat-session | Structured creative thinking in Six Hats Green Hat mode |
| fractionation | Split concepts into smaller units, recombine differently |
| alternatives-generation | Generate alternatives for every known approach |
| lateral-synthesis | Synthesize all lateral thinking outputs |

## Budget Table

| Strategy | web-search | web-research | paper-overview | paper-search | paper-research |
|----------|-----------|-------------|---------------|-------------|---------------|
| provocation-and-movement | 20 | 5 | 20 | 12 | 5 |
| random-entry | 15 | 5 | 15 | 10 | 3 |
| concept-fan | 20 | 8 | 20 | 12 | 5 |
| challenge-operation | 20 | 8 | 20 | 12 | 5 |
| six-hats-ideation | 15 | 5 | 15 | 10 | 3 |

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
| provocation-generation | Generate PO provocations (shared, from combinatorial-creativity) |
| movement-extraction | Extract constructive directions from provocations |
| concept-hierarchy | Build concept levels with ideas per level |

## Available SOPs

| SOP | Role |
|-----|------|
| movement-operation | 4 movement types extraction |
| concept-fan-expansion | Purpose → concepts → directions → ideas |
| challenge-questioning | Non-threatening challenge questioning |
| escape-technique | Dominant pattern escape |
| stepping-stone | Impractical → practical via stepping stones |
| green-hat-session | Pure creative output (judgment suspended) |
| fractionation | Split and recombine concepts |
| alternatives-generation | Generate alternatives per approach |
| lateral-synthesis | Final output synthesis |

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| challenge-operation | Non-threatening 'Why?' questioning of current practices (de Bono Challenge) |
| concept-fan | Expand from purpose to concepts to directions to ideas (de Bono Concept Fan) |
| provocation-and-movement | PO + Movement: generate provocations then extract useful directions (4 movement types) |
| random-entry | Random word/concept as thinking entry point (de Bono Random Entry) |
| six-hats-ideation | Green Hat focused creative thinking within Six Hats framework |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| concept-hierarchy | Build concept levels from purpose through concepts to ideas, with escape and fractionation at each level. |
| creative-ideation-provocation-generation | Generate PO provocations and extract constructive movement. Orchestrates assumption surfacing → provocation creation → movement extraction → idea formation. |
| evaluation-filtering | Multi-dimensional evaluation and tiered filtering of generated ideas. Orchestrates novelty assessment → feasibility check → ranking → selection. |
| movement-extraction | Extract constructive directions from provocations via 4 movement types (moment-to-moment, principle, focus difference, positive aspects). |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| alternatives-generation | Generate alternatives for every known approach — ensure no approach goes unchallenged. |
| challenge-questioning | Non-threatening 'Why?' questioning of current practices to reveal historical accidents vs. genuine constraints. |
| concept-fan-expansion | Expand concept fan from purpose through concepts to directions to ideas (de Bono Concept Fan). |
| constraint-injection | Inject artificial constraints to force creative divergence. Generates and applies constraints (resource, time, material, audience, scale) to existing ideas to produce variants. |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| creative-ideation-assumption-surfacing | Enumerate implicit assumptions in a problem statement or existing solution. Produces categorized assumption inventory (physical, social, temporal, economic, technical). |
| creative-ideation-novelty-scoring | Score ideas on novelty dimensions — structural distance from known solutions, conceptual surprise, domain-crossing depth. Produces ranked novelty assessment. |
| creative-ideation-saturation-detection | Determine when additional ideation yields diminishing returns. Analyzes latest idea batch against existing corpus to judge continue/near-saturation/saturated. |
| escape-technique | Identify dominant thinking pattern and escape it via deliberate pattern-breaking. |
| fractionation | Split concepts into smaller units and recombine them differently to produce novel structures. |
| green-hat-session | Structured creative thinking in Six Hats Green Hat mode — pure creative output with judgment suspended. |
| idea-synthesis | Synthesize diverse ideas into coherent solution concepts. Combines fragments from multiple ideation passes into structured, actionable ideas with clear mechanism descriptions. |
| lateral-synthesis | Synthesize all lateral thinking intermediate outputs into a structured idea report. |
| movement-operation | Extract constructive directions from PO provocations using 4 movement types (moment-to-moment, principle, focus difference, positive aspects). |
| po-provocation | Generate PO (Provocative Operation) statements per de Bono's lateral thinking. Creates deliberately illogical provocations to escape dominant thinking patterns. |
| random-word-stimulus | Use random word/concept injection as creative stimulus. Selects random concepts and forces connection to the problem space, generating unexpected solution paths. |
| stepping-stone | Use impractical ideas as stepping stones to reach practical solutions (de Bono Stepping Stone technique). |

<!-- END available-tables (generated) -->
