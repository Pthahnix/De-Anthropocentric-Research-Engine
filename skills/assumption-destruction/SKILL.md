---
name: assumption-destruction
description: Assumption Destruction Campaign — open new solution spaces by negating,
  reversing, and challenging fundamental assumptions.
execution: campaign
dependencies:
  strategies:
  - anti-benchmark
  - axiom-negation
  - reverse-brainstorming
  - sacred-cow-hunting
  - worst-method-inversion
  tactics:
  - creative-ideation-assumption-enumeration
  - creative-ideation-provocation-generation
  - evaluation-filtering
  - inversion-protocol
  sops:
  - context-checkpoint
  - context-init
  - creative-ideation-assumption-surfacing
  - creative-ideation-novelty-scoring
  - creative-ideation-saturation-detection
  - idea-synthesis
  - po-provocation
---

# Assumption Destruction

Open new solution spaces by negating, reversing, and challenging fundamental assumptions.

## Strategy Routing

| Strategy | Signal Keywords |
|----------|----------------|
| axiom-negation | negate, suspend, PO, de Bono, what if not, challenge axiom |
| reverse-brainstorming | worse, reverse, anti-solution, how to fail, sabotage |
| worst-method-inversion | worst possible, terrible solution, invert bad, flip failure |
| anti-benchmark | best practice, industry standard, benchmark, conventional wisdom |
| sacred-cow-hunting | unquestioned, sacred cow, taboo, never challenged, dogma |

## Manifest

### Strategies

| Strategy | Description |
|----------|-------------|
| axiom-negation | Identify and suspend fundamental assumptions via de Bono PO |
| reverse-brainstorming | How to make it worse? → reverse for solutions |
| worst-method-inversion | Design worst possible solution → extract insights → invert |
| anti-benchmark | Challenge industry best practices' hidden assumptions |
| sacred-cow-hunting | Find and challenge domain's unquestioned beliefs |

### Tactics

| Tactic | Description |
|--------|-------------|
| provocation-generation | Generate PO provocations and extract constructive movement (shared) |
| assumption-enumeration | Surface, perturb, and prioritize assumptions by disruption potential |
| inversion-protocol | Reverse statements → extract insights → build constructive alternatives |

### SOPs

| SOP | Description |
|-----|-------------|
| assumption-perturbation | Perturb each assumption, observe system response |
| reversal-generation | Systematically reverse positive statements |
| worst-case-design | Design the worst possible solution |
| inversion-extraction | Extract constructive insights from worst solutions |
| benchmark-challenge | Identify and negate benchmark assumptions |
| sacred-cow-identification | Find domain's unquestioned beliefs |
| constructive-rebellion | Build constructive alternatives from destructive negation |
| destruction-synthesis | Synthesize all assumption destruction outputs |

## Budget Table

| Strategy | web-search | web-research | paper-overview | paper-search | paper-research |
|----------|-----------|-------------|---------------|-------------|---------------|
| axiom-negation | 20 | 5 | 20 | 12 | 5 |
| reverse-brainstorming | 15 | 5 | 15 | 10 | 3 |
| worst-method-inversion | 15 | 5 | 15 | 10 | 3 |
| anti-benchmark | 25 | 10 | 25 | 15 | 5 |
| sacred-cow-hunting | 30 | 10 | 25 | 15 | 8 |

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
| provocation-generation | Generate PO provocations and extract movement (shared) |
| assumption-enumeration | Surface and prioritize assumptions by disruption potential |
| inversion-protocol | Reverse → extract → build constructive alternatives |

## Available SOPs

| SOP | Role |
|-----|------|
| assumption-perturbation | Perturb assumptions and observe system response |
| reversal-generation | Systematically reverse positive statements |
| worst-case-design | Design worst possible solution |
| inversion-extraction | Extract constructive insights from inversions |
| benchmark-challenge | Negate benchmark assumptions |
| sacred-cow-identification | Find unquestioned beliefs |
| constructive-rebellion | Build alternatives from negation |
| destruction-synthesis | Final synthesis of all outputs |

<!-- BEGIN available-tables (generated) -->

## Available Strategies

Optional, no fixed order; the final leaf is always a sop.

| Strategy | When to use |
| --- | --- |
| anti-benchmark | Challenge industry best practices' hidden assumptions. Deconstruct benchmarks to reveal unexamined constraints. |
| axiom-negation | Identify and suspend fundamental assumptions via de Bono PO. Systematically negate axioms to reveal hidden solution spaces. |
| reverse-brainstorming | How to make it worse? → reverse for solutions. Generate anti-solutions then invert to discover novel approaches. |
| sacred-cow-hunting | Find and challenge domain's unquestioned beliefs. Systematic identification and productive violation of dogma. |
| worst-method-inversion | Design worst possible solution → extract insights → invert. Deliberate failure design as creative catalyst. |

## Available Tactics

Optional, no fixed order; the final leaf is always a sop.

| Tactic | When to use |
| --- | --- |
| creative-ideation-assumption-enumeration | Surface, perturb, and prioritize assumptions by disruption potential. Orchestrates assumption surfacing → perturbation → sacred cow identification → prioritization. |
| creative-ideation-provocation-generation | Generate PO provocations and extract constructive movement. Orchestrates assumption surfacing → provocation creation → movement extraction → idea formation. |
| evaluation-filtering | Multi-dimensional evaluation and tiered filtering of generated ideas. Orchestrates novelty assessment → feasibility check → ranking → selection. |
| inversion-protocol | Reverse statements → extract insights → build constructive alternatives. Systematic inversion pipeline from negation to innovation. |

## Available SOPs

Optional, no fixed order; the final leaf is always a sop.

| SOP | When to use |
| --- | --- |
| context-checkpoint | Append research process and results to the current Phase's context file. Covers both process and results with genuine substance. Use this skill at plan-designated checkpoint points — typically after each strategy completes or at key decision nodes within a research Phase. |
| context-init | Create a new context file for a research Phase. Called once at Phase start to initialize the file that subsequent context-checkpoint calls will append to. Use this skill whenever a new research Phase begins and a fresh context file is needed. |
| creative-ideation-assumption-surfacing | Enumerate implicit assumptions in a problem statement or existing solution. Produces categorized assumption inventory (physical, social, temporal, economic, technical). |
| creative-ideation-novelty-scoring | Score ideas on novelty dimensions — structural distance from known solutions, conceptual surprise, domain-crossing depth. Produces ranked novelty assessment. |
| creative-ideation-saturation-detection | Determine when additional ideation yields diminishing returns. Analyzes latest idea batch against existing corpus to judge continue/near-saturation/saturated. |
| idea-synthesis | Synthesize diverse ideas into coherent solution concepts. Combines fragments from multiple ideation passes into structured, actionable ideas with clear mechanism descriptions. |
| po-provocation | Generate PO (Provocative Operation) statements per de Bono's lateral thinking. Creates deliberately illogical provocations to escape dominant thinking patterns. |

<!-- END available-tables (generated) -->
