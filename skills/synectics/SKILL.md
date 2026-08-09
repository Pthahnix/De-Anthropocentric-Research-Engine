---
name: synectics
description: Synectics Campaign — systematic use of analogy and metaphor for breakthrough
  associations via Gordon's 4 analogy types and excursion method.
execution: campaign
dependencies:
  sops:
  - analogy-chain
  - context-checkpoint
  - context-init
  - creative-ideation-novelty-scoring
  - creative-ideation-saturation-detection
  - direct-analogy-generation
  - domain-scanning
  - excursion-departure
  - fantasy-wish
  - force-fit
  - idea-synthesis
  - personal-identification
  - random-word-stimulus
  - springboard-launch
  - symbolic-compression
  - synectics-synthesis
  tactics:
  - analogy-extraction
  - compressed-conflict
  - evaluation-filtering
  - excursion-orchestration
  strategies:
  - direct-analogy
  - excursion-method
  - fantasy-analogy
  - personal-analogy
  - symbolic-analogy
---

# Synectics

Systematic use of analogy and metaphor for breakthrough associations via Gordon's 4 analogy types and excursion method.

## Strategy Routing

| Strategy | Signal Keywords |
|----------|----------------|
| direct-analogy | analogy, parallel, similar system, nature, biomimicry, structural similarity |
| personal-analogy | empathy, become, identify with, first-person, feel like, embody |
| symbolic-analogy | oxymoron, compressed conflict, poetic image, paradox, essence |
| fantasy-analogy | wish, ideal, magic, ignore constraints, if only, perfect world |
| excursion-method | excursion, departure, unrelated domain, force-fit, full process |

## Manifest

### Strategies

| Strategy | Description |
|----------|-------------|
| direct-analogy | Find structurally similar systems in nature/technology/society |
| personal-analogy | Empathic identification — become the system/component |
| symbolic-analogy | Compress core contradiction into poetic imagery/oxymoron |
| fantasy-analogy | Wish-fulfillment thinking — ignore physical laws for ideal solution |
| excursion-method | Full 8-stage Gordon-Prince excursion process |

### Tactics

| Tactic | Description |
|--------|-------------|
| analogy-extraction | Extract structural analogies from cross-domain sources (shared) |
| excursion-orchestration | Orchestrate departure → force-fit → springboard sequence |
| compressed-conflict | Generate oxymorons from contradictions and extract idea directions |

### SOPs

| SOP | Description |
|-----|-------------|
| direct-analogy-generation | Find direct analogies from nature/tech/society |
| personal-identification | First-person empathic identification with system |
| symbolic-compression | Compress contradiction into 2-3 word oxymoron |
| fantasy-wish | Unconstrained wish-fulfillment ideation |
| excursion-departure | Leave problem, explore unrelated domain |
| force-fit | Force-fit excursion discoveries back to problem |
| analogy-chain | Chain analogies to deeper levels (3-5 layers) |
| springboard-launch | Convert analogy insights into concrete solutions |
| synectics-synthesis | Synthesize all synectics outputs |

## Budget Table

| Strategy | web-search | web-research | paper-overview | paper-search | paper-research |
|----------|-----------|-------------|---------------|-------------|---------------|
| direct-analogy | 25 | 8 | 25 | 15 | 5 |
| personal-analogy | 15 | 5 | 15 | 10 | 3 |
| symbolic-analogy | 15 | 5 | 15 | 10 | 3 |
| fantasy-analogy | 15 | 5 | 15 | 10 | 3 |
| excursion-method | 30 | 10 | 25 | 15 | 8 |

## MCP Tools

| Tool | Server | Purpose |
|------|--------|---------|
| brave_web_search | brave-search | General web search for analogies and examples |
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
| analogy-extraction | Extract structural analogies from cross-domain sources (shared) |
| excursion-orchestration | Orchestrate departure → force-fit → springboard |
| compressed-conflict | Generate oxymorons and extract idea directions |

## Available SOPs

| SOP | Role |
|-----|------|
| direct-analogy-generation | Find direct analogies |
| personal-identification | Empathic identification |
| symbolic-compression | Oxymoron compression |
| fantasy-wish | Wish-fulfillment ideation |
| excursion-departure | Domain departure |
| force-fit | Force-fit back to problem |
| analogy-chain | Deepen analogies in layers |
| springboard-launch | Convert insights to solutions |
| synectics-synthesis | Final synthesis |

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| direct-analogy | Find structurally similar systems in nature/technology/society. Map structural parallels to generate transferable solution principles. |
| excursion-method | Full 8-stage Gordon-Prince excursion process. Deliberate departure from the problem into unrelated domains, then force-fit discoveries back. |
| fantasy-analogy | Wish-fulfillment thinking — ignore physical laws for ideal solution. Use unconstrained imagination to reveal what the problem truly needs. |
| personal-analogy | Empathic identification — become the system/component. First-person embodiment to discover hidden constraints and opportunities. |
| symbolic-analogy | Compress core contradiction into poetic imagery/oxymoron. Use compressed conflicts to reveal hidden solution directions. |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| analogy-extraction | Extract transferable structural principles from source domains. Orchestrates source identification → abstraction → structural mapping → transfer validation. |
| compressed-conflict | Generate compressed conflicts (oxymorons) from problem contradictions and extract concrete idea directions from the symbolic tension. |
| evaluation-filtering | Multi-dimensional evaluation and tiered filtering of generated ideas. Orchestrates novelty assessment → feasibility check → ranking → selection. |
| excursion-orchestration | Orchestrate the excursion sequence — departure into unrelated domain, force-fit discoveries back to problem, launch springboard ideas. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| analogy-chain | Chain analogies to deeper levels (3-5 layers). Each layer reveals new aspects and insights not visible at the surface. |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| creative-ideation-novelty-scoring | Score ideas on novelty dimensions — structural distance from known solutions, conceptual surprise, domain-crossing depth. Produces ranked novelty assessment. |
| creative-ideation-saturation-detection | Determine when additional ideation yields diminishing returns. Analyzes latest idea batch against existing corpus to judge continue/near-saturation/saturated. |
| direct-analogy-generation | Find direct analogies from nature/tech/society that share structural properties with the problem. Produces analogy list with structural mappings. |
| domain-scanning | Scan distant domains for transferable principles. Uses web-search and paper-overview to identify analogous solutions in unrelated fields. |
| excursion-departure | Leave the problem entirely and explore an unrelated domain. Produces excursion domain discoveries for later force-fitting. |
| fantasy-wish | Unconstrained wish-fulfillment ideation. Ignore all physical laws to imagine the ideal solution, then identify realization directions. |
| force-fit | Force-fit excursion discoveries back to the original problem. Deliberately create connections between unrelated findings and the challenge. |
| idea-synthesis | Synthesize diverse ideas into coherent solution concepts. Combines fragments from multiple ideation passes into structured, actionable ideas with clear mechanism descriptions. |
| personal-identification | First-person empathic identification with a system or component. Produces experience description and design insights from embodiment. |
| random-word-stimulus | Use random word/concept injection as creative stimulus. Selects random concepts and forces connection to the problem space, generating unexpected solution paths. |
| springboard-launch | Convert analogy insights into concrete feasible solutions. Transform abstract connections into actionable mechanisms. |
| symbolic-compression | Compress problem contradiction into 2-3 word oxymoron. Produces oxymorons with interpretation directions for each. |
| synectics-synthesis | Synthesize all synectics outputs into a structured idea report. Combines results from all analogy types and excursion processes. |

<!-- END available-tables (generated) -->
